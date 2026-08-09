import { expect, test } from '@playwright/test';

test('caps canvas resolution and does not preload the soundtrack', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  const resolution = await canvas.evaluate((element: HTMLCanvasElement) => ({
    cssWidth: element.getBoundingClientRect().width,
    pixels: element.width,
  }));

  expect(resolution.pixels / resolution.cssWidth).toBeLessThanOrEqual(1.31);
  expect(requests.some((url) => url.endsWith('/audio/space-music.mp3'))).toBe(false);
});

test('keeps local paint and layout metrics inside the performance baseline', async ({ page }) => {
  await page.addInitScript(() => {
    const metrics = { cls: 0, lcp: 0 };
    Object.assign(window, { __portfolioMetrics: metrics });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!shift.hadRecentInput) metrics.cls += shift.value ?? 0;
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      metrics.lcp = entries[entries.length - 1]?.startTime ?? metrics.lcp;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await page.waitForTimeout(1_000);

  const metrics = await page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
    const observed = (
      window as typeof window & { __portfolioMetrics: { cls: number; lcp: number } }
    ).__portfolioMetrics;
    return { ...observed, fcp };
  });

  expect(metrics.fcp).toBeGreaterThan(0);
  expect(metrics.fcp).toBeLessThan(2_500);
  expect(metrics.lcp).toBeLessThan(4_000);
  expect(metrics.cls).toBeLessThan(0.1);
});
