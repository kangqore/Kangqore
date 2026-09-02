import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const SEVEN_DAYS_MS  = 7  * 24 * 60 * 60 * 1000

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n))
}

// ─── Pillar 1 — Decision Intelligence ────────────────────────────────────────

async function computeDecisionScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  const since = new Date(Date.now() - THIRTY_DAYS_MS)

  const decisions = await (prisma as any).kimmpStrategicDecision.findMany({
    where: { createdAt: { gte: since } },
    select: {
      confidence: true,
      selectedBy: true,
      resolvedAt: true,
      outcome:    true,
      evidence:   true,
      createdAt:  true,
    },
  }).catch(() => [] as any[])

  const total    = decisions.length
  if (total === 0) return { score: 75, metrics: { total: 0, note: 'No decisions in last 30 days — neutral baseline' } }

  const resolved = decisions.filter((d: any) => d.resolvedAt != null)
  const withOutcome = resolved.filter((d: any) => d.outcome && d.outcome.trim().length > 0)

  const avgConfidence = decisions.reduce((s: number, d: any) => s + (d.confidence ?? 0.75), 0) / total

  const autoAdopted  = decisions.filter((d: any) => d.selectedBy === 'AUTO').length
  const humanOverride= decisions.filter((d: any) => d.selectedBy && d.selectedBy !== 'AUTO').length
  const adoptionRate = total > 0 ? autoAdopted / total : 0
  const overrideRate = total > 0 ? humanOverride / total : 0

  const outcomeRate = resolved.length > 0 ? withOutcome.length / resolved.length : 0

  const avgEvidenceItems = decisions.reduce((s: number, d: any) => {
    const ev = Array.isArray(d.evidence) ? d.evidence.length : 0
    return s + ev
  }, 0) / total
  const evidenceScore = clamp(avgEvidenceItems / 5 * 100) // 5 items = 100 points

  const avgCycleHours = resolved.length > 0
    ? resolved.reduce((s: number, d: any) => {
        const ms = new Date(d.resolvedAt).getTime() - new Date(d.createdAt).getTime()
        return s + ms / 3_600_000
      }, 0) / resolved.length
    : null

  const cyclePenalty = avgCycleHours == null ? 0
    : avgCycleHours > 48 ? 10
    : avgCycleHours > 24 ? 5
    : 0

  const score = clamp(
    avgConfidence * 100 * 0.35 +
    adoptionRate  * 100 * 0.15 +
    outcomeRate   * 100 * 0.25 +
    evidenceScore * 0.25 -
    cyclePenalty
  )

  return {
    score,
    metrics: {
      total,
      resolved: resolved.length,
      withOutcome: withOutcome.length,
      avgConfidencePct: Math.round(avgConfidence * 100),
      adoptionRatePct:  Math.round(adoptionRate  * 100),
      overrideRatePct:  Math.round(overrideRate  * 100),
      outcomeRatePct:   Math.round(outcomeRate   * 100),
      avgEvidenceItems: Math.round(avgEvidenceItems * 10) / 10,
      avgCycleHours: avgCycleHours != null ? Math.round(avgCycleHours * 10) / 10 : null,
    },
  }
}

// ─── Pillar 2 — Workflow Intelligence ─────────────────────────────────────────

async function computeWorkflowScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  const since = new Date(Date.now() - THIRTY_DAYS_MS)

  const [osRuns, kimmpRuns] = await Promise.all([
    prisma.osWorkflowRun.findMany({
      where:  { startedAt: { gte: since } },
      select: { status: true, duration: true, stepsCompleted: true, stepsTotal: true },
    }).catch(() => []),
    (prisma as any).kimmpWorkflowRun.findMany({
      where:  { startedAt: { gte: since } },
      select: { status: true, retryCount: true, startedAt: true, completedAt: true },
    }).catch(() => [] as any[]),
  ])

  const osTotal      = osRuns.length
  const osCompleted  = osRuns.filter((r: any) => r.status === 'completed').length
  const osFailed     = osRuns.filter((r: any) => r.status === 'failed').length
  const osCompletionRate = osTotal > 0 ? osCompleted / osTotal : null

  const kimmpTotal     = kimmpRuns.length
  const kimmpCompleted = kimmpRuns.filter((r: any) => r.status === 'COMPLETED').length
  const kimmpFailed    = kimmpRuns.filter((r: any) => r.status === 'FAILED').length
  const kimmpRetryRuns = kimmpRuns.filter((r: any) => r.retryCount > 0).length
  const kimmpRetryRate = kimmpTotal > 0 ? kimmpRetryRuns / kimmpTotal : 0
  const kimmpCompletionRate = kimmpTotal > 0 ? kimmpCompleted / kimmpTotal : null

  const allTotal     = osTotal + kimmpTotal
  const allCompleted = osCompleted + kimmpCompleted
  const allFailed    = osFailed + kimmpFailed
  const overallCompletion = allTotal > 0 ? allCompleted / allTotal : null

  const osAvgDuration = osRuns.filter((r: any) => r.duration != null).length > 0
    ? osRuns.reduce((s: number, r: any) => s + (r.duration ?? 0), 0) /
      osRuns.filter((r: any) => r.duration != null).length
    : null

  const stepCompletionRate = osRuns.filter((r: any) => r.stepsTotal > 0).length > 0
    ? osRuns
        .filter((r: any) => r.stepsTotal > 0)
        .reduce((s: number, r: any) => s + r.stepsCompleted / r.stepsTotal, 0) /
      osRuns.filter((r: any) => r.stepsTotal > 0).length
    : null

  if (allTotal === 0) return { score: 80, metrics: { allTotal: 0, note: 'No workflow runs — neutral baseline' } }

  const score = clamp(
    (overallCompletion ?? 0.8) * 70 +
    (1 - kimmpRetryRate)       * 15 +
    (stepCompletionRate ?? 0.9) * 15
  )

  return {
    score,
    metrics: {
      osTotal, osCompleted, osFailed,
      kimmpTotal, kimmpCompleted, kimmpFailed,
      allTotal, allCompleted, allFailed,
      overallCompletionPct: overallCompletion != null ? Math.round(overallCompletion * 100) : null,
      kimmpRetryRatePct:    Math.round(kimmpRetryRate * 100),
      stepCompletionPct:    stepCompletionRate != null ? Math.round(stepCompletionRate * 100) : null,
      osAvgDurationSec:     osAvgDuration != null ? Math.round(osAvgDuration) : null,
    },
  }
}

