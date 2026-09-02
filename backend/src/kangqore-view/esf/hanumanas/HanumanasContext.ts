// ---------------------------------------------------------------------------
// HANUMANAS Request Context — AsyncLocalStorage correlation bridge
//
// Solves the three-surface incoherence: HTTP middleware, MissionDispatcher, and
// KoreRuntimeManager all call HanumanasShield / HanumanasLedger independently with no
// shared identifier. Any code that runs in the async continuation of an HTTP
// request can now call getCorrelationId() and get the same ID that was stamped
// at the HTTP boundary — without any signature changes to downstream callers.
//
// Flow for a KIMMP mutation:
//   hanumanasAccessLogger   → hanumanasStorage.run(ctx, next)     ← ID born here
//   hanumanasEgressMonitor  →                                  ← same context
//   kangqoreImmpRoutes  →                                  ← same context
//   MissionDispatcher   → HanumanasShield.writeToLedger(...)  ← ID read here
//   KoreRuntimeManager  → HanumanasShield.writeToLedger(...)  ← ID read here
//
// Background jobs (no HTTP origin) call getCorrelationId() → undefined.
// Their ledger entries are written without a correlationId — correct behavior.
// ---------------------------------------------------------------------------

import { AsyncLocalStorage } from 'node:async_hooks'

export interface HanumanasRequestContext {
  correlationId: string
  requesterId:   string
  httpSurface:   'hanumanas' | 'kimmp' | 'unknown'
}

export const hanumanasStorage = new AsyncLocalStorage<HanumanasRequestContext>()

export function getHanumanasContext(): HanumanasRequestContext | undefined {
  return hanumanasStorage.getStore()
}

export function getCorrelationId(): string | undefined {
  return hanumanasStorage.getStore()?.correlationId
}

// Generates a correlation ID that is short, human-readable in logs, and unique
// enough for audit purposes within a single process lifetime.
export function generateCorrelationId(): string {
  const ts  = Date.now().toString(36).toUpperCase()
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `AEG_${ts}_${rnd}`
}
