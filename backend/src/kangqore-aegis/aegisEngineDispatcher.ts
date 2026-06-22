// ---------------------------------------------------------------------------
// AEGIS Engine Dispatcher — routes triggers → agents → AegisAgentRun.
//
// Import this module once at boot (from index.ts / server entry) to ensure
// all 80 agents are registered via the registerAllAgents.ts side-effect.
// ---------------------------------------------------------------------------

import './agents/registerAllAgents' // side-effect: registers all 80 agents
import { prisma }              from '../lib/prisma'
import { notifyAegisVerdict }  from './aegisNotifier'
import {
  agentsForTrigger,
  agentsForEngine,
  getAgent,
  allAgents,
  registryStats,
} from './agents/agentRegistry'
import type { AegisAgentResult, AgentContext } from './agents/types'

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
// Writing agent verdicts there created a feedback loop: agents read their
// own POLICY_VIOLATION entries and escalated indefinitely.

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
    await Promise.all([persistRun(result), notifyAegisVerdict(result)])
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
