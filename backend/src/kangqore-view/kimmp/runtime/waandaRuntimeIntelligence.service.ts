// ---------------------------------------------------------------------------
// WAANDA Runtime Intelligence
//
// Observes every call made through waandaRuntime.call() and writes telemetry
// to waanda_runtime_calls. Nightly (or on-demand), computes per-capability
// profiles (best model, avg latency, cost, quality, failover rate) and writes
// them to waanda_capability_profiles.
//
// The Gate 3.5 runner reads these tables to answer:
//   · Did the runtime pick the optimal model?
//   · Could the answer have been cheaper?
//   · Did failover degrade quality?
//   · Is confidence stable across providers?
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'
import type { RouterResult } from '../llm/kimmpLLMRouter'
import type { Capability } from './waandaRuntime'

// ─── Cost table (USD per 1k tokens — approximate, update as pricing changes) ─

const COST_PER_1K: Record<string, { input: number; output: number }> = {
  'claude-opus-4-8':           { input: 0.015, output: 0.075 },
  'claude-sonnet-4-6':         { input: 0.003, output: 0.015 },
  'claude-haiku-4-5-20251001': { input: 0.00025, output: 0.00125 },
  'gpt-4o':                    { input: 0.005, output: 0.015 },
  'gpt-4o-mini':               { input: 0.00015, output: 0.0006 },
  'gemini-1.5-flash':          { input: 0.000075, output: 0.0003 },
}

function estimateCost(model: string, inputTokens?: number, outputTokens?: number): number | undefined {
  if (!inputTokens && !outputTokens) return undefined
  const rate = COST_PER_1K[model]
  if (!rate) return undefined
  return ((inputTokens ?? 0) / 1000) * rate.input + ((outputTokens ?? 0) / 1000) * rate.output
}

// ─── Confidence extraction ────────────────────────────────────────────────────
// Looks for {"confidence": 0.87} or "confidence: 0.87" in response text.

function extractConfidence(text: string): number | undefined {
  const m = text.match(/"confidence"\s*:\s*(0\.\d+|1\.0|1|0)/i)
    ?? text.match(/confidence[:\s]+(\d+)%/i)
  if (!m) return undefined
  const v = parseFloat(m[1])
  // percentage form → 0-1
  return v > 1 ? v / 100 : v
}

// ─── Record a single call ─────────────────────────────────────────────────────

export async function recordRuntimeCall(opts: {
  capability:   Capability
  result:       RouterResult
  latencyMs:    number
  callerHint?:  string
  qualityScore?: number  // provided by benchmark scorer, null for live calls
}): Promise<void> {
  const { capability, result, latencyMs, callerHint, qualityScore } = opts
  const provider = result._routerMeta?.usedProvider ?? 'unknown'
  const model    = result._routerMeta?.usedModel    ?? 'unknown'
  const text     = typeof result === 'string' ? result : (result as any).content?.[0]?.text ?? ''

  // Detect failover: if the primary provider was skipped
  const wasFailover = provider !== 'claude'

  try {
    await (prisma as any).waandaRuntimeCall.create({
      data: {
        capability,
        provider,
        model,
        wasFailover,
        latencyMs,
        inputTokens:   result._routerMeta?.inputTokens   ?? undefined,
        outputTokens:  result._routerMeta?.outputTokens  ?? undefined,
        estimatedCost: estimateCost(model, result._routerMeta?.inputTokens, result._routerMeta?.outputTokens),
        confidence:    extractConfidence(text),
        qualityScore:  qualityScore ?? null,
        success:       true,
        callerHint:    callerHint ?? null,
      },
    })
  } catch {
    // non-blocking — telemetry must never break the call path
  }
}

export async function recordFailedCall(opts: {
  capability:  Capability
  latencyMs:   number
  errorCode:   string
  callerHint?: string
}): Promise<void> {
  try {
    await (prisma as any).waandaRuntimeCall.create({
      data: {
        capability:  opts.capability,
        provider:    'unknown',
        model:       'unknown',
        wasFailover: false,
        latencyMs:   opts.latencyMs,
        success:     false,
        errorCode:   opts.errorCode,
        callerHint:  opts.callerHint ?? null,
      },
    })
  } catch {
    // non-blocking
  }
}

// ─── Compute capability profiles ─────────────────────────────────────────────
// Run nightly (or on demand by Gate 3.5). Reads the last `windowDays` of calls
// and upserts one row per capability.

