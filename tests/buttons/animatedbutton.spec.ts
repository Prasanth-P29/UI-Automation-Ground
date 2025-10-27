import { test, expect } from '@playwright/test';

test('Click Start Animation button successfully', async ({ page }) => {
  // Go to animation page
  await page.goto('/animation');

  // Wait for Start Animation button to appear
  const startButton = page.getByRole('button', { name: 'Start Animation' });
  await expect(startButton).toBeVisible({ timeout: 10000 });

  // Click the Start Animation button
  await startButton.click();

  // Small wait to ensure the animation starts
  await page.waitForTimeout(2000);

  // Optional assertion: page should still be visible (no crash)
  await expect(page).toHaveURL(/animation/);

  console.log('✅ Start Animation button clicked successfully');
});
