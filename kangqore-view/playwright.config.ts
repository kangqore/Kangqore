import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',

  // Fail fast — a white screen is a showstopper
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: process.env.CI ? 'github' : 'list',

  use: {
    // Default: test directly against Vite (fast, no CRA proxy needed for smoke tests)
    baseURL: 'http://localhost:5174',
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
    // Primary: smoke tests via Vite (fast, isolated, no backend needed)
    { name: 'chromium',      use: { ...devices['Desktop Chrome'] } },

    // Proxy smoke: same tests but routed through the CRA dev proxy at :3000.
    // Catches proxy config regressions (e.g. missing /node_modules/vite rule).
    // Only runs when PROXY_SMOKE=1 — kept off by default to avoid requiring
    // two running dev servers in normal CI.
    ...(process.env.PROXY_SMOKE ? [{
      name: 'chromium-via-proxy',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
      },
    }] : []),
  ],
})
