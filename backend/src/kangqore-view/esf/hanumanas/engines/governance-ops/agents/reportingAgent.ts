import { prisma }   from '../../../../../../lib/prisma'
import { callLLM }  from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS. Write executive governance reports — clear, structured, actionable.'

export async function runReportingAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [totalRuns, critical, warn, pass, violations, denied, autonomous, assets] = await Promise.all([
    (prisma as any).hanumanasAgentRun.count({ where: { raisedAt:  { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt:  { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'WARN',     raisedAt:  { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'PASS',     raisedAt:  { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACCESS_DENIED',    createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { autonomous: true,               createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET',  createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const dataBlock = [
    `HANUMANAS Daily Report — ${new Date().toISOString().slice(0, 10)}`,
    `Agent runs: ${totalRuns} (CRITICAL:${critical} WARN:${warn} PASS:${pass})`,
    `Policy violations: ${violations}  Access blocked: ${denied}`,
    `Autonomous KIMMP actions: ${autonomous}  New assets: ${assets}`,
  ].join('\n')

  const report = await callLLM(
    SYSTEM,
    `${dataBlock}\n\nWrite a 4-bullet executive report. Bullet headings: KIMMP Activity, Security, Compliance, Recommended Actions.`,
    500,
  )

  const healthScore = Math.max(0, Math.round(100 - critical * 10 - warn * 2 - violations * 5))

  return {
    agentId:   'govops.reporting',
    engine:    'GOVERNANCE_OPS',
    verdict:   'INFO',
    summary:   report || dataBlock,
    findings: [
      `Governance health score: ${healthScore}/100`,
      `Agent runs: ${totalRuns}  CRITICAL: ${critical}  WARN: ${warn}  PASS: ${pass}`,
      `Policy violations: ${violations}  Access blocked: ${denied}`,
      `Autonomous KIMMP actions: ${autonomous}  Assets registered: ${assets}`,
    ],
    actions:   critical > 0 ? ['Address CRITICAL findings before next review'] : [],
    metadata:  { healthScore, totalRuns, critical, warn, pass, violations, denied, autonomous, assets },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
