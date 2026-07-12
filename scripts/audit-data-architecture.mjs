#!/usr/bin/env node
// ─── Data Architecture Audit ───────────────────────────────────────────────────
// Guards the 6-Departments × N-Services canonical architecture.
// Drop-in replacement for the legacy `npx craco test --testPathPattern=dataArchitecture`
// step that broke when the frontend migrated from CRA/craco to Vite.
//
// Reads servicesData.js and departmentsData.js as text, extracts structure
// via regex (same approach as audit-legacy-coverage.mjs), and validates:
//   1. Total service count matches expectation
//   2. Per-department service counts match
//   3. departmentsData.serviceSlugs ↔ servicesData.departmentSlug are consistent
//   4. All relatedServiceSlugs reference valid canonical slugs
//   5. departmentsData.serviceCount matches the length of serviceSlugs
//
// Exit 0 on pass, non-zero on any failure.
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SERVICES_FILE    = path.join(repoRoot, 'frontend', 'src', 'data', 'servicesData.js');
const DEPARTMENTS_FILE = path.join(repoRoot, 'frontend', 'src', 'data', 'departmentsData.js');

const servicesSrc    = fs.readFileSync(SERVICES_FILE, 'utf8');
const departmentsSrc = fs.readFileSync(DEPARTMENTS_FILE, 'utf8');

let failures = [];
const fail = (m) => failures.push(m);

