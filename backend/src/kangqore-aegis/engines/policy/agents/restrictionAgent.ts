import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess policy compliance and enforcement. Flag violations, exceptions, and decisions requiring ADMIN review. Write 2 sentences, direct.'

export async function runRestrictionAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  // Find autonomous actions that coincided with a policy violation
  // Proxy: any AUTONOMOUS event that happened within 5 minutes of a POLICY_VIOLATION
  const [violations, autonomousActions] = await Promise.all([
    (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'POLICY_VIOLATION', createdAt: { gte: last24h } },
      select: { createdAt: true, system: true, detail: true },
    }).catch(() => []) as Promise<Array<{ createdAt: Date; system: string | null; detail: string | null }>>,
    (prisma as any).aegisAuditLog.count({
      where:  { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: last24h } },
    }).catch(() => 0),
  ])

  const WINDOW_MS = 5 * 60_000
  const autonomousViolations: typeof violations = []
  for (const v of violations) {
    const windowStart = new Date(v.createdAt.getTime() - WINDOW_MS)
    const windowEnd   = new Date(v.createdAt.getTime() + WINDOW_MS)
    const nearbyAuto  = await (prisma as any).aegisAuditLog.count({
      where: { eventType: 'ACTIVATION', autonomous: true, createdAt: { gte: windowStart, lte: windowEnd } },
    }).catch(() => 0)
    if (nearbyAuto > 0) autonomousViolations.push(v)
  }

  const verdict = autonomousViolations.length > 0 ? 'CRITICAL' : violations.length > 0 ? 'WARN' : 'PASS'

  return {
    agentId:  'policy.restriction',
    engine:   'POLICY',
    verdict,
    summary:  autonomousViolations.length > 0
      ? `CRITICAL: ${autonomousViolations.length} policy violations co-occurred with autonomous KIMMP actions (±5min window, 24h). Autonomous action may have caused violations.`
      : `Restriction audit (24h): ${violations.length} violations, ${autonomousActions} autonomous actions. No causal overlap detected.`,
    findings: [
      `Policy violations (24h): ${violations.length}`,
      `Autonomous activations (24h): ${autonomousActions}`,
      `Violations with nearby autonomous action: ${autonomousViolations.length}`,
      ...autonomousViolations.map(v => `Co-occurrence: system=${v.system} detail="${v.detail?.slice(0, 80)}"`),
    ],
    actions:  autonomousViolations.length > 0
      ? ['CRITICAL: Autonomous actions may be causing policy violations — review KIMMP autonomy boundary immediately']
      : [],
    metadata: { violations: violations.length, autonomousActions, coOccurrences: autonomousViolations.length },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
