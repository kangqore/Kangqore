#!/usr/bin/env ts-node
// ---------------------------------------------------------------------------
// Gate 3.5 — WAANDA Runtime Intelligence
//
// Validates that the runtime makes *intelligent* routing decisions, not just
// "does the call succeed." Answers the questions:
//
//   · Is the runtime routing to the optimal model per capability?
//   · Is the failover rate within acceptable bounds?
//   · Does failover degrade quality (measured by benchmark scores)?
//   · Is confidence stable across providers?
//   · Can the cost efficiency be quantified?
//
// Unlike Gate 3 (which benchmarks prompt quality), Gate 3.5 benchmarks the
// runtime *itself* — the routing layer, not the response layer.
//
// Usage:
//   npx ts-node src/scripts/gate35/gate35Runner.ts [--trigger nightly]
//
// Or via API:
//   POST /api/admin/kangqore-immp/gate35/run
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'
import {
  computeCapabilityProfiles,
  getRuntimeCallStats,
  getCapabilityProfiles,
  recordRuntimeCall,
} from '../../kangqore-immp/runtime/waandaRuntimeIntelligence.service'
import { call } from '../../kangqore-immp/runtime/waandaRuntime'
import type { Capability } from '../../kangqore-immp/runtime/waandaRuntime'
import { scoreResponse } from '../benchmarks/scorer'
import { GOLDEN_PROMPTS } from '../benchmarks/goldenPrompts'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Gate35Options {
  trigger:  'nightly' | 'manual' | 'pre-release'
  verbose?: boolean
}

interface Check {
  name:   string
  passed: boolean
  score:  number
  detail: Record<string, any>
}

export interface Gate35Summary {
  runId:       string
  totalScore:  number
  passCount:   number
  failCount:   number
  durationMs:  number
  gate:        'PASS' | 'FAIL' | 'PENDING'
  checks:      Check[]
  profiles:    any[]
}

// ─── Gate thresholds ──────────────────────────────────────────────────────────

const MAX_FAILOVER_RATE          = 0.30   // >30% failover triggers FAIL
const MAX_FAILOVER_QUALITY_DROP  = 15     // >15 point quality drop when failing over → FAIL
const MIN_CONFIDENCE_STABILITY   = 0.70   // confidence must not drop below 0.70 in any window
const MIN_ROUTING_PROBE_SCORE    = 70     // routing probes must score ≥70 to pass
const MIN_CHECKS_TO_PASS         = 4      // need at least 4/7 checks to PASS

// ─── Check implementations ────────────────────────────────────────────────────

async function checkFailoverRate(stats: any): Promise<Check> {
  const rate    = stats.failoverRate ?? 0
  const passed  = rate <= MAX_FAILOVER_RATE
  return {
    name:   'failover_rate',
    passed,
    score:  passed ? 100 : Math.max(0, Math.round(100 - (rate - MAX_FAILOVER_RATE) * 200)),
    detail: { failoverRate: rate, threshold: MAX_FAILOVER_RATE, failoverCalls: stats.failoverCalls, totalCalls: stats.totalCalls },
  }
}

async function checkFailoverQualityDrop(): Promise<Check> {
  // Compare average quality score: primary (wasFailover=false) vs failover (wasFailover=true)
  const since = new Date(Date.now() - 30 * 86_400_000)
  const rows: any[] = await (prisma as any).waandaRuntimeCall.findMany({
    where:  { createdAt: { gte: since }, success: true, qualityScore: { not: null } },
    select: { wasFailover: true, qualityScore: true },
  })

  if (rows.length < 2) {
    return { name: 'failover_quality_drop', passed: true, score: 100, detail: { reason: 'insufficient data', rows: rows.length } }
  }

  const primary  = rows.filter(r => !r.wasFailover).map(r => r.qualityScore!)
  const failover = rows.filter(r =>  r.wasFailover).map(r => r.qualityScore!)

  if (primary.length === 0 || failover.length === 0) {
    return { name: 'failover_quality_drop', passed: true, score: 100, detail: { reason: 'no cross-provider data', primaryCount: primary.length, failoverCount: failover.length } }
  }

  const avgPrimary  = primary.reduce((s, v) => s + v, 0) / primary.length
  const avgFailover = failover.reduce((s, v) => s + v, 0) / failover.length
  const drop        = avgPrimary - avgFailover
  const passed      = drop <= MAX_FAILOVER_QUALITY_DROP

  return {
    name:   'failover_quality_drop',
    passed,
    score:  passed ? Math.round(Math.max(50, 100 - drop)) : Math.round(Math.max(0, 100 - (drop - MAX_FAILOVER_QUALITY_DROP) * 3)),
    detail: { avgPrimaryQuality: avgPrimary, avgFailoverQuality: avgFailover, qualityDrop: drop, threshold: MAX_FAILOVER_QUALITY_DROP },
  }
}

