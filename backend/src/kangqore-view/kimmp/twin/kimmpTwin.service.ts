import { prisma } from '../../../lib/prisma'
import { KimmpGoalEngine } from '../goals/kimmpGoal.service'
import { SignalLedger } from '../signals/signalLedger.service'
import logger from '../../../utils/logger'

export interface TwinSnapshot {
  id:                string
  revenueHealth:     number
  pipelineVelocity:  number
  executionCapacity: number
  riskExposure:      number
  marketPosition:    number
  overallScore:      number
  metadata:          Record<string, any>
  computedAt:        string
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

// ─── Dimension scorers ────────────────────────────────────────────────────────

async function scoreRevenue(): Promise<{ score: number; meta: Record<string, any> }> {
  try {
    const now          = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLast  = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLast    = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    const [mtdAgg, lastAgg, overdue] = await Promise.all([
      (prisma as any).invoice.aggregate({ where: { status: 'PAID', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      (prisma as any).invoice.aggregate({ where: { status: 'PAID', createdAt: { gte: startOfLast, lte: endOfLast } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      (prisma as any).invoice.count({ where: { status: 'OVERDUE' } }).catch(() => 0),
    ])

    const mtd  = Number(mtdAgg._sum?.amount  ?? 0) / 100
    const last = Number(lastAgg._sum?.amount ?? 0) / 100

    let score = 50
    if (last > 0) {
      const growth = (mtd - last) / last
      if      (growth >= 0.3)  score += 35
      else if (growth >= 0.15) score += 22
      else if (growth >= 0.05) score += 12
      else if (growth > 0)     score += 5
      else if (growth < -0.3)  score -= 35
      else if (growth < -0.15) score -= 22
      else if (growth < -0.05) score -= 12
      else                     score -= 5
    } else if (mtd > 0) {
      score = 60
    }
    score -= Math.min(overdue * 8, 25)
    return { score: clamp(score), meta: { mtd: Math.round(mtd), last: Math.round(last), overdueInvoices: overdue } }
  } catch {
    return { score: 50, meta: {} }
  }
}

async function scorePipeline(): Promise<{ score: number; meta: Record<string, any> }> {
  try {
    const since7d = new Date(Date.now() - 7 * 24 * 3600_000)
    const [leads, newLeads] = await Promise.all([
      (prisma as any).eqoreLead.findMany({
        where:  { status: { notIn: ['CLOSED_WON','CLOSED_LOST','DISQUALIFIED'] } },
        select: { leadScore: true, status: true },
      }).catch(() => []),
      (prisma as any).eqoreLead.count({ where: { createdAt: { gte: since7d } } }).catch(() => 0),
    ])

    const count    = (leads as any[]).length
    const avgScore = count > 0 ? (leads as any[]).reduce((s: number, l: any) => s + (l.leadScore ?? 0), 0) / count : 0
    const hotCount = (leads as any[]).filter((l: any) => l.status === 'HOT' || (l.leadScore ?? 0) >= 80).length

    let score = 25
    score += Math.min(count * 2, 25)
    score += Math.min((avgScore / 100) * 25, 25)
    score += Math.min(newLeads * 4, 15)
    score += Math.min(hotCount * 5, 15)

    return { score: clamp(score), meta: { activeleads: count, avgScore: Math.round(avgScore), newLeads7d: newLeads, hotLeads: hotCount } }
  } catch {
    return { score: 40, meta: {} }
  }
}

async function scoreExecution(): Promise<{ score: number; meta: Record<string, any> }> {
  try {
    const goals = await KimmpGoalEngine.list(20).catch(() => [])
    const active = (goals as any[]).filter(g => g.status === 'ACTIVE')

    if (!active.length) return { score: 40, meta: { activeGoals: 0 } }

    const avgProgress  = active.reduce((s: number, g: any) => s + (g.progressPct ?? 0), 0) / active.length
    const overdueGoals = active.filter((g: any) =>
      (g.tasks ?? []).some((t: any) => t.status === 'OVERDUE' || t.status === 'FAILED')
    ).length

    let score = 35
    score += Math.round(avgProgress * 0.5)       // max +50 from progress
    score += Math.min(active.length * 3, 15)     // bonus for having active goals
    score -= Math.min(overdueGoals * 12, 36)     // penalty for overdue

    return { score: clamp(score), meta: { activeGoals: active.length, avgProgress: Math.round(avgProgress), overdueGoals } }
  } catch {
    return { score: 50, meta: {} }
  }
}

async function scoreRisk(): Promise<{ score: number; meta: Record<string, any> }> {
  try {
    const since72h = new Date(Date.now() - 72 * 3600_000)
    // Scout signals use severity to mean "importance of the intelligence finding" — not business risk.
    // Operational and meta signals are also excluded:
    //   - SYSTEM_DISPATCH / LOOP_CASCADE_COMPLETED: HANUMANAS/loop lifecycle events
    //   - TWIN_DIMENSION_CRITICAL: twin self-assessment (feedback loop if counted)
    //   - PROACTIVE_ALERT: already counted separately via activeAlerts
    const EXCLUDED_MODULES = ['scout']
    const EXCLUDED_TYPES   = [
      'TWIN_DIMENSION_CRITICAL', 'TWIN_RECOMPUTE', 'TWIN_HEALTH_ALERT',
      'PROACTIVE_ALERT', 'SYSTEM_DISPATCH', 'LOOP_CASCADE_COMPLETED',
    ]
    const [critical, high, failedTasks, activeAlerts] = await Promise.all([
      (prisma as any).kimmpSignal.count({ where: { severity: 'CRITICAL', createdAt: { gte: since72h }, sourceModule: { notIn: EXCLUDED_MODULES }, signalType: { notIn: EXCLUDED_TYPES } } }).catch(() => 0),
      (prisma as any).kimmpSignal.count({ where: { severity: 'HIGH',     createdAt: { gte: since72h }, sourceModule: { notIn: EXCLUDED_MODULES }, signalType: { notIn: EXCLUDED_TYPES } } }).catch(() => 0),
      (prisma as any).kimmpGoalTask.count({ where: { status: { in: ['FAILED','OVERDUE'] } } }).catch(() => 0),
      (prisma as any).kimmpProactiveAlert.count({ where: { dismissed: false, severity: { in: ['HIGH','CRITICAL'] } } }).catch(() => 0),
    ])

    let score = 100
    score -= Math.min(critical * 18, 50)
    score -= Math.min(high * 8, 30)
    score -= Math.min(failedTasks * 5, 20)
    score -= Math.min(activeAlerts * 6, 18)

    return { score: clamp(score), meta: { criticalSignals: critical, highSignals: high, failedTasks, activeAlerts } }
  } catch {
    return { score: 70, meta: {} }
  }
}

async function scoreMarket(): Promise<{ score: number; meta: Record<string, any> }> {
  try {
    const since7d = new Date(Date.now() - 7 * 24 * 3600_000)
    const [opp, comp, tender, research] = await Promise.all([
      (prisma as any).kimmpSignal.count({ where: { signalCategory: 'OPPORTUNITY', createdAt: { gte: since7d } } }).catch(() => 0),
      (prisma as any).kimmpSignal.count({ where: { signalCategory: 'COMPETITOR',  createdAt: { gte: since7d } } }).catch(() => 0),
      (prisma as any).kimmpSignal.count({ where: { signalType: { contains: 'TENDER' }, createdAt: { gte: since7d } } }).catch(() => 0),
      (prisma as any).kimmpResearchResult.count({ where: { createdAt: { gte: since7d } } }).catch(() => 0),
    ])

    let score = 50
    score += Math.min(opp * 8, 28)
    score -= Math.min(comp * 6, 24)
    score += Math.min(tender * 14, 28)
    score += Math.min(research * 6, 12)

    return { score: clamp(score), meta: { opportunities: opp, competitors: comp, tenders: tender, researchRuns: research } }
  } catch {
    return { score: 50, meta: {} }
  }
}

// ─── Digital Twin Service ─────────────────────────────────────────────────────
export class KimmpDigitalTwin {

  static async compute(): Promise<TwinSnapshot> {
    const [rev, pipe, exec, risk, mkt] = await Promise.all([
      scoreRevenue(),
      scorePipeline(),
      scoreExecution(),
      scoreRisk(),
      scoreMarket(),
    ])

    const overall = clamp(
      Math.round(
        rev.score  * 0.25 +
        pipe.score * 0.20 +
        exec.score * 0.20 +
        risk.score * 0.20 +
        mkt.score  * 0.15
      )
    )

    const metadata = {
      revenue:   rev.meta,
      pipeline:  pipe.meta,
      execution: exec.meta,
      risk:      risk.meta,
      market:    mkt.meta,
    }

    const row = await (prisma as any).kimmpTwinSnapshot.create({
      data: {
        revenueHealth:     rev.score,
        pipelineVelocity:  pipe.score,
        executionCapacity: exec.score,
        riskExposure:      risk.score,
        marketPosition:    mkt.score,
        overallScore:      overall,
        metadata,
      },
    })

    // Emit a signal only when a dimension crosses into genuine danger (< 20)
    // and hasn't already been signalled for that dimension in the last 6 hours —
    // prevents a storm of repeated alerts while the score sits at its natural floor.
    const SIGNAL_THRESHOLD  = 20
    const DEDUP_WINDOW_MS   = 6 * 3600_000
    const since6h = new Date(Date.now() - DEDUP_WINDOW_MS)
    const dims = [
      { name: 'Revenue Health',      score: rev.score },
      { name: 'Pipeline Velocity',   score: pipe.score },
      { name: 'Execution Capacity',  score: exec.score },
      { name: 'Risk Exposure',       score: risk.score },
      { name: 'Market Position',     score: mkt.score },
    ]
    for (const d of dims) {
      if (d.score >= SIGNAL_THRESHOLD) continue
      const alreadySignalled = await (prisma as any).kimmpSignal.findFirst({
        where: {
          signalType:   'TWIN_DIMENSION_CRITICAL',
          sourceModule: 'kimmp',
          createdAt:    { gte: since6h },
          metadata:     { path: ['dimension'], equals: d.name },
        },
      }).catch(() => null)
      if (alreadySignalled) continue
      await SignalLedger.record({
        sourceModule:   'kimmp',
        signalType:     'TWIN_DIMENSION_CRITICAL',
        signalCategory: 'RISK',
        signalValue:    `Digital Twin: ${d.name} at ${d.score}/100 — critical threshold breached`,
        severity:       'HIGH',
        confidence:     90,
        metadata:       { dimension: d.name, score: d.score, snapshotId: row.id },
      }).catch(() => {})
    }

    logger.info(`[KIMMP:TWIN] Computed — overall ${overall} (REV:${rev.score} PIPE:${pipe.score} EXEC:${exec.score} RISK:${risk.score} MKT:${mkt.score})`)

    return {
      id:                row.id,
      revenueHealth:     rev.score,
      pipelineVelocity:  pipe.score,
      executionCapacity: exec.score,
      riskExposure:      risk.score,
      marketPosition:    mkt.score,
      overallScore:      overall,
      metadata,
      computedAt:        row.computedAt?.toISOString() ?? new Date().toISOString(),
    }
  }

  static async current(): Promise<TwinSnapshot | null> {
    const row = await (prisma as any).kimmpTwinSnapshot.findFirst({
      orderBy: { computedAt: 'desc' },
    }).catch(() => null)
    if (!row) return null
    return {
      id:                row.id,
      revenueHealth:     row.revenueHealth,
      pipelineVelocity:  row.pipelineVelocity,
      executionCapacity: row.executionCapacity,
      riskExposure:      row.riskExposure,
      marketPosition:    row.marketPosition,
      overallScore:      row.overallScore,
      metadata:          (row.metadata as Record<string, any>) ?? {},
      computedAt:        row.computedAt?.toISOString() ?? '',
    }
  }

  static async history(limit = 48): Promise<TwinSnapshot[]> {
    const rows = await (prisma as any).kimmpTwinSnapshot.findMany({
      orderBy: { computedAt: 'desc' },
      take:    Math.min(limit, 96),
    }).catch(() => [])
    return (rows as any[]).map(row => ({
      id:                row.id,
      revenueHealth:     row.revenueHealth,
      pipelineVelocity:  row.pipelineVelocity,
      executionCapacity: row.executionCapacity,
      riskExposure:      row.riskExposure,
      marketPosition:    row.marketPosition,
      overallScore:      row.overallScore,
      metadata:          (row.metadata as Record<string, any>) ?? {},
      computedAt:        row.computedAt?.toISOString() ?? '',
    }))
  }
}
