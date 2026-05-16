# QA Audits — 6-Department Architecture

Operational handbook for the QA gates protecting Kangqore's 6-department × 61-service architecture. Built across PRs #14–#18.

## Automated gates (run in CI on every PR + push to main)

These gates run automatically in `.github/workflows/deploy.yml`. They are **purely static** (no running app required) and complete in under 30 seconds total.

| Gate | Command | What it enforces |
|---|---|---|
| Redirect drift | `npm run redirects:check` | `shared/legacyRedirects.json` matches the two `.generated.json` mirrors. Fails if anyone edited the source without regenerating. |
| Sitemap drift | `npm run sitemap:check` | `frontend/public/sitemap.xml` reflects the current 6 departments + 61 services + 38 static URLs. |
| Legacy redirect smoke | `npm run test:redirects:local` | Boots an Express harness with the compiled Phase C middleware, hits all 76 legacy URLs, asserts HTTP 301 with correct `Location` header + query-string preservation + API-route isolation. |
| Data architecture invariants | `cd frontend && npx craco test --testPathPattern=dataArchitecture` | 24 Jest tests covering total counts, `departmentSlug` references, `relatedServiceSlugs` validity, kebab-case slug discipline, required fields, banner-brand inheritance, hero service references, persona structure, business outcome shape, and `relatedDepartments` validity. |
| SEO data completeness | `npm run audit:seo-data` | Every department + every service has a `departmentSEO`/`serviceSEO` entry with `title` (10–70 chars) and `description` (100–165 chars). |
| Legacy URL coverage | `npm run audit:legacy-coverage` | Every legacy URL pattern (15 dept paths + 61 nested service paths) is in `legacyRedirects` and targets a valid canonical URL. |
| Page SEO surface | `npm run audit:page-seo` | The 3 Phase D page templates (`DepartmentPageReal`, `ServicePageReal`, `DepartmentsIndexPage`) emit `<Helmet>` with canonical, full Open Graph + Twitter Card meta, and `<script type="application/ld+json">`. Asserts no Phase C `noindex` survives in the real templates. |

To run the full gate locally in one shot:
```bash
npm run redirects:check && \
npm run sitemap:check && \
npm run audit:all && \
npm run test:redirects:local
cd frontend && CI=true npx craco test --testPathPattern=dataArchitecture --watchAll=false
```

## Manual gates (run periodically — not in CI)

These require a running browser (Chrome/Chromium) and external services. **Not run on every PR** — too slow. Run before launch, then quarterly.

### Lighthouse CI (performance + accessibility + SEO scores)

**Why not in CI yet:** requires headless Chrome + 1–3 min per URL. Adds 10+ min to CI run.

**Manual run:**
```bash
# Build the production Docker image
docker build -t kangqore -f backend/Dockerfile .

# Run container in background
docker run -d -p 5050:5050 --name kq kangqore

# Wait for Express to boot
for i in {1..30}; do curl -fsS http://localhost:5050/api/health 2>/dev/null && break; sleep 1; done

# Install Lighthouse CLI globally (one-time)
npm install -g lighthouse

# Audit a representative sample of pages
lighthouse http://localhost:5050/                         --output html --output-path /tmp/lh-home.html
lighthouse http://localhost:5050/departments              --output html --output-path /tmp/lh-departments.html
lighthouse http://localhost:5050/departments/cognition    --output html --output-path /tmp/lh-cognition.html
lighthouse http://localhost:5050/services/agentic-ai      --output html --output-path /tmp/lh-agentic.html

# Cleanup
docker rm -f kq
```

**Target scores (post-launch):**
- Performance ≥ 85 on Moto G4 / 4G profile
- Accessibility ≥ 95
- Best Practices ≥ 90
- SEO ≥ 95

### Accessibility (axe-core / WCAG 2.2 AA)

**Manual run with axe-core CLI:**
```bash
# Container already running on :5050 (per Lighthouse instructions above)
npx @axe-core/cli http://localhost:5050/                       --tags wcag22aa
npx @axe-core/cli http://localhost:5050/departments/cognition  --tags wcag22aa
npx @axe-core/cli http://localhost:5050/services/agentic-ai    --tags wcag22aa
```

**Browser extension alternative:** install the [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) Chrome extension and audit each page in DevTools.

