import { test } from '@playwright/test';

test('Class attribute button alert check', async ({ page }) => {
  await page.goto('/classattr');
  page.once('dialog', dialog => dialog.accept());
  await page.locator('.btn-primary').click();
});
