import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS. Summarise the audit evidence package for an external compliance review.'

const EVENT_TYPES = ['ACTIVATION', 'AUTONOMOUS', 'POLICY_VIOLATION', 'ACCESS_DENIED', 'KNOWLEDGE_ASSET', 'EGRESS'] as const

export async function runEvidenceCollectionAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last30d = new Date(Date.now() - 30 * 86_400_000)

  const counts = await Promise.all(
    EVENT_TYPES.map(async et => ({
      type:  et,
      count: await (prisma as any).hanumanasAuditLog.count({ where: { eventType: et, createdAt: { gte: last30d } } }).catch(() => 0),
    }))
  )

  const total    = counts.reduce((s, c) => s + c.count, 0)
  const covered  = counts.filter(c => c.count > 0).length
  const coverage = Math.round((covered / EVENT_TYPES.length) * 100)

  const summaryBlock = counts.map(c => `${c.type}: ${c.count} events`).join(', ')
  const narrative    = await callLLM(
    SYSTEM,
    `30-day AEGIS audit evidence: ${summaryBlock}. Total events: ${total}. Coverage: ${covered}/${EVENT_TYPES.length} event types.\n\nWrite 2 sentences suitable for an external compliance auditor describing the completeness of this evidence package.`,
    300,
  )

  return {
    agentId:  'compliance.evidence',
    engine:   'TRUST_COMPLIANCE',
    verdict:  covered < EVENT_TYPES.length ? 'WARN' : 'PASS',
    summary:  narrative || `Evidence package (30d): ${total} events across ${covered}/${EVENT_TYPES.length} categories. Coverage: ${coverage}%.`,
    findings: counts.map(c => `${c.type}: ${c.count} events (${c.count > 0 ? '✓' : '✗ MISSING'})`),
    actions:  counts.filter(c => c.count === 0).map(c => `No ${c.type} events in 30d — verify KIMMP logging for this event type`),
    metadata: { framework: 'Multi-framework audit evidence', total, covered, coverage, counts },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
