import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }        from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess access control and authentication integrity. Write 2 sentences — direct verdict on whether access patterns are secure and if ADMIN action is needed.'

// Actors permitted to trigger KIMMP activations
const APPROVED_ACTORS = new Set(['ADMIN', 'SCHEDULER', 'KIMMP', 'SYSTEM'])

export async function runRoleValidatorAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const activations: Array<{ actor: string; system: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last24h } },
      select: { actor: true, system: true },
    }).catch(() => [])

  const denied = await (prisma as any).aegisAuditLog
    .count({ where: { eventType: 'ACCESS_DENIED', createdAt: { gte: last24h } } }).catch(() => 0)

  const unknown = activations.filter(a => !APPROVED_ACTORS.has(a.actor))
  const total   = activations.length

  const verdict = unknown.length > 0 ? 'CRITICAL' : denied > 5 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  const llmSummary = await callLLM(SYSTEM,
    `Role validator (24h): ${total} activations total, ${unknown.length} from unapproved actors, ${denied} access denials. Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

  return {
    agentId:  'sentinel.role-validator',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  unknown.length > 0
      ? `CRITICAL: ${unknown.length} activations from unapproved actors detected (24h). Possible role bypass.`
      : `${total} activations (24h) — all from approved actors. ${denied} access denials recorded.`,
    findings: [
      `Total activations (24h): ${total}`,
      `Access denied events (24h): ${denied}`,
      `Unapproved actor activations: ${unknown.length}`,
      ...unknown.map(u => `Unapproved actor: ${u.actor}  System: ${u.system ?? 'UNKNOWN'}`),
    ],
    actions:  unknown.length > 0
      ? ['CRITICAL: Investigate unapproved actor activations — check auth middleware immediately']
      : denied > 5 ? ['Elevated access denials — review shield logs'] : [],
    metadata: { total, denied, unknownActors: unknown.length, unapproved: unknown },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
