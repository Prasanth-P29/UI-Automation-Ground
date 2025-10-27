import { test, expect } from '@playwright/test';

test('Progress bar reaches near 100%', async ({ page }) => {
  await page.goto('/progressbar');

  const startBtn = page.locator('#startButton');
  const stopBtn = page.locator('#stopButton');
  const progressBar = page.locator('#progressBar');

  await startBtn.click();

  // Wait for bar to reach >= 90%
  await page.waitForFunction(() => {
    const bar = document.querySelector('#progressBar') as HTMLElement;
    const val = Number(bar?.getAttribute('aria-valuenow'));
    return val >= 90;
  }, { timeout: 30000 });

  await stopBtn.click();

  const value = await progressBar.getAttribute('aria-valuenow');
  console.log(`Progress reached: ${value}`);
  expect(Number(value)).toBeGreaterThanOrEqual(90);
});
