# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gate5-nav.spec.ts >> nav: cross-module journeys >> journey: workflows overview → builder → canvas
- Location: e2e/gate5-nav.spec.ts:81:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.react-flow')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.react-flow')

```

# Test source

```ts
  1   | // Gate 5 — Interaction Quality: Navigation Flows & Error Resilience
  2   | //
  3   | // Tests multi-step user journeys, navigation between modules,
  4   | // login/logout flows, and graceful degradation under error conditions.
  5   | 
  6   | import { test, expect, type Page } from '@playwright/test'
  7   | 
  8   | const BASE = 'http://localhost:3001'
  9   | 
  10  | async function withAuth(page: Page, route = '/kangqore-view/admin/dashboard') {
  11  |   await page.goto(`${BASE}/`)
  12  |   await page.evaluate(() => {
  13  |     localStorage.setItem('token', 'demo-token')
  14  |     localStorage.setItem('role', 'ADMIN')
  15  |   })
  16  |   await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  17  |   await page.waitForTimeout(600)
  18  | }
  19  | 
  20  | // ─── Login flow ───────────────────────────────────────────────────────────────
  21  | 
  22  | test.describe('nav: authentication flow', () => {
  23  |   test('login page renders without auth', async ({ page }) => {
  24  |     await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' })
  25  |     await page.waitForTimeout(500)
  26  | 
  27  |     // No error overlay
  28  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  29  |     const body = await page.locator('body').textContent()
  30  |     expect(body?.trim().length ?? 0).toBeGreaterThan(20)
  31  |   })
  32  | 
  33  |   test('unauthenticated admin route redirects to login or shows gate', async ({ page }) => {
  34  |     // Clear auth and try admin route — should NOT render dashboard content
  35  |     await page.goto(`${BASE}/kangqore-view/admin/dashboard`, { waitUntil: 'domcontentloaded' })
  36  |     await page.waitForTimeout(500)
  37  | 
  38  |     const url = page.url()
  39  |     // Either redirected to /login or the dashboard guards
  40  |     const isLoginPage  = url.includes('/login')
  41  |     const bodyText     = await page.locator('body').textContent() ?? ''
  42  |     const showsLogin   = bodyText.toLowerCase().includes('sign in') || bodyText.toLowerCase().includes('log in') || bodyText.toLowerCase().includes('email')
  43  |     const showsDash    = bodyText.toLowerCase().includes('dashboard') || bodyText.toLowerCase().includes('leads') || bodyText.toLowerCase().includes('mission control')
  44  | 
  45  |     // Either redirected to login OR the demo auth allows the route — both are valid
  46  |     // The key check: page didn't crash
  47  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  48  |     expect(isLoginPage || showsLogin || showsDash).toBe(true)
  49  |   })
  50  | })
  51  | 
  52  | // ─── Cross-module navigation journey ─────────────────────────────────────────
  53  | 
  54  | test.describe('nav: cross-module journeys', () => {
  55  |   test('journey: dashboard → leads → back', async ({ page }) => {
  56  |     await withAuth(page, '/kangqore-view/admin/dashboard')
  57  | 
  58  |     // Navigate to leads
  59  |     await page.goto(`${BASE}/kangqore-view/admin/leads`, { waitUntil: 'domcontentloaded' })
  60  |     await page.waitForTimeout(600)
  61  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  62  | 
  63  |     // Navigate back to dashboard
  64  |     await page.goto(`${BASE}/kangqore-view/admin/dashboard`, { waitUntil: 'domcontentloaded' })
  65  |     await page.waitForTimeout(500)
  66  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  67  |   })
  68  | 
  69  |   test('journey: KIMMP intelligence → briefing → mission control', async ({ page }) => {
  70  |     await withAuth(page, '/kangqore-view/admin/kimmp')
  71  | 
  72  |     await page.goto(`${BASE}/kangqore-view/admin/kimmp/briefing`, { waitUntil: 'domcontentloaded' })
  73  |     await page.waitForTimeout(500)
  74  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  75  | 
  76  |     await page.goto(`${BASE}/kangqore-view/admin/kimmp/mission-control`, { waitUntil: 'domcontentloaded' })
  77  |     await page.waitForTimeout(500)
  78  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  79  |   })
  80  | 
  81  |   test('journey: workflows overview → builder → canvas', async ({ page }) => {
  82  |     await withAuth(page, '/kangqore-view/admin/workflows')
  83  | 
  84  |     await page.goto(`${BASE}/kangqore-view/admin/workflows/builder`, { waitUntil: 'domcontentloaded' })
  85  |     await page.waitForTimeout(800)
  86  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  87  | 
  88  |     await page.goto(`${BASE}/kangqore-view/admin/workflows/canvas`, { waitUntil: 'domcontentloaded' })
  89  |     await page.waitForTimeout(1200)
  90  |     // Canvas must render ReactFlow
> 91  |     await expect(page.locator('.react-flow')).toBeVisible({ timeout: 5000 })
      |                                               ^ Error: expect(locator).toBeVisible() failed
  92  |   })
  93  | 
  94  |   test('journey: settings → profile → back', async ({ page }) => {
  95  |     await withAuth(page, '/kangqore-view/admin/settings')
  96  | 
  97  |     await page.goto(`${BASE}/kangqore-view/admin/settings/profile`, { waitUntil: 'domcontentloaded' })
  98  |     await page.waitForTimeout(500)
  99  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  100 | 
  101 |     await page.goto(`${BASE}/kangqore-view/admin/settings`, { waitUntil: 'domcontentloaded' })
  102 |     await page.waitForTimeout(500)
  103 |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  104 |   })
  105 | 
  106 |   test('journey: rapid 5-page navigation does not crash', async ({ page }) => {
  107 |     await withAuth(page, '/kangqore-view/admin/dashboard')
  108 | 
  109 |     const routes = [
  110 |       '/kangqore-view/admin/leads',
  111 |       '/kangqore-view/admin/clients',
  112 |       '/kangqore-view/admin/projects',
  113 |       '/kangqore-view/admin/finance',
  114 |       '/kangqore-view/admin/dashboard',
  115 |     ]
  116 | 
  117 |     for (const route of routes) {
  118 |       await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  119 |       await page.waitForTimeout(300)
  120 |     }
  121 | 
  122 |     // Final page stable
  123 |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  124 |     const body = await page.locator('body').textContent()
  125 |     expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  126 |   })
  127 | })
  128 | 
  129 | // ─── Error resilience ─────────────────────────────────────────────────────────
  130 | 
  131 | test.describe('nav: error resilience', () => {
  132 |   test('404 route shows graceful fallback, not blank page', async ({ page }) => {
  133 |     await withAuth(page, '/kangqore-view/admin/dashboard')
  134 | 
  135 |     await page.goto(`${BASE}/kangqore-view/admin/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' })
  136 |     await page.waitForTimeout(500)
  137 | 
  138 |     // Should not be a blank page
  139 |     const body = await page.locator('body').textContent()
  140 |     expect(body?.trim().length ?? 0).toBeGreaterThan(5)
  141 | 
  142 |     // Should not be a raw JS error
  143 |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  144 |   })
  145 | 
  146 |   test('browser back/forward does not crash', async ({ page }) => {
  147 |     await withAuth(page, '/kangqore-view/admin/dashboard')
  148 | 
  149 |     await page.goto(`${BASE}/kangqore-view/admin/leads`, { waitUntil: 'domcontentloaded' })
  150 |     await page.waitForTimeout(400)
  151 |     await page.goBack()
  152 |     await page.waitForTimeout(400)
  153 |     await page.goForward()
  154 |     await page.waitForTimeout(400)
  155 | 
  156 |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  157 |   })
  158 | 
  159 |   test('page reload preserves route (no blank screen)', async ({ page }) => {
  160 |     await withAuth(page, '/kangqore-view/admin/clients')
  161 | 
  162 |     await page.reload({ waitUntil: 'domcontentloaded' })
  163 |     await page.waitForTimeout(800)
  164 | 
  165 |     // Auth is re-injected via localStorage — if persisted properly, content renders
  166 |     // If auth is NOT persisted, a login redirect is also acceptable (not a crash)
  167 |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  168 |   })
  169 | })
  170 | 
  171 | // ─── KIMMP interaction quality ────────────────────────────────────────────────
  172 | 
  173 | test.describe('nav: KIMMP interaction quality', () => {
  174 |   test('KIMMP: all sub-routes render without crash', async ({ page }) => {
  175 |     const kimmpRoutes = [
  176 |       '/kangqore-view/admin/kimmp',
  177 |       '/kangqore-view/admin/kimmp/briefing',
  178 |       '/kangqore-view/admin/kimmp/mission-control',
  179 |       '/kangqore-view/admin/kimmp/memory',
  180 |       '/kangqore-view/admin/kimmp/goals',
  181 |       '/kangqore-view/admin/kimmp/signals',
  182 |       '/kangqore-view/admin/kimmp/alerts',
  183 |       '/kangqore-view/admin/kimmp/decisions',
  184 |       '/kangqore-view/admin/kimmp/ai-governance',
  185 |     ]
  186 | 
  187 |     await withAuth(page, '/kangqore-view/admin/kimmp')
  188 | 
  189 |     for (const route of kimmpRoutes) {
  190 |       await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  191 |       await page.waitForTimeout(400)
```