import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runTrustScoreAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const [activations, denied, autonomous] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED', createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: last7d } } }).catch(() => 0),
  ])

  // Trust score formula:
  //   Base: 100
  //   -2 per denied event (capped at -40)
  //   +10 if denial rate < 1%
  //   -0.5 per autonomous activation above 50% ratio (if applicable)
  const totalAttempts = activations + denied
  const denialRate    = totalAttempts > 0 ? denied / totalAttempts : 0
  const autonomyRatio = activations  > 0 ? autonomous / activations : 0

  let score = 100
  score -= Math.min(denied * 2, 40)
  if (denialRate < 0.01 && totalAttempts > 0) score += 10
  if (autonomyRatio > 0.5) score -= Math.round((autonomyRatio - 0.5) * 40)
  score = Math.max(0, Math.min(100, score))

  const verdict = score < 40 ? 'CRITICAL' : score < 70 ? 'WARN' : 'PASS'

  return {
    agentId:  'sentinel.trust-score',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  `Access trust score (7d): ${score}/100. Denial rate: ${(denialRate * 100).toFixed(1)}%, autonomy ratio: ${(autonomyRatio * 100).toFixed(1)}%.`,
    findings: [
      `Trust score: ${score}/100`,
      `Activations (7d): ${activations}`,
      `Access denials (7d): ${denied}`,
      `Denial rate: ${(denialRate * 100).toFixed(1)}%`,
      `Autonomous activations: ${autonomous} (${(autonomyRatio * 100).toFixed(1)}% of total)`,
    ],
    actions:  score < 40
      ? ['CRITICAL: Trust score critically low — review access patterns and authentication integrity']
      : score < 70 ? ['Trust score degraded — review denial patterns and reduce unauthorized access attempts'] : [],
    metadata: { score, activations, denied, autonomous, denialRate, autonomyRatio },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