// ─── Pillar 3 — AI Intelligence ───────────────────────────────────────────────

async function computeAiScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  const since = new Date(Date.now() - THIRTY_DAYS_MS)

  const [costEntries, evaluations, latestCert] = await Promise.all([
    (prisma as any).aICostEntry.findMany({
      where:  { createdAt: { gte: since } },
      select: { success: true, latencyMs: true, costUsd: true, modelName: true },
    }).catch(() => [] as any[]),
    (prisma as any).aIEvaluation.findMany({
      where:  { createdAt: { gte: since } },
      select: { overall: true, safe: true, useful: true, grounded: true },
    }).catch(() => [] as any[]),
    (prisma as any).qEFCertificate.findFirst({
      where:   { certificateStatus: 'ACTIVE' },
      orderBy: { issuedAt: 'desc' },
      select:  { certScore: true, gateSnapshot: true },
    }).catch(() => null),
  ])

  const totalCalls  = costEntries.length
  const successRate = totalCalls > 0
    ? costEntries.filter((e: any) => e.success).length / totalCalls
    : null
  const avgLatencyMs = totalCalls > 0
    ? costEntries.reduce((s: number, e: any) => s + (e.latencyMs ?? 0), 0) / totalCalls
    : null
  const totalCostUsd = costEntries.reduce((s: number, e: any) => s + (e.costUsd ?? 0), 0)
  const costPerCall  = totalCalls > 0 ? totalCostUsd / totalCalls : null

  const avgEvalScore = evaluations.length > 0
    ? evaluations.reduce((s: number, e: any) => s + (e.overall ?? 0), 0) / evaluations.length
    : null
  const avgSafeScore = evaluations.length > 0
    ? evaluations.reduce((s: number, e: any) => s + (e.safe ?? 0), 0) / evaluations.length
    : null

  const latencyScore = avgLatencyMs == null ? 75
    : avgLatencyMs < 2_000  ? 100
    : avgLatencyMs < 5_000  ? 82
    : avgLatencyMs < 10_000 ? 65
    : 45

  const qefGate3 = latestCert?.gateSnapshot
    ? (() => {
        const gs = latestCert.gateSnapshot as Record<string, unknown>
        const g3 = gs.gate3 as Record<string, unknown> | undefined
        return typeof g3?.score === 'number' ? g3.score : null
      })()
    : null

  const successPts = successRate != null ? successRate * 100 : 85
  const evalPts    = avgEvalScore != null ? (avgEvalScore / 5) * 100 : 75
  const certPts    = qefGate3 ?? latestCert?.certScore ?? 75

  const score = clamp(
    successPts   * 0.35 +
    evalPts      * 0.30 +
    latencyScore * 0.20 +
    certPts      * 0.15
  )

  return {
    score,
    metrics: {
      totalCalls,
      successRatePct:  successRate != null ? Math.round(successRate * 100) : null,
      avgLatencyMs:    avgLatencyMs != null ? Math.round(avgLatencyMs) : null,
      totalCostUsd:    Math.round(totalCostUsd * 100) / 100,
      costPerCallUsd:  costPerCall != null ? Math.round(costPerCall * 10000) / 10000 : null,
      evaluations:     evaluations.length,
      avgEvalScore:    avgEvalScore != null ? Math.round(avgEvalScore * 100) / 100 : null,
      avgSafeScore:    avgSafeScore != null ? Math.round(avgSafeScore * 100) / 100 : null,
      qefCertScore:    latestCert?.certScore ?? null,
      qefGate3Score:   qefGate3,
    },
  }
}

// ─── Pillar 4 — Enterprise Health ─────────────────────────────────────────────

async function computeEnterpriseScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  const [incidents, risks, portfolioHealth] = await Promise.all([
    prisma.incident.findMany({
      where:  { status: { in: ['NEW', 'TRIAGING', 'IN_PROGRESS', 'ON_HOLD'] } },
      select: { priority: true, slaBreached: true },
    }).catch(() => []),
    prisma.risk.findMany({
      where:  { status: 'OPEN' },
      select: { severity: true, trend: true },
    }).catch(() => []),
    // Wave 1: blend portfolio project health into Enterprise pillar
    (prisma as any).projectOperationalState.aggregate({ _avg: { health: true } })
      .then((r: any) => Math.round(r._avg?.health ?? 0))
      .catch(() => 0),
  ])

  const p1Active = incidents.filter((i: any) => i.priority === 'P1-CRITICAL').length
  const p2Active = incidents.filter((i: any) => i.priority === 'P2-HIGH').length
  const p3Active = incidents.filter((i: any) => i.priority === 'P3-MEDIUM').length
  const slaBreached = incidents.filter((i: any) => i.slaBreached).length

  const criticalRisks  = risks.filter((r: any) => r.severity === 'CRITICAL').length
  const highRisks      = risks.filter((r: any) => r.severity === 'HIGH').length
  const deteriorating  = risks.filter((r: any) => r.trend === 'INCREASING').length

  const incidentRiskScore = clamp(
    100
    - p1Active    * 20
    - p2Active    * 10
    - p3Active    * 3
    - slaBreached * 5
    - criticalRisks * 4
    - highRisks     * 2
    - deteriorating * 2
  )

  // Blend: 70% incident/risk health + 30% portfolio project health
  const score = portfolioHealth > 0
    ? Math.round(incidentRiskScore * 0.70 + portfolioHealth * 0.30)
    : incidentRiskScore

  return {
    score,
    metrics: {
      activeIncidents: incidents.length,
      p1Active, p2Active, p3Active,
      slaBreached,
      openRisks:   risks.length,
      criticalRisks, highRisks,
      deterioratingRisks: deteriorating,
      portfolioProjectHealth: portfolioHealth,
    },
  }
}

// ─── Pillar 5 — Goal Intelligence ─────────────────────────────────────────────

