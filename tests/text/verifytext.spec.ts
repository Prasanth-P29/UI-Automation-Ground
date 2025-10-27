import { test, expect } from '@playwright/test';

test('Verify hidden text on page', async ({ page }) => {
  await page.goto('/verifytext');

  // Use locator with class selector or nth() index
  const targetSpan = page.locator('span.badge-secondary').nth(0);
  await expect(targetSpan).toBeVisible();
});
