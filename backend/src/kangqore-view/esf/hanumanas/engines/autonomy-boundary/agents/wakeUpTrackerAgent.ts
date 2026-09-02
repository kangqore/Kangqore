import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess KIMMP autonomy boundary — whether autonomous AI behaviour is within acceptable limits. Write 2 sentences, direct and specific.'

export async function runWakeUpTrackerAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
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

  const llmSummary = await callLLM(SYSTEM, `KIMMP wake-up activations (7d): ${total} total — ${schedulerCount} scheduler-triggered, ${eventCount} event-triggered, ${adminCount} ADMIN-direct.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'autonomy.wake-up-tracker',
    engine:    'AUTONOMY_BOUNDARY',
    verdict:   total > 0 ? 'PASS' : 'INFO',
    summary:   llmSummary || `${total} activations (7d): ${schedulerCount} scheduler wake-ups, ${eventCount} event-triggered, ${adminCount} ADMIN-direct.`,
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
