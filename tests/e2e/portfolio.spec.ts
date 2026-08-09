import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes('falls back to complete 2D navigation')) return;

  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
});

test('opens a shareable section and restores it with browser history', async ({ page }) => {
  const compactHud = (page.viewportSize()?.width ?? 0) < 768;
  const section = compactHud ? /about|sobre/i : /projects|projetos/i;
  const hash = compactHud ? /#about$/ : /#projects$/;

  await page.getByRole('button', { name: section }).last().click();

  await expect(page).toHaveURL(hash);
  await expect(page.getByRole('dialog', { name: section })).toBeVisible();

  await page.goBack();
  await expect(page).not.toHaveURL(hash);
  await expect(page.getByRole('dialog', { name: section })).toBeHidden();
});

test('switches directly between open sections with one click', async ({ page }) => {
  const compactHud = (page.viewportSize()?.width ?? 0) < 768;
  const targetSection = /skills|habilidades/i;

  await page
    .getByRole('button', { name: /about|sobre/i })
    .last()
    .click();
  const aboutDialog = page.getByRole('dialog', { name: /about|sobre/i });
  await expect(aboutDialog).toBeVisible();

  if (compactHud) {
    await aboutDialog.getByRole('button', { name: targetSection }).click();
  } else {
    await page.getByRole('navigation').getByRole('button', { name: targetSection }).click();
  }

  await expect(page.getByRole('dialog', { name: targetSection })).toBeVisible();
  await expect(page).toHaveURL(/#skills$/);
});

test('loads a deep link and exposes every section without relying on the canvas', async ({
  page,
}) => {
  await page.goto('/#experience');
  await expect(page.getByRole('dialog', { name: /experience|experiência/i })).toBeVisible();

  if ((page.viewportSize()?.width ?? 0) < 768) {
    const panelNavigation = page
      .getByRole('dialog', { name: /experience|experiência/i })
      .getByRole('button', {
        name: /previous panel|next panel|painel anterior|próximo painel/i,
      });
    await expect(panelNavigation).toHaveCount(2);
  } else {
    const sectionButtons = page.getByRole('navigation').getByRole('button');
    await expect(sectionButtons).toHaveCount(6);
  }
});

test('has no broken remote portfolio images or console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  if ((page.viewportSize()?.width ?? 0) < 768) {
    await page.goto('/#projects');
  } else {
    await page
      .getByRole('navigation')
      .getByRole('button', { name: /projects|projetos/i })
      .click();
  }
  await expect(page.getByRole('dialog', { name: /projects|projetos/i })).toBeVisible();
  await page.waitForTimeout(500);

  expect(errors).toEqual([]);
  await expect(page.locator('img[src*="imgur"]')).toHaveCount(0);
});

test('keeps the native cursor visible when the custom cursor is disabled', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('space-portfolio:experience:v1', JSON.stringify({ customCursor: false }));
  });
  await page.reload();

  const firstNavigationButton = page
    .getByRole('banner')
    .getByRole('button', { name: /about|sobre/i });
  await expect(firstNavigationButton).toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/custom-cursor-active/);
  await expect(firstNavigationButton).toHaveCSS('cursor', 'auto');

  await firstNavigationButton.hover();
  await expect(firstNavigationButton).toHaveCSS('cursor', 'auto');
});

test('falls back to complete 2D navigation when WebGL is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });

  await page.goto('/');
  await expect(page.getByText(/webgl unavailable|webgl indisponível/i)).toBeVisible();

  await page.getByRole('button', { name: /continue without 3d|continuar sem 3d/i }).click();
  const fallback = page.getByTestId('scene-2d-fallback');
  await expect(fallback).toBeVisible();
  await expect(fallback.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(fallback.getByRole('main').getByRole('button')).toHaveCount(8);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/custom-cursor-active/);
  await expect(page.locator('body')).toHaveClass(/graphics-2d-mode/);
  await expect(fallback.getByRole('button').first()).toHaveCSS('cursor', 'auto');

  await fallback
    .getByRole('button', { name: /projects|projetos/i })
    .last()
    .click();

  const dialog = page.getByRole('dialog', { name: /projects|projetos/i });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('data-graphics-mode', '2d');
  await expect(dialog.locator('.panel-drawer')).toHaveCSS('backdrop-filter', 'none');
  await expect(fallback).toHaveCSS('filter', 'blur(5px)');
  await expect(page.locator('canvas')).toHaveCount(0);
});
