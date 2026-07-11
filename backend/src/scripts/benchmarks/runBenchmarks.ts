#!/usr/bin/env ts-node
// ---------------------------------------------------------------------------
// Gate 3 — AI Reliability Benchmark Runner
//
// Usage (standalone):
//   npx ts-node src/scripts/benchmarks/runBenchmarks.ts \
//     --url http://localhost:5050 --token <jwt> [--trigger manual]
//
// Or import and call from CI/nightly:
//   import { runBenchmarks } from './runBenchmarks'
//   const summary = await runBenchmarks({ url, token, trigger: 'nightly' })
// ---------------------------------------------------------------------------

import { prisma }           from '../../lib/prisma'
import { GOLDEN_PROMPTS }   from './goldenPrompts'
import { scoreResponse, computeDrift } from './scorer'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BenchmarkOptions {
  url:            string
  token:          string
  trigger:        'nightly' | 'manual' | 'pre-release'
  verbose?:       boolean
  modelOverride?: string    // e.g. 'claude-opus-4-8' | 'waanda-gen2-v0.1'
  provider?:      string    // 'anthropic' | 'waanda-native' | 'openai'
  compareWith?:   string    // run a second pass with this model and diff
}

export interface CategoryScore {
  category:  string
  avgScore:  number
  passCount: number
  failCount: number
}

export interface BenchmarkCompareResult {
  modelA:          string
  modelB:          string
  runIdA:          string
  runIdB:          string
  scoreA:          number
  scoreB:          number
  delta:           number
  winner:          'A' | 'B' | 'TIE'
  categoryResults: Array<{ category: string; scoreA: number; scoreB: number; winner: 'A' | 'B' | 'TIE' }>
  regressions:     Array<{ promptId: string; scoreA: number; scoreB: number; drop: number }>
}

export interface BenchmarkSummary {
  runId:       string
  totalScore:  number
  passCount:   number
  failCount:   number
  driftAlert:  boolean
  driftDelta:  number
  durationMs:  number
  gate:        'PASS' | 'FAIL'
  results:     Array<{
    promptId:  string
    category:  string
    score:     number
    passed:    boolean
    issues:    string[]
  }>
}

// ─── API caller ───────────────────────────────────────────────────────────────

async function callCommand(
  url: string,
  token: string,
  prompt: string,
  opts?: { modelOverride?: string; provider?: string },
): Promise<{ body: any; durationMs: number }> {
  const start = Date.now()
  try {
    const res = await fetch(`${url}/api/admin/kangqore-immp/command`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body:    JSON.stringify({
        query:         prompt,
        userId:        'benchmark-runner',
        modelOverride: opts?.modelOverride ?? undefined,
        provider:      opts?.provider      ?? undefined,
      }),
      signal:  AbortSignal.timeout(30_000),
    })
    const body = await res.json().catch(() => ({})) as any
    return { body, durationMs: Date.now() - start }
  } catch (err) {
    return {
      body: { error: (err as Error).message, response: '', confidence: 0 },
      durationMs: Date.now() - start,
    }
  }
}

// ─── Runner ───────────────────────────────────────────────────────────────────

