// ---------------------------------------------------------------------------
// AEGIS Request Context — AsyncLocalStorage correlation bridge
//
// Solves the three-surface incoherence: HTTP middleware, MissionDispatcher, and
// KoreRuntimeManager all call AegisShield / AegisLedger independently with no
// shared identifier. Any code that runs in the async continuation of an HTTP
// request can now call getCorrelationId() and get the same ID that was stamped
// at the HTTP boundary — without any signature changes to downstream callers.
//
// Flow for a KIMMP mutation:
//   aegisAccessLogger   → aegisStorage.run(ctx, next)     ← ID born here
//   aegisEgressMonitor  →                                  ← same context
//   kangqoreImmpRoutes  →                                  ← same context
//   MissionDispatcher   → AegisShield.writeToLedger(...)  ← ID read here
//   KoreRuntimeManager  → AegisShield.writeToLedger(...)  ← ID read here
//
// Background jobs (no HTTP origin) call getCorrelationId() → undefined.
// Their ledger entries are written without a correlationId — correct behavior.
// ---------------------------------------------------------------------------

import { AsyncLocalStorage } from 'node:async_hooks'

export interface AegisRequestContext {
  correlationId: string
  requesterId:   string
  httpSurface:   'aegis' | 'kimmp' | 'unknown'
}

export const aegisStorage = new AsyncLocalStorage<AegisRequestContext>()

export function getAegisContext(): AegisRequestContext | undefined {
  return aegisStorage.getStore()
}

export function getCorrelationId(): string | undefined {
  return aegisStorage.getStore()?.correlationId
}

// Generates a correlation ID that is short, human-readable in logs, and unique
// enough for audit purposes within a single process lifetime.
export function generateCorrelationId(): string {
  const ts  = Date.now().toString(36).toUpperCase()
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `AEG_${ts}_${rnd}`
}
