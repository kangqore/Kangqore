import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Provide executive governance summaries — direct, no fluff, 2 sentences.'

const ESCALATION_HOURS = 6

export async function runEscalationAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start     = Date.now()
  const threshold = new Date(Date.now() - ESCALATION_HOURS * 3_600_000)

  const staleWarnings: Array<{ agentId: string; engine: string; summary: string; raisedAt: Date }> =
    await (prisma as any).hanumanasAgentRun.findMany({
      where:   { verdict: 'WARN', raisedAt: { lte: threshold } },
      orderBy: { raisedAt: 'desc' },
      take:    50,
      select:  { agentId: true, engine: true, summary: true, raisedAt: true },
    }).catch(() => [])

  // Keep only warnings with no subsequent PASS from the same agent
  const escalations: typeof staleWarnings = []
  for (const warn of staleWarnings) {
    const resolved = await (prisma as any).hanumanasAgentRun.findFirst({
      where: { agentId: warn.agentId, verdict: 'PASS', raisedAt: { gte: warn.raisedAt } },
    }).catch(() => null)
    if (!resolved) escalations.push(warn)
  }

  const verdict = escalations.length > 3 ? 'CRITICAL' : escalations.length > 0 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM, `HANUMANAS Escalation: ${escalations.length} unresolved WARN findings older than ${ESCALATION_HOURS}h. ${escalations.length > 0 ? `Affected agents: ${escalations.map(e => e.agentId).join(', ')}.` : 'All recent WARN findings resolved.'}\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'govops.escalation',
    engine:    'GOVERNANCE_OPS',
    verdict,
    summary:   escalations.length > 0
      ? `${escalations.length} unresolved WARN findings older than ${ESCALATION_HOURS}h require escalation.`
      : `No stale warnings. All recent WARN findings have been resolved.`,
    findings:  escalations.map(e => `${e.agentId} [${e.engine}]: ${e.summary?.slice(0, 90)}`),
    actions:   escalations.length > 0 ? ['Review and address the escalated warnings above'] : [],
    metadata:  { escalationCount: escalations.length, thresholdHours: ESCALATION_HOURS, escalations },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
