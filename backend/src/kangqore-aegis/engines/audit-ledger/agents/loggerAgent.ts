import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Audit AI decision records, cost tracking, and execution ledger. Write 2 sentences — direct status for ADMIN.'

const EVENT_TYPES = ['ACTIVATION', 'AUTONOMOUS', 'ACCESS_DENIED', 'KNOWLEDGE_ASSET', 'EGRESS', 'POLICY_VIOLATION'] as const

export async function runLoggerAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last7d  = new Date(Date.now() - 7 * 86_400_000)
  const last24h = new Date(Date.now() - 86_400_000)

  const counts = await Promise.all(
    EVENT_TYPES.map(type =>
      (prisma as any).aegisAuditLog.count({ where: { eventType: type, createdAt: { gte: last7d } } }).catch(() => 0)
    )
  )

  const coverage = EVENT_TYPES.map((type, i) => ({ type, count: counts[i] }))
  const uncovered = coverage.filter(c => c.count === 0)
  const total24h  = await (prisma as any).aegisAuditLog
    .count({ where: { createdAt: { gte: last24h } } }).catch(() => 0)
  const total7d   = counts.reduce((s, c) => s + c, 0)

  const verdict = uncovered.length > 2 ? 'WARN' : uncovered.length > 0 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM, `AEGIS Audit Logger (7d): ${total7d} total events, ${total24h} in 24h. Event type coverage: ${coverage.map(c => `${c.type}=${c.count}`).join(', ')}. Uncovered types (zero entries): ${uncovered.length > 0 ? uncovered.map(c => c.type).join(', ') : 'none'}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'audit.logger',
    engine:    'AUDIT_LEDGER',
    verdict,
    summary:   uncovered.length > 0
      ? `${uncovered.length} event types have zero ledger entries in 7 days. Logging gaps detected.`
      : `All 6 AEGIS event types are actively logged. ${total7d} events in 7d, ${total24h} in 24h.`,
    findings: [
      `Total events (7d): ${total7d}`,
      `Total events (24h): ${total24h}`,
      ...coverage.map(c => `${c.type}: ${c.count} events`),
    ],
    actions:   uncovered.map(c => `${c.type} has zero entries — verify the logging path is active`),
    metadata:  { coverage, total7d, total24h, uncoveredTypes: uncovered.map(c => c.type) },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
