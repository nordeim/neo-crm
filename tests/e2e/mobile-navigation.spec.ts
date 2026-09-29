import { expect, test } from "@playwright/test";

// REGRESSION: the reference (base44) app ships NO mobile navigation — the
// sidebar simply disappears below `lg` and phone users cannot reach any page.
// This suite pins the clone's working mobile drawer.

test.describe("mobile navigation drawer", () => {
  test("hamburger opens the drawer with every nav destination", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // No desktop sidebar at 390px.
    await expect(page.locator("aside").first()).toBeHidden();

    // Hamburger is visible and labelled.
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await expect(trigger).toBeVisible();

    // Open the drawer.
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(dialog).toBeVisible();

    // Every destination is reachable from the drawer.
    for (const label of [
      "Dashboard",
      "Accounts",
      "Contacts",
      "Leads",
      "Calendar",
      "Activities",
      "Reports",
      "Settings",
    ]) {
      await expect(dialog.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("tapping a drawer link navigates and closes the drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await dialog.getByRole("link", { name: "Leads", exact: true }).click();

    await page.waitForURL("**/leads");
    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
    await expect(dialog).toBeHidden();
  });

  test("Escape closes the drawer and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("body scroll is locked while the drawer is open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  });

  test("desktop shows the persistent sidebar instead", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("aside").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open navigation menu" }),
    ).toBeHidden();
  });
});
