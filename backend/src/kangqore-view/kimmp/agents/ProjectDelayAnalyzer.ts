// Phase 6 — Delay forecasting from real project state.
//
// The naive version of this feature is `if dueDate < now → late`. That only
// finds projects already failed. The point of the agentic pipeline is to catch
// projects that will miss, while there is still time to intervene.
//
// The forecast compares required velocity against observed velocity:
//   observed  = progress % achieved per day since the project started
//   required  = progress % still needed per day remaining
// When required materially exceeds observed, the project is forecast to slip,
// and the size of the gap gives the projected slip in days.
//
// Every number this module returns is derived from a column. Nothing is fixed.

import { prisma } from '../../../lib/prisma'

const DAY_MS = 86_400_000

export type RiskBand = 'OVERDUE' | 'CRITICAL' | 'AT_RISK' | 'WATCH' | 'ON_TRACK'

export interface ProjectForecast {
  projectId: string
  title: string
  status: string
  clientId: string
  dueDate: Date | null
  progress: number
  health: number

  daysElapsed: number
  daysRemaining: number | null
  /** Progress points per day achieved so far. */
  observedVelocity: number
  /** Progress points per day still required to finish on time. */
  requiredVelocity: number | null
  /** How many times faster the team must go than it has been. */
  velocityRatio: number | null
  /** Days past the due date the project is projected to finish. Negative = early. */
  projectedSlipDays: number | null
  forecastCompletion: Date | null

  riskBand: RiskBand
  /** 0–1, how confident the forecast is given how much evidence exists. */
  confidence: number
  reasons: string[]
}

