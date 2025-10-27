import { test, expect } from '@playwright/test';

test('Scrollbars page test', async ({ page }) => {
  await page.goto('/scrollbars');
  const button = page.locator('#hidingButton');
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
  await button.click();
});
