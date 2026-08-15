// ---------------------------------------------------------------------------
// Public Trust Service — P1 "Publish the Proof" (Overshadow Roadmap).
//
// Backs /api/public/trust/*. Every method here returns aggregate, non-tenant,
// non-PII data ONLY — counts, percentages, category labels. Never proxy raw
// rows from AegisAuditLog, LlmCallLog, or KimmpBenchmarkResult.issues to the
// public internet. The admin-gated equivalents (kangqore-immp `/aip-parity`,
// aegis `/audit`, kimmp-gateway `/pii-incidents`) remain the source of truth
// for anything with row-level detail.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'
import { AegisLedger } from '../../esf/aegis/aegisLedger.service'

// ── Live Capability Scorecard (same computation the admin AIP Parity page
// uses — this data was already safe to expose: counts and percentages, no
// tenant identifiers, no raw call content) ──────────────────────────────────

export interface CapabilityRow {
  key:    string
  label:  string
  metric: string
  value:  number
  live:   boolean
}

export async function computeCapabilityScorecard(): Promise<{
  capabilities: CapabilityRow[]
  overall: { liveCount: number; totalCount: number; allLive: boolean }
  computedAt: string
}> {
  const since30d = new Date(Date.now() - 30 * 86_400_000)

  const [
    callCount, actorTypes, piiConfig, piiIncidentCount, budgetCount,
    promptNames, callsWithPromptName, toolCallableCount, toolInvocationCount,
    pgvectorHealth, latestBenchmark, agentCount, agentRunCount,
  ] = await Promise.all([
    prisma.llmCallLog.count(),
    prisma.llmCallLog.findMany({ distinct: ['actorType'], select: { actorType: true } }),
    (prisma as any).piiScanConfig.findFirst({ where: { active: true } }),
    prisma.llmCallLog.count({ where: { piiDetected: true } }),
    (prisma as any).tokenBudget.count(),
    (prisma as any).aIPrompt.findMany({ distinct: ['name'], select: { name: true } }),
    prisma.llmCallLog.findMany({ where: { promptName: { not: null }, createdAt: { gte: since30d } }, distinct: ['promptName'], select: { promptName: true } }),
    (prisma as any).ontologyAction.count({ where: { toolCallable: true } }),
    prisma.llmCallLog.count({ where: { toolExecutionIds: { isEmpty: false } } }),
    (await import('../knowledge/PgvectorIndex')).PgvectorIndex.health().catch(() => []),
    (prisma as any).kimmpBenchmarkRun.findFirst({ orderBy: { startedAt: 'desc' }, select: { totalScore: true, passCount: true, driftAlert: true } }),
    (prisma as any).kimmpAgent.count({ where: { status: 'ACTIVE' } }),
    (prisma as any).kimmpAgentLog.count(),
  ])

  const totalPromptRows = promptNames.length
  const adoptedPromptRows = callsWithPromptName.length
  const promptAdoptionPct = totalPromptRows > 0 ? Math.round((adoptedPromptRows / totalPromptRows) * 100) : 0

  const pgvectorRows = pgvectorHealth as Array<{ totalRows: number; indexedRows: number }>
  const totalEmbedRows = pgvectorRows.reduce((s, h) => s + h.totalRows, 0)
  const indexedEmbedRows = pgvectorRows.reduce((s, h) => s + h.indexedRows, 0)
  const pgvectorCoveragePct = totalEmbedRows > 0 ? Math.round((indexedEmbedRows / totalEmbedRows) * 100) : 0

  const capabilities: CapabilityRow[] = [
    { key: 'llm_gateway',      label: 'LLM Gateway',       metric: `${callCount.toLocaleString()} calls logged`, value: callCount, live: callCount > 0 },
    { key: 'call_audit',       label: 'Call Audit Trail',  metric: `${actorTypes.length} actor types tracked (${actorTypes.map((a: any) => a.actorType).join(', ') || 'none'})`, value: actorTypes.length, live: callCount > 0 },
    { key: 'pii_detection',    label: 'PII Detection',     metric: piiConfig ? `Active profile · ${piiIncidentCount} incidents flagged` : 'No active scan profile', value: piiIncidentCount, live: !!piiConfig },
    { key: 'cost_enforcement', label: 'Cost Enforcement',  metric: `${budgetCount} budget${budgetCount === 1 ? '' : 's'} configured`, value: budgetCount, live: budgetCount > 0 },
    { key: 'gateway_dashboard', label: 'Gateway Dashboard', metric: '8 tabs live', value: callCount, live: callCount > 0 },
    { key: 'prompt_registry',  label: 'Prompt Registry',   metric: `${promptAdoptionPct}% adoption (${adoptedPromptRows}/${totalPromptRows} registered prompts used in 30d)`, value: promptAdoptionPct, live: adoptedPromptRows > 0 },
    { key: 'function_calling', label: 'Function Calling',  metric: `${toolCallableCount} tool-callable action${toolCallableCount === 1 ? '' : 's'} · ${toolInvocationCount} calls invoked a tool`, value: toolInvocationCount, live: toolCallableCount > 0 },
    { key: 'embedding_index',  label: 'Embedding Index',   metric: `${pgvectorCoveragePct}% indexed (${indexedEmbedRows}/${totalEmbedRows} rows)`, value: pgvectorCoveragePct, live: totalEmbedRows > 0 && indexedEmbedRows > 0 },
    { key: 'eval_pipeline',    label: 'Eval Pipeline',     metric: latestBenchmark ? `Gate 3 score ${latestBenchmark.totalScore.toFixed(0)}/100 · ${latestBenchmark.passCount} passed${latestBenchmark.driftAlert ? ' · drift alert' : ''}` : 'No runs yet', value: latestBenchmark?.totalScore ?? 0, live: !!latestBenchmark },
    { key: 'agent_studio',     label: 'Agent Studio',      metric: `${agentCount} active agent${agentCount === 1 ? '' : 's'} · ${agentRunCount} run${agentRunCount === 1 ? '' : 's'} logged`, value: agentCount, live: agentCount > 0 && agentRunCount > 0 },
  ]

  const liveCount = capabilities.filter(c => c.live).length
  return {
    capabilities,
    overall: { liveCount, totalCount: capabilities.length, allLive: liveCount === capabilities.length },
    computedAt: new Date().toISOString(),
  }
}

