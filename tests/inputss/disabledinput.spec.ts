import { test, expect } from '@playwright/test';

test.describe('Disabled Input Tests', () => {
  test('Wait until input becomes enabled', async ({ page }) => {
    await page.goto('/disabledinput');
    const input = page.locator('#inputField');

    // It starts enabled — only wait until enabled for simplicity
    await expect(input).toBeEnabled({ timeout: 20000 });

    await input.fill('Playwright Test');
    await expect(input).toHaveValue('Playwright Test');
  });
});
