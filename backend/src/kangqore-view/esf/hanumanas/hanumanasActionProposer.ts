// ---------------------------------------------------------------------------
// HANUMANAS Action Proposer — maps agent result → HanumanasAction[].
//
// Phase 3 upgrade: LLM first, hardcoded map as fallback.
//   - LLM receives full HanumanasAgentResult + available tool descriptions
//   - LLM returns JSON: [{ type, level, params, description }]
//   - If ANTHROPIC_API_KEY absent, LLM parse fails, or action types invalid →
//     falls back to ACTION_MAP (guarantees Phase 2 behavior is preserved)
//   - Only 20 of 80 agents have ACTION_MAP entries; LLM covers the other 60
// ---------------------------------------------------------------------------

import { callLLM }                       from './agents/llm'
import { getAgentTrajectory }            from './hanumanasMemory'
import { WaandaTrainingPipeline }        from '../../waanda/training/trainingPipeline.service'
import type { HanumanasAgentResult }         from './agents/types'

export type HanumanasActionType =
  // L0 — auto-execute, silent
  | 'EMIT_SOCKET'
  | 'EMIT_SIGNAL'
  | 'LOG_AUDIT_ENTRY'
  | 'EMIT_TO_WAANDA'
  // L1 — auto-execute + in-app notification
  | 'CREATE_NOTIFICATION'
  | 'RUN_INVESTIGATION'
  | 'TRIGGER_CASCADE'
  | 'TRIGGER_KIMMP_SYSTEM'
  | 'PATCH_LEAD_RISK_SCORE'
  // L2 — auto-execute + notification + email
  | 'SEND_ALERT_EMAIL'
  | 'FLAG_ACTOR'
  | 'REVOKE_SESSION'
  // L3 — queue for ADMIN approval
  | 'PAUSE_KIMMP_LOOP'
  | 'BLOCK_ACTOR'
  | 'QUARANTINE_ASSET'

export interface HanumanasAction {
  type:        HanumanasActionType
  level:       0 | 1 | 2 | 3
  params:      Record<string, unknown>
  description: string
}

// ── Action type registry — what the LLM can choose from ────────────────────

const TOOL_DESCRIPTIONS: Record<HanumanasActionType, { level: 0|1|2|3; description: string }> = {
  EMIT_SOCKET:          { level: 0, description: 'Broadcast a real-time event to the admin dashboard. Silent — no notification created.' },
  EMIT_SIGNAL:          { level: 0, description: 'Emit a governance signal to KIMMP for situational awareness. Silent.' },
  LOG_AUDIT_ENTRY:      { level: 0, description: 'Write a structured audit log entry. Silent.' },
  EMIT_TO_WAANDA:       { level: 0, description: 'Publish a governance event to the WAANDA cognitive bus so KIMMP can incorporate HANUMANAS state in its next synthesis.' },
  CREATE_NOTIFICATION:  { level: 1, description: 'Create an in-app priority notification for admin. Use for WARN and most CRITICALs.' },
  RUN_INVESTIGATION:    { level: 1, description: 'Immediately trigger govops.investigation to analyse the incident in depth.' },
  TRIGGER_CASCADE:      { level: 1, description: 'Fire all event.CRITICAL_ACTIVATION agents to assess cross-engine impact.' },
  TRIGGER_KIMMP_SYSTEM: { level: 1, description: 'Summon a KIMMP intelligence system (SENTINEL, LEAD_INTEL, etc.) to reason about the threat. params: { system: string }' },
  PATCH_LEAD_RISK_SCORE:{ level: 1, description: 'Adjust the risk score of a specific lead in the database. params: { leadId: string, delta: number (-100 to +100) }' },
  SEND_ALERT_EMAIL:     { level: 2, description: 'Send an alert email to admin. Use for confirmed security or policy events.' },
  FLAG_ACTOR:           { level: 2, description: 'Add the actor to the Redis blocklist for elevated monitoring.' },
  REVOKE_SESSION:       { level: 2, description: 'Revoke all active sessions for a specific user. params: { userId: string }. Use when authentication or session anomalies are confirmed.' },
  PAUSE_KIMMP_LOOP:     { level: 3, description: 'PAUSE production KIMMP loop — requires ADMIN approval before execution. Use only for runaway/critical autonomy violations.' },
  BLOCK_ACTOR:          { level: 3, description: 'Hard-block an actor from the platform — requires ADMIN approval. Use only for confirmed malicious actors.' },
  QUARANTINE_ASSET:     { level: 3, description: 'Freeze a restricted asset — requires ADMIN approval. Use only for confirmed data exfiltration.' },
}

const VALID_TYPES = new Set<string>(Object.keys(TOOL_DESCRIPTIONS))
const VALID_LEVELS = new Set<number>([0, 1, 2, 3])

// ── Hardcoded fallback map (Phase 2 behavior, preserved exactly) ────────────

