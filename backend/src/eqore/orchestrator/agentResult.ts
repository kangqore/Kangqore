/**
 * eQORE Phase 7 — Agent Execution Contract
 *
 * Every agent in the orchestration pipeline MUST return this shape.
 * This makes all agents plug-and-play within the Orchestrator.
 */

export type EqoreAgentResult = {
  agentName: string;
  status: 'SUCCESS' | 'SKIPPED' | 'FAILED';
  intent?: string;
  userVisibleMessage?: string;
  backendActions?: string[];
  leadUpdates?: Record<string, any>;
  events?: { eventType: string; reason: string; confidence?: number }[];
  confidence?: number;
  latencyMs?: number;
  error?: string;
  metadata?: Record<string, any>;
};

export type OrchestrationTimeline = {
  orchestrationId: string;
  conversationId: string;
  leadId: string;
  messageId: string;
  intent: string;
  routingSource: string;
  routingConfidence: number;
  agentResults: EqoreAgentResult[];
  synthesizedResponse: string;
  guardrailStatus: 'PASSED' | 'MODIFIED' | 'BLOCKED';
  guardrailNotes?: string[];
  totalLatencyMs: number;
  completedAt: string;
};