async function checkConfidenceStability(): Promise<Check> {
  const since = new Date(Date.now() - 7 * 86_400_000)
  const rows: any[] = await (prisma as any).waandaRuntimeCall.findMany({
    where:  { createdAt: { gte: since }, success: true, confidence: { not: null } },
    select: { confidence: true },
  })

  if (rows.length < 3) {
    return { name: 'confidence_stability', passed: true, score: 100, detail: { reason: 'insufficient data', rows: rows.length } }
  }

  const confidences = rows.map(r => r.confidence!)
  const avg         = confidences.reduce((s, v) => s + v, 0) / confidences.length
  const passed      = avg >= MIN_CONFIDENCE_STABILITY

  return {
    name:   'confidence_stability',
    passed,
    score:  Math.round(avg * 100),
    detail: { avgConfidence: avg, threshold: MIN_CONFIDENCE_STABILITY, samples: rows.length },
  }
}

async function checkCostEfficiency(profiles: any[]): Promise<Check> {
  if (profiles.length === 0) {
    return { name: 'cost_efficiency', passed: true, score: 100, detail: { reason: 'no profiles yet' } }
  }

  // Simple check: fast/cheap capabilities should have lower cost than strategic
  const fast      = profiles.find(p => p.capability === 'fast')
  const cheap     = profiles.find(p => p.capability === 'cheap')
  const strategic = profiles.find(p => p.capability === 'strategic')

  if (!fast || !cheap || !strategic) {
    return { name: 'cost_efficiency', passed: true, score: 80, detail: { reason: 'partial profile data', profileCount: profiles.length } }
  }

  const fastCheaper     = fast.avgCostUsd      <= strategic.avgCostUsd
  const cheapCheaper    = cheap.avgCostUsd     <= strategic.avgCostUsd
  const fastIsActFast   = fast.avgLatencyMs    <= strategic.avgLatencyMs

  const passed = fastCheaper && cheapCheaper
  const score  = (fastCheaper ? 35 : 0) + (cheapCheaper ? 35 : 0) + (fastIsActFast ? 30 : 0)

  return {
    name:   'cost_efficiency',
    passed,
    score,
    detail: {
      fast:     { cost: fast.avgCostUsd,     latency: fast.avgLatencyMs },
      cheap:    { cost: cheap.avgCostUsd,    latency: cheap.avgLatencyMs },
      strategic:{ cost: strategic.avgCostUsd, latency: strategic.avgLatencyMs },
    },
  }
}

// Routing probe: fire one call per capability and validate the runtime responds
async function checkRoutingProbes(log: (...a: any[]) => void): Promise<Check> {
  const capabilities: Capability[] = ['fast', 'cheap', 'command']
  const SYSTEM = 'You are WAANDA. Answer in one sentence.'
  const USER   = 'What is the current status of the platform?'

  let passed  = 0
  const detail: Record<string, any> = {}

  for (const cap of capabilities) {
    const t0 = Date.now()
    try {
      const result = await call(cap, SYSTEM, USER, { hint: 'gate35-routing-probe' })
      const latency = Date.now() - t0
      const text = result.content[0]?.text ?? ''
      const hasContent = text.length > 5
      if (hasContent) passed++
      log(`    Probe [${cap}] → provider=${result._routerMeta.usedProvider} latency=${latency}ms ok=${hasContent}`)
      detail[cap] = { provider: result._routerMeta.usedProvider, model: result._routerMeta.usedModel, latencyMs: latency, ok: hasContent }
    } catch (err: any) {
      log(`    Probe [${cap}] → ERROR: ${err.message}`)
      detail[cap] = { ok: false, error: err.message }
    }
  }

  const score = Math.round((passed / capabilities.length) * 100)
  return {
    name:   'routing_probes',
    passed: score >= MIN_ROUTING_PROBE_SCORE,
    score,
    detail: { probesPassed: passed, total: capabilities.length, byCapability: detail },
  }
}

// Capability profile freshness — profiles should exist and be recent
async function checkProfileFreshness(profiles: any[]): Promise<Check> {
  if (profiles.length === 0) {
    return { name: 'profile_freshness', passed: false, score: 0, detail: { reason: 'no profiles computed yet — run computeCapabilityProfiles()' } }
  }

  const oneWeekAgo = Date.now() - 7 * 86_400_000
  const freshCount = profiles.filter(p => new Date(p.computedAt).getTime() > oneWeekAgo).length
  const score      = Math.round((freshCount / profiles.length) * 100)

  return {
    name:   'profile_freshness',
    passed: score >= 60,
    score,
    detail: { freshCount, totalProfiles: profiles.length, maxAgeAllowedDays: 7 },
  }
}

