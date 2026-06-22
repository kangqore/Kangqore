import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runAuthorizationAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  // Group denied events by actor + system to find repeated authorization failures
  const denied: Array<{ actor: string; system: string | null; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['actor', 'system'],
      _count: { _all: true },
      where:  { eventType: 'ACCESS_DENIED', createdAt: { gte: last6h } },
      orderBy: { _count: { _all: 'desc' } },
    }).catch(() => [])

  const repeatedViolators = denied.filter(d => d._count._all >= 3)
  const totalDenied       = denied.reduce((s, d) => s + d._count._all, 0)

  const verdict = repeatedViolators.length > 0 ? 'WARN' : totalDenied > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'sentinel.authorization',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  repeatedViolators.length > 0
      ? `${repeatedViolators.length} actor/system pair(s) with repeated authorization failures (≥3 denials in 6h).`
      : `Authorization clean — ${totalDenied} total denials (6h), no repeated violation patterns.`,
    findings: [
      `Total access denials (6h): ${totalDenied}`,
      ...denied.map(d => `${d.actor} → ${d.system ?? 'UNKNOWN'}: ${d._count._all} denials`),
      ...(repeatedViolators.length > 0 ? repeatedViolators.map(d => `REPEATED: ${d.actor} on ${d.system} (${d._count._all}×)`) : []),
    ],
    actions:  repeatedViolators.map(d => `Review authorization for ${d.actor} on ${d.system} — ${d._count._all} repeated failures`),
    metadata: { totalDenied, repeatedViolators: repeatedViolators.length, pairs: denied },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
