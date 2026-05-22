// ---------------------------------------------------------------------------
// KIMMP Decision Engine — decision policy (Phase 3)
//
// Deterministic, explainable rules that map a Signal Ledger entry to a proposed
// next-best action. Rules-first by design — the user's brief is explicit that
// KIMMP should start with rules + LLM, not opaque ML. Each rule yields a
// PROPOSED decision an admin reviews; KIMMP never auto-executes.
// ---------------------------------------------------------------------------

export interface SignalLike {
  id: string;
  sourceModule: string;
  signalType: string;
  signalCategory: string;
  signalValue: string;
  confidence: number;
  severity: string;
  conversationId?: string | null;
  leadId?: string | null;
}

export interface DecisionProposal {
  decisionType: string;
  recommendedAction: string;
  targetModule: string;
  reasoning: string;
  priority: number;
}

/** Fibonacci-tiered priority by signal severity (signal weight is not linear). */
function priorityForSeverity(severity: string): number {
  switch (severity) {
    case 'CRITICAL':
      return 34;
    case 'HIGH':
      return 21;
    case 'MODERATE':
      return 8;
    default:
      return 3;
  }
}

/**
 * Apply the decision policy to one signal. Returns a proposal, or null when no
 * rule matches (the signal is still marked processed — "no action needed").
 *
 * v1 covers BEHAVIOR signals (the category KIMMP currently produces). Other
 * categories get rules as their producers come online (Phase 2 remainder).
 */
export function decide(signal: SignalLike): DecisionProposal | null {
  const priority = priorityForSeverity(signal.severity);

  if (signal.signalCategory === 'BEHAVIOR') {
    // signalValue carries the recommended response mode from the behavior layer.
    switch (signal.signalValue) {
      case 'CALM_ASSURANCE_FIRST':
        return {
          decisionType: signal.severity === 'HIGH' ? 'HUMAN_HANDOFF' : 'RESPONSE_POLICY',
          recommendedAction:
            signal.severity === 'HIGH'
              ? 'Visitor appears under real operational pressure — consider a human takeover or a stabilization call.'
              : 'Handle this conversation assurance-first — lead with stability before solutioning.',
          targetModule: signal.severity === 'HIGH' ? 'human' : 'eqore',
          reasoning: `Behavior signal ${signal.signalValue} (severity ${signal.severity}).`,
          priority,
        };
      case 'SHOW_PROOF':
        return {
          decisionType: 'CONTENT_OPPORTUNITY',
          recommendedAction:
            'Visitor is evaluating critically — surface case studies / proof, and flag any missing proof content.',
          targetModule: 'vis',
          reasoning: 'Behavior signal SHOW_PROOF — skepticism is the conversion blocker.',
          priority,
        };
      case 'SIMPLIFY':
        return {
          decisionType: 'CONTENT_OPPORTUNITY',
          recommendedAction:
            'Visitor needs plainer explanation — consider simpler messaging on the relevant page.',
          targetModule: 'vis',
          reasoning: 'Behavior signal SIMPLIFY — confusion detected.',
          priority,
        };
      case 'DISCOVERY':
      case 'EXECUTIVE':
        return {
          decisionType: 'SALES_ALERT',
          recommendedAction:
            'Visitor looks decision-ready — alert sales and consider creating/raising the opportunity.',
          targetModule: 'lead-intelligence',
          reasoning: `Behavior signal ${signal.signalValue} — high decision-readiness.`,
          priority: Math.max(priority, 13),
        };
      default:
        return null; // STANDARD or unmapped — no action needed.
    }
  }

  if (signal.signalCategory === 'MARKET') {
    return {
      decisionType: 'MARKET_ALERT',
      recommendedAction: 'Review this market signal for executive intelligence.',
      targetModule: 'alis',
      reasoning: `Market signal ${signal.signalType}.`,
      priority,
    };
  }

  if (signal.signalCategory === 'RISK') {
    return {
      decisionType: 'HUMAN_HANDOFF',
      recommendedAction: 'Risk signal — escalate for human review.',
      targetModule: 'human',
      reasoning: `Risk signal ${signal.signalType} (severity ${signal.severity}).`,
      priority: Math.max(priority, 21),
    };
  }

  return null;
}
