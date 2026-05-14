/**
 * eQORE Intent Gateway — Agent Dispatcher (Phase 6 → Phase 7 Refactored)
 * 
 * Resolves routing (deterministic → cache → LLM) then delegates to
 * the EqoreOrchestratorService for multi-agent execution.
 */

import { prisma } from '../../lib/prisma';
import { DeterministicRouter } from './deterministicRouter';
import { LlmClassifierService } from './llmClassifier.service';
import { RoutingCacheService } from './routingCache.service';
import { EqoreIntent, EqoreRoutingDecision } from './intentSchema';
import { EqoreOrchestratorService } from '../orchestrator/eqoreOrchestrator.service';
import { OrchestrationTimeline } from '../orchestrator/agentResult';
import logger from '../../utils/logger';

export class AgentDispatcherService {
  /**
   * Resolves routing, then hands off to the Orchestrator.
   */
  static async dispatch(params: {
    message: string;
    conversationId: string;
    leadId: string;
    messageId: string;
    sessionId: string;
    history: { role: string; content: string }[];
    messages: { id: string; role: string; content: string }[];
  }): Promise<{ intent: EqoreIntent; responseContent: string; timeline: OrchestrationTimeline }> {
    const { message, conversationId, leadId, messageId, sessionId, history, messages } = params;
    let classificationMs = 0;

    let decision: EqoreRoutingDecision | null = null;

    // 1. Deterministic check
    decision = DeterministicRouter.route(message);

    // 2. Cache check (if deterministic missed)
    if (!decision) {
      decision = await RoutingCacheService.get(message);
    }

    // 3. LLM Classifier (if not cached and not deterministic)
    if (!decision) {
      const clsStart = Date.now();
      try {
        decision = await LlmClassifierService.classify({
          message,
          conversationHistory: history.slice(-5)
        });
        classificationMs = Date.now() - clsStart;
        
        // Cache the LLM decision
        if (decision.intent !== EqoreIntent.UNKNOWN) {
          await RoutingCacheService.set(message, decision);
        }
      } catch (e) {
        classificationMs = Date.now() - clsStart;
        decision = {
          intent: EqoreIntent.UNKNOWN,
          routingConfidence: 0,
          source: 'FALLBACK',
          shouldRunConciergeAgent: true,
          shouldRunShadowAgent: true,
          shouldRunServiceMatcher: true,
          shouldRunSchedulingAgent: false,
          shouldRunAssuranceEngine: false,
          shouldRunHumanHandoff: false,
          reason: 'Classification failed. Safe fallback.'
        };
      }
    }

    if (!decision) {
      throw new Error('Routing decision could not be resolved');
    }

    // 4. Delegate to Orchestrator
    const { responseContent, timeline } = await EqoreOrchestratorService.orchestrate({
      decision,
      message,
      conversationId,
      leadId,
      messageId,
      sessionId,
      messages
    });

    logger.info(`Dispatch complete: ${decision.intent} via ${decision.source} → ${timeline.agentResults.length} agents, guardrail: ${timeline.guardrailStatus}`);

    return {
      intent: decision.intent,
      responseContent,
      timeline
    };
  }
}
