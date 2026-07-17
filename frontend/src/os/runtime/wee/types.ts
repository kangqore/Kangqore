// WEE Constitutional Types — Generation III Runtime
// WAANDA Experience Engine: projection contracts, policies, and state mirror.
// Constitutional Law: WEE never reasons, never creates enterprise intelligence.

// ── WEE Constitution v1.2 — Approved 2026-07-09 ─────────────────────────────
// Named constants make the laws traceable in code, greppable, and statically
// verifiable by the Constitutional Certification Suite.
export const CONSTITUTIONAL_LAW_1 =
  'WAANDA is the sole authority permitted to create, modify, or own Enterprise Cognitive State; WEE may only transform that state into experience projections and must never derive new business intelligence or make executive decisions'

export const CONSTITUTIONAL_LAW_2 =
  'No layer below WAANDA may infer, enrich, reinterpret, or synthesize Enterprise Cognitive State; all lower layers are projections of WAANDA authoritative cognition constrained by Experience Contracts and Projection Policies'

export const CONSTITUTIONAL_LAW_3 =
  'No workspace, widget, or UI component may consume enterprise data directly; every user-visible state must be composed and projected by WEE from WAANDA live cognitive state'
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectionScope =
  | 'PERSONAL' | 'EXECUTIVE' | 'REVENUE' | 'FINANCE' | 'HR'
  | 'OPERATIONS' | 'INTELLIGENCE' | 'PLATFORM'
  | 'COLLABORATION' | 'GOVERNANCE' | 'ECOSYSTEM'

export type CognitivePhase = 'OBSERVE' | 'UNDERSTAND' | 'DECIDE' | 'ACT' | 'LEARN'

// Owned entirely by WAANDA. WEE reads but never modifies or enriches.
export interface WaandaCognitiveState {
  phase: CognitivePhase
  bootStatus: 'BOOTING' | 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE'
  bootedAt: string | null
  phases: Array<{ name: string; status: 'PASS' | 'WARN' | 'ERROR'; duration?: number }>
  activeCapabilities: string[]
  subsystems: Record<string, string>
  domains: Array<{
    id: string
    name: string
    version?: string
    purpose?: string
    ready: boolean
    capabilities?: number
    goals?: number
    objects?: number
    kpis?: Array<{ id: string; name: string; target: number; current: number }>
  }>
  enterprisePredictions: Array<{
    id: string
    target: string
    horizon: string
    confidence: number
    state: string
    outcome: { forecastedValue: number | string | boolean; unit?: string; isAnomaly?: boolean }
    driftDetected: boolean
    loggedAt: string
  }>
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
  enterpriseGoals: Array<{
    goalId: string
    domainId: string
    domainName: string
    owner: string
    priority: string
    kpi: string
    successCriteria: string[]
    progress: number
    status: string
  }>
  projects: Array<{
    id: string
    name: string
    clientName: string
    status: string
    progress: number
    budget: number
    spend: number
    lead: string
    nextGate: string
  }>
  workflows: Array<{
    id: string
    name: string
    description?: string
    trigger: string
    status: string
    stepCount?: number
    createdAt: string
  }>
  workflowRuns: Array<{
    id: string
    workflowId: string
    status: string
    triggeredBy: string
    startedAt: string
    completedAt?: string
    failedAt?: string
    outcome?: string
  }>
  gate8: {
    oisScore:        number
    decisionScore:   number
    workflowScore:   number
    aiScore:         number
    enterpriseScore: number
    goalScore:       number
    learningScore:   number
    businessScore:   number
    trustScore:      number
    adoptionScore:   number
  } | null
  gate8History: Array<{ oisScore: number; createdAt: string; label?: string }>
  financialKpis: {
    revenueMTD: number
    revenueLastMonth: number
    arr: number
    activeContracts: number
    activeProjects: number
    totalBudget: number
    totalSpend: number
    pendingInvoices: number
    overdueInvoices: number
    draftInvoices: number
    onTimeProjectPct: number
    pipelineValue: number
    mrrDeltaPct: number
  } | null
  recentLeads: Array<{
    id: string
    name: string
    email: string
    company: string | null
    status: string
    inquiryType: string | null
    createdAt: string
  }>
  aegisAgentSummary: {
    overallVerdict: string
    healthScore: number | null
    critical24h: number
    warn24h: number
    engines: Array<{ engine: string; latest: { verdict: string; raisedAt: string; agentId: string; summary: string | null } | null }>
    lastChecked: string
  } | null
  aegisAudit: Array<{ id: string; eventType: string; system: string; description: string; raisedAt: string; verdict: string }>
  aegisAutonomy: Array<{ id: string; eventType: string; system: string; description: string; raisedAt: string; verdict: string }>
  kimmpDecisions: Array<{
    id: string
    question: string
    selected: string | null
    selectedBy: string | null
    outcome: string | null
    confidence: number
    agentsMixed: string[]
    createdAt: string
    resolvedAt: string | null
  }>
  aegisPolicies: Array<{
    id: string
    name: string
    description: string | null
    trigger: string
    effect: string
    priority: number
    enabled: boolean
  }>
  kimmpMemories: Array<{
    id: string
    type: string
    content: string
    tags: string[]
    createdAt: string
  }>
  twinScenarios: Array<{
    id: string
    scenario: string
    horizon: number
    currentOis: number
    simulatedOis: number
    delta: number
    pillarDeltas: Record<string, number>
    confidence: number
    reasoning: string
    recommendation: string
    createdAt: string
  }>
  lastSynced: Date | null
  confidence: number
  personalSummary?: {
    tasks: Array<{
      id: string
      title: string
      status: string
      dueDate: string | null
      overdue: boolean
      dueToday: boolean
    }>
    calendarEvents: Array<{
      id: string
      title: string
      type: string
      time: string
      startsAt: string
      endsAt: string
      status: string
      joinLink: string | null
    }>
  }
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
// Law 1 + 2 type constraint: state is Readonly — adapters may read, never mutate or enrich.
// Adapters never fetch independently from any external source.
export interface CognitiveStateAdapter {
  projectionScope: ProjectionScope
  adapt(
    waandaState: Readonly<WaandaCognitiveState>,
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
  enterprisePredictions: [],
  kimmSynthesis: null,
  systemBriefings: [],
  pendingDecisions: [],
  relationshipIntelligence: { liveSessions: [], evidenceLedger: [] },
  enterpriseGoals: [],
  projects: [],
  workflows: [],
  workflowRuns: [],
  gate8: null,
  gate8History: [],
  financialKpis: null,
  recentLeads: [],
  aegisAgentSummary: null,
  aegisAudit: [],
  aegisAutonomy: [],
  kimmpDecisions: [],
  aegisPolicies: [],
  kimmpMemories: [],
  twinScenarios: [],
  lastSynced: null,
  confidence: 0,
}