export async function runBenchmarks(opts: BenchmarkOptions): Promise<BenchmarkSummary> {
  const { url, token, trigger, verbose = false, modelOverride, provider } = opts
  const runStart = Date.now()

  const log = (...args: any[]) => { if (verbose) console.log('[Benchmark]', ...args) }

  // Create run record
  const run = await (prisma as any).kimmpBenchmarkRun.create({
    data: {
      trigger,
      totalScore:  0,
      passCount:   0,
      failCount:   0,
      driftAlert:  false,
      driftDelta:  0,
      durationMs:  0,
    },
  })

  log(`Run ${run.id} started — ${GOLDEN_PROMPTS.length} prompts`)

  // Fetch last run's scores for drift comparison
  const lastRun = await (prisma as any).kimmpBenchmarkRun.findFirst({
    where: { id: { not: run.id } },
    orderBy: { startedAt: 'desc' },
    include: { results: { select: { score: true } } },
  }).catch(() => null)

  const previousScores: number[] = lastRun?.results?.map((r: any) => r.score) ?? []

  // Run each prompt sequentially to avoid hammering the backend
  const scored: Array<ReturnType<typeof scoreResponse> & { promptId: string; category: string }> = []

  for (const gp of GOLDEN_PROMPTS) {
    log(`  → [${gp.id}] ${gp.description}`)
    const { body, durationMs } = await callCommand(url, token, gp.prompt, { modelOverride, provider })
    const result = scoreResponse(gp, body, durationMs)

    log(`     score=${result.score} passed=${result.passed} model=${result.actualModel ?? '?'}`)
    if (result.issues.length) log(`     issues: ${result.issues.join('; ')}`)

    // Persist result
    await (prisma as any).kimmpBenchmarkResult.create({
      data: {
        runId:          run.id,
        promptId:       gp.id,
        category:       gp.category,
        score:          result.score,
        passed:         result.passed,
        actualModel:    result.actualModel ?? null,
        actualProvider: result.actualProvider ?? null,
        confidence:     result.confidence ?? null,
        evidenceCount:  result.evidenceCount,
        optionCount:    result.optionCount,
        responseMs:     durationMs,
        issues:         result.issues,
      },
    })

    scored.push({ ...result, promptId: gp.id, category: gp.category })
  }

  // Compute totals
  const passCount  = scored.filter(r => r.passed).length
  const failCount  = scored.filter(r => !r.passed).length

  // Weighted score: heavier prompts count more
  const totalWeight  = GOLDEN_PROMPTS.reduce((s, p) => s + p.weight, 0)
  const weightedSum  = GOLDEN_PROMPTS.reduce((s, p) => {
    const r = scored.find(x => x.promptId === p.id)
    return s + (r?.score ?? 0) * p.weight
  }, 0)
  const totalScore = totalWeight > 0 ? weightedSum / totalWeight : 0

  // Drift
  const drift = computeDrift(scored, previousScores)
  log(`Drift: ${drift.message}`)

  const durationMs = Date.now() - runStart

  // Finalise run record
  await (prisma as any).kimmpBenchmarkRun.update({
    where: { id: run.id },
    data: {
      totalScore,
      passCount,
      failCount,
      driftAlert:  drift.alert,
      driftDelta:  drift.delta,
      durationMs,
      completedAt: new Date(),
    },
  })

  const gate = totalScore >= 75 && failCount <= 2 ? 'PASS' : 'FAIL'

  const summary: BenchmarkSummary = {
    runId:      run.id,
    totalScore,
    passCount,
    failCount,
    driftAlert: drift.alert,
    driftDelta: drift.delta,
    durationMs,
    gate,
    results: scored.map(r => ({
      promptId: r.promptId,
      category: r.category,
      score:    r.score,
      passed:   r.passed,
      issues:   r.issues,
    })),
  }

  return summary
}

// ─── Model comparison mode — Gen 2 evaluation harness ────────────────────────

