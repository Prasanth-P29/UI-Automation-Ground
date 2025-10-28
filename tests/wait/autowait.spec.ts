import { test, expect } from '@playwright/test';

test.describe('Auto Wait Full Functionality Test', () => {

  test('Verify all element types and their delayed restoration', async ({ page }) => {
    await page.goto('/autowait');
    console.log('✅ Navigated to Auto Wait page.');

    const elementType = page.locator('#element-type');
    const checkboxes = {
      visible: page.locator('#visible'),
      enabled: page.locator('#enabled'),
      editable: page.locator('#editable'),
      onTop: page.locator('#ontop'),
      nonZero: page.locator('#nonzero')
    };

    const apply3s = page.locator('#applyButton3');
    const status = page.locator('#opstatus');
    const elementTypes = ['button', 'input', 'textarea', 'select', 'label'];

    for (const type of elementTypes) {
      console.log(`\n🧩 Testing element type: ${type}`);
      await elementType.selectOption(type);
      await page.waitForTimeout(1000);

      // Uncheck all properties
      for (const key in checkboxes) {
        const box = checkboxes[key as keyof typeof checkboxes];
        if (await box.isChecked()) await box.uncheck();
      }
      console.log('🔸 All checkboxes unchecked.');

      // Apply settings and wait for restore
      await apply3s.click();
      await expect(status).toHaveText(/Target element settings applied for 3 seconds./, { timeout: 2000 });
      console.log('⏳ Delay applied for 3s.');
      await expect(status).toHaveText(/Target element state restored./, { timeout: 6000 });
      console.log('✅ State restored.');

      const target = page.locator('#target');
      await expect(target).toBeVisible({ timeout: 5000 });

      // Interact based on element type
      if (type === 'button') {
        await target.click();
        await expect(status).toHaveText('Target clicked.');
        console.log('🖱️ Button click verified.');
      }

      else if (type === 'input') {
        await target.fill('AutoWait Input');
        await target.press('Enter');
        await expect(status).toHaveText(/Text: AutoWait Input/);
        console.log('⌨️ Input verified.');
      }

      else if (type === 'textarea') {
        await target.fill('Multi-line Playwright Test');
        await target.press('Enter');
        await expect(status).toHaveText(/Text: Multi-line Playwright Test/);
        console.log('📝 Textarea verified.');
      }

      else if (type === 'select') {
        await target.selectOption('Item 3');
        await expect(status).toHaveText(/Selected: Item 3/);
        console.log('📋 Dropdown verified.');
      }

      else if (type === 'label') {
        await target.click();
        await expect(status).toHaveText('Target clicked.');
        console.log('🏷️ Label click verified.');
      }

      // Small pause between each test
      await page.waitForTimeout(1000);
    }

    console.log('\n🎯 Auto Wait test completed for all 5 element types successfully.');
  });

});
