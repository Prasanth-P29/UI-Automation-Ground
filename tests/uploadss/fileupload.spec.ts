import { test, expect } from '@playwright/test';
import path from 'path';

test('File Upload Functionality', async ({ page }) => {
  // ✅ Go to the upload page
  await page.goto('/upload');

  // ✅ Wait for the iframe element to appear in DOM
  const iframeHandle = page.locator('iframe');
  await expect(iframeHandle).toBeVisible({ timeout: 15000 });

  // ✅ Get reference to the iframe’s content
  const frame = await iframeHandle.contentFrame();
  if (!frame) throw new Error('❌ Iframe not found or not loaded');

  // ✅ Resolve the path for the file
  const filePath = path.resolve(__dirname, '../../test-data/sample.txt');

  // ✅ Locate the actual file input inside the iframe
  const fileInput = frame.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  console.log('✅ File successfully selected for upload.');

  // ✅ Optionally verify uploaded file name is visible
  const uploadedText = frame.locator('text=sample.txt');
  await expect(uploadedText).toBeVisible({ timeout: 1000000 });

  console.log('✅ File upload verified successfully.');
});
