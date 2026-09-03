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
 *
 * mockApi() also stubs /api/auth/me. Nothing in THIS suite calls it, but
 * leaving it unmocked is what actually failed CI, and it took a downloaded
 * artifact plus a from-scratch local repro (build + preview, not dev) to find:
 *
 *   src/context/AuthContext.jsx mounts once for the whole app (both the public
 *   site and the OS) and, independent of any OS route, fires a bare
 *   `axios.get('/api/auth/me')` with no CI guard. In `vite preview` — the
 *   production-build server this suite's own CI job runs, not `vite dev` — an
 *   unmocked GET to a non-file path hits Vite's SPA history fallback and
 *   returns 200 with index.html, not JSON. `response.data.user` off that HTML
 *   string is `undefined`; `localStorage.setItem('user',
 *   JSON.stringify(undefined))` then stores the literal STRING "undefined".
 *   The next time ProtectedRoute's synchronous localStorage fallback runs,
 *   `JSON.parse("undefined")` throws, is swallowed as "malformed session", and
 *   every route — not just this one — bounces to /login.
 *
 *   It is a race against that unrelated effect resolving, not against this
 *   page's own load. Confirmed by instrumenting localStorage across the
 *   navigation: token and user were intact right after landing on the bare
 *   OS shell, and gone by the time /applications was checked — with MORE
 *   dwell time in between making it MORE likely to reproduce, which is the
 *   opposite of what a "give it more time" fix assumes.
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
  // See the file header: this closes the actual CI failure at its source.
  await page.route('**/api/auth/me', async route => {
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ user: { id: 'demo', email: 'demo@kangqore.com', role: 'ADMIN', name: 'Demo' } }),
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

/**
 * Land inside the authenticated shell and stay there — asserted, not assumed.
 *
 * A fixed sleep here (the original 1500ms, copied from work-os.spec.ts) passed
 * reliably in every local and prior-CI run but failed in CI for this specific
 * page: the first CI run to ever load it hit a cold, uncached, ~870KB gzipped
 * bundle, and by 30s — Playwright's default action timeout, already elapsed —
 * the page had still not left /login. Waiting on a concrete signal (the search
 * box every authenticated OS route renders) rather than guessing a duration
 * fixes the slow case without slowing down the fast one.
 */
async function waitForAuthenticatedShell(page: Page) {
  // The topbar's search control is a <button><span>Search...</span></button>,
  // not an <input> — getByPlaceholder would never match it.
  await expect(page.getByText('Search...', { exact: true })).toBeVisible({ timeout: 20_000 })
  expect(page.url(), 'bounced to the login screen — auth did not take').not.toContain('/login')
}

test.describe('Marketplace (Applications)', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60_000)
    await mockApi(page)
    await signIn(page)
    await page.goto('/kangqore-view/admin', { waitUntil: 'domcontentloaded' })
    await waitForAuthenticatedShell(page)
  })

  test('/applications renders the marketplace, not a dead route', async ({ page }) => {
    const crashes: string[] = []
    page.on('pageerror', e => crashes.push(e.message))

    await page.goto('/kangqore-view/admin/applications', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Kangqore Marketplace', { exact: true })).toBeVisible({ timeout: 15_000 })

    const body = await page.locator('body').innerText()
    expect(crashes, crashes.join(' | ')).toHaveLength(0)
    expect(body.includes(BOUNDARY), 'error boundary on /applications').toBe(false)
  })

  test('the Revenue tab renders real numbers instead of throwing', async ({ page }) => {
    const crashes: string[] = []
    page.on('pageerror', e => crashes.push(e.message))

    await page.goto('/kangqore-view/admin/applications', { waitUntil: 'domcontentloaded' })
    // A locator on visible text ("Revenue") matched a notification-panel item
    // instead of this button — the shell renders other text with that exact
    // string. A test id makes the target unambiguous. toBeVisible first,
    // rather than clicking straight away, so a cold chunk load produces a
    // clear "never appeared" failure instead of a click racing the mount.
    const revenueTab = page.getByTestId('marketplace-revenue-tab')
    await expect(revenueTab).toBeVisible({ timeout: 15_000 })
    await revenueTab.click()

    await expect(page.getByText('Net Revenue', { exact: true })).toBeVisible({ timeout: 5_000 })

    const body = await page.locator('body').innerText()
    expect(crashes, `Revenue tab threw: ${crashes.join(' | ')}`).toHaveLength(0)
    expect(body.includes(BOUNDARY), `error boundary on Revenue tab: ${body.slice(0, 200)}`).toBe(false)
  })
})
