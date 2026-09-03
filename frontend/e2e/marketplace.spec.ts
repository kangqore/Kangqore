import { test, expect, type Page } from '@playwright/test'
import fixtures from './marketplace.fixtures.json'

/**
 * The marketplace, reached via /applications, loads and its Revenue tab does
 * not crash.
 *
 * This exists because the Revenue tab threw "Cannot read properties of
 * undefined (reading 'toFixed')" on every real load — the frontend read
 * data.totalPlatformFee, data.netRevenue, data.refundRate and data.byListing,
 * none of which the backend has ever sent (kimmp/routes.ts:3746 sends
 * totalRevenue, totalRefunds, totalInstalls, listings). It went unnoticed
 * because the marketplace had 0 installs, so nobody had opened a Revenue tab
 * with data behind it — proven by reverting the fix here and watching this
 * exact test fail with the exact same boundary message.
 *
 * "Applications" in the rail had no route behind it at all before this; both
 * gaps were found together while wiring one to the other.
 */

const BOUNDARY = 'Something went wrong'

async function mockApi(page: Page) {
  await page.route('**/api/admin/kangqore-immp/marketplace/**', async route => {
    const path = new URL(route.request().url())
      .pathname.replace(/^.*\/api\/admin\/kangqore-immp\//, '').replace(/\?.*$/, '')
    const key = Object.keys(fixtures)
      .filter(k => path === k || path.startsWith(k))
      .sort((a, b) => (path === a ? -1 : path === b ? 1 : b.length - a.length))[0]
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(key ? (fixtures as any)[key] : {}),
    })
  })
  // Exact path has no trailing segment, so it needs its own pattern.
  await page.route('**/api/admin/kangqore-immp/marketplace', async route => {
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify((fixtures as any)['marketplace']),
    })
  })
}

async function signIn(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('user', JSON.stringify({ id: 'demo', email: 'demo@kangqore.com', role: 'ADMIN', name: 'Demo' }))
    localStorage.setItem('role', 'ADMIN')
  })
}

test.describe('Marketplace (Applications)', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
    await signIn(page)
    await page.goto('/kangqore-view/admin', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
  })

  test('/applications renders the marketplace, not a dead route', async ({ page }) => {
    const crashes: string[] = []
    page.on('pageerror', e => crashes.push(e.message))

    await page.goto('/kangqore-view/admin/applications', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2500)

    const body = await page.locator('body').innerText()
    expect(crashes, crashes.join(' | ')).toHaveLength(0)
    expect(body.includes(BOUNDARY), 'error boundary on /applications').toBe(false)
    expect(body).toContain('Kangqore Marketplace')
  })

  test('the Revenue tab renders real numbers instead of throwing', async ({ page }) => {
    const crashes: string[] = []
    page.on('pageerror', e => crashes.push(e.message))

    await page.goto('/kangqore-view/admin/applications', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)
    // A locator on visible text ("Revenue") matched a notification-panel item
    // instead of this button — the shell renders other text with that exact
    // string. A test id makes the target unambiguous.
    await page.getByTestId('marketplace-revenue-tab').click()

    // Auto-waiting locator rather than a fixed-delay body.innerText() snapshot:
    // the delayed read intermittently caught the DOM mid-transition (visible in
    // a saved failure screenshot with the real numbers already painted) and
    // would have been a flaky assertion, not a real one.
    await expect(page.getByText('Net Revenue', { exact: true })).toBeVisible({ timeout: 5000 })

    const body = await page.locator('body').innerText()
    expect(crashes, `Revenue tab threw: ${crashes.join(' | ')}`).toHaveLength(0)
    expect(body.includes(BOUNDARY), `error boundary on Revenue tab: ${body.slice(0, 200)}`).toBe(false)
  })
})