async function computeGoalScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  // ── KimmpGoal sub-score (operational goals) ──────────────────────────────
  const goals = await prisma.kimmpGoal.findMany({
    select: { status: true, progressPct: true, deadline: true, objective: true },
  }).catch(() => [] as { status: string; progressPct: number | null; deadline: Date | null; objective: string }[])

  let kimmpScore = 75 // neutral if no goals
  let kimmpMetrics: Record<string, unknown> = { total: 0, note: 'No KimmpGoals defined' }

  if (goals.length > 0) {
    const active    = goals.filter(g => g.status === 'ACTIVE' || g.status === 'IN_PROGRESS')
    const completed = goals.filter(g => g.status === 'COMPLETED')
    const pending   = goals.filter(g => g.status === 'PENDING_APPROVAL')
    const avgProgress = active.length > 0
      ? active.reduce((s, g) => s + (g.progressPct ?? 0), 0) / active.length
      : 0
    const completionRate = completed.length / (active.length + completed.length || 1)
    const now = Date.now()
    const atRisk = active.filter(g => {
      if (!g.deadline) return false
      const daysLeft = (new Date(g.deadline).getTime() - now) / 86_400_000
      return daysLeft < 14 && (g.progressPct ?? 0) < 60
    }).length

    kimmpScore = clamp(
      avgProgress    * 0.55 +
      completionRate * 100 * 0.30 +
      (1 - (atRisk / Math.max(active.length, 1))) * 15
    )
    kimmpMetrics = {
      total: goals.length, active: active.length, completed: completed.length,
      pending: pending.length, atRisk,
      avgProgressPct:    Math.round(avgProgress),
      completionRatePct: Math.round(completionRate * 100),
    }
  }

  // ── EnterpriseGoal sub-score (declared business targets) ─────────────────
  // Derive current progress from live data per pillar type.
  const enterpriseGoals = await prisma.enterpriseGoal.findMany({
    where:   { definition: { isActive: true } },
    select:  { pillar: true, label: true, target: true, unit: true, weight: true },
  }).catch(() => [] as { pillar: string; label: string; target: number; unit: string; weight: number }[])

  let enterpriseScore = 75 // neutral if no definition set
  let enterpriseGoalMetrics: Array<Record<string, unknown>> = []

  if (enterpriseGoals.length > 0) {
    // Resolve current values from the database for each declared pillar
    const [totalInvoiceRevenue, milestoneStats, leads] = await Promise.all([
      // REVENUE — sum of paid invoices
      prisma.invoice.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }).catch(() => ({ _sum: { amount: null } })),
      // DELIVERY_SLA — milestone on-time rate
      prisma.clientMilestone.findMany({ select: { status: true, dueDate: true }, take: 200 }).catch(() => [] as { status: string; dueDate: Date | null }[]),
      // PIPELINE — lead win rate (proxy for growth goal)
      prisma.eqoreLead.findMany({ select: { status: true }, take: 500 }).catch(() => [] as { status: string }[]),
    ])

    const revenueInCr      = Number(totalInvoiceRevenue._sum.amount ?? 0) / 10_000_000
    const completedOnTime  = milestoneStats.filter(m => m.status === 'COMPLETED' && m.dueDate && new Date(m.dueDate) >= new Date()).length
    const totalClosed      = milestoneStats.filter(m => m.status === 'COMPLETED' || m.status === 'OVERDUE').length
    const deliverySla      = totalClosed > 0 ? Math.round((completedOnTime / totalClosed) * 100) : null
    const wonLeads         = leads.filter(l => l.status === 'WON').length
    const lostLeads        = leads.filter(l => l.status === 'LOST').length
    const winRate          = (wonLeads + lostLeads) > 0 ? Math.round((wonLeads / (wonLeads + lostLeads)) * 100) : null

    const attainments: number[] = []
    for (const g of enterpriseGoals) {
      let current: number | null = null
      switch (g.pillar) {
        case 'REVENUE':      current = revenueInCr;    break
        case 'DELIVERY_SLA': current = deliverySla;    break
        case 'NPS':          current = null;            break // requires external survey data
        case 'MARGIN':       current = null;            break // requires project budget data
        case 'UTILIZATION':  current = winRate;         break // best available proxy
        default:             current = null
      }
      const attainment = current !== null ? Math.min((current / g.target) * 100, 120) : 75 // 75 = neutral when unmeasurable
      attainments.push(attainment * (g.weight ?? 1.0))
      enterpriseGoalMetrics.push({ pillar: g.pillar, label: g.label, target: g.target, unit: g.unit, current: current !== null ? Math.round(current * 10) / 10 : null, attainmentPct: Math.round(attainment) })
    }

    const totalWeight = enterpriseGoals.reduce((s, g) => s + (g.weight ?? 1.0), 0)
    enterpriseScore = clamp(attainments.reduce((a, b) => a + b, 0) / (totalWeight || 1))
  }

  // ── Blend: 70% operational KimmpGoals + 30% declared EnterpriseGoals ─────
  const blended = enterpriseGoals.length > 0
    ? clamp(kimmpScore * 0.70 + enterpriseScore * 0.30)
    : kimmpScore

  return {
    score: blended,
    metrics: {
      ...kimmpMetrics,
      enterpriseGoals:      enterpriseGoalMetrics,
      enterpriseGoalScore:  Math.round(enterpriseScore),
      kimmpGoalScore:       Math.round(kimmpScore),
    },
  }
}

// ─── Pillar 6 — Learning Intelligence (velocity) ─────────────────────────────

async function computeLearningScore(): Promise<{ score: number; metrics: Record<string, unknown>; velocityModifier: number }> {
  const now7ago  = new Date(Date.now() - SEVEN_DAYS_MS)
  const now14ago = new Date(Date.now() - SEVEN_DAYS_MS * 2)

  const [recent, prior, allMemories] = await Promise.all([
    (prisma as any).kimmpMemory.findMany({
      where:  { createdAt: { gte: now7ago } },
      select: { type: true },
    }).catch(() => [] as any[]),
    (prisma as any).kimmpMemory.findMany({
      where:  { createdAt: { gte: now14ago, lt: now7ago } },
      select: { type: true },
    }).catch(() => [] as any[]),
    (prisma as any).kimmpMemory.findMany({
      select: { type: true },
    }).catch(() => [] as any[]),
  ])

  const recentCount  = recent.length
  const priorCount   = prior.length
  const totalMemories = allMemories.length

  const patterns = allMemories.filter((m: any) => m.type === 'PATTERN').length
  const lessons  = allMemories.filter((m: any) => m.type === 'LESSON').length
  const outcomes = allMemories.filter((m: any) => m.type === 'OUTCOME').length

  const growthRate = priorCount > 0
    ? (recentCount - priorCount) / priorCount
    : recentCount > 0 ? 1 : 0

  const velocityModifier = clamp(growthRate, -0.5, 0.5) * 0.10

  const score = clamp(
    30 +
    Math.min(patterns * 8, 25) +
    Math.min(lessons  * 8, 25) +
    Math.min(outcomes * 5, 15) +
    (growthRate > 0 ? 5 : 0)
  )

  return {
    score,
    metrics: {
      totalMemories,
      recentLast7Days: recentCount,
      priorWeek:       priorCount,
      growthRatePct:   Math.round(growthRate * 100),
      patterns, lessons, outcomes,
    },
    velocityModifier,
  }
}

