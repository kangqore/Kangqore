// ---------------------------------------------------------------------------
// AEGIS Memory — per-agent historical context for governance decisions.
//
// Before an agent fires actions, it can read its own recent verdict trajectory
// to inform the LLM decision layer. This prevents amnesia: the LLM knows if
// this agent has been CRITICAL for 3 consecutive hours or just WARN for weeks.
//
// Also captures (verdict, action, resolution) tuples after Sprint 3 rechecks
// so the learning loop can evaluate whether actions were effective.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma'

export interface AgentMemoryEntry {
  verdict:    string
  summary:    string
  raisedAt:   string
  durationMs: number
}

export interface AgentOutcomeTuple {
  agentId:        string
  initialVerdict: string
  initialSummary: string
  actionsTaken:   string[]   // action types that fired
  recheckVerdict: string     // what the 60s recheck returned
  resolved:       boolean    // true if recheckVerdict !== 'CRITICAL'
  resolvedAt:     string
}

// ── Read path — recent verdict history for an agent ───────────────────────

/**
 * Returns the last N runs for a given agent, most recent first.
 * Used by the LLM proposer to understand the agent's recent trajectory.
 */
export async function getAgentHistory(
  agentId: string,
  limit    = 5,
): Promise<AgentMemoryEntry[]> {
  try {
    const rows = await (prisma as any).aegisAgentRun.findMany({
      where:   { agentId },
      orderBy: { raisedAt: 'desc' },
      take:    limit,
      select:  { verdict: true, summary: true, raisedAt: true, durationMs: true },
    })
    return rows.map((r: any) => ({
      verdict:    r.verdict,
      summary:    r.summary,
      raisedAt:   r.raisedAt?.toISOString() ?? '',
      durationMs: r.durationMs ?? 0,
    }))
  } catch {
    return []
  }
}

/**
 * Returns a compact trajectory string for embedding into the LLM system prompt.
 * e.g. "Recent history: CRITICAL (2h ago), WARN (8h ago), PASS (1d ago)"
 */
export async function getAgentTrajectory(agentId: string): Promise<string> {
  const history = await getAgentHistory(agentId, 5)
  if (history.length === 0) return 'No prior history for this agent.'

  const now = Date.now()
  const lines = history.map(h => {
    const ageMs  = now - new Date(h.raisedAt).getTime()
    const ageStr = ageMs < 3_600_000
      ? `${Math.round(ageMs / 60_000)}m ago`
      : ageMs < 86_400_000
      ? `${Math.round(ageMs / 3_600_000)}h ago`
      : `${Math.round(ageMs / 86_400_000)}d ago`
    return `${h.verdict} (${ageStr})`
  })
  return `Recent history: ${lines.join(', ')}`
}

// ── Write path — outcome tuples after Sprint 3 rechecks ───────────────────

/**
 * Records a (verdict, action, recheck-outcome) tuple for the learning loop.
 * Called by the Sprint 3 re-evaluate logic after the 60s recheck completes.
 * Stored in HanumanasActionLog with actionType = 'OUTCOME_RECORD'.
 */
export async function recordOutcome(tuple: AgentOutcomeTuple): Promise<void> {
  await (prisma as any).aegisActionLog.create({
    data: {
      actionType: 'OUTCOME_RECORD',
      level:      0,
      agentId:    tuple.agentId,
      engine:     'MEMORY',
      params:     {
        initialVerdict: tuple.initialVerdict,
        recheckVerdict: tuple.recheckVerdict,
        actionsTaken:   tuple.actionsTaken,
        resolved:       tuple.resolved,
      },
      result:  { resolved: tuple.resolved, resolvedAt: tuple.resolvedAt },
      status:  'SUCCESS',
    },
  }).catch(() => {})
}

/**
 * Returns outcome tuples for a given agent — useful for evaluating
 * whether past actions were effective (e.g. REVOKE_SESSION → resolved in 60s?).
 */
export async function getAgentOutcomes(agentId: string, limit = 10): Promise<AgentOutcomeTuple[]> {
  try {
    const rows = await (prisma as any).aegisActionLog.findMany({
      where:   { agentId, actionType: 'OUTCOME_RECORD' },
      orderBy: { executedAt: 'desc' },
      take:    limit,
    })
    return rows.map((r: any) => ({
      agentId:        r.agentId,
      initialVerdict: r.params?.initialVerdict ?? '',
      initialSummary: '',
      actionsTaken:   r.params?.actionsTaken ?? [],
      recheckVerdict: r.params?.recheckVerdict ?? '',
      resolved:       r.params?.resolved ?? false,
      resolvedAt:     r.result?.resolvedAt ?? r.executedAt?.toISOString() ?? '',
    }))
  } catch {
    return []
  }
}
