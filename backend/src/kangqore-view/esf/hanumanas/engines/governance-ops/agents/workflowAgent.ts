import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Provide executive governance summaries — direct, no fluff, 2 sentences.'

export async function runWorkflowAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const [totalRuns, criticalCount, warnCount, totalViolations] = await Promise.all([
    (prisma as any).hanumanasAgentRun.count({ where: { raisedAt:  { gte: last7d } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt:  { gte: last7d } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'WARN',     raisedAt:  { gte: last7d } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last7d } } }).catch(() => 0),
  ])

  const verdict = criticalCount > 5 ? 'WARN' : 'INFO'

  const llmSummary = await callLLM(SYSTEM, `HANUMANAS Workflow (7d): ${totalRuns} agent runs — ${criticalCount} CRITICAL, ${warnCount} WARN. Policy violations: ${totalViolations}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'govops.workflow',
    engine:    'GOVERNANCE_OPS',
    verdict,
    summary:   `Last 7 days: ${totalRuns} agent runs — ${criticalCount} CRITICAL, ${warnCount} WARN, ${totalViolations} policy violations.`,
    findings: [
      `Total agent runs (7d): ${totalRuns}`,
      `CRITICAL findings (7d): ${criticalCount}`,
      `WARN findings (7d): ${warnCount}`,
      `Policy violations (7d): ${totalViolations}`,
    ],
    actions:   criticalCount > 5 ? ['High CRITICAL volume — review escalation queue'] : [],
    metadata:  { criticalCount, warnCount, totalRuns, totalViolations, window: '7d' },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
