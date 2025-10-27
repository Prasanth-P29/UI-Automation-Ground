import { test, expect } from '@playwright/test';

test('Client delay text appears', async ({ page }) => {
  await page.goto('/clientdelay');
  await page.click('#ajaxButton');
  await page.waitForSelector('.bg-success');
  await expect(page.locator('.bg-success')).toContainText('Data calculated on the client side.');
});
