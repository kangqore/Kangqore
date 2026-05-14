/**
 * eQORE Phase 7 — Response Synthesizer Service
 *
 * Merges outputs from multiple agents into one clean, user-facing response.
 * Handles priority ordering: Safety > Scheduling > Service Recommendation > Concierge.
 */

import { EqoreAgentResult } from './agentResult';
import logger from '../../utils/logger';

export class ResponseSynthesizerService {
  /**
   * Combines agent results into a single coherent response.
   */
  static synthesize(results: EqoreAgentResult[], fallbackMessage: string): string {
    const successful = results.filter(r => r.status === 'SUCCESS' && r.userVisibleMessage);

    if (successful.length === 0) {
      return fallbackMessage;
    }

    // Priority ordering of response segments
    const segments: string[] = [];

    // 1. Assurance Engine (Crisis override — becomes the core narrative)
    const assurance = successful.find(r => r.agentName === 'AssuranceEngine');
    if (assurance?.userVisibleMessage) {
      segments.push(assurance.userVisibleMessage);
      
      // If we have assurance, we skip general concierge/matcher as the assurance response is holistic
      const scheduling = successful.find(r => r.agentName === 'SchedulingAgent');
      if (scheduling?.userVisibleMessage) segments.push(scheduling.userVisibleMessage);
      
      const handoff = successful.find(r => r.agentName === 'HumanHandoff');
      if (handoff?.userVisibleMessage) segments.push(handoff.userVisibleMessage);

      return segments.join('\n\n');
    }

    // 2. Concierge greeting / opener (always first if present)
    const concierge = successful.find(r => r.agentName === 'Concierge');
    if (concierge?.userVisibleMessage) {
      segments.push(concierge.userVisibleMessage);
    }

    // 3. Service Recommendation (core intelligence)
    const serviceMatcher = successful.find(r => r.agentName === 'ServiceMatcher');
    if (serviceMatcher?.userVisibleMessage) {
      segments.push(serviceMatcher.userVisibleMessage);
    }

    // 4. Shadow Agent next-best-question or solution package
    const shadow = successful.find(r => r.agentName === 'ShadowAgent');
    if (shadow?.userVisibleMessage) {
      segments.push(shadow.userVisibleMessage);
    }

    // 5. Graph Intelligence (case study, cross-sell)
    const graph = successful.find(r => r.agentName === 'GraphEnrichment');
    if (graph?.userVisibleMessage) {
      segments.push(graph.userVisibleMessage);
    }

    // 6. Scheduling (always last — it's the CTA)
    const scheduling = successful.find(r => r.agentName === 'SchedulingAgent');
    if (scheduling?.userVisibleMessage) {
      segments.push(scheduling.userVisibleMessage);
    }

    // 7. Human Handoff (overrides everything)
    const handoff = successful.find(r => r.agentName === 'HumanHandoff');
    if (handoff?.userVisibleMessage) {
      segments.push(handoff.userVisibleMessage);
    }

    if (segments.length === 0) {
      return fallbackMessage;
    }

    // Join with paragraph breaks for clean formatting
    const merged = segments.join('\n\n');

    logger.info(`ResponseSynthesizer: Merged ${segments.length} agent outputs`);
    return merged;
  }
}
