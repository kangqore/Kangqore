/**
 * eQORE Phase 7 — Orchestrator Service
 *
 * The central multi-agent execution loop.
 * Receives a routing decision, runs selected agents in correct order,
 * merges outputs, applies guardrails, logs the full timeline.
 */

import { prisma } from '../../lib/prisma';
import { EqoreAgentResult, OrchestrationTimeline } from './agentResult';
import { ResponseSynthesizerService } from './responseSynthesizer.service';
import { FinalGuardrailService } from '../guardrails/finalGuardrail.service';
import { EqoreRoutingDecision, EqoreIntent } from '../routing/intentSchema';
import { EqoreShadowLeadAgent } from '../agents/shadowLead.agent';
import { EqoreSchedulingAgentService } from '../services/schedulingAgent.service';
import { GraphRecommendationService } from '../../eqore-lead-intelligence/graph/graphRecommendation.service';
import { EqoreAssuranceService } from '../assurance/assuranceEngine.service';
import { eqoreQueue } from '../queue/eqore.queue';
import logger from '../../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { EqoreSalesPipelineService } from '../../eqore-lead-intelligence/sales/salesPipeline.service';

export class EqoreOrchestratorService {
  private static async runShadowAgentSync(conversationId: string, leadId: string, messageId: string, messages: any[]): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      const { EqoreShadowLeadAgent } = await import('../agents/shadowLead.agent');
      const intelligence = await EqoreShadowLeadAgent.analyzeTranscript(conversationId, messages);
      if (intelligence) {
        await EqoreShadowLeadAgent.persistIntelligence(leadId, intelligence, messageId);
      }
      return {
        agentName: 'ShadowAgent',
        status: 'SUCCESS',
        backendActions: ['SHADOW_ANALYSIS_COMPLETED_SYNC'],
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        agentName: 'ShadowAgent',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }

  static async orchestrate(params: {
    decision: EqoreRoutingDecision;
    message: string;
    conversationId: string;
    leadId: string;
    messageId: string;
    sessionId: string;
    messages: { id: string; role: string; content: string }[];
  }): Promise<{ responseContent: string; timeline: OrchestrationTimeline }> {
    const { decision, message, conversationId, leadId, messageId, sessionId, messages } = params;
    const orchestrationId = uuidv4();
    const startTime = Date.now();
    const agentResults: EqoreAgentResult[] = [];

    // ─── 1. Concierge Agent (Sync — always fast) ───
    if (decision.shouldRunConciergeAgent) {
      const conciergeResult = await this.runConcierge(decision, message);
      agentResults.push(conciergeResult);
    }

    // ─── 2. Shadow Agent ───
    if (decision.shouldRunShadowAgent) {
      if (process.env.TEST_MODE === 'true') {
        const shadowResult = await this.runShadowAgentSync(conversationId, leadId, messageId, messages);
        agentResults.push(shadowResult);
        // During test mode, if Shadow detected scheduling, dynamically flag it
        const lead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
        if (lead?.schedulingStatus === 'INTERESTED' || (lead as any).preferredConsultationTime) {
          decision.shouldRunSchedulingAgent = true;
        }
      } else {
        const shadowResult = await this.enqueueShadow(conversationId, leadId, messageId);
        agentResults.push(shadowResult);
      }
    }

    // ─── 2.5 Assurance Engine (Sync — High Priority for crisis) ───
    let isEmergency = false;
    if (decision.shouldRunAssuranceEngine) {
      const assuranceResult = await EqoreAssuranceService.process(message);
      agentResults.push(assuranceResult);
      if (assuranceResult.metadata?.urgencyLevel === 'CRISIS') {
        isEmergency = true;
        decision.shouldRunSchedulingAgent = true; // Elevate to sync scheduling
      }
    }

    // ─── 3. Service Matcher (Sync from Shadow output if available) ───
    if (decision.shouldRunServiceMatcher) {
      const matcherResult = await this.runServiceMatcher(leadId);
      agentResults.push(matcherResult);
    }

    // ─── 4. Scheduling Agent (Sync if scheduling intent) ───
    if (decision.shouldRunSchedulingAgent) {
      const schedResult = await this.runSchedulingAgent(leadId, message, isEmergency);
      agentResults.push(schedResult);
    }

    // ─── 5. Graph Enrichment (Async — fire and forget) ───
    if (decision.shouldRunShadowAgent || decision.shouldRunServiceMatcher) {
      const graphResult = await this.runGraphEnrichment(leadId);
      agentResults.push(graphResult);
    }

    // ─── 6. Human Handoff (if required) ───
    if (decision.shouldRunHumanHandoff) {
      const handoffResult = await this.runHumanHandoff(leadId, decision.intent);
      agentResults.push(handoffResult);
    }

    // ─── 7. Synthesize Response ───
    const fallback = 'Let me analyze that for you. Our intelligence engine is evaluating the best solution...';
    const rawResponse = ResponseSynthesizerService.synthesize(agentResults, fallback);

    // ─── 8. Final Guardrail ───
    const guardrailResult = FinalGuardrailService.evaluate(rawResponse);

    // ─── 9. Build Timeline ───
    const totalLatencyMs = Date.now() - startTime;
    const timeline: OrchestrationTimeline = {
      orchestrationId,
      conversationId,
      leadId,
      messageId,
      intent: decision.intent,
      routingSource: decision.source,
      routingConfidence: decision.routingConfidence,
      agentResults,
      synthesizedResponse: guardrailResult.sanitizedResponse,
      guardrailStatus: guardrailResult.status,
      guardrailNotes: guardrailResult.notes,
      totalLatencyMs,
      completedAt: new Date().toISOString()
    };

    // ─── 10. Persist Timeline to Agent Log ───
    await this.persistTimeline(timeline, decision);

    // ─── 11. Evaluate for Sales Pipeline (Phase 9) ───
    // Fire and forget so we don't block the user response
    EqoreSalesPipelineService.evaluateAndCreateOpportunity(leadId).catch(err => {
      logger.error(`Sales Pipeline evaluation failed for lead ${leadId}`, err);
    });

    logger.info(`Orchestration ${orchestrationId} completed in ${totalLatencyMs}ms — ${agentResults.length} agents, guardrail: ${guardrailResult.status}`);

    return {
      responseContent: guardrailResult.sanitizedResponse,
      timeline
    };
  }

