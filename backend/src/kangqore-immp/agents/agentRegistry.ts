// ---------------------------------------------------------------------------
// KIMMP Agent Registry — permanent assignment of all 38 agents to their systems.
//
// Each agent belongs to exactly ONE primary system. Agents marked shared:true
// are also callable by KIMMP Brain during cross-system orchestration (LOOPS).
//
// Systems:
//   EQORE        — Conversations (6 agents)
//   LEAD_INTEL   — Lead Scoring  (6 agents)
//   ALIS         — Demand Ops    (6 agents)
//   VIS          — Visibility    (5 agents)
//   SENTINEL     — Security      (13 agents, inc. INCIDENT_RESPONDER)
//   DELIVERY_OPS — Projects & Delivery (3 agents) — Wave 1
//
// KIMMP (Brain) is the orchestrator — it commands all 39 via LOOPS cascade.
// ---------------------------------------------------------------------------

import { AgentType } from '../orchestrator/kimmpOrchestrator.service'

export type SystemType = 'EQORE' | 'LEAD_INTEL' | 'ALIS' | 'VIS' | 'SENTINEL' | 'DELIVERY_OPS' | 'FINANCE_OPS'

export type LayerType = 'INTELLIGENCE' | 'OPERATIONS' | 'SENTINEL'

export type LLMTier = 'haiku' | 'sonnet' | 'opus'

export interface AgentDefinition {
  type:          AgentType
  system:        SystemType
  layer:         LayerType
  llm:           LLMTier      // which Claude model tier this agent uses
  role:          string        // what this agent does within its system
  trigger:       string        // event(s) that activate this agent
  shared:        boolean       // true = KIMMP Brain borrows this for cross-system work
  defaultParams: Record<string, any>
}

// ─── The Registry ─────────────────────────────────────────────────────────────

