import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Audit AI decision records, cost tracking, and execution ledger. Write 2 sentences — direct status for ADMIN.'

export async function runPromptRecorderAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Proxy for LLM prompt recording: ACTIVATION events with agentsRun populated (means KIMMP ran agents)
  const [total, withAgents, autonomous] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h }, NOT: { agentsRun: { isEmpty: true } } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true,  createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const coverage = total > 0 ? Math.round((withAgents / total) * 100) : 100

  const llmSummary = await callLLM(SYSTEM, `AEGIS Prompt Recorder (24h): ${total} KIMMP activations. With agent roster recorded: ${withAgents} (${coverage}%). Autonomous activations: ${autonomous}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'audit.prompt-recorder',
    engine:    'AUDIT_LEDGER',
    verdict:   'INFO',
    summary:   `${withAgents}/${total} KIMMP activations (24h) have agent rosters recorded. ${autonomous} autonomous. Prompt recording: Phase 2 baseline active.`,
    findings: [
      `ACTIVATION events (24h): ${total}`,
      `With agent roster: ${withAgents} (${coverage}%)`,
      `Autonomous activations: ${autonomous}`,
      'Prompt-level recording (input/output capture): Phase 3 enhancement',
    ],
    actions:   coverage < 80 ? ['Review SystemDispatcher — ensure agentsRun is populated on every dispatch'] : [],
    metadata:  { total, withAgents, autonomous, coverage },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
