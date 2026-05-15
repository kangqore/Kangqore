#!/usr/bin/env node
// ─── Legacy Redirects Mirror Generator ─────────────────────────────────────────
// Reads the canonical source at shared/legacyRedirects.json and writes two
// committed mirror files:
//   - frontend/src/data/legacyRedirects.generated.json
//   - backend/src/data/legacyRedirects.generated.json
//
// Why: CRA's ModuleScopePlugin blocks frontend imports from outside
// frontend/src/. Backend should not reach into frontend's source tree.
// So both consumers read their own colocated mirror, generated from the one
// canonical source.
//
// Usage:
//   node scripts/generate-redirects.mjs            # regenerate mirrors
//   node scripts/generate-redirects.mjs --check    # CI: fail if drift detected
//
// See plan Section 20.6 for rationale.
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SOURCE = path.join(repoRoot, 'shared', 'legacyRedirects.json');
const MIRRORS = [
  path.join(repoRoot, 'frontend', 'src', 'data', 'legacyRedirects.generated.json'),
  path.join(repoRoot, 'backend', 'src', 'data', 'legacyRedirects.generated.json'),
];

// ─── Read + validate canonical source ──────────────────────────────────────────
if (!fs.existsSync(SOURCE)) {
  console.error(`ERROR: canonical source not found at ${path.relative(repoRoot, SOURCE)}`);
  process.exit(2);
}

let sourceParsed;
try {
  sourceParsed = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
} catch (err) {
  console.error(`ERROR: ${path.relative(repoRoot, SOURCE)} is not valid JSON:`);
  console.error(err.message);
  process.exit(2);
}

if (typeof sourceParsed !== 'object' || sourceParsed === null || Array.isArray(sourceParsed)) {
  console.error(`ERROR: ${path.relative(repoRoot, SOURCE)} must be a flat object map.`);
  process.exit(2);
}

// Sanity checks on entries: every key and value must be a non-empty string
// starting with '/'.
for (const [from, to] of Object.entries(sourceParsed)) {
  if (typeof from !== 'string' || !from.startsWith('/')) {
    console.error(`ERROR: invalid source key "${from}" — must start with '/'.`);
    process.exit(2);
  }
  if (typeof to !== 'string' || !to.startsWith('/')) {
    console.error(`ERROR: invalid destination "${to}" for key "${from}" — must start with '/'.`);
    process.exit(2);
  }
  if (from === to) {
    console.error(`ERROR: redirect loops to itself: "${from}".`);
    process.exit(2);
  }
}

// ─── Canonicalize mirror format ────────────────────────────────────────────────
// Sort keys alphabetically (localeCompare for deterministic ordering across
// Node versions and locales). Pretty-print 2-space. Trailing newline.
const canonicalEntries = Object.entries(sourceParsed).sort(([a], [b]) => a.localeCompare(b));
const mirrorContent =
  JSON.stringify(Object.fromEntries(canonicalEntries), null, 2) + '\n';

const mode = process.argv.includes('--check') ? 'check' : 'write';
const totalEntries = canonicalEntries.length;

// ─── Apply ─────────────────────────────────────────────────────────────────────
let drift = 0;
for (const mirror of MIRRORS) {
  const rel = path.relative(repoRoot, mirror);
  if (mode === 'check') {
    if (!fs.existsSync(mirror)) {
      console.error(`DRIFT: ${rel} is missing.`);
      drift++;
      continue;
    }
    const current = fs.readFileSync(mirror, 'utf8');
    if (current !== mirrorContent) {
      console.error(`DRIFT: ${rel} does not match ${path.relative(repoRoot, SOURCE)}.`);
      console.error('       Run `npm run redirects:generate` to fix.');
      drift++;
    }
  } else {
    // Ensure parent directory exists
    fs.mkdirSync(path.dirname(mirror), { recursive: true });
    fs.writeFileSync(mirror, mirrorContent);
    console.log(`wrote ${rel} (${totalEntries} entries)`);
  }
}

if (mode === 'check') {
  if (drift > 0) {
    console.error(`\n${drift} mirror(s) drifted from canonical source.`);
    process.exit(1);
  }
  console.log(`no drift — ${totalEntries} entries verified across ${MIRRORS.length} mirrors`);
} else {
  console.log(`\ndone — ${totalEntries} entries written to ${MIRRORS.length} mirrors`);
}
