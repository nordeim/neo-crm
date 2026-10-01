import { expect, test } from "@playwright/test";

// Authenticated golden path across the CRM (uses the seeded e2e database).

test("dashboard renders seeded KPIs, charts and recent deals", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  // KPI cards
  await expect(page.getByText("Total Leads")).toBeVisible();
  await expect(page.getByText("Deals Closed")).toBeVisible();
  await expect(page.getByText("Revenue This Month")).toBeVisible();
  await expect(page.getByText("Conversion Rate")).toBeVisible();

  // Charts + lists — session-9 (S9-3): card titles are DIVs on the
  // reference (no heading semantics), so these are text locators now.
  await expect(page.getByText("Sales Pipeline by Stage")).toBeVisible();
  await expect(page.getByText("Revenue Over Time")).toBeVisible();
  await expect(page.getByText("Top Performing Sales Reps")).toBeVisible();
  await expect(page.getByText("Recent Deals")).toBeVisible();

  // Seeded rows are present (24 leads seeded).
  await expect(page.getByText("24", { exact: true }).first()).toBeVisible();
});

test("leads page shows the seeded pipeline and charts", async ({ page }) => {
  await page.goto("/leads");
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();

  await expect(page.getByText("Pipeline Value by Stage")).toBeVisible();
  await expect(page.getByText("Won vs Lost Over Time")).toBeVisible();
  await expect(page.getByText("Conversion Funnel")).toBeVisible();

  // A seeded lead appears in the table.
  await expect(page.getByText("Security audit retainer").first()).toBeVisible();
});

test("create a lead through the New Lead dialog", async ({ page }) => {
  await page.goto("/leads");
  await page.getByRole("button", { name: "New Lead" }).click();

  await expect(page.getByRole("dialog").getByText("Create New Lead")).toBeVisible();
  await page.getByLabel("Name *").fill("E2E — Playwright deal");
  await page.getByLabel("Estimated Value").fill("12345");

  await page.getByRole("button", { name: "Create Lead" }).click();
  await expect(page.getByText("Lead created")).toBeVisible();
  await expect(page.getByText("E2E — Playwright deal").first()).toBeVisible();
});

test("accounts page lists seeded accounts and supports search", async ({ page }) => {
  await page.goto("/accounts");
  await expect(page.getByRole("heading", { name: "Accounts" })).toBeVisible();
  await expect(page.getByText("Emirates Global Trading").first()).toBeVisible();

  await page.getByRole("textbox", { name: "Search accounts", exact: true }).fill("Meridian");
  await expect(page.getByText("Meridian Financial").first()).toBeVisible();
  await expect(page.getByText("Emirates Global Trading")).toHaveCount(0);
});

test("contacts page renders seeded contacts", async ({ page }) => {
  await page.goto("/contacts");
  await expect(page.getByRole("heading", { name: "Contacts" })).toBeVisible();
  await expect(page.getByText("Khalid Al Mansoori").first()).toBeVisible();
});

