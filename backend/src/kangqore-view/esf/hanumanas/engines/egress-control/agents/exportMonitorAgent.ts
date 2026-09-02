import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess data egress and export patterns — flag any unauthorised or anomalous data movement. Write 2 sentences, direct ADMIN status.'

const WARN_THRESHOLD     = 10
const CRITICAL_THRESHOLD = 50

export async function runExportMonitorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last1h = new Date(Date.now() - 3_600_000)

  const bySystem: Array<{ system: string | null; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { eventType: 'EGRESS', createdAt: { gte: last1h } },
    }).catch(() => [])

  const total     = bySystem.reduce((s, r) => s + r._count._all, 0)
  const systemMap = Object.fromEntries(bySystem.map(s => [s.system ?? 'UNKNOWN', s._count._all]))
  const highSystems = Object.entries(systemMap).filter(([, c]) => c > 20)

  const verdict = total >= CRITICAL_THRESHOLD ? 'CRITICAL' : total >= WARN_THRESHOLD ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'egress.export-monitor',
    engine:   'EGRESS_CONTROL',
    verdict,
    summary:  total >= CRITICAL_THRESHOLD
      ? `CRITICAL: ${total} intelligence egress events in the last 1h — far exceeds normal export volume.`
      : total >= WARN_THRESHOLD
        ? `Elevated export activity: ${total} EGRESS events in 1h across ${Object.keys(systemMap).length} systems.`
        : `Export monitor: ${total} EGRESS events (1h) — within normal range.`,
    findings: [
      `Total EGRESS events (1h): ${total}`,
      ...Object.entries(systemMap).map(([sys, cnt]) => `${sys}: ${cnt} exports`),
      ...(highSystems.length > 0 ? highSystems.map(([sys, cnt]) => `HIGH: ${sys} — ${cnt} exports in 1h`) : []),
    ],
    actions: total >= CRITICAL_THRESHOLD
      ? ['CRITICAL: Egress volume spike — investigate export origin and destination immediately']
      : total >= WARN_THRESHOLD ? ['Elevated egress — monitor for further escalation'] : [],
    metadata: { total, systemMap, thresholds: { warn: WARN_THRESHOLD, critical: CRITICAL_THRESHOLD } },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
