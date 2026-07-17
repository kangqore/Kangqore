#!/usr/bin/env node
/**
 * PS Pack v1.0 — End-to-End Import Test
 *
 * Usage:
 *   BACKEND_URL=http://localhost:3000 AUTH_TOKEN=<your-token> node test-import.js
 *
 * What it does:
 *   1. Validates the blueprint spec via /admin/enterprise/blueprints/validate
 *   2. Imports it via /admin/enterprise/blueprints/import (uses TEST org name)
 *   3. Verifies all 8 provisioning steps completed via GET endpoints
 *   4. Checks Gate 8 OIS score and COIG baseline are set
 *   5. Prints a pass/fail report
 *
 * The import is idempotent — running this twice skips existing entities.
 */

import { readFileSync } from 'fs'
import { fileURLToPath }  from 'url'
import { dirname, join }  from 'path'

const __dir        = dirname(fileURLToPath(import.meta.url))
const BACKEND_URL  = process.env.BACKEND_URL ?? 'http://localhost:3000'
const AUTH_TOKEN   = process.env.AUTH_TOKEN  ?? ''
const TEST_ORG     = process.env.TEST_ORG    ?? 'Test Client — PS Pack v1.0 Import Verification'
const DRY_RUN      = process.env.DRY_RUN     === '1'

if (!AUTH_TOKEN) {
  console.error('\n[FAIL] AUTH_TOKEN env var required.\n  Run with: AUTH_TOKEN=<token> node test-import.js\n')
  process.exit(1)
}

const BASE = `${BACKEND_URL}/api/admin`

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  return { ok: res.ok, status: res.status, data }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function pass(label, detail = '') {
  console.log(`  ✓  ${label}${detail ? `  →  ${detail}` : ''}`)
  passed++
}

function fail(label, reason = '') {
  console.error(`  ✗  ${label}${reason ? `  →  ${reason}` : ''}`)
  failed++
}

function section(title) {
  console.log(`\n─── ${title} ${'─'.repeat(Math.max(0, 50 - title.length))}`)
}

// ── Main ───────────────────────────────────────────────────────────────────────

const raw = readFileSync(join(__dir, 'blueprint.json'), 'utf8')
const spec = JSON.parse(raw)

console.log('\n╔══════════════════════════════════════════════════════════════╗')
console.log('║   PS Pack v1.0 — Import Test                                ║')
console.log('╚══════════════════════════════════════════════════════════════╝')
console.log(`  Backend : ${BACKEND_URL}`)
console.log(`  Org     : ${TEST_ORG}`)
console.log(`  Mode    : ${DRY_RUN ? 'DRY RUN (validate only)' : 'FULL IMPORT'}`)

// ── Step 1: Validate ──────────────────────────────────────────────────────────
section('Step 1 — Blueprint Validation')

const testSpec = { ...spec, organization: { ...spec.organization, name: TEST_ORG } }
const vRes = await api('POST', '/enterprise/blueprints/validate', { spec: testSpec })

if (!vRes.ok) {
  fail('Validate endpoint reachable', `HTTP ${vRes.status}`)
  console.error('\nCannot continue — validate endpoint unreachable. Is the backend running?')
  process.exit(1)
}

const report = vRes.data
pass('Validate endpoint reachable', `HTTP ${vRes.status}`)

if (report.readinessScore !== undefined) {
  const scoreOk = report.readinessScore >= 80
  const fn = scoreOk ? pass : fail
  fn(`Readiness score ≥ 80`, `${report.readinessScore}/100`)
}

if (Array.isArray(report.errors) && report.errors.length === 0) {
  pass('No validation errors')
} else {
  fail('No validation errors', `${report.errors?.length ?? '?'} error(s): ${(report.errors ?? []).map(e => e.message).join('; ')}`)
}

const sectionKeys = ['organization', 'goals', 'ontology', 'policies', 'agents', 'playbooks', 'oisProfile', 'dnaProfile', 'qefGates']
for (const key of sectionKeys) {
  const sec = report.sections?.[key]
  if (!sec) { fail(`Section: ${key}`, 'not in report'); continue }
  if (sec.status === 'READY') pass(`Section: ${key}`, sec.summary)
  else if (sec.status === 'NEEDS_CONFIG') fail(`Section: ${key}`, `NEEDS_CONFIG — ${sec.summary}`)
  else fail(`Section: ${key}`, `MISSING`)
}

if (report.warnings?.length > 0) {
  console.log(`\n  Warnings (${report.warnings.length}):`)
  for (const w of report.warnings) {
    console.log(`    ⚠  [${w.section}] ${w.message}`)
  }
}

if (DRY_RUN) {
  console.log('\n[DRY RUN] Stopping after validation. Set DRY_RUN=0 to run full import.\n')
  printSummary()
  process.exit(failed > 0 ? 1 : 0)
}

if (failed > 0) {
  console.error('\n[ABORT] Validation failed — fix errors before importing.\n')
  printSummary()
  process.exit(1)
}