test("calendar shows the current month and seeded events", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByRole("heading", { name: "Calendar", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Upcoming Events" })).toBeVisible();
});

test("activities page renders priority tabs and timeline", async ({ page }) => {
  await page.goto("/activities");
  await expect(page.getByRole("heading", { name: "Activities", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Overdue" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Due Today" })).toBeVisible();
  await expect(page.getByText("Activity Timeline")).toBeVisible();
});

test("reports page loads analytics tabs with seeded data", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByRole("heading", { name: "Reports & Analytics" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Sales Overview" })).toBeVisible();
  // Parity pin: the Saved Reports bookmark button ships in the header.
  await expect(page.getByRole("button", { name: "Saved Reports (0)" })).toBeVisible();

  // Regression: the "all" filter sentinel must not leak into the query —
  // the view (owner/stage/status=all) must show the seeded pipeline, not
  // zeros. Session-18 fixed a TIME BOMB here: the assertion hardcoded the
  // quarter-relative won total ($542.0k — the subset of seeded closes that
  // happened to fall in Q3 2026) and broke on 2026-10-01 when the quarter
  // rolled over to Q4 and the server-side periodStart() window no longer
  // contained any seeded close. The deterministic expression: switch the
  // period to All Time and pin the date-independent all-time won total
  // (145k+98k+210k+42k+66k+87k+39k = $687.0K — every seeded won deal, no
  // wall-clock dependence). The lead created by the earlier test is stage
  // "new" and never reaches the won total either way.
  await page.getByRole("combobox").first().click();
  await page.getByRole("option", { name: "All Time" }).click();
  await expect(page.getByText("7 $687.0K").first()).toBeVisible();

  await page.getByRole("tab", { name: "Account Health" }).click();
  await expect(page.getByText("Account Health Distribution")).toBeVisible();

  // Session-10 (S10-8): the rebuilt tab 2-4 structure. Tab 2 ships the
  // Forecasting Accuracy caption + the Open Deals / Deals at Risk tables
  // with their Export buttons; tab 3 the Overdue Activities + Activity
  // Log by Owner tables; tab 4 the Leads List + Source Performance
  // Summary tables.
  await page.getByRole("tab", { name: "Pipeline & Forecast" }).click();
  await expect(page.getByText("Forecasting Accuracy")).toBeVisible();
  await expect(page.getByText(/Average Accuracy: /)).toBeVisible();
  await expect(page.getByRole("button", { name: "Export CSV" }).first()).toBeVisible();
  await expect(page.getByText("Open Deals by Stage")).toBeVisible();
  await expect(page.getByText("Deals at Risk (No Activity 14+ Days)")).toBeVisible();

  await page.getByRole("tab", { name: "Activity & Productivity" }).click();
  await expect(page.getByText("Overdue Activities")).toBeVisible();
  await expect(page.getByText("Activity Log by Owner")).toBeVisible();

  await page.getByRole("tab", { name: "Lead Sources" }).click();
  await expect(page.getByText("Leads List by Source")).toBeVisible();
  await expect(page.getByText("Source Performance Summary")).toBeVisible();
  await expect(page.getByText("Win Rate by Source (%)")).toBeVisible();
});

test("reports tabs render bare with gap-6 grids and 300px charts (session-11)", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByRole("tab", { name: "Sales Overview" })).toBeVisible();

  // S11-P5: the tab bar is NOT card-wrapped — no bordered card ancestor
  // between the tab list and the page content wrapper.
  const tablist = page.getByRole("tablist").first();
  const wrappedInCard = await tablist.evaluate((el: HTMLElement) => {
    let node = el.parentElement;
    while (node && node.tagName !== "MAIN") {
      if (
        node.classList.contains("rounded-xl") &&
        node.classList.contains("border") &&
        node.querySelector("[role=tablist]")
      ) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  });
  expect(wrappedInCard).toBe(false);

  // S11-P4/S11-P6: tab-1 charts render at 300px in gap-6 grids.
  // Session-12: the KPI sparklines are RECHARTS wrappers now too — scope
  // to the tabpanel so the first hit is a real tab-1 chart, not a spark.
  const firstChart = page.locator("[role=tabpanel] .recharts-wrapper").first();
  await expect(firstChart).toBeVisible();
  const height = await firstChart.evaluate((el: HTMLElement) => el.clientHeight);
  expect(height).toBe(300);
  const gridGap = await firstChart.evaluate((el: HTMLElement) => {
    const grid = el.closest(".grid");
    return grid ? getComputedStyle(grid).gap : "";
  });
  expect(gridGap).toBe("24px");
});

test("tabs ship the reference's Radix ARIA contract + keyboard model (session-23)", async ({ page }) => {
  // S23-P1: the reference's tab strips are Radix Tabs — every trigger
  // carries id + aria-controls pointing at its panel's id, every panel
  // carries id + aria-labelledby pointing back at its trigger, all N
  // panel shells stay mounted (the inactive ones hidden with EMPTY
  // content), and the tablist supports the keyboard model:
  // ArrowLeft/ArrowRight with wrap, Home/End, automatic activation
  // (selection follows focus — live-verified on the reference).
  await page.goto("/reports");
  await expect(page.getByRole("tab", { name: "Sales Overview" })).toBeVisible();
  // Session-25 (S25-P1): the skeleton pass is retired (the reference's
  // instant-render model — its empty state IS its loading state), so the
  // old skeleton-race workaround is obsolete. The chart wait stays: the
  // recharts wrappers still lazy-render inside Suspense after data lands,
  // and the wiring probe below must read the post-load DOM.
  await expect(page.locator("[role=tabpanel] .recharts-wrapper").first()).toBeVisible();

  const wiring = await page.evaluate(() => {
    const out = { tabs: 0, wired: 0, panels: 0, backWired: 0, hiddenInactive: 0, emptyInactive: 0 };
    const tabEls = [...document.querySelectorAll("[role=tab]")];
    out.tabs = tabEls.length;
    for (const t of tabEls) {
      const ctrl = t.getAttribute("aria-controls");
      const panel = ctrl ? document.getElementById(ctrl) : null;
      if (panel) {
        out.wired += 1;
        const labelled = panel.getAttribute("aria-labelledby");
        if (labelled && document.getElementById(labelled) === t) out.backWired += 1;
      }
    }
    const panels = [...document.querySelectorAll("[role=tabpanel]")];
    out.panels = panels.length;
    for (const p of panels) {
      if (p.hasAttribute("hidden")) {
        out.hiddenInactive += 1;
        if (!(p.textContent || "").trim()) out.emptyInactive += 1;
      }
    }
    return out;
  });
  expect(wiring.tabs).toBe(5);
  expect(wiring.wired).toBe(5);
  expect(wiring.panels).toBe(5);
  expect(wiring.backWired).toBe(5);
  expect(wiring.hiddenInactive).toBe(4);
  expect(wiring.emptyInactive).toBe(4);

  // Keyboard model: ArrowRight moves focus AND selection (automatic
  // activation), End jumps to the last tab, ArrowRight wraps to the
  // first, Home returns to the start.
  const sales = page.getByRole("tab", { name: "Sales Overview" });
  const pipeline = page.getByRole("tab", { name: "Pipeline & Forecast" });
  const health = page.getByRole("tab", { name: "Account Health" });
  await sales.focus();
  await page.keyboard.press("ArrowRight");
  await expect(pipeline).toBeFocused();
  await expect(pipeline).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(health).toBeFocused();
  await expect(health).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(sales).toBeFocused();
  await expect(sales).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(sales).toBeFocused();
  await expect(sales).toHaveAttribute("aria-selected", "true");

  // The settings strip (segmented, 3 tabs) ships the same contract.
  await page.goto("/settings");
  await expect(page.getByRole("tab", { name: "CRM Configuration" })).toBeVisible();
  const settingsWiring = await page.evaluate(() => {
    const tabEls = [...document.querySelectorAll("[role=tab]")];
    const panels = [...document.querySelectorAll("[role=tabpanel]")];
    const wired = tabEls.filter((t) => {
      const ctrl = t.getAttribute("aria-controls");
      return ctrl && document.getElementById(ctrl);
    }).length;
    const backWired = panels.filter((p) => {
      const labelled = p.getAttribute("aria-labelledby");
      return labelled && document.getElementById(labelled);
    }).length;
    return { tabs: tabEls.length, panels: panels.length, wired, backWired };
  });
  expect(settingsWiring.tabs).toBe(3);
  expect(settingsWiring.wired).toBe(3);
  expect(settingsWiring.panels).toBe(3);
  expect(settingsWiring.backWired).toBe(3);

  // The activities strip (segmented, 4 tabs) ships the same contract —
  // and its panel shells replaced the s15-era redundant empty tabpanel.
  await page.goto("/activities");
  await expect(page.getByRole("tab", { name: "Overdue" })).toBeVisible();
  const activitiesWiring = await page.evaluate(() => {
    const tabEls = [...document.querySelectorAll("[role=tab]")];
    const panels = [...document.querySelectorAll("[role=tabpanel]")];
    const wired = tabEls.filter((t) => {
      const ctrl = t.getAttribute("aria-controls");
      return ctrl && document.getElementById(ctrl);
    }).length;
    const emptyPanels = panels.filter((p) => p.hasAttribute("hidden") && !(p.textContent || "").trim()).length;
    return { tabs: tabEls.length, panels: panels.length, wired, emptyPanels };
  });
  expect(activitiesWiring.tabs).toBe(4);
  expect(activitiesWiring.wired).toBe(4);
  expect(activitiesWiring.panels).toBe(4);
  expect(activitiesWiring.emptyPanels).toBe(3);
});

test("per-page document titles follow the Page | NEO CRM scheme", async ({ page }) => {
  // Session-10 (S10-10): the reference titles every non-dashboard page
  // "X | NEO CRM"; the dashboard + login stay "NEO CRM" (document.title
  // probes on all 10 routes of the live reference).
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page).toHaveTitle("NEO CRM");
  for (const [path, title] of [
    ["/accounts", "Accounts | NEO CRM"],
    ["/contacts", "Contacts | NEO CRM"],
    ["/leads", "Leads | NEO CRM"],
    ["/calendar", "Calendar | NEO CRM"],
    ["/activities", "Activities | NEO CRM"],
    ["/reports", "Reports | NEO CRM"],
    ["/settings", "Settings | NEO CRM"],
    ["/profile", "Profile | NEO CRM"],
  ] as const) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
  }
  await page.goto("/login");
  await expect(page).toHaveTitle("NEO CRM");
});

test("profile page shows the reference Personal Information layout", async ({ page }) => {
  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: "Profile & Settings" })).toBeVisible();
  await expect(page.getByText("Personal Information")).toBeVisible();
  await expect(page.getByLabel("Full Name")).toHaveValue("sepnetflix2023");
  await expect(page.getByLabel("Email")).toBeDisabled();
  await expect(page.getByText("Email cannot be changed")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Changes" })).toBeVisible();
  await expect(page.getByText("Email Verified")).toBeVisible();
  await expect(page.getByText("Protected")).toBeVisible();
});

test("settings page exposes the three configuration tabs", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByText("Contact Sources")).toBeVisible();

  await page.getByRole("tab", { name: "Defaults" }).click();
  await expect(page.getByText("Default Currency")).toBeVisible();

  await page.getByRole("tab", { name: "Data" }).click();
  await expect(page.getByRole("button", { name: "Reset All Data" })).toBeVisible();
});

test("settings Defaults tab renders the reference's single-column layout (S14-P1)", async ({ page }) => {
  // The reference's Default Values card is ONE column at every width
  // (body space-y-4, groups space-y-2) — ours shipped a 3-col grid.
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Defaults" }).click();

  const card = page.locator("main .rounded-xl", { hasText: "Default Currency" });
  await expect(card).toBeVisible();
  const body = card.locator(".p-6.pt-0");
  await expect(body).toHaveClass(/space-y-4/);
  await expect(body).not.toHaveClass(/grid-cols/);

  // The six groups stack vertically: the last group (First Day of Week)
  // renders BELOW the first (Default Currency) at desktop width.
  const first = await card.getByLabel("Default Currency").boundingBox();
  const last = await card.getByLabel("First Day of Week").boundingBox();
  expect(first).not.toBeNull();
  expect(last).not.toBeNull();
  expect(last!.y).toBeGreaterThan(first!.y);
});

