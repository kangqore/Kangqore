import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS Risk Intelligence. Analyse KIMMP behavioural patterns and identify any concerning signatures.'

export async function runBehaviorAnalysisAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()

  // Build 7-day behaviour signature: activation types, autonomy, system distribution
  const days: Array<{ date: string; activations: number; autonomous: number; denials: number; violations: number }> = []
  for (let i = 6; i >= 0; i--) {
    const from = new Date(Date.now() - (i + 1) * 86_400_000)
    const to   = new Date(Date.now() - i       * 86_400_000)
    const [activations, autonomous, denials, violations] = await Promise.all([
      (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION',       createdAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED',    createdAt: { gte: from, lt: to } } }).catch(() => 0),
      (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: from, lt: to } } }).catch(() => 0),
    ])
    days.push({ date: from.toISOString().slice(0, 10), activations, autonomous, denials, violations })
  }

  const recentAvgAutonomy  = days.slice(-3).reduce((s, d) => s + (d.activations > 0 ? d.autonomous/d.activations : 0), 0) / 3
  const earlierAvgAutonomy = days.slice(0, 3).reduce((s, d) => s + (d.activations > 0 ? d.autonomous/d.activations : 0), 0) / 3
  const behaviourShift     = Math.abs(recentAvgAutonomy - earlierAvgAutonomy) > 0.2

  const trendBlock = days.map(d =>
    `${d.date}: ${d.activations} activations (${d.activations > 0 ? ((d.autonomous/d.activations)*100).toFixed(0) : 0}% autonomous) ${d.denials} denials ${d.violations} violations`
  ).join('\n')

  const narrative = await callLLM(
    SYSTEM,
    `KIMMP 7-day behaviour log:\n${trendBlock}\n\nWrite 2 sentences: what does this behaviour pattern indicate about KIMMP's operational risk profile and are there concerning signatures?`,
    300,
  )

  return {
    agentId:  'risk.behavior-analysis',
    engine:   'RISK_INTELLIGENCE',
    verdict:  behaviourShift ? 'WARN' : 'INFO',
    summary:  narrative || `Behaviour analysis (7d): autonomy ratio shift ${behaviourShift ? 'DETECTED' : 'stable'}. Recent avg: ${(recentAvgAutonomy*100).toFixed(1)}% vs earlier: ${(earlierAvgAutonomy*100).toFixed(1)}%.`,
    findings: days.map(d => `${d.date}: ${d.activations} activations, ${d.autonomous} autonomous, ${d.denials} denials, ${d.violations} violations`),
    actions:  behaviourShift ? ['Behaviour shift detected in autonomy ratio — review KIMMP operational context for last 3 days'] : [],
    metadata: { days, recentAvgAutonomy, earlierAvgAutonomy, behaviourShift },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
