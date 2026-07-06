// ---------------------------------------------------------------------------
// AEGIS Action Proposer — maps (agentId, verdict) → AegisAction[].
//
// Each entry describes what AEGIS should DO when an agent fires a specific
// verdict. The executor then decides authority level and runs the actions.
// ---------------------------------------------------------------------------

export type AegisActionType =
  // L0 — auto-execute, silent
  | 'EMIT_SOCKET'
  | 'EMIT_SIGNAL'
  | 'LOG_AUDIT_ENTRY'
  // L1 — auto-execute + in-app notification
  | 'CREATE_NOTIFICATION'
  | 'RUN_INVESTIGATION'
  | 'TRIGGER_CASCADE'
  // L2 — auto-execute + notification + email
  | 'SEND_ALERT_EMAIL'
  | 'FLAG_ACTOR'
  // L3 — queue for ADMIN approval
  | 'PAUSE_KIMMP_LOOP'
  | 'BLOCK_ACTOR'
  | 'QUARANTINE_ASSET'

export interface AegisAction {
  type:        AegisActionType
  level:       0 | 1 | 2 | 3
  params:      Record<string, unknown>
  description: string
}

// Key: `${agentId}:${verdict}`
const ACTION_MAP: Record<string, AegisAction[]> = {

  // ── ACCESS_SENTINEL ────────────────────────────────────────────────────────

  'sentinel.threat-detection:CRITICAL': [
    { type: 'FLAG_ACTOR',            level: 2, params: { source: 'threat-detection' }, description: 'Flag suspicious actor in Redis blocklist' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Priority notification — brute-force threat detected' },
  ],
  'sentinel.authentication:CRITICAL': [
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Auth failure rate critical — admin alert' },
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'AEGIS: Critical Authentication Failure Rate' }, description: 'Email admin — auth failures spike' },
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
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'aegis:trust-score-warn' }, description: 'Broadcast trust score warning to admin dashboard' },
  ],

  // ── GOVERNANCE_OPS ─────────────────────────────────────────────────────────

  'govops.alerting:CRITICAL': [
    { type: 'RUN_INVESTIGATION',     level: 1, params: { agentId: 'govops.investigation' }, description: 'Trigger investigation agent immediately' },
    { type: 'TRIGGER_CASCADE',       level: 1, params: { trigger: 'event.CRITICAL_ACTIVATION' }, description: 'Cascade to all event.CRITICAL_ACTIVATION agents' },
  ],
  'govops.escalation:CRITICAL': [
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'AEGIS: Unresolved Warnings Escalated to Critical' }, description: 'Email admin — stale WARNs escalated' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Escalation notification' },
  ],
  'govops.engine-health:CRITICAL': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'aegis:engine-silent' }, description: 'Alert dashboard — engine silent' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Engine health critical — admin alert' },
  ],

  // ── EGRESS_CONTROL ─────────────────────────────────────────────────────────

  'egress.leak-detection:CRITICAL': [
    { type: 'RUN_INVESTIGATION',     level: 1, params: { agentId: 'govops.investigation' }, description: 'Auto-trigger investigation for RESTRICTED leak' },
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'AEGIS CRITICAL: Intelligence Leak Detected' }, description: 'Email admin — restricted asset leaked' },
    { type: 'QUARANTINE_ASSET',      level: 3, params: { source: 'leak-detection' },   description: 'Freeze restricted asset egress (requires approval)' },
  ],
  'egress.external-share-auditor:CRITICAL': [
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'AEGIS: Unauthorized Egress Actor Detected' }, description: 'Email admin — unauthorized egress' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Unauthorized egress actor — admin notification' },
  ],

  // ── AUTONOMY_BOUNDARY ──────────────────────────────────────────────────────

  'autonomy.runaway-detector:CRITICAL': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'aegis:runaway-detected' }, description: 'Broadcast runaway detection to admin dashboard' },
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
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'AEGIS: Policy Violation Spike' }, description: 'Email admin — violations threshold exceeded' },
  ],

  // ── RISK_INTELLIGENCE ──────────────────────────────────────────────────────

  'risk.executive-alert:CRITICAL': [
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'CRITICAL' },       description: 'Critical executive alert — admin notification' },
    { type: 'SEND_ALERT_EMAIL',      level: 2, params: { subject: 'AEGIS Executive Alert: Critical Risk Level' }, description: 'Email admin — critical risk brief' },
  ],
  'risk.assessment:CRITICAL': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'aegis:risk-critical' }, description: 'Broadcast critical risk score to admin dashboard' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Risk score critical — admin alert' },
  ],
  'risk.anomaly-detection:CRITICAL': [
    { type: 'EMIT_SIGNAL',           level: 0, params: { severity: 'CRITICAL', category: 'RISK' }, description: 'Emit anomaly signal to KIMMP' },
    { type: 'CREATE_NOTIFICATION',   level: 1, params: { priority: 'HIGH' },           description: 'Event rate anomaly — admin notification' },
  ],

  // ── TRUST_COMPLIANCE ───────────────────────────────────────────────────────

  'compliance.trust-scoring:WARN': [
    { type: 'EMIT_SOCKET',           level: 0, params: { event: 'aegis:trust-warn' }, description: 'Broadcast trust score drop to admin dashboard' },
  ],
}

// Consecutive-WARN escalation: any agent with 3+ consecutive WARNs
const CONSECUTIVE_WARN_ACTION: AegisAction = {
  type:        'CREATE_NOTIFICATION',
  level:       1,
  params:      { priority: 'HIGH' },
  description: '3+ consecutive WARNs from same agent — attention required',
}

export class AegisActionProposer {
  static propose(agentId: string, verdict: string): AegisAction[] {
    const key = `${agentId}:${verdict}`
    return ACTION_MAP[key] ?? []
  }

  static consecutiveWarnAction(): AegisAction {
    return CONSECUTIVE_WARN_ACTION
  }
}
