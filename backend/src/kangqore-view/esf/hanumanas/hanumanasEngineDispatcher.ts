// ---------------------------------------------------------------------------
// AEGIS Engine Dispatcher — routes triggers → agents → HanumanasAgentRun.
//
// Phase 2 additions:
//   - After every CRITICAL verdict: propose actions → execute them
//   - After every CRITICAL verdict (unless fromEvent): publish to aegis.critical
//     bus so HanumanasEventEmitter cascades event.CRITICAL_ACTIVATION agents
//   - Consecutive WARN tracking: 3+ WARNs from same agent → L1 notification
// ---------------------------------------------------------------------------

import './agents/registerAllAgents' // side-effect: registers all 80 agents
import { prisma }                from '../../../lib/prisma'
import { notifyHanumanasVerdict }    from './hanumanasNotifier'
import { HanumanasActionProposer }   from './hanumanasActionProposer'
import { HanumanasActionExecutor }   from './hanumanasActionExecutor'
import { HanumanasEventEmitter }     from './hanumanasEventEmitter'
import { runHanumanasDebatePhase }   from './hanumanasDebatePhase'
import { emitToAdmins }          from '../../../socket'
import {
  agentsForTrigger,
  agentsForEngine,
  getAgent,
  allAgents,
  registryStats,
} from './agents/agentRegistry'
import type { HanumanasAgentResult, AgentContext } from './agents/types'

// Track consecutive WARN counts per agentId (in-memory, resets on restart)
const warnStreak: Map<string, number> = new Map()

// Tracks agentIds with a pending 60s re-check — prevents stacking rechecks
const recheckPending: Set<string> = new Set()

// ---------------------------------------------------------------------------
// Persist a completed agent run to the database
// ---------------------------------------------------------------------------

async function persistRun(result: HanumanasAgentResult): Promise<void> {
  await (prisma as any).hanumanasAgentRun.create({
    data: {
      agentId:    result.agentId,
      engine:     result.engine,
      verdict:    result.verdict,
      summary:    result.summary,
      findings:   result.findings,
      actions:    result.actions,
      metadata:   result.metadata as any,
      durationMs: result.durationMs,
      raisedAt:   result.raisedAt ? new Date(result.raisedAt) : new Date(),
    },
  }).catch(() => {}) // best-effort — never block the caller
}

// Agent findings go to hanumanasAgentRun only — NOT to the audit ledger as
// POLICY_VIOLATION events. Audit log POLICY_VIOLATION is reserved for real
// system events (actual access violations, middleware blocks, etc.).
// Writing agent verdicts there created a feedback loop.

// ---------------------------------------------------------------------------
// Core execution helpers
// ---------------------------------------------------------------------------

