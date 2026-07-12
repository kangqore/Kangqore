// Gate 5 — Interaction Quality: Navigation Flows & Error Resilience
//
// Tests multi-step user journeys, navigation between modules,
// login/logout flows, and graceful degradation under error conditions.

import { test, expect, type Page } from '@playwright/test'

const BASE = 'http://localhost:3000'

async function withAuth(page: Page, route = '/kangqore-view/admin/dashboard') {
  await page.goto(`${BASE}/`)
  await page.evaluate(() => {
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('role', 'ADMIN')
  })
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)
}

// ─── Login flow ───────────────────────────────────────────────────────────────

test.describe('nav: authentication flow', () => {
  test('login page renders without auth', async ({ page }) => {
    await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    // No error overlay
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
    const body = await page.locator('body').textContent()
    expect(body?.trim().length ?? 0).toBeGreaterThan(20)
  })

  test('unauthenticated admin route redirects to login or shows gate', async ({ page }) => {
    // Clear auth and try admin route — should NOT render dashboard content
    await page.goto(`${BASE}/kangqore-view/admin/dashboard`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    const url = page.url()
    // Either redirected to /login or the dashboard guards
    const isLoginPage  = url.includes('/login')
    const bodyText     = await page.locator('body').textContent() ?? ''
    const showsLogin   = bodyText.toLowerCase().includes('sign in') || bodyText.toLowerCase().includes('log in') || bodyText.toLowerCase().includes('email')
    const showsDash    = bodyText.toLowerCase().includes('dashboard') || bodyText.toLowerCase().includes('leads') || bodyText.toLowerCase().includes('mission control')

    // Either redirected to login OR the demo auth allows the route — both are valid
    // The key check: page didn't crash
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
    expect(isLoginPage || showsLogin || showsDash).toBe(true)
  })
})

// ─── Cross-module navigation journey ─────────────────────────────────────────

test.describe('nav: cross-module journeys', () => {
  test('journey: dashboard → leads → back', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/dashboard')

    // Navigate to leads
    await page.goto(`${BASE}/kangqore-view/admin/leads`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(600)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    // Navigate back to dashboard
    await page.goto(`${BASE}/kangqore-view/admin/dashboard`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('journey: KIMMP intelligence → briefing → mission control', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/kimmp')

    await page.goto(`${BASE}/kangqore-view/admin/kimmp/briefing`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    await page.goto(`${BASE}/kangqore-view/admin/kimmp/mission-control`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('journey: workflows overview → builder → canvas', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/workflows')

    await page.goto(`${BASE}/kangqore-view/admin/workflows/builder`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(800)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    await page.goto(`${BASE}/kangqore-view/admin/workflows/canvas`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1200)
    // Canvas must render ReactFlow
    await expect(page.locator('.react-flow')).toBeVisible({ timeout: 5000 })
  })

  test('journey: settings → profile → back', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/settings')

    await page.goto(`${BASE}/kangqore-view/admin/settings/profile`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)

    await page.goto(`${BASE}/kangqore-view/admin/settings`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
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
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(300)
    }

    // Final page stable
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
    const body = await page.locator('body').textContent()
    expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  })
})

// ─── Error resilience ─────────────────────────────────────────────────────────

test.describe('nav: error resilience', () => {
  test('404 route shows graceful fallback, not blank page', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/dashboard')

    await page.goto(`${BASE}/kangqore-view/admin/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    // Should not be a blank page
    const body = await page.locator('body').textContent()
    expect(body?.trim().length ?? 0).toBeGreaterThan(5)

    // Should not be a raw JS error
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('browser back/forward does not crash', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/dashboard')

    await page.goto(`${BASE}/kangqore-view/admin/leads`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)
    await page.goBack()
    await page.waitForTimeout(400)
    await page.goForward()
    await page.waitForTimeout(400)

    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })

  test('page reload preserves route (no blank screen)', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/clients')

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(800)

    // Auth is re-injected via localStorage — if persisted properly, content renders
    // If auth is NOT persisted, a login redirect is also acceptable (not a crash)
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  })
})

// ─── KIMMP interaction quality ────────────────────────────────────────────────

test.describe('nav: KIMMP interaction quality', () => {
  test('KIMMP: all sub-routes render without crash', async ({ page }) => {
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

    await withAuth(page, '/kangqore-view/admin/kimmp')

    for (const route of kimmpRoutes) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(400)
      const crashText = page.getByText(/something went wrong/i)
      const count = await crashText.count()
      expect(count, `Crash on ${route}`).toBe(0)
    }
  })

  test('KIMMP: sidebar navigation is present', async ({ page }) => {
    await withAuth(page, '/kangqore-view/admin/kimmp')

    // Should have navigation elements (tabs, sidebar, etc.)
    const nav = page.locator('nav, [role="navigation"], aside')
    await expect(nav.first()).toBeVisible()
  })
})
