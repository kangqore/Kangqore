import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Assess data egress and export patterns — flag any unauthorised or anomalous data movement. Write 2 sentences, direct ADMIN status.'

export async function runDataMovementAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  const bySystem: Array<{ system: string | null; _count: { _all: number } }> =
    await (prisma as any).hanumanasAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { eventType: 'EGRESS', createdAt: { gte: last6h } },
      orderBy: { _count: { _all: 'desc' } },
    }).catch(() => [])

  const total       = bySystem.reduce((s, r) => s + r._count._all, 0)
  const systemMap   = Object.fromEntries(bySystem.map(s => [s.system ?? 'UNKNOWN', s._count._all]))
  const topSystem   = bySystem[0]
  const topShare    = topSystem && total > 0 ? (topSystem._count._all / total * 100).toFixed(1) : '0'
  const dominated   = topSystem && total > 0 && topSystem._count._all / total > 0.7

  const verdict = dominated ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'egress.data-movement',
    engine:   'EGRESS_CONTROL',
    verdict,
    summary:  `Data movement (6h): ${total} total EGRESS events across ${Object.keys(systemMap).length} systems.${dominated ? ` ${topSystem?.system} accounts for ${topShare}% of all outbound data movement.` : ''}`,
    findings: [
      `Total EGRESS events (6h): ${total}`,
      `Source systems: ${Object.keys(systemMap).length}`,
      ...Object.entries(systemMap).map(([sys, cnt]) => `${sys}: ${cnt} egress events (${total > 0 ? (cnt/total*100).toFixed(1) : 0}%)`),
    ],
    actions:  dominated ? [`${topSystem?.system} dominates egress — review data movement patterns for that system`] : [],
    metadata: { total, systemMap, topSystem: topSystem?.system ?? null, topShare: Number(topShare), dominated },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
