import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess policy compliance and enforcement. Flag violations, exceptions, and decisions requiring ADMIN review. Write 2 sentences, direct.'

const ENFORCEMENT_WARN_THRESHOLD = 0.95  // below 95% = degraded enforcement

export async function runEnforcementAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last1h = new Date(Date.now() - 3_600_000)

  const [activations, violations] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last1h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last1h } } }).catch(() => 0),
  ])

  const total            = activations + violations
  const enforcementRate  = total > 0 ? (activations / total) : 1
  const degraded         = enforcementRate < ENFORCEMENT_WARN_THRESHOLD && total > 0

  // Also check agent-level enforcement: any CRITICAL findings in last 1h
  const criticalRuns = await (prisma as any).aegisAgentRun
    .count({ where: { verdict: 'CRITICAL', raisedAt: { gte: last1h } } }).catch(() => 0)

  const verdict = criticalRuns > 0 ? 'CRITICAL' : degraded ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'policy.enforcement',
    engine:   'POLICY',
    verdict,
    summary:  criticalRuns > 0
      ? `CRITICAL: ${criticalRuns} CRITICAL agent findings in the last 1h. Policy enforcement under stress.`
      : `Policy enforcement rate (1h): ${(enforcementRate * 100).toFixed(1)}%. ${activations} activations, ${violations} violations.`,
    findings: [
      `KIMMP activations (1h): ${activations}`,
      `Policy violations (1h): ${violations}`,
      `Enforcement rate: ${(enforcementRate * 100).toFixed(1)}%`,
      `CRITICAL agent findings (1h): ${criticalRuns}`,
      `Enforcement status: ${criticalRuns > 0 ? 'CRITICAL' : degraded ? 'DEGRADED' : 'HEALTHY'}`,
    ],
    actions:  criticalRuns > 0
      ? ['CRITICAL: Multiple policy enforcement failures — review AEGIS agent findings immediately']
      : degraded ? ['Enforcement rate below 95% — review policy violation sources'] : [],
    metadata: { activations, violations, enforcementRate, criticalRuns, degraded },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
