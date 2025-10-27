import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

/**
 * ─────────────────────────────────────────────
 * 🔹 WAIT HELPERS
 * ─────────────────────────────────────────────
 */

// Wait for a text to appear on the page
export async function waitForText(page: Page, text: string, timeout = 5000) {
  await expect(page.getByText(text)).toBeVisible({ timeout });
}

// Wait for element to be visible and enabled
export async function waitForElementVisible(locator: Locator, timeout = 15000) {
  await locator.waitFor({ state: 'visible', timeout });
  await expect(locator).toBeEnabled({ timeout });
}

// Wait for element to become hidden
export async function waitForElementHidden(locator: Locator, timeout = 5000) {
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * ─────────────────────────────────────────────
 * 🔹 VISIBILITY & SCROLL HELPERS
 * ─────────────────────────────────────────────
 */

export async function scrollIntoViewIfNeeded(locator: Locator) {
  await locator.scrollIntoViewIfNeeded();
}

export async function isElementVisible(locator: Locator): Promise<boolean> {
  try {
    return await locator.isVisible();
  } catch {
    return false;
  }
}

/**
 * ─────────────────────────────────────────────
 * 🔹 SHADOW DOM HELPERS
 * ─────────────────────────────────────────────
 * Works with Playwright’s deep selector (>>>)
 */
export async function getShadowElement(page: Page, hostSelector: string, innerSelector: string): Promise<Locator> {
  const shadowLocator = page.locator(`${hostSelector} >>> ${innerSelector}`);
  await shadowLocator.waitFor({ state: 'visible', timeout: 10000 });
  return shadowLocator;
}

/**
 * ─────────────────────────────────────────────
 * 🔹 ALERT / DIALOG HELPERS
 * ─────────────────────────────────────────────
 */
export async function handleAlert(
  page: Page,
  action: 'accept' | 'dismiss' = 'accept',
  promptText?: string
) {
  page.once('dialog', async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`);
    if (promptText) {
      await dialog.accept(promptText);
    } else if (action === 'accept') {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  });
}

/**
 * ─────────────────────────────────────────────
 * 🔹 FILE UPLOAD HELPER
 * ─────────────────────────────────────────────
 */
export async function uploadFile(page: Page, fileInputSelector: string, fileName: string) {
  const filePath = path.resolve(__dirname, `../../test-data/${fileName}`);
  const fileInput = page.locator(fileInputSelector);
  await fileInput.setInputFiles(filePath);
}

/**
 * ─────────────────────────────────────────────
 * 🔹 MOUSE OVER HELPER
 * ─────────────────────────────────────────────
 */
export async function hoverOverElement(locator: Locator) {
  await locator.hover();
}

/**
 * ─────────────────────────────────────────────
 * 🔹 PROGRESS / WAIT COMPLETION HELPER
 * ─────────────────────────────────────────────
 */
export async function waitForProgressCompletion(locator: Locator, timeout = 10000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const value = await locator.textContent();
    if (value?.includes('100')) break;
    await sleep(200);
  }
}

/**
 * ─────────────────────────────────────────────
 * 🔹 DYNAMIC TABLE HELPER
 * ─────────────────────────────────────────────
 */
export async function getCellValue(page: Page, columnName: string, rowIdentifier: string): Promise<string> {
  const table = page.locator('.table');
  const headers = await table.locator('thead th').allInnerTexts();
  const rows = table.locator('tbody tr');

  const colIndex = headers.findIndex((h) => h.includes(columnName));
  const rowCount = await rows.count();

  for (let i = 0; i < rowCount; i++) {
    const rowText = await rows.nth(i).innerText();
    if (rowText.includes(rowIdentifier)) {
      const cell = rows.nth(i).locator('td').nth(colIndex);
      const text = await cell.textContent();
      if (text) return text.trim();
    }
  }

  throw new Error(`Row with identifier "${rowIdentifier}" not found in Dynamic Table`);
}

/**
 * ─────────────────────────────────────────────
 * 🔹 DISABLED INPUT WAITER
 * ─────────────────────────────────────────────
 */
export async function waitForInputEnabled(locator: Locator, timeout = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await locator.isEnabled()) return;
    await sleep(500);
  }
  throw new Error('Input did not become enabled within timeout');
}

/**
 * ─────────────────────────────────────────────
 * 🔹 GENERAL HELPERS
 * ─────────────────────────────────────────────
 */
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ─────────────────────────────────────────────
 * 🔹 WAIT FOR STABLE ELEMENT (for animations)
 * ─────────────────────────────────────────────
 * Keeps checking element position/size until stable.
 */
export async function waitForStable(locator: Locator, timeout = 10000) {
  const start = Date.now();
  let prevBox = await locator.boundingBox();

  while (Date.now() - start < timeout) {
    await new Promise((r) => setTimeout(r, 300));
    const newBox = await locator.boundingBox();
    if (!newBox || !prevBox) break;
    if (
      Math.abs(newBox.x - prevBox.x) < 1 &&
      Math.abs(newBox.y - prevBox.y) < 1
    ) {
      // element stopped moving
      return;
    }
    prevBox = newBox;
  }
  throw new Error('Element did not become stable within timeout');
}