test("settings Data tab ships Import Templates + stacked outline buttons (S14-P2/P3)", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Data" }).click();

  // The template card carries the reference's 'Import ' prefix.
  await expect(page.getByText("Import Templates")).toBeVisible();

  // The buttons stack vertically (space-y-2) and are default-size
  // outline (36px tall at the 16px base — not the 32px sm).
  const tpl = page.locator("main .rounded-xl", { hasText: "Import Templates" });
  const btn = tpl.getByRole("button", { name: "Download Contacts Template" });
  await expect(btn).toBeVisible();
  await expect(btn).toHaveClass(/w-full sm:w-auto/);
  const box = await btn.boundingBox();
  expect(Math.round(box?.height ?? 0)).toBe(36);

  // The Danger Zone is the tinted warning surface with the icon title.
  const dz = page.locator("main .rounded-xl", { hasText: "Danger Zone" });
  await expect(dz).toHaveClass(/bg-red-50/);
  await expect(dz.getByText("Danger Zone")).toBeVisible();
  const reset = dz.getByRole("button", { name: "Reset All Data" });
  // The reset button sits BELOW the confirm input (stacked, not inline).
  const input = dz.getByLabel('Type "RESET" to confirm');
  const ib = await input.boundingBox();
  const rb = await reset.boundingBox();
  expect(ib).not.toBeNull();
  expect(rb).not.toBeNull();
  expect(rb!.y).toBeGreaterThan(ib!.y);
});

test("/Profile (capital P) renders the profile page IN PLACE (S14-P4 -> S24-P1)", async ({ page }) => {
  // The reference serves both casings WITHOUT normalizing (its account
  // menu links to /Profile; probing /Profile browser-side renders the
  // full app page with the URL PRESERVED). The s14 redirect alias is
  // retired — the capital casing now renders through the (app) group
  // like every other capital route.
  // 'Personal Information' is a CardTitle <div> (no heading semantics —
  // the reference ships none either), so assert via text + the page h1.
  await page.goto("/Profile");
  await expect(page).toHaveURL(/\/Profile$/);
  await expect(page.getByRole("heading", { name: "Profile & Settings" })).toBeVisible();
  await expect(page.getByText("Personal Information")).toBeVisible();
});

test("the sidebar hrefs are the reference's CAPITALIZED paths (S24-P2)", async ({ page }) => {
  // Byte-extracted from the reference's live DOM: its sidebar links point
  // at /Dashboard, /Accounts, … /Settings — Dashboard at /Dashboard, NOT
  // the root — and every capital URL renders in place (S24-P1).
  await page.goto("/");

  const aside = page.locator("aside");
  const hrefs = await aside.locator("a").evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute("href")),
  );
  expect(hrefs).toEqual([
    "/Dashboard",
    "/Accounts",
    "/Contacts",
    "/Leads",
    "/Calendar",
    "/Activities",
    "/Reports",
    "/Settings",
  ]);
});

test("the active nav state is CASE-INSENSITIVE like the reference's (S24-P2)", async ({ page }) => {
  // The reference highlights its Reports item (href /Reports) at
  // LOWERCASE /reports, and its Dashboard item at BOTH / and /Dashboard.
  await page.goto("/reports");
  const active = page.locator("aside a[aria-current='page']");
  await expect(active).toHaveAttribute("href", "/Reports");

  await page.goto("/");
  await expect(page.locator("aside a[aria-current='page']")).toHaveAttribute("href", "/Dashboard");
});

test("capital nav routes render IN PLACE — the URL is never normalized (S24-P1)", async ({ page }) => {
  // The reference serves every app route at both casings with NO
  // normalization (its own sidebar links point at the capitalized paths).
  // /Dashboard serves the root head exactly like / on the reference.
  const cases: Array<[string, RegExp]> = [
    ["/Dashboard", /^Dashboard$/],
    ["/Leads", /^Leads$/],
    ["/Settings", /^Settings$/],
  ];
  for (const [route, heading] of cases) {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(route));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
});

test("capital AUTH routes still 404 (the reference case-folds only its app routes)", async ({ page }) => {
  // The reference's /Login renders its 404 view (its client router does
  // NOT case-fold the auth routes) — our clone 404s both casings too.
  // Parity by coincidence, pinned so no capital auth alias sneaks in.
  await page.goto("/Login");
  await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
});

test("the dashboard More... button is the reference's dead affordance (S24-P3)", async ({ page }) => {
  // Live-verified on the reference: clicking More... changes NOTHING —
  // zero DOM delta, zero dialogs, zero navigation. Ours pushed /leads
  // (an invention); the no-op is now pinned.
  await page.goto("/");
  await page.getByRole("button", { name: "More...", exact: true }).click();
  await page.waitForTimeout(300);
  await expect(page).toHaveURL(/\/$|\/Dashboard/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("global search finds a seeded account", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search accounts, contacts and leads").fill("Northwind");
  await expect(page.getByText("Accounts").first()).toBeVisible();
  await expect(page.getByText("Northwind Energy").first()).toBeVisible();
});

test("unauthenticated API access is rejected", async () => {
  // Plain fetch — deliberately carries no session cookie.
  const port = process.env.E2E_PORT ?? "3100";
  const res = await fetch(`http://localhost:${port}/api/accounts`);
  expect(res.status).toBe(401);
  const patch = await fetch(`http://localhost:${port}/api/users`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "intruder" }),
  });
  expect(patch.status).toBe(401);
});

test("unknown routes render the reference's custom 404 page (S12-P2)", async ({ page }) => {
  // The reference ships a designed 404 (slate-50 centered card, "404"
  // display heading, "Page Not Found", the quoted pathname message and a
  // Go Home button) — NOT the stock Next.js built-in.
  await page.goto("/this-page-does-not-exist");

  await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();
  await expect(page.getByText('The page "/this-page-does-not-exist" could not be found in this application.')).toBeVisible();

  const goHome = page.getByRole("link", { name: "Go Home" });
  await expect(goHome).toBeVisible();
  await goHome.click();
  await page.waitForURL("**/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("the topbar account menu is a real role=menu with Profile/Logout (S13-P4)", async ({ page }) => {
  // The reference ships the stock Radix DropdownMenu (role=menu with
  // menuitems, rounded-md shadow-md surface). Ours was a Popover-based
  // role=dialog with a custom surface — this pins the menu semantics.
  await page.goto("/");
  await page.getByRole("button", { name: "Account menu" }).click();

  const menu = page.locator('[role="menu"]');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Profile" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Logout" })).toBeVisible();

  // Profile navigates to the reference's /Profile target (its menuitem
  // is an <A href="/Profile"> — the capital casing renders in place per
  // S24-P1; the URL is preserved, never normalized).
  await menu.getByRole("menuitem", { name: "Profile" }).click();
  await page.waitForURL("**/Profile");
  await expect(page.getByRole("heading", { name: "Profile & Settings" })).toBeVisible();
});

test("the reports tab-1 funnel is a horizontal bar chart with raw stage slugs (S13-P8)", async ({ page }) => {
  // The reference's "Conversion Funnel" on reports tab 1 renders as a
  // horizontal BAR chart: dashed grid, numeric X axis, category Y axis
  // with the eight RAW slugs (new/contacted/qualified/prospecting/
  // qualification/proposal/negotiation/closed_won) — DOM-verified. Ours
  // shipped a trapezoid FunnelChart.
  await page.goto("/reports");

  const funnelCard = page.locator('[role="tabpanel"] .rounded-xl', {
    hasText: "Conversion Funnel",
  });
  await expect(funnelCard).toBeVisible();

  // Dashed grid lines on the funnel card.
  const gridLine = funnelCard.locator(".recharts-cartesian-grid line").first();
  await expect(gridLine).toHaveAttribute("stroke-dasharray", "3 3");

  // The eight raw-slug Y ticks render (the fixed list ticks at any data
  // volume — the reference renders them at zero data).
  for (const slug of ["new", "contacted", "qualified", "prospecting", "qualification", "proposal", "negotiation", "closed_won"]) {
    await expect(funnelCard.locator(`.recharts-yAxis text`, { hasText: slug })).toBeVisible();
  }
});

