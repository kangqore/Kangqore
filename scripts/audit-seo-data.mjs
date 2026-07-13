#!/usr/bin/env node
// ─── SEO Data Completeness Audit (Phase F) ─────────────────────────────────────
// Verifies that frontend/src/data/seoData.js has:
//   - departmentSEO entry for all 6 canonical departments (cognition, foundry,
//     reimagine, shield, platforms, growth)
//   - serviceSEO entry for all 61 service slugs (from servicesData.js)
//
// For each entry, asserts title (10-70 chars) + description (100-160 chars).
// Why 100-160 for description: Google truncates at ~158 on desktop; under 100
// looks underprovisioned in SERPs.
//
// Pure static analysis on the source files — no running app required.
// Exit 0 on pass, non-zero on any audit failure.
//
// Usage:  node scripts/audit-seo-data.mjs
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SEO_FILE = path.join(repoRoot, 'frontend', 'src', 'data', 'seoData.js');
const SERVICES_FILE = path.join(repoRoot, 'frontend', 'src', 'data', 'servicesData.js');

const EXPECTED_DEPTS = ['cognition', 'foundry', 'reimagine', 'shield', 'platforms', 'growth'];

const TITLE_MIN = 10;
const TITLE_MAX = 70;
const DESC_MIN = 100;
const DESC_MAX = 165;  // slight slack over Google's ~158 cutoff

let failures = [];

function fail(msg) {
  failures.push(msg);
}

// ─── Parse seoData.js for departmentSEO and serviceSEO objects ─────────────────

if (!fs.existsSync(SEO_FILE)) {
  console.error(`ERROR: ${path.relative(repoRoot, SEO_FILE)} not found`);
  process.exit(2);
}
const seoSrc = fs.readFileSync(SEO_FILE, 'utf8');

// Find the start of `export const departmentSEO = {` block
function extractObjectLiteral(src, exportName) {
  const re = new RegExp(`export const ${exportName}\\s*=\\s*\\{`, 'm');
  const m = re.exec(src);
  if (!m) return null;
  const startIdx = m.index + m[0].length - 1; // index of opening '{'
  let depth = 0;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return src.slice(startIdx, i + 1);
    }
  }
  return null;
}

const deptSeoBlock = extractObjectLiteral(seoSrc, 'departmentSEO');
const serviceSeoBlock = extractObjectLiteral(seoSrc, 'serviceSEO');

if (!deptSeoBlock) {
  console.error('ERROR: departmentSEO export not found in seoData.js');
  process.exit(2);
}
if (!serviceSeoBlock) {
  console.error('ERROR: serviceSEO export not found in seoData.js');
  process.exit(2);
}

// For each slug, find the entry in the block and extract title/description.
function findEntry(block, slug) {
  const keyRe = new RegExp(`(?<![a-z0-9-])${slug.replace(/-/g, '\\-')}['"]?\\s*:\\s*\\{`, 'm');
  const m = keyRe.exec(block);
  if (!m) return null;
  const start = m.index + m[0].length - 1; // index of '{'
  let depth = 0;
  for (let i = start; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) return block.slice(start, i + 1);
    }
  }
  return null;
}

function extractField(entryBlock, fieldName) {
  // matches e.g.   title: 'Foo bar | Kangqore',  OR  title: "Foo bar | Kangqore",
  const re = new RegExp(`${fieldName}:\\s*(['\"])((?:\\\\.|(?!\\1).)*)\\1`, 'm');
  const m = re.exec(entryBlock);
  return m ? m[2] : null;
}

function auditEntry(kind, slug, entryBlock) {
  if (!entryBlock) {
    fail(`${kind} entry missing for slug: ${slug}`);
    return;
  }
  const title = extractField(entryBlock, 'title');
  const desc = extractField(entryBlock, 'description');
  if (!title) {
    fail(`${kind}[${slug}].title is missing`);
  } else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
    fail(`${kind}[${slug}].title length ${title.length} (expected ${TITLE_MIN}-${TITLE_MAX}): "${title}"`);
  }
  if (!desc) {
    fail(`${kind}[${slug}].description is missing`);
  } else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    fail(`${kind}[${slug}].description length ${desc.length} (expected ${DESC_MIN}-${DESC_MAX}): "${desc.slice(0, 80)}..."`);
  }
}

// ─── Audit 6 departments ───────────────────────────────────────────────────────

console.log('Auditing departmentSEO entries...');
for (const slug of EXPECTED_DEPTS) {
  const entry = findEntry(deptSeoBlock, slug);
  auditEntry('departmentSEO', slug, entry);
}

// ─── Extract service slugs from servicesData.js and audit ──────────────────────

if (!fs.existsSync(SERVICES_FILE)) {
  console.error(`ERROR: ${path.relative(repoRoot, SERVICES_FILE)} not found`);
  process.exit(2);
}
const servicesSrc = fs.readFileSync(SERVICES_FILE, 'utf8');
const serviceSlugRe = /^\s{2}'([a-z0-9][a-z0-9-]*)':\s*\{/gm;
const serviceSlugs = [];
let m;
while ((m = serviceSlugRe.exec(servicesSrc)) !== null) {
  serviceSlugs.push(m[1]);
}
if (serviceSlugs.length !== 62) {
  console.error(`ERROR: expected 62 service slugs, found ${serviceSlugs.length}`);
  process.exit(2);
}

console.log(`Auditing serviceSEO entries for ${serviceSlugs.length} services...`);
for (const slug of serviceSlugs) {
  const entry = findEntry(serviceSeoBlock, slug);
  auditEntry('serviceSEO', slug, entry);
}

// ─── Report ────────────────────────────────────────────────────────────────────

if (failures.length === 0) {
  console.log(`\n✓ All SEO entries pass: ${EXPECTED_DEPTS.length} departments + ${serviceSlugs.length} services`);
  console.log(`  Title length range: ${TITLE_MIN}-${TITLE_MAX} chars`);
  console.log(`  Description length range: ${DESC_MIN}-${DESC_MAX} chars`);
  process.exit(0);
}

console.error(`\n✗ ${failures.length} SEO audit failures:`);
for (const f of failures) console.error(`  - ${f}`);
process.exit(1);
