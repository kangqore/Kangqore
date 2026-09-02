import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess KIMMP autonomy boundary — whether autonomous AI behaviour is within acceptable limits. Write 2 sentences, direct and specific.'

export async function runActionRecorderAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [total, withSystem, withDuration, withAgentsRun] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { autonomous: true, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { autonomous: true, NOT: { system:     null }, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { autonomous: true, NOT: { durationMs: null }, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { autonomous: true, NOT: { agentsRun: { isEmpty: true } }, createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const recordCompleteness = total > 0 ? Math.round(((withSystem + withDuration + withAgentsRun) / (total * 3)) * 100) : 100
  const verdict = recordCompleteness < 70 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM,
    `Action record completeness (24h): ${total} autonomous events. System field: ${withSystem}/${total}, durationMs: ${withDuration}/${total}, agentsRun: ${withAgentsRun}/${total}. Overall completeness: ${recordCompleteness}%. Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

  return {
    agentId:   'autonomy.action-recorder',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   llmSummary || `Autonomous action record completeness: ${recordCompleteness}% across ${total} autonomous events (24h).`,
    findings: [
      `Autonomous actions (24h): ${total}`,
      `With system: ${withSystem}/${total}`,
      `With durationMs: ${withDuration}/${total}`,
      `With agentsRun: ${withAgentsRun}/${total}`,
      `Record completeness: ${recordCompleteness}%`,
    ],
    actions:   recordCompleteness < 70
      ? ['Review loopScheduler.ts — ensure system, durationMs, agentsRun are recorded on autonomous runs']
      : [],
    metadata:  { total, withSystem, withDuration, withAgentsRun, recordCompleteness },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
