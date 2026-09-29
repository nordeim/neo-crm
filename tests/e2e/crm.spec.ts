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

  // Charts + lists
  await expect(page.getByRole("heading", { name: "Sales Pipeline by Stage" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Revenue Over Time" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Top Performing Sales Reps" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent Deals" })).toBeVisible();

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
