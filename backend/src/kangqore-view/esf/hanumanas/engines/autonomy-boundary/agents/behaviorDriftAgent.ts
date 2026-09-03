import { prisma }   from '../../../../../../lib/prisma'
import { callLLM }  from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}. Analyse autonomous AI behaviour patterns for drift or instability — be precise and action-oriented.`

export async function runBehaviorDriftAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  const days: Array<{ date: string; autonomous: number; total: number }> = []
  for (let i = 6; i >= 0; i--) {
    const from = new Date(Date.now() - (i + 1) * 86_400_000)
    const to   = new Date(Date.now() - i       * 86_400_000)
    const [autonomous, total] = await Promise.all([
      (prisma as any).hanumanasAuditLog.count({ where: { autonomous: true, createdAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: from, lt: to } } }).catch(() => 0),
    ])
    days.push({ date: from.toISOString().slice(0, 10), autonomous, total })
  }

  const trendBlock = days.map(d => `${d.date}: ${d.autonomous}/${d.total} autonomous`).join(', ')
  const recent     = days.slice(-3).reduce((s, d) => s + d.autonomous, 0)
  const earlier    = days.slice(0,  3).reduce((s, d) => s + d.autonomous, 0)
  const drifting   = recent > earlier * 1.5 && earlier > 0

  const narrative = await callLLM(
    SYSTEM,
    `KIMMP autonomous behaviour 7-day trend: ${trendBlock}\n\nWrite 2 sentences: is behaviour stable or drifting, and what that means for ADMIN oversight.`,
    280,
  )

  const verdict = drifting ? 'WARN' : 'PASS'

  return {
    agentId:   'autonomy.behavior-drift',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   narrative || (drifting ? `Autonomous behaviour increasing: ${recent} recent vs ${earlier} earlier (3-day windows).` : `Autonomous behaviour stable over 7 days.`),
    findings:  days.map(d => `${d.date}: ${d.autonomous} autonomous / ${d.total} total activations`),
    actions:   drifting ? ['Autonomous activity increasing — review scheduler cadence and loop triggers'] : [],
    metadata:  { days, recent, earlier, drifting },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
