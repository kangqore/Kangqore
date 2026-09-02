import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess risk levels and threat intelligence. Write 2 sentences: current risk posture and urgency of ADMIN escalation.'

// Predictive signals: conditions that precede policy violations
export async function runViolationPredictorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)
  const last1h = new Date(Date.now() - 3_600_000)

  const [autonomousHigh, deniedSpike, recentViolations, criticalRuns] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true, priority: 'HIGH', createdAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED', createdAt: { gte: last1h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'POLICY_VIOLATION', createdAt: { gte: last6h } } }).catch(() => 0),
    (prisma as any).aegisAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: last6h } } }).catch(() => 0),
  ])

  // Predictive signals: high autonomous + denial spike + CRITICAL findings = violation likely
  const signals: string[] = []
  if (autonomousHigh > 3) signals.push(`${autonomousHigh} autonomous HIGH-priority activations in 6h`)
  if (deniedSpike > 5)     signals.push(`${deniedSpike} access denials in last 1h`)
  if (criticalRuns > 2)    signals.push(`${criticalRuns} CRITICAL agent findings in 6h`)

  const prediction  = signals.length >= 2 ? 'HIGH' : signals.length === 1 ? 'MEDIUM' : 'LOW'
  const verdict     = prediction === 'HIGH' ? 'WARN' : recentViolations > 0 ? 'WARN' : 'PASS'

  return {
    agentId:  'risk.violation-predictor',
    engine:   'RISK_INTELLIGENCE',
    verdict,
    summary:  `Policy violation prediction: ${prediction} likelihood. ${signals.length} predictive signal(s) detected. Current violations (6h): ${recentViolations}.`,
    findings: [
      `Prediction confidence: ${prediction}`,
      `Active predictive signals: ${signals.length}`,
      ...signals,
      `Current policy violations (6h): ${recentViolations}`,
      `Autonomous HIGH-priority activations (6h): ${autonomousHigh}`,
      `Access denial spike (1h): ${deniedSpike}`,
      `CRITICAL agent findings (6h): ${criticalRuns}`,
    ],
    actions:  prediction === 'HIGH' ? ['HIGH violation likelihood — pre-emptively review autonomous activity and access patterns'] : [],
    metadata: { prediction, signals, autonomousHigh, deniedSpike, recentViolations, criticalRuns },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