// ── Step 2: Import ────────────────────────────────────────────────────────────
section('Step 2 — Blueprint Import')

const iRes = await api('POST', '/enterprise/blueprints/import', {
  spec:          testSpec,
  blueprintName: `PS Pack v1.0 — ${TEST_ORG}`,
})

if (!iRes.ok) {
  fail('Import succeeded', `HTTP ${iRes.status}: ${iRes.data?.error ?? JSON.stringify(iRes.data)}`)
  printSummary()
  process.exit(1)
}

const result = iRes.data
pass('Import succeeded', `blueprintId: ${result.blueprintId}`)

const expectedCreated = ['goals', 'entityTypes', 'policies', 'workflows', 'agents', 'dna', 'baseline']
for (const key of expectedCreated) {
  const c = result.created?.[key] ?? 0
  const s = result.skipped?.[key] ?? 0
  if (c > 0)      pass(`Provisioned: ${key}`, `created=${c}`)
  else if (s > 0) pass(`Provisioned: ${key}`, `skipped=${s} (already existed — idempotent)`)
  else            fail(`Provisioned: ${key}`, `created=0, skipped=0`)
}

if (result.nextSteps?.length > 0) {
  pass('Next steps returned', `${result.nextSteps.length} steps`)
}

const blueprintId = result.blueprintId

// ── Step 3: Verify provisioned entities ───────────────────────────────────────
section('Step 3 — Verify Provisioned Entities')

const [bpRes, defRes, oisRes, coigRes] = await Promise.all([
  api('GET', `/enterprise/blueprints/${blueprintId}`),
  api('GET', '/enterprise/definition'),
  api('GET', '/gate8/score'),
  api('GET', '/enterprise/coig'),
])

// Blueprint record
if (bpRes.ok && bpRes.data?.id === blueprintId) {
  pass('Blueprint record in DB', `status=${bpRes.data.status}`)
} else {
  fail('Blueprint record in DB', `HTTP ${bpRes.status}`)
}

// Enterprise definition + goals
if (defRes.ok && defRes.data?.active !== false) {
  const goalCount = defRes.data?.goals?.length ?? 0
  pass('Enterprise definition active', `${goalCount} goals`)
  if (goalCount >= 5) pass('All 5 PS Pack goals seeded', goalCount)
  else fail('All 5 PS Pack goals seeded', `only ${goalCount}`)
} else {
  fail('Enterprise definition active', `HTTP ${defRes.status}`)
}

// OIS score
if (oisRes.ok && typeof oisRes.data?.oisScore === 'number') {
  pass('Gate 8 OIS score computable', `${oisRes.data.oisScore}/100`)
} else {
  fail('Gate 8 OIS score computable', `HTTP ${oisRes.status}`)
}

// COIG baseline
if (coigRes.ok) {
  const c = coigRes.data
  const hasBaseline = c.baselineOis !== undefined || c.baselineId !== null
  if (hasBaseline) {
    pass('COIG baseline set', `baselineOis=${c.baselineOis}, daysSince=${c.daysSince ?? 0}`)
  } else {
    fail('COIG baseline set', 'baselineId is null — Gate8Snapshot BASELINE not found')
  }
  pass('COIG delta computable', `current=${c.current}, expected=${c.expected}`)
} else {
  fail('COIG baseline set', `HTTP ${coigRes.status}`)
}

// ── Step 4: Verify Customer Zero report ───────────────────────────────────────
section('Step 4 — Customer Zero Report')

const czRes = await api('GET', '/enterprise/customer-zero')
if (!czRes.ok) {
  fail('Customer Zero report accessible', `HTTP ${czRes.status}`)
} else {
  const cz = czRes.data
  pass('Customer Zero report accessible')
  if (cz.verifiedBy) pass('COIG methodology verified', cz.verifiedBy)
  if (typeof cz.oisAfter === 'number') pass('OIS After populated', cz.oisAfter)
  if (Array.isArray(cz.goalProgress) && cz.goalProgress.length > 0) {
    pass('Goal progress populated', `${cz.goalProgress.length} goals`)
  } else {
    fail('Goal progress populated', 'empty — goals may not be seeded')
  }
}

// ── Step 5: Cleanup check ─────────────────────────────────────────────────────
section('Step 5 — Setup Time Estimate')

if (result.setupTimeEstimateMinutes) {
  const ok = result.setupTimeEstimateMinutes <= 10
  const fn = ok ? pass : fail
  fn('Setup time ≤ 10 minutes', `${result.setupTimeEstimateMinutes} min`)
}

// ── Summary ───────────────────────────────────────────────────────────────────
function printSummary() {
  const total = passed + failed
  console.log(`\n${'═'.repeat(62)}`)
  console.log(`  Results: ${passed}/${total} passed   ${failed > 0 ? `(${failed} FAILED)` : '(ALL PASS)'}`)
  console.log(`${'═'.repeat(62)}\n`)
}

printSummary()
process.exit(failed > 0 ? 1 : 0)
