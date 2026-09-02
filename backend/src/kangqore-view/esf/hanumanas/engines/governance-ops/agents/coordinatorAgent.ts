import { prisma }   from '../../../../../../lib/prisma'
import { callLLM }  from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, the governance AI for Kangqore. Provide executive-level governance summaries — direct, no fluff.'

export async function runCoordinatorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [totalRuns, criticalRuns, warnRuns, passRuns, violations, assets, autonomous] = await Promise.all([
    (prisma as any).aegisAgentRun.count({ where: { raisedAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'PASS',     raisedAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET',  createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { autonomous: true,               createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const summary = await callLLM(
    SYSTEM,
    `AEGIS 24h snapshot: ${totalRuns} agent runs (CRITICAL:${criticalRuns} WARN:${warnRuns} PASS:${passRuns}), ` +
    `${violations} policy violations, ${autonomous} autonomous KIMMP actions, ${assets} new assets.\n\n` +
    `Write 2 sentences: governance health status and whether ADMIN action is required.`,
    300,
  )

  const verdict = criticalRuns > 0 || violations > 0 ? 'CRITICAL'
    : warnRuns > 5                                    ? 'WARN'
    : 'PASS'

  return {
    agentId:   'govops.coordinator',
    engine:    'GOVERNANCE_OPS',
    verdict,
    summary:   summary || `AEGIS 24h: ${totalRuns} runs, ${criticalRuns} CRITICAL, ${violations} violations.`,
    findings: [
      `Agent runs (24h): ${totalRuns}`,
      `CRITICAL findings: ${criticalRuns}`,
      `WARN findings: ${warnRuns}`,
      `Policy violations: ${violations}`,
      `Autonomous KIMMP actions: ${autonomous}`,
      `New knowledge assets: ${assets}`,
    ],
    actions: [
      ...(criticalRuns > 0 ? ['Immediate: review CRITICAL agent findings'] : []),
      ...(violations   > 0 ? ['Review policy violations in the Policy tab'] : []),
    ],
    metadata:  { totalRuns, criticalRuns, warnRuns, passRuns, violations, assets, autonomous },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
