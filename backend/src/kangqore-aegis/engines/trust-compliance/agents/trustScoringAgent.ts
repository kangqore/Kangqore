import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runTrustScoringAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last7d  = new Date(Date.now() - 7 * 86_400_000)

  const [activations, denied, violations, criticalRuns, warnRuns, autonomous] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION',      createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED',   createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION',createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: last7d } } }).catch(() => 0),
  ])

  // Trust score: real operational incidents drive the score down.
  // CRITICAL/WARN agent runs are monitoring signals — capped so normal
  // AEGIS surveillance activity doesn't floor the score.
  // POLICY_VIOLATION audit events (real system violations) carry full weight.
  const denialRate       = (activations + denied) > 0 ? denied / (activations + denied) : 0
  const violationPenalty = Math.min(violations * 4,  20) // real system violations
  const criticalPenalty  = Math.min(criticalRuns * 2, 15) // agent monitoring signals
  const warnPenalty      = Math.min(warnRuns,          10) // agent monitoring signals
  const denialPenalty    = Math.round(denialRate * 20)
  const autonomyRatio    = activations > 0 ? autonomous / activations : 0
  const autonomyPenalty  = autonomyRatio > 0.8 ? 10 : 0

  let score = 100 - violationPenalty - criticalPenalty - warnPenalty - denialPenalty - autonomyPenalty
  score = Math.max(10, Math.min(100, score))

  const verdict = score < 50 ? 'CRITICAL' : score < 75 ? 'WARN' : 'PASS'

  return {
    agentId:  'compliance.trust-scoring',
    engine:   'TRUST_COMPLIANCE',
    verdict,
    summary:  `KIMMP/WAANDA trust score (7d): ${score}/100. Policy violations: ${violations}, CRITICAL findings: ${criticalRuns}, denial rate: ${(denialRate * 100).toFixed(1)}%.`,
    findings: [
      `Overall trust score: ${score}/100`,
      `Activations (7d): ${activations}  |  Autonomous: ${autonomous} (${(autonomyRatio * 100).toFixed(1)}%)`,
      `Access denials (7d): ${denied} (${(denialRate * 100).toFixed(1)}% denial rate) — penalty: -${denialPenalty}`,
      `Policy violations (7d): ${violations} — penalty: -${violationPenalty}`,
      `CRITICAL agent runs (7d): ${criticalRuns} — penalty: -${criticalPenalty}`,
      `WARN agent runs (7d): ${warnRuns} — penalty: -${warnPenalty}`,
      `Autonomy ratio (>80%=penalty): ${(autonomyRatio * 100).toFixed(1)}% — penalty: -${autonomyPenalty}`,
    ],
    actions:  score < 50
      ? ['CRITICAL: Trust score below 50 — comprehensive governance review required']
      : score < 75 ? ['Trust score degraded — address CRITICAL findings and policy violations'] : [],
    metadata: { score, activations, autonomous, denied, violations, criticalRuns, warnRuns, denialRate, autonomyRatio },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
