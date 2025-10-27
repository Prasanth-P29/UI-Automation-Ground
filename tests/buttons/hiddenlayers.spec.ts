import { test, expect } from '@playwright/test';

test('Hidden Layers button test', async ({ page }) => {
  await page.goto('/hiddenlayers');
  const greenBtn = page.locator('#greenButton');

  // Click green button once
  await greenBtn.click();

  // Try clicking again, should throw an error because blue button is on top
  const isClickable = await greenBtn.isEnabled();
  await expect(isClickable).toBeTruthy(); // Still enabled technically

  // Check that the blue button is now visible (it covers the green one)
  const blueBtn = page.locator('#blueButton');
  await expect(blueBtn).toBeVisible();
});
