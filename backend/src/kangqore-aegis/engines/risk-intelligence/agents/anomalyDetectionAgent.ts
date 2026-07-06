import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess risk levels and threat intelligence. Write 2 sentences: current risk posture and urgency of ADMIN escalation.'

const EVENT_TYPES = ['ACTIVATION', 'AUTONOMOUS', 'POLICY_VIOLATION', 'ACCESS_DENIED', 'EGRESS'] as const

export async function runAnomalyDetectionAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const now    = Date.now()
  const last1h = new Date(now - 3_600_000)
  const last7d = new Date(now - 7 * 86_400_000)

  const anomalies: string[] = []

  const results = await Promise.all(EVENT_TYPES.map(async et => {
    const [hourly, sevenDay] = await Promise.all([
      (prisma as any).aegisAuditLog.count({ where: { eventType: et, createdAt: { gte: last1h } } }).catch(() => 0),
      (prisma as any).aegisAuditLog.count({ where: { eventType: et, createdAt: { gte: last7d } } }).catch(() => 0),
    ])
    const hourlyAvg = sevenDay / (7 * 24) // hourly average over 7 days
    const ratio     = hourlyAvg > 0 ? hourly / hourlyAvg : 0
    const anomalous = ratio > 2 && hourly > 3 // current hour is >2× average AND has real activity
    if (anomalous) anomalies.push(`${et}: ${hourly} events (${ratio.toFixed(1)}× avg)`)
    return { type: et, hourly, sevenDay, hourlyAvg: hourlyAvg.toFixed(2), ratio: ratio.toFixed(2), anomalous }
  }))

  const verdict = anomalies.length >= 2 ? 'CRITICAL' : anomalies.length === 1 ? 'WARN' : 'PASS'

  return {
    agentId:  'risk.anomaly-detection',
    engine:   'RISK_INTELLIGENCE',
    verdict,
    summary:  anomalies.length > 0
      ? `${anomalies.length} statistical anomaly(ies) detected in the last 1h vs 7-day baseline: ${anomalies.join('; ')}.`
      : `Anomaly detection clean — all ${EVENT_TYPES.length} event types within 2× historical baseline.`,
    findings: results.map(r => `${r.type}: ${r.hourly}/hr (avg: ${r.hourlyAvg}/hr, ratio: ${r.ratio}×)${r.anomalous ? ' ← ANOMALY' : ''}`),
    actions:  anomalies.map(a => `Anomaly: ${a} — investigate cause of spike`),
    metadata: { anomalies: anomalies.length, results },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
