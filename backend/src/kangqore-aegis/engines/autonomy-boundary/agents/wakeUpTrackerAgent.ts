import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runWakeUpTrackerAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const triggers: Array<{ trigger: string | null; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['trigger'],
      _count: { _all: true },
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last7d } },
    }).catch(() => [])

  const byTrigger: Record<string, number> = {}
  let schedulerCount = 0
  let eventCount     = 0
  let adminCount     = 0

  for (const t of triggers) {
    const trigger = t.trigger ?? 'unknown'
    byTrigger[trigger] = t._count._all
    if (trigger.startsWith('schedule.'))  schedulerCount += t._count._all
    else if (trigger.startsWith('event.')) eventCount    += t._count._all
    else                                   adminCount    += t._count._all
  }

  const total = schedulerCount + eventCount + adminCount

  return {
    agentId:   'autonomy.wake-up-tracker',
    engine:    'AUTONOMY_BOUNDARY',
    verdict:   total > 0 ? 'PASS' : 'INFO',
    summary:   `${total} activations (7d): ${schedulerCount} scheduler wake-ups, ${eventCount} event-triggered, ${adminCount} ADMIN-direct.`,
    findings: [
      `Total activations (7d): ${total}`,
      `Scheduler wake-ups (schedule.*): ${schedulerCount}`,
      `Event-triggered (event.*): ${eventCount}`,
      `ADMIN-direct: ${adminCount}`,
      ...Object.entries(byTrigger).map(([t, c]) => `  ${t}: ${c}`),
    ],
    actions:   [],
    metadata:  { byTrigger, schedulerCount, eventCount, adminCount, total },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
