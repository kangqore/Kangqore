import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS. Evaluate whether active governance policies are achieving their goals based on recent violation trends.'

export async function runComplianceRuleAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const [violations7d, violations24h, agentRuns] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: new Date(Date.now() - 86_400_000) } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'PASS', raisedAt: { gte: last7d } } }).catch(() => 0),
  ])

  const policyCompliance = violations7d === 0 ? 100 : Math.max(0, 100 - violations7d * 5)

  const narrative = await callLLM(
    SYSTEM,
    `AEGIS governance data (7 days):
- Policy violations (7d): ${violations7d}
- Policy violations (24h): ${violations24h}
- PASS agent verdicts (7d): ${agentRuns}
- Policy compliance score: ${policyCompliance}/100

Write 2 sentences assessing whether governance policies are effective and what the primary compliance gap is (if any).`,
    280,
  )

  return {
    agentId:  'policy.compliance-rule',
    engine:   'POLICY',
    verdict:  violations7d > 5 ? 'WARN' : 'PASS',
    summary:  narrative || `Policy compliance score (7d): ${policyCompliance}/100. ${violations7d} total violations; ${violations24h} in last 24h.`,
    findings: [
      `Policy compliance score: ${policyCompliance}/100`,
      `Violations (7d): ${violations7d}`,
      `Violations (24h): ${violations24h}`,
      `Successful governance passes (7d): ${agentRuns}`,
    ],
    actions:  violations7d > 5 ? ['Policy violation rate elevated — review and tighten active governance rules'] : [],
    metadata: { violations7d, violations24h, agentRuns, policyCompliance },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
