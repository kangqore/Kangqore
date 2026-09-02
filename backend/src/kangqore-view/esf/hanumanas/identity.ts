// ---------------------------------------------------------------------------
// Canonical identity for the HANUMANAS governance layer.
//
// Before the 2026-09-02 rename (was AEGIS), the name lived only as scattered
// string literals — `shield: 'AEGIS'`, `name: 'AEGIS'`, `actorType: 'AEGIS'`,
// log prefixes, LLM prompts. This module is the single source of truth: change
// the name here and every response field, WAANDA registration, actor tag and
// system prompt follows.
// ---------------------------------------------------------------------------

export const HANUMANAS = {
  /** Subsystem code — WAANDA registry key, `actorType` value, response `shield` field. */
  name: 'HANUMANAS',
  /** Human-readable full name. A description, not an acronym. */
  fullName: 'Kangqore Autonomous Executive Governance & Intelligence Shield',
  /** Descriptor without the "Kangqore" prefix — for LLM system prompts. */
  descriptor: 'Autonomous Executive Governance & Intelligence Shield',
  /** Mount point of the ADMIN sovereignty-dashboard API. */
  routeBase: '/api/admin/hanumanas',
  /** Namespace for socket events, the KEOS event bus, and redis keys. */
  channel: 'hanumanas',
  /** Log-line prefix. */
  logPrefix: '[HANUMANAS]',
} as const

/** The literal subsystem name — `'HANUMANAS'`. */
export type HanumanasName = typeof HANUMANAS.name
