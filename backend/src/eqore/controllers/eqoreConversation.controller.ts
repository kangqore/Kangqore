import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { EqoreTokenService } from '../session/token.service';
import { EqoreLeadClassificationService } from '../../eqore-lead-intelligence/scoring/leadClassification.service';
import { EqoreLeadScoringService } from '../../eqore-lead-intelligence/scoring/leadScoring.service';
import { eqoreQueue } from '../queue/eqore.queue';
import { AgentDispatcherService } from '../routing/agentDispatcher.service';
import { KimmpEqoreShadowObserver } from '../../kangqore-immp/eqore-bridge/eqoreShadowObserver.service';
import { KimmpEqoreInfluence } from '../../kangqore-immp/eqore-bridge/eqoreInfluence.service';
import { SignalLedger } from '../../kangqore-immp/signals/signalLedger.service';
import { WaandaUnderstand } from '../../kangqore-immp/relationship-intelligence';
import logger from '../../utils/logger';
import { isEqoreMaintenanceMode } from '../../kangqore-view/waanda/adapters/EqoreAdapter';

/** High-value intents that warrant a HIGH severity INTENT signal. */
const HIGH_INTENT_INTENTS = new Set([
  'PRICING_OR_PROPOSAL',
  'SCHEDULING',
  'HUMAN_HANDOFF',
]);

export class EqoreConversationController {
  static async handleMessage(req: Request, res: Response) {
    try {
      const { message, sessionId: providedSessionId, sourcePage, referrer, device, userAgent } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // WAANDA PAUSE directive puts eQORE in maintenance mode — reject new conversations
      if (isEqoreMaintenanceMode()) {
        return res.status(503).json({ error: 'eQORE is in maintenance mode. Please try again shortly.' });
      }

      // Handle session token
      let sessionId = providedSessionId;
      if (!sessionId || !EqoreTokenService.isValidToken(sessionId)) {
        sessionId = EqoreTokenService.generateSessionToken();
      }

      // Find or create conversation
      let conversation = await prisma.eqoreConversation.findUnique({
        where: { sessionId },
        include: { messages: true, lead: true }
      });

      if (!conversation) {
        conversation = await prisma.eqoreConversation.create({
          data: {
            sessionId,
            sourcePage,
            referrer,
            device,
            userAgent
          },
          include: { messages: true, lead: true }
        });
      }

      // Notify WAANDA that eQORE is active (keeps lastActive timestamp real)
      import('../../kangqore-view/waanda/adapters/EqoreAdapter').then(({ notifyEqoreConversation }) => notifyEqoreConversation()).catch(() => {})

      // Add user message
      const userMessage = await prisma.eqoreMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: message,
        }
      });

      // Update conversation timestamp
      await prisma.eqoreConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      // Refresh messages
      const messages = await prisma.eqoreMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' }
      });

      // Lead Management
      let lead = conversation.lead;
      if (!lead) {
        // Create a lead automatically for the session
        const visitorType = EqoreLeadClassificationService.classifyVisitorType(messages);
        lead = await prisma.eqoreLead.create({
          data: {
            conversationId: conversation.id,
            sessionId,
            visitorType,
            status: 'NEW',
            sourcePage,
          }
        });
        
        await prisma.eqoreLeadEvent.create({
          data: {
            leadId: lead.id,
            eventType: 'LEAD_CREATED',
            reason: 'First interaction in new session',
            newStatus: 'NEW'
          }
        });
      }

      // ─── KIMMP PR 2 — shadow-mode behavior observation ───
      // Fire-and-forget. KIMMP observes and logs only; it never alters the
      // response or the eQORE flow, and never throws.
      KimmpEqoreShadowObserver.observe({
        conversationId: conversation.id,
        leadId: lead.id,
        sessionId,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      });

      // ─── eROOT — WAANDA Perception Stage ───
      // Fire-and-forget: builds the Relationship Strategy Object from real Prisma data
      // (intent, goals, emotion, trust score) and emits it to the URGI event bus.
      // Never blocks the response path.
      WaandaUnderstand.processInteraction(sessionId, {
        leadId:         lead.id,
        conversationId: conversation.id,
      }).catch(() => {});

      // 1. Pre-safety: Prompt Injection Check
      const injectionKeywords = ['ignore previous instructions', 'reveal your system prompt', 'show internal score', 'bypass rules', 'developer mode', 'act as unrestricted'];
      const isInjectionAttempt = injectionKeywords.some(k => message.toLowerCase().includes(k));
      
      if (isInjectionAttempt) {
        logger.warn(`Prompt injection attempt detected from session ${sessionId}`);
        await prisma.eqoreLeadEvent.create({
          data: {
            leadId: lead.id,
            eventType: 'NEGATIVE_SIGNAL_DETECTED',
            reason: 'PROMPT_INJECTION_DETECTED: Security guard triggered.',
            newScore: lead.leadScore
          }
        });
      }

      // 2. Update Lead Score (Deterministic backbone runs on every message)
      await EqoreLeadScoringService.updateLeadScore(lead.id, messages);

      // 3. Dispatch to Intent Gateway → Orchestrator (Phase 7)
      // Routing: deterministic → cache → Claude Haiku
      // Orchestration: Concierge, Shadow, ServiceMatcher, Scheduling, Graph, Guardrail
      const dispatchResult = await AgentDispatcherService.dispatch({
        message,
        conversationId: conversation.id,
        leadId: lead.id,
        messageId: userMessage.id,
        sessionId,
        history: messages.map(m => ({ role: m.role, content: m.content })),
        messages: messages.map(m => ({ id: m.id, role: m.role, content: m.content }))
      });

      // ─── Phase 2 — eQORE emits INTENT signal to Signal Ledger ───
      // Fire-and-forget; never throws; never blocks the response path.
      void SignalLedger.record({
        sourceModule: 'eqore',
        signalType: 'INTENT_DETECTED',
        signalCategory: 'INTENT',
        signalValue: dispatchResult.intent,
        confidence: 0.8,
        severity: HIGH_INTENT_INTENTS.has(dispatchResult.intent) ? 'HIGH' : 'LOW',
        conversationId: conversation.id,
        leadId: lead.id,
        sessionId,
        metadata: { source: dispatchResult.intent },
      });

      // ─── KIMMP PR 2b — behavior may shape the response ───
      // Flag-gated (KIMMP_EQORE_INFLUENCE, default OFF) — a no-op unless enabled.
      // Best-effort: on any failure it returns the original content unchanged.
      const influence = await KimmpEqoreInfluence.apply(
        dispatchResult.responseContent,
        messages.map(m => ({ role: m.role, content: m.content }))
      );
      const finalContent = influence.content;

      // 3. Save Assistant Message
      // The dispatcher returns the synchronous "Concierge" response.
      // If a background agent (eQORE Shadow) was invoked, it may push websocket events later.
      const assistantMessage = await prisma.eqoreMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'EQORE',
          content: finalContent,
          intent: dispatchResult.intent
        }
      });

      // Also update the user message intent
      await prisma.eqoreMessage.update({
        where: { id: userMessage.id },
        data: { intent: dispatchResult.intent }
      });

      return res.json({
        sessionId,
        message: assistantMessage.content,
        intent: assistantMessage.intent,
        timeline: dispatchResult.timeline
      });
    } catch (error) {

      console.error('EqoreConversationController.handleMessage error:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
}
