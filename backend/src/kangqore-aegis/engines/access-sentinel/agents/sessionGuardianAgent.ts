import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

// More than this many denials from a single actor in 1h = anomalous
const BURST_THRESHOLD = 5

export async function runSessionGuardianAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last1h = new Date(Date.now() - 3_600_000)

  const denied: Array<{ actor: string; createdAt: Date }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'ACCESS_DENIED', createdAt: { gte: last1h } },
      select: { actor: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }).catch(() => [])

  // Count denials per actor
  const actorCount: Record<string, number> = {}
  for (const d of denied) {
    actorCount[d.actor] = (actorCount[d.actor] ?? 0) + 1
  }
  const burst = Object.entries(actorCount).filter(([, c]) => c >= BURST_THRESHOLD)

  const verdict = burst.length > 0 ? 'WARN' : denied.length > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'sentinel.session-guardian',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  burst.length > 0
      ? `Session anomaly: ${burst.length} actor(s) with ≥${BURST_THRESHOLD} access denials in the last 1h — possible session probing.`
      : `Session guard clean — ${denied.length} total denials (1h), no burst patterns.`,
    findings: [
      `Access denied events (1h): ${denied.length}`,
      ...Object.entries(actorCount).map(([a, c]) => `Actor ${a}: ${c} denials`),
      ...(burst.length > 0 ? burst.map(([a, c]) => `BURST: ${a} — ${c} denials in 1h`) : []),
    ],
    actions:  burst.map(([a]) => `Investigate ${a} — possible session probing or credential bruteforce`),
    metadata: { totalDenied: denied.length, actorCount, burstActors: burst.length },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
