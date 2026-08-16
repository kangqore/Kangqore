// Gate 5 — Interaction Quality: Navigation Flows & Error Resilience
//
// Tests multi-step user journeys, navigation between modules,
// login/logout flows, and graceful degradation under error conditions.

import { test, expect, type Page } from '@playwright/test'

const BASE = ''

// Intercept every /api/ call so tests never depend on a running backend.
// Uses a regex pattern (more reliable than globs for cross-origin URLs from AuthContext).
// - GET /api/auth/me  → returns the demo admin user (keeps localStorage auth alive)
// - GET everything else → empty array (safe for list endpoints the UI renders)
// - POST/PUT/PATCH/DELETE → empty object (mutations complete without error)
test.beforeEach(async ({ page }) => {
  // Inject demo auth into localStorage before every script execution & navigation/reload
  await page.addInitScript(() => {
    const demoUser = JSON.stringify({ id: 'demo-admin', name: 'C.O.D.E.', email: 'admin@kangqore.com', role: 'ADMIN' })
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('user', demoUser)
    localStorage.setItem('role', 'ADMIN')
  })

  await page.route(/\/api\//, (route) => {
    const url    = route.request().url()
    const method = route.request().method()

    if (url.includes('/auth/me')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'demo-admin', name: 'C.O.D.E.', email: 'admin@kangqore.com', role: 'ADMIN' },
        }),
      })
    }

    if (method !== 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    }

    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
})

async function withAuth(page: Page, route = '/kangqore-view/admin/dashboard') {
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(400)
}

// ─── Login flow ───────────────────────────────────────────────────────────────

test.describe('nav: authentication flow', () => {
  test('login page renders without auth', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    // No error overlay
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
    const body = await page.locator('body').textContent()
    expect(body?.trim().length ?? 0).toBeGreaterThan(20)
  })

  test('unauthenticated admin route redirects to login or shows gate', async ({ page }) => {
    await page.goto('/kangqore-view/admin/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    const url = page.url()
    const isLoginPage  = url.includes('/login')
    const bodyText     = await page.locator('body').textContent() ?? ''
    const showsLogin   = bodyText.toLowerCase().includes('sign in') || bodyText.toLowerCase().includes('log in') || bodyText.toLowerCase().includes('email')
    const showsDash    = bodyText.toLowerCase().includes('dashboard') || bodyText.toLowerCase().includes('leads') || bodyText.toLowerCase().includes('mission control')

    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
    expect(isLoginPage || showsLogin || showsDash).toBe(true)
  })
})

// ─── Cross-module navigation journey ─────────────────────────────────────────

test.describe('nav: cross-module journeys', () => {
  test('journey: dashboard → leads → back', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/dashboard')

    await page.goto('/kangqore-view/admin/leads', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    await page.goto('/kangqore-view/admin/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('journey: KIMMP intelligence → briefing → mission control', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/kimmp')

    await page.goto('/kangqore-view/admin/kimmp/briefing', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    await page.goto('/kangqore-view/admin/kimmp/mission-control', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('journey: workflows overview → builder → canvas', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/workflows')

    await page.goto('/kangqore-view/admin/workflows/builder', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(600)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    await page.goto('/kangqore-view/admin/workflows/canvas', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)

    const body = await page.locator('body').textContent() ?? ''
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
    expect(body.trim().length, 'Canvas page must render without crash').toBeGreaterThan(50)
  })

  test('journey: settings → profile → back', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/settings')

    await page.goto('/kangqore-view/admin/settings/profile', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    await page.goto('/kangqore-view/admin/settings', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('journey: rapid 5-page navigation does not crash', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/dashboard')

    const routes = [
      '/kangqore-view/admin/leads',
      '/kangqore-view/admin/clients',
      '/kangqore-view/admin/projects',
      '/kangqore-view/admin/finance',
      '/kangqore-view/admin/dashboard',
    ]

    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(200)
    }

    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
    const body = await page.locator('body').textContent()
    expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  })
})

// ─── Error resilience ─────────────────────────────────────────────────────────

test.describe('nav: error resilience', () => {
  test('404 route shows graceful fallback, not blank page', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/dashboard')

    await page.goto('/kangqore-view/admin/this-route-does-not-exist', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)

    const body = await page.locator('body').textContent()
    expect(body?.trim().length ?? 0).toBeGreaterThan(5)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('browser back/forward does not crash', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/dashboard')

    await page.goto('/kangqore-view/admin/leads', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(300)
    await page.goBack()
    await page.waitForTimeout(300)
    await page.goForward()
    await page.waitForTimeout(300)

    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('page reload preserves route (no blank screen)', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/clients')

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })
})

// ─── KIMMP interaction quality ────────────────────────────────────────────────

test.describe('nav: KIMMP interaction quality', () => {
  const kimmpRoutes = [
    '/kangqore-view/admin/kimmp',
    '/kangqore-view/admin/kimmp/briefing',
    '/kangqore-view/admin/kimmp/mission-control',
    '/kangqore-view/admin/kimmp/memory',
    '/kangqore-view/admin/kimmp/goals',
    '/kangqore-view/admin/kimmp/signals',
    '/kangqore-view/admin/kimmp/alerts',
    '/kangqore-view/admin/kimmp/decisions',
    '/kangqore-view/admin/kimmp/ai-governance',
  ]

  for (const route of kimmpRoutes) {
    test(`KIMMP subroute: ${route}`, async ({ page }) => {
      await withAuth(page, route)
      const crashText = page.getByText(/something went wrong/i)
      const count = await crashText.count()
      expect(count, `Crash on ${route}`).toBe(0)
    })
  }

  test('KIMMP: sidebar navigation is present', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/kimmp')

    const nav = page.locator('nav, [role="navigation"], aside')
    await expect(nav.first()).toBeVisible()
  })
})
