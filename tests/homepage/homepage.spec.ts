import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/UI Test Automation Playground/);

  const mainHeading = page.locator('h1#title');
  await expect(mainHeading).toHaveText(/UI Test Automation\s*Playground/);
});
