import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }        from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess access control and authentication integrity. Write 2 sentences — direct verdict on whether access patterns are secure and if ADMIN action is needed.'

export async function runAuthenticationAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  const [deniedTotal, deniedBySystem, activationCount] = await Promise.all([
    (prisma as any).aegisAuditLog
      .count({ where: { eventType: 'ACCESS_DENIED', createdAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { eventType: 'ACCESS_DENIED', createdAt: { gte: last6h } },
    }).catch(() => []) as Promise<Array<{ system: string | null; _count: { _all: number } }>>,
    (prisma as any).aegisAuditLog
      .count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last6h } } }).catch(() => 0),
  ])

  const systemMap = Object.fromEntries(
    (deniedBySystem as Array<{ system: string | null; _count: { _all: number } }>)
      .map(s => [s.system ?? 'UNKNOWN', s._count._all])
  )
  const denialRate = activationCount > 0 ? (deniedTotal / (activationCount + deniedTotal)) : 0
  const verdict    = deniedTotal > 20 ? 'CRITICAL' : deniedTotal > 5 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM,
    `Authentication audit (6h): ${activationCount} activations, ${deniedTotal} access denials, denial rate ${(denialRate * 100).toFixed(1)}%. Denials by system: ${Object.entries(systemMap).map(([s, c]) => `${s}:${c}`).join(', ') || 'none'}. Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

  return {
    agentId:  'sentinel.authentication',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  `Authentication audit (6h): ${deniedTotal} access denials across ${activationCount} activations. Denial rate: ${(denialRate * 100).toFixed(1)}%.`,
    findings: [
      `Activations (6h): ${activationCount}`,
      `Access denied (6h): ${deniedTotal}`,
      `Denial rate: ${(denialRate * 100).toFixed(1)}%`,
      ...Object.entries(systemMap).map(([sys, cnt]) => `System ${sys}: ${cnt} denials`),
    ],
    actions:  deniedTotal > 20
      ? ['CRITICAL: High authentication failure rate — investigate auth middleware and token validation']
      : deniedTotal > 5 ? ['Elevated auth failures — review recent access denial logs'] : [],
    metadata: { deniedTotal, activationCount, denialRate, systemMap },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
