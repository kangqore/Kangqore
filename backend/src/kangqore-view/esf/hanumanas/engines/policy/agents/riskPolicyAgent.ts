import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Assess policy compliance and enforcement. Flag violations, exceptions, and decisions requiring ADMIN review. Write 2 sentences, direct.'

export async function runRiskPolicyAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last6h  = new Date(Date.now() - 6 * 3_600_000)

  const [violations, criticalAgentRuns, warnAgentRuns] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: last6h } } }).catch(() => 0),
  ])

  // Risk policy is triggered when violations coincide with CRITICAL agent findings
  const compoundRisk = violations > 0 && criticalAgentRuns > 0

  // Risk score: weighted sum
  const riskScore = Math.min(100, violations * 10 + criticalAgentRuns * 15 + warnAgentRuns * 3)

  const verdict = compoundRisk || riskScore > 50 ? 'CRITICAL' : violations > 0 || riskScore > 20 ? 'WARN' : 'PASS'

  return {
    agentId:  'policy.risk-policy',
    engine:   'POLICY',
    verdict,
    summary:  compoundRisk
      ? `CRITICAL compound risk: ${violations} policy violations + ${criticalAgentRuns} CRITICAL agent findings coincide (6h). Risk score: ${riskScore}/100.`
      : `Risk policy assessment (6h): score ${riskScore}/100. Violations: ${violations}, CRITICAL findings: ${criticalAgentRuns}, WARNs: ${warnAgentRuns}.`,
    findings: [
      `Policy violations (6h): ${violations}`,
      `CRITICAL agent runs (6h): ${criticalAgentRuns}`,
      `WARN agent runs (6h): ${warnAgentRuns}`,
      `Risk score: ${riskScore}/100`,
      `Compound risk (violations + CRITICAL findings): ${compoundRisk ? 'YES' : 'NO'}`,
    ],
    actions:  compoundRisk
      ? ['CRITICAL compound risk — escalate to ADMIN, review governance posture']
      : riskScore > 20 ? ['Elevated risk score — review violation and agent finding sources'] : [],
    metadata: { violations, criticalAgentRuns, warnAgentRuns, riskScore, compoundRisk },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
