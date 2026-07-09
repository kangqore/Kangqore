import { prisma }          from '../../../../lib/prisma'
import { callLLM }        from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'
import { LogicToolRegistry } from '../../../../kangqore-immp/tools/logicToolRegistry'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess access control and authentication integrity. Write 2 sentences — direct verdict on whether access patterns are secure and if ADMIN action is needed.'

export async function runTrustScoreAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const [activations, denied, autonomous] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED', createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: last7d } } }).catch(() => 0),
  ])

  const totalAttempts = activations + denied
  const denialRate    = totalAttempts > 0 ? denied / totalAttempts : 0
  const autonomyRatio = activations  > 0 ? autonomous / activations : 0

  // Compute trust score via LogicToolRegistry for audited, hallucination-free scoring
  const denialPenalty  = Math.min(denied * 2, 40)
  const denialBonus    = denialRate < 0.01 && totalAttempts > 0 ? 10 : 0
  const autonomyPenalty = autonomyRatio > 0.5 ? Math.round((autonomyRatio - 0.5) * 40) : 0

  const scoreResult = LogicToolRegistry.execute('weighted_score', {
    items: [
      { score: Math.max(0, 100 - denialPenalty + denialBonus), weight: 60 },
      { score: Math.max(0, 100 - autonomyPenalty),             weight: 40 },
    ],
  })
  const score = Math.max(0, Math.min(100, Math.round(Number(scoreResult.result))))

  const verdict = score < 40 ? 'CRITICAL' : score < 70 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM,
    `Trust score (7d): ${score}/100. ${activations} activations, ${denied} access denials, denial rate ${(denialRate * 100).toFixed(1)}%, ${autonomous} autonomous activations (autonomy ratio ${(autonomyRatio * 100).toFixed(1)}%). Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

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
