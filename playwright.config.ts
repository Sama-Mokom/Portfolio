import { existsSync } from "node:fs";
import path from "node:path";
import { chromium, defineConfig, devices } from "@playwright/test";

const localExecutable = path.join(
  path.resolve(".playwright"),
  ...chromium.executablePath().split(path.sep).slice(-3),
);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 180_000,
  expect: { timeout: 10_000 },
  outputDir: "test-results",
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...(!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(localExecutable)
      ? { launchOptions: { executablePath: localExecutable } }
      : {}),
    ...devices["Desktop Chrome"],
  },
  projects: [{ name: "chromium" }],
});
