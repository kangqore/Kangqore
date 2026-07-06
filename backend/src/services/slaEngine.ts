import { prisma } from '../lib/prisma'

// SLA resolution deadlines in milliseconds (calendar hours)
const SLA_MS: Record<string, number> = {
  P1: 1  * 3_600_000,   //  1 hour
  P2: 4  * 3_600_000,   //  4 hours
  P3: 8  * 3_600_000,   //  8 hours
  P4: 24 * 3_600_000,   // 24 hours
}

export function slaDeadline(priority: string, from = new Date()): Date {
  const ms = SLA_MS[priority] ?? SLA_MS['P3']
  return new Date(from.getTime() + ms)
}

export function slaStatus(deadline: Date | null): 'breached' | 'critical' | 'warning' | 'ok' | 'none' {
  if (!deadline) return 'none'
  const remaining = deadline.getTime() - Date.now()
  if (remaining <= 0)          return 'breached'
  if (remaining < 15 * 60_000) return 'critical'   // < 15 min
  if (remaining < 60 * 60_000) return 'warning'    // < 1 hour
  return 'ok'
}

export function slaRemainingLabel(deadline: Date | null): string {
  if (!deadline) return '—'
  const remaining = deadline.getTime() - Date.now()
  if (remaining <= 0) return 'BREACHED'
  const h = Math.floor(remaining / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

// Called by a scheduler — marks incidents whose SLA has breached and fires an AEGIS signal
export async function checkSlaBreaches(): Promise<number> {
  const now = new Date()

  const breached = await prisma.incident.findMany({
    where: {
      slaBreached: false,
      slaDeadline: { lt: now },
      status:      { notIn: ['RESOLVED', 'CLOSED'] },
    },
    select: { id: true, number: true, priority: true, title: true },
  })

  if (breached.length === 0) return 0

  // Batch-mark as breached
  await prisma.incident.updateMany({
    where: { id: { in: breached.map(i => i.id) } },
    data:  { slaBreached: true },
  })

  // Fire one AEGIS signal per breach
  await Promise.all(breached.map(inc =>
    (prisma as any).aegisAuditLog.create({
      data: {
        eventType: 'SLA_BREACH',
        system:    'ITIL',
        trigger:   `incident.sla_breach`,
        actor:     'SCHEDULER',
        autonomous: true,
        priority:  'CRITICAL',
        metadata:  { incidentId: inc.id, number: inc.number, incidentPriority: inc.priority, title: inc.title },
      },
    }).catch(() => null)
  ))

  return breached.length
}
