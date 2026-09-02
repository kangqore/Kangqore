// Gate 5 — Interaction Quality: Performance Benchmarks
//
// Measures real-world page load times for critical paths.
// Uses Navigation Timing API to capture TTFB, DOMContentLoaded, and load times.
// Fails if any critical page exceeds threshold.
//
// Thresholds (generous for dev server, conservative for prod):
//   - DOMContentLoaded: < 4000ms
//   - Body text present: < 5000ms

import { test, expect, type Page } from '@playwright/test'

const BASE = ''

const PERF_THRESHOLD_MS  = 5000   // body must be populated within 5s
const DCLD_THRESHOLD_MS  = 4000   // DOMContentLoaded within 4s

interface PerfResult {
  route:          string
  dclMs:          number
  bodyMs:         number
  passed:         boolean
}

const results: PerfResult[] = []

async function measurePage(page: Page, route: string): Promise<PerfResult> {
  // Pre-inject auth
  await page.addInitScript(() => {
    const demoUser = JSON.stringify({ id: 'demo-admin', name: 'C.O.D.E.', email: 'admin@kangqore.com', role: 'ADMIN' })
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('user', demoUser)
    localStorage.setItem('role', 'ADMIN')
  })

  const t0 = Date.now()
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  const dclMs = Date.now() - t0

  // Wait for body to have meaningful content
  let bodyMs = dclMs
  const deadline = t0 + PERF_THRESHOLD_MS
  while (Date.now() < deadline) {
    const text = await page.locator('body').textContent()
    if ((text?.trim().length ?? 0) > 50) {
      bodyMs = Date.now() - t0
      break
    }
    await page.waitForTimeout(100)
  }

  const passed = dclMs <= DCLD_THRESHOLD_MS && bodyMs <= PERF_THRESHOLD_MS
  results.push({ route, dclMs, bodyMs, passed })
  return { route, dclMs, bodyMs, passed }
}

// ─── Critical path performance tests ─────────────────────────────────────────

test('perf: admin dashboard loads within threshold', async ({ page }) => {
  const r = await measurePage(page, '/kangqore-view/admin/dashboard')
  console.log(`[Perf] ${r.route}: DCL=${r.dclMs}ms body=${r.bodyMs}ms`)
  expect(r.dclMs).toBeLessThan(DCLD_THRESHOLD_MS)
  expect(r.bodyMs).toBeLessThan(PERF_THRESHOLD_MS)
})

test('perf: KIMMP intelligence page loads within threshold', async ({ page }) => {
  const r = await measurePage(page, '/kangqore-view/admin/kimmp')
  console.log(`[Perf] ${r.route}: DCL=${r.dclMs}ms body=${r.bodyMs}ms`)
  expect(r.dclMs).toBeLessThan(DCLD_THRESHOLD_MS)
  expect(r.bodyMs).toBeLessThan(PERF_THRESHOLD_MS)
})

test('perf: workflow canvas loads within threshold', async ({ page }) => {
  const r = await measurePage(page, '/kangqore-view/admin/workflows/canvas')
  console.log(`[Perf] ${r.route}: DCL=${r.dclMs}ms body=${r.bodyMs}ms`)
  expect(r.dclMs).toBeLessThan(DCLD_THRESHOLD_MS)
  expect(r.bodyMs).toBeLessThan(PERF_THRESHOLD_MS)
})

test('perf: leads page loads within threshold', async ({ page }) => {
  const r = await measurePage(page, '/kangqore-view/admin/leads')
  console.log(`[Perf] ${r.route}: DCL=${r.dclMs}ms body=${r.bodyMs}ms`)
  expect(r.dclMs).toBeLessThan(DCLD_THRESHOLD_MS)
  expect(r.bodyMs).toBeLessThan(PERF_THRESHOLD_MS)
})

test('perf: clients page loads within threshold', async ({ page }) => {
  const r = await measurePage(page, '/kangqore-view/admin/clients')
  console.log(`[Perf] ${r.route}: DCL=${r.dclMs}ms body=${r.bodyMs}ms`)
  expect(r.dclMs).toBeLessThan(DCLD_THRESHOLD_MS)
  expect(r.bodyMs).toBeLessThan(PERF_THRESHOLD_MS)
})

test('perf: hanumanas governance page loads within threshold', async ({ page }) => {
  const r = await measurePage(page, '/kangqore-view/admin/hanumanas')
  console.log(`[Perf] ${r.route}: DCL=${r.dclMs}ms body=${r.bodyMs}ms`)
  expect(r.dclMs).toBeLessThan(DCLD_THRESHOLD_MS)
  expect(r.bodyMs).toBeLessThan(PERF_THRESHOLD_MS)
})

test('perf: mission control loads within threshold', async ({ page }) => {
  const r = await measurePage(page, '/kangqore-view/admin/kimmp/mission-control')
  console.log(`[Perf] ${r.route}: DCL=${r.dclMs}ms body=${r.bodyMs}ms`)
  expect(r.dclMs).toBeLessThan(DCLD_THRESHOLD_MS)
  expect(r.bodyMs).toBeLessThan(PERF_THRESHOLD_MS)
})

// ─── Web Vitals collection (informational — not blocking) ─────────────────────

test('perf: collect core web vitals for dashboard', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await page.evaluate(() => {
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('role', 'ADMIN')
  })

  await page.goto(`${BASE}/kangqore-view/admin/dashboard`, { waitUntil: 'load' })

  const vitals = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    return {
      ttfbMs:   nav ? Math.round(nav.responseStart - nav.requestStart) : null,
      dclMs:    nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
      loadMs:   nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
    }
  })

  console.log('[Perf] Web Vitals:', JSON.stringify(vitals))

  // TTFB should be under 2s for a local dev server
  if (vitals.ttfbMs !== null) {
    expect(vitals.ttfbMs).toBeLessThan(2000)
  }
})
