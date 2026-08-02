import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
});

test('opens a shareable section and restores it with browser history', async ({ page }) => {
  await page
    .getByRole('navigation')
    .getByRole('button', { name: /projects|projetos/i })
    .click();

  await expect(page).toHaveURL(/#projects$/);
  await expect(page.getByRole('dialog', { name: /projects|projetos/i })).toBeVisible();

  await page.goBack();
  await expect(page).not.toHaveURL(/#projects$/);
  await expect(page.getByRole('dialog', { name: /projects|projetos/i })).toBeHidden();
});

test('switches directly between open sections with one click', async ({ page }) => {
  const navigation = page.getByRole('navigation');

  await navigation.getByRole('button', { name: /about|sobre/i }).click();
  await expect(page.getByRole('dialog', { name: /about|sobre/i })).toBeVisible();

  await navigation.getByRole('button', { name: /skills|habilidades/i }).click();

  await expect(page.getByRole('dialog', { name: /skills|habilidades/i })).toBeVisible();
  await expect(page).toHaveURL(/#skills$/);
});

test('loads a deep link and exposes every section without relying on the canvas', async ({
  page,
}) => {
  await page.goto('/#experience');
  await expect(page.getByRole('dialog', { name: /experience|experiência/i })).toBeVisible();

  const sectionButtons = page.getByRole('navigation').getByRole('button');
  await expect(sectionButtons).toHaveCount(6);
});

test('has no broken remote portfolio images or console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page
    .getByRole('navigation')
    .getByRole('button', { name: /projects|projetos/i })
    .click();
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

  const firstNavigationButton = page.getByRole('navigation').getByRole('button').first();
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
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('button')).toHaveCount(6);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/custom-cursor-active/);
  await expect(page.locator('body')).toHaveClass(/graphics-2d-mode/);
  await expect(page.getByRole('navigation').getByRole('button').first()).toHaveCSS(
    'cursor',
    'auto'
  );
});
