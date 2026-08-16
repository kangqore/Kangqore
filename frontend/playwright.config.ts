import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 4 : undefined,
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: isCI ? 'npm run preview -- --host 127.0.0.1 --port 3000' : 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})
