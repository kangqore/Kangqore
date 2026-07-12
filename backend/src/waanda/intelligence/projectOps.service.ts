import { PrismaClient } from '@prisma/client'
import { LogicToolRegistry } from '../../kangqore-immp/tools/logicToolRegistry'

const prisma = new PrismaClient()

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectRisk {
  label:       string
  severity:    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  probability: number   // 0–100
}

export interface ProjectBlocker {
  label: string
  since: string   // ISO date
}

export interface ProjectRecommendation {
  action:   string
  impact:   string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface ProjectOperationalStateResult {
  id:                    string
  projectId:             string
  health:                number
  predictedCompletion:   string | null
  confidence:            number
  risks:                 ProjectRisk[]
  blockers:              ProjectBlocker[]
  activeRecommendations: ProjectRecommendation[]
  lastAssessment:        string
}

export interface TwinScenario {
  label:       string
  days:        number
  delayDays:   number
  confidence:  number
  assumptions: string[]
}

export interface ProjectDigitalTwinResult {
  id:                  string
  projectId:           string
  currentTimelineDays: number
  scenarios:           TwinScenario[]
  delayDays:           number
  confidence:          number
  simulatedAt:         string
}

// ─── Health computation ───────────────────────────────────────────────────────

async function computeProjectHealth(projectId: string): Promise<{
  health: number
  predictedCompletion: Date | null
  confidence: number
  risks: ProjectRisk[]
  blockers: ProjectBlocker[]
  recommendations: ProjectRecommendation[]
}> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks:        true,
      deliverables: true,
      risks:        true,
      issues:       true,
    },
  })

  if (!project) throw new Error(`Project ${projectId} not found`)

  const now = new Date()

  // ── Progress score (30 pts) ───────────────────────────────────────────────
  const progress = project.progress ?? 0
  const progressScore = Math.min(progress, 100) * 0.30

  // ── Schedule score (25 pts) ───────────────────────────────────────────────
  let scheduleScore = 25
  let predictedCompletion: Date | null = project.dueDate ?? null
  let delayRisk = false

  if (project.dueDate) {
    const totalMs    = project.dueDate.getTime() - project.createdAt.getTime()
    const elapsedMs  = now.getTime()             - project.createdAt.getTime()
    const expectedPct = totalMs > 0 ? Math.min((elapsedMs / totalMs) * 100, 100) : 0
    const progressGap = expectedPct - progress

    if (progressGap > 30) {
      scheduleScore = 5
      delayRisk = true
      // predict completion by linear extrapolation
      if (progress > 0) {
        const msPerPct   = elapsedMs / progress
        const remaining  = 100 - progress
        const extraMs    = remaining * msPerPct
        predictedCompletion = new Date(now.getTime() + extraMs)
      }
    } else if (progressGap > 15) {
      scheduleScore = 15
      delayRisk = true
    }
  }

  // ── Task completion score (20 pts) ────────────────────────────────────────
  const totalTasks = project.tasks.length
  const doneTasks  = project.tasks.filter(t => t.status === 'done').length
  const taskScore  = totalTasks > 0 ? (doneTasks / totalTasks) * 20 : 10

  // ── Risk score (15 pts — penalise high/critical open risks) ──────────────
  const openRisks = project.risks.filter(r => (r as any).status !== 'closed')
  const riskPenalty = openRisks.reduce((acc, r) => {
    const sev = (r as any).severity?.toUpperCase() ?? 'LOW'
    return acc + (sev === 'CRITICAL' ? 8 : sev === 'HIGH' ? 4 : sev === 'MEDIUM' ? 2 : 0.5)
  }, 0)
  const riskScore = Math.max(0, 15 - riskPenalty)

  // ── Issue score (10 pts — penalise open issues) ───────────────────────────
  const openIssues  = project.issues.filter(i => (i as any).status !== 'closed' && (i as any).status !== 'resolved')
  const issuePenalty = openIssues.length * 1.5
  const issueScore  = Math.max(0, 10 - issuePenalty)

  const health = Math.min(100, Math.round(progressScore + scheduleScore + taskScore + riskScore + issueScore))

  // Emit to aegisAuditLog via LogicToolRegistry for provenance
  LogicToolRegistry.execute('project_health_score', {
    on_time_pct:    (scheduleScore / 25) * 100,
    budget_pct:     project.adminConfidenceScore ?? 80,
    completion_pct: progress,
  })

  // ── Confidence ────────────────────────────────────────────────────────────
  const evidenceScore = project.progressEvidence ? 20 : 0
  const adminConf     = project.adminConfidenceScore ?? 0
  const confidence    = Math.min(100, Math.round((adminConf * 0.6) + evidenceScore + (totalTasks > 0 ? 20 : 0)))

  // ── Risks (structured) ────────────────────────────────────────────────────
  const structuredRisks: ProjectRisk[] = openRisks.slice(0, 5).map(r => ({
    label:       (r as any).title ?? 'Unspecified risk',
    severity:    ((r as any).severity?.toUpperCase() ?? 'MEDIUM') as ProjectRisk['severity'],
    probability: (r as any).probability ?? 50,
  }))

  if (delayRisk && !structuredRisks.find(r => r.label.includes('Schedule'))) {
    structuredRisks.unshift({ label: 'Schedule slippage detected', severity: 'HIGH', probability: 75 })
  }

  // deadline_risk_score: compute and surface as a risk entry when HIGH/CRITICAL
  if (project.dueDate) {
    const drResult = LogicToolRegistry.execute('deadline_risk_score', {
      deadline:     project.dueDate.toISOString(),
      today:        now.toISOString(),
      progress_pct: progress,
    })
    const drLabel = String(drResult.label ?? '')
    if (drLabel.includes('CRITICAL') && !structuredRisks.find(r => r.label.includes('deadline'))) {
      structuredRisks.unshift({
        label:       `Deadline at critical risk (${Math.round(Number(drResult.result))}/100)`,
        severity:    'CRITICAL',
        probability: Math.min(100, Math.round(Number(drResult.result))),
      })
    }
  }

  // ── Blockers ─────────────────────────────────────────────────────────────
  const blockers: ProjectBlocker[] = openIssues
    .filter(i => (i as any).priority === 'critical' || (i as any).priority === 'high')
    .slice(0, 3)
    .map(i => ({
      label: (i as any).title ?? 'Open issue',
      since: ((i as any).createdAt as Date).toISOString().split('T')[0],
    }))

  // ── Recommendations ───────────────────────────────────────────────────────
  const recommendations: ProjectRecommendation[] = []

  if (delayRisk) {
    recommendations.push({
      action:   'Review resource allocation — current velocity will miss deadline',
      impact:   `Risk of ${Math.abs(progress - 50)}%+ schedule overrun`,
      priority: 'HIGH',
    })
  }
  if (openRisks.some(r => ((r as any).severity ?? '').toUpperCase() === 'CRITICAL')) {
    recommendations.push({
      action:   'Escalate critical risk to project sponsor immediately',
      impact:   'Unaddressed critical risk threatens project viability',
      priority: 'HIGH',
    })
  }
  if (totalTasks > 0 && doneTasks / totalTasks < 0.3 && progress > 50) {
    recommendations.push({
      action:   'Task granularity mismatch — break down remaining tasks',
      impact:   'Improves progress visibility and milestone confidence',
      priority: 'MEDIUM',
    })
  }
  if (!project.dueDate) {
    recommendations.push({
      action:   'Set a project due date to enable timeline simulation',
      impact:   'Unlocks Project Digital Twin™ and schedule risk analysis',
      priority: 'MEDIUM',
    })
  }

  return { health, predictedCompletion, confidence, risks: structuredRisks, blockers, recommendations }
}

