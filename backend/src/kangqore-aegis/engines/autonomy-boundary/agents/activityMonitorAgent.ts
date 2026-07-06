import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess KIMMP autonomy boundary — whether autonomous AI behaviour is within acceptable limits. Write 2 sentences, direct and specific.'

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
  const verdict = highActivity.length > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  const llmSummary = await callLLM(SYSTEM,
    `Autonomous activity monitor (24h): ${total} autonomous KIMMP actions across ${Object.keys(systemMap).length} systems. ${highActivity.length > 0 ? `High-activity systems: ${highActivity.map(([s, c]) => `${s}(${c})`).join(', ')}.` : 'No systems exceed the 50-action threshold.'} Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

  return {
    agentId:   'autonomy.activity-monitor',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   llmSummary || `${total} autonomous KIMMP actions (24h) across ${Object.keys(systemMap).length} systems.`,
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
