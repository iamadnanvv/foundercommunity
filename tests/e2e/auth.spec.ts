import { test, expect } from "@playwright/test";

test.describe("Auth smoke", () => {
  test("landing page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FounderHunt/i);
  });

  test("auth page renders sign-in form", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@startup\.com/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible();
  });

  test("protected /dashboard redirects to /auth when signed out", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/auth/, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/auth/);
  });

  test("can switch to sign-up mode", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.getByPlaceholder(/jane founder/i)).toBeVisible();
  });
});
