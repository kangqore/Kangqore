#!/usr/bin/env node
// ─── Legacy URL Coverage Audit (Phase F) ───────────────────────────────────────
// Verifies the 76-row legacyRedirects map is CONSISTENT — every entry targets
// a real canonical URL in the new architecture.
//
// Checks performed (pure static, no running app):
//
//   1. Every key starts with /department/ (singular legacy dept) OR
//      /services/<x>/<y> (nested legacy service path). No other shapes.
//
//   2. Every /department/<old> value resolves to /departments/<new> where
//      <new> is one of the 6 canonical departments.
//
//   3. Every /services/<x>/<y> value resolves to /services/<svc> (FLAT) where
//      <svc> is a real slug in servicesData.js.
//
//   4. The count: 15 dept redirects + 61 service redirects = 76 total.
//
//   5. No two keys map to the same destination ambiguously (this would never
//      happen for service slugs since each canonical slug is unique; only
//      dept slugs collapse — verify they collapse to the EXPECTED 6 buckets).
//
// Pure static analysis. Exit 0 on pass, non-zero on any audit failure.
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SHARED_REDIRECTS = path.join(repoRoot, 'shared', 'legacyRedirects.json');
const SERVICES_FILE = path.join(repoRoot, 'frontend', 'src', 'data', 'servicesData.js');

const EXPECTED_NEW_DEPTS = new Set([
  'cognition', 'foundry', 'reimagine', 'shield', 'platforms', 'growth',
]);

let failures = [];
const fail = (m) => failures.push(m);

// ─── Load data ─────────────────────────────────────────────────────────────────

const redirects = JSON.parse(fs.readFileSync(SHARED_REDIRECTS, 'utf8'));
const servicesSrc = fs.readFileSync(SERVICES_FILE, 'utf8');

// Canonical service slugs (61 of them)
const serviceSlugRe = /^\s{2}'([a-z0-9][a-z0-9-]*)':\s*\{/gm;
const canonicalServiceSlugs = new Set();
let sm;
while ((sm = serviceSlugRe.exec(servicesSrc)) !== null) {
  canonicalServiceSlugs.add(sm[1]);
}
if (canonicalServiceSlugs.size !== 61) {
  console.error(`ERROR: expected 61 canonical service slugs, found ${canonicalServiceSlugs.size}`);
  process.exit(2);
}

console.log(`Auditing ${Object.keys(redirects).length} redirect entries against ${canonicalServiceSlugs.size} canonical services + ${EXPECTED_NEW_DEPTS.size} canonical departments...\n`);

// ─── Per-entry validation ──────────────────────────────────────────────────────

let deptRedirectCount = 0;
let serviceRedirectCount = 0;

for (const [from, to] of Object.entries(redirects)) {
  // Check 1: key shape
  const isDeptKey = /^\/department\/[a-z0-9-]+$/.test(from);
  const isServiceKey = /^\/services\/[a-z0-9-]+\/[a-z0-9-]+$/.test(from);
  if (!isDeptKey && !isServiceKey) {
    fail(`Redirect key has unexpected shape: "${from}" (must be /department/<slug> or /services/<dept>/<svc>)`);
    continue;
  }

  if (isDeptKey) {
    deptRedirectCount++;
    // Check 2: dept target shape + valid new slug
    const deptMatch = /^\/departments\/([a-z0-9-]+)$/.exec(to);
    if (!deptMatch) {
      fail(`Dept redirect "${from}" → "${to}" — target should be /departments/<slug>`);
      continue;
    }
    if (!EXPECTED_NEW_DEPTS.has(deptMatch[1])) {
      fail(`Dept redirect "${from}" → "${to}" — target dept "${deptMatch[1]}" is not one of the 6 canonical depts`);
    }
  } else {
    serviceRedirectCount++;
    // Check 3: service target shape + valid canonical slug
    const svcMatch = /^\/services\/([a-z0-9-]+)$/.exec(to);
    if (!svcMatch) {
      fail(`Service redirect "${from}" → "${to}" — target should be FLAT /services/<slug> (not nested)`);
      continue;
    }
    if (!canonicalServiceSlugs.has(svcMatch[1])) {
      fail(`Service redirect "${from}" → "${to}" — target slug "${svcMatch[1]}" is not in servicesData.js`);
    }
  }
}

// ─── Check 4: total counts ─────────────────────────────────────────────────────

if (deptRedirectCount !== 15) {
  fail(`Expected 15 /department/* redirects, found ${deptRedirectCount}`);
}
if (serviceRedirectCount !== 61) {
  fail(`Expected 61 /services/* nested redirects, found ${serviceRedirectCount}`);
}

// ─── Check 5: every canonical service is the TARGET of exactly one redirect ────
// (Each old nested URL collapses to ONE canonical URL; the canonical service
//  should appear as a redirect target exactly once.)

const serviceTargetCounts = new Map();
for (const to of Object.values(redirects)) {
  const m = /^\/services\/([a-z0-9-]+)$/.exec(to);
  if (m) serviceTargetCounts.set(m[1], (serviceTargetCounts.get(m[1]) || 0) + 1);
}
for (const slug of canonicalServiceSlugs) {
  const count = serviceTargetCounts.get(slug) || 0;
  if (count === 0) {
    fail(`Canonical service "${slug}" has NO legacy redirect pointing to it — old URL coverage gap`);
  } else if (count > 1) {
    fail(`Canonical service "${slug}" is the target of ${count} redirects — duplicate source paths`);
  }
}

// ─── Check 6: department targets collapse correctly ────────────────────────────

const deptTargetCounts = new Map();
for (const to of Object.values(redirects)) {
  const m = /^\/departments\/([a-z0-9-]+)$/.exec(to);
  if (m) deptTargetCounts.set(m[1], (deptTargetCounts.get(m[1]) || 0) + 1);
}
for (const slug of EXPECTED_NEW_DEPTS) {
  const count = deptTargetCounts.get(slug) || 0;
  if (count === 0) {
    fail(`Canonical department "${slug}" has NO legacy /department/* redirect pointing to it`);
  }
}

// ─── Report ────────────────────────────────────────────────────────────────────

if (failures.length === 0) {
  console.log(`✓ Legacy coverage audit pass:`);
  console.log(`  • ${deptRedirectCount} /department/<old> → /departments/<new> redirects (target = 1 of 6 canonical depts)`);
  console.log(`  • ${serviceRedirectCount} /services/<old-dept>/<svc> → /services/<svc> flat redirects (target = canonical service)`);
  console.log(`  • Every one of 61 canonical services has exactly one legacy redirect pointing to it`);
  console.log(`  • All 6 canonical departments are reachable via at least one legacy /department/* redirect`);
  process.exit(0);
}

console.error(`✗ ${failures.length} legacy-coverage failures:`);
for (const f of failures) console.error(`  - ${f}`);
process.exit(1);
