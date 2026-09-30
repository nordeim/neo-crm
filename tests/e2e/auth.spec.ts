import { expect, test } from "@playwright/test";

// Logged-out surface (no storage state for this spec).

test.use({ storageState: { cookies: [], origins: [] } });

test("login page renders the NEO CRM card", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("rejects wrong credentials with a visible error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("sepnetflix2023@outlook.com");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /Incorrect email or password/i }),
  ).toBeVisible();
});

test("unauthenticated visits redirect to /login", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("**/login");
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toBeVisible();
});

// Session-11 (S11-P1): the reference's Forgot-password flow — an in-card
// view swap (no URL change). The reset view replaces the login column (no
// logo / Google button / divider); the sent view is client-side only (the
// reference's demo never sends an email — no network call fires).
test("forgot password swaps the card to the reset view and back", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await expect(
    page.getByText("Enter your email and we’ll send you a link to reset your password"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to sign in" })).toBeVisible();
  // The login-only chrome is gone on the reset view.
  await expect(page.getByRole("button", { name: "Continue with Google" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toHaveCount(0);
  // The URL never changes — the swap is in-card.
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole("button", { name: "Back to sign in" }).click();
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("send reset link swaps to the check-your-email view", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
  await expect(
    page.getByText("We’ve sent password reset instructions to"),
  ).toBeVisible();
  await expect(page.getByText("demo@example.com")).toBeVisible();
  await expect(
    page.getByText("Please check your email for the password reset link."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Back to sign in" }).click();
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toBeVisible();
});