export const AGENT_REGISTRY: Record<AgentType, AgentDefinition> = {

  // ── EQORE — Conversations ──────────────────────────────────────────────────
  // Activated when a conversation, meeting, or client interaction occurs.

  MEETING_INTEL: {
    type: 'MEETING_INTEL', system: 'EQORE', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Transcribes conversations, extracts decisions and action items',
    trigger: 'meeting.completed',
    shared: false,
    defaultParams: {},
  },
  CLIENT_INTEL: {
    type: 'CLIENT_INTEL', system: 'EQORE', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Surfaces client history, sentiment, and open issues before a conversation',
    trigger: 'conversation.started',
    shared: false,
    defaultParams: {},
  },
  MEMORY_RECALL: {
    type: 'MEMORY_RECALL', system: 'EQORE', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Pulls prior context, decisions, and org knowledge into the conversation',
    trigger: 'query.received',
    shared: false,
    defaultParams: {},
  },
  KNOWLEDGE_ENGINE: {
    type: 'KNOWLEDGE_ENGINE', system: 'EQORE', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Answers questions in real-time from the Kangqore knowledge base',
    trigger: 'query.received',
    shared: false,
    defaultParams: {},
  },
  RESEARCH: {
    type: 'RESEARCH', system: 'EQORE', layer: 'INTELLIGENCE', llm: 'sonnet',
    role: 'Enriches client/prospect profile with web research during and after calls',
    trigger: 'enrichment.needed',
    shared: true,     // also used by LEAD_INTEL and VIS
    defaultParams: {},
  },
  ADVISOR: {
    type: 'ADVISOR', system: 'EQORE', layer: 'INTELLIGENCE', llm: 'sonnet',
    role: 'Suggests the next best action post-meeting with CEO-level clarity',
    trigger: 'meeting.completed',
    shared: true,     // also used by KIMMP Brain
    defaultParams: {},
  },

  // ── LEAD INTEL — Lead Scoring ──────────────────────────────────────────────
  // Activated when a lead enters, moves, stalls, or is at risk.

  SCOUT: {
    type: 'SCOUT', system: 'LEAD_INTEL', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Finds and qualifies new leads from tenders, web signals, and external intelligence',
    trigger: 'schedule.hourly',
    shared: false,
    defaultParams: {},
  },
  LEAD_ANALYSIS: {
    type: 'LEAD_ANALYSIS', system: 'LEAD_INTEL', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Scores lead quality, fit, urgency, and pipeline health',
    trigger: 'lead.created|lead.updated',
    shared: false,
    defaultParams: {},
  },
  OPPORTUNITY_SCAN: {
    type: 'OPPORTUNITY_SCAN', system: 'LEAD_INTEL', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Detects upsell and cross-sell signals from existing accounts',
    trigger: 'lead.scored',
    shared: false,
    defaultParams: {},
  },
  COMPETITOR_INTEL: {
    type: 'COMPETITOR_INTEL', system: 'LEAD_INTEL', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Flags competitive deals in the pipeline and monitors competitor moves',
    trigger: 'lead.qualified',
    shared: true,     // also used by VIS
    defaultParams: {},
  },
  FORECAST: {
    type: 'FORECAST', system: 'LEAD_INTEL', layer: 'INTELLIGENCE', llm: 'sonnet',
    role: 'Predicts deal close probability, timing, and revenue trajectory',
    trigger: 'pipeline.changed',
    shared: true,     // also used by KIMMP Brain
    defaultParams: { horizon: '3m' },
  },
  DECISION_ENGINE: {
    type: 'DECISION_ENGINE', system: 'LEAD_INTEL', layer: 'INTELLIGENCE', llm: 'sonnet',
    role: 'Recommends pursue / nurture / drop for each lead with rationale',
    trigger: 'lead.scored',
    shared: true,     // also used by KIMMP Brain
    defaultParams: {},
  },

  // ── ALIS — Demand Ops ──────────────────────────────────────────────────────
  // Activated when demand signals spike, campaigns run, or pipeline gaps appear.

  SIGNAL_READ: {
    type: 'SIGNAL_READ', system: 'ALIS', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Reads and categorises demand signals across all modules in real time',
    trigger: 'signal.emitted',
    shared: false,
    defaultParams: {},
  },
  WORKFLOW_ORCHESTRATOR: {
    type: 'WORKFLOW_ORCHESTRATOR', system: 'ALIS', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Triggers nurture sequences, follow-ups, and demand generation workflows',
    trigger: 'lead.scored',
    shared: false,
    defaultParams: {},
  },
  TASK_MANAGER: {
    type: 'TASK_MANAGER', system: 'ALIS', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Assigns, tracks, and escalates demand ops tasks and deliverables',
    trigger: 'task.created|task.overdue',
    shared: false,
    defaultParams: {},
  },
  FINANCIAL_SNAPSHOT: {
    type: 'FINANCIAL_SNAPSHOT', system: 'ALIS', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Tracks CAC, spend ROI, campaign efficiency, and revenue MTD',
    trigger: 'schedule.daily',
    shared: false,
    defaultParams: {},
  },
  ORGANIZATION_HEALTH: {
    type: 'ORGANIZATION_HEALTH', system: 'ALIS', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Checks team capacity and org health before assigning demand ops work',
    trigger: 'schedule.daily',
    shared: false,
    defaultParams: {},
  },
  STRATEGIST: {
    type: 'STRATEGIST', system: 'ALIS', layer: 'INTELLIGENCE', llm: 'sonnet',
    role: 'Recommends channel, timing, offer, and strategic path for demand',
    trigger: 'pipeline.gapped',
    shared: true,     // also used by KIMMP Brain
    defaultParams: {},
  },

  // ── VIS — Visibility ───────────────────────────────────────────────────────
  // Activated on schedule or when brand/content signals are detected.

  REPORT_GENERATE: {
    type: 'REPORT_GENERATE', system: 'VIS', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Produces structured visibility and performance reports on demand',
    trigger: 'schedule.weekly',
    shared: false,
    defaultParams: { type: 'WEEKLY_EXECUTIVE' },
  },
  EXEC_SUMMARY: {
    type: 'EXEC_SUMMARY', system: 'VIS', layer: 'INTELLIGENCE', llm: 'sonnet',
    role: 'Condenses visibility metrics and cross-module state into leadership briefs',
    trigger: 'schedule.daily',
    shared: true,     // also used by KIMMP Brain
    defaultParams: { period: 'today' },
  },
  SIMULATION_ENGINE: {
    type: 'SIMULATION_ENGINE', system: 'VIS', layer: 'INTELLIGENCE', llm: 'sonnet',
    role: 'Models "what if we publish X / invest in Y" scenarios against the Digital Twin',
    trigger: 'content.planned',
    shared: true,     // also used by KIMMP Brain
    defaultParams: {},
  },
  GOAL_CHECK: {
    type: 'GOAL_CHECK', system: 'VIS', layer: 'OPERATIONS', llm: 'haiku',
    role: 'Validates that any visibility action is aligned with an active strategic goal',
    trigger: 'goal.checked',
    shared: false,
    defaultParams: {},
  },
  RISK_ANALYSIS: {
    type: 'RISK_ANALYSIS', system: 'VIS', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Risk matrix before committing to visibility campaigns or content investments',
    trigger: 'risk.detected',
    shared: true,     // also used by KIMMP Brain
    defaultParams: { domain: 'all' },
  },

  // ── SENTINEL — Security (Always On) ───────────────────────────────────────
  // These 12 agents watch all systems simultaneously. They are the immune system.

  THREAT_DETECTOR: {
    type: 'THREAT_DETECTOR', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Detects anomalous patterns, attack indicators, and threats across all modules',
    trigger: 'signal.critical',
    shared: false,
    defaultParams: { hours: 24 },
  },
  VULNERABILITY_MANAGER: {
    type: 'VULNERABILITY_MANAGER', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Monitors open vulnerabilities, CVEs, patch status, and exposure windows',
    trigger: 'schedule.daily',
    shared: false,
    defaultParams: {},
  },
  SECURITY_POSTURE: {
    type: 'SECURITY_POSTURE', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Evaluates overall security maturity and defensive readiness across 5 domains',
    trigger: 'schedule.weekly',
    shared: false,
    defaultParams: {},
  },
  RISK_MANAGER: {
    type: 'RISK_MANAGER', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Enterprise risk identification, scoring, heat map, and mitigation planning',
    trigger: 'risk.high',
    shared: false,
    defaultParams: { domain: 'all' },
  },
  COMPLIANCE_GUARD: {
    type: 'COMPLIANCE_GUARD', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'SOC 2, ISO 27001, GDPR, DPDP Act, and HIPAA compliance monitoring',
    trigger: 'schedule.weekly',
    shared: false,
    defaultParams: {},
  },
  ATTACK_ANALYZER: {
    type: 'ATTACK_ANALYZER', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Analyzes incidents, malware events, and intrusion attempts with timeline',
    trigger: 'threat.detected',
    shared: false,
    defaultParams: { days: 7 },
  },
  ACCESS_GOVERNOR: {
    type: 'ACCESS_GOVERNOR', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Monitors permissions, privileged accounts, stale access, and anomalies',
    trigger: 'access.anomaly',
    shared: false,
    defaultParams: {},
  },
  ASSET_GUARDIAN: {
    type: 'ASSET_GUARDIAN', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Tracks and protects infrastructure, servers, databases, and critical assets',
    trigger: 'asset.atrisk',
    shared: false,
    defaultParams: {},
  },
  THIRD_PARTY_RISK: {
    type: 'THIRD_PARTY_RISK', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Vendor, SaaS, and supplier security and concentration risk assessment',
    trigger: 'vendor.added',
    shared: false,
    defaultParams: {},
  },
  RESILIENCE_MONITOR: {
    type: 'RESILIENCE_MONITOR', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Backup health, disaster recovery readiness, RTO/RPO, and business continuity',
    trigger: 'schedule.weekly',
    shared: false,
    defaultParams: {},
  },
  SHADOW_AI_DETECTOR: {
    type: 'SHADOW_AI_DETECTOR', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Detects unauthorised AI tools in use and data exposure from shadow AI',
    trigger: 'schedule.daily',
    shared: false,
    defaultParams: {},
  },
  AGENT_GUARDIAN: {
    type: 'AGENT_GUARDIAN', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'Watches the other 35 agents for rogue behaviour, authority violations, and anomalies',
    trigger: 'schedule.hourly',
    shared: false,
    defaultParams: {},
  },
  INCIDENT_RESPONDER: {
    type: 'INCIDENT_RESPONDER', system: 'SENTINEL', layer: 'SENTINEL', llm: 'opus',
    role: 'ITIL incident responder — auto-classifies severity, suggests assignee, drafts resolution steps, and links similar past incidents',
    trigger: 'event.incident.created',
    shared: false,
    defaultParams: {},
  },

  // ── DELIVERY_OPS — Projects & Delivery (Wave 1) ────────────────────────────

  PROJECT_HEALTH: {
    type: 'PROJECT_HEALTH', system: 'DELIVERY_OPS', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Assesses project health daily — computes ProjectOperationalState and feeds portfolio score into OIS Enterprise pillar',
    trigger: 'schedule.daily | project.updated | deliverable.status_changed',
    shared: true,   // KIMMP Brain borrows for Gate 8 Enterprise pillar computation
    defaultParams: {},
  },
  DELIVERY_MONITOR: {
    type: 'DELIVERY_MONITOR', system: 'DELIVERY_OPS', layer: 'INTELLIGENCE', llm: 'opus',
    role: 'Portfolio-level delivery sentinel — identifies at-risk projects, recommends escalations, drafts executive delivery summary',
    trigger: 'schedule.daily | project.health_below_threshold',
    shared: true,
    defaultParams: { healthThreshold: 60 },
  },
  PROJECT_TWIN_SIMULATOR: {
    type: 'PROJECT_TWIN_SIMULATOR', system: 'DELIVERY_OPS', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Runs Project Digital Twin™ simulation — models current trajectory, resource scenarios, and risk-adjusted completion dates',
    trigger: 'project.data_changed | on_demand',
    shared: false,
    defaultParams: {},
  },

  // ── Enterprise Coach™ (Phase 5) — cross-department intelligence ──────────────
  ENTERPRISE_COACH: {
    type: 'ENTERPRISE_COACH', system: 'ALIS', layer: 'INTELLIGENCE', llm: 'haiku',
    role: 'Detects cross-department patterns across Delivery, Finance, Pipeline, and Intelligence — generates coaching insights that no single department can see',
    trigger: 'schedule.daily | gate8.computed | on_demand',
    shared: true,
    defaultParams: {},
  },

  // ── FINANCE_OPS — Finance + Sales (Phase 4) ────────────────────────────────

  INVOICE_INTELLIGENCE: {
    type: 'INVOICE_INTELLIGENCE', system: 'FINANCE_OPS', layer: 'INTELLIGENCE', llm: 'opus',
    role: 'Validates invoices against project budget, identifies overdue positions, summarises finance health for OIS Business pillar',
    trigger: 'invoice.created | invoice.overdue | schedule.daily',
    shared: true,
    defaultParams: {},
  },
  COLLECTIONS_AGENT: {
    type: 'COLLECTIONS_AGENT', system: 'FINANCE_OPS', layer: 'INTELLIGENCE', llm: 'opus',
    role: 'Monitors overdue invoices, scores collection risk, drafts escalation communications for L2 approval',
    trigger: 'schedule.daily | invoice.overdue_threshold',
    shared: false,
    defaultParams: { daysOverdue: 14 },
  },
  DEAL_COACH: {
    type: 'DEAL_COACH', system: 'FINANCE_OPS', layer: 'INTELLIGENCE', llm: 'opus',
    role: 'Coaches on active deals — identifies stalled proposals, drafts follow-up, recommends next action to advance pipeline',
    trigger: 'lead.stage_changed | schedule.48h | proposal.stalled',
    shared: true,
    defaultParams: {},
  },
}

