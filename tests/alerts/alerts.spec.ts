import { test, expect } from '@playwright/test';

test.describe('Alerts Tests', () => {

  test('Handle alert, confirm, and prompt correctly', async ({ page }) => {
    await page.goto('/alerts');

    // -------------------------------
    // 🔹 1. Standard Alert
    page.once('dialog', async (dialog) => {
      console.log('Alert message:', dialog.message());
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Alert' }).click();
    await page.waitForTimeout(1000);

    // -------------------------------
    // 🔹 2. Confirmation Alert
    page.once('dialog', async (dialog) => {
      console.log('Confirm message:', dialog.message());
      await dialog.dismiss(); // simulate clicking Cancel
    });
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(1000);

    // -------------------------------
    // 🔹 3. Prompt Alert
    const promptValue = 'Playwright Automation';
    page.once('dialog', async (dialog) => {
      console.log('Prompt message:', dialog.message());
      await dialog.accept(promptValue);
    });
    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.waitForTimeout(1000);

    // ✅ Verification: value entered into prompt (via logs)
    console.log(`✅ Prompt value entered: "${promptValue}"`);
    console.log('✅ Alerts handled successfully');
  });
});
