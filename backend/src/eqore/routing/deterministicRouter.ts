/**
 * eQORE Intent Gateway — Deterministic Router (Phase 6)
 * 
 * Runs fast regex/keyword matches to bypass the LLM for obvious intents.
 */

import { EqoreIntent, EqoreRoutingDecision } from './intentSchema';

export class DeterministicRouter {
  /**
   * Evaluates the message against strict patterns.
   * Returns a routing decision if confident, or null to fall back to the LLM.
   */
  static route(message: string): EqoreRoutingDecision | null {
    const text = message.toLowerCase().trim();

    // 0. Client Assurance / Crisis Detection
    if (/(crashed|broken|everything is broken|hacked|breach|breached|leak|leaked|vulnerability|attack|ransomed|compromised|users are angry|losing money|down|system is down|failing|urgent help|crisis|emergency|disaster|outage|failure|catastrophic|nightmare|scandal|reputation|lawsuit|audit|legal|bankrupt|hallucinating|bias|prejudice)/i.test(text)) {
      return this.buildDecision(
        EqoreIntent.CLIENT_ASSURANCE_QUERY,
        'Crisis/Assurance keywords matched.',
        { concierge: false, assurance: true, shadow: true, matcher: true, scheduling: true }
      );
    }

    // 1. Prompt Injection / Abuse Checks
    if (/(ignore previous|reveal prompt|developer mode|system prompt|bypass rules)/i.test(text)) {
      return this.buildDecision(
        EqoreIntent.PROMPT_INJECTION_OR_ABUSE,
        'Detected prompt injection attempt.',
        { concierge: true, humanHandoff: false } // Safety agent handles it
      );
    }

    // 2. Exact Greetings (Very short, obvious)
    if (/^(hi|hello|hey|greetings|morning|afternoon|evening)$/i.test(text) || text.length <= 3) {
      return this.buildDecision(
        EqoreIntent.GREETING_OR_CHITCHAT,
        'Simple greeting detected.',
        { concierge: true, shadow: false, matcher: false, scheduling: false }
      );
    }

    // 3. Scheduling
    if (/(book|schedule|call|meet|consultation) (a|with|for|tomorrow|today|next|meeting)/i.test(text) ||
        /book a meeting/i.test(text)) {
      return this.buildDecision(
        EqoreIntent.SCHEDULING,
        'Explicit scheduling phrase matched.',
        { concierge: false, shadow: true, matcher: false, scheduling: true }
      );
    }

    // 4. Careers / Job Seeker
    if (/(job|career|internship|resume|hiring|openings|apply|position)/i.test(text) && 
        !(/(how do you help with|service)/i.test(text))) {
      return this.buildDecision(
        EqoreIntent.CAREERS_OR_JOB_SEEKER,
        'Job seeker phrase matched.',
        { concierge: true, shadow: false, matcher: false, scheduling: false }
      );
    }

    // 5. Pricing / Proposal
    if (/(price|cost|quote|proposal|estimate|how much does it cost)/i.test(text)) {
      const hasScheduling = /(book|schedule|call|meet|consultation|tomorrow)/i.test(text);
      return this.buildDecision(
        EqoreIntent.PRICING_OR_PROPOSAL,
        'Pricing query detected.',
        { concierge: true, shadow: true, matcher: true, scheduling: hasScheduling }
      );
    }

    // 6. Support / Complaint
    if (/(complaint|issue|not working|support|broken|help me fix|refund)/i.test(text)) {
      return this.buildDecision(
        EqoreIntent.SUPPORT_OR_COMPLAINT,
        'Support/complaint phrase matched.',
        { concierge: false, shadow: false, matcher: false, scheduling: false, humanHandoff: true }
      );
    }
    
    // 7. Partnership
    if (/(partner|collaboration|vendor|sponsor|investor)/i.test(text)) {
      return this.buildDecision(
        EqoreIntent.PARTNERSHIP,
        'Partnership inquiry detected.',
        { concierge: true, shadow: false, matcher: false, scheduling: false, humanHandoff: true }
      );
    }

    return null; // Fallback to LLM
  }

  private static buildDecision(
    intent: EqoreIntent,
    reason: string,
    agents: {
      concierge?: boolean;
      assurance?: boolean;
      shadow?: boolean;
      matcher?: boolean;
      scheduling?: boolean;
      humanHandoff?: boolean;
    }
  ): EqoreRoutingDecision {
    return {
      intent,
      routingConfidence: 1.0,
      source: 'DETERMINISTIC',
      shouldRunConciergeAgent: agents.concierge ?? false,
      shouldRunAssuranceEngine: agents.assurance ?? false,
      shouldRunShadowAgent: agents.shadow ?? false,
      shouldRunServiceMatcher: agents.matcher ?? false,
      shouldRunSchedulingAgent: agents.scheduling ?? false,
      shouldRunHumanHandoff: agents.humanHandoff ?? false,
      reason
    };
  }
}
