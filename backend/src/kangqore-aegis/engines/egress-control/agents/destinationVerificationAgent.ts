import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess data egress and export patterns — flag any unauthorised or anomalous data movement. Write 2 sentences, direct ADMIN status.'

export async function runDestinationVerificationAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  // Destinations are stored in metadata.destination — query raw metadata
  const events: Array<{ metadata: unknown; actor: string; system: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'EGRESS', createdAt: { gte: last6h } },
      select: { metadata: true, actor: true, system: true },
    }).catch(() => [])

  const total          = events.length
  const withDest       = events.filter(e => (e.metadata as any)?.destination)
  const withoutDest    = total - withDest.length
  const destinations   = [...new Set(withDest.map(e => (e.metadata as any).destination as string))]
  const coveragePct    = total > 0 ? (withDest.length / total * 100).toFixed(1) : '100'

  const verdict = withoutDest > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'egress.destination-verification',
    engine:   'EGRESS_CONTROL',
    verdict,
    summary:  withoutDest > 0
      ? `${withoutDest} of ${total} EGRESS events (6h) have no recorded destination — ${coveragePct}% destination coverage.`
      : total > 0
        ? `Destination verified on all ${total} EGRESS events (6h). ${destinations.length} unique destinations.`
        : `No EGRESS events in the last 6h.`,
    findings: [
      `Total EGRESS events (6h): ${total}`,
      `With destination metadata: ${withDest.length} (${coveragePct}%)`,
      `Without destination: ${withoutDest}`,
      `Unique destinations: ${destinations.slice(0, 10).join(', ')}`,
    ],
    actions:  withoutDest > 0
      ? [`${withoutDest} egress events lack destination metadata — add metadata.destination to KIMMP egress logging`]
      : [],
    metadata: { total, withDest: withDest.length, withoutDest, destinations, coveragePct: Number(coveragePct) },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
