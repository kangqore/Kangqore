import type { HanumanasName } from '../esf/hanumanas/identity';
// ---------------------------------------------------------------------------
// WaandaDirective — The contract between WAANDA (Supreme Brain) and its subsystems.
//
// Every system in Kangqore has its own local intelligence and reasons
// independently within its domain. WAANDA is the meta-brain: it synthesises
// all local intelligence, sets strategic direction, arbitrates conflicts, and
// has final override authority.
//
// A WaandaDirective is issued only when WAANDA's meta-level view requires
// redirecting a subsystem's local intelligence — not for routine operations.
// ---------------------------------------------------------------------------

import { randomUUID } from 'crypto'

// ---------------------------------------------------------------------------
// Subsystem names
// ---------------------------------------------------------------------------

export type SubsystemName =
  | 'KIMMP'
  | HanumanasName
  | 'KEOS'
  | 'KORE'
  | 'EQORE'
  | 'ALIS'
  | 'VIS'

// ---------------------------------------------------------------------------
// Directive types
// ---------------------------------------------------------------------------

export type DirectiveType =
  | 'ALIGN'           // realign subsystem to a strategic objective
  | 'PAUSE'           // suspend the subsystem's scheduled operations
  | 'RESUME'          // resume a paused subsystem
  | 'FOCUS'           // shift the subsystem's attention to a specific area
  | 'OVERRIDE'        // override a local subsystem decision at the meta level
  | 'REPORT'          // request an immediate intelligence report
  | 'CONFIGURE'       // update subsystem operational configuration

// ---------------------------------------------------------------------------
// Directive — issued by WAANDA, received by a subsystem
// ---------------------------------------------------------------------------

export interface WaandaDirective {
  id:        string
  from:      'WAANDA'
  to:        SubsystemName
  type:      DirectiveType
  payload:   Record<string, unknown>
  reason?:   string
  issuedAt:  Date
  expiresAt?: Date
}

export function createDirective(
  to:       SubsystemName,
  type:     DirectiveType,
  payload:  Record<string, unknown>,
  reason?:  string,
  ttlMs?:   number,
): WaandaDirective {
  const issuedAt = new Date()
  return {
    id:        randomUUID(),
    from:      'WAANDA',
    to,
    type,
    payload,
    reason,
    issuedAt,
    expiresAt: ttlMs ? new Date(issuedAt.getTime() + ttlMs) : undefined,
  }
}

// ---------------------------------------------------------------------------
// DirectiveResult — returned by a subsystem after processing a directive
// ---------------------------------------------------------------------------

export interface DirectiveResult {
  directiveId: string
  subsystem:   SubsystemName
  accepted:    boolean
  detail?:     string
  resolvedAt:  Date
}

// ---------------------------------------------------------------------------
// SubsystemHealth — what each subsystem reports about itself
// ---------------------------------------------------------------------------

export type HealthStatus = 'OPTIMAL' | 'DEGRADED' | 'PAUSED' | 'UNKNOWN'

export interface SubsystemHealth {
  subsystem:   SubsystemName
  status:      HealthStatus
  lastActive:  Date
  metrics:     Record<string, number | string>
}

// ---------------------------------------------------------------------------
// SubsystemIntelligence — the local brain's report to WAANDA's synthesis layer
// ---------------------------------------------------------------------------

export interface SubsystemIntelligence {
  subsystem:   SubsystemName
  summary:     string        // one-sentence state description
  topSignal?:  string        // most important thing this system knows right now
  health:      HealthStatus
  lastActive:  Date
  metrics:     Record<string, number>
}

// ---------------------------------------------------------------------------
// WaandaSubsystem — the contract every system must implement
// ---------------------------------------------------------------------------

export interface WaandaSubsystem {
  readonly name: SubsystemName
  getIntelligence(): SubsystemIntelligence
  receiveDirective(directive: WaandaDirective): Promise<DirectiveResult>
  getHealth(): SubsystemHealth
  pause?(): void
  resume?(): void
}
