import { test, expect, type Page } from '@playwright/test'
import fixtures from './work-os.fixtures.json'

/**
 * Every Work OS screen loads without falling to the error boundary.
 *
 * This exists because four of these pages — Timeline, Workload, Goals,
 * Portfolio — crashed with "data.filter is not a function" while thirteen
 * backend probes stayed green and every gate passed. Nothing opened a page, so
 * nothing noticed. A separate blank-page bug (a hooks-order violation in the
 * app shell) survived for days for the same reason.
 *
 * Responses are served from work-os.fixtures.json, captured from the live
 * backend. Without them the pages sit in a loading state and the data path is
 * never exercised — proven by reintroducing a crash and watching the suite pass
 * anyway. Fixtures make the shape mismatch reproducible, which is the whole
 * point.
 *
 * The two sides are pinned together: api-contract-e2e asserts the backend
 * RETURNS these shapes, this asserts the screens CONSUME them. Change one side
 * and the other fails.
 *
 * It deliberately does not assert on content. Asserting "17 projects" would
 * fail in CI for the wrong reason and teach everyone to ignore it.
 */

const WORK_OS_TABS = [
  'dashboard', 'templates', 'boards', 'board', 'table', 'timeline', 'graph',
  'workload', 'goals', 'portfolio', 'outcomes', 'executive',
  'automations', 'fields', 'ingest', 'agent-ux', 'decision-matrix',
]

const OTHER_OS_ROUTES = ['/kangqore-view/admin/outcome-risk']

/** The text the OS error boundary renders when a component throws. */
const BOUNDARY = 'Something went wrong'

/**
 * Serve every Work OS endpoint from the captured fixtures, so pages render with
 * data rather than a spinner. Anything not covered returns an empty object,
 * which is a valid response and keeps an unmocked call from hanging the test.
 */
async function mockApi(page: Page) {
  await page.route('**/api/admin/work-os/**', async route => {
    const path = new URL(route.request().url()).pathname
      .replace(/^.*\/api\/admin\/work-os\//, '')
      .replace(/\?.*$/, '')
    // Exact match wins; otherwise the LONGEST matching prefix. Taking the first
    // prefix hit served the `boards` list payload to `boards/<id>`, which the
    // detail view would have rendered as an empty board rather than failing —
    // a fixture bug that looks exactly like a working page.
    const key = Object.keys(fixtures)
      .filter(k => path === k || path.startsWith(k))
      .sort((a, b) => (path === a ? -1 : path === b ? 1 : b.length - a.length))[0]
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(key ? (fixtures as any)[key] : {}),
    })
  })
}

async function signIn(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    const demoUser = JSON.stringify({ id: 'demo', email: 'demo@kangqore.com', role: 'ADMIN', name: 'Demo' })
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('user', demoUser)
    localStorage.setItem('role', 'ADMIN')
  })
}

/**
 * Load a route and report what went wrong, if anything.
 *
 * Failed network requests are ignored on purpose: CI runs without a backend, so
 * every query fails and the page is expected to show its own error state. A
 * page that renders "could not load" is working. A page that throws is not.
 */
async function loadAndInspect(page: Page, path: string) {
  const crashes: string[] = []
  const onError = (e: Error) => crashes.push(e.message)
  page.on('pageerror', onError)

  await page.goto(path, { waitUntil: 'domcontentloaded' })
  // Long enough for lazy chunks and the first render pass to settle.
  await page.waitForTimeout(2500)

  const body = await page.locator('body').innerText().catch(() => '')
  page.off('pageerror', onError)

  const boundaryHit = body.includes(BOUNDARY)
  const detail = boundaryHit
    ? (body.match(new RegExp(`${BOUNDARY}\\s*\\n\\s*(.+)`))?.[1] ?? '').trim().slice(0, 120)
    : ''

  return { crashes, boundaryHit, detail, chars: body.length, url: page.url() }
}

