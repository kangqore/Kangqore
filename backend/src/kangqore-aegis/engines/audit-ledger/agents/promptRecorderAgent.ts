import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runPromptRecorderAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Proxy for LLM prompt recording: ACTIVATION events with agentsRun populated (means KIMMP ran agents)
  const [total, withAgents, autonomous] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h }, NOT: { agentsRun: { isEmpty: true } } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true,  createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const coverage = total > 0 ? Math.round((withAgents / total) * 100) : 100

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
