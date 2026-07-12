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

export type ExecutiveTier = 'STRATEGIC' | 'CRITICAL' | 'OPERATIONAL' | 'INFORMATIONAL';

export interface DecisionProposal {
  decisionType: string;
  recommendedAction: string;
  targetModule: string;
  reasoning: string;
  priority: number;
  tier: ExecutiveTier;
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
 * Maps a Fibonacci priority score to an executive tier.
 * STRATEGIC is assigned separately via intent-alignment (see applyIntentAlignment).
 */
export function tierForPriority(priority: number): ExecutiveTier {
  if (priority >= 21) return 'CRITICAL';
  if (priority >= 8)  return 'OPERATIONAL';
  return 'INFORMATIONAL';
}

/**
 * Upgrades a proposal's tier to STRATEGIC when intent alignment confirms
 * this decision advances an active CEO intent. Call async after decide().
 */
export function applyIntentAlignment(
  proposal: DecisionProposal,
  alignmentScore: number,
): DecisionProposal {
  if (alignmentScore >= 0.4) {
    return { ...proposal, tier: 'STRATEGIC' };
  }
  return proposal;
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
    switch (signal.signalValue) {
      case 'CALM_ASSURANCE_FIRST': {
        const p = priority;
        return {
          decisionType: signal.severity === 'HIGH' ? 'HUMAN_HANDOFF' : 'RESPONSE_POLICY',
          recommendedAction:
            signal.severity === 'HIGH'
              ? 'Visitor appears under real operational pressure — consider a human takeover or a stabilization call.'
              : 'Handle this conversation assurance-first — lead with stability before solutioning.',
          targetModule: signal.severity === 'HIGH' ? 'human' : 'eqore',
          reasoning: `Behavior signal ${signal.signalValue} (severity ${signal.severity}).`,
          priority: p,
          tier: tierForPriority(p),
        };
      }
      case 'SHOW_PROOF':
        return {
          decisionType: 'CONTENT_OPPORTUNITY',
          recommendedAction:
            'Visitor is evaluating critically — surface case studies / proof, and flag any missing proof content.',
          targetModule: 'vis',
          reasoning: 'Behavior signal SHOW_PROOF — skepticism is the conversion blocker.',
          priority,
          tier: tierForPriority(priority),
        };
      case 'SIMPLIFY':
        return {
          decisionType: 'CONTENT_OPPORTUNITY',
          recommendedAction:
            'Visitor needs plainer explanation — consider simpler messaging on the relevant page.',
          targetModule: 'vis',
          reasoning: 'Behavior signal SIMPLIFY — confusion detected.',
          priority,
          tier: tierForPriority(priority),
        };
      case 'DISCOVERY':
      case 'EXECUTIVE': {
        const p = Math.max(priority, 13);
        return {
          decisionType: 'SALES_ALERT',
          recommendedAction:
            'Visitor looks decision-ready — alert sales and consider creating/raising the opportunity.',
          targetModule: 'lead-intelligence',
          reasoning: `Behavior signal ${signal.signalValue} — high decision-readiness.`,
          priority: p,
          tier: tierForPriority(p),
        };
      }
      default:
        return null;
    }
  }

  if (signal.signalCategory === 'INTENT') {
    const value = signal.signalValue;

    if (value === 'GOLDEN' || value === 'HOT') {
      const p = Math.max(priority, 21);
      return {
        decisionType: 'SALES_ALERT',
        recommendedAction: `Lead ${signal.leadId ?? 'unknown'} reached ${value} status — alert sales immediately and consider creating or raising the opportunity.`,
        targetModule: 'lead-intelligence',
        reasoning: `Lead Intelligence signal: status=${value} (severity ${signal.severity}).`,
        priority: p,
        tier: tierForPriority(p),
      };
    }

    if (value === 'PRICING_OR_PROPOSAL' || value === 'SCHEDULING') {
      const p = Math.max(priority, 13);
      return {
        decisionType: 'SALES_ALERT',
        recommendedAction: 'Visitor is requesting pricing or scheduling — flag for follow-up and ensure an opportunity is logged.',
        targetModule: 'lead-intelligence',
        reasoning: `eQORE intent signal: ${value} (severity ${signal.severity}).`,
        priority: p,
        tier: tierForPriority(p),
      };
    }

    if (value === 'HUMAN_HANDOFF') {
      const p = Math.max(priority, 21);
      return {
        decisionType: 'HUMAN_HANDOFF',
        recommendedAction: 'Visitor explicitly requested a human — escalate for immediate personal follow-up.',
        targetModule: 'human',
        reasoning: `eQORE intent: HUMAN_HANDOFF (severity ${signal.severity}).`,
        priority: p,
        tier: tierForPriority(p),
      };
    }

    if (value === 'ESCALATED') {
      return {
        decisionType: 'SALES_ALERT',
        recommendedAction: `Lead ${signal.leadId ?? 'unknown'} has escalated — monitor closely and consider reaching out.`,
        targetModule: 'lead-intelligence',
        reasoning: `Lead Intelligence signal: status=ESCALATED.`,
        priority,
        tier: tierForPriority(priority),
      };
    }

    return null;
  }

  if (signal.signalCategory === 'CONTENT') {
    return {
      decisionType: 'CONTENT_OPPORTUNITY',
      recommendedAction: `Visitors are repeatedly asking about "${signal.signalValue}" — review the page opportunity and consider generating or publishing a page for this topic.`,
      targetModule: 'vis',
      reasoning: `VIS content gap signal: ${signal.signalType}="${signal.signalValue}" (priority ${signal.severity}).`,
      priority,
      tier: tierForPriority(priority),
    };
  }

  if (signal.signalCategory === 'MARKET') {
    return {
      decisionType: 'MARKET_ALERT',
      recommendedAction: `Demand spike detected in "${signal.signalValue}" — review ALIS for executive intelligence and consider allocating capacity.`,
      targetModule: 'alis',
      reasoning: `ALIS market signal ${signal.signalType}: ${signal.signalValue} (severity ${signal.severity}).`,
      priority,
      tier: tierForPriority(priority),
    };
  }

  if (signal.signalCategory === 'RISK') {
    const p = Math.max(priority, 21);
    return {
      decisionType: 'HUMAN_HANDOFF',
      recommendedAction: 'Risk signal — escalate for human review.',
      targetModule: 'human',
      reasoning: `Risk signal ${signal.signalType} (severity ${signal.severity}).`,
      priority: p,
      tier: tierForPriority(p),
    };
  }

  return null;
}
