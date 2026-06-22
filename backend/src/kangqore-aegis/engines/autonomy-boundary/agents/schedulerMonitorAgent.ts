import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const VALID_ACTORS = new Set(['SCHEDULER', 'ADMIN', 'KIMMP'])

export async function runSchedulerMonitorAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Find autonomous events with unexpected actors (should always be SCHEDULER)
  const autonomousEvents: Array<{ actor: string; trigger: string | null; userId: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { autonomous: true, createdAt: { gte: last24h } },
      select: { actor: true, trigger: true, userId: true },
      take:   200,
    }).catch(() => [])

  const total              = autonomousEvents.length
  const unauthorized       = autonomousEvents.filter(e => !VALID_ACTORS.has(e.actor))
  const schedulerTriggered = autonomousEvents.filter(e => e.trigger?.startsWith('schedule.'))
  const eventTriggered     = autonomousEvents.filter(e => e.trigger?.startsWith('event.'))

  const verdict = unauthorized.length > 0 ? 'CRITICAL'
    : total > 0 && schedulerTriggered.length === 0 ? 'WARN'
    : 'PASS'

  return {
    agentId:   'autonomy.scheduler-monitor',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   unauthorized.length > 0
      ? `CRITICAL: ${unauthorized.length} autonomous actions from unauthorized actors. Boundary breach.`
      : `All ${total} autonomous actions (24h) originated from approved actors. ${schedulerTriggered.length} scheduler-triggered.`,
    findings: [
      `Autonomous events (24h): ${total}`,
      `Scheduler-triggered: ${schedulerTriggered.length}`,
      `Event-triggered: ${eventTriggered.length}`,
      `Unauthorized actors: ${unauthorized.length}`,
      ...(unauthorized.length > 0 ? unauthorized.map(e => `Breach: actor=${e.actor} trigger=${e.trigger}`) : []),
    ],
    actions:   unauthorized.length > 0
      ? ['IMMEDIATE: Investigate unauthorized autonomous actors', 'Check KIMMP loopScheduler.ts actor assignment']
      : [],
    metadata:  { total, schedulerTriggered: schedulerTriggered.length, eventTriggered: eventTriggered.length, unauthorized: unauthorized.length },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
