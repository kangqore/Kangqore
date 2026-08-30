import { PrismaClient } from '@prisma/client'
import { computeGate8, computeForecast, computeRecommendations, getGate8History } from './gate8.service'

const prisma = new PrismaClient()

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n))
}

// ─── Adoption Event Logging ───────────────────────────────────────────────────

export type AdoptionEventType =
  | 'SESSION' | 'AGENT_INVOKE' | 'WORKFLOW_TRIGGER'
  | 'DECISION_ACCEPT' | 'DECISION_REJECT' | 'OVERRIDE'
  | 'REC_ACTED' | 'REC_IGNORED'

export async function logAdoptionEvent(
  eventType: AdoptionEventType,
  userId?: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<{ id: string }> {
  return (prisma as any).adoptionEvent.create({
    data: {
      userId:     userId     ?? null,
      eventType,
      entityType: entityType ?? null,
      entityId:   entityId   ?? null,
      metadata:   metadata   ?? {},
    },
    select: { id: true },
  })
}

// ─── Enterprise Definition ────────────────────────────────────────────────────

export async function getActiveDefinition() {
  return (prisma as any).enterpriseDefinition.findFirst({
    where:   { isActive: true },
    orderBy: { activatedAt: 'desc' },
    include: { goals: { orderBy: { createdAt: 'asc' } } },
  }).catch(() => null)
}

export async function upsertDefinition(name: string, goals: Array<{
  pillar: string; label: string; target: number; unit: string; weight?: number
}>) {
  // Deactivate any existing active definition
  await (prisma as any).enterpriseDefinition.updateMany({
    where: { isActive: true },
    data:  { isActive: false },
  }).catch(() => null)

  return (prisma as any).enterpriseDefinition.create({
    data: {
      name,
      isActive: true,
      goals: {
        create: goals.map(g => ({
          pillar: g.pillar,
          label:  g.label,
          target: g.target,
          unit:   g.unit,
          weight: g.weight ?? 1.0,
        })),
      },
    },
    include: { goals: true },
  })
}

// ─── EMI™ — WAANDA Enterprise Maturity Index ─────────────────────────────────

export type MaturityLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

interface LevelSpec {
  label:       string
  description: string
  minComposite: number
  minIntelligence: number
  minAutonomy:     number
  minAdoption:     number
  minGovernance:   number
}

const LEVEL_SPECS: Record<MaturityLevel, LevelSpec> = {
  L1: { label: 'L1 — Reactive',    description: 'Mostly manual. No governance. Operations respond to events.',                          minComposite: 0,  minIntelligence: 0,  minAutonomy: 0,  minAdoption: 0,  minGovernance: 0  },
  L2: { label: 'L2 — Managed',     description: 'Standard workflows running. Basic governance in place.',                               minComposite: 25, minIntelligence: 30, minAutonomy: 10, minAdoption: 15, minGovernance: 25 },
  L3: { label: 'L3 — Intelligent', description: 'WAANDA supports decisions. Recommendations being acted on.',                           minComposite: 45, minIntelligence: 55, minAutonomy: 25, minAdoption: 35, minGovernance: 45 },
  L4: { label: 'L4 — Autonomous',  description: 'WAOE executes most routine operations without human initiation.',                      minComposite: 64, minIntelligence: 72, minAutonomy: 65, minAdoption: 55, minGovernance: 60 },
  L5: { label: 'L5 — Adaptive',    description: 'Enterprise continuously improves through COIG, Coach, and Digital Twin.',              minComposite: 83, minIntelligence: 88, minAutonomy: 80, minAdoption: 72, minGovernance: 78 },
}

const LEVEL_ORDER: MaturityLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5']

export interface EMIDimensions {
  intelligence: number
  autonomy:     number
  adoption:     number
  governance:   number
}

export interface MaturityBlocker {
  dimension:  keyof EMIDimensions
  label:      string
  current:    number
  required:   number
  gap:        number
  howToClose: string
}

export interface EMIResult {
  level:           MaturityLevel
  levelLabel:      string
  description:     string
  isProvisional:   boolean   // confidence < 40
  emiScore:        number    // composite 0–100
  confidence:      number    // 0–100
  dimensions:      EMIDimensions
  blockers:        MaturityBlocker[]
  nextLevel:       MaturityLevel | null
  nextLevelLabel:  string | null
  timeToNextLevel: { days: number; bottleneckDimension: string; acceleratorDays: number } | null
  computedAt:      string
}

async function computeGovernanceDimension(trustScore: number): Promise<number> {
  const [qefCerts, rgsDecisions] = await Promise.all([
    (prisma as any).qEFCertificate.findMany({
      where:   { certificateStatus: 'ACTIVE' },
      orderBy: { issuedAt: 'desc' },
      take: 10,
      select:  { certScore: true },
    }).catch(() => [] as any[]),
    (prisma as any).deploymentDecision.findMany({
      orderBy: { evaluatedAt: 'desc' },
      take: 20,
      select:  { verdict: true },
    }).catch(() => [] as any[]),
  ])

  const qefAvg = qefCerts.length > 0
    ? qefCerts.reduce((s: number, c: any) => s + (c.certScore ?? 0), 0) / qefCerts.length
    : 60

  const rgsCompliant = rgsDecisions.length > 0
    ? rgsDecisions.filter((d: any) => d.verdict === 'DEPLOY').length / rgsDecisions.length * 100
    : 70

  return clamp(qefAvg * 0.40 + rgsCompliant * 0.30 + trustScore * 0.30)
}

async function computeAutonomyDimension(): Promise<number> {
  const [waoeRuns, totalRuns] = await Promise.all([
    prisma.osWorkflowRun.count({ where: { triggeredBy: 'WAOE' } }).catch(() => 0),
    prisma.osWorkflowRun.count().catch(() => 0),
  ])
  if (totalRuns === 0) return 5  // new deployment default
  return clamp((waoeRuns / totalRuns) * 100)
}

function computeMaturityConfidence(deployment: {
  ageInDays:                  number
  snapshotCount:              number
  adoptionEventCount:         number
  recommendationHistoryCount: number
}): number {
  const ageFactor      = Math.min(deployment.ageInDays / 90, 1)  * 30
  const snapshotFactor = Math.min(deployment.snapshotCount / 20, 1) * 25
  const adoptionFactor = Math.min(deployment.adoptionEventCount / 30, 1) * 25
  const recFactor      = Math.min(deployment.recommendationHistoryCount / 10, 1) * 20
  return Math.round(clamp(ageFactor + snapshotFactor + adoptionFactor + recFactor))
}

function classifyLevel(composite: number, dims: EMIDimensions): MaturityLevel {
  for (const level of [...LEVEL_ORDER].reverse()) {
    const spec = LEVEL_SPECS[level]
    if (
      composite              >= spec.minComposite    &&
      dims.intelligence      >= spec.minIntelligence &&
      dims.autonomy          >= spec.minAutonomy      &&
      dims.adoption          >= spec.minAdoption      &&
      dims.governance        >= spec.minGovernance
    ) {
      return level
    }
  }
  return 'L1'
}

function buildBlockers(currentLevel: MaturityLevel, dims: EMIDimensions): { blockers: MaturityBlocker[]; nextLevel: MaturityLevel | null } {
  const idx = LEVEL_ORDER.indexOf(currentLevel)
  if (idx === LEVEL_ORDER.length - 1) return { blockers: [], nextLevel: null }
  const nextLevel = LEVEL_ORDER[idx + 1]
  const spec = LEVEL_SPECS[nextLevel]

  const dimensionMeta: Array<{ key: keyof EMIDimensions; label: string; required: number; howToClose: string }> = [
    { key: 'intelligence', label: 'Operational Intelligence (OIS)', required: spec.minIntelligence, howToClose: 'Improve OIS by acting on Gate 8.2 recommendations and resolving open incidents' },
    { key: 'autonomy',     label: 'Workflow Automation (WAOE)',     required: spec.minAutonomy,     howToClose: 'Activate more workflow templates and let WAOE trigger them automatically' },
    { key: 'adoption',     label: 'Platform Adoption',              required: spec.minAdoption,     howToClose: 'Increase daily active users and decision acceptance rate in the L3 approval gate' },
    { key: 'governance',   label: 'Governance Coverage (QEF/RGS)',  required: spec.minGovernance,   howToClose: 'Obtain QEF certification for current release and ensure RGS approval is complete' },
  ]

  const blockers: MaturityBlocker[] = dimensionMeta
    .filter(d => dims[d.key] < d.required)
    .map(d => ({
      dimension:  d.key,
      label:      d.label,
      current:    Math.round(dims[d.key] * 10) / 10,
      required:   d.required,
      gap:        Math.round((d.required - dims[d.key]) * 10) / 10,
      howToClose: d.howToClose,
    }))

  return { blockers, nextLevel }
}

async function estimateTimeToNextLevel(
  nextLevel: MaturityLevel,
  dims: EMIDimensions,
  history: any[]
): Promise<{ days: number; bottleneckDimension: string; acceleratorDays: number } | null> {
  if (!nextLevel || history.length < 3) return null

  const spec = LEVEL_SPECS[nextLevel]
  const t0   = new Date(history[history.length - 1].createdAt).getTime()

  const dimFields: Array<{ key: keyof EMIDimensions; historyField: string; required: number }> = [
    { key: 'intelligence', historyField: 'oisScore',      required: spec.minIntelligence },
    { key: 'autonomy',     historyField: 'adoptionScore', required: spec.minAutonomy     }, // proxy until WAOE field exists
    { key: 'adoption',     historyField: 'adoptionScore', required: spec.minAdoption     },
    { key: 'governance',   historyField: 'trustScore',    required: spec.minGovernance   },
  ]

  const estimates: Array<{ key: string; daysNeeded: number }> = []

  for (const d of dimFields) {
    const gap = spec[`min${d.key.charAt(0).toUpperCase() + d.key.slice(1)}` as keyof LevelSpec] as number - dims[d.key]
    if (gap <= 0) continue

    const points = history.map((s: any, i: number) => ({
      x: (new Date(s.createdAt).getTime() - t0) / (1000 * 60 * 60 * 24),
      y: (s as any)[d.historyField] as number ?? 0,
    }))

    const n    = points.length
    const xBar = points.reduce((s, p) => s + p.x, 0) / n
    const yBar = points.reduce((s, p) => s + p.y, 0) / n
    let ssXY = 0, ssXX = 0
    for (const p of points) { ssXY += (p.x - xBar) * (p.y - yBar); ssXX += (p.x - xBar) ** 2 }
    const slope = ssXX > 0 ? ssXY / ssXX : 0

    if (slope <= 0) {
      estimates.push({ key: d.key, daysNeeded: 999 })
    } else {
      estimates.push({ key: d.key, daysNeeded: Math.round(gap / slope) })
    }
  }

  if (estimates.length === 0) return null

  const bottleneck = estimates.reduce((a, b) => a.daysNeeded > b.daysNeeded ? a : b)
  if (bottleneck.daysNeeded >= 999) return null

  // Recommendation execution rate modifier: up to 25% faster
  const recStats = await (prisma as any).adoptionEvent.count({
    where: { eventType: 'REC_ACTED' },
  }).catch(() => 0)
  const ignoredStats = await (prisma as any).adoptionEvent.count({
    where: { eventType: 'REC_IGNORED' },
  }).catch(() => 0)
  const totalRecs = recStats + ignoredStats
  const recExecRate = totalRecs > 0 ? recStats / totalRecs : 0.5
  const modifier = 1 - (recExecRate * 0.25)

  const adjustedDays   = Math.round(bottleneck.daysNeeded * modifier)
  const acceleratorDays = Math.round(bottleneck.daysNeeded - adjustedDays)

  return {
    days: Math.max(1, adjustedDays),
    bottleneckDimension: bottleneck.key,
    acceleratorDays,
  }
}

export async function computeEMI(): Promise<EMIResult> {
  const [gate8, history, snapshotCount, adoptionCount, recCount] = await Promise.all([
    computeGate8(),
    getGate8History(60) as Promise<any[]>,
    (prisma as any).gate8Snapshot.count().catch(() => 0),
    (prisma as any).adoptionEvent.count().catch(() => 0),
    (prisma as any).adoptionEvent.count({ where: { eventType: { in: ['REC_ACTED', 'REC_IGNORED'] } } }).catch(() => 0),
  ])

  const [governanceScore, autonomyScore] = await Promise.all([
    computeGovernanceDimension(gate8.trustScore),
    computeAutonomyDimension(),
  ])

  const dims: EMIDimensions = {
    intelligence: gate8.oisScore,
    autonomy:     autonomyScore,
    adoption:     gate8.adoptionScore,
    governance:   governanceScore,
  }

  const emiScore = clamp(
    dims.intelligence * 0.40 +
    dims.autonomy     * 0.25 +
    dims.adoption     * 0.20 +
    dims.governance   * 0.15
  )

  const level = classifyLevel(emiScore, dims)
  const spec  = LEVEL_SPECS[level]
  const { blockers, nextLevel } = buildBlockers(level, dims)

  // Deployment age from earliest snapshot
  const histArr = history as any[]
  const earliestSnapshot = histArr.length > 0 ? histArr[histArr.length - 1] : null
  const ageInDays = earliestSnapshot
    ? (Date.now() - new Date(earliestSnapshot.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    : 0

  const confidence = computeMaturityConfidence({
    ageInDays:                  Math.round(ageInDays),
    snapshotCount,
    adoptionEventCount:         adoptionCount,
    recommendationHistoryCount: recCount,
  })

  const timeToNextLevel = nextLevel
    ? await estimateTimeToNextLevel(nextLevel, dims, histArr)
    : null

  return {
    level,
    levelLabel:     spec.label,
    description:    spec.description,
    isProvisional:  confidence < 40,
    emiScore:       Math.round(emiScore * 10) / 10,
    confidence,
    dimensions: {
      intelligence: Math.round(dims.intelligence * 10) / 10,
      autonomy:     Math.round(dims.autonomy     * 10) / 10,
      adoption:     Math.round(dims.adoption     * 10) / 10,
      governance:   Math.round(dims.governance   * 10) / 10,
    },
    blockers,
    nextLevel,
    nextLevelLabel: nextLevel ? LEVEL_SPECS[nextLevel].label : null,
    timeToNextLevel,
    computedAt: new Date().toISOString(),
  }
}

// ─── COIG — Triple Number ─────────────────────────────────────────────────────

export interface COIGReport {
  current:          number   // OIS(now) - OIS(baseline)
  expected:         number   // forecast OIS - OIS(baseline)
  potential:        number   // OIS + all rec impacts - OIS(baseline)
  baselineOis:      number
  currentOis:       number
  baselineId:       string | null
  baselineDate:     string | null
  daysSinceBaseline: number
}

export async function computeCOIG(horizonDays = 30): Promise<COIGReport> {
  const [baseline, gate8, forecast, recs] = await Promise.all([
    (prisma as any).gate8Snapshot.findFirst({
      where:   { label: 'BASELINE' },
      orderBy: { createdAt: 'asc' },
      select:  { id: true, oisScore: true, createdAt: true },
    }).catch(() => null),
    computeGate8(),
    computeForecast(horizonDays),
    computeRecommendations(),
  ])

  const currentOis   = gate8.oisScore
  const baselineOis  = baseline?.oisScore ?? currentOis
  const baselineDate = baseline?.createdAt ? new Date(baseline.createdAt).toISOString() : null
  const daysSince    = baseline
    ? Math.round((Date.now() - new Date(baseline.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const totalRecImpact = recs.reduce((s, r) => s + r.oisImpact, 0)

  return {
    current:           Math.round((currentOis - baselineOis) * 10) / 10,
    expected:          Math.round((forecast.forecastOis - baselineOis) * 10) / 10,
    potential:         Math.round((currentOis + totalRecImpact - baselineOis) * 10) / 10,
    baselineOis:       Math.round(baselineOis * 10) / 10,
    currentOis:        Math.round(currentOis  * 10) / 10,
    baselineId:        baseline?.id ?? null,
    baselineDate,
    daysSinceBaseline: daysSince,
  }
}

// ─── Enterprise DNA ───────────────────────────────────────────────────────────

export async function computeAndSaveDNA(): Promise<unknown> {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
  const since = new Date(Date.now() - THIRTY_DAYS_MS)

  const [approvals, overrides, workflows, gate8] = await Promise.all([
    (prisma as any).kimmpApprovalRequest.findMany({
      where:  { createdAt: { gte: since } },
      select: { status: true, createdAt: true, updatedAt: true },
    }).catch(() => [] as any[]),
    (prisma as any).deploymentDecision.count({
      where: { emergencyOverride: true, evaluatedAt: { gte: since } },
    }).catch(() => 0),
    prisma.osWorkflowRun.count({ where: { startedAt: { gte: since } } }).catch(() => 0),
    computeGate8(),
  ])

  // Approval speed: median hours from createdAt to updatedAt on EXECUTED
  const executedApprovals = approvals.filter((a: any) => a.status === 'EXECUTED' && a.updatedAt)
  const avgHours = executedApprovals.length > 0
    ? executedApprovals.reduce((s: number, a: any) => {
        return s + (new Date(a.updatedAt).getTime() - new Date(a.createdAt).getTime()) / 3_600_000
      }, 0) / executedApprovals.length
    : null

  const approvalSpeed = avgHours == null ? 'MODERATE'
    : avgHours < 2    ? 'FAST'
    : avgHours < 12   ? 'MODERATE'
    : 'DELIBERATE'

  // Risk tolerance: ratio of approved vs rejected
  const totalApprovals = approvals.length
  const rejectedCount  = approvals.filter((a: any) => a.status === 'REJECTED').length
  const rejectionRate  = totalApprovals > 0 ? rejectedCount / totalApprovals : 0.3
  const riskTolerance  = rejectionRate < 0.10 ? 'AGGRESSIVE'
    : rejectionRate < 0.30 ? 'BALANCED'
    : 'CONSERVATIVE'

  // Escalation threshold: override rate
  const overrideRate  = totalApprovals > 0 ? overrides / totalApprovals : 0
  const escalation    = overrideRate > 0.15 ? 'QUICK' : overrideRate > 0.05 ? 'NORMAL' : 'PATIENT'

  // Dominant / weakest pillar from OIS
  const pillarScores = {
    decision:   gate8.decisionScore,
    enterprise: gate8.enterpriseScore,
    workflow:   gate8.workflowScore,
    goal:       gate8.goalScore,
    ai:         gate8.aiScore,
    business:   gate8.businessScore,
    trust:      gate8.trustScore,
    adoption:   gate8.adoptionScore,
  }
  const sorted = Object.entries(pillarScores).sort((a, b) => b[1] - a[1])
  const dominantPillar = sorted[0][0]
  const weakestPillar  = sorted[sorted.length - 1][0]

  // Growth phase from OIS range
  const growthPhase = gate8.oisScore > 75 ? 'OPTIMIZING'
    : gate8.oisScore > 50 ? 'SCALING'
    : 'BUILDING'

  // Delete old DNA and insert fresh
  await (prisma as any).enterpriseDNA.deleteMany({}).catch(() => null)

  return (prisma as any).enterpriseDNA.create({
    data: {
      approvalSpeed,
      riskTolerance,
      decisionStyle:       'DATA_DRIVEN',  // derived from WAANDA usage — fixed for now
      escalationThreshold: escalation,
      meetingDensity:      'MODERATE',     // would need calendar data to compute
      growthPhase,
      dominantPillar,
      weakestPillar,
    },
  })
}

export async function getDNA(): Promise<unknown> {
  return (prisma as any).enterpriseDNA.findFirst({
    orderBy: { computedAt: 'desc' },
  }).catch(() => null)
}

// ─── Enterprise Pulse ─────────────────────────────────────────────────────────

export async function computePulse(): Promise<{ sentence: string; updatedAt: string }> {
  const [gate8, history, recs] = await Promise.all([
    computeGate8(),
    getGate8History(7) as Promise<any[]>,
    computeRecommendations(),
  ])

  const histArr = history as any[]

  // Overall health label
  const oisLabel = gate8.oisScore >= 80 ? 'healthy' : gate8.oisScore >= 60 ? 'stable' : 'under pressure'

  // Biggest week-on-week mover (positive)
  const prevWeekSnapshot = histArr.find((s: any) => {
    const age = (Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    return age >= 6
  })

  let trendSentence = ''
  if (prevWeekSnapshot) {
    const pillarNames: Record<string, string> = {
      decision: 'Decision Intelligence', enterprise: 'Enterprise Health', workflow: 'Workflow Quality',
      goal: 'Goal Achievement', ai: 'AI Intelligence', business: 'Business Value',
      trust: 'Trust Intelligence', adoption: 'Platform Adoption',
    }
    const scoreFields: Record<string, string> = {
      decision: 'decisionScore', enterprise: 'enterpriseScore', workflow: 'workflowScore',
      goal: 'goalScore', ai: 'aiScore', business: 'businessScore',
      trust: 'trustScore', adoption: 'adoptionScore',
    }
    let biggestMover = { pillar: '', delta: 0 }
    for (const [key, field] of Object.entries(scoreFields)) {
      const prev  = (prevWeekSnapshot as any)[field] as number ?? 0
      const curr  = (gate8 as any)[`${key}Score`] as number ?? 0
      const delta = curr - prev
      if (Math.abs(delta) > Math.abs(biggestMover.delta)) {
        biggestMover = { pillar: pillarNames[key], delta: Math.round(delta * 10) / 10 }
      }
    }
    if (Math.abs(biggestMover.delta) > 1) {
      const dir = biggestMover.delta > 0 ? 'improved' : 'declined'
      trendSentence = ` ${biggestMover.pillar} has ${dir} ${Math.abs(biggestMover.delta)} points this week.`
    }
  }

  // Biggest blocker (weakest pillar)
  const bottleneck = recs.length > 0 ? recs[0] : null
  const bottleneckSentence = bottleneck
    ? ` ${bottleneck.pillar} remains the largest bottleneck.`
    : ''

  // Top recommendation
  const topRec = recs.length > 0 ? recs[0] : null
  const recSentence = topRec
    ? ` Completing Recommendation #1 is expected to raise OIS by ${topRec.oisImpact} points.`
    : ''

  const sentence = `Enterprise is ${oisLabel} at OIS ${gate8.oisScore}.${trendSentence}${bottleneckSentence}${recSentence}`

  return { sentence, updatedAt: new Date().toISOString() }
}

// ─── Customer Zero Report ─────────────────────────────────────────────────────

export async function computeCustomerZeroReport() {
  const [baseline, gate8, emi, coig, recs] = await Promise.all([
    (prisma as any).gate8Snapshot.findFirst({
      where:   { label: 'BASELINE' },
      orderBy: { createdAt: 'asc' },
    }).catch(() => null),
    computeGate8(),
    computeEMI(),
    computeCOIG(),
    computeRecommendations(),
  ])

  const definition = await getActiveDefinition()
  const bm = gate8.pillars.business.metrics

  return {
    organization:       'Kangqore Global',
    platform:           'Kangqore View Foundation + Professional Services Pack',
    periodStart:        baseline?.createdAt ?? null,
    periodEnd:          new Date().toISOString(),
    maturityBefore:     baseline ? 'L2' : null,  // will be accurate once we have baseline EMI stored
    maturityAfter:      emi.level,
    oisBefore:          baseline?.oisScore ?? null,
    oisAfter:           gate8.oisScore,
    coig:               coig.current,
    coigExpected:       coig.expected,
    coigPotential:      coig.potential,
    hoursSaved:         bm.estimatedHoursSaved ?? 0,
    automationCoverage: bm.automationCoveragePct ?? 0,
    workflowsCompleted: bm.totalWorkflowsCompleted ?? 0,
    manualEliminated:   bm.manualTasksEliminated ?? 0,
    goalProgress: definition?.goals?.map((g: any) => ({
      label:    g.label,
      target:   g.target,
      unit:     g.unit,
    })) ?? [],
    topRecommendations: recs.slice(0, 3).map(r => ({ action: r.action, oisImpact: r.oisImpact })),
    verifiedBy:         'Gate 8 OIS Engine + COIG Methodology (COM v1.0)',
    generatedAt:        new Date().toISOString(),
  }
}

// ─── Customer Zero Platform Activity ─────────────────────────────────────────
// Operational telemetry: raw counts from all active platform tables.
// This is the health monitor — how much real work has run through the OS.

export async function computePlatformActivity() {
  const now        = new Date()
  const h24ago     = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const h48ago     = new Date(now.getTime() - 48 * 60 * 60 * 1000)
  const d7ago      = new Date(now.getTime() -  7 * 24 * 60 * 60 * 1000)
  const d14ago     = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const [
    missionsLast24h,
    missionsPrior24h,
    decisionsLast7d,
    decisionsPrior7d,
    evidenceLast7d,
    evidencePrior7d,
    simulationsLast7d,
    simulationsPrior7d,
    // Totals
    missionsExecuted,
    executiveDecisions,
    simulationRuns,
    waandaSessions,
    evidenceCaptured,
    tasksCompleted,
    acceptedDispatches,
    projectsCreated,
    commandsExecuted,
    optimizationRuns,
  ] = await Promise.all([
    (prisma as any).kimmpSystemDispatch.count({ where: { createdAt: { gte: h24ago } } }).catch(() => 0),
    (prisma as any).kimmpSystemDispatch.count({ where: { createdAt: { gte: h48ago, lt: h24ago } } }).catch(() => 0),
    (prisma as any).kimmpDecision.count({ where: { status: { in: ['APPROVED', 'EXECUTED'] }, approvedAt: { gte: d7ago } } }).catch(() => 0),
    (prisma as any).kimmpDecision.count({ where: { status: { in: ['APPROVED', 'EXECUTED'] }, approvedAt: { gte: d14ago, lt: d7ago } } }).catch(() => 0),
    (prisma as any).kimmpSignal.count({ where: { createdAt: { gte: d7ago } } }).catch(() => 0),
    (prisma as any).kimmpSignal.count({ where: { createdAt: { gte: d14ago, lt: d7ago } } }).catch(() => 0),
    (prisma as any).enterpriseTwinScenario.count({ where: { createdAt: { gte: d7ago } } }).catch(() => 0),
    (prisma as any).enterpriseTwinScenario.count({ where: { createdAt: { gte: d14ago, lt: d7ago } } }).catch(() => 0),
    (prisma as any).kimmpSystemDispatch.count().catch(() => 0),
    (prisma as any).kimmpDecision.count({ where: { status: { in: ['APPROVED', 'EXECUTED'] } } }).catch(() => 0),
    (prisma as any).enterpriseTwinScenario.count().catch(() => 0),
    // WAANDA usage: WaandaRuntimeCall counts every AI activation through the runtime.
    // adoptionEvent(SESSION) is never auto-logged, so we use runtimeCalls as the proxy.
    (prisma as any).waandaRuntimeCall.count({ where: { createdAt: { gte: d7ago } } }).catch(() => 0),
    (prisma as any).kimmpSignal.count().catch(() => 0),
    (prisma as any).task.count({ where: { status: { in: ['done', 'completed', 'DONE', 'COMPLETED'] } } }).catch(() => 0),
    (prisma as any).kimmpSystemDispatch.count({ where: { status: 'ACCEPTED' } }).catch(() => 0),
    (prisma as any).project.count().catch(() => 0),
    (prisma as any).adoptionEvent.count({ where: { eventType: 'AGENT_INVOKE' } }).catch(() => 0),
    (prisma as any).adoptionEvent.count({ where: { eventType: 'WORKFLOW_TRIGGER' } }).catch(() => 0),
  ])

  const estimatedTimeSaved = Math.round(
    tasksCompleted * 1.5 + executiveDecisions * 0.5 + missionsExecuted * 0.25
  )

  const automationSuccess = missionsExecuted > 0
    ? Math.round((acceptedDispatches / missionsExecuted) * 100)
    : 0

  function trend(current: number, prior: number): { delta: number; direction: 'up' | 'down' | 'flat' } {
    const delta = current - prior
    return { delta, direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat' }
  }

  return {
    // Adoption funnel (velocity-first)
    missionsLast24h,
    missionsTrend:    trend(missionsLast24h, missionsPrior24h),
    decisionsLast7d,
    decisionsTrend:   trend(decisionsLast7d, decisionsPrior7d),
    evidenceCaptured,
    evidenceTrend:    trend(evidenceLast7d, evidencePrior7d),
    simulationRuns,
    simulationsTrend: trend(simulationsLast7d, simulationsPrior7d),
    estimatedTimeSaved,
    waandaSessions,
    // Supporting totals
    projectsCreated,
    tasksCompleted,
    missionsExecuted,
    executiveDecisions,
    commandsExecuted,
    optimizationRuns,
    automationSuccess,
  }
}

// ─── Enterprise Operating Pulse ───────────────────────────────────────────────
// Structured briefing that synthesises adoption metrics into:
//   summary             — one honest sentence
//   health              — deterministic classification (healthy / warning / critical)
//   confidence          — LLM self-reported certainty
//   drivers             — deterministic evidence list (why WAANDA reached this conclusion)
//   recommendedAction   — single next action if health is not healthy
//
// The evidence layer is deterministic so "why did WAANDA say that?" is always answerable.
// The sentence and recommendation use Claude Haiku for natural language synthesis.
// Cache invalidates on high-impact events (see invalidatePulseCache).

export interface PulseDriver {
  metric:  string
  value:   string | number
  signal:  'positive' | 'negative' | 'neutral'
}

export interface EnterprisePulse {
  summary:           string
  health:            'healthy' | 'warning' | 'critical'
  confidence:        number
  generatedAt:       string
  drivers:           PulseDriver[]
  recommendedAction: string | null
}

type ActivitySnapshot = Awaited<ReturnType<typeof computePlatformActivity>>

// Build the evidence list deterministically — no LLM, always explainable
function buildDrivers(a: ActivitySnapshot): PulseDriver[] {
  const drivers: PulseDriver[] = []

  // Mission activity
  if (a.missionsLast24h === 0) {
    drivers.push({ metric: 'Daily Active Missions', value: 0, signal: 'negative' })
  } else {
    drivers.push({
      metric: 'Daily Active Missions', value: a.missionsLast24h,
      signal: a.missionsTrend.direction === 'up' ? 'positive' : a.missionsTrend.direction === 'down' ? 'negative' : 'neutral',
    })
  }

  // Decision velocity
  if (a.decisionsLast7d === 0) {
    drivers.push({ metric: 'Executive Decisions (7d)', value: 0, signal: 'negative' })
  } else {
    drivers.push({
      metric: 'Executive Decisions (7d)', value: a.decisionsLast7d,
      signal: a.decisionsTrend.direction === 'up' ? 'positive' : a.decisionsTrend.direction === 'down' ? 'negative' : 'neutral',
    })
  }

  // Evidence growth
  if (a.evidenceTrend.delta !== 0) {
    drivers.push({
      metric: 'Evidence Generated (7d delta)', value: `${a.evidenceTrend.delta > 0 ? '+' : ''}${a.evidenceTrend.delta}`,
      signal: a.evidenceTrend.direction === 'up' ? 'positive' : a.evidenceTrend.direction === 'down' ? 'negative' : 'neutral',
    })
  }

  // Simulation activity
  if (a.simulationRuns > 0) {
    drivers.push({
      metric: 'Simulation Runs', value: a.simulationRuns,
      signal: a.simulationsTrend.direction === 'up' ? 'positive' : 'neutral',
    })
  }

  // Hours saved
  if (a.estimatedTimeSaved > 0) {
    drivers.push({ metric: 'Estimated Hours Saved', value: `${a.estimatedTimeSaved}h`, signal: 'positive' })
  }

  return drivers
}

// Deterministic health classification — LLM cannot override this
function classifyHealth(a: ActivitySnapshot): 'healthy' | 'warning' | 'critical' {
  const missionsDead   = a.missionsLast24h === 0
  const decisionsDead  = a.decisionsLast7d === 0
  const missionsFalling = a.missionsTrend.direction === 'down'
  const decisionsFalling = a.decisionsTrend.direction === 'down'

  if (missionsDead && decisionsDead) return 'critical'
  if (missionsDead || decisionsDead || (missionsFalling && decisionsFalling)) return 'warning'
  return 'healthy'
}

let _pulseCache: { pulse: EnterprisePulse; generatedAt: number } | null = null

// Call this when a high-impact event happens — forces the next request to regenerate
export function invalidatePulseCache(): void {
  _pulseCache = null
}

export async function generateOperatingPulse(activity: ActivitySnapshot): Promise<EnterprisePulse> {
  const now = Date.now()
  if (_pulseCache && now - _pulseCache.generatedAt < 60 * 60 * 1000) {
    return _pulseCache.pulse
  }

  const drivers   = buildDrivers(activity)
  const health    = classifyHealth(activity)
  const apiKey    = process.env.ANTHROPIC_API_KEY

  // Deterministic fallback when no API key — still structured and useful
  if (!apiKey) {
    const pulse: EnterprisePulse = {
      summary:           health === 'critical' ? 'No mission or decision activity detected in the current period.'
                       : health === 'warning'  ? 'Operational activity is below expected levels for this period.'
                       : 'Operational activity is within normal range.',
      health,
      confidence:        1.0,
      generatedAt:       new Date().toISOString(),
      drivers,
      recommendedAction: health === 'critical' ? 'Open Mission Control and run a KIMMP briefing to start the operational clock.'
                       : health === 'warning'  ? 'Review mission queue and ensure executive decisions are being routed through the OS.'
                       : null,
    }
    _pulseCache = { pulse, generatedAt: now }
    return pulse
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const { withKrisnam } = await import('../../../kangqore-immp/llm/krisnamAnthropic')
  const client = withKrisnam(new Anthropic({ apiKey }))

  const driverText = drivers.map(d => `  ${d.metric}: ${d.value} [${d.signal}]`).join('\n')
  const prompt = `Enterprise health classification: ${health.toUpperCase()}

Evidence:
${driverText}

Return ONLY a valid JSON object — no markdown, no preamble:
{
  "summary": "<one honest sentence, max 40 words, present tense, no preamble>",
  "confidence": <0.0-1.0 how certain you are based on the evidence>,
  "recommendedAction": "<single most important action, or null if health is healthy>"
}`

  try {
    const response = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 180,
      system:     'You are WAANDA — the Kangqore operating brain. Synthesise enterprise operational evidence into a structured JSON briefing. Be direct. If activity is absent, say so. If healthy, confirm it. Never invent data not in the evidence.',
      messages:   [{ role: 'user', content: prompt }],
    })
    const raw  = (response.content[0] as any)?.text?.trim() ?? ''
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '{}')

    const pulse: EnterprisePulse = {
      summary:           json.summary           ?? 'Operating state could not be assessed.',
      health,                                     // deterministic — LLM cannot override
      confidence:        Math.min(Math.max(Number(json.confidence ?? 0.8), 0), 1),
      generatedAt:       new Date().toISOString(),
      drivers,
      recommendedAction: json.recommendedAction  ?? null,
    }
    _pulseCache = { pulse, generatedAt: now }
    return pulse
  } catch {
    // JSON parse failed — return structured deterministic fallback
    const pulse: EnterprisePulse = {
      summary:           health === 'critical' ? 'No mission or decision activity detected.'
                       : health === 'warning'  ? 'Operational activity is below expected levels.'
                       : 'Operational activity is within normal range.',
      health,
      confidence:        0.75,
      generatedAt:       new Date().toISOString(),
      drivers,
      recommendedAction: health !== 'healthy' ? 'Review Mission Control and ensure KIMMP is receiving triggers.' : null,
    }
    _pulseCache = { pulse, generatedAt: now }
    return pulse
  }
}

// ─── COIG Week Report ─────────────────────────────────────────────────────────
// Week N milestone report for client leadership presentation.
// Surfaces OIS trajectory with maturity level framing.

const MATURITY_LEVELS = [
  { level: 'L1', label: 'Aware',      min: 0  },
  { level: 'L2', label: 'Managed',    min: 40 },
  { level: 'L3', label: 'Optimised',  min: 60 },
  { level: 'L4', label: 'Predictive', min: 75 },
  { level: 'L5', label: 'Adaptive',   min: 85 },
]

function getMaturityLevel(score: number) {
  const lvl = [...MATURITY_LEVELS].reverse().find(l => score >= l.min)
  return lvl ?? MATURITY_LEVELS[0]
}

export async function computeCoigWeekReport() {
  const [baseline, gate8, coig, emi] = await Promise.all([
    (prisma as any).gate8Snapshot.findFirst({
      where:   { label: 'BASELINE' },
      orderBy: { createdAt: 'asc' },
    }).catch(() => null),
    computeGate8(),
    computeCOIG(),
    computeEMI(),
  ])

  const baselineOis  = baseline?.oisScore ?? 0
  const baselineDate = baseline?.createdAt ? new Date(baseline.createdAt) : new Date()
  const daysSince    = Math.max(0, Math.round((Date.now() - baselineDate.getTime()) / (1000 * 60 * 60 * 24)))
  const weekNumber   = Math.ceil(daysSince / 7) || 1
  const currentOis   = gate8.oisScore
  const delta        = Math.round((currentOis - baselineOis) * 10) / 10

  const baseMaturity = getMaturityLevel(baselineOis)
  const currMaturity = getMaturityLevel(currentOis)
  const nextMaturity = MATURITY_LEVELS.find(l => l.min > currentOis) ?? null

  const milestoneReached = currMaturity.level !== baseMaturity.level

  let presentationSummary: string
  if (milestoneReached) {
    presentationSummary = `In ${daysSince} days (Week ${weekNumber}), OIS moved from ${Math.round(baselineOis)}/100 (${baseMaturity.label}) to ${currentOis}/100 (${currMaturity.label}). COIG delta: +${delta} points.`
  } else {
    presentationSummary = `Week ${weekNumber}: OIS at ${currentOis}/100 (+${delta} from Day 0 baseline of ${Math.round(baselineOis)}/100). Currently at ${currMaturity.label} maturity.`
  }

  return {
    weekNumber,
    daysSinceBaseline: daysSince,
    baseline: {
      oisScore:     Math.round(baselineOis * 10) / 10,
      date:         baselineDate.toISOString(),
      maturity:     baseMaturity.level,
      maturityLabel: baseMaturity.label,
    },
    current: {
      oisScore:     currentOis,
      date:         new Date().toISOString(),
      maturity:     currMaturity.level,
      maturityLabel: currMaturity.label,
      emiScore:     (emi as any).score ?? null,
    },
    coigDelta:     delta,
    coigExpected:  coig.expected,
    coigPotential: coig.potential,
    milestoneReached,
    milestoneLabel: milestoneReached ? `${currMaturity.level} — ${currMaturity.label}` : null,
    nextMilestone:  nextMaturity
      ? { level: nextMaturity.level, label: nextMaturity.label, gap: Math.round((nextMaturity.min - currentOis) * 10) / 10 }
      : null,
    presentationSummary,
    generatedAt: new Date().toISOString(),
  }
}

// ─── Onboarding Checklist ─────────────────────────────────────────────────────
// Tracks completion of the 10 deployment steps for a new client.
// Each step is checked against live DB state — no separate tracking table needed.

const NEXT_ACTION_MAP: Record<string, string> = {
  blueprint_imported:   'Import PS Pack at POST /admin/enterprise/blueprints/import',
  goals_configured:     'Configure goals at /admin/enterprise/definition',
  ontology_seeded:      'Seed entity types at /admin/ontology',
  policies_active:      'Enable policies at /admin/enterprise/policies',
  workflows_live:       'Activate workflows at /admin/kangqore-immp/workflows',
  agents_active:        'Configure agents at /admin/kangqore-immp/agents',
  baseline_set:         'Record OIS baseline at POST /admin/gate8/baseline',
  team_invited:         'Invite team members at /admin/users',
  first_project:        'Create the first project at /admin/pmo/projects',
  first_waanda_session: 'Run first WAANDA session at /waanda',
}

export async function computeOnboardingChecklist() {
  const [
    blueprint,
    definition,
    entityTypeCount,
    policyCount,
    workflowCount,
    baseline,
    agentCount,
    userCount,
    projectCount,
    sessionCount,
  ] = await Promise.all([
    prisma.enterpriseBlueprint.findFirst({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } }),
    prisma.enterpriseDefinition.findFirst({ where: { isActive: true }, include: { goals: true } }),
    prisma.ontologyObjectType.count(),
    prisma.enterprisePolicy.count({ where: { enabled: true } }),
    prisma.kimmpWorkflow.count({ where: { status: 'ACTIVE' } }),
    (prisma as any).gate8Snapshot.findFirst({ where: { label: 'BASELINE' } }).catch(() => null),
    (prisma as any).kimmpAgent.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
    (prisma as any).user.count().catch(() => 0),
    (prisma as any).project.count().catch(() => 0),
    (prisma as any).urgiSession.count().catch(() => 0),
  ])

  const goalCount = definition?.goals?.length ?? 0

  const steps = [
    {
      id: 'blueprint_imported', label: 'Blueprint imported',
      complete: blueprint !== null,
      completedAt: (blueprint as any)?.importedAt?.toISOString() ?? null,
      detail:   blueprint ? `${blueprint.name} v${blueprint.version}` : null,
    },
    {
      id: 'goals_configured', label: 'Goals configured (≥ 3)',
      complete: goalCount >= 3,
      detail:   `${goalCount} goals`, count: goalCount,
    },
    {
      id: 'ontology_seeded', label: 'Ontology entity types seeded (≥ 6)',
      complete: entityTypeCount >= 6,
      detail:   `${entityTypeCount} entity types`, count: entityTypeCount,
    },
    {
      id: 'policies_active', label: 'Policies active (≥ 3)',
      complete: policyCount >= 3,
      detail:   `${policyCount} policies`, count: policyCount,
    },
    {
      id: 'workflows_live', label: 'Workflows live (≥ 5)',
      complete: workflowCount >= 5,
      detail:   `${workflowCount} workflows`, count: workflowCount,
    },
    {
      id: 'agents_active', label: 'WAANDA agents active (≥ 5)',
      complete: agentCount >= 5,
      detail:   `${agentCount} agents`, count: agentCount,
    },
    {
      id: 'baseline_set', label: 'OIS Day 0 baseline recorded',
      complete: baseline !== null,
      completedAt: baseline?.createdAt ? new Date(baseline.createdAt).toISOString() : null,
      detail:   baseline ? `OIS = ${baseline.oisScore}/100` : null,
    },
    {
      id: 'team_invited', label: 'Team users invited (≥ 2)',
      complete: userCount >= 2,
      detail:   `${userCount} user(s)`, count: userCount,
    },
    {
      id: 'first_project', label: 'First project created',
      complete: projectCount >= 1,
      detail:   projectCount >= 1 ? `${projectCount} project(s)` : null, count: projectCount,
    },
    {
      id: 'first_waanda_session', label: 'First WAANDA session completed',
      complete: sessionCount >= 1,
      detail:   sessionCount >= 1 ? `${sessionCount} session(s)` : null, count: sessionCount,
    },
  ]

  const completedCount = steps.filter(s => s.complete).length
  const completionPct  = Math.round((completedCount / steps.length) * 100)
  const firstIncomplete = steps.find(s => !s.complete)

  return {
    steps,
    completedCount,
    totalSteps:   steps.length,
    completionPct,
    readyToGo:    completionPct >= 80,
    nextAction:   firstIncomplete ? NEXT_ACTION_MAP[firstIncomplete.id] : null,
    generatedAt:  new Date().toISOString(),
  }
}

// ─── Customer Success Platform ────────────────────────────────────────────────
// COIG per-deployment, deployment health scoring, renewal risk, QBR generation.
// Powers the retention engine: makes churn structurally difficult.

export async function listDeploymentHealth() {
  const blueprints = await prisma.enterpriseBlueprint.findMany({
    where:   { status: { in: ['ACTIVE', 'ARCHIVED'] } },
    orderBy: { importedAt: 'desc' },
    select:  { id: true, name: true, version: true, pack: true, industry: true, status: true, importedAt: true, deployedAt: true, gaps: true },
  })

  const [baseline, gate8] = await Promise.all([
    (prisma as any).gate8Snapshot.findFirst({ where: { label: 'BASELINE' }, orderBy: { createdAt: 'asc' } }).catch(() => null),
    computeGate8(),
  ])

  return blueprints.map(bp => {
    const gaps: any[] = Array.isArray((bp as any).gaps) ? (bp as any).gaps : []
    const highGaps    = gaps.filter((g: any) => g.severity === 'HIGH').length
    const deployedAt  = (bp as any).importedAt ?? (bp as any).deployedAt
    const daysSince   = deployedAt ? Math.round((Date.now() - new Date(deployedAt).getTime()) / 86_400_000) : null
    const weekNumber  = daysSince !== null ? Math.ceil(daysSince / 7) || 1 : null

    // Health heuristic: starts at 100, deducted by high gaps and age without activity
    let health = 100
    if (highGaps > 0) health -= highGaps * 10
    if (daysSince !== null && daysSince > 60 && gaps.length === 0) health -= 15
    health = Math.max(0, Math.min(100, health))

    let healthStatus: 'HEALTHY' | 'WATCH' | 'AT_RISK'
    if (health >= 75) healthStatus = 'HEALTHY'
    else if (health >= 50) healthStatus = 'WATCH'
    else healthStatus = 'AT_RISK'

    return {
      blueprintId:  bp.id,
      name:         bp.name,
      pack:         bp.pack,
      industry:     bp.industry,
      status:       bp.status,
      deployedAt:   deployedAt?.toISOString() ?? null,
      daysSince,
      weekNumber,
      health,
      healthStatus,
      gapCount:     gaps.length,
      highGapCount: highGaps,
      // OIS shown for own deployment only — multi-tenant will vary per schema
      oisScore:     bp.status === 'ACTIVE' ? gate8.oisScore : null,
      baselineOis:  bp.status === 'ACTIVE' ? (baseline?.oisScore ?? null) : null,
      coigDelta:    bp.status === 'ACTIVE' && baseline ? Math.round((gate8.oisScore - baseline.oisScore) * 10) / 10 : null,
    }
  })
}

export async function computeRenewalRisk(blueprintId: string) {
  const bp = await prisma.enterpriseBlueprint.findUnique({ where: { id: blueprintId } })
  if (!bp) throw new Error(`Blueprint ${blueprintId} not found`)

  const gaps: any[] = Array.isArray((bp as any).gaps) ? (bp as any).gaps : []
  const [baseline, gate8, coig, adoptionEvents] = await Promise.all([
    (prisma as any).gate8Snapshot.findFirst({ where: { label: 'BASELINE' }, orderBy: { createdAt: 'asc' } }).catch(() => null),
    computeGate8(),
    computeCOIG(),
    (prisma as any).adoptionEvent.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 86_400_000) } } }).catch(() => 0),
  ])

  const highGaps      = gaps.filter((g: any) => g.severity === 'HIGH').length
  const coigDelta     = coig.current
  const oisTrend      = gate8.oisScore - (baseline?.oisScore ?? gate8.oisScore)
  const adoptionLow   = adoptionEvents < 10

  // Risk factors (additive)
  const factors: Array<{ factor: string; weight: number; triggered: boolean }> = [
    { factor: 'High-severity gaps unresolved',   weight: 30, triggered: highGaps > 0 },
    { factor: 'Negative OIS trend',              weight: 25, triggered: oisTrend < -5 },
    { factor: 'COIG delta below 10 after Week 4',weight: 20, triggered: coigDelta < 10 },
    { factor: 'Low adoption (< 10 events/30d)',  weight: 15, triggered: adoptionLow },
    { factor: 'No gaps reported (silent client)', weight: 10, triggered: gaps.length === 0 && adoptionEvents < 5 },
  ]

  const riskScore = factors.reduce((sum, f) => sum + (f.triggered ? f.weight : 0), 0)

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  if      (riskScore >= 50) riskLevel = 'CRITICAL'
  else if (riskScore >= 30) riskLevel = 'HIGH'
  else if (riskScore >= 15) riskLevel = 'MEDIUM'
  else                      riskLevel = 'LOW'

  const triggeredFactors = factors.filter(f => f.triggered)
  const recommendations: string[] = []
  if (highGaps > 0)   recommendations.push(`Resolve ${highGaps} high-severity pack gap(s) to improve fit.`)
  if (oisTrend < -5)  recommendations.push('Schedule an OIS review session — platform intelligence is declining.')
  if (coigDelta < 10) recommendations.push('Accelerate workflow activation — COIG growth is below target trajectory.')
  if (adoptionLow)    recommendations.push('Run an adoption workshop — team engagement is below healthy levels.')

  return {
    blueprintId,
    blueprintName: bp.name,
    riskScore,
    riskLevel,
    triggeredFactors,
    recommendations,
    oisScore:    gate8.oisScore,
    coigDelta,
    adoptionLast30d: adoptionEvents,
    generatedAt: new Date().toISOString(),
  }
}

