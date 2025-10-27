import { test, expect } from '@playwright/test';

test.describe('Visibility Tests', () => {
  test('Check hidden and visible elements correctly', async ({ page }) => {
    await page.goto('/visibility');

    const hideButton = page.locator('#hideButton');
    await hideButton.click();

    const removedButton = page.locator('#removedButton');
    await expect(removedButton).not.toBeVisible();

    const overlapped = page.locator('#overlappedButton');
    await expect(overlapped).toBeVisible();
  });
});
