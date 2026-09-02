import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const VALID_ACTORS = new Set(['SCHEDULER', 'ADMIN', 'KIMMP'])

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Assess KIMMP autonomy boundary — whether autonomous AI behaviour is within acceptable limits. Write 2 sentences, direct and specific.`

export async function runSchedulerMonitorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Find autonomous events with unexpected actors (should always be SCHEDULER)
  const autonomousEvents: Array<{ actor: string; trigger: string | null; userId: string | null }> =
    await (prisma as any).hanumanasAuditLog.findMany({
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

  const llmSummary = await callLLM(SYSTEM, `Autonomous events (24h): ${total} total, ${schedulerTriggered.length} scheduler-triggered, ${eventTriggered.length} event-triggered, ${unauthorized.length} from unauthorized actors.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'autonomy.scheduler-monitor',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   llmSummary || (unauthorized.length > 0
      ? `CRITICAL: ${unauthorized.length} autonomous actions from unauthorized actors. Boundary breach.`
      : `All ${total} autonomous actions (24h) originated from approved actors. ${schedulerTriggered.length} scheduler-triggered.`),
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
