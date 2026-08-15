// Layer 1 — Descriptive Intelligence: "What is happening?"
//
// Pulls real-time signals from existing operational DB models and returns
// a structured snapshot across four domains:
//   projects    → delayed, at-risk, stalled
//   clients     → health tier, SLA breach, NPS deterioration
//   teams       → overloaded, under-allocated
//   sla         → active breaches, approaching thresholds

import { prisma } from '../../lib/prisma'

export interface ProjectSignal {
  id: string; title: string; clientId: string; clientName?: string
  status: string; progress: number; dueDate: Date | null
  health: number; daysUntilDue: number | null; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flag: string  // SHORT label: "OVERDUE" | "AT RISK" | "STALLED" | "ON TRACK"
  spend: number; budget: number
}

export interface ClientSignal {
  id: string; name: string; tier: string
  totalScore: number; oisDelta: number; npsScore: number | null
  renewalProximityDays: number; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flag: string
}

export interface TeamSignal {
  id: string; name: string; role: string; department: string
  utilization: number; availability: number; allocations: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flag: string
}

export interface SLASignal {
  id: string; metric?: string; title?: string
  priority?: string; customerId?: string
  breached: boolean; status: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flag: string
}

export interface DescriptiveSnapshot {
  projects:   ProjectSignal[]
  clients:    ClientSignal[]
  teams:      TeamSignal[]
  sla:        SLASignal[]
  summary: {
    criticalCount: number; highCount: number
    totalSignals: number; computedAt: string
  }
}

function daysBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 86_400_000
}

function projectSeverity(health: number, daysUntilDue: number | null): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (health < 40 || (daysUntilDue !== null && daysUntilDue < 0)) return 'CRITICAL'
  if (health < 60 || (daysUntilDue !== null && daysUntilDue < 7)) return 'HIGH'
  if (health < 75 || (daysUntilDue !== null && daysUntilDue < 21)) return 'MEDIUM'
  return 'LOW'
}

function clientSeverity(tier: string, oisDelta: number, renewalDays: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (tier === 'RED' || renewalDays < 30) return 'CRITICAL'
  if (tier === 'AMBER' || oisDelta < -10 || renewalDays < 60) return 'HIGH'
  if (tier === 'YELLOW' || oisDelta < -5 || renewalDays < 90) return 'MEDIUM'
  return 'LOW'
}

function teamSeverity(utilization: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (utilization >= 100) return 'CRITICAL'
  if (utilization >= 90)  return 'HIGH'
  if (utilization >= 80)  return 'MEDIUM'
  return 'LOW'
}