// ─── System → Agent Lists ─────────────────────────────────────────────────────
// The canonical, permanent assignment of agents to systems.

export const SYSTEM_AGENTS: Record<SystemType, AgentType[]> = {
  EQORE: [
    'MEETING_INTEL',
    'CLIENT_INTEL',
    'MEMORY_RECALL',
    'KNOWLEDGE_ENGINE',
    'RESEARCH',
    'ADVISOR',
  ],
  LEAD_INTEL: [
    'SCOUT',
    'LEAD_ANALYSIS',
    'OPPORTUNITY_SCAN',
    'COMPETITOR_INTEL',
    'FORECAST',
    'DECISION_ENGINE',
  ],
  ALIS: [
    'SIGNAL_READ',
    'WORKFLOW_ORCHESTRATOR',
    'TASK_MANAGER',
    'FINANCIAL_SNAPSHOT',
    'ORGANIZATION_HEALTH',
    'STRATEGIST',
    'ENTERPRISE_COACH',
  ],
  VIS: [
    'REPORT_GENERATE',
    'EXEC_SUMMARY',
    'SIMULATION_ENGINE',
    'GOAL_CHECK',
    'RISK_ANALYSIS',
  ],
  SENTINEL: [
    'THREAT_DETECTOR',
    'VULNERABILITY_MANAGER',
    'SECURITY_POSTURE',
    'RISK_MANAGER',
    'COMPLIANCE_GUARD',
    'ATTACK_ANALYZER',
    'ACCESS_GOVERNOR',
    'ASSET_GUARDIAN',
    'THIRD_PARTY_RISK',
    'RESILIENCE_MONITOR',
    'SHADOW_AI_DETECTOR',
    'AGENT_GUARDIAN',
    'INCIDENT_RESPONDER',
  ],
  DELIVERY_OPS: [
    'PROJECT_HEALTH',
    'DELIVERY_MONITOR',
    'PROJECT_TWIN_SIMULATOR',
  ],
  FINANCE_OPS: [
    'INVOICE_INTELLIGENCE',
    'COLLECTIONS_AGENT',
    'DEAL_COACH',
  ],
}

