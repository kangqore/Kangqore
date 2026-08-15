import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'
import { LogicToolRegistry } from '../../../../../../kangqore-immp/tools/logicToolRegistry'

const SYSTEM = 'You are AEGIS. Forecast the governance risk level for the next 24 hours based on 7-day trends.'

export async function runThreatForecastAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const days: Array<{ date: string; critical: number; warn: number; violations: number; denied: number }> = []

  for (let i = 6; i >= 0; i--) {
    const from = new Date(Date.now() - (i + 1) * 86_400_000)
    const to   = new Date(Date.now() - i       * 86_400_000)
    const [critical, warn, violations, denied] = await Promise.all([
      (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).aegisAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED',    createdAt: { gte: from, lt: to } } }).catch(() => 0),
    ])
    days.push({ date: from.toISOString().slice(0, 10), critical, warn, violations, denied })
  }

  const trendBlock = days.map(d => `${d.date}: CRITICAL=${d.critical} WARN=${d.warn} violations=${d.violations} denials=${d.denied}`).join('\n')
  const recent3    = days.slice(-3).reduce((s, d) => s + d.critical + d.violations, 0)
  const earlier3   = days.slice(0, 3).reduce((s, d) => s + d.critical + d.violations, 0)
  const escalating = recent3 > earlier3 && earlier3 >= 0

  // Emit trend risk score to aegisAuditLog via LogicToolRegistry
  LogicToolRegistry.execute('weighted_score', {
    items: [
      { score: Math.min(100, recent3 * 10),  weight: 60 },
      { score: Math.min(100, earlier3 * 10), weight: 40 },
    ],
  })

  const narrative = await callLLM(
    SYSTEM,
    `AEGIS 7-day governance trend:\n${trendBlock}\n\nWrite 2 sentences: forecast the next-24h risk level (LOW/MEDIUM/HIGH/CRITICAL) and the primary risk driver.`,
    280,
  )

  return {
    agentId:  'risk.threat-forecast',
    engine:   'RISK_INTELLIGENCE',
    verdict:  escalating ? 'WARN' : 'INFO',
    summary:  narrative || `Threat forecast: ${escalating ? 'ESCALATING trend' : 'stable trend'} over 7 days. Recent 3-day risk index: ${recent3} vs earlier: ${earlier3}.`,
    findings: days.map(d => `${d.date}: CRITICAL=${d.critical} WARN=${d.warn} violations=${d.violations} denials=${d.denied}`),
    actions:  escalating ? ['Escalating risk trend — prepare ADMIN briefing and review top CRITICAL findings'] : [],
    metadata: { days, recent3, earlier3, escalating },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
