import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runLeakDetectionAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last1h = new Date(Date.now() - 3_600_000)

  // Look for EGRESS events on RESTRICTED assets — highest-risk leak signal
  const [egressEvents, restrictedEgress] = await Promise.all([
    (prisma as any).aegisAuditLog.count({
      where: { eventType: 'EGRESS', createdAt: { gte: last1h } },
    }).catch(() => 0),
    (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'EGRESS', classification: 'RESTRICTED', createdAt: { gte: last1h } },
      select: { assetId: true, actor: true, system: true, createdAt: true },
    }).catch(() => []) as Promise<Array<{ assetId: string | null; actor: string; system: string | null; createdAt: Date }>>,
  ])

  const restrictedCount = (restrictedEgress as any[]).length

  // Also look at rapid consecutive egress (any >5 events in 5 minutes = leak pattern)
  const recent5min: Array<{ createdAt: Date }> = await (prisma as any).aegisAuditLog.findMany({
    where:   { eventType: 'EGRESS', createdAt: { gte: new Date(Date.now() - 5 * 60_000) } },
    select:  { createdAt: true },
  }).catch(() => [])

  const rapidEgress = recent5min.length > 5

  const verdict = restrictedCount > 0 ? 'CRITICAL' : rapidEgress ? 'WARN' : egressEvents > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'egress.leak-detection',
    engine:   'EGRESS_CONTROL',
    verdict,
    summary:  restrictedCount > 0
      ? `CRITICAL LEAK RISK: ${restrictedCount} RESTRICTED intelligence assets egressed in the last 1h.`
      : rapidEgress
        ? `Rapid egress burst detected: ${recent5min.length} export events in the last 5 minutes.`
        : `Leak detection: ${egressEvents} EGRESS events (1h). No leak signatures detected.`,
    findings: [
      `Total EGRESS events (1h): ${egressEvents}`,
      `RESTRICTED asset egress (1h): ${restrictedCount}`,
      `Events in last 5 min: ${recent5min.length}`,
      ...((restrictedEgress as any[]).map((e: any) => `RESTRICTED: asset=${e.assetId}  actor=${e.actor}  system=${e.system}`)),
    ],
    actions:  restrictedCount > 0
      ? ['CRITICAL: RESTRICTED intelligence is leaving the system — investigate and revoke egress immediately']
      : rapidEgress ? ['Rapid egress burst — monitor for escalation and verify recipient authorization'] : [],
    metadata: { egressEvents, restrictedCount, rapidEgress, recent5min: recent5min.length },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