export async function computeCapabilityProfiles(windowDays = 30): Promise<void> {
  const since = new Date(Date.now() - windowDays * 86_400_000)

  const calls: Array<{
    capability: string
    provider: string
    model: string
    latencyMs: number
    estimatedCost: number | null
    qualityScore: number | null
    wasFailover: boolean
    success: boolean
  }> = await (prisma as any).waandaRuntimeCall.findMany({
    where:  { createdAt: { gte: since }, success: true },
    select: { capability: true, provider: true, model: true, latencyMs: true, estimatedCost: true, qualityScore: true, wasFailover: true, success: true },
  })

  // Group by capability
  const byCapability: Record<string, typeof calls> = {}
  for (const c of calls) {
    if (!byCapability[c.capability]) byCapability[c.capability] = []
    byCapability[c.capability].push(c)
  }

  for (const [cap, rows] of Object.entries(byCapability)) {
    if (rows.length === 0) continue

    const latencies   = rows.map(r => r.latencyMs).sort((a, b) => a - b)
    const avgLatency  = latencies.reduce((s, v) => s + v, 0) / latencies.length
    const p95Latency  = latencies[Math.floor(latencies.length * 0.95)] ?? latencies[latencies.length - 1]

    const costs = rows.map(r => r.estimatedCost ?? 0)
    const avgCost = costs.reduce((s, v) => s + v, 0) / costs.length

    const qualityRows = rows.filter(r => r.qualityScore !== null)
    const qualityScore = qualityRows.length > 0
      ? qualityRows.reduce((s, r) => s + (r.qualityScore!), 0) / qualityRows.length
      : 0

    const failoverCount = rows.filter(r => r.wasFailover).length
    const failoverRate  = failoverCount / rows.length

    // Best provider = highest quality score in this window
    const providerQuality: Record<string, number[]> = {}
    for (const r of qualityRows) {
      if (!providerQuality[r.provider]) providerQuality[r.provider] = []
      providerQuality[r.provider].push(r.qualityScore!)
    }
    let bestProvider = rows[0].provider
    let bestModel    = rows[0].model
    let bestQuality  = -1
    for (const [prov, scores] of Object.entries(providerQuality)) {
      const avg = scores.reduce((s, v) => s + v, 0) / scores.length
      if (avg > bestQuality) {
        bestQuality  = avg
        bestProvider = prov
        const modelRow = rows.find(r => r.provider === prov)
        if (modelRow) bestModel = modelRow.model
      }
    }

    await (prisma as any).waandaCapabilityProfile.upsert({
      where:  { capability: cap },
      create: { capability: cap, bestProvider, bestModel, avgLatencyMs: avgLatency, p95LatencyMs: p95Latency, avgCostUsd: avgCost, qualityScore, failoverRate, callCount: rows.length, windowDays },
      update: { bestProvider, bestModel, avgLatencyMs: avgLatency, p95LatencyMs: p95Latency, avgCostUsd: avgCost, qualityScore, failoverRate, callCount: rows.length, windowDays, computedAt: new Date() },
    })
  }
}

// ─── Query helpers for Gate 3.5 ───────────────────────────────────────────────

export async function getCapabilityProfiles(): Promise<any[]> {
  return (prisma as any).waandaCapabilityProfile.findMany({
    orderBy: { capability: 'asc' },
  })
}

export async function getRuntimeCallStats(windowDays = 30): Promise<{
  totalCalls: number
  failoverCalls: number
  failoverRate: number
  avgLatencyMs: number
  avgCostUsd: number
  byCapability: Record<string, { calls: number; failoverRate: number; avgLatencyMs: number; avgCostUsd: number }>
}> {
  const since = new Date(Date.now() - windowDays * 86_400_000)
  const calls: any[] = await (prisma as any).waandaRuntimeCall.findMany({
    where:  { createdAt: { gte: since }, success: true },
    select: { capability: true, latencyMs: true, estimatedCost: true, wasFailover: true },
  })

  if (calls.length === 0) {
    return { totalCalls: 0, failoverCalls: 0, failoverRate: 0, avgLatencyMs: 0, avgCostUsd: 0, byCapability: {} }
  }

  const failoverCalls  = calls.filter(c => c.wasFailover).length
  const avgLatencyMs   = calls.reduce((s, c) => s + c.latencyMs, 0) / calls.length
  const avgCostUsd     = calls.reduce((s, c) => s + (c.estimatedCost ?? 0), 0) / calls.length

  const byCap: Record<string, any[]> = {}
  for (const c of calls) {
    if (!byCap[c.capability]) byCap[c.capability] = []
    byCap[c.capability].push(c)
  }

  const byCapability: Record<string, any> = {}
  for (const [cap, rows] of Object.entries(byCap)) {
    byCapability[cap] = {
      calls:        rows.length,
      failoverRate: rows.filter(r => r.wasFailover).length / rows.length,
      avgLatencyMs: rows.reduce((s, r) => s + r.latencyMs, 0) / rows.length,
      avgCostUsd:   rows.reduce((s, r) => s + (r.estimatedCost ?? 0), 0) / rows.length,
    }
  }

  return { totalCalls: calls.length, failoverCalls, failoverRate: failoverCalls / calls.length, avgLatencyMs, avgCostUsd, byCapability }
}
