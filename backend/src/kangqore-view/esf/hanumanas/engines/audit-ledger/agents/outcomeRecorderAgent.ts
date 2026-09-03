import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Audit AI decision records, cost tracking, and execution ledger. Write 2 sentences — direct status for ADMIN.`

export async function runOutcomeRecorderAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [total, withPriority, withConfidence, withDispatchId] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', NOT: { priority:   null }, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', NOT: { confidence: null }, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', NOT: { dispatchId: null }, createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const outcomeRate = total > 0 ? Math.round(((withPriority + withConfidence + withDispatchId) / (total * 3)) * 100) : 100
  const verdict     = outcomeRate < 70 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM, `HANUMANAS Outcome Recorder (24h): ${total} KIMMP activations. Outcome completeness: ${outcomeRate}% — with priority: ${withPriority}/${total}, confidence: ${withConfidence}/${total}, dispatchId: ${withDispatchId}/${total}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'audit.outcome-recorder',
    engine:    'AUDIT_LEDGER',
    verdict,
    summary:   `Outcome record completeness: ${outcomeRate}% across ${total} KIMMP activations in 24h.`,
    findings: [
      `ACTIVATION events (24h): ${total}`,
      `With priority: ${withPriority}/${total}`,
      `With confidence: ${withConfidence}/${total}`,
      `With dispatchId: ${withDispatchId}/${total}`,
      `Outcome completeness: ${outcomeRate}%`,
    ],
    actions:   outcomeRate < 70
      ? ['Review HanumanasLedger.logActivation() call — pass priority, confidence, dispatchId on every dispatch']
      : [],
    metadata:  { total, withPriority, withConfidence, withDispatchId, outcomeRate },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
