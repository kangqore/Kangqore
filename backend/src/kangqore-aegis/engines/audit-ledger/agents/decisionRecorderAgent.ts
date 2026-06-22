import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

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
