import { test, expect } from '@playwright/test';

test.describe('Overlapped Element Tests', () => {
  test('Enter text into overlapped input', async ({ page }) => {
    await page.goto('/overlapped');
    const input = page.locator('#id');
    await input.scrollIntoViewIfNeeded();
    await input.fill('PlaywrightTest');
    await expect(input).toHaveValue('PlaywrightTest');
  });
});
