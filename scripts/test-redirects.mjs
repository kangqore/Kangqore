#!/usr/bin/env node
// ─── Legacy Redirects Smoke Test ───────────────────────────────────────────────
// Verifies that every entry in shared/legacyRedirects.json returns HTTP 301
// with the correct Location header from a running Express server.
//
// Usage:
//   TEST_BASE_URL=http://localhost:5050 node scripts/test-redirects.mjs
//
// Defaults to http://localhost:5050 if TEST_BASE_URL is unset.
//
// Exit codes:
//   0 — all 76 redirects pass
//   1 — one or more redirects failed
//   2 — could not reach base URL / setup error
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SOURCE = path.join(repoRoot, 'shared', 'legacyRedirects.json');
const BASE = (process.env.TEST_BASE_URL || 'http://localhost:5050').replace(/\/$/, '');

if (!fs.existsSync(SOURCE)) {
  console.error(`ERROR: ${path.relative(repoRoot, SOURCE)} not found`);
  process.exit(2);
}

let legacyRedirects;
try {
  legacyRedirects = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
} catch (err) {
  console.error(`ERROR: failed to parse ${path.relative(repoRoot, SOURCE)}: ${err.message}`);
  process.exit(2);
}

// Sanity: verify base URL is reachable before running 76 tests
try {
  const probe = await fetch(BASE, { redirect: 'manual' });
  // Any HTTP response (incl. 200/3xx/4xx/5xx) means server reachable
  void probe.status;
} catch (err) {
  console.error(`ERROR: cannot reach ${BASE}: ${err.message}`);
  console.error('       Hint: docker run -p 5050:5050 <image>, then re-run with TEST_BASE_URL set.');
  process.exit(2);
}

const entries = Object.entries(legacyRedirects);
let failed = 0;
const failures = [];

console.log(`Testing ${entries.length} redirects against ${BASE}\n`);

for (const [from, expectedTo] of entries) {
  let status;
  let location;
  try {
    const res = await fetch(BASE + from, { redirect: 'manual' });
    status = res.status;
    location = res.headers.get('location');
  } catch (err) {
    failed++;
    failures.push(`${from} → fetch error: ${err.message}`);
    continue;
  }

  // Accept HTTP 301 (strict) and 308 (Vercel-style "permanent" — SEO-equivalent).
  // Reject 302 (temporary), 200 (no redirect), and others.
  const isRedirect = status === 301 || status === 308;
  // Location may be absolute (https://host/path) or relative (/path).
  // Match if the path component equals expectedTo.
  let locationPath = location;
  if (location && location.startsWith('http')) {
    try {
      locationPath = new URL(location).pathname + new URL(location).search;
    } catch {
      /* fall through with raw location */
    }
  }
  const locationMatches = locationPath === expectedTo;

  if (!isRedirect || !locationMatches) {
    failed++;
    failures.push(`${from} → expected 301 → ${expectedTo}, got ${status} → ${location}`);
  }
}

const passed = entries.length - failed;
console.log(`Result: ${passed}/${entries.length} redirects pass\n`);

if (failed > 0) {
  console.error(`FAILURES:`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}

console.log('All redirects OK.');
process.exit(0);
