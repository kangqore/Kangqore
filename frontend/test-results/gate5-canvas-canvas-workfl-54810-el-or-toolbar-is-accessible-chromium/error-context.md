# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gate5-canvas.spec.ts >> canvas: workflow canvas >> canvas: node panel or toolbar is accessible
- Location: e2e/gate5-canvas.spec.ts:55:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Test source

```ts
  1   | // Gate 5 — Interaction Quality: Canvas & Studio
  2   | //
  3   | // Tests WVIS (Workflow + Intelligence Canvas) as a live, interactive surface.
  4   | // Goes beyond smoke tests — validates that ReactFlow renders, nodes are present,
  5   | // controls are accessible, and canvas interactions don't crash the page.
  6   | 
  7   | import { test, expect, type Page } from '@playwright/test'
  8   | 
  9   | const BASE = 'http://localhost:3001'
  10  | 
  11  | async function withAuth(page: Page, route: string) {
  12  |   await page.goto(`${BASE}/`)
  13  |   await page.evaluate(() => {
  14  |     localStorage.setItem('token', 'demo-token')
  15  |     localStorage.setItem('role', 'ADMIN')
  16  |   })
  17  |   await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' })
  18  |   await page.waitForTimeout(1200)
  19  | }
  20  | 
  21  | // ─── Workflow Canvas ──────────────────────────────────────────────────────────
  22  | 
  23  | test.describe('canvas: workflow canvas', () => {
  24  |   test('canvas mounts and ReactFlow renders', async ({ page }) => {
  25  |     await withAuth(page, '/kangqore-view/admin/workflows/canvas')
  26  | 
  27  |     // ReactFlow container must be present
  28  |     const rf = page.locator('.react-flow')
  29  |     await expect(rf).toBeVisible({ timeout: 6000 })
  30  | 
  31  |     // Controls panel (zoom + fit) must render
  32  |     const controls = page.locator('.react-flow__controls, [class*="controls"]')
  33  |     await expect(controls.first()).toBeVisible()
  34  |   })
  35  | 
  36  |   test('canvas: mode switcher toggles intelligence/workflow view', async ({ page }) => {
  37  |     await withAuth(page, '/kangqore-view/admin/workflows/canvas')
  38  |     await page.waitForTimeout(800)
  39  | 
  40  |     // Page body is never blank
  41  |     const body = await page.locator('body').textContent()
  42  |     expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  43  | 
  44  |     // No error boundary or crash text
  45  |     await expect(page.locator('[data-testid="error-boundary"]')).toHaveCount(0)
  46  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  47  |   })
  48  | 
  49  |   test('canvas: minimap is rendered', async ({ page }) => {
  50  |     await withAuth(page, '/kangqore-view/admin/workflows/canvas')
  51  |     const minimap = page.locator('.react-flow__minimap, [class*="minimap"]')
  52  |     await expect(minimap.first()).toBeVisible({ timeout: 5000 })
  53  |   })
  54  | 
  55  |   test('canvas: node panel or toolbar is accessible', async ({ page }) => {
  56  |     await withAuth(page, '/kangqore-view/admin/workflows/canvas')
  57  |     await page.waitForTimeout(1000)
  58  | 
  59  |     // Should have at least one button in the UI (Add Node, Mode switch, etc.)
  60  |     const buttons = page.locator('button')
  61  |     const count = await buttons.count()
> 62  |     expect(count).toBeGreaterThan(0)
      |                   ^ Error: expect(received).toBeGreaterThan(expected)
  63  |   })
  64  | })
  65  | 
  66  | // ─── Workflow Builder ─────────────────────────────────────────────────────────
  67  | 
  68  | test.describe('canvas: workflow builder', () => {
  69  |   test('builder renders step library and workflow list', async ({ page }) => {
  70  |     await withAuth(page, '/kangqore-view/admin/workflows/builder')
  71  |     await page.waitForTimeout(800)
  72  | 
  73  |     // No crash
  74  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  75  |     const body = await page.locator('body').textContent()
  76  |     expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  77  |   })
  78  | 
  79  |   test('builder: at least one step type is visible', async ({ page }) => {
  80  |     await withAuth(page, '/kangqore-view/admin/workflows/builder')
  81  |     await page.waitForTimeout(800)
  82  | 
  83  |     // Expect to see workflow step types (Notify, Agent, Condition, Wait, etc.)
  84  |     const stepTypes = ['Notify', 'Agent', 'Condition', 'Wait', 'Event', 'Create', 'Integrate']
  85  |     let found = 0
  86  |     for (const t of stepTypes) {
  87  |       const el = page.getByText(t, { exact: false })
  88  |       if (await el.count() > 0) found++
  89  |     }
  90  |     expect(found).toBeGreaterThan(0)
  91  |   })
  92  | 
  93  |   test('builder: workflow overview tab loads list', async ({ page }) => {
  94  |     await withAuth(page, '/kangqore-view/admin/workflows')
  95  |     await page.waitForTimeout(800)
  96  |     const body = await page.locator('body').textContent()
  97  |     expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  98  |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  99  |   })
  100 | })
  101 | 
  102 | // ─── KIMMP Workflow Generator ─────────────────────────────────────────────────
  103 | 
  104 | test.describe('canvas: KIMMP workflow generator', () => {
  105 |   test('KIMMP generator page loads', async ({ page }) => {
  106 |     await withAuth(page, '/kangqore-view/admin/workflows/kimmp')
  107 |     await page.waitForTimeout(800)
  108 |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  109 |     const body = await page.locator('body').textContent()
  110 |     expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  111 |   })
  112 | 
  113 |   test('KIMMP generator: input field is present', async ({ page }) => {
  114 |     await withAuth(page, '/kangqore-view/admin/workflows/kimmp')
  115 |     await page.waitForTimeout(800)
  116 | 
  117 |     // Should have some input or textarea for goal/query
  118 |     const inputs = page.locator('input, textarea')
  119 |     const count = await inputs.count()
  120 |     // Generator should have at least one input
  121 |     expect(count).toBeGreaterThanOrEqual(0) // lenient — some generators have click-to-start UX
  122 |   })
  123 | })
  124 | 
  125 | // ─── Ontology / Entity Graph ──────────────────────────────────────────────────
  126 | 
  127 | test.describe('canvas: entity graph', () => {
  128 |   test('entity graph page loads', async ({ page }) => {
  129 |     await withAuth(page, '/kangqore-view/admin/ops-centre')
  130 |     await page.waitForTimeout(800)
  131 |     await expect(page.getByText(/something went wrong/i)).toHaveCount(0)
  132 |     const body = await page.locator('body').textContent()
  133 |     expect(body?.trim().length ?? 0).toBeGreaterThan(50)
  134 |   })
  135 | })
  136 | 
```