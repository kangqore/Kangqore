#!/usr/bin/env ts-node
// ---------------------------------------------------------------------------
// Gate 4 — Autonomous Operations Validation Runner
//
// Runs 7 WAOE scenarios directly against the DB (no HTTP layer needed).
// Each scenario validates a specific aspect of autonomous operation.
//
// Usage:
//   npx ts-node src/scripts/gate4/gate4Runner.ts [--trigger manual]
//
// Or imported by nightly CI or API endpoint:
//   import { runGate4 } from './gate4Runner'
//   const summary = await runGate4({ trigger: 'nightly' })
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'
import { scenarioPlanning }     from './scenarios/01-planning'
import { scenarioExecution }    from './scenarios/02-execution'
import { scenarioGovernance }   from './scenarios/03-governance'
import { scenarioLearning }     from './scenarios/04-learning'
import { scenarioRecovery }     from './scenarios/05-recovery'
import { scenarioObservability } from './scenarios/06-observability'
import { scenarioMondayMorning } from './scenarios/07-monday-morning'
import type { ScenarioResult }  from './scenarioHelpers'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Gate4Options {
  trigger:  'nightly' | 'manual' | 'pre-release'
  verbose?: boolean
}

export interface Gate4Summary {
  runId:       string
  totalScore:  number
  passCount:   number
  failCount:   number
  durationMs:  number
  gate:        'PASS' | 'FAIL'
  results:     Array<{ scenario: string; score: number; passed: boolean; assertionCount: number; failedAssertions: string[] }>
}

// ─── Scenario registry ────────────────────────────────────────────────────────

const SCENARIOS: Array<{ name: string; fn: () => Promise<ScenarioResult> }> = [
  { name: 'Planning',              fn: scenarioPlanning },
  { name: 'Execution',             fn: scenarioExecution },
  { name: 'Governance',            fn: scenarioGovernance },
  { name: 'Learning',              fn: scenarioLearning },
  { name: 'Recovery',              fn: scenarioRecovery },
  { name: 'Observability',         fn: scenarioObservability },
  { name: 'Monday Morning (Composite)', fn: scenarioMondayMorning },
]

// ─── Runner ───────────────────────────────────────────────────────────────────

export async function runGate4(opts: Gate4Options): Promise<Gate4Summary> {
  const { trigger, verbose = false } = opts
  const runStart = Date.now()

  const log = (...args: any[]) => { if (verbose) console.log('[Gate4]', ...args) }

  // Create run record
  const gate4Run = await (prisma as any).kimmpGate4Run.create({
    data: { trigger, totalScore: 0, passCount: 0, failCount: 0, durationMs: 0 },
  })

  log(`Run ${gate4Run.id} — ${SCENARIOS.length} scenarios`)

  const resultSummaries: Gate4Summary['results'] = []

  for (const s of SCENARIOS) {
    log(`  → ${s.name}`)
    let result: ScenarioResult

    try {
      result = await s.fn()
    } catch (err: any) {
      result = {
        scenario:  s.name.toLowerCase().replace(/ /g, '_'),
        passed:    false,
        score:     0,
        durationMs: 0,
        assertions: [{ name: 'Runner did not crash', passed: false, detail: err.message }],
      }
    }

    log(`     ${result.passed ? '✅' : '❌'} score=${result.score} (${result.durationMs}ms)`)
    result.assertions.filter(a => !a.passed).forEach(a => log(`     ⚠  ${a.name}: ${a.detail}`))

    await (prisma as any).kimmpGate4Result.create({
      data: {
        runId:         gate4Run.id,
        scenario:      result.scenario,
        score:         result.score,
        passed:        result.passed,
        durationMs:    result.durationMs,
        assertions:    result.assertions,
        workflowRunId: result.workflowRunId ?? null,
      },
    })

    resultSummaries.push({
      scenario:          result.scenario,
      score:             result.score,
      passed:            result.passed,
      assertionCount:    result.assertions.length,
      failedAssertions:  result.assertions.filter(a => !a.passed).map(a => a.name),
    })
  }

  const passCount  = resultSummaries.filter(r => r.passed).length
  const failCount  = resultSummaries.filter(r => !r.passed).length
  const totalScore = resultSummaries.reduce((s, r) => s + r.score, 0) / resultSummaries.length
  const durationMs = Date.now() - runStart

  await (prisma as any).kimmpGate4Run.update({
    where: { id: gate4Run.id },
    data:  { totalScore, passCount, failCount, durationMs, completedAt: new Date() },
  })

  const gate = totalScore >= 75 && failCount <= 1 ? 'PASS' : 'FAIL'

  return { runId: gate4Run.id, totalScore, passCount, failCount, durationMs, gate, results: resultSummaries }
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (require.main === module) {
  const args    = process.argv.slice(2)
  const trigger = (args.includes('--trigger') ? args[args.indexOf('--trigger') + 1] : 'manual') as Gate4Options['trigger']

  runGate4({ trigger, verbose: true })
    .then(summary => {
      console.log('\n═══════════════════════════════════════════════════')
      console.log(`  GATE 4 — AUTONOMOUS OPERATIONS: ${summary.gate}`)
      console.log(`  Score:    ${summary.totalScore.toFixed(1)}/100`)
      console.log(`  Pass:     ${summary.passCount}/${SCENARIOS.length}`)
      console.log(`  Fail:     ${summary.failCount}`)
      console.log(`  Duration: ${(summary.durationMs / 1000).toFixed(1)}s`)
      console.log('═══════════════════════════════════════════════════')
      summary.results.forEach(r => {
        const icon = r.passed ? '✅' : '❌'
        console.log(`  ${icon} ${r.scenario.padEnd(20)} score=${r.score.toFixed(0).padStart(3)}`)
        r.failedAssertions.forEach(a => console.log(`      ⚠  ${a}`))
      })
      process.exit(summary.gate === 'PASS' ? 0 : 1)
    })
    .catch(err => {
      console.error('Gate4 runner crashed:', err)
      process.exit(1)
    })
}