test("the activities by-type card renders chips + the Activities checkbox footer (S13-P5)", async ({ page }) => {
  // The reference's "Activities by Type" card ships a five-chip count
  // row under the chart and a border-t footer with an "Activities"
  // checkbox + dots button. Ours shipped neither.
  await page.goto("/activities");

  const card = page.locator("main .rounded-xl", { hasText: "Activities by Type" });
  await expect(card).toBeVisible();

  // The static subtitle (the range filter does not change it).
  await expect(card.getByText("Last 2 days")).toBeVisible();

  // Five per-type chips with counts.
  for (const label of ["Call", "Email", "Meeting", "Task", "Note"]) {
    await expect(card.locator(".flex-wrap .text-xs", { hasText: new RegExp(`^${label} `) }).first()).toBeVisible();
  }

  // The footer checkbox + label (S17-P3: the stock Radix-style button
  // checkbox — role=checkbox + data-state=checked with the Check
  // indicator — exactly the reference's anatomy; it was a native input
  // before session-17).
  await expect(card.locator(".border-t label")).toHaveText("Activities");
  const footerToggle = card.locator(".border-t button[role='checkbox']");
  await expect(footerToggle).toBeVisible();
  await expect(footerToggle).toHaveAttribute("data-state", "checked");
  await expect(footerToggle.locator("svg.lucide-check")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Session-15: the entity-dialog geometry layer
// ---------------------------------------------------------------------------

test("the New Lead dialog ships the stock geometry at phone width (S15-P1/P3/P9)", async ({ page }) => {
  // Reference at 390: the content is FULL-BLEED (390px, left 0), radius
  // 0 (sm:rounded-lg drops below 640), the title is CENTERED, and the
  // Status + Source pair sits side-by-side in a 2-col grid.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/leads");
  await page.getByRole("button", { name: "New Lead" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // The stock zoom-in-95/slide-in enter animation is still running right
  // after toBeVisible — poll until the width settles at full bleed.
  await expect
    .poll(async () => (await dialog.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(389);
  const box = await dialog.boundingBox();
  expect(box?.x ?? 0).toBeLessThan(1);

  // sm:rounded-lg computes 0px below 640.
  const radius = await dialog.evaluate((el) => getComputedStyle(el).borderRadius);
  expect(radius).toBe("0px");

  // text-center sm:text-left: the header centers on phones.
  const headerAlign = await dialog
    .locator("h2")
    .locator("..")
    .evaluate((el) => getComputedStyle(el).textAlign);
  expect(headerAlign).toBe("center");

  // The Status + Source pair renders as a 2-col grid (side by side).
  const statusLabel = dialog.getByText("Status", { exact: true });
  const sourceLabel = dialog.getByText("Source", { exact: true });
  const statusBox = await statusLabel.boundingBox();
  const sourceBox = await sourceLabel.boundingBox();
  expect(statusBox?.y).toBeTruthy();
  expect(sourceBox?.y).toBeTruthy();
  // Same row: the tops align within a few px.
  expect(Math.abs((sourceBox?.y ?? 0) - (statusBox?.y ?? 0))).toBeLessThan(8);
});

test("the New Contact dialog ships the avatar section with the Name field inside it (S15-P11)", async ({ page }) => {
  await page.goto("/contacts");
  await page.getByRole("button", { name: "New Contact" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // The avatar section: gradient circle + camera button + Name inside.
  const section = dialog.locator(".border-b", { hasText: "Name" }).first();
  await expect(section).toBeVisible();
  await expect(section.locator(".rounded-full.bg-gradient-to-br")).toBeVisible();
  await expect(section.getByLabel("Name *")).toBeVisible();
  await expect(section.getByRole("button").filter({ has: page.locator("svg.lucide-camera") })).toBeVisible();

  // The initials render live from the typed name.
  await section.getByLabel("Name *").fill("Ada Lovelace");
  await expect(section.locator(".rounded-full span")).toHaveText(/^A/);

  // No description line (the reference ships none).
  await expect(dialog.getByText("Add a person to your CRM workspace.")).toHaveCount(0);
});

test("the New Event dialog is the wide family with the blue submit (S15-P12)", async ({ page }) => {
  await page.goto("/calendar");
  await page.getByRole("button", { name: "New Event" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // max-w-2xl: 672px cap at desktop widths.
  const box = await dialog.boundingBox();
  expect(box?.width).toBe(672);

  // The one-off BLUE submit (every other dialog is the dark primary).
  // Tailwind v4 compiles bg-blue-600 to a lab() color that serializes
  // differently than rgb() — normalize through a canvas pixel readback (same
  // visual color: rgb(37, 99, 235) = #2563eb).
  const submit = dialog.getByRole("button", { name: "Create Event" });
  const bg = await submit.evaluate((el) => {
    const c = getComputedStyle(el).backgroundColor;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return c;
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
  });
  expect(bg).toBe("rgb(37, 99, 235)");

  // No description line.
  await expect(dialog.getByText("Schedule a meeting, call or appointment.")).toHaveCount(0);
});

test("the contacts full-height layout is the page root — no double padding (S16-P1)", async ({ page }) => {
  // Reference at 390: main > flex h-[calc(100vh-64px)] DIRECTLY (the
  // h-calc box spans the full 390px; padding lives inside its p-8
  // scroller). The table card computes 326px wide and main scrolls only
  // the 5px mirrored topbar quirk. Our blanket shell wrapper used to
  // pad the layout (358px h-calc, 294px card, 37px scroll).
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contacts");

  const geometry = await page.evaluate(() => {
    const main = document.querySelector("main");
    const hcalc = [...document.querySelectorAll("div")].find((d) =>
      (d.className || "").includes("h-[calc(100vh-64px)]"),
    );
    const card = document.querySelector("table")?.closest("[class*=rounded-xl]");
    return {
      hcalcW: Math.round(hcalc?.getBoundingClientRect().width ?? 0),
      isDirectChild: hcalc?.parentElement === main,
      cardW: Math.round(card?.getBoundingClientRect().width ?? 0),
      scrollDelta: main ? main.scrollHeight - main.clientHeight : 0,
    };
  });
  expect(geometry.isDirectChild).toBe(true);
  expect(geometry.hcalcW).toBeGreaterThanOrEqual(389);
  expect(geometry.cardW).toBe(326);
  // The 64px calc is 5px short of the real 69px topbar — the mirrored
  // quirk. Anything beyond ~10px means the double-padding is back.
  expect(Math.abs(geometry.scrollDelta - 5)).toBeLessThan(10);
});

test("the settings picklist grid renders 2 columns at tablet width (S16-P6)", async ({ page }) => {
  // The reference breaks the picklist grid at md (768px), not lg — at
  // 900px it renders two 282px cards; ours shipped one 580px column.
  await page.setViewportSize({ width: 900, height: 800 });
  await page.goto("/settings");

  // The picklist cards render after the settings fetch resolves — wait
  // for the grid (>= 3 rounded-xl cards) instead of racing hydration.
  await page.waitForFunction(() => {
    const grid = [...document.querySelectorAll("div")].find(
      (d) =>
        /^grid /.test(d.className || "") &&
        d.querySelectorAll("[class*=rounded-xl]").length >= 3,
    );
    return grid !== undefined;
  });

  const cols = await page.evaluate(() => {
    const grid = [...document.querySelectorAll("div")].find(
      (d) =>
        /^grid /.test(d.className || "") &&
        d.querySelectorAll("[class*=rounded-xl]").length >= 3,
    );
    return grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0;
  });
  expect(cols).toBe(2);
});

test("the calendar card ships the split DOW/month grids + the bold title (S16-P7)", async ({ page }) => {
  await page.goto("/calendar");

  const anatomy = await page.evaluate(() => {
    const h2 = document.querySelector("main h2");
    const grids = [...document.querySelectorAll("div")].filter((d) =>
      /^grid grid-cols-7/.test(d.className || ""),
    );
    const dow = grids.find((g) => (g.className || "").includes("mb-2"));
    const month = grids.find((g) => !(g.className || "").includes("mb-2"));
    return {
      titleCls: h2?.className ?? "",
      dowGridCount: grids.length,
      dowKids: dow?.children.length ?? 0,
      monthKids: month?.children.length ?? 0,
      dowLabelCls: dow?.children[0]?.className ?? "",
    };
  });
  expect(anatomy.titleCls).toBe("text-xl sm:text-2xl font-bold text-gray-900");
  expect(anatomy.dowGridCount).toBe(2);
  expect(anatomy.dowKids).toBe(7);
  expect(anatomy.monthKids).toBeGreaterThanOrEqual(35);
  expect(anatomy.dowLabelCls).toBe(
    "text-center text-xs sm:text-sm font-semibold text-gray-600 py-2",
  );
});

test("the accounts table card is borderless — no Card-primitive border leak (S16-P5)", async ({ page }) => {
  // The reference's entity table cards are plain `bg-white rounded-lg
  // shadow` divs (0px border). Our Card base ships `border border-line`
  // and cn() cannot remove it — the fix renders plain divs.
  await page.goto("/accounts");

  const card = await page.evaluate(() => {
    const el = [...document.querySelectorAll("div")].find(
      (d) => (d.className || "").includes("rounded-lg shadow") && d.querySelector("table"),
    );
    if (!el) return { cls: "NOT FOUND", border: "-1" };
    return {
      cls: el.className,
      border: getComputedStyle(el).borderTopWidth,
    };
  });
  expect(card.border).toBe("0px");
  expect(card.cls).not.toMatch(/border-line/);
  expect(card.cls).not.toMatch(/overflow-hidden/);
});

// ---------------------------------------------------------------------------
// Session-17: the stock button/checkbox layer + the icon-glyph census
// ---------------------------------------------------------------------------

test("the topbar account trigger is the stock ghost Button + two-level avatar (S17-P1)", async ({ page }) => {
  // Reference trigger: the full stock ghost construction (incl. the 1px
  // focus-visible ring) + the stock two-level Avatar (a rounded-full root
  // span wrapping a fallback div with the initial).
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Account menu" });
  await expect(trigger).toBeVisible();

  const cls = await trigger.getAttribute("class");
  expect(cls).toContain("focus-visible:ring-1");
  expect(cls).toContain("focus-visible:ring-ring");
  expect(cls).toContain("whitespace-nowrap");
  expect(cls).toContain("font-medium");
  expect(cls).toContain("h-9 px-4 py-2");
  expect(cls).toContain("hover:bg-line-soft");

  // The two-level avatar: root span.rounded-full > fallback div
  const avatarRoot = trigger.locator("span.rounded-full");
  await expect(avatarRoot).toBeVisible();
  const fallback = avatarRoot.locator("div");
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveText(/^[A-Z]$/);
});

test("the sidebar Accounts nav ships the users glyph (S17-P2a)", async ({ page }) => {
  // The reference's sidebar: Accounts = `users` (two-person), Contacts =
  // `circle-user`, Calendar = `calendar` — all three renamed-but-equal
  // exports in lucide 0.525. The glyph census, e2e-pinned.
  await page.goto("/");

  const accountsLink = page.getByRole("link", { name: "Accounts" }).first();
  await expect(accountsLink.locator("svg.lucide-users")).toBeVisible();
  await expect(page.getByRole("link", { name: "Contacts" }).first().locator("svg.lucide-circle-user")).toBeVisible();
  await expect(page.getByRole("link", { name: "Calendar" }).first().locator("svg.lucide-calendar:not(.lucide-calendar-days)")).toBeVisible();
});

test("the accounts tier filters render stock button checkboxes (S17-P3)", async ({ page }) => {
  // Reference: 4 button[role=checkbox] on the accounts rail (Key
  // Account/A/B/C) — zero native checkbox inputs on the page.
  await page.goto("/accounts");

  const rail = page.locator("main .rounded-xl", { hasText: "Tier" });
  await expect(rail.locator("button[role='checkbox']")).toHaveCount(4);
  const nativeInputs = await page.locator("main input[type='checkbox']").count();
  expect(nativeInputs).toBe(0);

  // The stock anatomy: aria-checked + data-state on the first toggle.
  const first = rail.locator("button[role='checkbox']").first();
  await expect(first).toHaveAttribute("aria-checked", "false");
  await expect(first).toHaveAttribute("data-state", "unchecked");

  // Clicking toggles to checked with the Check indicator mounted.
  await first.click();
  await expect(first).toHaveAttribute("data-state", "checked");
  await expect(first.locator("svg.lucide-check")).toBeVisible();
  // The checked fill is the reference's DARK #171717. v4 serializes
  // getComputedStyle colors as lab() strings (§16g.4), so normalize
  // through a 1×1 canvas pixel readback.
  const bg = await first.evaluate((el) => {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = getComputedStyle(el).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  });
  expect(bg).toBe("rgb(23, 23, 23)");
});

test("the blue primary buttons carry the bare shadow scale (S17-P4)", async ({ page }) => {
  // Reference New Account: `… shadow … bg-blue-600 hover:bg-blue-700` —
  // computed rgba(0,0,0,.1) 0 1px 3px 0 (the BARE scale; ours was
  // shadow-sm, one step light).
  await page.goto("/accounts");

  const btn = page.getByRole("button", { name: "New Account" });
  await expect(btn).toBeVisible();
  const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).toContain("rgba(0, 0, 0, 0.1) 0px 1px 3px 0px");
  expect(shadow).toContain("rgba(0, 0, 0, 0.1) 0px 1px 2px -1px");
});

// ---------------------------------------------------------------------------
// Session-18: the document metadata layer (S18-P1..P4). The reference ships
// a 405-char meta description, the full OG/Twitter card set, a PNG favicon,
// /sitemap.xml (9 URLs) and a robots.txt with a Sitemap line — all probed
// live on 2026-10-01. These run against the standalone build's SSR <head>.
// ---------------------------------------------------------------------------

test("the head ships the reference meta description (S18-P1)", async ({ page }) => {
  await page.goto("/");
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description).toBe(
    "NEO CRM is a clean, intuitive customer relationship management platform designed to help teams manage accounts, contacts, and leads in one centralized dashboard. With powerful search, clear account tracking, activity monitoring, and built-in reporting, NEO CRM keeps your client data organized, accessible, and actionable—so you can focus on building stronger relationships and closing more opportunities.",
  );
});

test("the head ships the OpenGraph + Twitter card family (S18-P2)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "NEO CRM",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "NEO CRM",
  );
  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogImage).toContain("/og-image.png");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    "NEO CRM",
  );
  const twitterUrl = await page
    .locator('meta[name="twitter:url"]')
    .getAttribute("content");
  expect(twitterUrl).toBeTruthy();
});

test("the head ships the file-convention favicon link (S18-P3)", async ({ page }) => {
  await page.goto("/");
  const icon = page.locator('link[rel="icon"]');
  await expect(icon).toHaveCount(1);
  const href = await icon.getAttribute("href");
  expect(href).toContain("icon.png");
  // And the asset itself resolves.
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
});

test("robots.txt serves the Sitemap line (S18-P4)", async ({ page }) => {
  const res = await page.request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const text = await res.text();
  expect(text).toContain("User-agent: *");
  expect(text).toMatch(/Allow:\s*\//);
  expect(text).toMatch(/Sitemap:\s*.+\/sitemap\.xml/);
});

test("sitemap.xml serves the nine real routes (S18-P4)", async ({ page }) => {
  const res = await page.request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const route of [
    "/",
    "/accounts",
    "/contacts",
    "/leads",
    "/calendar",
    "/activities",
    "/reports",
    "/settings",
    "/profile",
  ]) {
    expect(xml).toContain(`<loc>http://localhost:3000${route === "/" ? "/" : route}</loc>`);
  }
  expect(xml).toContain("<changefreq>weekly</changefreq>");
  expect(xml).toContain("<priority>1.0</priority>");
  expect(xml).toContain("<priority>0.8</priority>");
  // The reference's capitalized locs are its case-insensitive-platform
  // quirk — our sitemap lists only routes our case-sensitive router
  // actually serves.
  expect(xml).not.toContain("/Accounts");
});

// ---------------------------------------------------------------------------
// Session-19: the PWA/installable + per-route metadata layer (S19-P1..P8).
// The reference ships a web app manifest, the #000000 theme-color, the
// apple/mobile-web-app meta family + apple-touch-icon, PER-ROUTE
// canonical/OG/Twitter (og:title "X | NEO CRM", og:url origin+route,
// og:description "<Page> on NEO CRM. " + the 405-char paragraph), a
// type=tel Contact phone field, zero datalists, and the specific avatar
// accept list — all probed live on 2026-10-01.
// ---------------------------------------------------------------------------

test("manifest.json serves the reference's installable manifest (S19-P1)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  const res = await page.request.get("/manifest.json");
  expect(res.status()).toBe(200);
  const manifest = (await res.json()) as Record<string, unknown>;
  expect(manifest.name).toBe("NEO CRM");
  expect(manifest.short_name).toBe("NEO CRM");
  expect(manifest.display).toBe("standalone");
  expect(manifest.theme_color).toBe("#000000");
  expect(manifest.background_color).toBe("#ffffff");
  const icons = manifest.icons as Array<{ src: string; sizes: string }>;
  expect(icons).toHaveLength(2);
  expect(icons.map((i) => i.sizes).sort()).toEqual(["192x192", "512x512"]);
  // The reference's same-src quirk, self-hosted as our app icon.
  expect(icons[0].src).toBe(icons[1].src);
  expect(icons[0].src).toContain("/icon.png");
});

test("the head ships the reference's #000000 theme-color + PWA metas (S19-P2, S19-P3)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#000000",
  );
  await expect(
    page.locator('meta[name="mobile-web-app-capable"]'),
  ).toHaveAttribute("content", "yes");
  await expect(
    page.locator('meta[name="apple-mobile-web-app-status-bar-style"]'),
  ).toHaveAttribute("content", "black");
  await expect(
    page.locator('meta[name="apple-mobile-web-app-title"]'),
  ).toHaveAttribute("content", "NEO CRM");
});

test("the apple-touch-icon link resolves to a real asset (S19-P3)", async ({ page }) => {
  await page.goto("/");
  const apple = page.locator('link[rel="apple-touch-icon"]');
  await expect(apple).toHaveCount(1);
  const href = await apple.getAttribute("href");
  expect(href).toBeTruthy();
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("inner pages ship PER-ROUTE canonical + OG/Twitter (S19-P4, S19-P5)", async ({ page }) => {
  await page.goto("/accounts");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Accounts | NEO CRM",
  );
  const ogUrl = await page
    .locator('meta[property="og:url"]')
    .getAttribute("content");
  expect(ogUrl).toMatch(/\/accounts$/);
  const ogDesc = await page
    .locator('meta[property="og:description"]')
    .getAttribute("content");
  expect(ogDesc?.startsWith("Accounts on NEO CRM. ")).toBe(true);
  expect(ogDesc).toContain("customer relationship management platform");
  const twitterUrl = await page
    .locator('meta[name="twitter:url"]')
    .getAttribute("content");
  expect(twitterUrl).toMatch(/\/accounts$/);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    "Accounts | NEO CRM",
  );
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toMatch(/\/accounts$/);
});

test("the dashboard keeps the unprefixed root metadata family (S19-P4)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "NEO CRM",
  );
  const ogDesc = await page
    .locator('meta[property="og:description"]')
    .getAttribute("content");
  expect(ogDesc?.startsWith("NEO CRM is a clean")).toBe(true);
  // Next's URL resolution strips the root's trailing slash (the
  // reference's canonical is origin/ WITH the slash — verified live that
  // Next emits the slashless form either way; the s18 "viewport 1 vs
  // 1.0" cosmetic-serialization class, documented in AGENTS).
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toMatch(/^http:\/\/localhost:3000\/?$/);
  const twitterUrl = await page
    .locator('meta[name="twitter:url"]')
    .getAttribute("content");
  expect(twitterUrl).toMatch(/^http:\/\/localhost:3000\/?$/);
});

