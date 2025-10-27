import { test, expect } from '@playwright/test';

test.describe('Non-breaking Space Tests', () => {
  test('Verify button with non-breaking space', async ({ page }) => {
    await page.goto('/nbsp');

    // Note: The space between "My" and "Button" is a non-breaking space (\u00A0)
    const button = page.getByRole('button', { name: 'My\u00A0Button' });
    await expect(button).toBeVisible();
  });
});