const ACTION_MAP: Record<string, HanumanasAction[]> = {

  // ── ACCESS_SENTINEL ────────────────────────────────────────────────────────

  'sentinel.threat-detection:CRITICAL': [
    { type: 'FLAG_ACTOR',            level: 2, params: { source: 'threat-detection' }, description: 'Flag suspicious actor in Redis blocklist' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Priority notification — brute-force threat detected' },
  ],
  'sentinel.authentication:CRITICAL': [
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Auth failure rate critical — admin alert' },
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'HANUMANAS: Critical Authentication Failure Rate' }, description: 'Email admin — auth failures spike' },
  ],
  'sentinel.session-guardian:CRITICAL': [
    { type: 'FLAG_ACTOR',            level: 2, params: { source: 'session-guardian' }, description: 'Flag burst-denial actor' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Session probing detected' },
  ],
  'sentinel.role-validator:CRITICAL': [
    { type: 'EMIT_SIGNAL',           level: 0, params: { severity: 'CRITICAL', category: 'RISK' }, description: 'Emit unapproved actor signal to KIMMP' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Unapproved actor detected — admin notification' },
  ],
  'sentinel.trust-score:WARN': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'hanumanas:trust-score-warn' }, description: 'Broadcast trust score warning to admin dashboard' },
  ],

  // ── GOVERNANCE_OPS ─────────────────────────────────────────────────────────

  'govops.alerting:CRITICAL': [
    { type: 'RUN_INVESTIGATION',     level: 1, params: { agentId: 'govops.investigation' }, description: 'Trigger investigation agent immediately' },
    { type: 'TRIGGER_CASCADE',       level: 1, params: { trigger: 'event.CRITICAL_ACTIVATION' }, description: 'Cascade to all event.CRITICAL_ACTIVATION agents' },
  ],
  'govops.escalation:CRITICAL': [
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'HANUMANAS: Unresolved Warnings Escalated to Critical' }, description: 'Email admin — stale WARNs escalated' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Escalation notification' },
  ],
  'govops.engine-health:CRITICAL': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'hanumanas:engine-silent' }, description: 'Alert dashboard — engine silent' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Engine health critical — admin alert' },
  ],

  // ── EGRESS_CONTROL ─────────────────────────────────────────────────────────

  'egress.leak-detection:CRITICAL': [
    { type: 'RUN_INVESTIGATION',     level: 1, params: { agentId: 'govops.investigation' }, description: 'Auto-trigger investigation for RESTRICTED leak' },
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'HANUMANAS CRITICAL: Intelligence Leak Detected' }, description: 'Email admin — restricted asset leaked' },
    { type: 'QUARANTINE_ASSET',      level: 3, params: { source: 'leak-detection' },   description: 'Freeze restricted asset egress (requires approval)' },
  ],
  'egress.external-share-auditor:CRITICAL': [
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'HANUMANAS: Unauthorized Egress Actor Detected' }, description: 'Email admin — unauthorized egress' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Unauthorized egress actor — admin notification' },
  ],

  // ── AUTONOMY_BOUNDARY ──────────────────────────────────────────────────────

  'autonomy.runaway-detector:CRITICAL': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'hanumanas:runaway-detected' }, description: 'Broadcast runaway detection to admin dashboard' },
    { type: 'PAUSE_KIMMP_LOOP',      level: 3, params: { reason: 'runaway-detection' }, description: 'Pause KIMMP LoopScheduler (requires ADMIN approval)' },
  ],
  'autonomy.self-initiation:CRITICAL': [
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Unapproved self-initiation detected' },
    { type: 'EMIT_SIGNAL',           level: 0, params: { severity: 'CRITICAL', category: 'RISK' }, description: 'Emit autonomy violation signal' },
  ],

  // ── POLICY ─────────────────────────────────────────────────────────────────

  'policy.enforcement:CRITICAL': [
    { type: 'RUN_INVESTIGATION',     level: 1, params: { agentId: 'govops.investigation' }, description: 'Auto-trigger investigation for policy failure' },
    { type: 'EMIT_SIGNAL',           level: 0, params: { severity: 'CRITICAL', category: 'RISK' }, description: 'Emit policy enforcement failure signal' },
  ],
  'policy.evaluator:CRITICAL': [
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Policy violations spike — admin notification' },
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'HANUMANAS: Policy Violation Spike' }, description: 'Email admin — violations threshold exceeded' },
  ],

  // ── RISK_INTELLIGENCE ──────────────────────────────────────────────────────

  'risk.executive-alert:CRITICAL': [
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'CRITICAL' },       description: 'Critical executive alert — admin notification' },
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'HANUMANAS Executive Alert: Critical Risk Level' }, description: 'Email admin — critical risk brief' },
  ],
  'risk.assessment:CRITICAL': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'hanumanas:risk-critical' }, description: 'Broadcast critical risk score to admin dashboard' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Risk score critical — admin alert' },
  ],
  'risk.anomaly-detection:CRITICAL': [
    { type: 'EMIT_SIGNAL',           level: 0, params: { severity: 'CRITICAL', category: 'RISK' }, description: 'Emit anomaly signal to KIMMP' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Event rate anomaly — admin notification' },
  ],

  // ── TRUST_COMPLIANCE ───────────────────────────────────────────────────────

  'compliance.trust-scoring:WARN': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'hanumanas:trust-warn' }, description: 'Broadcast trust score drop to admin dashboard' },
  ],
}