test("the New Contact dialog types Phone as tel with no datalists (S19-P6, S19-P7, S19-P8)", async ({ page }) => {
  await page.goto("/contacts");
  await page.getByRole("button", { name: "New Contact" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // The reference's Contact Phone is type=tel (its Lead dialog Phone is
  // plain text — its own inconsistency, mirrored).
  expect(await dialog.getByLabel("Phone").getAttribute("type")).toBe("tel");
  // Zero datalist suggestions anywhere in the dialog.
  expect(await dialog.locator("datalist").count()).toBe(0);
  expect(await dialog.locator("input[list]").count()).toBe(0);
  // The avatar file input accepts exactly the reference's MIME list.
  const accept = await dialog
    .locator('input[type="file"]')
    .getAttribute("accept");
  expect(accept).toBe("image/jpeg,image/png,image/jpg");
});

// ---------------------------------------------------------------------------
// Session-20 — the HTTP response-header layer. The reference's edge
// (Cloudflare/Caddy) injects a three-header security set on EVERY response
// (HTML routes, authed routes, the CSS asset, manifest, its SPA-fallback
// 200s — curl-verified on 10+ responses). The self-hosted expression is
// next.config.ts headers(). HSTS is inert over the plain-HTTP test server
// (RFC 6797 §7.1: a UA MUST NOT process it over non-secure transport) but
// ships for parity + any HTTPS self-hosted deploy.
// ---------------------------------------------------------------------------

test("every HTML route ships the reference's security-header set (S20-P1, S20-P2, S20-P3)", async ({ page }) => {
  for (const route of ["/", "/login", "/accounts"]) {
    const res = await page.request.get(route);
    expect(res.status()).toBe(route === "/login" ? 200 : 200);
    const headers = res.headers();
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["strict-transport-security"]).toBe("max-age=31536000");
  }
});

test("static assets ship the security-header set too (S20-P1, S20-P2)", async ({ page }) => {
  await page.goto("/");
  // The reference sets the same set on its hashed CSS asset (verified on
  // /static/index-*.css).
  const cssHref = await page
    .locator('link[rel="stylesheet"]')
    .first()
    .getAttribute("href");
  expect(cssHref).toBeTruthy();
  const res = await page.request.get(cssHref!);
  expect(res.status()).toBe(200);
  const headers = res.headers();
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["content-type"]).toContain("text/css");
});

