import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runActivityMonitorAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const bySystem: Array<{ system: string | null; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { autonomous: true, createdAt: { gte: last24h } },
    }).catch(() => [])

  const systemMap = Object.fromEntries(
    bySystem.map(s => [s.system ?? 'UNKNOWN', s._count._all])
  )
  const total = Object.values(systemMap).reduce((s, c) => s + c, 0)

  // Flag any system with disproportionate autonomous activity
  const highActivity = Object.entries(systemMap).filter(([_, cnt]) => cnt > 50)

  return {
    agentId:   'autonomy.activity-monitor',
    engine:    'AUTONOMY_BOUNDARY',
    verdict:   highActivity.length > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO',
    summary:   `${total} autonomous KIMMP actions (24h) across ${Object.keys(systemMap).length} systems.`,
    findings: [
      `Total autonomous actions (24h): ${total}`,
      ...Object.entries(systemMap).map(([sys, cnt]) => `${sys}: ${cnt} autonomous actions`),
      ...(highActivity.length > 0 ? highActivity.map(([sys, cnt]) => `HIGH: ${sys} has ${cnt} actions — review cadence`) : []),
    ],
    actions:   highActivity.map(([sys]) => `Review ${sys} autonomous cadence — consider throttling`),
    metadata:  { systemMap, total },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
