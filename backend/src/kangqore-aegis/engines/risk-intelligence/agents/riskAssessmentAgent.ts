import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess risk levels and threat intelligence. Write 2 sentences: current risk posture and urgency of ADMIN escalation.'

export async function runRiskAssessmentAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [criticalRuns, warnRuns, violations, denied, activations, autonomous] = await Promise.all([
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED',    createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION',       createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const autonomyRatio = activations > 0 ? autonomous / activations : 0

  // Risk score: real operational events (violations, denials) carry full weight.
  // Agent monitoring findings (CRITICAL/WARN runs) are proportional signals —
  // a fresh system with active monitoring will always have some, so they're
  // weighted to reflect genuine operational risk, not surveillance volume.
  const criticalWeight = Math.min(criticalRuns * 3, 30)
  const warnWeight     = Math.min(warnRuns,          10)
  const violationWeight = violations * 5
  const denialWeight   = denied * 2
  const autonomyWeight = autonomyRatio > 0.75 ? 15 : 0

  const riskScore = Math.min(100,
    criticalWeight + warnWeight + violationWeight + denialWeight + autonomyWeight
  )

  const verdict = riskScore >= 60 ? 'CRITICAL' : riskScore >= 30 ? 'WARN' : 'PASS'

  return {
    agentId:  'risk.assessment',
    engine:   'RISK_INTELLIGENCE',
    verdict,
    summary:  `Risk assessment (24h): score ${riskScore}/100. CRITICAL findings: ${criticalRuns}, violations: ${violations}, denials: ${denied}, autonomy: ${(autonomyRatio * 100).toFixed(1)}%.`,
    findings: [
      `Risk score (24h): ${riskScore}/100`,
      `CRITICAL agent runs: ${criticalRuns} (×3 capped at 30 = ${criticalWeight})`,
      `WARN agent runs: ${warnRuns} (capped at 10 = ${warnWeight})`,
      `Policy violations: ${violations} (×5 = ${violationWeight})`,
      `Access denials: ${denied} (×2 = ${denialWeight})`,
      `Autonomy ratio: ${(autonomyRatio * 100).toFixed(1)}%${autonomyRatio > 0.75 ? ' (+15 penalty)' : ''}`,
    ],
    actions: riskScore >= 60
      ? ['CRITICAL risk level — immediate ADMIN review required. Check CRITICAL agent findings and policy violations.']
      : riskScore >= 30 ? ['Elevated risk — monitor situation; review WARN findings and policy violations'] : [],
    metadata: { riskScore, criticalRuns, warnRuns, violations, denied, autonomous, activations, autonomyRatio },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