export async function generateQBR(blueprintId: string, clientName?: string, quarter?: string) {
  const bp = await prisma.enterpriseBlueprint.findUnique({ where: { id: blueprintId } })
  if (!bp) throw new Error(`Blueprint ${blueprintId} not found`)

  const [baseline, gate8, emi, coig, recs, definition, activity, renewal] = await Promise.all([
    (prisma as any).gate8Snapshot.findFirst({ where: { label: 'BASELINE' }, orderBy: { createdAt: 'asc' } }).catch(() => null),
    computeGate8(),
    computeEMI(),
    computeCOIG(),
    computeRecommendations(),
    prisma.enterpriseDefinition.findFirst({ where: { isActive: true }, include: { goals: true } }),
    computePlatformActivity(),
    computeRenewalRisk(blueprintId),
  ])

  const gaps: any[] = Array.isArray((bp as any).gaps) ? (bp as any).gaps : []
  const bm          = gate8.pillars.business.metrics as any
  const deployedAt  = (bp as any).importedAt ?? (bp as any).deployedAt
  const daysSince   = deployedAt ? Math.round((Date.now() - new Date(deployedAt).getTime()) / 86_400_000) : 0
  const weekNumber  = Math.ceil(daysSince / 7) || 1
  const quarterLabel = quarter ?? `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`

  return {
    meta: {
      clientName:   clientName ?? bp.name,
      pack:         bp.pack,
      industry:     bp.industry,
      quarter:      quarterLabel,
      weekInProgram: weekNumber,
      deployedAt:   deployedAt?.toISOString() ?? null,
      generatedAt:  new Date().toISOString(),
      verifiedBy:   'WAANDA Gate 8 + COIG Methodology (COM v1.0)',
    },
    executiveSummary: {
      oisBefore:       baseline?.oisScore ?? null,
      oisAfter:        gate8.oisScore,
      coigDelta:       coig.current,
      maturityBefore:  baseline ? getMaturityLevel(baseline.oisScore).label : null,
      maturityAfter:   getMaturityLevel(gate8.oisScore).label,
      hoursSaved:      bm?.estimatedHoursSaved ?? 0,
      automationPct:   bm?.automationCoveragePct ?? 0,
      workflowsRun:    bm?.totalWorkflowsCompleted ?? 0,
      renewalRisk:     renewal.riskLevel,
    },
    goals: (definition?.goals ?? []).map((g: any) => ({
      pillar:  g.pillar,
      label:   g.label,
      target:  g.target,
      unit:    g.unit,
    })),
    platform: {
      missionsExecuted:  (activity as any).missionsExecuted ?? 0,
      decisionsApproved: (activity as any).executiveDecisions ?? 0,
      sessionsRun:       (activity as any).waandaSessions ?? 0,
      signalsCaptured:   (activity as any).evidenceCaptured ?? 0,
    },
    packGaps: {
      total:       gaps.length,
      highSeverity: gaps.filter((g: any) => g.severity === 'HIGH').length,
      items:       gaps.slice(0, 5),
      packUpdateRecommended: gaps.some((g: any) => g.severity === 'HIGH'),
    },
    topRecommendations: recs.slice(0, 5).map((r: any) => ({ action: r.action, oisImpact: r.oisImpact, priority: r.priority })),
    renewalSignals: {
      riskLevel:       renewal.riskLevel,
      riskScore:       renewal.riskScore,
      keyFactors:      renewal.triggeredFactors.map((f: any) => f.factor),
      recommendations: renewal.recommendations,
    },
    nextQuarterObjectives: [
      `Reach OIS ${Math.min(100, Math.round(gate8.oisScore + 15))}/100`,
      `Complete ${Math.max(0, 10 - (recs.length))} outstanding WAANDA recommendations`,
      `Resolve ${gaps.filter((g: any) => g.severity === 'HIGH').length} high-priority pack gaps`,
      `Advance to ${getMaturityLevel(gate8.oisScore + 15).label} maturity`,
    ],
  }
}