export const IntelligenceSignalEngine = {
  async computeDescriptive(): Promise<DescriptiveSnapshot> {
    const now = new Date()

    // ── Projects ───────────────────────────────────────────────────────────────
    const rawProjects = await prisma.project.findMany({
      where: { status: 'ACTIVE' },
      include: { client: { select: { name: true } } },
      orderBy: { health: 'asc' },
      take: 50,
    })

    const projectSignals: ProjectSignal[] = rawProjects
      .filter(p => p.health < 80 || (p.dueDate && daysBetween(now, p.dueDate) < 21))
      .map(p => {
        const daysUntilDue = p.dueDate ? daysBetween(now, p.dueDate) : null
        const severity = projectSeverity(p.health, daysUntilDue)
        let flag = 'AT RISK'
        if (daysUntilDue !== null && daysUntilDue < 0) flag = 'OVERDUE'
        else if ((p.progress ?? 0) < 5 && p.dueDate && daysBetween(now, p.dueDate) < 60) flag = 'STALLED'
        else if (daysUntilDue !== null && daysUntilDue < 7) flag = 'DEADLINE IMMINENT'
        return {
          id: p.id, title: p.title, clientId: p.clientId,
          clientName: (p as any).client?.name,
          status: p.status, progress: p.progress ?? 0,
          dueDate: p.dueDate, daysUntilDue: daysUntilDue ? Math.round(daysUntilDue) : null,
          health: p.health, severity, flag,
          spend: Number(p.spend ?? 0), budget: Number(p.budget ?? 0),
        }
      })
      .sort((a, b) => {
        const sev = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        return sev[a.severity] - sev[b.severity]
      })

    // ── Clients ────────────────────────────────────────────────────────────────
    const healthScores = await (prisma as any).customerHealthScore.findMany({
      where: { tier: { in: ['RED', 'AMBER', 'YELLOW'] } },
      orderBy: { totalScore: 'asc' },
      take: 30,
    })

    const clientMap = new Map<string, string>()
    if (healthScores.length > 0) {
      const clients = await (prisma as any).clientCRM.findMany({
        where: { id: { in: healthScores.map((h: any) => h.customerId) } },
        select: { id: true, companyName: true },
      })
      clients.forEach((c: any) => clientMap.set(c.id, c.companyName ?? c.id))
    }

    const clientSignals: ClientSignal[] = healthScores.map((h: any) => {
      const severity = clientSeverity(h.tier, h.oisDelta, h.renewalProximityDays)
      let flag = 'AT RISK'
      if (h.tier === 'RED' || h.renewalProximityDays < 30) flag = 'CHURN RISK'
      else if (h.oisDelta < -10) flag = 'OIS DECLINING'
      else if (h.npsScore !== null && h.npsScore < 6) flag = 'LOW NPS'
      return {
        id: h.customerId,
        name: clientMap.get(h.customerId) ?? h.customerId,
        tier: h.tier, totalScore: h.totalScore,
        oisDelta: h.oisDelta, npsScore: h.npsScore,
        renewalProximityDays: h.renewalProximityDays,
        severity, flag,
      }
    })

    // ── Teams ──────────────────────────────────────────────────────────────────
    const overloadedStaff = await prisma.staffMember.findMany({
      where: { utilization: { gt: 80 }, status: 'active' },
      include: { allocations: true },
      orderBy: { utilization: 'desc' },
      take: 20,
    })

    const teamSignals: TeamSignal[] = overloadedStaff.map(s => ({
      id: s.id, name: s.name, role: s.role, department: s.department,
      utilization: s.utilization, availability: s.availability,
      allocations: (s as any).allocations?.length ?? 0,
      severity: teamSeverity(s.utilization),
      flag: s.utilization >= 100 ? 'FULLY BOOKED' : s.utilization >= 90 ? 'OVERLOADED' : 'NEAR CAPACITY',
    }))

    // ── SLA ────────────────────────────────────────────────────────────────────
    const [openBreaches, clientSLAs] = await Promise.all([
      (prisma as any).slaIncident.findMany({
        where: { OR: [{ slaBreached: true, status: 'OPEN' }, { status: 'OPEN', priority: { in: ['P1', 'P2'] } }] },
        orderBy: { startedAt: 'asc' },
        take: 20,
      }),
      (prisma as any).clientSLA.findMany({
        where: { status: { notIn: ['GREEN', 'GOOD'] } },
        take: 20,
      }),
    ])

    const slaSignals: SLASignal[] = [
      ...openBreaches.map((i: any) => ({
        id: i.id, title: i.title, priority: i.priority, customerId: i.customerId,
        breached: i.slaBreached, status: i.status,
        severity: (i.slaBreached || i.priority === 'P1') ? 'CRITICAL' as const
          : i.priority === 'P2' ? 'HIGH' as const : 'MEDIUM' as const,
        flag: i.slaBreached ? 'SLA BREACHED' : 'OPEN INCIDENT',
      })),
      ...clientSLAs.map((s: any) => ({
        id: s.id, metric: s.metric, customerId: s.clientId,
        breached: s.current < s.target * 0.9, status: s.status,
        severity: s.current < s.target * 0.8 ? 'HIGH' as const : 'MEDIUM' as const,
        flag: 'SLA AT RISK',
      })),
    ]

    const all = [...projectSignals, ...clientSignals, ...teamSignals, ...slaSignals]
    const criticalCount = all.filter(s => s.severity === 'CRITICAL').length
    const highCount = all.filter(s => s.severity === 'HIGH').length

    return {
      projects: projectSignals,
      clients: clientSignals,
      teams: teamSignals,
      sla: slaSignals,
      summary: {
        criticalCount, highCount,
        totalSignals: all.length,
        computedAt: now.toISOString(),
      },
    }
  },
}
