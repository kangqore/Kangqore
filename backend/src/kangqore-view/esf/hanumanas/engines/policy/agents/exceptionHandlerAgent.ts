import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Assess policy compliance and enforcement. Flag violations, exceptions, and decisions requiring ADMIN review. Write 2 sentences, direct.`

export async function runExceptionHandlerAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Exceptions = autonomous actions from KIMMP/SCHEDULER that didn't raise violations
  // but had characteristics that "should" be monitored — high priority + autonomous
  const exceptions: Array<{ actor: string; system: string | null; priority: string | null; trigger: string | null }> =
    await (prisma as any).hanumanasAuditLog.findMany({
      where: {
        eventType: 'ACTIVATION',
        autonomous: true,
        priority: 'HIGH',
        createdAt: { gte: last24h },
      },
      select: { actor: true, system: true, priority: true, trigger: true },
    }).catch(() => [])

  const total   = exceptions.length
  const systems = [...new Set(exceptions.map(e => e.system ?? 'UNKNOWN'))]

  return {
    agentId:  'policy.exception-handler',
    engine:   'POLICY',
    verdict:  total > 10 ? 'WARN' : total > 0 ? 'INFO' : 'PASS',
    summary:  `Exception tracking: ${total} autonomous HIGH-priority activations (24h) — these pass policy but warrant oversight. Systems involved: ${systems.join(', ') || 'none'}.`,
    findings: [
      `Autonomous HIGH-priority activations (24h): ${total}`,
      `Systems: ${systems.join(', ')}`,
      ...exceptions.slice(0, 5).map(e => `Actor: ${e.actor}  System: ${e.system}  Trigger: ${e.trigger}`),
    ],
    actions:  total > 10 ? ['High autonomous exception volume — review whether HIGH-priority autonomous scope is appropriate'] : [],
    metadata: { total, systems },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
