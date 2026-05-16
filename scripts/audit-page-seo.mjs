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
// This is a STATIC SOURCE-FILE audit — no running app required. The Phase E
// SEO surface is rendered by these components; if the source has the right
// JSX, the rendered HTML will too.
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
const REQUIRED = [
  { label: '<Helmet> import',         re: /import\s*\{\s*Helmet\s*\}\s*from\s*['"]react-helmet['"]/ },
  { label: '<Helmet> JSX usage',      re: /<Helmet>/ },
  { label: '<title>',                 re: /<title>[\s\S]+?<\/title>/ },
  { label: 'meta description',        re: /<meta\s+name=["']description["']\s+content=/ },
  { label: '<link rel="canonical">',  re: /<link\s+rel=["']canonical["']\s+href=/ },
  { label: 'og:type',                 re: /<meta\s+property=["']og:type["']\s+content=/ },
  { label: 'og:url',                  re: /<meta\s+property=["']og:url["']\s+content=/ },
  { label: 'og:title',                re: /<meta\s+property=["']og:title["']\s+content=/ },
  { label: 'og:description',          re: /<meta\s+property=["']og:description["']\s+content=/ },
  { label: 'og:image',                re: /<meta\s+property=["']og:image["']\s+content=/ },
  { label: 'og:site_name',            re: /<meta\s+property=["']og:site_name["']\s+content=/ },
  { label: 'twitter:card',            re: /<meta\s+name=["']twitter:card["']\s+content=/ },
  { label: 'twitter:image',           re: /<meta\s+name=["']twitter:image["']\s+content=/ },
  { label: 'JSON-LD <script>',        re: /<script\s+type=["']application\/ld\+json["']>/ },
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

  const missing = REQUIRED.filter((r) => !r.re.test(src)).map((r) => r.label);
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
