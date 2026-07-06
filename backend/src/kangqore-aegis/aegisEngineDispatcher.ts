// ---------------------------------------------------------------------------
// AEGIS Engine Dispatcher — routes triggers → agents → AegisAgentRun.
//
// Phase 2 additions:
//   - After every CRITICAL verdict: propose actions → execute them
//   - After every CRITICAL verdict (unless fromEvent): publish to aegis.critical
//     bus so AegisEventEmitter cascades event.CRITICAL_ACTIVATION agents
//   - Consecutive WARN tracking: 3+ WARNs from same agent → L1 notification
// ---------------------------------------------------------------------------

import './agents/registerAllAgents' // side-effect: registers all 80 agents
import { prisma }                from '../lib/prisma'
import { notifyAegisVerdict }    from './aegisNotifier'
import { AegisActionProposer }   from './aegisActionProposer'
import { AegisActionExecutor }   from './aegisActionExecutor'
import { AegisEventEmitter }     from './aegisEventEmitter'
import {
  agentsForTrigger,
  agentsForEngine,
  getAgent,
  allAgents,
  registryStats,
} from './agents/agentRegistry'
import type { AegisAgentResult, AgentContext } from './agents/types'

// Track consecutive WARN counts per agentId (in-memory, resets on restart)
const warnStreak: Map<string, number> = new Map()

// ---------------------------------------------------------------------------
// Persist a completed agent run to the database
// ---------------------------------------------------------------------------

async function persistRun(result: AegisAgentResult): Promise<void> {
  await (prisma as any).aegisAgentRun.create({
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

// Agent findings go to aegisAgentRun only — NOT to the audit ledger as
// POLICY_VIOLATION events. Audit log POLICY_VIOLATION is reserved for real
// system events (actual access violations, middleware blocks, etc.).
// Writing agent verdicts there created a feedback loop.

// ---------------------------------------------------------------------------
// Core execution helpers
// ---------------------------------------------------------------------------

async function runOne(
  agent: ReturnType<typeof getAgent>,
  ctx:   AgentContext,
): Promise<AegisAgentResult | null> {
  if (!agent) return null
  const start = Date.now()
  try {
    const result    = await agent.run(ctx)
    result.durationMs = Date.now() - start
    result.raisedAt   = new Date().toISOString()

    // Persist + legacy notification (fire & forget)
    await Promise.all([persistRun(result), notifyAegisVerdict(result)])

    // ── Phase 2: action layer ────────────────────────────────────────────────

    if (result.verdict === 'CRITICAL') {
      // Reset WARN streak on CRITICAL
      warnStreak.delete(result.agentId)

      // Propose + execute actions
      const actions = AegisActionProposer.propose(result.agentId, 'CRITICAL')
      if (actions.length > 0) {
        AegisActionExecutor.execute(actions, result).catch(() => {})
      }

      // Cascade: publish to EventBus so event.CRITICAL_ACTIVATION agents fire
      // Skip if this run was itself triggered by an event (anti-loop guard)
      if (!ctx.fromEvent) {
        AegisEventEmitter.onCritical(result).catch(() => {})
      }

    } else if (result.verdict === 'WARN') {
      const streak = (warnStreak.get(result.agentId) ?? 0) + 1
      warnStreak.set(result.agentId, streak)

      // Propose WARN-level actions
      const actions = AegisActionProposer.propose(result.agentId, 'WARN')
      if (actions.length > 0) {
        AegisActionExecutor.execute(actions, result).catch(() => {})
      }

      // 3+ consecutive WARNs → escalate with a notification
      if (streak >= 3) {
        warnStreak.set(result.agentId, 0) // reset after escalation
        AegisActionExecutor.execute([AegisActionProposer.consecutiveWarnAction()], result).catch(() => {})
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

export const AegisEngineDispatcher = {
  /** Run all agents registered for a given trigger (e.g. 'schedule.1h'). */
  async runTrigger(trigger: string, ctx?: Partial<AgentContext>): Promise<AegisAgentResult[]> {
    const agents  = agentsForTrigger(trigger)
    const context: AgentContext = { trigger, ...ctx }
    const results = await Promise.all(agents.map(a => runOne(a, context)))
    return results.filter(Boolean) as AegisAgentResult[]
  },

  /** Run all agents registered to a specific engine. */
  async runEngine(engine: string, ctx?: Partial<AgentContext>): Promise<AegisAgentResult[]> {
    const agents  = agentsForEngine(engine)
    const context: AgentContext = { trigger: 'on-demand', ...ctx }
    const results = await Promise.all(agents.map(a => runOne(a, context)))
    return results.filter(Boolean) as AegisAgentResult[]
  },

  /** Run a single agent by its ID. */
  async runAgent(agentId: string, ctx?: Partial<AgentContext>): Promise<AegisAgentResult | null> {
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
