/**
 * eQORE Intent Gateway — Intent Schema (Phase 6)
 * 
 * Defines the core intents that dictate which agents are invoked.
 */

export enum EqoreIntent {
  GREETING_OR_CHITCHAT = "GREETING_OR_CHITCHAT",
  SERVICE_INQUIRY = "SERVICE_INQUIRY",
  PRICING_OR_PROPOSAL = "PRICING_OR_PROPOSAL",
  SCHEDULING = "SCHEDULING",
  CAREERS_OR_JOB_SEEKER = "CAREERS_OR_JOB_SEEKER",
  PARTNERSHIP = "PARTNERSHIP",
  SUPPORT_OR_COMPLAINT = "SUPPORT_OR_COMPLAINT",
  CONTENT_OR_RESEARCH = "CONTENT_OR_RESEARCH",
  PROMPT_INJECTION_OR_ABUSE = "PROMPT_INJECTION_OR_ABUSE",
  HUMAN_HANDOFF = "HUMAN_HANDOFF",
  CLIENT_ASSURANCE_QUERY = "CLIENT_ASSURANCE_QUERY",
  UNKNOWN = "UNKNOWN"
}

export type EqoreRoutingDecision = {
  intent: EqoreIntent;
  routingConfidence: number; // 0.0 - 1.0
  source: "DETERMINISTIC" | "LLM_CLASSIFIER" | "CACHE" | "FALLBACK";
  shouldRunShadowAgent: boolean;
  shouldRunServiceMatcher: boolean;
  shouldRunSchedulingAgent: boolean;
  shouldRunConciergeAgent: boolean;
  shouldRunAssuranceEngine: boolean;
  shouldRunHumanHandoff: boolean;
  reason: string;
  metrics?: {
    promptTokens: number;
    completionTokens: number;
    estimatedCost: number;
  };
};
