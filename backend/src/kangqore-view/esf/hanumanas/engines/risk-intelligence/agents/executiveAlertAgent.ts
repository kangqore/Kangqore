import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS. Write a concise executive risk brief for the ADMIN. Be direct and action-oriented.'

export async function runExecutiveAlertAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  const [criticalRuns, warnRuns, violations, denied, autonomous, activations] = await Promise.all([
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED',    createdAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION',       createdAt: { gte: last6h } } }).catch(() => 0),
  ])

  // Get most recent CRITICAL agent findings for the brief
  const criticalFindings: Array<{ agentId: string; engine: string; summary: string }> =
    await (prisma as any).aegisAgentRun.findMany({
      where:   { verdict: 'CRITICAL', raisedAt: { gte: last6h } },
      orderBy: { raisedAt: 'desc' },
      take:    5,
      select:  { agentId: true, engine: true, summary: true },
    }).catch(() => [])

  const riskLevel    = criticalRuns > 3 ? 'CRITICAL' : criticalRuns > 0 ? 'HIGH' : warnRuns > 5 ? 'MEDIUM' : 'LOW'
  const autonomyPct  = activations > 0 ? (autonomous / activations * 100).toFixed(1) : '0'
  const topFindings  = criticalFindings.map(f => `[${f.engine}] ${f.agentId}: ${f.summary.slice(0, 100)}`).join('\n')

  const narrative = criticalRuns > 0 || violations > 0
    ? await callLLM(
        SYSTEM,
        `AEGIS 6-hour executive brief:\n- Risk level: ${riskLevel}\n- CRITICAL findings: ${criticalRuns}\n- WARN findings: ${warnRuns}\n- Policy violations: ${violations}\n- Access denials: ${denied}\n- Autonomous actions: ${autonomous}/${activations} (${autonomyPct}%)\n\nTop CRITICAL findings:\n${topFindings || 'none'}\n\nWrite a 2-sentence executive brief: current risk status and the single most important action for ADMIN.`,
        300,
      )
    : null

  const verdict = criticalRuns > 0 ? 'CRITICAL' : warnRuns > 5 ? 'WARN' : 'PASS'

  return {
    agentId:  'risk.executive-alert',
    engine:   'RISK_INTELLIGENCE',
    verdict,
    summary:  narrative || `Executive alert (6h): ${riskLevel} risk. CRITICAL: ${criticalRuns}, WARN: ${warnRuns}, violations: ${violations}, denials: ${denied}, autonomy: ${autonomyPct}%.`,
    findings: [
      `Risk level: ${riskLevel}`,
      `CRITICAL agent findings (6h): ${criticalRuns}`,
      `WARN agent findings (6h): ${warnRuns}`,
      `Policy violations (6h): ${violations}`,
      `Access denials (6h): ${denied}`,
      `Autonomous actions (6h): ${autonomous}/${activations} (${autonomyPct}%)`,
      ...criticalFindings.map(f => `[${f.engine}] ${f.summary.slice(0, 120)}`),
    ],
    actions: criticalRuns > 0
      ? [`${riskLevel} risk — ${criticalRuns} CRITICAL findings require ADMIN review. Check AEGIS Agents tab immediately.`]
      : [],
    metadata: { riskLevel, criticalRuns, warnRuns, violations, denied, autonomous, activations, autonomyPct },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
