// Canonical identity for the HANUMANAS governance layer, frontend side.
// Mirrors backend/src/kangqore-view/esf/hanumanas/identity.ts — keep the two
// in sync. (Was AEGIS until 2026-09-02.)

export const HANUMANAS = {
  /** Subsystem code — WAANDA registry, actorType, notification-title prefix. */
  name: 'HANUMANAS',
  /** Display label in the OS shell. */
  label: 'HANUMANAS',
  /** Human-readable full name. */
  fullName: 'Kangqore Autonomous Executive Governance & Intelligence Shield',
  /** OS route base for the feature module. */
  routeBase: '/kangqore-view/admin/hanumanas',
  /** API base. */
  apiBase: '/api/admin/hanumanas',
  /** Nav group id (see os/lib/nav.ts). */
  navId: 'hanumanas',
  /** Socket-event / query-key namespace. */
  channel: 'hanumanas',
} as const

/** The literal subsystem name — `'HANUMANAS'`. */
export type HanumanasName = typeof HANUMANAS.name
