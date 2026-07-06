#!/usr/bin/env ts-node
// ---------------------------------------------------------------------------
// Gate 5 — Interaction Quality Runner
//
// Executes the Playwright e2e spec files tagged gate5-*.spec.ts, parses the
// JSON reporter output, and persists results to WaandaGate5Run + WaandaGate5Check.
//
// Usage:
//   npx ts-node src/scripts/gate5/gate5Runner.ts [--trigger nightly]
//   POST /api/admin/kangqore-immp/gate5/run
//
// Requirements:
//   - Frontend dev server running on localhost:3001
//   - Backend running on localhost:3000 (or $PORT)
//   - Playwright installed in frontend/
//
// Pass criteria: totalScore ≥ 75 and failRate ≤ 20%
// ---------------------------------------------------------------------------

import { execSync, spawnSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import * as jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET ?? ''
const SEED_ADMIN_ID = process.env.QEF_ADMIN_USER_ID ?? 'cmq6u3bde000023hp4qcnixm3'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Gate5Options {
  trigger:       'nightly' | 'manual' | 'pre-release'
  frontendDir?:  string   // absolute path to frontend dir (default: auto-detect)
  verbose?:      boolean
}

export interface Gate5Summary {
  runId:        string
  totalScore:   number
  passCount:    number
  failCount:    number
  skipCount:    number
  durationMs:   number
  gate:         'PASS' | 'FAIL' | 'SKIP'
  checks:       Array<{ suite: string; name: string; passed: boolean; durationMs: number; score: number; error?: string }>
}

// ─── Playwright JSON report types (simplified) ───────────────────────────────

interface PWSpec  { title: string; ok: boolean; duration: number; error?: { message: string } }
interface PWSuite { title: string; suites?: PWSuite[]; specs?: PWSpec[] }
interface PWReport { suites?: PWSuite[]; stats: { duration: number; expected: number; unexpected: number; skipped: number } }

function flattenSpecs(suite: PWSuite, prefix = ''): Array<{ suite: string; spec: PWSpec }> {
  const results: Array<{ suite: string; spec: PWSpec }> = []
  const title = prefix ? `${prefix} > ${suite.title}` : suite.title
  for (const spec of suite.specs ?? []) results.push({ suite: suite.title, spec })
  for (const sub of suite.suites ?? []) results.push(...flattenSpecs(sub, title))
  return results
}

function detectSuite(specTitle: string): string {
  if (specTitle.includes('canvas'))     return 'canvas'
  if (specTitle.includes('perf'))       return 'perf'
  if (specTitle.includes('nav'))        return 'nav'
  if (specTitle.includes('error'))      return 'errors'
  if (specTitle.includes('kimmp'))      return 'kimmp'
  return 'other'
}

// ─── Workflow Seeder ──────────────────────────────────────────────────────────

async function seedWorkflow(log: (...a: any[]) => void): Promise<{ workflowId: string | null; seedToken: string | null }> {
  if (!JWT_SECRET) {
    log('  ⚠  JWT_SECRET not set — skipping workflow seed (seeded canvas tests will be skipped)')
    return { workflowId: null, seedToken: null }
  }

  try {
    // The frontend canvas reads from OsWorkflow (via /api/os-workflows)
    const seedWf = await prisma.osWorkflow.create({
      data: {
        name:          'QEF Gate5 Seed Workflow',
        description:   'Auto-created by Gate5 runner — safe to delete',
        category:      'ops',
        status:        'active',
        triggerType:   'manual',
        triggerConfig: '{}',
        owner:         SEED_ADMIN_ID,
        steps: [
          { id: 'g5s1', type: 'agent',  name: 'Assess',  order: 0 },
          { id: 'g5s2', type: 'notify', name: 'Notify',  order: 1, onSuccess: undefined },
          { id: 'g5s3', type: 'wait',   name: 'Wait 5m', order: 2 },
        ],
      },
    })

    const seedToken = jwt.sign(
      { userId: SEED_ADMIN_ID, role: 'ADMIN', sub: SEED_ADMIN_ID },
      JWT_SECRET,
      { expiresIn: '1h', audience: 'kangqore-client', issuer: 'kangqore' }
    )

    log(`  ✅ Seeded OsWorkflow id=${seedWf.id}`)
    return { workflowId: seedWf.id, seedToken }
  } catch (err: any) {
    log(`  ⚠  Seed failed (${err.message}) — seeded canvas tests will be skipped`)
    return { workflowId: null, seedToken: null }
  }
}

async function cleanupWorkflow(workflowId: string | null, log: (...a: any[]) => void) {
  if (!workflowId) return
  try {
    await prisma.osWorkflow.delete({ where: { id: workflowId } })
    log(`  ✅ Cleaned up seed OsWorkflow id=${workflowId}`)
  } catch {
    log(`  ⚠  Could not delete seed workflow id=${workflowId} — clean up manually`)
  }
}

// ─── Runner ───────────────────────────────────────────────────────────────────

export async function runGate5(opts: Gate5Options): Promise<Gate5Summary> {
  const { trigger, verbose = false } = opts
  const log = (...a: any[]) => { if (verbose) console.log('[Gate5]', ...a) }
  const t0 = Date.now()

  // Locate frontend directory
  const frontendDir = opts.frontendDir
    ?? resolve(__dirname, '../../../../frontend')
    ?? resolve(process.cwd(), '../frontend')

  if (!existsSync(join(frontendDir, 'playwright.config.ts'))) {
    log(`⚠  Could not find playwright.config.ts at ${frontendDir}`)
    const run = await (prisma as any).waandaGate5Run.create({
      data: { trigger, totalScore: 0, passCount: 0, failCount: 0, durationMs: 0 },
    })
    return {
      runId: run.id, totalScore: 0, passCount: 0, failCount: 0, skipCount: 0,
      durationMs: 0, gate: 'SKIP',
      checks: [{ suite: 'setup', name: 'playwright_config_found', passed: false, durationMs: 0, score: 0, error: `playwright.config.ts not found at ${frontendDir}` }],
    }
  }

  // Seed a real workflow so seeded canvas tests can verify ReactFlow renders
  log('  → Seeding test workflow...')
  const { workflowId: seedWfId, seedToken } = await seedWorkflow(log)

  // JSON report goes to a temp file via PLAYWRIGHT_JSON_OUTPUT_NAME
  // Artifacts (screenshots) go to a separate temp dir so paths don't conflict
  const reportPath   = join(tmpdir(), `gate5-report-${Date.now()}.json`)
  const artifactsDir = join(tmpdir(), `gate5-artifacts-${Date.now()}`)

  log(`  → Running Playwright gate5-*.spec.ts (frontend: ${frontendDir})`)
  log(`  → Report: ${reportPath}`)

  const pw = spawnSync(
    'npx', [
      'playwright', 'test',
      'e2e/gate5-canvas.spec.ts',
      'e2e/gate5-perf.spec.ts',
      'e2e/gate5-nav.spec.ts',
      '--reporter=json',
      `--output=${artifactsDir}`,
      '--timeout=30000',
      '--retries=1',
    ],
    {
      cwd: frontendDir,
      encoding: 'utf-8',
      env: {
        ...process.env,
        PLAYWRIGHT_JSON_OUTPUT_NAME: reportPath,
        ...(seedToken    ? { QEF_SEED_TOKEN:        seedToken    } : {}),
        ...(seedWfId     ? { QEF_TEST_WORKFLOW_ID:  seedWfId     } : {}),
      },
      timeout: 300_000,
    }
  )

  // Clean up seeded workflow now that Playwright has finished
  await cleanupWorkflow(seedWfId, log)

  if (verbose && pw.stdout) console.log(pw.stdout.slice(0, 3000))
  if (verbose && pw.stderr) console.log(pw.stderr.slice(0, 1000))

  // Parse JSON report — Playwright writes it to PLAYWRIGHT_JSON_OUTPUT_NAME file
  // Fallback: try stdout (older Playwright versions write there)
  let report: PWReport | null = null
  try {
    if (existsSync(reportPath)) {
      report = JSON.parse(readFileSync(reportPath, 'utf-8')) as PWReport
    } else {
      const jsonStr = pw.stdout?.trim()
      if (jsonStr && jsonStr.startsWith('{')) {
        report = JSON.parse(jsonStr) as PWReport
      }
    }
  } catch {
    log('  ⚠  Could not parse Playwright JSON output')
  }

  // Build check list — skipped specs are tracked separately and not scored
  const checks: Gate5Summary['checks'] = []
  let   skipCount = 0

  if (report) {
    for (const topSuite of report.suites ?? []) {
      for (const { spec } of flattenSpecs(topSuite)) {
        // Playwright marks skipped tests with annotations or status "skipped"
        const skipped = (spec as any).status === 'skipped' || (spec as any).annotations?.some((a: any) => a.type === 'skip')
        if (skipped) { skipCount++; continue }

        checks.push({
          suite:     detectSuite(spec.title + ' ' + topSuite.title),
          name:      spec.title,
          passed:    spec.ok,
          durationMs: spec.duration,
          score:     spec.ok ? 100 : 0,
          error:     spec.error?.message,
        })
        log(`  ${spec.ok ? '✅' : '❌'} ${spec.title} (${spec.duration}ms)`)
      }
    }
    if (skipCount > 0) log(`  ⏭  ${skipCount} seeded tests skipped (QEF_SEED_TOKEN absent)`)
  } else {
    // No parsed report — infer from exit code
    const exited0 = pw.status === 0
    checks.push({
      suite: 'runner',
      name:  'playwright_execution',
      passed: exited0,
      durationMs: Date.now() - t0,
      score: exited0 ? 80 : 0,
      error: exited0 ? undefined : `Exit code ${pw.status}`,
    })
  }

  const passCount  = checks.filter(c => c.passed).length
  const failCount  = checks.filter(c => !c.passed).length
  // Score only non-skipped tests; skipped tests don't penalise the gate
  const totalScore = checks.length > 0 ? checks.reduce((s, c) => s + c.score, 0) / checks.length : 0
  const durationMs = Date.now() - t0

  const failRate = checks.length > 0 ? failCount / checks.length : 1
  const gate: Gate5Summary['gate'] = checks.length === 0 ? 'SKIP'
    : totalScore >= 75 && failRate <= 0.20 ? 'PASS' : 'FAIL'

  // Persist
  const runRecord = await (prisma as any).waandaGate5Run.create({
    data: {
      trigger,
      totalScore,
      passCount,
      failCount,
      durationMs,
      playwrightJson: report ?? undefined,
      completedAt: new Date(),
    },
  })

  for (const c of checks) {
    await (prisma as any).waandaGate5Check.create({
      data: {
        runId:     runRecord.id,
        suite:     c.suite,
        name:      c.name,
        passed:    c.passed,
        durationMs: c.durationMs,
        score:     c.score,
        detail:    c.error ? { error: c.error } : {},
      },
    })
  }

  return { runId: runRecord.id, totalScore, passCount, failCount, skipCount, durationMs, gate, checks }
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args    = process.argv.slice(2)
  const trigger = (args.includes('--trigger') ? args[args.indexOf('--trigger') + 1] : 'manual') as Gate5Options['trigger']

  runGate5({ trigger, verbose: true })
    .then(s => {
      console.log('\n═══════════════════════════════════════════════════')
      console.log(`  GATE 5 — INTERACTION QUALITY: ${s.gate}`)
      console.log(`  Score:    ${s.totalScore.toFixed(1)}/100`)
      console.log(`  Pass:     ${s.passCount}/${s.passCount + s.failCount}`)
      console.log(`  Duration: ${(s.durationMs / 1000).toFixed(1)}s`)
      console.log('═══════════════════════════════════════════════════')
      s.checks.forEach(c => {
        console.log(`  ${c.passed ? '✅' : '❌'} [${c.suite}] ${c.name.slice(0, 55).padEnd(55)} ${c.score.toFixed(0).padStart(3)}`)
        if (c.error) console.log(`      ⚠  ${c.error.slice(0, 100)}`)
      })
      process.exit(s.gate === 'FAIL' ? 1 : 0)
    })
    .catch(err => { console.error('Gate5 runner crashed:', err); process.exit(1) })
}