// ─── Pillar 7 — Business Value ─────────────────────────────────────────────────

async function computeBusinessScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  const [osCompleted, kimmpCompleted, approvalStats] = await Promise.all([
    prisma.osWorkflowRun.count({ where: { status: 'completed' } }).catch(() => 0),
    (prisma as any).kimmpWorkflowRun.count({ where: { status: 'COMPLETED' } }).catch(() => 0),
    (prisma as any).kimmpApprovalRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
    }).catch(() => [] as any[]),
  ])

  const totalWorkflowsCompleted = osCompleted + kimmpCompleted

  const approvedAuto = approvalStats
    .filter((s: any) => s.status === 'EXECUTED')
    .reduce((sum: number, s: any) => sum + s._count._all, 0)
  const totalApprovals = approvalStats
    .reduce((sum: number, s: any) => sum + s._count._all, 0)

  const hoursSaved = totalWorkflowsCompleted * 0.5
  const inrSavedCr = (hoursSaved * 1000) / 1_00_00_000
  const automationCoverage = totalApprovals > 0 ? approvedAuto / totalApprovals : 0

  const score = clamp(
    Math.min(totalWorkflowsCompleted * 2, 50) +
    automationCoverage * 30 +
    Math.min(hoursSaved / 100, 20)
  )

  return {
    score,
    metrics: {
      totalWorkflowsCompleted,
      estimatedHoursSaved:    Math.round(hoursSaved),
      estimatedInrSavedCr:    Math.round(inrSavedCr * 100) / 100,
      totalApprovals,
      automatedApprovals:     approvedAuto,
      automationCoveragePct:  Math.round(automationCoverage * 100),
      manualTasksEliminated:  approvedAuto,
    },
  }
}

// ─── Pillar 9 — Adoption Intelligence ────────────────────────────────────────

async function computeAdoptionScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  const since = new Date(Date.now() - THIRTY_DAYS_MS)

  const [approvalStats, adoptionEvents, overrideCount, workflowRuns] = await Promise.all([
    (prisma as any).kimmpApprovalRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
      where: { createdAt: { gte: since } },
    }).catch(() => [] as any[]),
    (prisma as any).adoptionEvent.findMany({
      where:  { occurredAt: { gte: since } },
      select: { eventType: true, userId: true },
    }).catch(() => [] as any[]),
    (prisma as any).deploymentDecision.count({
      where: { emergencyOverride: true, evaluatedAt: { gte: since } },
    }).catch(() => 0),
    prisma.osWorkflowRun.count({ where: { startedAt: { gte: since } } }).catch(() => 0),
  ])

  const totalApprovals   = approvalStats.reduce((s: number, g: any) => s + g._count._all, 0)
  const executedApprovals = approvalStats
    .filter((g: any) => g.status === 'EXECUTED')
    .reduce((s: number, g: any) => s + g._count._all, 0)
  const decisionAcceptanceRate = totalApprovals > 0 ? executedApprovals / totalApprovals : 0.5

  const recActed   = adoptionEvents.filter((e: any) => e.eventType === 'REC_ACTED').length
  const recIgnored = adoptionEvents.filter((e: any) => e.eventType === 'REC_IGNORED').length
  const totalRecs  = recActed + recIgnored
  const recActedRate = totalRecs > 0 ? recActed / totalRecs : 0.5

  const uniqueUsers = new Set(
    adoptionEvents.filter((e: any) => e.userId).map((e: any) => e.userId)
  ).size
  const dauScore          = Math.min(uniqueUsers * 10, 30)
  const workflowActivity  = Math.min(workflowRuns * 2, 20)
  const overridePenalty   = Math.min(overrideCount * 10, 30)

  const score = clamp(
    dauScore +
    decisionAcceptanceRate * 30 +
    workflowActivity +
    recActedRate * 20 -
    overridePenalty
  )

  return {
    score,
    metrics: {
      uniqueActiveUsers:          uniqueUsers,
      totalApprovals,
      executedApprovals,
      decisionAcceptanceRatePct:  Math.round(decisionAcceptanceRate * 100),
      emergencyOverrides:         overrideCount,
      workflowRunsLast30Days:     workflowRuns,
      recommendationsActed:       recActed,
      recommendationsIgnored:     recIgnored,
      recActedRatePct:            Math.round(recActedRate * 100),
    },
  }
}

// ─── Pillar 8 — Trust Intelligence ────────────────────────────────────────────

async function computeTrustScore(): Promise<{ score: number; metrics: Record<string, unknown> }> {
  const since = new Date(Date.now() - THIRTY_DAYS_MS)

  const [aegisCount, overrideCount, evalStats] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { createdAt: { gte: since } } }).catch(() => 0),
    (prisma as any).deploymentDecision.count({ where: { emergencyOverride: true, evaluatedAt: { gte: since } } }).catch(() => 0),
    (prisma as any).aIEvaluation.findMany({
      where:  { createdAt: { gte: since } },
      select: { safe: true, grounded: true },
    }).catch(() => [] as any[]),
  ])

  const auditBonus = aegisCount > 200 ? 15 : aegisCount > 100 ? 10 : aegisCount > 50 ? 5 : 0
  const overridePenalty = overrideCount * 5

  const avgSafe     = evalStats.length > 0
    ? evalStats.reduce((s: number, e: any) => s + (e.safe     ?? 4), 0) / evalStats.length
    : null
  const avgGrounded = evalStats.length > 0
    ? evalStats.reduce((s: number, e: any) => s + (e.grounded ?? 4), 0) / evalStats.length
    : null

  const safetyPts   = avgSafe     != null ? (avgSafe     / 5) * 100 : 80
  const groundedPts = avgGrounded != null ? (avgGrounded / 5) * 100 : 80

  const score = clamp(
    70 +
    auditBonus -
    overridePenalty +
    safetyPts   * 0.15 +
    groundedPts * 0.15 -
    70 * 0.30
  )

  return {
    score,
    metrics: {
      aegisEventsLast30Days: aegisCount,
      emergencyOverrides:    overrideCount,
      evaluations:           evalStats.length,
      avgSafeScore:    avgSafe     != null ? Math.round(avgSafe     * 100) / 100 : null,
      avgGroundedScore:avgGrounded != null ? Math.round(avgGrounded * 100) / 100 : null,
      auditCoverage:   aegisCount > 200 ? 'EXCELLENT' : aegisCount > 100 ? 'GOOD' : aegisCount > 50 ? 'FAIR' : 'LOW',
    },
  }
}