  // ═══════════════════════════════════════════════
  // Agent Runners
  // ═══════════════════════════════════════════════

  private static async runConcierge(decision: EqoreRoutingDecision, message: string): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      const response = this.generateConciergeResponse(decision, message);
      return {
        agentName: 'Concierge',
        status: 'SUCCESS',
        userVisibleMessage: response,
        confidence: 1.0,
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        agentName: 'Concierge',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }

  private static async enqueueShadow(conversationId: string, leadId: string, messageId: string): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      await eqoreQueue.enqueueShadowAnalysis({ conversationId, leadId, latestMessageId: messageId });
      await prisma.eqoreLead.update({
        where: { id: leadId },
        data: { shadowAnalysisStatus: 'QUEUED' }
      });
      return {
        agentName: 'ShadowAgent',
        status: 'SUCCESS',
        backendActions: ['SHADOW_ANALYSIS_QUEUED'],
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        agentName: 'ShadowAgent',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }

  private static async runServiceMatcher(leadId: string): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      // Service matcher runs from already-persisted Shadow intelligence
      const lead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
      if (!lead?.matchedServices || (lead.matchedServices as any[]).length === 0) {
        return {
          agentName: 'ServiceMatcher',
          status: 'SKIPPED',
          latencyMs: Date.now() - start,
          metadata: { reason: 'No matched services available yet — waiting for Shadow Agent' }
        };
      }
      const services = (lead.matchedServices as any[]).slice(0, 3);
      const topService = services[0];
      const msg = topService
        ? `Based on your requirements, this looks like a strong fit for Kangqore's **${topService.service || topService.slug}** capabilities${lead.recommendedSolutionPackage ? `, delivered through our ${lead.recommendedSolutionPackage} engagement` : ''}.`
        : undefined;
      return {
        agentName: 'ServiceMatcher',
        status: 'SUCCESS',
        userVisibleMessage: msg,
        confidence: topService?.fitScore || 0,
        leadUpdates: { matchedServicesCount: services.length },
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        agentName: 'ServiceMatcher',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }

  private static async runSchedulingAgent(leadId: string, message: string, isEmergency = false): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      const result = await EqoreSchedulingAgentService.processSchedulingIntent(leadId, message);
      
      if (!result && !isEmergency) {
        return {
          agentName: 'SchedulingAgent',
          status: 'SKIPPED',
          latencyMs: Date.now() - start,
          metadata: { reason: 'No scheduling intent detected by chrono-node' }
        };
      }

      let msg: string;
      if (isEmergency) {
        msg = "Given the critical nature of this situation, I have prioritized your request for an **Emergency Executive Consultation**. We can have a stabilization team on a call with you immediately. Would you like to schedule this now?";
      } else if (result?.offeredSlots && result.offeredSlots.length > 0) {
        const slotList = result.offeredSlots.map(s => `• ${s.label}`).join('\n');
        msg = `I found ${result.offeredSlots.length} available consultation slots:\n${slotList}\n\nWould you like to book one of these?`;
      } else if (result?.schedulingIntent) {
        msg = 'I can help schedule an Executive Consultation. Could you share your preferred day and time?';
      } else {
        msg = '';
      }

