#!/usr/bin/env node
// ─── Sitemap.xml Generator ─────────────────────────────────────────────────────
// Reads departmentsData.js + servicesData.js (canonical sources from PR #14)
// and emits sitemap.xml at frontend/public/sitemap.xml.
//
// The generated file is committed (treated like the legacyRedirects mirrors).
// CI gate `npm run sitemap:check` enforces no drift between data + sitemap.
//
// Usage:
//   node scripts/generate-sitemap.mjs            # regenerate sitemap.xml
//   node scripts/generate-sitemap.mjs --check    # CI: exit 1 if sitemap drifted
//
// Output:
//   frontend/public/sitemap.xml  (gets copied to build/ by CRA)
//
// See plan Section 19.8 for the schema and the canonical URL list.
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SITEMAP_PATH = path.join(repoRoot, 'frontend', 'public', 'sitemap.xml');
const DEPARTMENTS_FILE = path.join(repoRoot, 'frontend', 'src', 'data', 'departmentsData.js');
const SERVICES_FILE = path.join(repoRoot, 'frontend', 'src', 'data', 'servicesData.js');

const BASE_URL = 'https://kangqore.com';

// ─── Extract slugs from the data files via regex (avoids importing ESM/JSX) ────
// Reading the JS files as text and grepping slugs is more portable than spinning
// up Babel here. The CI test-redirects.mjs + dataArchitecture.test.js already
// guarantee data integrity; this generator just needs the URL list.

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractDepartmentSlugs() {
  const src = readFile(DEPARTMENTS_FILE);
  // Departments are top-level keys of departmentsData object, with the form:
  //   cognition: {
  // Match the 6 known slugs explicitly to keep the script deterministic and
  // independent of object-key parsing edge cases.
  const knownDeptKeys = ['cognition', 'foundry', 'reimagine', 'shield', 'platforms', 'growth'];
  for (const k of knownDeptKeys) {
    if (!new RegExp(`^\\s{2}${k}:\\s*\\{`, 'm').test(src)) {
      throw new Error(`departmentsData.js missing expected key: ${k}`);
    }
  }
  return knownDeptKeys;
}

function extractServiceSlugs() {
  const src = readFile(SERVICES_FILE);
  // Service slugs are keys of `servicesData` keyed by slug literal:
  //   'agentic-ai': {
  const re = /^\s{2}'([a-z0-9][a-z0-9-]*)':\s*\{/gm;
  const slugs = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    slugs.push(m[1]);
  }
  if (slugs.length !== 61) {
    throw new Error(
      `Expected 61 service slugs in servicesData.js, found ${slugs.length}.`
    );
  }
  return slugs;
}

// ─── Static URLs (public marketing pages, in nav order) ────────────────────────
// Note: exclude /admin/*, /auth/*, /dashboard/*, and any noindex pages.
const STATIC_URLS = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/careers', priority: '0.7', changefreq: 'weekly' },
  { loc: '/partners', priority: '0.6', changefreq: 'monthly' },
  { loc: '/values', priority: '0.5', changefreq: 'monthly' },
  { loc: '/leadership', priority: '0.6', changefreq: 'monthly' },
  { loc: '/testimonials', priority: '0.5', changefreq: 'monthly' },
  { loc: '/eqore', priority: '0.7', changefreq: 'monthly' },
  { loc: '/insights', priority: '0.7', changefreq: 'weekly' },
  { loc: '/case-studies', priority: '0.7', changefreq: 'weekly' },
  { loc: '/blogs', priority: '0.7', changefreq: 'weekly' },
  { loc: '/white-paper', priority: '0.6', changefreq: 'monthly' },
  { loc: '/news', priority: '0.6', changefreq: 'weekly' },
  { loc: '/events', priority: '0.6', changefreq: 'weekly' },
  { loc: '/brochures', priority: '0.4', changefreq: 'monthly' },
  { loc: '/communities', priority: '0.5', changefreq: 'monthly' },
  { loc: '/investors', priority: '0.5', changefreq: 'monthly' },
  { loc: '/brand-identity', priority: '0.3', changefreq: 'yearly' },
  { loc: '/location', priority: '0.4', changefreq: 'yearly' },

  // Departments / services catalog landings
  { loc: '/departments', priority: '0.9', changefreq: 'weekly' },
  { loc: '/services', priority: '0.9', changefreq: 'weekly' },

  // Industries (12 known industries)
  { loc: '/industries/banking', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/insurance', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/edtech', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/healthcare', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/life-science', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/media-technology', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/retail', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/travel-hospitality', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/energy-utilities', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/manufacturing', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/information-services', priority: '0.6', changefreq: 'monthly' },
  { loc: '/industries/consumer-goods', priority: '0.6', changefreq: 'monthly' },

  // Legal
  { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
  { loc: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/accessibility-statement', priority: '0.3', changefreq: 'yearly' },
];

// ─── Build sitemap XML ─────────────────────────────────────────────────────────

function buildSitemap({ deptSlugs, serviceSlugs }) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD only

  const urls = [];

  // Static URLs first
  for (const u of STATIC_URLS) {
    urls.push({
      loc: BASE_URL + u.loc,
      lastmod: today,
      changefreq: u.changefreq,
      priority: u.priority,
    });
  }

  // Department pages (6)
  for (const slug of deptSlugs) {
    urls.push({
      loc: `${BASE_URL}/departments/${slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
    });
  }

  // Service pages (61, flat URLs)
  for (const slug of serviceSlugs) {
    urls.push({
      loc: `${BASE_URL}/services/${slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  const xmlBody = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlBody}\n</urlset>\n`;
}

// ─── Run ───────────────────────────────────────────────────────────────────────

let deptSlugs, serviceSlugs;
try {
  deptSlugs = extractDepartmentSlugs();
  serviceSlugs = extractServiceSlugs();
} catch (err) {
  console.error('ERROR extracting slugs:', err.message);
  process.exit(2);
}

const newSitemap = buildSitemap({ deptSlugs, serviceSlugs });
const mode = process.argv.includes('--check') ? 'check' : 'write';

// The lastmod field changes daily (today's date), so for drift-checking we
// compare everything EXCEPT lastmod. Strip lastmod lines before comparison.
function stripLastmod(s) {
  return s.replace(/^\s*<lastmod>[^<]*<\/lastmod>\n/gm, '');
}

const totalUrls = STATIC_URLS.length + deptSlugs.length + serviceSlugs.length;

if (mode === 'check') {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`DRIFT: ${path.relative(repoRoot, SITEMAP_PATH)} is missing.`);
    process.exit(1);
  }
  const current = fs.readFileSync(SITEMAP_PATH, 'utf8');
  if (stripLastmod(current) !== stripLastmod(newSitemap)) {
    console.error(
      `DRIFT: ${path.relative(repoRoot, SITEMAP_PATH)} URL set does not match generated output.\n` +
        `       Run \`npm run sitemap:generate\` to fix.`,
    );
    process.exit(1);
  }
  console.log(`no drift — ${totalUrls} URLs verified in sitemap.xml`);
} else {
  fs.mkdirSync(path.dirname(SITEMAP_PATH), { recursive: true });
  fs.writeFileSync(SITEMAP_PATH, newSitemap);
  console.log(
    `wrote ${path.relative(repoRoot, SITEMAP_PATH)} ` +
      `(${STATIC_URLS.length} static + ${deptSlugs.length} departments + ${serviceSlugs.length} services = ${totalUrls} URLs)`,
  );
}