// ─── OIS Assembly ─────────────────────────────────────────────────────────────

export interface Gate8Result {
  oisScore:        number
  decisionScore:   number
  workflowScore:   number
  aiScore:         number
  enterpriseScore: number
  goalScore:       number
  learningScore:   number
  businessScore:   number
  trustScore:      number
  adoptionScore:   number
  pillars: {
    decision:   { score: number; metrics: Record<string, unknown> }
    workflow:   { score: number; metrics: Record<string, unknown> }
    ai:         { score: number; metrics: Record<string, unknown> }
    enterprise: { score: number; metrics: Record<string, unknown> }
    goal:       { score: number; metrics: Record<string, unknown> }
    learning:   { score: number; metrics: Record<string, unknown>; velocityModifier: number }
    business:   { score: number; metrics: Record<string, unknown> }
    trust:      { score: number; metrics: Record<string, unknown> }
    adoption:   { score: number; metrics: Record<string, unknown> }
  }
}

export async function computeGate8(): Promise<Gate8Result> {
  const [decision, workflow, ai, enterprise, goal, learning, business, trust, adoption] = await Promise.all([
    computeDecisionScore(),
    computeWorkflowScore(),
    computeAiScore(),
    computeEnterpriseScore(),
    computeGoalScore(),
    computeLearningScore(),
    computeBusinessScore(),
    computeTrustScore(),
    computeAdoptionScore(),
  ])

  // Updated weights (sum = 1.00). Adoption earns weight as data accumulates.
  const rawOIS =
    decision.score   * 0.20 +
    enterprise.score * 0.18 +
    workflow.score   * 0.15 +
    goal.score       * 0.14 +
    ai.score         * 0.10 +
    business.score   * 0.10 +
    trust.score      * 0.08 +
    adoption.score   * 0.05

  // Learning velocity modifier: ±5% on OIS based on memory growth trajectory
  const oisScore = clamp(rawOIS * (1 + learning.velocityModifier))

  return {
    oisScore:        Math.round(oisScore         * 10) / 10,
    decisionScore:   Math.round(decision.score   * 10) / 10,
    workflowScore:   Math.round(workflow.score   * 10) / 10,
    aiScore:         Math.round(ai.score         * 10) / 10,
    enterpriseScore: Math.round(enterprise.score * 10) / 10,
    goalScore:       Math.round(goal.score       * 10) / 10,
    learningScore:   Math.round(learning.score   * 10) / 10,
    businessScore:   Math.round(business.score   * 10) / 10,
    trustScore:      Math.round(trust.score      * 10) / 10,
    adoptionScore:   Math.round(adoption.score   * 10) / 10,
    pillars: {
      decision:   { score: decision.score,   metrics: decision.metrics },
      workflow:   { score: workflow.score,   metrics: workflow.metrics },
      ai:         { score: ai.score,         metrics: ai.metrics },
      enterprise: { score: enterprise.score, metrics: enterprise.metrics },
      goal:       { score: goal.score,       metrics: goal.metrics },
      learning:   { ...learning },
      business:   { score: business.score,   metrics: business.metrics },
      trust:      { score: trust.score,      metrics: trust.metrics },
      adoption:   { score: adoption.score,   metrics: adoption.metrics },
    },
  }
}

export async function createGate8Snapshot(
  triggeredBy: 'MANUAL' | 'POST_DEPLOY' | 'AUTO' = 'MANUAL',
  deployId?: string,
  label: 'AUTO' | 'BASELINE' | 'CHECKPOINT' = 'AUTO'
): Promise<unknown> {
  const result = await computeGate8()
  return (prisma as any).gate8Snapshot.create({
    data: {
      oisScore:        result.oisScore,
      decisionScore:   result.decisionScore,
      workflowScore:   result.workflowScore,
      aiScore:         result.aiScore,
      enterpriseScore: result.enterpriseScore,
      goalScore:       result.goalScore,
      learningScore:   result.learningScore,
      businessScore:   result.businessScore,
      trustScore:      result.trustScore,
      adoptionScore:   result.adoptionScore,
      pillars:         result.pillars as object,
      triggeredBy,
      label,
      deployId: deployId ?? null,
    },
  })
}

export async function getGate8History(limit = 30): Promise<unknown[]> {
  return (prisma as any).gate8Snapshot.findMany({
    orderBy: { createdAt: 'desc' },
    take:    limit,
    select: {
      id: true, oisScore: true, decisionScore: true, workflowScore: true,
      aiScore: true, enterpriseScore: true, goalScore: true,
      learningScore: true, businessScore: true, trustScore: true, adoptionScore: true,
      triggeredBy: true, label: true, deployId: true, createdAt: true,
    },
  }).catch(() => [])
}

// ─── Gate 8.1 — Enterprise Forecast™ ─────────────────────────────────────────

interface RegressionResult { slope: number; intercept: number; r2: number }

function linearRegression(points: { x: number; y: number }[]): RegressionResult {
  const n = points.length
  if (n < 2) return { slope: 0, intercept: points[0]?.y ?? 0, r2: 0 }

  const xBar = points.reduce((s, p) => s + p.x, 0) / n
  const yBar = points.reduce((s, p) => s + p.y, 0) / n

  let ssXY = 0, ssXX = 0, ssYY = 0
  for (const p of points) {
    ssXY += (p.x - xBar) * (p.y - yBar)
    ssXX += (p.x - xBar) ** 2
    ssYY += (p.y - yBar) ** 2
  }

  const slope     = ssXX > 0 ? ssXY / ssXX : 0
  const intercept = yBar - slope * xBar
  const r2        = ssXX > 0 && ssYY > 0 ? (ssXY ** 2) / (ssXX * ssYY) : 0
  return { slope, intercept, r2 }
}

