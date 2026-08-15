// ---------------------------------------------------------------------------
// KIMMP Phase 4 — Permission Matrix
//
// Deterministic rules for who may approve a decision and whether the approver
// must supply a note. All decision types require ADMIN role at v1 — the matrix
// exists so individual types can be relaxed (e.g. to MANAGER) without changing
// the approval flow.
//
// Locked rule: HUMAN_HANDOFF and SALES_ALERT decisions require a note so there
// is always a human-readable reason alongside the audit record.
// ---------------------------------------------------------------------------

export type DecisionType =
  | 'RESPONSE_POLICY'
  | 'SALES_ALERT'
  | 'CONTENT_OPPORTUNITY'
  | 'MARKET_ALERT'
  | 'HUMAN_HANDOFF';

export interface PermissionRule {
  /** Minimum role required to approve this decision type. */
  requiredRole: 'ADMIN';
  /** If true, the approver MUST supply a non-empty note. */
  noteRequired: boolean;
  /** Human-readable rationale shown in the admin UI. */
  rationale: string;
}

const MATRIX: Record<string, PermissionRule> = {
  HUMAN_HANDOFF: {
    requiredRole: 'ADMIN',
    noteRequired: true,
    rationale: 'Escalating to a human has immediate customer impact — a note is required.',
  },
  SALES_ALERT: {
    requiredRole: 'ADMIN',
    noteRequired: true,
    rationale: 'Sales actions touch a real lead — document the reasoning.',
  },
  CONTENT_OPPORTUNITY: {
    requiredRole: 'ADMIN',
    noteRequired: false,
    rationale: 'Content creation is low-risk; note is optional.',
  },
  MARKET_ALERT: {
    requiredRole: 'ADMIN',
    noteRequired: false,
    rationale: 'Market intelligence is advisory; note is optional.',
  },
  RESPONSE_POLICY: {
    requiredRole: 'ADMIN',
    noteRequired: false,
    rationale: 'Response policy changes are flag-gated; note is optional.',
  },
};

/** Default rule for any decision type not explicitly listed. */
const DEFAULT_RULE: PermissionRule = {
  requiredRole: 'ADMIN',
  noteRequired: false,
  rationale: 'Unknown decision type — ADMIN required by default.',
};

export const PermissionMatrix = {
  ruleFor(decisionType: string): PermissionRule {
    return MATRIX[decisionType] ?? DEFAULT_RULE;
  },

  /** Returns a non-null string if the approval request fails the permission check. */
  validate(opts: {
    decisionType: string;
    actorRole: string;
    notes?: string;
  }): string | null {
    const rule = PermissionMatrix.ruleFor(opts.decisionType);

    if (opts.actorRole !== rule.requiredRole) {
      return `Decision type ${opts.decisionType} requires role ${rule.requiredRole} — you have ${opts.actorRole}.`;
    }

    if (rule.noteRequired && !opts.notes?.trim()) {
      return `Approving a ${opts.decisionType} decision requires a note explaining the reasoning.`;
    }

    return null;
  },
};
