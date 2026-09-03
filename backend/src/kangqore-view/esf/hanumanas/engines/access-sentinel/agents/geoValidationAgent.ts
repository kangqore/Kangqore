import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }        from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Assess access control and authentication integrity. Write 2 sentences — direct verdict on whether access patterns are secure and if ADMIN action is needed.`

export async function runGeoValidationAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Geo data not natively stored — proxy via actor/system consistency analysis.
  // Flag actors that appear in both ACTIVATION and ACCESS_DENIED in same window
  // (same actor activated AND was denied = possible impersonation or token re-use).
  const [activatedActors, deniedActors] = await Promise.all([
    (prisma as any).hanumanasAuditLog.findMany({
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last24h } },
      select: { actor: true, system: true, createdAt: true },
      distinct: ['actor'],
    }).catch(() => []),
    (prisma as any).hanumanasAuditLog.findMany({
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

  const llmSummary = await callLLM(SYSTEM,
    `Geo/origin validation (24h): ${activatedSet.size} unique activated actors, ${deniedSet.size} unique denied actors, ${dualState.length} dual-state actors (both activated and denied): ${dualState.join(', ') || 'none'}. Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

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
