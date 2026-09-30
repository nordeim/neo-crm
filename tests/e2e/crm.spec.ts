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
  // the default view (period=quarter, owner/stage/status=all) must show the
  // seeded pipeline, not zeros. (Won-deal value is stable: the lead created
  // by the earlier test is stage "new" and never reaches this quarter's
  // won total.)
  await expect(page.getByText("$542.0k").first()).toBeVisible();

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
