#!/usr/bin/env node
// ─── Page-Source SEO Audit (Phase F) ───────────────────────────────────────────
// Verifies the 3 new Phase D page templates emit the SEO surface Phase E
// expects:
//
//   - <Helmet> block with:
//       • <title>
//       • <meta name="description">
//       • <link rel="canonical">
//       • <meta property="og:type">
//       • <meta property="og:url">
//       • <meta property="og:title">
//       • <meta property="og:description">
//       • <meta property="og:image">
//       • <meta property="og:site_name">
//       • <meta name="twitter:card">
//       • <meta name="twitter:image">
//       • <script type="application/ld+json">
//
// This is a STATIC SOURCE-FILE audit — no running app required.
//
// IMPORTANT: this audit previously asserted the presence of <Helmet> JSX on the
// premise that "if the source has the right JSX, the rendered HTML will too."
// That premise proved false. Under React 19 + StrictMode, react-helmet@6 stops
// applying <meta>/<link>/<script> (its side-effect cleanup reverts them on the
// StrictMode remount), so every page shipped canonical=homepage while this gate
// stayed green. The audit therefore certified the exact bug it existed to catch.
//
// It is now mechanism-agnostic: it asserts each template supplies the required
// SEO fields via EITHER Helmet JSX or a useSeo() config. Static analysis still
// cannot prove delivery — only that the inputs exist. Rendered-DOM assertions
// live in the Playwright checks.
//
// Pure static analysis. Exit 0 on pass, non-zero on any audit failure.
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const PAGES = [
  { name: 'DepartmentPageReal',     path: 'frontend/src/pages/DepartmentPageReal.jsx' },
  { name: 'ServicePageReal',        path: 'frontend/src/pages/ServicePageReal.jsx' },
  { name: 'DepartmentsIndexPage',   path: 'frontend/src/pages/DepartmentsIndexPage.jsx' },
];

// Required SEO elements. Each entry: human-readable label + regex that must
// match somewhere in the file's source.
// Each entry: human-readable label, plus the patterns that satisfy it under
// either mechanism. A field passes if ANY of its regexes match.
const REQUIRED = [
  { label: 'SEO mechanism imported', res: [
      /import\s*\{\s*Helmet\s*\}\s*from\s*['"]react-helmet['"]/,
      /import\s+useSeo\s+from\s+['"][^'"]*seo\/useSeo['"]/ ] },
  { label: 'SEO mechanism invoked', res: [ /<Helmet>/, /useSeo\s*\(/ ] },
  { label: 'title',            res: [ /<title>[\s\S]+?<\/title>/, /\btitle:\s*\S/ ] },
  { label: 'meta description', res: [ /<meta\s+name=["']description["']\s+content=/, /\bdescription:\s*\S/ ] },
  { label: 'canonical',        res: [ /<link\s+rel=["']canonical["']\s+href=/, /\bcanonical:\s*\S/ ] },
  { label: 'og:type',          res: [ /<meta\s+property=["']og:type["']\s+content=/, /\btype:\s*['"]website['"]/ ] },
  { label: 'og:url',           res: [ /<meta\s+property=["']og:url["']\s+content=/, /og:\s*\{[\s\S]{0,400}?\burl:/ ] },
  { label: 'og:title',         res: [ /<meta\s+property=["']og:title["']\s+content=/, /og:\s*\{[\s\S]{0,400}?\btitle:/ ] },
  { label: 'og:description',   res: [ /<meta\s+property=["']og:description["']\s+content=/, /og:\s*\{[\s\S]{0,400}?\bdescription:/ ] },
  { label: 'og:image',         res: [ /<meta\s+property=["']og:image["']\s+content=/, /og:\s*\{[\s\S]{0,400}?\bimage:/ ] },
  { label: 'og:site_name',     res: [ /<meta\s+property=["']og:site_name["']\s+content=/, /\bsite_name:\s*\S/ ] },
  { label: 'twitter:card',     res: [ /<meta\s+name=["']twitter:card["']\s+content=/, /\bcard:\s*['"]summary_large_image['"]/ ] },
  { label: 'twitter:image',    res: [ /<meta\s+name=["']twitter:image["']\s+content=/, /twitter:\s*\{[\s\S]{0,400}?\bimage:/ ] },
  { label: 'JSON-LD',          res: [ /<script\s+type=["']application\/ld\+json["']>/, /\bjsonLd:\s*\[/ ] },
];

let failures = [];
const fail = (m) => failures.push(m);

console.log(`Auditing ${PAGES.length} page templates for full SEO surface...\n`);

for (const page of PAGES) {
  const abs = path.join(repoRoot, page.path);
  if (!fs.existsSync(abs)) {
    fail(`${page.name}: file not found at ${page.path}`);
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8');

  // Reject the Phase C placeholder noindex marker — Phase D real templates
  // must be indexable.
  if (/content=["']noindex/.test(src)) {
    fail(`${page.name}: contains "noindex" — Phase D real templates must be indexable.`);
  }

  const missing = REQUIRED.filter((r) => !r.res.some((re) => re.test(src))).map((r) => r.label);
  if (missing.length > 0) {
    fail(`${page.name} missing SEO elements: ${missing.join(', ')}`);
    continue;
  }

  console.log(`  ✓ ${page.name} — all ${REQUIRED.length} SEO elements present, indexable`);
}

// ─── Report ────────────────────────────────────────────────────────────────────

if (failures.length === 0) {
  console.log(`\n✓ Page-source SEO audit pass: ${PAGES.length} templates verified.`);
  process.exit(0);
}

console.error(`\n✗ ${failures.length} page-SEO audit failures:`);
for (const f of failures) console.error(`  - ${f}`);
process.exit(1);