async function runOne(
  agent: ReturnType<typeof getAgent>,
  ctx:   AgentContext,
): Promise<HanumanasAgentResult | null> {
  if (!agent) return null
  const start = Date.now()
  try {
    const result    = await agent.run(ctx)
    result.durationMs = Date.now() - start
    result.raisedAt   = new Date().toISOString()

    // Persist + legacy notification (fire & forget)
    await Promise.all([persistRun(result), notifyHanumanasVerdict(result)])

    // ── Phase 2: action layer ────────────────────────────────────────────────

    if (result.verdict === 'CRITICAL') {
      // Reset WARN streak on CRITICAL
      warnStreak.delete(result.agentId)

      // Propose + execute actions (LLM first, fallback to hardcoded map)
      HanumanasActionProposer.propose(result).then(actions => {
        if (actions.length > 0) {
          HanumanasActionExecutor.execute(actions, result).catch(() => {})
        }
      }).catch(() => {})

      // Cascade: publish to EventBus so event.CRITICAL_ACTIVATION agents fire
      // Skip if this run was itself triggered by an event (anti-loop guard)
      if (!ctx.fromEvent) {
        HanumanasEventEmitter.onCritical(result).catch(() => {})
      }

      // Sprint 3 — Observe → Re-evaluate loop.
      // Schedule a single 60s re-check. If still CRITICAL → escalate.
      // If resolved → log the resolution. Never stacks rechecks on top of rechecks.
      if (!ctx.fromEvent && !ctx.isRecheck && !recheckPending.has(result.agentId)) {
        recheckPending.add(result.agentId)
        setTimeout(() => {
          recheckPending.delete(result.agentId)
          const agent = getAgent(result.agentId)
          if (!agent) return
          runOne(agent, { ...ctx, isRecheck: true, fromEvent: true }).then(recheckResult => {
            if (!recheckResult) return
            if (recheckResult.verdict === 'CRITICAL') {
              // Still CRITICAL — explicit L2 escalation beyond the normal action pipeline
              HanumanasActionExecutor.execute([{
                type:        'SEND_ALERT_EMAIL',
                level:       2,
                params:      { subject: `AEGIS ESCALATION: ${result.agentId} still CRITICAL after 60s` },
                description: `${result.agentId} returned CRITICAL on re-evaluation — threat unresolved`,
              }, {
                type:        'CREATE_NOTIFICATION',
                level:       1,
                params:      { priority: 'CRITICAL' },
                description: `Re-check confirmed: ${result.agentId} threat still active`,
              }], recheckResult).catch(() => {})
            } else {
              // Threat resolved — log the resolution
              HanumanasActionExecutor.execute([{
                type:        'LOG_AUDIT_ENTRY',
                level:       0,
                params:      { resolution: 'CRITICAL_RESOLVED', previousVerdict: 'CRITICAL', newVerdict: recheckResult.verdict },
                description: `${result.agentId} resolved after 60s: ${recheckResult.verdict}`,
              }, {
                type:        'EMIT_SOCKET',
                level:       0,
                params:      { event: 'aegis:critical-resolved', agentId: result.agentId, resolvedTo: recheckResult.verdict },
                description: 'Broadcast threat resolution to admin dashboard',
              }], recheckResult).catch(() => {})
            }
          }).catch(() => {})
        }, 60_000)
      }

    } else if (result.verdict === 'WARN') {
      const streak = (warnStreak.get(result.agentId) ?? 0) + 1
      warnStreak.set(result.agentId, streak)

      // Propose WARN-level actions (LLM first, fallback to hardcoded map)
      HanumanasActionProposer.propose(result).then(actions => {
        if (actions.length > 0) {
          HanumanasActionExecutor.execute(actions, result).catch(() => {})
        }
      }).catch(() => {})

      // 3+ consecutive WARNs → escalate with a notification
      if (streak >= 3) {
        warnStreak.set(result.agentId, 0) // reset after escalation
        HanumanasActionExecutor.execute([HanumanasActionProposer.consecutiveWarnAction()], result).catch(() => {})
      }

    } else {
      // PASS / INFO — reset WARN streak
      warnStreak.delete(result.agentId)
    }

    return result
  } catch (err) {
    console.error(`[AEGIS] agent ${agent.id} threw:`, err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const HanumanasEngineDispatcher = {
  /** Run all agents registered for a given trigger (e.g. 'schedule.1h'). */
  async runTrigger(trigger: string, ctx?: Partial<AgentContext>): Promise<HanumanasAgentResult[]> {
    const agents  = agentsForTrigger(trigger)
    const context: AgentContext = { trigger, ...ctx }
    const results = (await Promise.all(agents.map(a => runOne(a, context)))).filter(Boolean) as HanumanasAgentResult[]

    // Sprint 4 — Cross-agent debate: 3+ CRITICALs from different engines
    const criticals = results.filter(r => r.verdict === 'CRITICAL')
    const engines   = new Set(criticals.map(r => r.engine))
    if (criticals.length >= 3 && engines.size >= 2 && !ctx?.fromEvent) {
      runHanumanasDebatePhase(criticals).then(debate => {
        if (!debate.debateRan) return
        emitToAdmins('aegis:debate:verdict', {
          unifiedVerdict:   debate.unifiedVerdict,
          arbitration:      debate.arbitration,
          agentCount:       criticals.length,
          engines:          [...engines],
          debatedAt:        new Date().toISOString(),
        })
        if (debate.recommendedAction) {
          HanumanasActionExecutor.execute([debate.recommendedAction], criticals[0]).catch(() => {})
        }
      }).catch(() => {})
    }

    return results
  },

  /** Run all agents registered to a specific engine. */
  async runEngine(engine: string, ctx?: Partial<AgentContext>): Promise<HanumanasAgentResult[]> {
    const agents  = agentsForEngine(engine)
    const context: AgentContext = { trigger: 'on-demand', ...ctx }
    const results = await Promise.all(agents.map(a => runOne(a, context)))
    return results.filter(Boolean) as HanumanasAgentResult[]
  },

  /** Run a single agent by its ID. */
  async runAgent(agentId: string, ctx?: Partial<AgentContext>): Promise<HanumanasAgentResult | null> {
    const agent   = getAgent(agentId)
    const context: AgentContext = { trigger: 'on-demand', ...ctx }
    return runOne(agent, context)
  },

  /** Return all registered agents (for API exposure). */
  listAgents() {
    return allAgents().map(({ id, name, engine, description, triggers, usesLLM, phase }) => ({
      id, name, engine, description, triggers, usesLLM, phase,
    }))
  },

  registryStats,
}