function round(n: number, dp = 2): number {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

/**
 * Forecast one project. `now` is injectable so the analyzer is testable and
 * deterministic rather than depending on wall-clock time.
 */
export function forecastProject(
  p: {
    id: string
    title: string
    status: string
    clientId: string
    dueDate: Date | null
    progress: number | null
    health: number
    createdAt: Date
  },
  now: Date = new Date(),
): ProjectForecast {
  const progress = Math.max(0, Math.min(100, p.progress ?? 0))
  const daysElapsed = Math.max(1, Math.round((now.getTime() - p.createdAt.getTime()) / DAY_MS))
  const observedVelocity = round(progress / daysElapsed, 3)

  const reasons: string[] = []
  let daysRemaining: number | null = null
  let requiredVelocity: number | null = null
  let velocityRatio: number | null = null
  let projectedSlipDays: number | null = null
  let forecastCompletion: Date | null = null
  let riskBand: RiskBand = 'ON_TRACK'

  const remainingWork = 100 - progress

  if (!p.dueDate) {
    reasons.push('No due date set — cannot forecast a slip, only track velocity.')
    return {
      projectId: p.id, title: p.title, status: p.status, clientId: p.clientId,
      dueDate: null, progress, health: p.health,
      daysElapsed, daysRemaining: null, observedVelocity,
      requiredVelocity: null, velocityRatio: null, projectedSlipDays: null,
      forecastCompletion: null, riskBand: 'WATCH', confidence: 0.3, reasons,
    }
  }

  daysRemaining = Math.round((p.dueDate.getTime() - now.getTime()) / DAY_MS)

  // Days needed at the pace actually observed.
  const daysToFinishAtObserved =
    observedVelocity > 0 ? remainingWork / observedVelocity : Infinity

  if (Number.isFinite(daysToFinishAtObserved)) {
    forecastCompletion = new Date(now.getTime() + daysToFinishAtObserved * DAY_MS)
    projectedSlipDays = Math.round(daysToFinishAtObserved - daysRemaining)
  }

  if (remainingWork === 0) {
    riskBand = 'ON_TRACK'
    reasons.push('Progress is at 100%.')
  } else if (daysRemaining < 0) {
    riskBand = 'OVERDUE'
    reasons.push(`Due date passed ${Math.abs(daysRemaining)} day(s) ago with ${remainingWork}% of work outstanding.`)
  } else {
    requiredVelocity = daysRemaining > 0 ? round(remainingWork / daysRemaining, 3) : Infinity
    velocityRatio =
      observedVelocity > 0 && Number.isFinite(requiredVelocity)
        ? round(requiredVelocity / observedVelocity, 2)
        : null

    if (daysRemaining === 0) {
      riskBand = 'CRITICAL'
      reasons.push(`Due today with ${remainingWork}% outstanding.`)
    } else if (velocityRatio === null) {
      riskBand = 'AT_RISK'
      reasons.push('No measurable progress velocity yet — cannot sustain the required pace.')
    } else if (velocityRatio >= 3) {
      riskBand = 'CRITICAL'
      reasons.push(`Requires ${velocityRatio}× the delivery pace achieved so far (${requiredVelocity}%/day vs ${observedVelocity}%/day).`)
    } else if (velocityRatio >= 1.5) {
      riskBand = 'AT_RISK'
      reasons.push(`Requires ${velocityRatio}× the pace achieved so far to hit the date.`)
    } else if (velocityRatio >= 1.1) {
      riskBand = 'WATCH'
      reasons.push(`Slightly behind: needs ${velocityRatio}× current pace.`)
    } else {
      riskBand = 'ON_TRACK'
      reasons.push(`Current pace (${observedVelocity}%/day) covers the ${remainingWork}% remaining in ${daysRemaining} day(s).`)
    }
  }

  // Health is an independent signal; a low score corroborates a slip forecast.
  if (p.health < 70 && riskBand === 'ON_TRACK') {
    riskBand = 'WATCH'
    reasons.push(`Health score is ${p.health}, below the 70 threshold.`)
  } else if (p.health < 70) {
    reasons.push(`Health score ${p.health} corroborates the delivery risk.`)
  }

  // More elapsed history and more progress means a more trustworthy velocity.
  const evidence = Math.min(1, daysElapsed / 30) * 0.6 + Math.min(1, progress / 50) * 0.4
  const confidence = round(0.35 + evidence * 0.6, 2)

  return {
    projectId: p.id, title: p.title, status: p.status, clientId: p.clientId,
    dueDate: p.dueDate, progress, health: p.health,
    daysElapsed, daysRemaining, observedVelocity,
    requiredVelocity: Number.isFinite(requiredVelocity as number) ? requiredVelocity : null,
    velocityRatio, projectedSlipDays, forecastCompletion,
    riskBand, confidence, reasons,
  }
}

export const AT_RISK_BANDS: RiskBand[] = ['OVERDUE', 'CRITICAL', 'AT_RISK']

export const ProjectDelayAnalyzer = {
  forecastProject,

  /** Forecast every active project, newest deadlines first. */
  async forecastAll(now: Date = new Date()): Promise<ProjectForecast[]> {
    const projects = await prisma.project.findMany({
      where: { status: { notIn: ['COMPLETED', 'ARCHIVED'] as any } },
      select: {
        id: true, title: true, status: true, clientId: true,
        dueDate: true, progress: true, health: true, createdAt: true,
      },
    })

    return projects
      .map(p => forecastProject({ ...p, status: String(p.status) }, now))
      .sort((a, b) => {
        const order = ['OVERDUE', 'CRITICAL', 'AT_RISK', 'WATCH', 'ON_TRACK']
        const d = order.indexOf(a.riskBand) - order.indexOf(b.riskBand)
        if (d !== 0) return d
        return (b.projectedSlipDays ?? 0) - (a.projectedSlipDays ?? 0)
      })
  },

  /** Only the projects that will miss, or already have. */
  async findAtRisk(now: Date = new Date()): Promise<ProjectForecast[]> {
    const all = await this.forecastAll(now)
    return all.filter(f => AT_RISK_BANDS.includes(f.riskBand))
  },

  /**
   * Root causes, derived from the project's own records rather than asserted.
   * Looks at open risks, unstarted deliverables, and overdue tasks.
   */
  async diagnose(projectId: string) {
    const [risks, deliverables, tasks] = await Promise.all([
      prisma.risk.findMany({
        where: { projectId },
        select: { id: true, title: true, severity: true, status: true },
      }).catch(() => [] as any[]),
      prisma.deliverable.findMany({
        where: { projectId },
        select: { id: true, title: true, status: true, dueDate: true },
      }).catch(() => [] as any[]),
      prisma.task.findMany({
        where: { projectId },
        select: { id: true, title: true, status: true, dueDate: true },
      }).catch(() => [] as any[]),
    ])

    const now = new Date()
    const openRisks = risks.filter((r: any) => String(r.status).toUpperCase() !== 'CLOSED')
    const blockedDeliverables = deliverables.filter(
      (d: any) => !['COMPLETED', 'DELIVERED', 'APPROVED'].includes(String(d.status).toUpperCase()),
    )
    const overdueTasks = tasks.filter(
      (t: any) =>
        t.dueDate && new Date(t.dueDate) < now &&
        !['DONE', 'COMPLETED', 'CLOSED'].includes(String(t.status).toUpperCase()),
    )

    const causes: Array<{ factor: string; evidence: string; weight: number }> = []

    if (overdueTasks.length) {
      causes.push({
        factor: 'Overdue tasks blocking progress',
        evidence: `${overdueTasks.length} task(s) past their due date and not closed: ${overdueTasks.slice(0, 3).map((t: any) => t.title).join(', ')}`,
        weight: Math.min(1, overdueTasks.length / 5),
      })
    }
    if (openRisks.length) {
      const high = openRisks.filter((r: any) => ['HIGH', 'CRITICAL'].includes(String(r.severity).toUpperCase()))
      causes.push({
        factor: high.length ? 'Unmitigated high-severity risks' : 'Open risks on the project',
        evidence: `${openRisks.length} open risk(s)${high.length ? `, ${high.length} high/critical` : ''}: ${openRisks.slice(0, 3).map((r: any) => r.title).join(', ')}`,
        weight: high.length ? 0.9 : 0.4,
      })
    }
    if (blockedDeliverables.length) {
      causes.push({
        factor: 'Deliverables not yet completed',
        evidence: `${blockedDeliverables.length} of ${deliverables.length} deliverable(s) still open`,
        weight: deliverables.length ? blockedDeliverables.length / deliverables.length : 0.5,
      })
    }

    if (!causes.length) {
      causes.push({
        factor: 'No structured blocker recorded',
        evidence: 'The slip is visible in the velocity trend, but no risk, task, or deliverable explains it. The schedule itself may be unrealistic.',
        weight: 0.3,
      })
    }

    return {
      projectId,
      counts: {
        openRisks: openRisks.length,
        overdueTasks: overdueTasks.length,
        openDeliverables: blockedDeliverables.length,
        totalDeliverables: deliverables.length,
      },
      causes: causes.sort((a, b) => b.weight - a.weight),
    }
  },
}