test.describe('Work OS screens', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
    await signIn(page)
    // Warm the shell first. Navigating immediately after writing the token can
    // beat auth hydration and bounce through /login, which looks exactly like a
    // broken route and is not one.
    await page.goto('/kangqore-view/admin', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
  })

  for (const tab of WORK_OS_TABS) {
    test(`/work/${tab} renders without crashing`, async ({ page }) => {
      const r = await loadAndInspect(page, `/kangqore-view/admin/work/${tab}`)

      expect(r.crashes, `uncaught errors on /work/${tab}: ${r.crashes.join(' | ')}`).toHaveLength(0)
      expect(r.boundaryHit, `error boundary on /work/${tab}: ${r.detail}`).toBe(false)
      // A page that rendered nothing at all is a blank screen, which is the
      // other failure this is here to catch.
      expect(r.chars, `/work/${tab} rendered an empty document`).toBeGreaterThan(200)
    })
  }

  for (const route of OTHER_OS_ROUTES) {
    test(`${route} renders without crashing`, async ({ page }) => {
      const r = await loadAndInspect(page, route)
      expect(r.crashes, `uncaught errors on ${route}: ${r.crashes.join(' | ')}`).toHaveLength(0)
      expect(r.boundaryHit, `error boundary on ${route}: ${r.detail}`).toBe(false)
      expect(r.chars, `${route} rendered an empty document`).toBeGreaterThan(200)
    })
  }

  test('a cold load goes straight to the route, not through the shell', async ({ page }) => {
    // Outcome Risk was blank on direct load for days: the app shell ran a
    // different number of hooks before and after the route resolved, and React
    // threw. It only reproduced on a cold load, never when navigated to.
    await mockApi(page)
    await signIn(page)
    const r = await loadAndInspect(page, '/kangqore-view/admin/outcome-risk')
    expect(r.crashes.join(' '), 'hooks-order violation on cold load').not.toContain('Rendered more hooks')
    expect(r.boundaryHit, `error boundary on cold load: ${r.detail}`).toBe(false)
  })
})

/**
 * The marketing scroll-reveal must never run inside the app shell.
 *
 * GlobalScrollAnimations hides every h1-h4/p/li/.card with `gsap.set({opacity:0})`
 * and reveals it on a WINDOW scroll event. The OS lays out as a fixed frame with
 * an inner scrolling pane, so the window never scrolls and that event never
 * fires: on the OS home it left 103 of 155 elements invisible — lead names, goal
 * titles, alert text, activity messages — all fetched successfully, none of them
 * painted. Which subset was hidden varied per load, because it depends on what
 * had rendered when the 400ms pass ran, so it read as "never loads in one go".
 *
 * Asserting on the marker rather than on opacity catches it before the animation
 * timing matters, and gives a failure that names the cause.
 */
test.describe('app shell is not touched by the marketing scroll reveal', () => {
  for (const route of ['/kangqore-view/admin', '/kangqore-view/admin/work/boards']) {
    test(`${route} has no gsap-hidden content`, async ({ page }) => {
      await mockApi(page)
      await signIn(page)
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      // Longer than the 400ms pass plus its ScrollTrigger.refresh().
      await page.waitForTimeout(2500)

      const r = await page.evaluate(() => {
        const tagged = [...document.querySelectorAll('[data-gsap]')]
        const invisible = [...document.querySelectorAll('p,h1,h2,h3,h4,li,span')].filter(
          el => el.textContent?.trim() && !el.children.length &&
                getComputedStyle(el).opacity === '0' &&
                el.getBoundingClientRect().width > 2)
        return { tagged: tagged.length, invisible: invisible.length,
                 sample: invisible.slice(0, 3).map(e => e.textContent!.trim().slice(0, 40)) }
      })

      expect(r.tagged, `the global scroll reveal claimed ${r.tagged} elements inside the app shell`).toBe(0)
      expect(r.invisible, `${r.invisible} text elements are rendered at opacity 0: ${r.sample.join(' | ')}`).toBe(0)
    })
  }
})
