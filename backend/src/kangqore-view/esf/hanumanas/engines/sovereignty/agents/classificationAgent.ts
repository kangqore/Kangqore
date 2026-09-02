import { HanumanasSovereignty } from '../../../hanumanasSovereignty.service'
import { prisma }            from '../../../../../../lib/prisma'
import { callLLM }           from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Assess intelligence sovereignty — ownership, custody, attribution, and approval chains for all knowledge assets. Flag any unapproved actors or breaches. Write 2 sentences.'

export async function runClassificationAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const summary = await HanumanasSovereignty.ownershipSummary()

  const restricted  = summary.restrictedAssets ?? 0
  const total       = summary.totalAssets ?? 0
  const byClass     = summary.byClassification as Record<string, number> ?? {}

  // Flag if RESTRICTED assets exist but there's been no EGRESS check recently
  const last24h     = new Date(Date.now() - 86_400_000)
  const recentEgress = restricted > 0
    ? await (prisma as any).hanumanasAuditLog
        .count({ where: { eventType: 'EGRESS', createdAt: { gte: last24h } } }).catch(() => 0)
    : 0

  const verdict = restricted > 0 && recentEgress === 0 ? 'WARN'
    : total > 0                                          ? 'PASS'
    : 'INFO'

  return {
    agentId:   'sovereignty.classification',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   `Classification coverage: ${Object.keys(byClass).join(', ')}. ${restricted} RESTRICTED assets. ${recentEgress} egress events in 24h.`,
    findings: [
      `Total assets: ${total}`,
      ...Object.entries(byClass).map(([cls, cnt]) => `${cls}: ${cnt} assets`),
      ...(restricted > 0 && recentEgress === 0 ? ['RESTRICTED assets present but no egress monitoring in 24h'] : []),
    ],
    actions:   restricted > 0 && recentEgress === 0
      ? ['Verify hanumanasEgressMonitor is active on KIMMP routes', 'Check /api/admin/aegis/egress for recent events']
      : [],
    metadata:  { total, restricted, byClassification: byClass, recentEgress },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
