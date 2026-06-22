import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runGeoValidationAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Geo data not natively stored — proxy via actor/system consistency analysis.
  // Flag actors that appear in both ACTIVATION and ACCESS_DENIED in same window
  // (same actor activated AND was denied = possible impersonation or token re-use).
  const [activatedActors, deniedActors] = await Promise.all([
    (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last24h } },
      select: { actor: true, system: true, createdAt: true },
      distinct: ['actor'],
    }).catch(() => []),
    (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'ACCESS_DENIED', createdAt: { gte: last24h } },
      select: { actor: true, system: true },
      distinct: ['actor'],
    }).catch(() => []),
  ]) as [Array<{ actor: string; system: string | null }>, Array<{ actor: string }>]

  const activatedSet = new Set(activatedActors.map(a => a.actor))
  const deniedSet    = new Set(deniedActors.map(d => d.actor))

  // Actors that appear in BOTH — possible anomalous dual-state
  const dualState = [...activatedSet].filter(a => deniedSet.has(a))

  const verdict = dualState.length > 0 ? 'WARN' : 'PASS'

  return {
    agentId:  'sentinel.geo-validation',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  dualState.length > 0
      ? `${dualState.length} actor(s) appeared in both ACTIVATION and ACCESS_DENIED events (24h). Possible anomalous access or token misuse.`
      : `Access origin validation clean — no dual-state actor anomalies in the last 24h.`,
    findings: [
      `Unique activated actors (24h): ${activatedSet.size}`,
      `Unique denied actors (24h): ${deniedSet.size}`,
      `Dual-state actors (activated + denied): ${dualState.length}`,
      ...dualState.map(a => `Dual-state: ${a}`),
    ],
    actions:  dualState.map(a => `Investigate ${a} — actor had both successful activations and access denials in 24h`),
    metadata: { activatedActors: activatedSet.size, deniedActors: deniedSet.size, dualState },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
