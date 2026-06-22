import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

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
