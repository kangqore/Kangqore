import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess policy compliance and enforcement. Flag violations, exceptions, and decisions requiring ADMIN review. Write 2 sentences, direct.'

export async function runPolicyEvaluatorAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)
  const prev24h = new Date(Date.now() - 2 * 86_400_000)

  const [current, previous, bySystem] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: prev24h, lt: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { eventType: 'POLICY_VIOLATION', createdAt: { gte: last24h } },
    }).catch(() => []) as Promise<Array<{ system: string | null; _count: { _all: number } }>>,
  ])

  const trend     = previous > 0 ? ((current - previous) / previous * 100).toFixed(1) : null
  const rising    = current > previous && previous > 0
  const systemMap = Object.fromEntries((bySystem as any[]).map((r: any) => [r.system ?? 'UNKNOWN', r._count._all]))

  const verdict = current > 5 ? 'CRITICAL' : current > 0 ? 'WARN' : 'PASS'

  return {
    agentId:  'policy.evaluator',
    engine:   'POLICY',
    verdict,
    summary:  current > 0
      ? `${current} policy violations in the last 24h (prev 24h: ${previous}).${rising ? ` RISING trend (+${trend}%).` : ''}`
      : `No policy violations in the last 24h. Previous period: ${previous}.`,
    findings: [
      `Policy violations (current 24h): ${current}`,
      `Policy violations (previous 24h): ${previous}`,
      trend ? `Trend vs prior period: ${trend}%` : 'No baseline (prev period empty)',
      ...Object.entries(systemMap).map(([sys, cnt]) => `System ${sys}: ${cnt} violations`),
    ],
    actions:  current > 5
      ? ['CRITICAL: Policy violation rate elevated — review all active governance rules']
      : current > 0 ? ['Investigate policy violations logged in audit ledger'] : [],
    metadata: { current, previous, trend, rising, systemMap },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
