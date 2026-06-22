import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const RUNAWAY_THRESHOLD = 20 // > 20 autonomous events in any 1h window is suspicious

export async function runRunawayDetectorAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start    = Date.now()
  const last6h   = new Date(Date.now() - 6 * 3_600_000)

  // Check for high-frequency autonomous events in rolling 1h windows over last 6h
  const events: Array<{ createdAt: Date }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { autonomous: true, createdAt: { gte: last6h } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }).catch(() => [])

  // Slide a 1h window across events
  let maxInWindow = 0
  for (let i = 0; i < events.length; i++) {
    const windowStart = events[i].createdAt.getTime()
    const windowEnd   = windowStart + 3_600_000
    const inWindow    = events.filter(e =>
      e.createdAt.getTime() >= windowStart && e.createdAt.getTime() <= windowEnd
    ).length
    if (inWindow > maxInWindow) maxInWindow = inWindow
  }

  const total6h  = events.length
  const runaway  = maxInWindow > RUNAWAY_THRESHOLD
  const verdict  = runaway ? 'CRITICAL' : maxInWindow > RUNAWAY_THRESHOLD * 0.7 ? 'WARN' : 'PASS'

  return {
    agentId:   'autonomy.runaway-detector',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   runaway
      ? `RUNAWAY DETECTED: ${maxInWindow} autonomous events in a single 1h window (threshold: ${RUNAWAY_THRESHOLD}).`
      : `No runaway loops detected. Peak: ${maxInWindow} autonomous events/hour over last 6h.`,
    findings: [
      `Autonomous events (6h): ${total6h}`,
      `Peak events in any 1h window: ${maxInWindow}`,
      `Runaway threshold: ${RUNAWAY_THRESHOLD}/hour`,
      runaway ? 'RUNAWAY LOOP CONDITION MET' : 'Within normal bounds',
    ],
    actions:   runaway
      ? ['IMMEDIATE: Investigate KIMMP LoopScheduler — possible runaway cascade', 'Check MetaBriefingScheduler cadence']
      : [],
    metadata:  { total6h, maxInWindow, threshold: RUNAWAY_THRESHOLD, runaway },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
