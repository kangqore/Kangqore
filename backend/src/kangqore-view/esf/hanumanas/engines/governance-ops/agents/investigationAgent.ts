import { prisma }   from '../../../../../../lib/prisma'
import { callLLM }  from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS. Write concise governance investigation reports — what happened, what it means, what the ADMIN must do.'

export async function runInvestigationAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()

  const [recentEvents, activeWarnings] = await Promise.all([
    (prisma as any).aegisAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take:    10,
      select:  { eventType: true, system: true, trigger: true, actor: true, endpoint: true, createdAt: true },
    }).catch(() => []),
    (prisma as any).aegisAgentRun.findMany({
      where:   { verdict: { in: ['WARN', 'CRITICAL'] } },
      orderBy: { raisedAt: 'desc' },
      take:    5,
      select:  { agentId: true, verdict: true, summary: true, raisedAt: true },
    }).catch(() => []),
  ])

  const contextBlock = [
    `Trigger: ${ctx.trigger}`,
    `Recent ledger events:\n${(recentEvents as any[]).map((e: any) =>
      `  ${e.eventType} | ${e.system ?? e.endpoint ?? ''} | actor:${e.actor} | ${new Date(e.createdAt).toISOString()}`
    ).join('\n')}`,
    `Active WARN/CRITICAL:\n${(activeWarnings as any[]).map((r: any) =>
      `  ${r.agentId} [${r.verdict}]: ${r.summary?.slice(0, 80)}`
    ).join('\n')}`,
  ].join('\n\n')

  const narrative = await callLLM(
    SYSTEM,
    `AEGIS event triggered: ${ctx.trigger}\n\nContext:\n${contextBlock}\n\n` +
    `Write 3 sentences: what triggered this, what the context reveals, immediate ADMIN action required.`,
    400,
  )

  const result: AegisAgentResult = {
    agentId:   'govops.investigation',
    engine:    'GOVERNANCE_OPS',
    verdict:   'CRITICAL',
    summary:   narrative || `Investigation triggered by ${ctx.trigger}. ${recentEvents.length} recent events analysed.`,
    findings: [
      `Trigger: ${ctx.trigger}`,
      `Context events reviewed: ${(recentEvents as any[]).length}`,
      `Active warnings at trigger time: ${(activeWarnings as any[]).length}`,
    ],
    actions: [
      'Review the Shield tab for access patterns',
      'Check the Autonomy tab for recent autonomous actions',
      'Review the Policy tab for violation details',
    ],
    metadata:  { trigger: ctx.trigger, recentEvents, activeWarnings },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }

  // Sprint 6A — AEGIS → KIMMP: if investigation confirms multiple active threats,
  // summon KIMMP SENTINEL so the cognitive OS re-evaluates from the security lens.
  if ((activeWarnings as any[]).length >= 2 && narrative) {
    import('../../../../../../kangqore-immp/agents/systemDispatcher').then(({ KimmpSystemDispatcher }) => {
      KimmpSystemDispatcher.run('SENTINEL', {
        trigger: 'aegis.investigation.summons',
        input:   `AEGIS investigation completed. Threat summary: ${narrative.slice(0, 400)}`,
        userId:  ctx.userId ?? 'AEGIS',
        params:  { agentId: 'govops.investigation', activeWarnings: (activeWarnings as any[]).length },
      }).catch(() => {})
    }).catch(() => {})
  }

  return result
}
