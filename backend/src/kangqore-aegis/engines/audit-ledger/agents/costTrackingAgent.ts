import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runCostTrackingAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last7d  = new Date(Date.now() - 7 * 86_400_000)
  const last24h = new Date(Date.now() - 86_400_000)

  const [total7d, autonomous7d, admin7d, total24h, autonomous24h] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last7d  } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true,  createdAt: { gte: last7d  } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: false, createdAt: { gte: last7d  } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true,  createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const autonomousRate7d = total7d > 0 ? Math.round((autonomous7d / total7d) * 100) : 0
  // Warn if autonomous rate is very high (unexpected cost from excessive autonomous runs)
  const verdict = autonomousRate7d > 80 ? 'WARN' : 'PASS'

  return {
    agentId:   'audit.cost-tracking',
    engine:    'AUDIT_LEDGER',
    verdict,
    summary:   `${total7d} KIMMP activations in 7d: ${autonomous7d} autonomous (${autonomousRate7d}%) / ${admin7d} ADMIN-triggered.`,
    findings: [
      `ACTIVATION events (7d): ${total7d}`,
      `Autonomous (7d): ${autonomous7d} (${autonomousRate7d}%)`,
      `ADMIN-triggered (7d): ${admin7d}`,
      `ACTIVATION events (24h): ${total24h}`,
      `Autonomous (24h): ${autonomous24h}`,
    ],
    actions:   autonomousRate7d > 80
      ? ['High autonomous activation rate — review LoopScheduler cadence and KIMPPAgent triggers']
      : [],
    metadata:  { total7d, autonomous7d, admin7d, autonomousRate7d, total24h, autonomous24h },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