test("sitemap.xml serves the reference's bare application/xml content-type (S20-P4)", async ({ page }) => {
  const res = await page.request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  // GET-verified on the reference: bare `application/xml` — no charset
  // suffix (the s18 "viewport 1 vs 1.0" cosmetic-serialization class).
  expect(res.headers()["content-type"]).toBe("application/xml");
});

test("manifest.json + robots.txt keep their reference-matching content-types (regression)", async ({ page }) => {
  const manifest = await page.request.get("/manifest.json");
  expect(manifest.status()).toBe(200);
  expect(manifest.headers()["content-type"]).toBe("application/json");
  const robots = await page.request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toBe("text/plain; charset=utf-8");
});

// ---------------------------------------------------------------------------
// Session 22 — the typography / base-cascade layer (S22-P1/P2/P3)
// ---------------------------------------------------------------------------

test("the app ships ZERO webfonts and the stock system font stack (S22-P1)", async ({ page }) => {
  await page.goto("/");
  // The reference's computed body family is Tailwind's stock default
  // stack (byte-extracted from its preflight html rule); it loads NO
  // webfont anywhere (document.fonts empty, zero @font-face in its
  // 79.5KB stylesheet). Our Inter webfont rendered every text surface
  // in the wrong typeface (measured ~6% narrower regular / ~14%
  // narrower bold on the same string) — retired this session.
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family).toContain("ui-sans-serif");
  expect(family).toContain("system-ui");
  expect(family).not.toContain("Inter");
  // Count only APP fonts: Next's dev overlay registers __nextjs-Geist
  // faces in dev mode (status "unloaded"); the production build ships
  // neither. The reference loads ZERO webfonts — the pin survives both.
  const loadedFonts = await page.evaluate(
    () =>
      [...document.fonts].filter(
        (f) => !f.family.startsWith("__nextjs") && f.status === "loaded",
      ).length,
  );
  expect(loadedFonts).toBe(0);
  // The h1 computes the same stock stack (no per-surface family).
  const h1Family = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).fontFamily : "";
  });
  expect(h1Family).toContain("ui-sans-serif");
  expect(h1Family).not.toContain("Inter");
});