      return {
        agentName: 'SchedulingAgent',
        status: 'SUCCESS',
        userVisibleMessage: msg || undefined,
        backendActions: result?.offeredSlots && result.offeredSlots.length > 0 ? ['SLOTS_OFFERED'] : ['SCHEDULING_INTENT_DETECTED'],
        leadUpdates: { schedulingStatus: result?.status ?? 'NONE' },
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        agentName: 'SchedulingAgent',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }

  private static async runGraphEnrichment(leadId: string): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      const enriched = await GraphRecommendationService.enrichLeadContext(leadId);
      return {
        agentName: 'GraphEnrichment',
        status: enriched ? 'SUCCESS' : 'SKIPPED',
        backendActions: enriched ? ['GRAPH_CONTEXT_ENRICHED'] : [],
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        agentName: 'GraphEnrichment',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }

  private static async runHumanHandoff(leadId: string, intent: EqoreIntent): Promise<EqoreAgentResult> {
    const start = Date.now();
    try {
      // Log the handoff event
      await prisma.eqoreLeadEvent.create({
        data: {
          leadId,
          eventType: 'HUMAN_HANDOFF_REQUESTED',
          reason: `Intent "${intent}" requires human attention`
        }
      });

      let msg = '';
      if (intent === EqoreIntent.SUPPORT_OR_COMPLAINT) {
        msg = 'I\'m connecting you with our support team right away. A team member will follow up shortly.';
      } else if (intent === EqoreIntent.PARTNERSHIP) {
        msg = 'I\'ve flagged your partnership interest for our strategic alliances team. They\'ll reach out soon.';
      } else {
        msg = 'I\'m routing this to the right team member who can best assist you.';
      }

      return {
        agentName: 'HumanHandoff',
        status: 'SUCCESS',
        userVisibleMessage: msg,
        backendActions: ['HUMAN_HANDOFF_FLAGGED'],
        latencyMs: Date.now() - start
      };
    } catch (error) {
      return {
        agentName: 'HumanHandoff',
        status: 'FAILED',
        error: (error as Error).message,
        latencyMs: Date.now() - start
      };
    }
  }

  // ═══════════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════════

  private static generateConciergeResponse(d: EqoreRoutingDecision, msg: string): string {
    switch (d.intent) {
      case EqoreIntent.GREETING_OR_CHITCHAT:
        return 'Hello! I\'m eQORE — Kangqore\'s unified intelligence. How can I help your business today?';
      case EqoreIntent.SCHEDULING:
        return 'I can help you set up an Executive Consultation with our team.';
      case EqoreIntent.CAREERS_OR_JOB_SEEKER:
        return 'We\'re always looking for great talent! Please visit our Careers page to see current openings and apply directly.';
      case EqoreIntent.PRICING_OR_PROPOSAL:
        return 'I can outline how our solutions might fit your budget. Our specialists are analyzing your needs now.';
      case EqoreIntent.PROMPT_INJECTION_OR_ABUSE:
        return 'I can\'t fulfill that request. How else can I assist with Kangqore\'s services?';
      case EqoreIntent.CONTENT_OR_RESEARCH:
        return 'I can help you find insights on that topic across our case studies and whitepapers.';
      case EqoreIntent.SERVICE_INQUIRY:
        return 'Great question! Let me identify the best Kangqore solutions for your needs.';
      case EqoreIntent.CLIENT_ASSURANCE_QUERY:
        return 'I understand this is an urgent situation. Our executive intelligence engine is preparing a response and stabilization plan for you right now.';
      default:
        return 'Let me look into that for you.';
    }
  }

  private static async persistTimeline(timeline: OrchestrationTimeline, decision: EqoreRoutingDecision) {
    try {
      await prisma.eqoreAgentLog.create({
        data: {
          conversationId: timeline.conversationId,
          leadId: timeline.leadId,
          messageId: timeline.messageId,
          routerSource: timeline.routingSource,
          detectedIntent: timeline.intent,
          routingConfidence: timeline.routingConfidence,
          selectedAgents: timeline.agentResults
            .filter(r => r.status !== 'SKIPPED')
            .map(r => r.agentName) as any,
          skippedAgents: timeline.agentResults
            .filter(r => r.status === 'SKIPPED')
            .map(r => r.agentName) as any,
          resultsJson: timeline.agentResults as any,
          reason: decision.reason,
          totalLatencyMs: timeline.totalLatencyMs,
          modelProvider: process.env.EQORE_ROUTER_PROVIDER || 'anthropic',
          modelName: process.env.EQORE_ROUTER_MODEL || 'claude-haiku-4-5',
          promptTokens: decision.metrics?.promptTokens || 0,
          completionTokens: decision.metrics?.completionTokens || 0,
          estimatedCost: decision.metrics?.estimatedCost || 0.0,
          status: timeline.guardrailStatus === 'BLOCKED' ? 'GUARDRAIL_BLOCKED' : 'COMPLETED'
        }
      });
    } catch (error) {
      logger.error('EqoreOrchestrator: Failed to persist timeline:', error);
    }
  }
}
