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

  // INTENT signals — emitted by eQORE per message and by Lead Intelligence on score changes.
  if (signal.signalCategory === 'INTENT') {
    const value = signal.signalValue;

    // Lead has reached a high-value sales status.
    if (value === 'GOLDEN' || value === 'HOT') {
      return {
        decisionType: 'SALES_ALERT',
        recommendedAction: `Lead ${signal.leadId ?? 'unknown'} reached ${value} status — alert sales immediately and consider creating or raising the opportunity.`,
        targetModule: 'lead-intelligence',
        reasoning: `Lead Intelligence signal: status=${value} (severity ${signal.severity}).`,
        priority: Math.max(priority, 21),
      };
    }

    // High-value eQORE intents worth a sales alert.
    if (value === 'PRICING_OR_PROPOSAL' || value === 'SCHEDULING') {
      return {
        decisionType: 'SALES_ALERT',
        recommendedAction: 'Visitor is requesting pricing or scheduling — flag for follow-up and ensure an opportunity is logged.',
        targetModule: 'lead-intelligence',
        reasoning: `eQORE intent signal: ${value} (severity ${signal.severity}).`,
        priority: Math.max(priority, 13),
      };
    }

    if (value === 'HUMAN_HANDOFF') {
      return {
        decisionType: 'HUMAN_HANDOFF',
        recommendedAction: 'Visitor explicitly requested a human — escalate for immediate personal follow-up.',
        targetModule: 'human',
        reasoning: `eQORE intent: HUMAN_HANDOFF (severity ${signal.severity}).`,
        priority: Math.max(priority, 21),
      };
    }

    // ESCALATED status — worth a nudge.
    if (value === 'ESCALATED') {
      return {
        decisionType: 'SALES_ALERT',
        recommendedAction: `Lead ${signal.leadId ?? 'unknown'} has escalated — monitor closely and consider reaching out.`,
        targetModule: 'lead-intelligence',
        reasoning: `Lead Intelligence signal: status=ESCALATED.`,
        priority,
      };
    }

    return null; // Other intent values — no action needed.
  }

  // CONTENT signals — emitted by VIS from page opportunity detection.
  if (signal.signalCategory === 'CONTENT') {
    return {
      decisionType: 'CONTENT_OPPORTUNITY',
      recommendedAction: `Visitors are repeatedly asking about "${signal.signalValue}" — review the page opportunity and consider generating or publishing a page for this topic.`,
      targetModule: 'vis',
      reasoning: `VIS content gap signal: ${signal.signalType}="${signal.signalValue}" (priority ${signal.severity}).`,
      priority,
    };
  }

  if (signal.signalCategory === 'MARKET') {
    return {
      decisionType: 'MARKET_ALERT',
      recommendedAction: `Demand spike detected in "${signal.signalValue}" — review ALIS for executive intelligence and consider allocating capacity.`,
      targetModule: 'alis',
      reasoning: `ALIS market signal ${signal.signalType}: ${signal.signalValue} (severity ${signal.severity}).`,
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
