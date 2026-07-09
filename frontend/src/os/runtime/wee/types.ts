// WEE Constitutional Types — Generation III Runtime
// WAANDA Experience Engine: projection contracts, policies, and state mirror.
// Constitutional Law: WEE never reasons, never creates enterprise intelligence.

export type ProjectionScope = 'PERSONAL' | 'EXECUTIVE' | 'REVENUE'

export type CognitivePhase = 'OBSERVE' | 'UNDERSTAND' | 'DECIDE' | 'ACT' | 'LEARN'

// Owned entirely by WAANDA. WEE reads but never modifies or enriches.
export interface WaandaCognitiveState {
  phase: CognitivePhase
  bootStatus: 'BOOTING' | 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE'
  bootedAt: string | null
  phases: Array<{ name: string; status: 'PASS' | 'WARN' | 'ERROR'; duration?: number }>
  activeCapabilities: string[]
  subsystems: Record<string, string>
  domains: Array<{ id: string; name: string; ready: boolean; capabilities?: number; goals?: number }>
  kimmSynthesis: string | null
  systemBriefings: Array<{
    id: string
    summary: string
    priority: string
    confidence: number
    keyFindings?: string[]
    recommendations?: string[]
    alerts?: string[]
  }>
  pendingDecisions: Array<{ id: string; actionType: string; description: string; level: number }>
  relationshipIntelligence: {
    liveSessions: Array<{
      id: string
      trustScore: number
      lastAction: string
      company?: string
      name?: string
    }>
    evidenceLedger: Array<{
      id: string
      factKey: string
      factValue: string
      confidence: number
      visitor: string
    }>
  }
  lastSynced: Date | null
  confidence: number
}

// Defines what projection a workspace requires.
// Layer: above WEE, below WAANDA.
export interface ExperienceContract {
  id: string
  projectionScope: ProjectionScope
  persona: 'OPERATOR' | 'EXECUTIVE' | 'REVENUE_LEAD'
  requiredCapabilities: string[]
  context: Record<string, unknown>
}

// Constrains what WEE may project — RBAC, security classification, level of detail.
export interface ProjectionPolicy {
  allowedCapabilities: string[]
  redactedFields: string[]
  levelOfDetail: 'SUMMARY' | 'STANDARD' | 'DETAILED' | 'FULL'
  securityClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED'
  device: 'DESKTOP' | 'MOBILE' | 'AR' | 'VOICE' | 'AGENT'
}

// WEE's only output. No React. No UI framework knowledge. No widget types.
export interface ExperienceModel {
  projectionScope: ProjectionScope
  projectedAt: Date
  cognitivePhase: CognitivePhase
  payload: Record<string, unknown>
  confidence: number
}

// Adapters adapt WaandaCognitiveState into a projected payload.
// Constitutional rule: adapters never fetch independently from any external source.
export interface CognitiveStateAdapter {
  projectionScope: ProjectionScope
  adapt(
    waandaState: WaandaCognitiveState,
    contract: ExperienceContract,
    policy: ProjectionPolicy
  ): Promise<Record<string, unknown>>
}

export const DEFAULT_PROJECTION_POLICY: ProjectionPolicy = {
  allowedCapabilities: [],
  redactedFields: [],
  levelOfDetail: 'STANDARD',
  securityClassification: 'INTERNAL',
  device: 'DESKTOP',
}

export const EMPTY_WAANDA_STATE: WaandaCognitiveState = {
  phase: 'OBSERVE',
  bootStatus: 'OFFLINE',
  bootedAt: null,
  phases: [],
  activeCapabilities: [],
  subsystems: {},
  domains: [],
  kimmSynthesis: null,
  systemBriefings: [],
  pendingDecisions: [],
  relationshipIntelligence: { liveSessions: [], evidenceLedger: [] },
  lastSynced: null,
  confidence: 0,
}
