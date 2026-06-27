import { test, expect } from "@playwright/test";

test.describe("Payments smoke", () => {
  test("pricing page renders ₹599 lifetime CTA", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: /lifetime access/i })).toBeVisible();
    await expect(page.getByText(/₹599/)).toBeVisible();
    await expect(page.getByRole("button", { name: /get lifetime access/i })).toBeVisible();
  });

  test("Razorpay checkout script loads on /pricing", async ({ page }) => {
    await page.goto("/pricing");
    // The page eagerly injects the Razorpay checkout script on mount.
    await page.waitForFunction(
      () => !!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]'),
      { timeout: 10_000 },
    );
  });

  test("clicking pay without auth redirects to /auth", async ({ page }) => {
    await page.goto("/pricing");
    await page.getByRole("button", { name: /get lifetime access/i }).click();
    await page.waitForURL(/\/auth/, { timeout: 10_000 });
    expect(page.url()).toMatch(/\/auth/);
  });
});
