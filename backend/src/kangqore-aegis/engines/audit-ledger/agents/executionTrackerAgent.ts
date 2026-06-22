import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SLOW_MS = 30_000   // warn if any activation takes > 30s
const FAST_MS = 100      // suspicious if < 100ms (possible mock/short-circuit)

export async function runExecutionTrackerAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const events: Array<{ durationMs: number | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last24h } },
      select: { durationMs: true },
    }).catch(() => [])

  const withDuration = events.filter(e => e.durationMs !== null)
  const total        = events.length
  const slow         = withDuration.filter(e => e.durationMs! > SLOW_MS).length
  const fast         = withDuration.filter(e => e.durationMs! < FAST_MS).length
  const durations    = withDuration.map(e => e.durationMs!)
  const avgMs        = durations.length > 0 ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length) : 0
  const maxMs        = durations.length > 0 ? Math.max(...durations) : 0

  const verdict = slow > 0 ? 'WARN' : 'PASS'

  return {
    agentId:   'audit.execution-tracker',
    engine:    'AUDIT_LEDGER',
    verdict,
    summary:   slow > 0
      ? `${slow} KIMMP activations took >${SLOW_MS / 1000}s in the last 24h. Performance investigation needed.`
      : `Execution health normal. Avg: ${avgMs}ms, Max: ${maxMs}ms across ${total} activations.`,
    findings: [
      `ACTIVATION events (24h): ${total}`,
      `With duration recorded: ${withDuration.length}`,
      `Average duration: ${avgMs}ms`,
      `Maximum duration: ${maxMs}ms`,
      `Slow (>${SLOW_MS / 1000}s): ${slow}`,
      `Suspiciously fast (<${FAST_MS}ms): ${fast}`,
    ],
    actions:   slow > 0 ? [`${slow} slow executions — check KIMMP agent timeout handling`] : [],
    metadata:  { total, avgMs, maxMs, slow, fast, slowThresholdMs: SLOW_MS },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
