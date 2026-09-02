import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }        from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess access control and authentication integrity. Write 2 sentences — direct verdict on whether access patterns are secure and if ADMIN action is needed.'

export async function runPermissionEvaluatorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  const byActor: Array<{ actor: string; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['actor'],
      _count: { _all: true },
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last6h } },
    }).catch(() => [])

  const PERMITTED = new Set(['ADMIN', 'SCHEDULER', 'KIMMP', 'SYSTEM'])
  const actorMap  = Object.fromEntries(byActor.map(a => [a.actor, a._count._all]))
  const total     = Object.values(actorMap).reduce((s, c) => s + c, 0)
  const violators = Object.entries(actorMap).filter(([a]) => !PERMITTED.has(a))

  const verdict = violators.length > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  const llmSummary = await callLLM(SYSTEM,
    `Permission evaluator (6h): ${total} activations, ${violators.length} from unpermitted actors. Actor breakdown: ${Object.entries(actorMap).map(([a, c]) => `${a}:${c}`).join(', ')}. Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

  return {
    agentId:  'sentinel.permission-evaluator',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  violators.length > 0
      ? `${violators.length} unpermitted actors triggered KIMMP activations (6h). Permission boundary may be breached.`
      : `Permission evaluation clean — all ${total} activations (6h) from permitted actors.`,
    findings: [
      `Total activations (6h): ${total}`,
      ...Object.entries(actorMap).map(([actor, cnt]) => `Actor ${actor}: ${cnt} activations`),
      ...(violators.length > 0 ? violators.map(([a, c]) => `UNPERMITTED: ${a} — ${c} activations`) : []),
    ],
    actions:  violators.map(([a]) => `Investigate actor "${a}" — not in approved permission set`),
    metadata: { actorMap, total, violators: violators.length },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
