import { test, expect } from '@playwright/test';

test('Text input updates button label', async ({ page }) => {
  await page.goto('/textinput');
  await page.fill('#newButtonName', 'Playwright Test');
  await page.click('#updatingButton');
  await expect(page.locator('#updatingButton')).toHaveText('Playwright Test');
});
