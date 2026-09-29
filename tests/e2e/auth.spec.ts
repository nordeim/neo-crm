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