// ── Governance Summary (AEGIS audit trail + PII policy + budget model,
// aggregate-only) ────────────────────────────────────────────────────────────

const PII_CATEGORY_LABELS: Record<string, string> = {
  email:      'Email addresses',
  phone:      'Phone numbers',
  ni_number:  'Government ID numbers (UK National Insurance)',
  ssn:        'Government ID numbers (US SSN)',
  nhs_number: 'National health service numbers',
  iban:       'Banking identifiers (IBAN)',
  passport:   'Passport numbers (opt-in — high false-positive pattern)',
}

export async function computeGovernanceSummary() {
  const [stats, piiConfig, piiIncidentCount, budgetCount] = await Promise.all([
    AegisLedger.stats(),
    (prisma as any).piiScanConfig.findFirst({ where: { active: true } }),
    prisma.llmCallLog.count({ where: { piiDetected: true } }),
    (prisma as any).tokenBudget.count(),
  ])

  const enabledPatterns: string[] = piiConfig?.enabledPatterns ?? ['email', 'phone', 'ni_number', 'ssn', 'nhs_number', 'iban']

  return {
    auditTrail: {
      totalActivations: stats.totalActivations,
      totalAutonomous:  stats.totalAutonomous,
      totalDenied:      stats.totalDenied,
      totalAssets:      stats.totalAssets,
      systemsTracked:   Object.keys(stats.systemBreakdown).length,
      description: 'Every AI-initiated action — activation, autonomous run, access denial, knowledge-asset write — is written to an immutable ledger before it executes, not sampled or reconstructed after the fact.',
    },
    piiPolicy: {
      active: !!piiConfig,
      mode: piiConfig?.mode ?? 'AUDIT',
      categoriesDetected: enabledPatterns.map(p => PII_CATEGORY_LABELS[p] ?? p),
      incidentsFlagged: piiIncidentCount,
      description: 'Every prompt and response passes a PII scan before logging. Mode AUDIT flags and records; REDACT replaces matches before storage; BLOCK refuses the call outright when a call opts in to hard enforcement.',
    },
    budgetEnforcement: {
      activeBudgets: budgetCount,
      description: 'Token spend is evaluated against a per-user monthly budget before a call is allowed to proceed. A hard-stop budget blocks the call outright and fires a budget.exceeded webhook event to any registered subscriber — enforcement happens pre-call, not as a post-hoc bill.',
    },
    computedAt: new Date().toISOString(),
  }
}