test("the login page computes the same stock stack — no webfont anywhere (S22-P1)", async ({ page }) => {
  await page.goto("/login");
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family).toContain("ui-sans-serif");
  expect(family).not.toContain("Inter");
  const loadedFonts = await page.evaluate(
    () =>
      [...document.fonts].filter(
        (f) => !f.family.startsWith("__nextjs") && f.status === "loaded",
      ).length,
  );
  expect(loadedFonts).toBe(0);
});

test("the body computes default auto font smoothing — no antialiased (S22-P2)", async ({ page }) => {
  await page.goto("/");
  // The reference ships zero font-smoothing rules (computed `auto` and
  // no text-rendering override); our scaffold-era double antialiased
  // (the html CSS rule + the body utility) rendered thinner text on
  // macOS — both retired this session.
  const smoothing = await page.evaluate(
    () =>
      (getComputedStyle(document.body) as CSSStyleDeclaration & {
        webkitFontSmoothing?: string;
      }).webkitFontSmoothing,
  );
  expect(smoothing).toBe("auto");
  const textRendering = await page.evaluate(
    () => getComputedStyle(document.body).textRendering,
  );
  expect(textRendering).toBe("auto");
});

// ---- Session 25: the loading-state + export/button-contract layer ------

test("the reports period dropdown ships the reference's 6 options (S25-P6)", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByRole("heading", { name: "Reports & Analytics" })).toBeVisible();
  // The reference's expanded listbox (live-probed): Today / This Week /
  // This Month / This Quarter / YTD / All Time — the This Year option and
  // the this_* vocabulary are retired.
  await page.getByRole("combobox").first().click();
  for (const label of ["Today", "This Week", "This Month", "This Quarter", "YTD", "All Time"]) {
    await expect(page.getByRole("option", { name: label })).toBeVisible();
  }
  await expect(page.getByRole("option", { name: "This Year" })).toHaveCount(0);
});

test("the dashboard renders KPI cards immediately — zero skeleton pass (S25-P1)", async ({ page }) => {
  await page.goto("/");
  // The reference's instant-render model: the full page (KPI cards with
  // zeros/real values) renders from FIRST paint — no animate-pulse family
  // ever mounts (live-verified with the entity-fetch-abort probe on the
  // reference + the delayed-fetch harness on our clone).
  await expect(page.getByText("Total Leads").first()).toBeVisible();
  await expect(page.getByText("Conversion Rate").first()).toBeVisible();
  const pulse = await page.evaluate(() => document.querySelectorAll(".animate-pulse").length);
  expect(pulse).toBe(0);
});

test("the reports header PDF downloads a real client-side PDF (S25-P2)", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByRole("heading", { name: "Reports & Analytics" })).toBeVisible();
  // The reference's header PDF: html2canvas + jsPDF → an A4 portrait
  // multi-page artifact downloading as crm_reports_YYYY-MM-DD.pdf — no
  // print dialog, no toast.
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "PDF", exact: true }).click();
  const download = await downloadPromise;
  const name = download.suggestedFilename();
  expect(name).toMatch(/^crm_reports_\d{4}-\d{2}-\d{2}\.pdf$/);
  const path = await download.path();
  const { readFileSync } = await import("node:fs");
  const head = readFileSync(path!).subarray(0, 5).toString();
  expect(head).toBe("%PDF-");
});

test("the per-table Export PDF downloads the reference's text artifact (S25-P2)", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByRole("tab", { name: "Pipeline & Forecast" })).toBeVisible();
  await page.getByRole("tab", { name: "Pipeline & Forecast" }).click();
  await expect(page.getByText("Open Deals by Stage")).toBeVisible();
  // The reference's per-table family: a TEXT jsPDF downloading as
  // <slug>_YYYY-MM-DD.pdf — "Open Deals by Stage" → open_deals_by_stage.
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export PDF" })
    .first()
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^open_deals_by_stage_\d{4}-\d{2}-\d{2}\.pdf$/);
});

test("the per-table Export CSV downloads the table's own columns (S25-P5)", async ({ page }) => {
  await page.goto("/reports");
  await page.getByRole("tab", { name: "Pipeline & Forecast" }).click();
  await expect(page.getByText("Open Deals by Stage")).toBeVisible();
  // The reference's per-table CSV: a client-side blob with the table's
  // OWN headers (Deal,Stage,Amount) downloading as open_deals_YYYY-MM-DD.csv.
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export CSV" })
    .nth(1)
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^open_deals_\d{4}-\d{2}-\d{2}\.csv$/);
});