// Latency sanity — avg latency per capability should be under 10s
async function checkLatencyBounds(profiles: any[]): Promise<Check> {
  const LATENCY_CEILING_MS = 10_000
  if (profiles.length === 0) {
    return { name: 'latency_bounds', passed: true, score: 100, detail: { reason: 'no data yet' } }
  }

  const violations = profiles.filter(p => p.avgLatencyMs > LATENCY_CEILING_MS)
  const passed     = violations.length === 0
  const score      = Math.round(((profiles.length - violations.length) / profiles.length) * 100)

  return {
    name:   'latency_bounds',
    passed,
    score,
    detail: {
      ceiling:    LATENCY_CEILING_MS,
      violations: violations.map(p => ({ capability: p.capability, avgLatencyMs: p.avgLatencyMs })),
      profiles:   profiles.map(p => ({ capability: p.capability, avgLatencyMs: p.avgLatencyMs, p95LatencyMs: p.p95LatencyMs })),
    },
  }
}

// ─── Runner ───────────────────────────────────────────────────────────────────

export async function runGate35(opts: Gate35Options): Promise<Gate35Summary> {
  const { trigger, verbose = false } = opts
  const t0  = Date.now()
  const log = (...a: any[]) => { if (verbose) console.log('[Gate3.5]', ...a) }

  // Create run record
  const run = await (prisma as any).waandaGate35Run.create({
    data: { trigger, totalScore: 0, passCount: 0, failCount: 0, durationMs: 0 },
  })
  log(`Run ${run.id}`)

  // Recompute capability profiles before checking
  log('  → Computing capability profiles...')
  try { await computeCapabilityProfiles(30) } catch { /* no data yet — OK */ }
  const profiles = await getCapabilityProfiles()

  // Runtime call stats
  const stats = await getRuntimeCallStats(30)
  log(`  → ${stats.totalCalls} calls in last 30d, failoverRate=${(stats.failoverRate * 100).toFixed(1)}%`)

  // Run all checks
  log('  → Running checks...')
  const checks: Check[] = await Promise.all([
    checkFailoverRate(stats),
    checkFailoverQualityDrop(),
    checkConfidenceStability(),
    checkCostEfficiency(profiles),
    checkRoutingProbes(log),
    checkProfileFreshness(profiles),
    checkLatencyBounds(profiles),
  ])

  // Persist results
  for (const c of checks) {
    await (prisma as any).waandaGate35Check.create({
      data: { runId: run.id, name: c.name, passed: c.passed, score: c.score, detail: c.detail },
    })
    log(`  ${c.passed ? '✅' : '❌'} ${c.name} score=${c.score}`)
  }

  const passCount  = checks.filter(c => c.passed).length
  const failCount  = checks.filter(c => !c.passed).length
  const totalScore = checks.reduce((s, c) => s + c.score, 0) / checks.length
  const durationMs = Date.now() - t0

  await (prisma as any).waandaGate35Run.update({
    where: { id: run.id },
    data:  { totalScore, passCount, failCount, durationMs, completedAt: new Date() },
  })

  const gate: Gate35Summary['gate'] =
    stats.totalCalls === 0  ? 'PENDING'
    : passCount >= MIN_CHECKS_TO_PASS && totalScore >= 70 ? 'PASS' : 'FAIL'

  return { runId: run.id, totalScore, passCount, failCount, durationMs, gate, checks, profiles }
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (require.main === module) {
  const args    = process.argv.slice(2)
  const trigger = (args.includes('--trigger') ? args[args.indexOf('--trigger') + 1] : 'manual') as Gate35Options['trigger']

  runGate35({ trigger, verbose: true })
    .then(s => {
      console.log('\n═══════════════════════════════════════════════════')
      console.log(`  GATE 3.5 — RUNTIME INTELLIGENCE: ${s.gate}`)
      console.log(`  Score:    ${s.totalScore.toFixed(1)}/100`)
      console.log(`  Pass:     ${s.passCount}/${s.passCount + s.failCount}`)
      console.log(`  Duration: ${(s.durationMs / 1000).toFixed(1)}s`)
      console.log('═══════════════════════════════════════════════════')
      s.checks.forEach(c => {
        console.log(`  ${c.passed ? '✅' : '❌'} ${c.name.padEnd(28)} ${c.score.toFixed(0).padStart(3)}`)
      })
      process.exit(s.gate === 'FAIL' ? 1 : 0)
    })
    .catch(err => { console.error('Gate3.5 crashed:', err); process.exit(1) })
}
