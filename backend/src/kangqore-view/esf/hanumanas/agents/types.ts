// ---------------------------------------------------------------------------
// AEGIS Agent Types — the contract every agent fulfils.
// ---------------------------------------------------------------------------

export type HanumanasVerdict = 'PASS' | 'WARN' | 'CRITICAL' | 'INFO'

export type AgentTrigger =
  | 'schedule.1h'
  | 'schedule.6h'
  | 'schedule.24h'
  | 'event.POLICY_VIOLATION'
  | 'event.ACCESS_DENIED'
  | 'event.AUTONOMOUS'
  | 'event.CRITICAL_ACTIVATION'
  | 'event.KNOWLEDGE_ASSET'
  | 'event.EGRESS'
  | 'on-demand'

export interface HanumanasAgentResult {
  agentId:    string                       // e.g. 'govops.engine-health'
  engine:     string                       // e.g. 'GOVERNANCE_OPS'
  verdict:    HanumanasVerdict
  summary:    string                       // 1-3 sentences for ADMIN
  findings:   string[]                     // bullet list of what was found
  actions:    string[]                     // recommended ADMIN actions
  metadata:   Record<string, unknown>
  durationMs: number
  raisedAt:   string                       // ISO timestamp
}

export interface AgentContext {
  trigger:     AgentTrigger | string
  metadata?:   Record<string, unknown>
  userId?:     string
  fromEvent?:  boolean   // true when triggered by event.CRITICAL_ACTIVATION — prevents cascade re-emit
  isRecheck?:  boolean   // true when this is a Sprint 3 60s re-evaluation run — prevents stacking
}

export interface HanumanasAgentDef {
  id:          string                      // 'govops.engine-health'
  name:        string                      // 'Engine Health Agent'
  engine:      string                      // 'GOVERNANCE_OPS'
  description: string
  triggers:    (AgentTrigger | string)[]
  usesLLM:     boolean
  phase:       number                      // build phase where this is fully implemented
  run:         (ctx: AgentContext) => Promise<HanumanasAgentResult>
}
