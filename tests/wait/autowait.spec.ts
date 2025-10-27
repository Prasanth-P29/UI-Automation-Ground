import { test, expect } from '@playwright/test';

test('Auto Wait functionality test', async ({ page }) => {
  await page.goto('/ajax');

  const startButton = page.locator('#ajaxButton');
  await expect(startButton).toBeVisible({ timeout: 15000 });

  await startButton.click();

  // Wait for green box
  const successMsg = page.locator('.bg-success');
  await expect(successMsg).toBeVisible({ timeout: 30000 });
  await expect(successMsg).toHaveText(/Data loaded with AJAX get request/i);
});
