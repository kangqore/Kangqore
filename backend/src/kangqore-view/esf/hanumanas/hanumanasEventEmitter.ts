// ---------------------------------------------------------------------------
// AEGIS Event Emitter — activates the dormant event-trigger system.
//
// Phase 1 defined event triggers (event.CRITICAL_ACTIVATION, event.ACCESS_DENIED,
// event.POLICY_VIOLATION) in AgentTrigger but never fired them. This module
// wires them up by subscribing to the EventBus and calling runTrigger().
//
// Anti-loop guard: results from event-triggered runs set fromEvent=true so
// the dispatcher skips re-emission — no cascade feedback loop.
// ---------------------------------------------------------------------------

import { getEventBus }  from '../../../lib/eventBus'
import type { AegisAgentResult, AgentContext } from './agents/types'

export const AegisEventEmitter = {
  /** Call once at boot from aegisEngineDispatcher or index.ts. */
  async init(): Promise<void> {
    const bus = await getEventBus()

    bus.subscribe<AegisAgentResult>('aegis.critical', async (result) => {
      try {
        // Lazy import avoids circular dep at module load time
        const { AegisEngineDispatcher } = await import('./hanumanasEngineDispatcher')
        await AegisEngineDispatcher.runTrigger('event.CRITICAL_ACTIVATION', {
          fromEvent: true,
          metadata:  { triggeredBy: result.agentId, engine: result.engine, verdict: result.verdict },
        })
      } catch (err: any) {
        console.error('[AEGIS:EMITTER] cascade error:', err?.message)
      }
    })

    console.log('[AEGIS] EventEmitter initialised — cascading on aegis.critical')
  },

  /** Fire event.CRITICAL_ACTIVATION after a CRITICAL verdict (called from dispatcher). */
  async onCritical(result: AegisAgentResult): Promise<void> {
    try {
      const bus = await getEventBus()
      await bus.publish('aegis.critical', result)
    } catch { /* non-blocking */ }
  },

  /** Fire event.ACCESS_DENIED trigger (called from aegisShield deny path). */
  async fireAccessDenied(ctx: Partial<AgentContext>): Promise<void> {
    try {
      const { AegisEngineDispatcher } = await import('./hanumanasEngineDispatcher')
      await AegisEngineDispatcher.runTrigger('event.ACCESS_DENIED', {
        fromEvent: true,
        ...ctx,
      })
    } catch { /* non-blocking */ }
  },

  /** Fire event.POLICY_VIOLATION trigger (called from policy evaluation path). */
  async firePolicyViolation(ctx: Partial<AgentContext>): Promise<void> {
    try {
      const { AegisEngineDispatcher } = await import('./hanumanasEngineDispatcher')
      await AegisEngineDispatcher.runTrigger('event.POLICY_VIOLATION', {
        fromEvent: true,
        ...ctx,
      })
    } catch { /* non-blocking */ }
  },
}
