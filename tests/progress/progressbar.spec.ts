import { test, expect } from '@playwright/test';

test('Progress bar reaches near 100%', async ({ page }) => {
  // ✅ Navigate to Progress Bar page
  await page.goto('/progressbar');

  // ✅ Start the progress
  const startButton = page.locator('#startButton');
  await expect(startButton).toBeVisible({ timeout: 10000 });
  await startButton.click();
  console.log('▶ Progress started');

  // ✅ Wait until progress reaches at least 90%
  const bar = page.locator('#progressBar');
  await page.waitForFunction(() => {
    const bar = document.querySelector('#progressBar') as HTMLElement;
    if (!bar) return false;
    const val = Number(bar.getAttribute('aria-valuenow'));
    return val >= 90;
  }, { timeout: 20000 });

  console.log('💪 Progress reached >= 90%');

  // ✅ Click Stop button to finalize
  await page.click('#stopButton');
  console.log('🛑 Stop button clicked');

  // ✅ Read the final value
  const finalValue = await bar.getAttribute('aria-valuenow');
  console.log(`🎯 Final progress value: ${finalValue}`);

  // ✅ Assert it’s between 90–100%
  expect(Number(finalValue)).toBeGreaterThanOrEqual(90);
  expect(Number(finalValue)).toBeLessThanOrEqual(100);
});
