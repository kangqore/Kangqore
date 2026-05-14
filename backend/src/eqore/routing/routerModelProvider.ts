/**
 * eQORE Intent Gateway — Router Model Provider Interface (Phase 6)
 */

import { EqoreRoutingDecision } from './intentSchema';

export type RouterClassificationInput = {
  message: string;
  conversationHistory?: { role: string; content: string }[];
};

export interface RouterModelProvider {
  classify(input: RouterClassificationInput): Promise<EqoreRoutingDecision>;
}
