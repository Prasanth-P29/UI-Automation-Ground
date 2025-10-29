import { test, expect } from "@playwright/test";

test.setTimeout(60000);   // because page restores every 3s

const checkboxSelectors = [
  "#visible",
  "#enabled",
  "#editable",
  "#ontop",
  "#nonzero"
];

async function resetAllChecks(page) {
  for (const c of checkboxSelectors) {
    const cb = page.locator(c);
    await cb.waitFor({ state: "visible" });

    try {
      await cb.check({ force: true });   // force check even if DOM is unstable
    } catch (e) {
      console.log(`WARN: Cannot check ${c} — maybe not applicable`);
    }
  }
}

async function testElementType(page, elementType: string) {

  const status = page.locator("#opstatus");
  const apply3sBtn = page.locator("#applyButton3");

  // Change element type only if needed
  if (elementType !== "button") {
    await page.locator("#element-type").selectOption(elementType);
    await page.waitForTimeout(400);   // allow DOM rebuild
  }

  console.log(`✅ Testing element: ${elementType}`);

  for (const checkbox of checkboxSelectors) {

    // Always refresh checkbox state (DOM rebuilds)
    await resetAllChecks(page);

    // Disable only current checkbox
    await page.locator(checkbox).uncheck({ force: true });

    // Apply 3s
    await apply3sBtn.click();
    await expect(status).toContainText("applied", { timeout: 1000 });

    const target = page.locator("#target");

    /** VALIDATIONS BASED ON CHECKBOX **/

    if (checkbox === "#visible") {
      await expect(target).toBeHidden();
    }

    if (checkbox === "#enabled" && elementType !== "label") {
      await expect(target).toBeDisabled();
    }

    if (checkbox === "#editable" &&
      (elementType === "input" || elementType === "textarea")) {
      await expect(target).toHaveAttribute("readonly", "");
    }

    if (checkbox === "#ontop") {
      await expect(page.locator("#overlay")).toBeVisible();
    }

    if (checkbox === "#nonzero") {
      const box = await target.boundingBox();

      // element should be collapsed
      expect(
        box && (box.width === 0 || box.height === 0)
      ).toBeTruthy();
    }

    // After 3s page should reset
    await page.waitForTimeout(3100);

    await expect(status).toContainText("restored");
    await expect(target).toBeVisible();
  }
}

test.describe("Auto Wait — Button & Input", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("http://www.uitestingplayground.com/autowait");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Button → Input", async ({ page }) => {

    // ✅ test button mode
    await testElementType(page, "button");

    // ✅ test input mode
    await testElementType(page, "input");

  });

});