**Conformance target:** WCAG 2.2 AA across all public marketing pages. The site's formal commitment is published at `/accessibility-statement`.

### SEO crawler (Screaming Frog / Sitebulb)

**Why:** asserts 0 internal 404s, single-hop 301s (no chains), valid canonical resolution, all JSON-LD parseable, no orphan pages.

**Manual run:**
1. Download Screaming Frog SEO Spider (free up to 500 URLs; Kangqore has ~110).
2. Configure: depth = 3, respect robots.txt = on, render JS = on (so Helmet-injected meta tags are crawled correctly).
3. Spider `http://localhost:5050/` against the running Docker container.
4. Verify in reports:
   - **Response codes:** 0 internal 404s, all old URLs return single-hop 301 → new URL.
   - **Canonical:** every page's `<link rel="canonical">` resolves to itself (no canonical chains, no canonicalization away from indexable pages).
   - **Directives:** no `<meta name="robots" content="noindex">` on department or service pages (Phase C placeholders correctly removed in Phase D).
   - **Structured data:** all `Service` + `BreadcrumbList` JSON-LD blocks parse without warnings in the "Structured Data" tab.

### Rich Results Test (Google)

For each of the 6 departments and a sampled 5–10 services, paste the URL into [Google's Rich Results Test](https://search.google.com/test/rich-results). Expect:
- Valid `Service` schema with `provider`, `name`, `description`, `serviceType`, `brand`, `audience`
- Valid `BreadcrumbList` with the correct trail (Home → Departments → [Dept] → [Service] for service pages)

## Performance budgets (reference targets)

Documented for future Lighthouse CI integration. Numbers below are the targets stated in the architecture plan (Section 21.10).

| Metric | Target | Note |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | On Moto G4 / 4G — Google "Good" CWV threshold |
| INP (Interaction to Next Paint) | < 200ms | Replaces FID in CWV |
| CLS (Cumulative Layout Shift) | < 0.1 | Stable layouts |
| Total transferred | < 1.5MB | Production bundle + first-paint assets |
| JS executed | < 350KB compressed | Initial bundle before code-split chunks |
| OG image | < 200KB | Optimized AVIF/WebP fallback to PNG |

## When automated audits fail

Each script prints a list of failures. Fix the underlying data — do not edit the test.

| Failure pattern | Where to fix |
|---|---|
| `redirects:check` drift | Edit `shared/legacyRedirects.json`, run `npm run redirects:generate`, commit both mirrors. |
| `sitemap:check` drift | After editing `departmentsData.js`/`servicesData.js`, run `npm run sitemap:generate`, commit `frontend/public/sitemap.xml`. |
| `audit:seo-data` failure | Add/edit `departmentSEO[slug]` or `serviceSEO[slug]` in `frontend/src/data/seoData.js`. Honor the title 10–70 / description 100–165 range. |
| `audit:legacy-coverage` failure | Most often a typo in `shared/legacyRedirects.json`. Verify target uses `/departments/<slug>` (plural) and flat `/services/<slug>`. |
| `audit:page-seo` failure | One of the 3 page templates is missing a Helmet element. Restore the missing meta/canonical/JSON-LD. |
| Data architecture invariants | One of 24 invariants broke. Read the test file at `frontend/src/data/__tests__/dataArchitecture.test.js` to find which check failed. |

## Out of scope (NOT covered by these gates)

- **Backend service behavior** (API endpoints, authentication, rate limiting) — covered by the backend's own test suite.
- **Visual regression testing** (UI changes that pass static checks but look broken) — manual review by design team.
- **Cross-browser compatibility** — manual QA in BrowserStack or similar.
- **Form submissions and lead capture** — covered by E2E tests if/when introduced.
- **Real-user monitoring (RUM)** — covered by GA4 / production analytics once wired.

## Cadence

| Gate | Run |
|---|---|
| Automated audits in CI | Every PR + push to main |
| Lighthouse audit | Pre-launch + quarterly |
| Accessibility audit (axe-core + manual) | Pre-launch + quarterly |
| SEO crawler (Screaming Frog) | Pre-launch + after every Phase E/F change |
| Rich Results Test | Pre-launch + after any JSON-LD schema change |
