// WAOE Mission Control — enterprise health aggregation
// Single endpoint consumed by the CEO cockpit.

import { prisma } from '../../../lib/prisma'

export interface HealthFactor {
  factor:      string
  impact:      number   // negative = bad
  description: string
}

export interface EnterpriseHealthScore {
  score:     number   // 0–100
  label:     'EXCELLENT' | 'GOOD' | 'FAIR' | 'AT_RISK' | 'CRITICAL'
  color:     string
  breakdown: HealthFactor[]
}

export interface MissionControlData {
  score:           EnterpriseHealthScore
  goals: {
    active:        number
    avgProgress:   number
    needingAction: number
  }
  workflows: {
    running:       number
    paused:        number
    completed24h:  number
    failed24h:     number
    total:         number
  }
  risks: {
    criticalSignals:    number
    highSignals:        number
    atRiskClients:      number
    unhealthyProjects:  number
    overdueInvoices:    number
    openRisks:          number
  }
  blockedApprovals: Array<{
    id:          string
    name:        string
    triggeredBy: string
    startedAt:   string
    currentStep: string | null
  }>
  integrations: Array<{
    platform:   string
    connected:  boolean
    lastUsedAt: string | null
  }>
  recommendations: Array<{
    id:             string
    summary:        string
    recommendation: string
    confidence:     number
    createdAt:      string
  }>
  opportunities: Array<{
    goalId:    string
    objective: string
    reasoning: string
    evaluatedAt: string
  }>
  recentSignals: Array<{
    id:          string
    signalType:  string
    signalValue: string
    severity:    string
    createdAt:   string
  }>
  recentActivity: Array<{
    type:      string
    label:     string
    detail:    string
    timestamp: string
    severity?: string
  }>
  generatedAt: string
}

