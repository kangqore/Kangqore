import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { EqoreTokenService } from '../session/token.service';
import { EqoreLeadClassificationService } from '../../eqore-lead-intelligence/scoring/leadClassification.service';
import { EqoreLeadScoringService } from '../../eqore-lead-intelligence/scoring/leadScoring.service';
import { eqoreQueue } from '../queue/eqore.queue';
import { AgentDispatcherService } from '../routing/agentDispatcher.service';
import { KimmpEqoreShadowObserver } from '../../kangqore-immp/eqore-bridge/eqoreShadowObserver.service';
import logger from '../../utils/logger';

export class EqoreConversationController {
  static async handleMessage(req: Request, res: Response) {
    try {
      const { message, sessionId: providedSessionId, sourcePage, referrer, device, userAgent } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
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

      // 3. Save Assistant Message
      // The dispatcher returns the synchronous "Concierge" response.
      // If a background agent (eQORE Shadow) was invoked, it may push websocket events later.
      const assistantMessage = await prisma.eqoreMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'EQORE',
          content: dispatchResult.responseContent,
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