export async function runBenchmarkComparison(
  opts: Omit<BenchmarkOptions, 'modelOverride' | 'compareWith'>,
  modelA: string,
  modelB: string,
): Promise<BenchmarkCompareResult> {
  const [summaryA, summaryB] = await Promise.all([
    runBenchmarks({ ...opts, modelOverride: modelA }),
    runBenchmarks({ ...opts, modelOverride: modelB }),
  ])

  const delta  = summaryB.totalScore - summaryA.totalScore
  const winner = delta > 1 ? 'B' : delta < -1 ? 'A' : 'TIE'

  // Per-category comparison
  const categories = [...new Set(GOLDEN_PROMPTS.map(p => p.category))]
  const categoryResults = categories.map(cat => {
    const catPromptsA = summaryA.results.filter(r => r.category === cat)
    const catPromptsB = summaryB.results.filter(r => r.category === cat)
    const avgA = catPromptsA.reduce((s, r) => s + r.score, 0) / (catPromptsA.length || 1)
    const avgB = catPromptsB.reduce((s, r) => s + r.score, 0) / (catPromptsB.length || 1)
    const diff = avgB - avgA
    return {
      category: cat,
      scoreA: Math.round(avgA),
      scoreB: Math.round(avgB),
      winner: (diff > 1 ? 'B' : diff < -1 ? 'A' : 'TIE') as 'A' | 'B' | 'TIE',
    }
  })

  // Regressions: prompts where B drops > 10pts vs A
  const regressions = summaryA.results
    .map(rA => {
      const rB = summaryB.results.find(r => r.promptId === rA.promptId)
      if (!rB) return null
      const drop = rA.score - rB.score
      return drop >= 10 ? { promptId: rA.promptId, scoreA: rA.score, scoreB: rB.score, drop } : null
    })
    .filter(Boolean) as BenchmarkCompareResult['regressions']

  const result: BenchmarkCompareResult = {
    modelA, modelB,
    runIdA:  summaryA.runId,
    runIdB:  summaryB.runId,
    scoreA:  Math.round(summaryA.totalScore),
    scoreB:  Math.round(summaryB.totalScore),
    delta:   Math.round(delta),
    winner,
    categoryResults,
    regressions,
  }

  // Persist so model-vs-model history is queryable over time
  await (prisma as any).benchmarkCompareRun.create({
    data: {
      modelA,
      modelB,
      runIdA:          summaryA.runId,
      runIdB:          summaryB.runId,
      scoreA:          result.scoreA,
      scoreB:          result.scoreB,
      delta:           result.delta,
      winner,
      categoryResults: categoryResults as any,
      regressions:     regressions    as any,
      trigger:         opts.trigger,
    },
  }).catch(() => {})   // non-blocking — comparison result already returned

  return result
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2)
  const get  = (flag: string) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined }

  const url     = get('--url')     || process.env.BENCHMARK_URL   || 'http://localhost:5050'
  const token   = get('--token')   || process.env.BENCHMARK_TOKEN || ''
  const trigger = (get('--trigger') || 'manual') as BenchmarkOptions['trigger']

  if (!token) {
    console.error('ERROR: --token <jwt> is required\n  Usage: npx ts-node runBenchmarks.ts --url <url> --token <jwt>')
    process.exit(1)
  }

  runBenchmarks({ url, token, trigger, verbose: true })
    .then(summary => {
      console.log('\n═══════════════════════════════════════════════════')
      console.log(`  GATE 3 — AI RELIABILITY: ${summary.gate}`)
      console.log(`  Score:    ${summary.totalScore.toFixed(1)}/100`)
      console.log(`  Pass:     ${summary.passCount}/${GOLDEN_PROMPTS.length}`)
      console.log(`  Fail:     ${summary.failCount}`)
      console.log(`  Drift:    ${summary.driftDelta >= 0 ? '+' : ''}${summary.driftDelta.toFixed(1)} pts`)
      if (summary.driftAlert) console.log('  ⚠️  DRIFT ALERT — confidence regressed > 10 pts')
      console.log('═══════════════════════════════════════════════════')
      summary.results.forEach(r => {
        const icon = r.passed ? '✅' : '❌'
        console.log(`  ${icon} [${r.promptId}] ${r.category.padEnd(14)} score=${r.score.toFixed(0).padStart(3)}`)
        r.issues.forEach(i => console.log(`      ⚠  ${i}`))
      })
      process.exit(summary.gate === 'PASS' ? 0 : 1)
    })
    .catch(err => {
      console.error('Benchmark runner crashed:', err)
      process.exit(1)
    })
}
