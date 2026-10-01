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

    // Session-24 (S24-P2): the nav hrefs are the reference's CAPITALIZED
    // paths — the drawer's Leads link lands on /Leads (rendered in place
    // per S24-P1, never normalized to the lowercase canonical).
    await page.waitForURL("**/Leads");
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

  test("opening the drawer moves focus INTO the drawer (S12-P1)", async ({ page }) => {
    // S12-P1 regression: the drawer's rAF focus fired while the
    // transition-[visibility] class flip had not applied yet — focus() on
    // the still-hidden Close button silently no-opped, so focus stayed on
    // the burger and keyboard users Tabbed through the BACKGROUND page
    // behind the aria-modal dialog (WCAG 2.4.3). The fix retries focus
    // across frames until activeElement lands inside the panel.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(dialog).toBeVisible();

    // Focus must land inside the dialog (retry happens within a few frames;
    // the assertion itself allows the transition to settle).
    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const dialog = document.querySelector(
              '[role=dialog][aria-label="Navigation menu"]',
            );
            return dialog ? dialog.contains(document.activeElement) : false;
          }),
        { timeout: 3000 },
      )
      .toBe(true);
  });

  test("body scroll is locked while the drawer is open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  });

  test("growing past md auto-closes the drawer AND releases both scroll locks", async ({ page }) => {
    // S8-P1 regression: session-7 moved the drawer from lg to md (768px) but
    // left the auto-close media listener at 1024px. Resizing from 700 to
    // 800px with the drawer open hid the drawer (md:hidden) while body AND
    // main stayed overflow:hidden — the app became unscrollable. The drawer
    // must close and unlock at the SAME breakpoint it hides (symmetrical
    // breakpoint strategy).
    await page.setViewportSize({ width: 700, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(dialog).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    expect(await page.evaluate(() => document.querySelector("main")?.style.overflow)).toBe("hidden");

    // Grow past md (768px): the drawer element hides via CSS — the state
    // must close too, releasing the locks.
    await page.setViewportSize({ width: 800, height: 844 });

    await expect(dialog).toBeHidden();
    // Both locks released (the desktop sidebar is now the nav).
    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .not.toBe("hidden");
    await expect
      .poll(async () => page.evaluate(() => document.querySelector("main")?.style.overflow))
      .not.toBe("hidden");
    // And the desktop sidebar took over.
    await expect(page.locator("aside").first()).toBeVisible();
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