test("the Save Custom Report View round-trip (S25-P4)", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByRole("heading", { name: "Reports & Analytics" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Saved Reports (0)" })).toBeVisible();

  // Open the dialog — the reference's exact structure.
  await page.getByRole("button", { name: "Saved Reports (0)" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Save Custom Report View" })).toBeVisible();
  await expect(page.getByPlaceholder("e.g., Q1 Won Deals by Region")).toBeVisible();
  // The 6 column checkboxes + the 3-dimension Current Filters summary.
  for (const col of ["Name", "Account", "Owner", "Value", "Stage", "Won Date"]) {
    await expect(page.getByRole("checkbox", { name: col })).toBeVisible();
  }
  await expect(page.getByText(/Current Filters:/)).toBeVisible();
  // Save Report disabled until named.
  await expect(page.getByRole("button", { name: "Save Report" })).toBeDisabled();

  // Save → the count updates + the dialog closes.
  await page.getByPlaceholder("e.g., Q1 Won Deals by Region").fill("E2E Probe View");
  await page.getByRole("button", { name: "Save Report" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Saved Reports (1)" })).toBeVisible();

  // Re-open: the saved list shows the name + date + Load.
  await page.getByRole("button", { name: "Saved Reports (1)" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("E2E Probe View")).toBeVisible();
  await expect(page.getByRole("button", { name: "Load" })).toBeVisible();
  // Load → applies + closes.
  await page.getByRole("button", { name: "Load" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // Cleanup: clear the localStorage state for the later runs.
  await page.evaluate(() => window.localStorage.removeItem("crm_saved_reports"));
});

// ---------------------------------------------------------------------------
// Session-26 (S26-P1..P6): the Settings Data-tab + import/export contract
// layer — the descriptions, the template artifacts, the raw-dump exports,
// the page-level quoted CSVs, the reset's native dialogs, and the rebuilt
// Import Contacts dialog. The reset test runs LAST (its wipe must not
// poison earlier assertions).
// ---------------------------------------------------------------------------

test("the Settings Data tab ships the three CardDescriptions (S26-P1)", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Data" }).click();
  await expect(page.getByText("Download CSV templates for bulk imports")).toBeVisible();
  await expect(page.getByText("Export your CRM data to CSV")).toBeVisible();
  await expect(page.getByText("Permanently delete all CRM data. This cannot be undone.")).toBeVisible();
});

test("the template buttons download the static artifacts (S26-P3)", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Data" }).click();
  const pairs: [string, string, string][] = [
    ["Download Contacts Template", "contacts_template.csv", "name,email,phone,company,position,source"],
    ["Download Accounts Template", "accounts_template.csv", "name,industry,website,phone,email,annual_revenue,employees,status"],
    ["Download Leads Template", "leads_template.csv", "name,email,phone,company,status,source,value"],
  ];
  for (const [label, filename, head] of pairs) {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: label }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(filename);
    const path = await download.path();
    const { readFileSync } = await import("node:fs");
    const body = readFileSync(path!, "utf8");
    expect(body.startsWith(head)).toBe(true);
    expect(body).toContain("\n");
  }
});

test("the settings export buttons download the raw-dump CSVs (S26-P4)", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Data" }).click();
  // Let the layout hydrate land (the raw dump no-ops at zero rows — the
  // reference downloads an EMPTY file then, but the seeded e2e workspace
  // must produce the quoted raw rows for the content assertions).
  await page.waitForTimeout(600);
  // The reference's m(entity): the header is the FIRST ROW's own keys and
  // every value is double-quoted — singular prefixes + ISO dates.
  const pairs: [string, RegExp][] = [
    ["Export Contacts", /^contact_\d{4}-\d{2}-\d{2}\.csv$/],
    ["Export Accounts", /^account_\d{4}-\d{2}-\d{2}\.csv$/],
    ["Export Leads", /^lead_\d{4}-\d{2}-\d{2}\.csv$/],
    ["Export Activities", /^activity_\d{4}-\d{2}-\d{2}\.csv$/],
  ];
  for (const [label, namePattern] of pairs) {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: label }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(namePattern);
    const path = await download.path();
    const { readFileSync } = await import("node:fs");
    const body = readFileSync(path!, "utf8");
    // Seeded e2e data → the first line is the raw key order, quoted cells.
    const firstLine = body.split("\n")[0]!;
    expect(firstLine).toContain(",");
    expect(body.split("\n")[1]!).toMatch(/^"/);
  }
});

test("the contacts page export downloads the quoted 7-column CSV (S26-P5)", async ({ page }) => {
  await page.goto("/contacts");
  await expect(page.getByRole("heading", { name: "Contacts" })).toBeVisible();
  // Wait for the store's list to land (the header button enables once the
  // rows exist — the guard would no-op the download at zero rows).
  await expect(page.getByRole("button", { name: "Export CSV" }).first()).toBeEnabled();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).first().click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^contacts_\d{4}-\d{2}-\d{2}\.csv$/);
  const path = await download.path();
  const { readFileSync } = await import("node:fs");
  const body = readFileSync(path!, "utf8");
  expect(body.split("\n")[0]).toBe('"Name","Email","Phone","Company","Position","Status","Source"');
});

test("the accounts page export downloads the quoted 10-column CSV incl. Health (S26-P5)", async ({ page }) => {
  await page.goto("/accounts");
  await expect(page.getByRole("heading", { name: "Accounts" })).toBeVisible();
  // Wait for the store's list to land (the header button enables once the
  // rows exist — the toolbar guard would no-op the download at zero rows).
  await expect(page.getByRole("button", { name: "Export CSV" }).first()).toBeEnabled();
  // The toolbar button (enabled at any data state); the header one may be
  // disabled at zero data — use the toolbar instance.
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).last().click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^accounts_\d{4}-\d{2}-\d{2}\.csv$/);
  const path = await download.path();
  const { readFileSync } = await import("node:fs");
  const body = readFileSync(path!, "utf8");
  expect(body.split("\n")[0]).toBe(
    '"Name","Industry","Phone","Email","Website","Annual Revenue","Employees","Status","Tier","Health"',
  );
});

test("the Import Contacts dialog matches the reference's structure (S26-P6)", async ({ page }) => {
  await page.goto("/contacts");
  await page.getByRole("button", { name: "Import" }).click();
  const dlg = page.getByRole("dialog");
  await expect(dlg.getByRole("heading", { name: "Import Contacts" })).toBeVisible();
  await expect(dlg.getByText("Upload a CSV or Excel file with contact information")).toBeVisible();
  await expect(dlg.getByText("Select File")).toBeVisible();
  await expect(dlg.getByText("Click to upload CSV or Excel")).toBeVisible();
  await expect(dlg.getByText("CSV, XLS, XLSX")).toBeVisible();
  await expect(dlg.getByText("Required columns:")).toBeVisible();
  await expect(dlg.getByText("Optional columns:")).toBeVisible();
  // The Import button is disabled until a file is chosen; NO template link.
  await expect(dlg.getByRole("button", { name: "Import", exact: true })).toBeDisabled();
  await expect(dlg.getByRole("button", { name: "Cancel" })).toBeEnabled();
  await expect(dlg.getByText("Download the CSV template")).toHaveCount(0);
  await page.keyboard.press("Escape");
});

test("the import round-trip: file → result box → auto-close (S26-P6)", async ({ page }) => {
  await page.goto("/contacts");
  await page.getByRole("button", { name: "Import" }).click();
  await page.setInputFiles('input[type=file]', {
    name: "e2e-import.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("name,email,phone,company,position,source\nE2E Import,e2e-import@test.local,+1,Import Co,QA,website"),
  });
  // The chosen-file box shows the filename (the dropzone ALSO shows it in
  // its own text — the reference renders both; scope to the FIRST match).
  await expect(page.getByRole("dialog").getByText("e2e-import.csv").first()).toBeVisible();
  await page.getByRole("button", { name: "Import", exact: true }).click();
  // The green result box with the reference's message, then the 2s auto-close.
  await expect(page.getByText("Successfully imported 1 contact")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 6000 });
  // The contact was created (the row appears — the name renders in BOTH
  // the Table and Cards views, dual-mounted; scope to the first).
  await expect(page.getByText("E2E Import").first()).toBeVisible();
});

test("the reset flow: confirm + alert + wipe (S26-P2) — LAST (its wipe must not poison earlier assertions)", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Data" }).click();
  const dialogs: string[] = [];
  // First confirm → DECLINE (nothing happens); every later dialog → accept.
  let dismissFirstConfirm = true;
  page.on("dialog", async (d) => {
    dialogs.push(`${d.type()}:${d.message()}`);
    if (dismissFirstConfirm && d.type() === "confirm") {
      dismissFirstConfirm = false;
      await d.dismiss();
    } else {
      await d.accept();
    }
  });
  await page.getByPlaceholder("RESET").fill("RESET");
  const button = page.getByRole("button", { name: "Reset All Data" });
  await expect(button).toBeEnabled();
  // Decline: the input stays filled, no wipe.
  await button.click();
  await page.waitForTimeout(400);
  await expect(page.getByPlaceholder("RESET")).toHaveValue("RESET");
  // Accept the confirm on a second click.
  await button.click();
  await page.waitForTimeout(1500);
  // The reference's dialog vocabulary (bundle-extracted).
  expect(
    dialogs.some((m) =>
      m.includes("confirm:This will permanently delete all contacts, accounts, leads, opportunities, activities, and calendar events. Are you sure?"),
    ),
  ).toBe(true);
  expect(dialogs.some((m) => m.includes("alert:Data reset complete"))).toBe(true);
  // The input cleared + the button re-disabled.
  await expect(page.getByPlaceholder("RESET")).toHaveValue("");
  await expect(button).toBeDisabled();
  // The wipe landed: the dashboard's currency KPIs read zero (the dashboard
  // legacy format renders sub-1000 as the bare number — "$0").
  await page.goto("/Dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.waitForTimeout(600);
  const kpiText = await page.evaluate(() => document.body.innerText);
  expect(kpiText).toMatch(/\$0\b/);
  // And the contacts page shows its empty state.
  await page.goto("/contacts");
  await page.waitForTimeout(600);
  const body = await page.evaluate(() => document.body.innerText);
  expect(body).not.toContain("E2E Import");
});
