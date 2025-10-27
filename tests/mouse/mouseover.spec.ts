import { test, expect } from '@playwright/test';

test.describe('Mouse Over Tests', () => {
  test('Perform mouse over actions', async ({ page }) => {
    await page.goto('/mouseover');

    const link = page.locator('a:has-text("Click me")');
    await link.scrollIntoViewIfNeeded();
    await link.hover();
    await link.hover(); // triggers JS twice

    // Must click to increase count
    await link.click();
    await expect(page.locator('#clickCount')).toHaveText('1');
  });
});
