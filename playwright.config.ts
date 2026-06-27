import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for smoke tests covering the critical paths:
 * - Public landing & auth screen render correctly
 * - /pricing renders and lazy-loads Razorpay checkout
 * - Protected routes redirect unauthenticated users to /auth
 *
 * These tests do NOT execute a real Razorpay payment; they verify the
 * checkout surface loads and the server function endpoints are wired.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:8080",
    trace: "on-first-retry",
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "bun run preview --port 8080",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
