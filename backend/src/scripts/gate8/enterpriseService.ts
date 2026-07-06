import { PrismaClient } from '@prisma/client'
import { computeGate8, computeForecast, computeRecommendations, getGate8History } from './gate8Service'

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
    maturityAfter:      emi.levelLabel,
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