// KIMMP Brain — agents shared across systems that KIMMP can pull for synthesis
export const KIMMP_BRAIN_AGENTS: AgentType[] = Object.values(AGENT_REGISTRY)
  .filter(a => a.shared)
  .map(a => a.type)

// LOOPS — the cascade order: LEAD_INTEL output → triggers ALIS → triggers EQORE → KIMMP synthesises
export const LOOP_CASCADE_ORDER: SystemType[] = ['LEAD_INTEL', 'ALIS', 'EQORE', 'VIS', 'DELIVERY_OPS']

// ─── Registry helpers ─────────────────────────────────────────────────────────

export function agentsForSystem(system: SystemType): AgentDefinition[] {
  return SYSTEM_AGENTS[system].map(t => AGENT_REGISTRY[t])
}

export function systemOf(agentType: AgentType): SystemType {
  return AGENT_REGISTRY[agentType].system
}

export function agentsByLayer(layer: LayerType): AgentDefinition[] {
  return Object.values(AGENT_REGISTRY).filter(a => a.layer === layer)
}

export function agentCount(): { total: number; bySystem: Record<SystemType, number>; byLayer: Record<LayerType, number> } {
  const bySystem = {} as Record<SystemType, number>
  const byLayer  = {} as Record<LayerType, number>
  for (const a of Object.values(AGENT_REGISTRY)) {
    bySystem[a.system] = (bySystem[a.system] ?? 0) + 1
    byLayer[a.layer]   = (byLayer[a.layer]   ?? 0) + 1
  }
  return { total: Object.keys(AGENT_REGISTRY).length, bySystem, byLayer }
}

export const SYSTEM_LABELS: Record<SystemType, string> = {
  EQORE:        'EQORE — Conversations',
  LEAD_INTEL:   'LEAD INTEL — Scoring',
  ALIS:         'ALIS — Demand Ops',
  VIS:          'VIS — Visibility',
  SENTINEL:     'Sentinel Layer — Security',
  DELIVERY_OPS: 'DELIVERY OPS — Projects & Delivery',
  FINANCE_OPS:  'FINANCE OPS — Finance + Sales',
}

export const SYSTEM_TRIGGERS: Record<SystemType, string> = {
  EQORE:        'Activated when a conversation, meeting, or client interaction occurs',
  LEAD_INTEL:   'Activated when a lead enters, moves, stalls, or is at risk',
  ALIS:         'Activated when demand signals spike, campaigns run, or pipeline gaps appear',
  VIS:          'Activated on schedule or when brand/content signals are detected',
  SENTINEL:     'Always on — watches all systems simultaneously',
  DELIVERY_OPS: 'Activated daily and on project data changes — operates projects autonomously',
  FINANCE_OPS:  'Activated on invoice events, daily overdue scan, and deal stage changes',
}