// ─── Extract canonical service slugs ──────────────────────────────────────────
// Matches top-level quoted keys of servicesData:  '  "slug": {'
const serviceSlugRe = /^\s{2}'([a-z0-9][a-z0-9-]*)':\s*\{/gm;
const canonicalServiceSlugs = [];
let m;
while ((m = serviceSlugRe.exec(servicesSrc)) !== null) {
  canonicalServiceSlugs.push(m[1]);
}
const canonicalServiceSlugSet = new Set(canonicalServiceSlugs);

// ─── Extract each service's departmentSlug ────────────────────────────────────
// For each service block, find 'departmentSlug: "<dept>"'
const serviceDeptMap = new Map(); // slug → departmentSlug
for (const slug of canonicalServiceSlugs) {
  // Find the block for this slug and extract its departmentSlug
  const keyRe = new RegExp(`(?<![a-z0-9-])'${slug.replace(/-/g, '\\-')}'\\s*:\\s*\\{`, 'm');
  const keyMatch = keyRe.exec(servicesSrc);
  if (!keyMatch) { fail(`Could not locate block for service "${slug}"`); continue; }

  // Find the closing brace of this service entry
  const blockStart = keyMatch.index + keyMatch[0].length - 1;
  let depth = 0;
  let blockEnd = blockStart;
  for (let i = blockStart; i < servicesSrc.length; i++) {
    if (servicesSrc[i] === '{') depth++;
    else if (servicesSrc[i] === '}') { depth--; if (depth === 0) { blockEnd = i; break; } }
  }
  const block = servicesSrc.slice(blockStart, blockEnd + 1);

  const deptMatch = /departmentSlug:\s*'([a-z0-9-]+)'/.exec(block);
  if (!deptMatch) { fail(`Service "${slug}" missing departmentSlug`); continue; }
  serviceDeptMap.set(slug, deptMatch[1]);
}

// ─── Extract departments ───────────────────────────────────────────────────────
const KNOWN_DEPTS = ['cognition', 'foundry', 'reimagine', 'shield', 'platforms', 'growth'];

const departmentInfo = new Map(); // slug → { serviceCount, serviceSlugs }
for (const dept of KNOWN_DEPTS) {
  if (!new RegExp(`^\\s{2}${dept}:\\s*\\{`, 'm').test(departmentsSrc)) {
    fail(`departmentsData.js missing expected key: ${dept}`);
    continue;
  }

  // Extract serviceCount
  const countRe = new RegExp(`${dept}:[\\s\\S]*?serviceCount:\\s*(\\d+)`);
  const countMatch = countRe.exec(departmentsSrc);
  const serviceCount = countMatch ? parseInt(countMatch[1], 10) : null;
  if (serviceCount === null) { fail(`${dept}: could not extract serviceCount`); continue; }

  // Extract serviceSlugs array
  const slugsBlockRe = new RegExp(`${dept}:[\\s\\S]*?serviceSlugs:\\s*\\[([^\\]]+)\\]`);
  const slugsBlockMatch = slugsBlockRe.exec(departmentsSrc);
  const slugsBlock = slugsBlockMatch ? slugsBlockMatch[1] : '';
  const serviceSlugsInDept = [];
  const slugExtractRe = /'([a-z0-9][a-z0-9-]*)'/g;
  let sm;
  while ((sm = slugExtractRe.exec(slugsBlock)) !== null) {
    serviceSlugsInDept.push(sm[1]);
  }

  departmentInfo.set(dept, { serviceCount, serviceSlugs: serviceSlugsInDept });
}

// ─── Validation ───────────────────────────────────────────────────────────────

// 1. Total service count
const EXPECTED_TOTAL = 62;
if (canonicalServiceSlugs.length !== EXPECTED_TOTAL) {
  fail(`Total services: expected ${EXPECTED_TOTAL}, found ${canonicalServiceSlugs.length}`);
}

// 2. Exactly 6 departments
if (KNOWN_DEPTS.length !== 6) {
  fail(`Expected 6 departments, found ${KNOWN_DEPTS.length}`);
}

// 3. Per-department expected counts
const EXPECTED_COUNTS = { cognition: 12, foundry: 17, reimagine: 12, shield: 5, platforms: 8, growth: 8 };
for (const [dept, expected] of Object.entries(EXPECTED_COUNTS)) {
  const info = departmentInfo.get(dept);
  if (!info) continue;
  if (info.serviceCount !== expected) {
    fail(`${dept}.serviceCount: expected ${expected}, found ${info.serviceCount}`);
  }
  if (info.serviceSlugs.length !== expected) {
    fail(`${dept}.serviceSlugs.length: expected ${expected}, found ${info.serviceSlugs.length}`);
  }
}

// 4. serviceCount matches serviceSlugs.length in departmentsData
for (const [dept, info] of departmentInfo) {
  if (info.serviceCount !== info.serviceSlugs.length) {
    fail(`${dept}: serviceCount (${info.serviceCount}) ≠ serviceSlugs.length (${info.serviceSlugs.length})`);
  }
}

// 5. Sum of department service counts = EXPECTED_TOTAL
const sum = [...departmentInfo.values()].reduce((t, i) => t + i.serviceCount, 0);
if (sum !== EXPECTED_TOTAL) {
  fail(`Sum of department service counts: expected ${EXPECTED_TOTAL}, got ${sum}`);
}

// 6. Every serviceSlugs entry in departmentsData exists in servicesData
for (const [dept, info] of departmentInfo) {
  for (const svcSlug of info.serviceSlugs) {
    if (!canonicalServiceSlugSet.has(svcSlug)) {
      fail(`departmentsData.${dept}.serviceSlugs includes "${svcSlug}" which is NOT in servicesData.js`);
    }
  }
}

// 7. Every service's departmentSlug is a known department
for (const [svcSlug, deptSlug] of serviceDeptMap) {
  if (!KNOWN_DEPTS.includes(deptSlug)) {
    fail(`Service "${svcSlug}" has unknown departmentSlug "${deptSlug}"`);
  }
}

// 8. departmentsData.serviceSlugs ↔ servicesData.departmentSlug are consistent
for (const [dept, info] of departmentInfo) {
  for (const svcSlug of info.serviceSlugs) {
    const actualDept = serviceDeptMap.get(svcSlug);
    if (actualDept && actualDept !== dept) {
      fail(`Inconsistency: "${svcSlug}" is in ${dept}.serviceSlugs but has departmentSlug="${actualDept}"`);
    }
  }
}
for (const [svcSlug, deptSlug] of serviceDeptMap) {
  const info = departmentInfo.get(deptSlug);
  if (info && !info.serviceSlugs.includes(svcSlug)) {
    fail(`Inconsistency: "${svcSlug}" has departmentSlug="${deptSlug}" but is NOT in ${deptSlug}.serviceSlugs`);
  }
}

// ─── Report ───────────────────────────────────────────────────────────────────

if (failures.length === 0) {
  console.log(`✓ Data architecture audit pass:`);
  console.log(`  • ${KNOWN_DEPTS.length} canonical departments`);
  console.log(`  • ${canonicalServiceSlugs.length} canonical services`);
  console.log(`  • Per-department: ${Object.entries(EXPECTED_COUNTS).map(([d,n]) => `${d}:${n}`).join(', ')}`);
  console.log(`  • All serviceSlugs ↔ departmentSlug references are consistent`);
  process.exit(0);
} else {
  console.error(`✗ ${failures.length} data-architecture failures:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
