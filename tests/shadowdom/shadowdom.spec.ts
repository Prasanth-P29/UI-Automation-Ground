import { test, expect } from '@playwright/test';
import { getShadowElement } from '../../utils/helpers';

test('Access elements inside shadow root', async ({ page }) => {
  await page.goto('/shadowdom');

  // Click gear button inside shadow DOM
  const generateButton = await getShadowElement(page, 'guid-generator', '#buttonGenerate');
  await generateButton.click();

  // Click copy button inside shadow DOM
  const copyButton = await getShadowElement(page, 'guid-generator', '#buttonCopy');
  await copyButton.click();

  // Get the input value
  const inputField = await getShadowElement(page, 'guid-generator', '#editField');
  const value = await inputField.inputValue();

  expect(value).not.toBe('');
});
