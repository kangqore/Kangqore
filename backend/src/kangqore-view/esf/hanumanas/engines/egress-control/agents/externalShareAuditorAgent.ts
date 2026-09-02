import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess data egress and export patterns — flag any unauthorised or anomalous data movement. Write 2 sentences, direct ADMIN status.'

// Only these actors may initiate egress of intelligence
const AUTHORIZED_EGRESS_ACTORS = new Set(['ADMIN', 'KIMMP', 'SCHEDULER', 'SYSTEM'])

export async function runExternalShareAuditorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  const events: Array<{ actor: string; system: string | null; assetId: string | null }> =
    await (prisma as any).hanumanasAuditLog.findMany({
      where:  { eventType: 'EGRESS', createdAt: { gte: last6h } },
      select: { actor: true, system: true, assetId: true },
    }).catch(() => [])

  const total       = events.length
  const unauthorized = events.filter(e => !AUTHORIZED_EGRESS_ACTORS.has(e.actor))

  const verdict = unauthorized.length > 0 ? 'CRITICAL' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'egress.external-share-auditor',
    engine:   'EGRESS_CONTROL',
    verdict,
    summary:  unauthorized.length > 0
      ? `CRITICAL: ${unauthorized.length} intelligence egress events from unauthorized actors (6h). Possible unauthorized data sharing.`
      : `External share audit clean — all ${total} EGRESS events (6h) from authorized actors.`,
    findings: [
      `Total EGRESS events (6h): ${total}`,
      `Authorized actors: ${[...AUTHORIZED_EGRESS_ACTORS].join(', ')}`,
      `Unauthorized egress events: ${unauthorized.length}`,
      ...unauthorized.map(e => `UNAUTHORIZED: actor=${e.actor}  system=${e.system}  asset=${e.assetId}`),
    ],
    actions:  unauthorized.length > 0
      ? ['CRITICAL: Unauthorized intelligence egress — identify and revoke actor access immediately']
      : [],
    metadata: { total, unauthorized: unauthorized.length, unauthorizedEvents: unauthorized },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
