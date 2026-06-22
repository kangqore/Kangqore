import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

export async function runAlertingAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()
  const since = new Date(Date.now() - 60 * 60_000) // last 1h

  const [criticalRuns, warnRuns, policyViolations, accessDenied] = await Promise.all([
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt:  { gte: since } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'WARN',     raisedAt:  { gte: since } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: since } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED',    createdAt: { gte: since } } }).catch(() => 0),
  ])

  const verdict = (criticalRuns > 0 || policyViolations > 0) ? 'CRITICAL'
    : (warnRuns > 2  || accessDenied > 5)                    ? 'WARN'
    : 'PASS'

  const rawFindings = [
    criticalRuns    > 0 && `${criticalRuns} CRITICAL agent findings in last 1h`,
    warnRuns        > 0 && `${warnRuns} WARN agent findings in last 1h`,
    policyViolations > 0 && `${policyViolations} policy violations in last 1h`,
    accessDenied    > 0 && `${accessDenied} access denied events in last 1h`,
  ].filter(Boolean) as string[]

  return {
    agentId:   'govops.alerting',
    engine:    'GOVERNANCE_OPS',
    verdict,
    summary:   verdict === 'PASS'
      ? 'No alert conditions in the last hour. Governance is quiet.'
      : `${criticalRuns + policyViolations} critical conditions detected in the last hour.`,
    findings:  rawFindings.length > 0 ? rawFindings : ['No alert conditions in the last hour'],
    actions: [
      ...(criticalRuns     > 0  ? ['Review CRITICAL agent findings immediately — Agents tab'] : []),
      ...(policyViolations > 0  ? ['Investigate policy violations — Policy tab'] : []),
      ...(accessDenied     > 10 ? ['Elevated access denials — review Shield tab for patterns'] : []),
    ],
    metadata:   { criticalRuns, warnRuns, policyViolations, accessDenied, window: '1h' },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
