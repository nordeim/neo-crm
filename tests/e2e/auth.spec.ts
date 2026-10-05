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
  // Session-21 (S21-P1): the reference's banner text — "Invalid email or
  // password" (was "Incorrect…", wrong-password probes on both apps). And
  // S21-P2: ZERO toasts fire on the auth flows — the banner is the only
  // surface (the reference's login failure renders no sonner toast).
  await expect(
    page.getByRole("alert").filter({ hasText: /Invalid email or password/i }),
  ).toBeVisible();
  // The Callout vocabulary (bg-red-50/70) — scoped past Next's built-in
  // route announcer, which also carries role=alert.
  await expect(
    page.getByRole("alert").filter({ hasText: /Invalid email or password/i }),
  ).toHaveClass(/bg-red-50\/70/);
  // S21-P2: ZERO toast cards fire (the empty Notifications region itself
  // ships on both apps — the reference's sonner viewport included).
  await expect(page.getByRole("status")).toHaveCount(0);
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

// ---------------------------------------------------------------------
// Session-21 (S21-P4/P5): the reference's in-place signup + verify-email
// views — "Need an account? Sign up" is an onclick BUTTON that swaps the
// card (the s10 pin's "dead login button" claim disproven live): a minimal
// form (Email / Password / Confirm Password — NO name field, NO Google
// button, NO divider), then the verify view with six single-digit inputs
// and the attempts ladder. All DOM-verified on the reference 2026-10-01.

test("need an account swaps the card to the minimal signup view and back", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Need an account? Sign up" }).click();

  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Confirm Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to sign in" })).toBeVisible();

  // The login-only chrome is GONE on the signup view (the reference's
  // column-replacement architecture, same as the reset view).
  await expect(page.getByRole("button", { name: "Continue with Google" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toHaveCount(0);
  // The URL never changes — the swap is in-card.
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole("button", { name: "Back to sign in" }).click();
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("signup view guards mismatched confirm passwords", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Need an account? Sign up" }).click();

  await page.getByLabel("Email").fill("mismatch@example.com");
  await page.getByLabel("Password", { exact: true }).fill("TestPass123");
  await page.getByLabel("Confirm Password").fill("DifferentPass");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(
    page.getByRole("alert").filter({ hasText: "Passwords do not match" }),
  ).toBeVisible();
  // Still on the signup view (no navigation, no network call for the guard).
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
});

test("a fresh signup swaps to the verify-email view with its ladder", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Need an account? Sign up" }).click();

  const signupEmail = `e2e-verify-${Date.now()}@example.com`;
  await page.getByLabel("Email").fill(signupEmail);
  await page.getByLabel("Password", { exact: true }).fill("TestPass123");
  await page.getByLabel("Confirm Password").fill("TestPass123");
  await page.getByRole("button", { name: "Create account" }).click();

  // The verify view: the envelope tile + h2 + the email line + six inputs.
  await expect(page.getByRole("heading", { name: "Verify your email" })).toBeVisible();
  await expect(page.getByText("We’ve sent a 6-digit code to")).toBeVisible();
  await expect(page.getByText(signupEmail)).toBeVisible();
  for (let i = 1; i <= 6; i += 1) {
    await expect(page.getByLabel(`Digit ${i}`)).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Verify email" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resend" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Back to sign in" })).toBeVisible();

  // The incomplete guard: submitting with no digits.
  await page.getByRole("button", { name: "Verify email" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Please enter all 6 digits" }),
  ).toBeVisible();

  // The wrong-code ladder: one wrong submission → 4 remaining.
  for (let i = 1; i <= 6; i += 1) {
    await page.getByLabel(`Digit ${i}`).fill(String(i % 10));
  }
  await page.getByRole("button", { name: "Verify email" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Invalid verification code. 4 attempts remaining." }),
  ).toBeVisible();

  // The resend: the green info Callout (auto-dismissing on the reference).
  await page.getByRole("button", { name: "Resend" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "New verification code sent to your email" }),
  ).toBeVisible();
});

// Session-67 (N-67 family coverage closure): the ladder beyond rung 1 —
// the 67-c rotation found the attempts 2→5 climb, the lockout repeat,
// and the post-lockout resend never driven anywhere. Six wrong
// submissions against a throwaway signup (the verify budget is 20/IP —
// the sibling test above spends 1 POST: its incomplete-guard click is
// blocked CLIENT-SIDE before the fetch; this one spends 6 — 7 total
// per run, comfortably under the ceiling).
test("the wrong-code ladder climbs to lockout and repeats its message", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Need an account? Sign up" }).click();

  const signupEmail = `e2e-lockout-${Date.now()}@example.com`;
  await page.getByLabel("Email").fill(signupEmail);
  await page.getByLabel("Password", { exact: true }).fill("TestPass123");
  await page.getByLabel("Confirm Password").fill("TestPass123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: "Verify your email" })).toBeVisible();

  const submitWrongCode = async () => {
    for (let i = 1; i <= 6; i += 1) {
      await page.getByLabel(`Digit ${i}`).fill(String((i + 4) % 10));
    }
    await page.getByRole("button", { name: "Verify email" }).click();
  };

  // Rungs 1-4: the attempts-remaining countdown (4 down to 1).
  for (let remaining = 4; remaining >= 1; remaining -= 1) {
    await submitWrongCode();
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: `Invalid verification code. ${remaining} attempts remaining.` }),
    ).toBeVisible();
  }

  // Rung 5: the lockout banner.
  await submitWrongCode();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Too many failed attempts. Please request a new verification code." }),
  ).toBeVisible();

  // Rung 6: the lockout message REPEATS (the ladder does not reset on
  // its own — the resend is the only recovery path).
  await submitWrongCode();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Too many failed attempts. Please request a new verification code." }),
  ).toBeVisible();

  // The post-lockout resend: the non-leaking info banner (the route
  // answers identically for a locked-out account and resets the ladder
  // server-side).
  await page.getByRole("button", { name: "Resend" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "New verification code sent to your email" }),
  ).toBeVisible();
});

test("the /signup page renders the same minimal signup view", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Confirm Password")).toBeVisible();
  // The reference 404s /signup (our documented working superset page) —
  // its content mirrors the reference's real signup form: no Google
  // button, no divider, no name field.
  await expect(page.getByRole("button", { name: "Continue with Google" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Welcome to NEO CRM" })).toHaveCount(0);
});
