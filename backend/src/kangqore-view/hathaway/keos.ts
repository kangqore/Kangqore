// HATHAWAY — Kangqore Enterprise Operating System (KEOS)
//
// The OS shell layer: mission kernel, capability registry, workspace portals.
// It has always been built; it just had no name in code. The README named it
// HATHAWAY while the implementation called itself KEOS or nothing at all, so
// nothing could reference it, register it, or check it.
//
// This module is that name. It declares nothing new — every workspace and
// capability below already exists, and `scripts/audit-hathaway-manifest.mjs`
// fails the build if this manifest drifts from the files and registry it
// claims to describe. A manifest that cannot go stale is worth having; one
// that can is just a second place to be wrong.
//
// Sits alongside its siblings in the Kangqore subsystem set:
//   HATHAWAY (KEOS)  — the shell you operate in            ← this file
//   NOLAN            — the ontology (ROBERT + ALFRED)
//   HANUMANAS            — governance, audit, policy
//   KIMMP / WAANDA   — the intelligence within the shell

export const HATHAWAY = 'HATHAWAY' as const

export interface KeosWorkspace {
  /** Stable id used by the capability registry and routing. */
  id: string
  displayName: string
  /** Component file under frontend/src/os/runtime/portals/ — verified by the audit. */
  component: string
  /** Capability a principal must hold to enter, where the workspace gates on one. */
  capability?: string
}

/**
 * The nine workspace portals. Order is presentational, not a hierarchy.
 */
export const KEOS_WORKSPACES: KeosWorkspace[] = [
  { id: 'executive',     displayName: 'Executive',               component: 'ExecutiveWorkspace.tsx' },
  { id: 'operations',    displayName: 'Operations',              component: 'OperationsWorkspace.tsx',              capability: 'cap.ops.execute' },
  { id: 'revenue',       displayName: 'Revenue',                 component: 'RevenueWorkspace.tsx' },
  { id: 'intelligence',  displayName: 'Enterprise Intelligence', component: 'EnterpriseIntelligenceWorkspace.tsx',  capability: 'cap.ai.analyze' },
  { id: 'governance',    displayName: 'Governance',              component: 'GovernanceWorkspace.tsx' },
  { id: 'collaboration', displayName: 'Collaboration',           component: 'CollaborationWorkspace.tsx',           capability: 'cap.collab.facilitate' },
  { id: 'platform',      displayName: 'Platform',                component: 'PlatformWorkspace.tsx',                capability: 'cap.platform.admin' },
  { id: 'ecosystem',     displayName: 'Ecosystem',               component: 'EcosystemWorkspace.tsx',               capability: 'cap.ecosystem.manage' },
  { id: 'personal',      displayName: 'Personal',                component: 'PersonalWorkspace.tsx' },
]

/**
 * The `cap.*` capability registry.
 *
 * Authoritative copy lives in frontend/src/os/OSBootstrap.tsx (ROLE_POLICIES),
 * because that is where it is enforced. This mirror exists so backend code can
 * name a capability without hardcoding a string, and the audit fails if the two
 * ever diverge.
 */
export const KEOS_CAPABILITIES = [
  // AI / reasoning
  'cap.ai.plan',
  'cap.ai.forecast',
  'cap.ai.simulate',
  'cap.ai.analyze',
  // Operations
  'cap.ops.read',
  'cap.ops.execute',
  'cap.projects.manage',
  'cap.assets.read',
  'cap.supply.read',
  // Revenue
  'cap.revenue.read',
  'cap.pipeline.manage',
  'cap.deals.approve',
  'cap.forecast.read',
  'cap.pricing.manage',
  // Platform / collaboration / ecosystem
  'cap.collab.facilitate',
  'cap.platform.admin',
  'cap.ecosystem.manage',
] as const

export type KeosCapability = (typeof KEOS_CAPABILITIES)[number]

export function isKeosCapability(value: string): value is KeosCapability {
  return (KEOS_CAPABILITIES as readonly string[]).includes(value)
}

export function getWorkspace(id: string): KeosWorkspace | undefined {
  return KEOS_WORKSPACES.find(w => w.id === id)
}

/** Workspaces reachable by a principal holding these capabilities. */
export function workspacesFor(capabilities: string[]): KeosWorkspace[] {
  return KEOS_WORKSPACES.filter(w => !w.capability || capabilities.includes(w.capability))
}

export const KEOS = {
  subsystem: HATHAWAY,
  name: 'Kangqore Enterprise Operating System',
  acronym: 'KEOS',
  workspaces: KEOS_WORKSPACES,
  capabilities: KEOS_CAPABILITIES,
  getWorkspace,
  workspacesFor,
  isKeosCapability,
}
