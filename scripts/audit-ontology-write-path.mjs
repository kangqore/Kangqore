#!/usr/bin/env node
/**
 * Ontology single-write-path gate.
 *
 * OntologyGateway states: "Every read and every write to OntologyObject /
 * OntologyRelationship must pass through here. There is no alternate write
 * path." That is only true if something enforces it — this does.
 *
 * A gateway that call sites can route around is a suggestion, not a kernel.
 * The gateway is what applies markings, the policy gate, cardinality, and CDC
 * emission; a direct prisma write silently skips all four.
 *
 * Exits non-zero when a write appears outside the allowlist below.
 *
 *   node scripts/audit-ontology-write-path.mjs          # enforce
 *   node scripts/audit-ontology-write-path.mjs --list   # show current state
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'backend/src')

// Files permitted to write ontology records directly.
//
// Every entry needs a reason. Shrink this list; do not grow it. If you are
// adding a file here, the question to answer first is why the write cannot go
// through OntologyGateway — usually it can.
const ALLOWLIST = new Map([
  ['kangqore-view/eof/OntologyGateway.ts', 'the gateway itself'],
  ['kangqore-view/esf/aegis/compliance/aegisComplianceTestSuite.ts', 'compliance suite: constructs fixtures to prove the gateway blocks them'],
  ['kangqore-view/eof/scripts/slice0-foundations-e2e.ts', 'probe: creates and tears down its own throwaway type, and asserts gateway behaviour'],
  ['kangqore-view/eof/scripts/enterprise-model-e2e.ts', 'probe: seeds and tears down its own fixture objects'],
  ['kangqore-view/eof/scripts/board-layer-e2e.ts', 'probe: seeds and tears down its own boards and objects'],
  ['kangqore-view/eof/scripts/intelligence-e2e.ts', 'probe: seeds and tears down its own objects and edges'],
  ['kangqore-view/eof/scripts/decision-e2e.ts', 'probe: seeds and tears down its own enterprise graph'],
  ['kangqore-view/eof/scripts/recovery-e2e.ts', 'probe: backdates and tears down its own fixture graph to test the approval gate'],
  ['kangqore-view/eof/scripts/introspection-e2e.ts', 'probe: read-only, but counts objects directly to verify filters'],
  ['kangqore-view/eof/scripts/templates-e2e.ts', 'probe: tears down the objects and edges its own template run created'],
  ['kangqore-view/eof/scripts/workview-e2e.ts', 'probe: seeds and tears down its own tasks and automation rules'],
  ['kangqore-view/eof/scripts/thread-ledger-fields-e2e.ts', 'probe: tears down its own objects, comments, runs and documents'],
  ['kangqore-view/eof/scripts/field-refresh-e2e.ts', 'probe: creates and tears down one task to exercise the refresh policy'],
  ['kangqore-view/eof/scripts/query-compiler-e2e.ts', 'probe: seeds and tears down its own throwaway type to test the compiler'],

  // ── Known debt, tracked in docs/DEFERRED.md ────────────────────────────────
  // These predate the gate. They are grandfathered so the check can be turned
  // on today rather than after a large refactor, and each should be removed.
  ['kangqore-view/eof/OntologyPipeline.ts', 'DEBT: bulk pipeline writes'],
  ['kangqore-view/eof/CanvasOntologyBridge.ts', 'DEBT: canvas sync'],
  ['kangqore-view/eof/OntologyCsvImport.ts', 'DEBT: bulk CSV import'],
  ['kangqore-view/eof/OntologyBranch.ts', 'DEBT: branch materialisation'],
  ['kangqore-view/eof/OntologyVersioning.ts', 'DEBT: version snapshots'],
  ['kangqore-view/automation/ActionEngine.ts', 'DEBT: action effects write objects directly'],
])

// Matches any Prisma client alias, not just `prisma`. The original regex only
// caught `prisma.ontologyObject.*`, so writes made through a transaction client
// — `tx.ontologyObject.update(...)` inside `$transaction` — were invisible.
// ActionEngine, the main execution path, writes exactly that way, so the gate
// reported clean while the busiest bypass in the codebase went unseen.
const WRITE =
  /\b(prisma|tx|client|db|trx)\s*\.\s*ontology(Object|Relationship)\s*\.\s*(create|createMany|update|updateMany|upsert|delete|deleteMany)\b/g

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) out.push(full)
  }
  return out
}

const listMode = process.argv.includes('--list')
const violations = []
const allowed = []

for (const file of walk(SRC)) {
  const rel = relative(SRC, file)
  const text = readFileSync(file, 'utf8')
  const hits = [...text.matchAll(WRITE)]
  if (!hits.length) continue

  const lines = hits.map(h => text.slice(0, h.index).split('\n').length)
  const record = { rel, count: hits.length, lines }

  if (ALLOWLIST.has(rel)) allowed.push({ ...record, reason: ALLOWLIST.get(rel) })
  else violations.push(record)
}

if (listMode || violations.length) {
  console.log('\nOntology write-path audit\n')
}

if (listMode) {
  console.log('  Allowlisted:')
  for (const a of allowed) {
    const debt = a.reason.startsWith('DEBT') ? ' ⚠' : ''
    console.log(`    ${String(a.count).padStart(2)}  ${a.rel}${debt}`)
    console.log(`        ${a.reason}`)
  }
  const debtCount = allowed.filter(a => a.reason.startsWith('DEBT')).reduce((s, a) => s + a.count, 0)
  console.log(`\n  ${allowed.length} allowlisted file(s); ${debtCount} write(s) still marked DEBT.`)
}

if (violations.length) {
  console.error('  Direct ontology writes outside OntologyGateway:\n')
  for (const v of violations) {
    console.error(`    ${v.rel}:${v.lines.join(',')}  (${v.count} write${v.count > 1 ? 's' : ''})`)
  }
  console.error(`
  These bypass the gateway, and therefore skip:
    • data-marking checks   — classified records become readable/writable
    • the AEGIS policy gate — DENY and REQUIRE_APPROVAL never evaluate
    • CDC emission          — webhooks and pipelines never fire

  Route the write through OntologyGateway.createObject / updateObject, or add
  the file to ALLOWLIST in this script with a reason that says why it cannot.
`)
  process.exit(1)
}

if (!listMode) {
  console.log(`✓ ontology write path: no bypasses outside the ${allowed.length}-file allowlist`)
}
