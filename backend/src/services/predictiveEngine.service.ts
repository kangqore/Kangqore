// Layer 2 — Predictive Intelligence: "What will happen?"
//
// Computes forward-looking probability scores from real operational data.
// No external ML model — uses first-principles velocity/trend mathematics
// against the data that already exists in the DB.

import { prisma } from '../lib/prisma'

export interface DeadlinePrediction {
  projectId: string; title: string; clientName?: string
  progress: number; daysLeft: number
  expectedProgress: number  // what progress should be by now
  progressDeficit: number   // expected - actual
  missProb: number          // 0–1
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
  estimatedCompletionDays: number | null  // days from now to 100% at current velocity
  velocityPerDay: number  // progress points per day
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface ChurnPrediction {
  customerId: string; customerName?: string
  renewalLikelihood: number  // 0–100
  riskFactors: string[]
  recommendedAction: string
  renewalProximityDays: number
  healthScore?: number; healthTier?: string
  daysUntilRenewal: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface OverloadPrediction {
  staffId: string; name: string; role: string; department: string
  currentUtilization: number
  projectedUtilization: number  // based on upcoming allocations
  upcomingAllocations: number
  hoursPerWeekCommitted: number
  riskWindow: string  // "next 2 weeks" etc.
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export interface BottleneckPrediction {
  entityId: string; entityType: 'ClientSLA' | 'Project' | 'StaffMember'
  name: string; metric?: string
  current: number; target: number
  deficitPct: number; trend: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  bottleneckType: string
}

export interface PredictiveSnapshot {
  deadlinePredictions:  DeadlinePrediction[]
  churnPredictions:     ChurnPrediction[]
  overloadPredictions:  OverloadPrediction[]
  bottlenecks:          BottleneckPrediction[]
  summary: {
    highRiskDeadlines: number; highRiskChurns: number
    overloadedStaff: number; activeBottlenecks: number
    computedAt: string
  }
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

function daysBetween(a: Date, b: Date) { return (b.getTime() - a.getTime()) / 86_400_000 }

export const PredictiveEngine = {
  async computePredictions(): Promise<PredictiveSnapshot> {
    const now = new Date()

    // ── Deadline miss predictions ─────────────────────────────────────────────
    const projects = await prisma.project.findMany({
      where: { status: 'ACTIVE', dueDate: { not: null, gt: new Date(now.getTime() - 86_400_000 * 30) } },
      include: { client: { select: { name: true } } },
      take: 100,
    })

    const deadlinePredictions: DeadlinePrediction[] = projects
      .filter(p => p.dueDate)
      .map(p => {
        const daysLeft = daysBetween(now, p.dueDate!)
        const totalDuration = daysBetween(p.createdAt, p.dueDate!)
        const elapsed = totalDuration - daysLeft
        const progress = p.progress ?? 0

        // Expected progress by now (linear baseline)
        const expectedProgress = totalDuration > 0
          ? clamp((elapsed / totalDuration) * 100, 0, 100) : 50
        const progressDeficit = expectedProgress - progress

        // Velocity: progress points per day elapsed
        const velocityPerDay = elapsed > 1 ? progress / elapsed : progress > 0 ? progress : 0.5
        const remaining = 100 - progress
        const estimatedCompletionDays = velocityPerDay > 0 ? remaining / velocityPerDay : null

        // Miss probability: sigmoid on how far behind schedule we are
        const deficit = progressDeficit / 100  // normalised 0–1
        const missProb = clamp(
          1 / (1 + Math.exp(-8 * (deficit - 0.25))),  // sigmoid centred at 25% deficit
          0, 0.98,
        )

        const severity: DeadlinePrediction['severity'] =
          missProb >= 0.8 ? 'CRITICAL' : missProb >= 0.6 ? 'HIGH'
          : missProb >= 0.35 ? 'MEDIUM' : 'LOW'

        const confidence: DeadlinePrediction['confidence'] =
          totalDuration > 30 && elapsed > 7 ? 'HIGH'
          : elapsed > 3 ? 'MEDIUM' : 'LOW'

        return {
          projectId: p.id, title: p.title,
          clientName: (p as any).client?.name,
          progress, daysLeft: Math.round(daysLeft), expectedProgress: Math.round(expectedProgress),
          progressDeficit: Math.round(progressDeficit),
          missProb: Math.round(missProb * 100) / 100,
          confidence, severity,
          estimatedCompletionDays: estimatedCompletionDays ? Math.round(estimatedCompletionDays) : null,
          velocityPerDay: Math.round(velocityPerDay * 10) / 10,
        }
      })
      .filter(p => p.missProb >= 0.3)
      .sort((a, b) => b.missProb - a.missProb)

    // ── Churn predictions ──────────────────────────────────────────────────────
    const renewals = await (prisma as any).renewalPrediction.findMany({
      where: { renewalLikelihood: { lt: 75 } },
      orderBy: { renewalLikelihood: 'asc' },
      take: 30,
    })

    const customerIds = renewals.map((r: any) => r.customerId)
    const [customers, healthScores]: [any[], any[]] = await Promise.all([
      customerIds.length > 0
        ? (prisma as any).clientCRM.findMany({ where: { id: { in: customerIds } }, select: { id: true, companyName: true } })
        : Promise.resolve([]),
      customerIds.length > 0
        ? (prisma as any).customerHealthScore.findMany({ where: { customerId: { in: customerIds } } })
        : Promise.resolve([]),
    ])
    const customerMap = new Map(customers.map((c: any) => [c.id, c.companyName ?? c.id]))
    const healthMap   = new Map(healthScores.map((h: any) => [h.customerId, h]))

    const churnPredictions: ChurnPrediction[] = renewals.map((r: any) => {
      const h = healthMap.get(r.customerId)
      const severity: ChurnPrediction['severity'] =
        r.renewalLikelihood < 30 ? 'CRITICAL'
        : r.renewalLikelihood < 50 ? 'HIGH'
        : r.renewalLikelihood < 65 ? 'MEDIUM' : 'LOW'
      return {
        customerId: r.customerId,
        customerName: customerMap.get(r.customerId),
        renewalLikelihood: r.renewalLikelihood,
        riskFactors: typeof r.riskFactors === 'object' ? Object.values(r.riskFactors as object) as string[] : [],
        recommendedAction: r.recommendedAction,
        renewalProximityDays: h?.renewalProximityDays ?? 365,
        healthScore: h?.totalScore, healthTier: h?.tier,
        daysUntilRenewal: h?.renewalProximityDays ?? 365,
        severity,
      }
    })

    // ── Overload predictions ───────────────────────────────────────────────────
    const twoWeeksOut = new Date(now.getTime() + 86_400_000 * 14)
    const staffAtRisk = await prisma.staffMember.findMany({
      where: { utilization: { gt: 70 }, status: 'active' },
      include: {
        allocations: {
          where: { endDate: { gte: now }, startDate: { lte: twoWeeksOut } },
        },
      },
      orderBy: { utilization: 'desc' },
      take: 20,
    })

    const overloadPredictions: OverloadPrediction[] = staffAtRisk.map(s => {
      const allocations = (s as any).allocations ?? []
      const totalHours = allocations.reduce((sum: number, a: any) => sum + (a.hoursPerWeek ?? 0), 0)
      const projectedUtilization = Math.round(clamp((totalHours / (s.availability || 40)) * 100, 0, 150))
      const severity: OverloadPrediction['severity'] =
        projectedUtilization >= 110 ? 'CRITICAL'
        : projectedUtilization >= 95 ? 'HIGH'
        : projectedUtilization >= 85 ? 'MEDIUM' : 'LOW'
      return {
        staffId: s.id, name: s.name, role: s.role, department: s.department,
        currentUtilization: s.utilization, projectedUtilization,
        upcomingAllocations: allocations.length,
        hoursPerWeekCommitted: Math.round(totalHours),
        riskWindow: 'Next 2 weeks',
        severity,
      }
    }).filter(o => o.severity !== 'LOW' || o.projectedUtilization > 80)

    // ── Bottleneck predictions ─────────────────────────────────────────────────
    const slaRisk = await (prisma as any).clientSLA.findMany({
      where: { status: { notIn: ['GREEN', 'GOOD'] } },
      take: 20,
    })

    const bottlenecks: BottleneckPrediction[] = slaRisk.map((s: any) => {
      const deficitPct = s.target > 0 ? ((s.target - s.current) / s.target) * 100 : 0
      const severity: BottleneckPrediction['severity'] =
        deficitPct >= 20 ? 'CRITICAL' : deficitPct >= 10 ? 'HIGH'
        : deficitPct >= 5 ? 'MEDIUM' : 'LOW'
      return {
        entityId: s.id, entityType: 'ClientSLA' as const,
        name: `${s.metric} SLA`, metric: s.metric,
        current: s.current, target: s.target,
        deficitPct: Math.round(deficitPct * 10) / 10,
        trend: s.trend ?? 'declining',
        severity, bottleneckType: 'SLA_PERFORMANCE',
      }
    })

    return {
      deadlinePredictions,
      churnPredictions,
      overloadPredictions,
      bottlenecks,
      summary: {
        highRiskDeadlines: deadlinePredictions.filter(d => d.severity !== 'LOW').length,
        highRiskChurns:    churnPredictions.filter(c => c.severity !== 'LOW').length,
        overloadedStaff:   overloadPredictions.length,
        activeBottlenecks: bottlenecks.length,
        computedAt: now.toISOString(),
      },
    }
  },
}