function computeScore(risks: MissionControlData['risks'], workflows: MissionControlData['workflows']): EnterpriseHealthScore {
  const breakdown: HealthFactor[] = []
  let score = 100

  if (risks.criticalSignals > 0) {
    const impact = -Math.min(risks.criticalSignals * 8, 24)
    breakdown.push({ factor: 'Critical signals', impact, description: `${risks.criticalSignals} CRITICAL signal(s) active` })
    score += impact
  }
  if (risks.highSignals > 0) {
    const impact = -Math.min(risks.highSignals * 4, 16)
    breakdown.push({ factor: 'High signals', impact, description: `${risks.highSignals} HIGH signal(s) active` })
    score += impact
  }
  if (risks.atRiskClients > 0) {
    const impact = -Math.min(risks.atRiskClients * 5, 20)
    breakdown.push({ factor: 'At-risk clients', impact, description: `${risks.atRiskClients} client(s) at risk or critical` })
    score += impact
  }
  if (risks.unhealthyProjects > 0) {
    const impact = -Math.min(risks.unhealthyProjects * 3, 12)
    breakdown.push({ factor: 'Project health', impact, description: `${risks.unhealthyProjects} project(s) with health < 60%` })
    score += impact
  }
  if (risks.overdueInvoices > 0) {
    const impact = -Math.min(risks.overdueInvoices * 2, 10)
    breakdown.push({ factor: 'Overdue invoices', impact, description: `${risks.overdueInvoices} invoice(s) overdue` })
    score += impact
  }
  if (workflows.failed24h > 0) {
    const impact = -Math.min(workflows.failed24h * 3, 12)
    breakdown.push({ factor: 'Workflow failures', impact, description: `${workflows.failed24h} workflow(s) failed in last 24h` })
    score += impact
  }
  if (workflows.paused > 0) {
    const impact = -Math.min(workflows.paused * 1, 5)
    breakdown.push({ factor: 'Blocked workflows', impact, description: `${workflows.paused} workflow(s) waiting for approval` })
    score += impact
  }

  if (breakdown.length === 0) {
    breakdown.push({ factor: 'All systems healthy', impact: 0, description: 'No active risk factors detected' })
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  const label: EnterpriseHealthScore['label'] =
    score >= 90 ? 'EXCELLENT' :
    score >= 75 ? 'GOOD'      :
    score >= 60 ? 'FAIR'      :
    score >= 40 ? 'AT_RISK'   : 'CRITICAL'

  const color =
    score >= 90 ? '#00c875' :
    score >= 75 ? '#00c875' :
    score >= 60 ? '#fdab3d' :
    score >= 40 ? '#e2445c' : '#c70039'

  return { score, label, color, breakdown }
}

export async function getMissionControlData(userId: string): Promise<MissionControlData> {
  const now   = new Date()
  const ago24 = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [
    goalsResult, wfRunsResult, signalsResult, clientsResult,
    projectsResult, invoicesResult, approvalsResult, integrationsResult,
    recommendationsResult, opportunitiesResult, activityResult,
  ] = await Promise.allSettled([

    // Goals
    (prisma as any).kimmpGoal.findMany({
      where: { status: { in: ['ACTIVE', 'APPROVED', 'IN_PROGRESS'] } },
      select: { id: true, progressPct: true, status: true },
    }).catch(() => []),

    // All workflow runs grouped by status
    (prisma as any).kimmpWorkflowRun.findMany({
      select: { id: true, status: true, startedAt: true, completedAt: true, failedAt: true, triggeredBy: true, currentStep: true },
      include: { workflow: { select: { name: true } } },
      orderBy: { startedAt: 'desc' },
      take: 200,
    }).catch(() => []),

    // Signals
    (prisma as any).kimmpSignal.findMany({
      where: { status: 'NEW' },
      select: { id: true, signalType: true, signalValue: true, severity: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }).catch(() => []),

    // At-risk clients
    prisma.clientCRM.count({ where: { health: { in: ['at-risk', 'critical'] } } }).catch(() => 0),

    // Unhealthy projects
    prisma.project.count({ where: { health: { lt: 60 } } }).catch(() => 0),

    // Overdue invoices
    prisma.invoice.count({ where: { status: 'OVERDUE' } }).catch(() => 0),

    // Paused workflow runs (blocked approvals)
    (prisma as any).kimmpWorkflowRun.findMany({
      where:   { status: 'PAUSED' },
      include: { workflow: { select: { name: true } } },
      orderBy: { startedAt: 'desc' },
      take: 10,
    }).catch(() => []),

    // Connected integrations
    (prisma as any).orgIntegrationConfig.findMany({
      where:  { enabled: true },
      select: { platform: true, enabled: true, lastUsedAt: true },
    }).catch(() => []),

    // Recent KIMMP orchestrations for recommendations
    (prisma as any).kimmpOrchestration.findMany({
      where:   { createdAt: { gte: ago24 } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, summary: true, recommendation: true, confidence: true, createdAt: true },
    }).catch(() => []),

    // Autonomous opportunities (goal evals that needed action)
    (prisma as any).kimmpGoalEvaluation.findMany({
      where:   { needsAction: true, evaluatedAt: { gte: ago24 } },
      orderBy: { evaluatedAt: 'desc' },
      take: 8,
      include: { /* no relation to goal directly — join manually */ },
    }).catch(() => []),

    // Recent activity (latest 10 workflow runs for feed)
    (prisma as any).kimmpWorkflowRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
      include: { workflow: { select: { name: true } } },
      select: { id: true, status: true, startedAt: true, completedAt: true, failedAt: true, triggeredBy: true, currentStep: true },
    }).catch(() => []),
  ])

  const goals        = goalsResult.status        === 'fulfilled' ? goalsResult.value        : []
  const wfRuns       = wfRunsResult.status       === 'fulfilled' ? wfRunsResult.value       : []
  const signals      = signalsResult.status      === 'fulfilled' ? signalsResult.value      : []
  const atRisk       = clientsResult.status      === 'fulfilled' ? clientsResult.value      : 0
  const unhealthy    = projectsResult.status     === 'fulfilled' ? projectsResult.value     : 0
  const overdue      = invoicesResult.status     === 'fulfilled' ? invoicesResult.value     : 0
  const paused       = approvalsResult.status    === 'fulfilled' ? approvalsResult.value    : []
  const integrations = integrationsResult.status === 'fulfilled' ? integrationsResult.value : []
  const recs         = recommendationsResult.status === 'fulfilled' ? recommendationsResult.value : []
  const opps         = opportunitiesResult.status === 'fulfilled' ? opportunitiesResult.value : []
  const activity     = activityResult.status     === 'fulfilled' ? activityResult.value     : []

  const criticalSigs = signals.filter((s: any) => s.severity === 'CRITICAL').length
  const highSigs     = signals.filter((s: any) => s.severity === 'HIGH').length

  const running      = wfRuns.filter((r: any) => r.status === 'RUNNING').length
  const pausedCount  = wfRuns.filter((r: any) => r.status === 'PAUSED').length
  const comp24h      = wfRuns.filter((r: any) => r.status === 'COMPLETED' && r.completedAt && new Date(r.completedAt) >= ago24).length
  const fail24h      = wfRuns.filter((r: any) => r.status === 'FAILED'    && r.failedAt    && new Date(r.failedAt)    >= ago24).length

  const workflows: MissionControlData['workflows'] = {
    running, paused: pausedCount, completed24h: comp24h, failed24h: fail24h, total: wfRuns.length,
  }

  const risks: MissionControlData['risks'] = {
    criticalSignals: criticalSigs, highSignals: highSigs,
    atRiskClients: atRisk, unhealthyProjects: unhealthy,
    overdueInvoices: overdue, openRisks: 0,
  }

  // Enrich opportunities with goal data (best-effort)
  const enrichedOpps = await Promise.all(
    (opps as any[]).map(async (op: any) => {
      const goal = await (prisma as any).kimmpGoal.findUnique({ where: { id: op.goalId }, select: { objective: true } }).catch(() => null)
      return { goalId: op.goalId, objective: goal?.objective ?? op.goalId, reasoning: op.reasoning, evaluatedAt: op.evaluatedAt.toISOString() }
    })
  )

  // Build recent activity feed
  const recentActivity = (activity as any[]).map((r: any) => ({
    type:      'WORKFLOW',
    label:     r.workflow?.name ?? r.id.slice(0, 12),
    detail:    r.status + (r.currentStep ? ` · step: ${r.currentStep}` : ''),
    timestamp: (r.completedAt ?? r.failedAt ?? r.startedAt).toISOString?.() ?? String(r.startedAt),
    severity:  r.status === 'FAILED' ? 'HIGH' : r.status === 'PAUSED' ? 'MEDIUM' : 'LOW',
  }))

  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((s: number, g: any) => s + (g.progressPct ?? 0), 0) / goals.length)
    : 0

  // Find goals with recent needsAction evaluations
  const goalIdsNeedingAction = new Set((opps as any[]).map((o: any) => o.goalId))

  const score = computeScore(risks, workflows)

  return {
    score,
    goals: {
      active:        goals.length,
      avgProgress,
      needingAction: goalIdsNeedingAction.size,
    },
    workflows,
    risks,
    blockedApprovals: (paused as any[]).map(r => ({
      id:          r.id,
      name:        r.workflow?.name ?? r.id,
      triggeredBy: r.triggeredBy,
      startedAt:   r.startedAt.toISOString?.() ?? String(r.startedAt),
      currentStep: r.currentStep,
    })),
    integrations: (integrations as any[]).map(i => ({
      platform:   i.platform,
      connected:  i.enabled,
      lastUsedAt: i.lastUsedAt?.toISOString?.() ?? null,
    })),
    recommendations: (recs as any[]).map(r => ({
      id:             r.id,
      summary:        r.summary ?? '',
      recommendation: r.recommendation ?? '',
      confidence:     r.confidence ?? 0,
      createdAt:      r.createdAt.toISOString?.() ?? String(r.createdAt),
    })),
    opportunities: enrichedOpps,
    recentSignals: (signals as any[]).slice(0, 10).map((s: any) => ({
      id:          s.id,
      signalType:  s.signalType,
      signalValue: s.signalValue,
      severity:    s.severity,
      createdAt:   s.createdAt.toISOString?.() ?? String(s.createdAt),
    })),
    recentActivity,
    generatedAt: now.toISOString(),
  }
}
