import { test, expect } from '@playwright/test';

test('AJAX data loads successfully', async ({ page }) => {
  // Navigate to AJAX demo page
  await page.goto('/ajax');

  // Wait for button and click
  const ajaxButton = page.locator('#ajaxButton');
  await ajaxButton.waitFor({ state: 'visible', timeout: 15000 });
  await ajaxButton.click();

  // Wait for the AJAX-loaded success message
  const successMsg = page.locator('.bg-success');
  await successMsg.waitFor({ state: 'visible', timeout: 30000 });

  // Assert the text content
  await expect(successMsg).toHaveText(/Data loaded with AJAX get request/);
});