// ─── Upsert ProjectOperationalState ──────────────────────────────────────────

export async function assessProject(projectId: string): Promise<ProjectOperationalStateResult> {
  const { health, predictedCompletion, confidence, risks, blockers, recommendations } =
    await computeProjectHealth(projectId)

  const state = await prisma.projectOperationalState.upsert({
    where:  { projectId },
    create: {
      projectId,
      health,
      predictedCompletion,
      confidence,
      risks:                 risks         as any,
      blockers:              blockers      as any,
      activeRecommendations: recommendations as any,
      lastAssessment:        new Date(),
    },
    update: {
      health,
      predictedCompletion,
      confidence,
      risks:                 risks         as any,
      blockers:              blockers      as any,
      activeRecommendations: recommendations as any,
      lastAssessment:        new Date(),
    },
  })

  return {
    id:                    state.id,
    projectId:             state.projectId,
    health:                state.health,
    predictedCompletion:   state.predictedCompletion?.toISOString() ?? null,
    confidence:            state.confidence,
    risks:                 state.risks    as unknown as ProjectRisk[],
    blockers:              state.blockers as unknown as ProjectBlocker[],
    activeRecommendations: state.activeRecommendations as unknown as ProjectRecommendation[],
    lastAssessment:        state.lastAssessment.toISOString(),
  }
}

