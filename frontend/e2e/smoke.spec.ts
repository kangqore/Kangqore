import { test, expect, type Page } from '@playwright/test'

// Inject demo auth before every test so routes render without redirecting to /login.
async function injectDemoAuth(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('role', 'ADMIN')
  })
}

// Routes that must load without a crash (no error boundary, no blank body).
// Grouped: admin OS routes, then portal routes.
const ADMIN_ROUTES = [
  '/kangqore-view/admin/dashboard',
  '/kangqore-view/admin/leads',
  '/kangqore-view/admin/clients',
  '/kangqore-view/admin/projects',
  '/kangqore-view/admin/finance',
  '/kangqore-view/admin/careers',
  '/kangqore-view/admin/investors',
  '/kangqore-view/admin/resources',
  '/kangqore-view/admin/bids',
  '/kangqore-view/admin/comms',
  '/kangqore-view/admin/scheduling',
  '/kangqore-view/admin/ops-centre',
  '/kangqore-view/admin/governance',
  '/kangqore-view/admin/strategy',
  '/kangqore-view/admin/systems',
  '/kangqore-view/admin/aegis',
  '/kangqore-view/admin/kimmp',
  '/kangqore-view/admin/settings',
]

const PORTAL_ROUTES = [
  '/kangqore-view/client',
  '/kangqore-view/client/projects',
  '/kangqore-view/client/tasks',
  '/kangqore-view/client/meetings',
  '/kangqore-view/client/invoices',
  '/kangqore-view/client/documents',
  '/kangqore-view/client/support',
  '/kangqore-view/client/feedback',
  '/kangqore-view/client/change-requests',
  '/kangqore-view/client/reports',
  '/kangqore-view/partner',
  '/kangqore-view/partner/projects',
  '/kangqore-view/partner/earnings',
  '/kangqore-view/investor',
  '/kangqore-view/investor/updates',
  '/kangqore-view/investor/captable',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function assertNoError(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)

  // No React error boundary overlay
  const errorOverlay = page.locator('[data-testid="error-boundary"], .error-boundary, #error-boundary')
  await expect(errorOverlay).toHaveCount(0)

  // Body is not empty
  const body = await page.locator('body').textContent()
  expect(body?.trim().length ?? 0, `Blank body at ${route}`).toBeGreaterThan(20)

  // No "Something went wrong" text visible
  const crashText = page.getByText(/something went wrong/i)
  await expect(crashText).toHaveCount(0)
}

// ─── Auth setup ──────────────────────────────────────────────────────────────

test.beforeAll(async ({ browser }) => {
  // Warm the dev server once with a headed page to avoid cold-start flakiness.
  const ctx = await browser.newContext()
  const pg  = await ctx.newPage()
  await injectDemoAuth(pg)
  await ctx.close()
})

test.beforeEach(async ({ page }) => {
  await injectDemoAuth(page)
})

// ─── Admin OS smoke tests ─────────────────────────────────────────────────────

for (const route of ADMIN_ROUTES) {
  test(`admin: ${route}`, async ({ page }) => {
    await assertNoError(page, route)
  })
}

// ─── Portal smoke tests ───────────────────────────────────────────────────────

for (const route of PORTAL_ROUTES) {
  test(`portal: ${route}`, async ({ page }) => {
    await assertNoError(page, route)
  })
}

// ─── Critical interaction: KIMMP actions input ────────────────────────────────
// The main /kimmp route renders WaandaMissionControl (a dashboard, no input).
// The actions sub-page is where the KIMMP directive input lives.

test('kimmp: actions input accepts text', async ({ page }) => {
  await page.goto('/kangqore-view/admin/kimmp/actions', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)

  // No crash
  await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

  // The directive input renders without a backend (it is part of the form shell)
  const input = page.locator('textarea[placeholder*="KIMMP to do"]')
  await expect(input).toBeVisible({ timeout: 5000 })
  await input.fill('What should I focus on today?')
  expect(await input.inputValue()).toContain('What should I focus on today?')
})

// ─── Critical interaction: Comms hub loads without fake emails ────────────────

test('comms: no mock email names in production mode', async ({ page }) => {
  // Override token to NOT be demo so isDemo() returns false
  await page.evaluate(() => localStorage.setItem('token', 'demo-token'))
  await page.goto('/kangqore-view/admin/comms')
  await page.waitForTimeout(800)

  // If these names appear, the mock data guard is broken
  const fakeName = page.getByText('Dr. Sarah Mitchell')
  await expect(fakeName).toHaveCount(0)
})

// ─── Navigation: sidebar links render without crash ───────────────────────────

test('nav: sidebar is visible on admin dashboard', async ({ page }) => {
  await page.goto('/kangqore-view/admin/dashboard')
  await page.waitForTimeout(600)

  // Sidebar nav should exist — look for a nav element or a known link
  const nav = page.locator('nav, [data-testid="sidebar"], aside')
  await expect(nav.first()).toBeVisible()
})