// ── Eval & Drift Pipeline (Gate 3 golden-prompt benchmark, aggregate-only —
// never expose prompt text or per-call issues[] strings publicly) ───────────

export async function computeEvalHealth() {
  const [latestRun, recentRuns] = await Promise.all([
    (prisma as any).kimmpBenchmarkRun.findFirst({
      orderBy: { startedAt: 'desc' },
      include: { results: { select: { category: true, score: true, passed: true } } },
    }),
    (prisma as any).kimmpBenchmarkRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
      select: { id: true, totalScore: true, passCount: true, failCount: true, driftAlert: true, driftDelta: true, startedAt: true },
    }),
  ])

  let categoryBreakdown: Array<{ category: string; avgScore: number; passCount: number; failCount: number }> = []
  if (latestRun) {
    const byCategory = new Map<string, { scores: number[]; pass: number; fail: number }>()
    for (const r of latestRun.results as Array<{ category: string; score: number; passed: boolean }>) {
      const bucket = byCategory.get(r.category) ?? { scores: [], pass: 0, fail: 0 }
      bucket.scores.push(r.score)
      r.passed ? bucket.pass++ : bucket.fail++
      byCategory.set(r.category, bucket)
    }
    categoryBreakdown = Array.from(byCategory.entries()).map(([category, b]) => ({
      category,
      avgScore: Math.round(b.scores.reduce((s, v) => s + v, 0) / b.scores.length),
      passCount: b.pass,
      failCount: b.fail,
    }))
  }

  return {
    latest: latestRun ? {
      runId:       latestRun.id,
      totalScore:  latestRun.totalScore,
      passCount:   latestRun.passCount,
      failCount:   latestRun.failCount,
      driftAlert:  latestRun.driftAlert,
      driftDelta:  latestRun.driftDelta,
      gate:        latestRun.totalScore >= 75 && latestRun.failCount <= 2 ? 'PASS' : 'FAIL',
      startedAt:   latestRun.startedAt,
      completedAt: latestRun.completedAt,
    } : null,
    trend: recentRuns.map((r: any) => ({
      runId: r.id, totalScore: r.totalScore, driftAlert: r.driftAlert, driftDelta: r.driftDelta, startedAt: r.startedAt,
    })).reverse(),
    categoryBreakdown,
    goldenPromptSet: {
      totalPrompts: 12,
      categories: ['decision', 'factual', 'navigation', 'explainability', 'confidence', 'tool-use'],
      description: 'A fixed set of 12 golden prompts runs against production routing on every benchmark trigger. Each response is scored 0–100 against structural expectations (decision presence, evidence count, confidence bounds, correct tool invocation). A run that drifts more than the alert threshold from the prior run fires an eval.drift_alert event automatically — regressions are caught before a customer notices, not after.',
    },
    computedAt: new Date().toISOString(),
  }
}
