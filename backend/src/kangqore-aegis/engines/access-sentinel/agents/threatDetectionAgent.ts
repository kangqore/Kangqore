import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const BRUTE_FORCE_THRESHOLD = 10  // denials per 10-minute window = brute force
const WINDOW_MS             = 10 * 60_000

export async function runThreatDetectionAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last1h = new Date(Date.now() - 3_600_000)

  const denied: Array<{ createdAt: Date; actor: string; system: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:   { eventType: 'ACCESS_DENIED', createdAt: { gte: last1h } },
      select:  { createdAt: true, actor: true, system: true },
      orderBy: { createdAt: 'asc' },
    }).catch(() => [])

  // Sliding 10-minute window — find max burst density
  let maxBurst = 0
  let burstStart: Date | null = null
  for (let i = 0; i < denied.length; i++) {
    const windowEnd = new Date(denied[i].createdAt.getTime() + WINDOW_MS)
    const count = denied.filter(d => d.createdAt >= denied[i].createdAt && d.createdAt < windowEnd).length
    if (count > maxBurst) { maxBurst = count; burstStart = denied[i].createdAt }
  }

  const isBruteForce = maxBurst >= BRUTE_FORCE_THRESHOLD
  const total        = denied.length

  // Actor spread — many different actors in short window could indicate coordinated
  const uniqueActors = new Set(denied.map(d => d.actor)).size

  const verdict = isBruteForce ? 'CRITICAL' : total > 5 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'sentinel.threat-detection',
    engine:   'ACCESS_SENTINEL',
    verdict,
    summary:  isBruteForce
      ? `CRITICAL: Brute-force pattern detected — ${maxBurst} access denials in a 10-minute window. Possible credential attack.`
      : `Threat scan clean — ${total} total denials (1h), max burst: ${maxBurst}. No attack patterns detected.`,
    findings: [
      `Total access denials (1h): ${total}`,
      `Unique actors: ${uniqueActors}`,
      `Max denials in 10-min window: ${maxBurst} (threshold: ${BRUTE_FORCE_THRESHOLD})`,
      ...(burstStart && isBruteForce ? [`Burst window start: ${burstStart.toISOString()}`] : []),
    ],
    actions:  isBruteForce
      ? ['CRITICAL: Possible brute-force attack — consider rate-limiting ACCESS_DENIED endpoints', 'Review JWT/session configuration immediately']
      : total > 5 ? ['Elevated denial count — monitor for escalation'] : [],
    metadata: { total, maxBurst, uniqueActors, isBruteForce, burstStart: burstStart?.toISOString() ?? null },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
