import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',

  // Fail fast — a white screen is a showstopper
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: 'http://localhost:5174',
    // Capture a screenshot on every failure for easy post-mortem
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  // Start the Vite dev server before running tests.
  // In CI: always starts a fresh server.
  // Locally: reuses an already-running server to keep iteration fast.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