export interface ForecastResult {
  currentOis:    number
  forecastOis:   number
  forecastDelta: number
  confidencePct: number
  horizon:       number   // days
  snapshotsUsed: number
  drivers: {
    improving: Array<{ pillar: string; slope: number; projectedGain: number }>
    declining: Array<{ pillar: string; slope: number; projectedLoss: number }>
  }
  pillarForecasts: Record<string, { current: number; forecast: number; delta: number }>
  method: 'REGRESSION' | 'HEURISTIC'
}

const PILLAR_WEIGHTS: Record<string, number> = {
  decision: 0.20, enterprise: 0.18, workflow: 0.15, goal: 0.14,
  ai: 0.10, business: 0.10, trust: 0.08, adoption: 0.05,
}

const PILLAR_LABELS: Record<string, string> = {
  decision: 'Decision Intelligence', workflow: 'Workflow Quality',
  ai: 'AI Intelligence', enterprise: 'Enterprise Health',
  goal: 'Goal Achievement', business: 'Business Value',
  trust: 'Trust Intelligence', adoption: 'Adoption Intelligence',
}

export async function computeForecast(horizonDays = 30): Promise<ForecastResult> {
  const snapshots: any[] = await (prisma as any).gate8Snapshot.findMany({
    orderBy: { createdAt: 'asc' },
    take: 60,
    select: {
      oisScore: true, decisionScore: true, workflowScore: true,
      aiScore: true, enterpriseScore: true, goalScore: true,
      learningScore: true, businessScore: true, trustScore: true,
      createdAt: true,
    },
  }).catch(() => [])

  const current = await computeGate8()
  const currentOis = current.oisScore

  // Heuristic fallback when not enough snapshots
  if (snapshots.length < 3) {
    const heuristicGain =
      (current.pillars.goal.metrics.avgProgressPct as number ?? 50) > 60 ? 1.5 : 0.5
    const forecastOis = clamp(currentOis + heuristicGain)
    return {
      currentOis, forecastOis,
      forecastDelta: Math.round((forecastOis - currentOis) * 10) / 10,
      confidencePct: 55,
      horizon: horizonDays,
      snapshotsUsed: snapshots.length,
      drivers: {
        improving: current.goalScore > 70 ? [{ pillar: 'Goal Achievement', slope: 0.05, projectedGain: 0.8 }] : [],
        declining: current.enterpriseScore < 80 ? [{ pillar: 'Enterprise Health', slope: -0.03, projectedLoss: 0.6 }] : [],
      },
      pillarForecasts: Object.fromEntries(
        Object.entries(PILLAR_WEIGHTS).map(([k]) => {
          const cur = (current as any)[`${k}Score`] as number
          return [k, { current: cur, forecast: clamp(cur + 0.5), delta: 0.5 }]
        })
      ),
      method: 'HEURISTIC',
    }
  }

  // Time-series regression: x = days since first snapshot
  const t0 = new Date(snapshots[0].createdAt).getTime()
  const oisPoints = snapshots.map(s => ({
    x: (new Date(s.createdAt).getTime() - t0) / (1000 * 60 * 60 * 24),
    y: s.oisScore,
  }))

  const oisReg = linearRegression(oisPoints)
  const lastX  = oisPoints[oisPoints.length - 1].x
  const forecastX = lastX + horizonDays
  const forecastOis = clamp(oisReg.slope * forecastX + oisReg.intercept)

  // Per-pillar regression
  const pillarKeys = ['decision', 'workflow', 'ai', 'enterprise', 'goal', 'business', 'trust', 'adoption']
  const scoreFields: Record<string, string> = {
    decision: 'decisionScore', workflow: 'workflowScore', ai: 'aiScore',
    enterprise: 'enterpriseScore', goal: 'goalScore', business: 'businessScore',
    trust: 'trustScore', adoption: 'adoptionScore',
  }

  const pillarForecasts: Record<string, { current: number; forecast: number; delta: number }> = {}
  const slopes: { pillar: string; slope: number; weight: number }[] = []

  for (const key of pillarKeys) {
    const field = scoreFields[key]
    const pts = snapshots.map(s => ({
      x: (new Date(s.createdAt).getTime() - t0) / (1000 * 60 * 60 * 24),
      y: (s as any)[field] as number,
    }))
    const reg = linearRegression(pts)
    const curScore = (current as any)[field] as number
    const forecastScore = clamp(reg.slope * forecastX + reg.intercept)
    const delta = forecastScore - curScore
    pillarForecasts[key] = { current: curScore, forecast: Math.round(forecastScore * 10) / 10, delta: Math.round(delta * 10) / 10 }
    slopes.push({ pillar: PILLAR_LABELS[key], slope: reg.slope, weight: PILLAR_WEIGHTS[key] })
  }

  // Drivers: pillars with strongest positive/negative slope × weight
  const weightedSlopes = slopes.map(s => ({ ...s, impact: s.slope * s.weight * horizonDays }))
  const improving = weightedSlopes
    .filter(s => s.impact > 0.1)
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3)
    .map(s => ({ pillar: s.pillar, slope: Math.round(s.slope * 1000) / 1000, projectedGain: Math.round(s.impact * 10) / 10 }))
  const declining = weightedSlopes
    .filter(s => s.impact < -0.1)
    .sort((a, b) => a.impact - b.impact)
    .slice(0, 3)
    .map(s => ({ pillar: s.pillar, slope: Math.round(s.slope * 1000) / 1000, projectedLoss: Math.round(Math.abs(s.impact) * 10) / 10 }))

  // Confidence: blend of R², snapshot count, and forecast distance
  const dataQuality    = Math.min(snapshots.length / 10, 1) * 20   // up to 20pts for data volume
  const trendStrength  = oisReg.r2 * 50                             // up to 50pts for R²
  const horizonPenalty = Math.max(0, (horizonDays - 14) / 16 * 10) // penalty for longer horizon
  const confidencePct  = clamp(Math.round(55 + dataQuality + trendStrength - horizonPenalty))

  return {
    currentOis,
    forecastOis:   Math.round(forecastOis   * 10) / 10,
    forecastDelta: Math.round((forecastOis - currentOis) * 10) / 10,
    confidencePct,
    horizon: horizonDays,
    snapshotsUsed: snapshots.length,
    drivers: { improving, declining },
    pillarForecasts,
    method: 'REGRESSION',
  }
}

