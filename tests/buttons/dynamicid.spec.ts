import { test, expect } from '@playwright/test';

test('Dynamic ID button is clickable', async ({ page }) => {
  await page.goto('/dynamicid');
  const button = page.locator('button.btn-primary');
  await expect(button).toBeVisible();
  await button.click();
});
