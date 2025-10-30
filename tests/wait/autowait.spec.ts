import { test, expect } from "@playwright/test";

test.setTimeout(120000);

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
      await cb.check({ force: true });
    } catch {
      console.log(`WARN: Cannot check → ${c}`);
    }
  }
}

async function runCheckboxCycle(page, elementType: string) {

  const status = page.locator("#opstatus");
  const apply3sBtn = page.locator("#applyButton3");

  for (const checkbox of checkboxSelectors) {

    await resetAllChecks(page);

    await page.locator(checkbox).uncheck({ force: true });

    await apply3sBtn.click();

    await expect(status).toContainText("applied");

    const target = page.locator("#target");

    /** VALIDATIONS */
    if (checkbox === "#visible") {
      await expect(target).toBeHidden();
    }

    if (checkbox === "#enabled" && elementType !== "label") {
      await expect(target).toBeDisabled();
    }

    if (
      checkbox === "#editable" &&
      (elementType === "input" || elementType === "textarea")
    ) {
      await expect(target).toHaveAttribute("readonly", "");
    }

    if (checkbox === "#ontop") {
      await expect(page.locator("#overlay")).toBeVisible();
    }

    if (checkbox === "#nonzero") {
      const box = await target.boundingBox();
      expect(
        box && (box.width === 0 || box.height === 0)
      ).toBeTruthy();
    }

    await page.waitForTimeout(7000);

    await expect(target).toBeVisible();
  }
}

async function testElementType(page, elementType: string) {

  if (elementType !== "button") {
    await page.locator("#element-type").selectOption(elementType);
    await page.waitForTimeout(400);
  }

  console.log(`✅ Now testing element: ${elementType}`);

  // ---- SPECIAL HANDLING FOR SELECT ---- //
  if (elementType === "select") {

    const status = page.locator("#opstatus");
    const apply3sBtn = page.locator("#applyButton3");
    const target = page.locator("#target");

    const items = ["Item 1", "Item 2", "Item 3"];

    for (const item of items) {

      console.log(`🔄 Selecting: ${item}`);

      await target.selectOption(item);
      await expect(status).toContainText(`Selected: ${item}`);

      // CLICK APPLY (just like user does)
      await apply3sBtn.click();
      await expect(status).toContainText("applied");

      await page.waitForTimeout(3500);

      await expect(target).toBeVisible();

      console.log(`👉 Running checkbox tests for: ${item}`);
      await runCheckboxCycle(page, elementType);
    }

    return;
  }

  // ---- NORMAL FLOW FOR OTHER TYPES ---- //
  await runCheckboxCycle(page, elementType);
}

test.describe("Auto Wait — All Elements", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("http://www.uitestingplayground.com/autowait");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Button → Input → Textarea → Select (Item‐wise) → Label", async ({ page }) => {

    await testElementType(page, "button");
    await testElementType(page, "input");
    await testElementType(page, "textarea");
    await testElementType(page, "select");     // ✅ itemwise checkboxes
    await testElementType(page, "label");
  });

});














