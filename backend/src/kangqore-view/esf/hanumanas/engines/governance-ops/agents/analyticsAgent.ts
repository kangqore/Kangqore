import { prisma }   from '../../../../../../lib/prisma'
import { callLLM }  from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}. Analyse governance trends factually — be specific about direction and velocity of change.`

export async function runAnalyticsAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  const days: Array<{ date: string; critical: number; warn: number; pass: number }> = []
  for (let i = 6; i >= 0; i--) {
    const from = new Date(Date.now() - (i + 1) * 86_400_000)
    const to   = new Date(Date.now() - i       * 86_400_000)
    const [critical, warn, pass] = await Promise.all([
      (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'PASS',     raisedAt: { gte: from, lt: to } } }).catch(() => 0),
    ])
    days.push({ date: from.toISOString().slice(0, 10), critical, warn, pass })
  }

  const trendBlock = days.map(d => `${d.date}: ${d.pass}P/${d.warn}W/${d.critical}C`).join(', ')
  const totalCritical = days.reduce((s, d) => s + d.critical, 0)

  const narrative = await callLLM(
    SYSTEM,
    `HANUMANAS 7-day trend: ${trendBlock}\n\nWrite 2 sentences: trend direction and whether governance is improving, stable, or deteriorating.`,
    300,
  )

  return {
    agentId:   'govops.analytics',
    engine:    'GOVERNANCE_OPS',
    verdict:   'INFO',
    summary:   narrative || `7-day governance trend: ${trendBlock}`,
    findings:  days.map(d => `${d.date}: ${d.pass} PASS  ${d.warn} WARN  ${d.critical} CRITICAL`),
    actions:   totalCritical > 10 ? ['Consider increasing HANUMANAS scheduler frequency'] : [],
    metadata:  { days, totalCritical },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