// Consecutive-WARN escalation: any agent with 3+ consecutive WARNs
const CONSECUTIVE_WARN_ACTION: HanumanasAction = {
  type:        'CREATE_NOTIFICATION',
  level:       1,
  params:      { priority: 'HIGH' },
  description: '3+ consecutive WARNs from same agent — attention required',
}

// ── LLM prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are HANUMANAS, the Autonomous Executive Governance Intelligence Shield for Kangqore OS.
Your job is to decide what governance actions to take when a security or governance agent fires a verdict.

Available actions (you may choose 1–5):
${Object.entries(TOOL_DESCRIPTIONS).map(([type, def]) =>
  `  L${def.level} ${type}: ${def.description}`
).join('\n')}

Governance rules:
- L3 actions (PAUSE_KIMMP_LOOP, BLOCK_ACTOR, QUARANTINE_ASSET) pause production systems and REQUIRE ADMIN APPROVAL before execution. Reserve these for confirmed, severe, unambiguous threats.
- L2 actions (SEND_ALERT_EMAIL, FLAG_ACTOR) execute automatically but send external notifications. Use when the situation is serious and confirmed.
- L1 actions (CREATE_NOTIFICATION, RUN_INVESTIGATION, TRIGGER_CASCADE) are the default for most CRITICALs.
- L0 actions (EMIT_SOCKET, EMIT_SIGNAL, LOG_AUDIT_ENTRY) are always appropriate and silent.
- Always include at least one L0 or L1 action so the incident is surfaced to the admin.

Return ONLY a JSON array — no prose, no markdown fences, no explanation:
[{"type":"ACTION_TYPE","level":0,"params":{},"description":"Why this action"}]`

// ── Validation ─────────────────────────────────────────────────────────────

function validateActions(raw: unknown): HanumanasAction[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 5) return null
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) return null
    if (!VALID_TYPES.has(item.type)) return null
    if (!VALID_LEVELS.has(item.level)) return null
    if (typeof item.description !== 'string' || !item.description) return null
    if (typeof item.params !== 'object' || item.params === null) return null
  }
  return raw as HanumanasAction[]
}

// ── LLM decision call ───────────────────────────────────────────────────────

async function proposeLLM(result: HanumanasAgentResult): Promise<HanumanasAction[] | null> {
  // Sprint 5 — inject agent's recent verdict trajectory so LLM can distinguish
  // "first-ever CRITICAL" from "CRITICAL for the fifth hour in a row"
  const trajectory = await getAgentTrajectory(result.agentId)

  const systemWithTrajectory = `${SYSTEM_PROMPT}\n\nAgent context:\n${trajectory}`

  const user = JSON.stringify({
    agentId:  result.agentId,
    engine:   result.engine,
    verdict:  result.verdict,
    summary:  result.summary,
    findings: result.findings,
    metadata: result.metadata,
  })

  const raw = await callLLM(systemWithTrajectory, user, 600)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    const actions = validateActions(parsed)
    if (!actions) return null

    // Sprint 5 — capture this decision as WAANDA Gen 2 training data
    WaandaTrainingPipeline.captureGovernanceDecision({
      agentId:      result.agentId,
      engine:       result.engine,
      verdict:      result.verdict,
      systemPrompt: systemWithTrajectory,
      userPrompt:   user,
      completion:   raw,
    })

    return actions
  } catch {
    // LLM returned non-JSON — fall through to hardcoded map
    return null
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

export class HanumanasActionProposer {
  /**
   * Propose governance actions for a completed agent run.
   * Tries LLM first (covers all 80 agents); falls back to ACTION_MAP
   * (covers 20 explicitly mapped agents). Returns [] if neither applies.
   */
  static async propose(result: HanumanasAgentResult): Promise<HanumanasAction[]> {
    // LLM path — fires for every agent when credits are available
    const llmActions = await proposeLLM(result)
    if (llmActions !== null) return llmActions

    // Fallback: hardcoded map (Phase 2 behavior, always available)
    const key = `${result.agentId}:${result.verdict}`
    return ACTION_MAP[key] ?? []
  }

  static consecutiveWarnAction(): HanumanasAction {
    return CONSECUTIVE_WARN_ACTION
  }
}