export async function getProjectOps(projectId: string): Promise<ProjectOperationalStateResult | null> {
  const state = await prisma.projectOperationalState.findUnique({ where: { projectId } })
  if (!state) return null
  return {
    id:                    state.id,
    projectId:             state.projectId,
    health:                state.health,
    predictedCompletion:   state.predictedCompletion?.toISOString() ?? null,
    confidence:            state.confidence,
    risks:                 state.risks    as unknown as ProjectRisk[],
    blockers:              state.blockers as unknown as ProjectBlocker[],
    activeRecommendations: state.activeRecommendations as unknown as ProjectRecommendation[],
    lastAssessment:        state.lastAssessment.toISOString(),
  }
}

// ─── Daily sweep — assess all active projects ─────────────────────────────────

export async function sweepAllProjects(): Promise<{ assessed: number; avgHealth: number }> {
  const projects = await prisma.project.findMany({
    where: { status: { in: ['ACTIVE', 'IN_PROGRESS'] as any } },
    select: { id: true },
  })

  let totalHealth = 0
  let assessed    = 0

  for (const p of projects) {
    try {
      const state = await assessProject(p.id)
      totalHealth += state.health
      assessed++
    } catch {
      // skip projects with missing data
    }
  }

  return { assessed, avgHealth: assessed > 0 ? Math.round(totalHealth / assessed) : 0 }
}

// ─── Portfolio health for Gate 8 Enterprise pillar ───────────────────────────

export async function getPortfolioHealthScore(): Promise<number> {
  const states = await prisma.projectOperationalState.findMany({
    select: { health: true },
  })
  if (states.length === 0) return 0
  const avg = states.reduce((sum, s) => sum + s.health, 0) / states.length
  return Math.round(avg)
}

// ─── Project Digital Twin™ ────────────────────────────────────────────────────

