import { test, expect } from '@playwright/test';

test('Load delay waits for button', async ({ page }) => {
  await page.goto('/loaddelay');
  const button = page.locator('.btn-primary');
  await button.waitFor({ state: 'visible' });
  await expect(button).toBeVisible();
});
