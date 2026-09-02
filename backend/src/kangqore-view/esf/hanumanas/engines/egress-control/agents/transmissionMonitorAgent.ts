import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess data egress and export patterns — flag any unauthorised or anomalous data movement. Write 2 sentences, direct ADMIN status.'

export async function runTransmissionMonitorAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last1h = new Date(Date.now() - 3_600_000)

  const events: Array<{
    actor: string; system: string | null; assetId: string | null;
    classification: string | null; createdAt: Date
  }> = await (prisma as any).aegisAuditLog.findMany({
    where:  { eventType: 'EGRESS', createdAt: { gte: last1h } },
    select: { actor: true, system: true, assetId: true, classification: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const total    = events.length
  const missing  = events.filter(e => !e.system || !e.assetId || !e.actor)
  const missingPct = total > 0 ? (missing.length / total * 100).toFixed(1) : '0'

  const verdict = missing.length > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'egress.transmission-monitor',
    engine:   'EGRESS_CONTROL',
    verdict,
    summary:  missing.length > 0
      ? `${missing.length} of ${total} EGRESS transmissions (1h) have incomplete metadata — ${missingPct}% without full traceability.`
      : `Transmission monitor: ${total} EGRESS events (1h) — all with complete metadata.`,
    findings: [
      `EGRESS transmissions (1h): ${total}`,
      `Complete metadata: ${total - missing.length}`,
      `Missing metadata: ${missing.length} (${missingPct}%)`,
      ...(missing.length > 0 ? [`Example: actor=${missing[0]?.actor}  system=${missing[0]?.system}  assetId=${missing[0]?.assetId}`] : []),
    ],
    actions:  missing.length > 0
      ? [`${missing.length} EGRESS events lack full metadata — ensure KIMMP logs system, actor, and assetId on every egress`]
      : [],
    metadata: { total, missing: missing.length, missingPct: Number(missingPct) },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
