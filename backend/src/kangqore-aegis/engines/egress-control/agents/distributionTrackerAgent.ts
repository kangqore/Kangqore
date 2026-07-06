import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess data egress and export patterns — flag any unauthorised or anomalous data movement. Write 2 sentences, direct ADMIN status.'

export async function runDistributionTrackerAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  const byActor: Array<{ actor: string; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['actor'],
      _count: { _all: true },
      where:  { eventType: 'EGRESS', createdAt: { gte: last6h } },
    }).catch(() => [])

  const bySystem: Array<{ system: string | null; _count: { _all: number } }> =
    await (prisma as any).aegisAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { eventType: 'EGRESS', createdAt: { gte: last6h } },
    }).catch(() => [])

  const total        = byActor.reduce((s, r) => s + r._count._all, 0)
  const uniqueActors = byActor.length
  const uniqueSystems = bySystem.length

  const verdict = uniqueActors > 5 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'egress.distribution-tracker',
    engine:   'EGRESS_CONTROL',
    verdict,
    summary:  `Intelligence distribution (6h): ${total} egress events across ${uniqueActors} actors and ${uniqueSystems} systems.${uniqueActors > 5 ? ` High distribution breadth — ${uniqueActors} distinct actors.` : ''}`,
    findings: [
      `Total EGRESS events (6h): ${total}`,
      `Unique distribution actors: ${uniqueActors}`,
      `Unique source systems: ${uniqueSystems}`,
      ...byActor.map(a => `Actor ${a.actor}: ${a._count._all} egress events`),
    ],
    actions:  uniqueActors > 5 ? ['High distribution breadth — verify all egress actors are authorized recipients'] : [],
    metadata: { total, uniqueActors, uniqueSystems },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