// ─── Gate 8.2 — Recommendation Engine™ ───────────────────────────────────────

export interface Recommendation {
  id:             string
  pillar:         string
  metric:         string
  action:         string
  currentValue:   string
  targetValue:    string
  oisImpact:      number   // how many OIS points this would add
  pillarImpact:   number   // how many pillar points this would add
  effort:         'LOW' | 'MEDIUM' | 'HIGH'
  priority:       number   // 1 = highest
}

export async function computeRecommendations(): Promise<Recommendation[]> {
  const current = await computeGate8()
  const recs: Recommendation[] = []

  // ── Decision Intelligence ────────────────────────────────────────────────
  const dm = current.pillars.decision.metrics
  const decisionGap = 100 - current.decisionScore
  if (decisionGap > 5) {
    const outcomeRate = dm.outcomeRatePct as number ?? 0
    const resolved    = dm.resolved   as number ?? 0
    const withOutcome = dm.withOutcome as number ?? 0
    const missingOutcomes = resolved - withOutcome

    if (outcomeRate < 70 && missingOutcomes > 0) {
      const pillarGain = Math.min(decisionGap * 0.35, 12)
      recs.push({
        id: 'decision-outcome-rate',
        pillar: 'Decision Intelligence',
        metric: 'Outcome Recorded Rate',
        action: `Record outcomes on ${Math.min(missingOutcomes, 5)} resolved decisions to close the evidence loop`,
        currentValue: `${outcomeRate}%`,
        targetValue:  `${Math.min(100, outcomeRate + Math.ceil(missingOutcomes > 5 ? 30 : missingOutcomes * 6))}%`,
        pillarImpact: Math.round(pillarGain * 10) / 10,
        oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.decision * 10) / 10,
        effort: 'LOW',
        priority: 0,
      })
    }

    const adoptionRate = dm.adoptionRatePct as number ?? 100
    if (adoptionRate < 60) {
      const pillarGain = Math.min(decisionGap * 0.20, 8)
      recs.push({
        id: 'decision-adoption',
        pillar: 'Decision Intelligence',
        metric: 'AI Adoption Rate',
        action: 'Accept more WAANDA recommendations without modification to signal trust and improve AI alignment',
        currentValue: `${adoptionRate}%`,
        targetValue:  `${Math.min(100, adoptionRate + 15)}%`,
        pillarImpact: Math.round(pillarGain * 10) / 10,
        oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.decision * 10) / 10,
        effort: 'MEDIUM',
        priority: 0,
      })
    }
  }

  // ── Workflow Intelligence ────────────────────────────────────────────────
  const wm = current.pillars.workflow.metrics
  const workflowGap = 100 - current.workflowScore
  if (workflowGap > 5) {
    const completionPct = wm.overallCompletionPct as number ?? 100
    const failed        = wm.allFailed as number ?? 0

    if (completionPct < 90 && failed > 0) {
      const improvementPts = Math.min((90 - completionPct), 15)
      const pillarGain     = improvementPts * 0.70
      recs.push({
        id: 'workflow-completion',
        pillar: 'Workflow Intelligence',
        metric: 'Workflow Completion Rate',
        action: `Investigate and resolve ${failed} failed workflow run${failed > 1 ? 's' : ''} — each recovered run adds ~${(0.70 / Math.max(wm.allTotal as number ?? 1, 1) * 100).toFixed(1)} completion points`,
        currentValue: `${completionPct}%`,
        targetValue:  `${Math.min(100, completionPct + Math.ceil(improvementPts))}%`,
        pillarImpact: Math.round(pillarGain * 10) / 10,
        oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.workflow * 10) / 10,
        effort: 'MEDIUM',
        priority: 0,
      })
    }

    const retryRate = wm.kimmpRetryRatePct as number ?? 0
    if (retryRate > 15) {
      const pillarGain = Math.min(workflowGap * 0.15, 6)
      recs.push({
        id: 'workflow-retry',
        pillar: 'Workflow Intelligence',
        metric: 'KIMMP Retry Rate',
        action: 'Review KIMMP workflow definitions for flaky steps — retries signal unstable step dependencies',
        currentValue: `${retryRate}%`,
        targetValue:  `${Math.max(0, retryRate - 10)}%`,
        pillarImpact: Math.round(pillarGain * 10) / 10,
        oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.workflow * 10) / 10,
        effort: 'HIGH',
        priority: 0,
      })
    }
  }

  // ── Enterprise Health ────────────────────────────────────────────────────
  const em = current.pillars.enterprise.metrics
  const p1 = em.p1Active as number ?? 0
  const p2 = em.p2Active as number ?? 0
  const sla = em.slaBreached as number ?? 0

  if (p1 > 0) {
    const pillarGain = p1 * 20
    recs.push({
      id: 'enterprise-p1',
      pillar: 'Enterprise Health',
      metric: 'P1-CRITICAL Incidents',
      action: `Resolve ${p1} P1-CRITICAL incident${p1 > 1 ? 's' : ''} immediately — each one removes a 20-point Enterprise Health penalty`,
      currentValue: `${p1} active`,
      targetValue:  '0 active',
      pillarImpact: pillarGain,
      oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.enterprise * 10) / 10,
      effort: 'HIGH',
      priority: 0,
    })
  }

  if (sla > 0) {
    const pillarGain = sla * 5
    recs.push({
      id: 'enterprise-sla',
      pillar: 'Enterprise Health',
      metric: 'SLA Compliance',
      action: `Address ${sla} SLA breach${sla > 1 ? 'es' : ''} — each resolved breach recovers 5 Enterprise Health points`,
      currentValue: `${sla} breached`,
      targetValue: '0 breached',
      pillarImpact: pillarGain,
      oisImpact:   Math.round(pillarGain * PILLAR_WEIGHTS.enterprise * 10) / 10,
      effort: 'MEDIUM',
      priority: 0,
    })
  }

  // ── Goal Intelligence ────────────────────────────────────────────────────
  const gm = current.pillars.goal.metrics
  const goalGap = 100 - current.goalScore
  if (goalGap > 10) {
    const avgProg = gm.avgProgressPct as number ?? 0
    const atRisk  = gm.atRisk as number ?? 0

    if (avgProg < 70) {
      const pillarGain = Math.min((70 - avgProg) * 0.55, 15)
      recs.push({
        id: 'goal-progress',
        pillar: 'Goal Intelligence',
        metric: 'Average Goal Progress',
        action: 'Advance the lowest-progress active goal by completing its next milestone task — each 10% average progress gain adds ~5 Goal Intelligence points',
        currentValue: `${avgProg}%`,
        targetValue:  `${Math.min(100, avgProg + 10)}%`,
        pillarImpact: Math.round(pillarGain * 10) / 10,
        oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.goal * 10) / 10,
        effort: 'MEDIUM',
        priority: 0,
      })
    }

    if (atRisk > 0) {
      recs.push({
        id: 'goal-atrisk',
        pillar: 'Goal Intelligence',
        metric: 'Goals at Risk',
        action: `Update or extend the deadline on ${atRisk} at-risk goal${atRisk > 1 ? 's' : ''} (deadline within 14 days, progress <60%) to prevent the at-risk penalty`,
        currentValue: `${atRisk} at risk`,
        targetValue: '0 at risk',
        pillarImpact: Math.round(atRisk * 5 * 10) / 10,
        oisImpact:    Math.round(atRisk * 5 * PILLAR_WEIGHTS.goal * 10) / 10,
        effort: 'LOW',
        priority: 0,
      })
    }
  }

  // ── Learning Intelligence ────────────────────────────────────────────────
  const lm = current.pillars.learning.metrics
  const recent = lm.recentLast7Days as number ?? 0
  if (recent < 2) {
    recs.push({
      id: 'learning-velocity',
      pillar: 'Learning Velocity',
      metric: 'Memory Growth Rate',
      action: 'Record outcomes on recent decisions and tag discovered patterns — WAANDA\'s learning velocity directly multiplies the OIS score',
      currentValue: `${recent} memories this week`,
      targetValue: '5+ memories per week',
      pillarImpact: 10,
      oisImpact:    0.5,
      effort: 'LOW',
      priority: 0,
    })
  }

  // ── Business Value ────────────────────────────────────────────────────────
  const bm = current.pillars.business.metrics
  const automationCoverage = bm.automationCoveragePct as number ?? 0
  if (automationCoverage < 60) {
    const pillarGain = Math.min((60 - automationCoverage) * 0.30, 15)
    recs.push({
      id: 'business-automation',
      pillar: 'Business Value',
      metric: 'Automation Coverage',
      action: 'Approve pending KIMMP actions through the L3 gate — each automated approval increases coverage and directly raises Business Value score',
      currentValue: `${automationCoverage}% automated`,
      targetValue: `${Math.min(100, automationCoverage + 15)}%`,
      pillarImpact: Math.round(pillarGain * 10) / 10,
      oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.business * 10) / 10,
      effort: 'LOW',
      priority: 0,
    })
  }

  // ── Trust Intelligence ────────────────────────────────────────────────────
  const tm = current.pillars.trust.metrics
  const aegis = tm.aegisEventsLast30Days as number ?? 0
  if (aegis < 50) {
    recs.push({
      id: 'trust-audit',
      pillar: 'Trust Intelligence',
      metric: 'Audit Coverage',
      action: 'Run AEGIS governance agents and trigger KIMMP orchestrations — each operation is automatically logged, raising audit coverage from LOW to FAIR (+5 Trust points)',
      currentValue: tm.auditCoverage as string,
      targetValue: 'FAIR or better',
      pillarImpact: 5,
      oisImpact:    Math.round(5 * PILLAR_WEIGHTS.trust * 10) / 10,
      effort: 'LOW',
      priority: 0,
    })
  }

  // ── Adoption Intelligence ─────────────────────────────────────────────────
  const am = current.pillars.adoption.metrics
  const acceptanceRate = am.decisionAcceptanceRatePct as number ?? 100
  const recIgnoredCount = am.recommendationsIgnored as number ?? 0
  const activeUsers = am.uniqueActiveUsers as number ?? 0

  if (acceptanceRate < 50) {
    const pillarGain = Math.min((50 - acceptanceRate) * 0.30, 12)
    recs.push({
      id: 'adoption-decision-acceptance',
      pillar: 'Adoption Intelligence',
      metric: 'Decision Acceptance Rate',
      action: 'Accept more KIMMP approval requests through the L3 gate — low acceptance signals under-utilisation of WAANDA and suppresses the Adoption pillar',
      currentValue: `${acceptanceRate}% accepted`,
      targetValue:  `${Math.min(100, acceptanceRate + 20)}%`,
      pillarImpact: Math.round(pillarGain * 10) / 10,
      oisImpact:    Math.round(pillarGain * PILLAR_WEIGHTS.adoption * 10) / 10,
      effort: 'LOW',
      priority: 0,
    })
  }

  if (recIgnoredCount > 2) {
    recs.push({
      id: 'adoption-recs-acted',
      pillar: 'Adoption Intelligence',
      metric: 'Recommendation Follow-through',
      action: `Act on ${Math.min(recIgnoredCount, 3)} ignored Gate 8.2 recommendations — each action taken logs a REC_ACTED event that directly raises Adoption score`,
      currentValue: `${recIgnoredCount} ignored`,
      targetValue: '0 ignored',
      pillarImpact: Math.min(recIgnoredCount * 5, 20),
      oisImpact:    Math.round(Math.min(recIgnoredCount * 5, 20) * PILLAR_WEIGHTS.adoption * 10) / 10,
      effort: 'LOW',
      priority: 0,
    })
  }

  if (activeUsers < 3) {
    recs.push({
      id: 'adoption-active-users',
      pillar: 'Adoption Intelligence',
      metric: 'Daily Active Users',
      action: 'Invite additional team members to use Mission Control and WAANDA Intelligence Studio — user activity is tracked automatically and raises the Adoption pillar',
      currentValue: `${activeUsers} active user${activeUsers !== 1 ? 's' : ''}`,
      targetValue: '5+ active users',
      pillarImpact: Math.min((5 - activeUsers) * 10, 30),
      oisImpact:    Math.round(Math.min((5 - activeUsers) * 10, 30) * PILLAR_WEIGHTS.adoption * 10) / 10,
      effort: 'MEDIUM',
      priority: 0,
    })
  }

  // Sort by OIS impact descending, assign priority rank
  const sorted = recs
    .sort((a, b) => b.oisImpact - a.oisImpact)
    .map((r, i) => ({ ...r, priority: i + 1 }))

  return sorted
}
