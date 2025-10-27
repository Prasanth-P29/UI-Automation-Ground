import { test, expect } from '@playwright/test';

test.describe('Dynamic Table Tests', () => {
  test('Verify Chrome CPU value changes after reload and matches yellow label', async ({ page }) => {
    // Go to the Dynamic Table page
    await page.goto('/dynamictable');

    // ✅ Wait for Chrome row and CPU to load
    const chromeRow = page.locator('//span[contains(text(),"Chrome")]/..');
    await expect(chromeRow).toBeVisible({ timeout: 20000 });

    const cpuCell = page.locator('//span[contains(text(),"Chrome")]/../span[contains(text(),"%")]');
    await expect(cpuCell).toBeVisible({ timeout: 20000 });

    // ✅ Get initial Chrome CPU value
    const initialCPU = (await cpuCell.textContent())?.trim();
    console.log(`💡 Initial Chrome CPU: ${initialCPU}`);

    // ✅ Reload the page (simulate new random values)
    await page.reload();
    console.log('🔁 Page reloaded to fetch new random values.');

    // ✅ Wait again for the Chrome row
    await expect(chromeRow).toBeVisible({ timeout: 20000 });
    const newCPU = (await cpuCell.textContent())?.trim();
    console.log(`🧠 New Chrome CPU after reload: ${newCPU}`);

    // ✅ Assert that CPU values are randomized (should not be same)
    expect(newCPU).not.toBe(initialCPU);
    console.log('✅ CPU values are changing on reload — randomization works.');

    // ✅ Verify the yellow label still matches Chrome CPU
    const label = page.locator('.bg-warning');
    const labelText = (await label.textContent())?.trim();
    console.log(`📊 Yellow label text: ${labelText}`);

    const labelValue = labelText?.split(':')[1].trim();
    expect(newCPU).toBe(labelValue);

    console.log(`🎯 Chrome CPU (${newCPU}) matches yellow label successfully.`);
  });
});
