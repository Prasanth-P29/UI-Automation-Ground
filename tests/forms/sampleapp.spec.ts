import { test, expect } from '@playwright/test';

test('Sample App login works', async ({ page }) => {
  await page.goto('/sampleapp');
  await page.fill('input[name="UserName"]', 'Prasanth');
  await page.fill('input[name="Password"]', 'pwd');
  await page.click('#login');
  await expect(page.locator('#loginstatus')).toContainText('Welcome, Prasanth!');
});
