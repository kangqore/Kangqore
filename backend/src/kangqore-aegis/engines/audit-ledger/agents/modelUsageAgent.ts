import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Audit AI decision records, cost tracking, and execution ledger. Write 2 sentences — direct status for ADMIN.'

export async function runModelUsageAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last7d  = new Date(Date.now() - 7 * 86_400_000)

  // Proxy for model usage: activations by system (each system uses different models)
  const systemCounts: Array<{ system: string | null; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last7d } },
    }).catch(() => [])

  const bySystem = Object.fromEntries(
    systemCounts.map(s => [s.system ?? 'UNKNOWN', s._count._all])
  )
  const total = Object.values(bySystem).reduce((s, c) => s + c, 0)

  const llmSummary = await callLLM(SYSTEM, `AEGIS Model Usage (7d): ${total} KIMMP activations across ${Object.keys(bySystem).length} systems. Breakdown: ${Object.entries(bySystem).map(([sys, cnt]) => `${sys}=${cnt}`).join(', ')}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'audit.model-usage',
    engine:    'AUDIT_LEDGER',
    verdict:   'INFO',
    summary:   `${total} KIMMP activations (7d) across ${Object.keys(bySystem).length} systems. Model usage tracked via system attribution.`,
    findings: [
      `Total activations (7d): ${total}`,
      ...Object.entries(bySystem).map(([sys, cnt]) => `${sys ?? 'UNKNOWN'}: ${cnt} activations`),
      'Per-model token tracking: Phase 3 enhancement',
    ],
    actions:   [],
    metadata:  { bySystem, total, window: '7d' },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