export async function simulateTwin(
  projectId: string,
  extraResources = 0,  // additional FTE-equivalent
): Promise<ProjectDigitalTwinResult> {
  const project = await prisma.project.findUnique({
    where:   { id: projectId },
    include: { tasks: true, risks: true },
  })

  if (!project) throw new Error(`Project ${projectId} not found`)

  const now     = new Date()
  const dueDate = project.dueDate
  const progress = project.progress ?? 0

  // Current timeline: days from today to due date
  const currentTimelineDays = dueDate
    ? Math.max(0, Math.ceil((dueDate.getTime() - now.getTime()) / 86400000))
    : 90  // default estimate if no due date

  // Base velocity: % per day based on elapsed time
  const elapsedDays = Math.max(1, Math.ceil((now.getTime() - project.createdAt.getTime()) / 86400000))
  const velocityPerDay = progress / elapsedDays  // % per day

  // Days to completion at current velocity
  const remaining       = 100 - progress
  const daysToComplete  = velocityPerDay > 0 ? Math.ceil(remaining / velocityPerDay) : currentTimelineDays * 2
  const delayDays       = Math.max(0, daysToComplete - currentTimelineDays)

  // Confidence: based on data richness
  const hasRisks    = project.risks.length > 0
  const hasTasks    = project.tasks.length > 0
  const hasDueDate  = !!dueDate
  const confidence  = Math.min(95, 40 + (hasTasks ? 20 : 0) + (hasRisks ? 15 : 0) + (hasDueDate ? 20 : 0) + (progress > 10 ? 5 : 0))

  // ── Scenarios ─────────────────────────────────────────────────────────────
  const scenarios: TwinScenario[] = []

  // Scenario 1: Current trajectory
  scenarios.push({
    label:      'Current Trajectory',
    days:       daysToComplete,
    delayDays,
    confidence,
    assumptions: ['No resource changes', 'Current velocity maintained', 'No new blockers'],
  })

  // Scenario 2: Resource addition
  if (extraResources > 0 || true) {  // always show the +1 FTE scenario
    const resourceBoost  = 0.3   // 30% velocity gain per FTE
    const boostedDays    = Math.ceil(daysToComplete / (1 + resourceBoost))
    const boostedDelay   = Math.max(0, boostedDays - currentTimelineDays)
    scenarios.push({
      label:      '+1 Resource',
      days:       boostedDays,
      delayDays:  boostedDelay,
      confidence: Math.max(confidence - 10, 40),
      assumptions: ['One FTE added immediately', '~30% velocity improvement', 'No ramp-up delay'],
    })
  }

  // Scenario 3: Risk-adjusted (pessimistic)
  const criticalRisks = project.risks.filter(r => ((r as any).severity ?? '').toUpperCase() === 'CRITICAL').length
  const highRisks     = project.risks.filter(r => ((r as any).severity ?? '').toUpperCase() === 'HIGH').length
  const riskMultiplier = 1 + (criticalRisks * 0.25) + (highRisks * 0.10)
  const pessimisticDays  = Math.ceil(daysToComplete * riskMultiplier)
  const pessimisticDelay = Math.max(0, pessimisticDays - currentTimelineDays)
  scenarios.push({
    label:       'Risk-Adjusted',
    days:        pessimisticDays,
    delayDays:   pessimisticDelay,
    confidence:  Math.max(confidence - 20, 30),
    assumptions: [
      `${criticalRisks} critical + ${highRisks} high risks fully materialise`,
      'No risk mitigation executed',
      `${Math.round((riskMultiplier - 1) * 100)}% velocity penalty applied`,
    ],
  })

  // Upsert the twin
  const twin = await prisma.projectDigitalTwin.upsert({
    where:  { projectId },
    create: {
      projectId,
      currentTimelineDays,
      scenarios: scenarios as any,
      delayDays,
      confidence,
      simulatedAt: new Date(),
    },
    update: {
      currentTimelineDays,
      scenarios:   scenarios as any,
      delayDays,
      confidence,
      simulatedAt: new Date(),
    },
  })

  return {
    id:                  twin.id,
    projectId:           twin.projectId,
    currentTimelineDays: twin.currentTimelineDays,
    scenarios:           twin.scenarios as unknown as TwinScenario[],
    delayDays:           twin.delayDays,
    confidence:          twin.confidence,
    simulatedAt:         twin.simulatedAt.toISOString(),
  }
}

export async function getTwin(projectId: string): Promise<ProjectDigitalTwinResult | null> {
  const twin = await prisma.projectDigitalTwin.findUnique({ where: { projectId } })
  if (!twin) return null
  return {
    id:                  twin.id,
    projectId:           twin.projectId,
    currentTimelineDays: twin.currentTimelineDays,
    scenarios:           twin.scenarios as unknown as TwinScenario[],
    delayDays:           twin.delayDays,
    confidence:          twin.confidence,
    simulatedAt:         twin.simulatedAt.toISOString(),
  }
}
