import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Audit AI decision records, cost tracking, and execution ledger. Write 2 sentences — direct status for ADMIN.'

export async function runDecisionRecorderAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [total, missTrigger, missSystem, missPriority, missConfidence] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', trigger:  null, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', system:   null, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', priority: null, createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', confidence: null, createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const totalGaps  = missTrigger + missSystem + missPriority + missConfidence
  const completeness = total > 0 ? Math.round(((total * 4 - totalGaps) / (total * 4)) * 100) : 100
  const verdict    = completeness < 80 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM, `AEGIS Decision Recorder (24h): ${total} KIMMP ACTIVATION events. Record completeness: ${completeness}% (missing trigger: ${missTrigger}, system: ${missSystem}, priority: ${missPriority}, confidence: ${missConfidence}).\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'audit.decision-recorder',
    engine:    'AUDIT_LEDGER',
    verdict,
    summary:   `Decision record completeness: ${completeness}% across ${total} KIMMP activations in 24h.`,
    findings: [
      `ACTIVATION events (24h): ${total}`,
      `Record completeness: ${completeness}%`,
      `Missing trigger: ${missTrigger}`,
      `Missing system: ${missSystem}`,
      `Missing priority: ${missPriority}`,
      `Missing confidence: ${missConfidence}`,
    ],
    actions:   completeness < 80
      ? ['Review SystemDispatcher — ensure trigger, system, priority, confidence are set on every run']
      : [],
    metadata:  { total, missTrigger, missSystem, missPriority, missConfidence, completeness },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
