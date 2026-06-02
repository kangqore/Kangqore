/**
 * Smoke tests — every OS module and external portal must render without a
 * white screen or error boundary.
 *
 * Auth strategy: inject demo-token into localStorage via addInitScript before
 * the React app boots. The auth store reads localStorage on init, so
 * isAuthenticated = true and isDemo() = true (all API calls disabled, stores
 * use mock data). No backend required.
 */
import { test, expect } from '@playwright/test'

const DEMO_USER = {
  id:    'demo-admin',
  name:  'Mahesh Kumar',
  email: 'admin@kangqore.com',
  role:  'ADMIN',
}

// Every route accessible to ADMIN role.
// Portals are also open to ADMIN via ProtectedRoute allowedRoles.
const ROUTES = [
  // ── Admin OS ──────────────────────────────────────────────────────────────
  '/os/kimmp',
  '/os/leads',
  '/os/projects',
  '/os/strategy',
  '/os/resources',
  '/os/consultations',
  '/os/delivery',
  '/os/governance',
  '/os/comms',
  '/os/clients',
  '/os/partners',
  '/os/investors',
  '/os/finance',
  '/os/careers',
  '/os/analytics',
  '/os/departments',
  '/os/workflows',
  '/os/marketing',
  '/os/settings',

  // ── External portals ──────────────────────────────────────────────────────
  '/portal/client',
  '/portal/partner',
  '/portal/investor',
  '/portal/careers',
] as const

test.beforeEach(async ({ page }) => {
  // Set demo auth before the React app initialises — the auth store hydrates
  // from localStorage on create(), so this must run before any navigation.
  await page.addInitScript(
    ({ token, user }: { token: string; user: typeof DEMO_USER }) => {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    { token: 'demo-token', user: DEMO_USER },
  )
})

for (const route of ROUTES) {
  test(`renders: ${route}`, async ({ page }) => {
    await page.goto(route)

    // Must not be redirected to the login or unauthorized page
    await expect(page).not.toHaveURL(/\/(login|unauthorized)/, { timeout: 8_000 })

    // React root must have rendered something (not blank)
    await expect(page.locator('#root')).not.toBeEmpty({ timeout: 10_000 })

    // Error boundary must not have fired
    await expect(page.getByText('Something went wrong')).not.toBeVisible()
  })
}
