import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { emailService } from '../kangqore-view/eaf/channels/EmailService';
import logger from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import {
  conciergeChatLimiter,
  conciergeLeadLimiter,
} from '../middleware/conciergeRateLimiter';
import {
  streamConcierge,
  ConciergeMessage,
  CONCIERGE_ROLE,
  CONCIERGE_MODEL_VERSION,
} from '../kangqore-view/waanda/intelligence/ConciergeService';
import { WaandaTrainingPipeline } from '../waanda-training/trainingPipeline.service';
import { prefilter, HANDOFF_MESSAGE } from '../kangqore-view/waanda/intelligence/ConciergeGuardrails';
import { classifyIntent } from '../kangqore-view/waanda/intelligence/ConciergeIntent';
import { retrieve, ensureIndexLoaded } from '../kangqore-view/waanda/intelligence/ConciergeRetrieval';
import { EqoreSchedulingAgentService } from '../eqore/services/schedulingAgent.service';
import { EqoreTokenService } from '../eqore/session/token.service';
import { getIO } from '../socket';
import { SignalLedger } from '../kangqore-immp/signals/signalLedger.service';

const INTENT_TAG_MAP: Record<string, string> = {
  pricing: 'PRICING_INQUIRY',
  services: 'BIDS_INTEREST',
  comparison: 'COMPETITOR_COMPARISON',
  support: 'TECHNICAL_QUESTION',
  roadmap: 'TECHNICAL_QUESTION',
  scheduling: 'BOOKING_INTENT',
  contact: 'BOOKING_INTENT',
};

function enrichVisitorAsync(
  convId: string,
  visitorUuid: string | undefined,
  intent: string,
  messageCount: number,
  capturedLead: { contactId: string; email: string } | null
) {
  Promise.resolve().then(async () => {
    try {
      const mappedTag = INTENT_TAG_MAP[intent];
      if (mappedTag && visitorUuid) {
        await prisma.anonymousVisitor.updateMany({
          where: { visitorUuid, NOT: { intentTags: { has: mappedTag } } },
          data: { intentTags: { push: mappedTag } },
        });
      }
      const isBooking = intent === 'scheduling';
      const isLeadCapture = !!capturedLead;
      if (messageCount >= 3 || isBooking || isLeadCapture) {
        const signalType = isLeadCapture ? 'LEAD_CAPTURE' : isBooking ? 'BOOKING_INTENT' : 'DEEP_ENGAGEMENT';
        const signalCategory = isLeadCapture || isBooking ? 'INTENT' : 'BEHAVIOR';
        const severity = isLeadCapture ? 'CRITICAL' : isBooking ? 'HIGH' : 'MODERATE';
        const confidence = isLeadCapture ? 1.0 : isBooking ? 0.9 : Math.min(0.9, messageCount / 10);

        try {
          getIO().to('admin').emit('kimmp:signal:eqore', {
            type: signalType,
            conversationId: convId,
            visitorUuid: visitorUuid || null,
            intent: mappedTag || intent,
            messageCount,
            timestamp: new Date().toISOString(),
          });
        } catch {}

        // Persist to Signal Ledger so the Decision Engine can act on eQORE signals.
        SignalLedger.record({
          sourceModule:    'eqore',
          signalType,
          signalCategory,
          signalValue:     mappedTag || intent,
          confidence,
          severity,
          conversationId:  convId,
          metadata: {
            visitorUuid:  visitorUuid || null,
            intent:       mappedTag || intent,
            messageCount,
          },
        }).catch(() => {});
      }
    } catch (e: any) {
      logger.warn(`concierge.enrichment.warn: ${e.message}`);
    }
  });
}

const router = Router();

const chatSchema = Joi.object({
  message: Joi.string().min(2).max(12000).required(),
  conversationId: Joi.string().optional().allow(null, ''),
  visitorUuid: Joi.string().uuid().optional().allow(null, ''),
});

const leadSchema = Joi.object({
  conversationId: Joi.string().optional().allow(null, ''),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  organization: Joi.string().max(200).optional().allow(''),
  intent: Joi.string().max(500).optional().allow(''),
});

function sseHeaders(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
}

function sseEvent(res: Response, event: string, data: any) {
  if (res.writableEnded || res.closed) return;
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

router.post(
  '/',
  conciergeChatLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = chatSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    const { message, conversationId, visitorUuid } = value as {
      message: string;
      conversationId?: string;
      visitorUuid?: string;
    };

    let conversation = null;
    let history: ConciergeMessage[] = [];
    if (conversationId) {
      try {
        conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });
        if (conversation && Array.isArray(conversation.messages)) {
          history = (conversation.messages as any[])
            .filter(
              (m) =>
                m && (m.role === 'user' || m.role === 'assistant') &&
                typeof m.content === 'string'
            )
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content }));
        }
      } catch (e: any) {
        logger.warn(`concierge.history.lookup.failed: ${e.message}`);
      }
    }

    // Inject visitor footprint as leading context in history
    if (visitorUuid && history.length === 0) {
      try {
        const visitor = await prisma.anonymousVisitor.findUnique({
          where: { visitorUuid },
          select: { topPages: true, eqoreQueries: true, intentTags: true, sessionCount: true },
        })
        if (visitor && (visitor.topPages.length || visitor.eqoreQueries.length || visitor.intentTags.length)) {
          const lines: string[] = ['[VISITOR CONTEXT — do not mention this to the visitor]']
          if (visitor.sessionCount > 1) lines.push(`Returning visitor (${visitor.sessionCount} sessions)`)
          if (visitor.topPages.length) lines.push(`Pages visited: ${visitor.topPages.slice(0, 5).join(', ')}`)
          if (visitor.eqoreQueries.length) lines.push(`Prior eQORE queries: ${visitor.eqoreQueries.slice(0, 5).join(' | ')}`)
          if (visitor.intentTags.length) lines.push(`Intent signals: ${visitor.intentTags.join(', ')}`)
          history = [
            { role: 'user', content: lines.join('\n') },
            { role: 'assistant', content: 'Understood. I have the visitor context and will personalise my response accordingly.' },
          ]
        }
      } catch (e: any) {
        logger.warn(`concierge.visitor.context.warn: ${e.message}`)
      }
    }

    sseHeaders(res);

    const closed = { value: false };
    req.on('close', () => {
      closed.value = true;
    });

    const intent = classifyIntent(message);

    const pre = prefilter(message);
    if (pre.blocked) {
      logger.info(
        `concierge.guardrail.tripped rule=${pre.rule} (prefilter) intent=${intent}`
      );
      const text = pre.cannedResponse || HANDOFF_MESSAGE;
      sseEvent(res, 'delta', { text });
      sseEvent(res, 'done', {
        text,
        citations: [],
        guardrailsTripped: [{ rule: pre.rule, phase: 'prefilter' }],
        rewritten: false,
      });
      await persistTurn({
        conversationId,
        userText: message,
        assistantText: text,
        visitorUuid,
        meta: {
          intent,
          prefilterRule: pre.rule,
          guardrailsTripped: [{ rule: pre.rule, phase: 'prefilter' }],
          citations: [],
          tokens: { input: 0, output: 0, cacheRead: 0 },
          latencyMs: 0,
          source: 'concierge',
        },
      })
        .then(({ id: convId }) => sseEvent(res, 'conversation', { conversationId: convId }))
        .catch((err) => logger.error(`concierge.persist.error: ${err.message}`))
        .finally(() => res.end());
      return;
    }

    let finalText = '';
    let finalMeta: any = null;
    let capturedLead: { contactId: string; email: string } | null = null;

    let retrievedChunks: any[] = [];
    let retrievalIds: string[] = [];
    try {
      await ensureIndexLoaded();
      retrievedChunks = await retrieve(message, { k: 6 });
      retrievalIds = retrievedChunks.map((c: any) => c.id);
    } catch (e: any) {
      logger.warn(`concierge.retrieval.error: ${e.message}`);
    }

    try {
      // Phase 4: Handle Scheduling Intent
      if (intent === 'scheduling') {
        // Resolve eQORE lead for slot picker
        let eqoreLead = await prisma.eqoreLead.findFirst({
          where: { sessionId: conversationId || 'temp' }, // In ai-concierge, conversationId is often the session identifier from localStorage
          orderBy: { createdAt: 'desc' }
        });

        // If no lead, create one (bridging legacy concierge to eQORE leads)
        if (!eqoreLead && conversationId) {
          eqoreLead = await prisma.eqoreLead.create({
            data: {
              sessionId: conversationId,
              status: 'NEW',
              sourcePage: req.headers.referer || 'concierge',
              conversation: {
                connectOrCreate: {
                  where: { sessionId: conversationId },
                  create: { sessionId: conversationId },
                },
              },
            }
          });
        }

        if (eqoreLead) {
          sseEvent(res, 'lead_id', { leadId: eqoreLead.id });
          const recommendation = await EqoreSchedulingAgentService.processSchedulingIntent(eqoreLead.id, message);
          if (recommendation && recommendation.offeredSlots.length > 0) {
            sseEvent(res, 'scheduling_slots', { slots: recommendation.offeredSlots });
          }
        }
      }

      await streamConcierge(message, history, {
        onDelta: (delta) => {
          if (closed.value) return;
          sseEvent(res, 'delta', { text: delta });
        },
        onToolCall: async (call) => {
          if (call.name !== 'capture_lead') return;
          const input = call.input || {};
          const name = String(input.name || '').trim();
          const email = String(input.email || '').trim();
          if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            logger.warn(`concierge.tool.capture_lead.invalid name=${!!name} email=${!!email}`);
            sseEvent(res, 'lead_invalid', { reason: 'missing-or-invalid-fields' });
            return;
          }
          try {
            const contact = await prisma.contact.create({
              data: {
                name,
                email,
                organization: input.organization ? String(input.organization) : undefined,
                subject: 'eQORE Concierge Lead (tool-use)',
                message:
                  input.intent ? String(input.intent) : 'Lead captured via eQORE Concierge tool-use',
                source: 'concierge',
                inquiryType: 'Concierge',
              },
            });
            capturedLead = { contactId: contact.id, email };
            sseEvent(res, 'lead_captured', {
              contactId: contact.id,
              name,
              email,
              organization: input.organization || null,
              intent: input.intent || null,
            });
            try {
              await emailService.sendEmail({
                to: email,
                subject: 'We received your message - Kangqore',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e40af;">Thanks for reaching out</h2>
                    <p>Dear ${name},</p>
                    <p>A Kangqore consultant will be in touch within one business day.</p>
                    ${input.intent ? `<div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>What you wanted to discuss:</strong><br/>${input.intent}</div>` : ''}
                    <p>Best regards,<br/>The Kangqore Team</p>
                  </div>
                `,
              });
              await emailService.sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@kangqore.com',
                subject: `New Concierge Lead (tool): ${name}`,
                html: `
                  <h3>New eQORE Concierge Lead via tool-use</h3>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Organization:</strong> ${input.organization || 'N/A'}</p>
                  <p><strong>Intent:</strong> ${input.intent || 'Not provided'}</p>
                `,
              });
            } catch (emailError: any) {
              logger.error(`concierge.tool.lead.email.error: ${emailError.message}`);
            }
            logger.info(`concierge.tool.capture_lead.ok contactId=${contact.id}`);
          } catch (e: any) {
            logger.error(`concierge.tool.capture_lead.error: ${e.message}`);
            sseEvent(res, 'lead_invalid', { reason: 'persist-failed' });
          }
        },
        onDone: async (final) => {
          finalText = final.text;
          finalMeta = {
            intent,
            citations: final.citations,
            retrieved: retrievalIds,
            guardrailsTripped: final.trips,
            rewritten: final.rewritten,
            toolCalls: (final.toolCalls || []).map((c) => ({ name: c.name })),
            followups: final.followups || [],
            leadCaptured: capturedLead || undefined,
            tokens: {
              input: final.inputTokens,
              output: final.outputTokens,
              cacheRead: final.cacheReadTokens,
            },
            latencyMs: final.latencyMs,
            budgetExceeded: final.budgetExceeded,
            source: 'concierge',
          };
          if (final.rewritten) {
            sseEvent(res, 'rewrite', { text: final.text, trips: final.trips });
          }
          if (final.followups && final.followups.length > 0) {
            sseEvent(res, 'followups', { followups: final.followups });
          }
          sseEvent(res, 'done', {
            text: final.text,
            citations: final.citations,
            guardrailsTripped: final.trips,
            rewritten: final.rewritten,
            followups: final.followups || [],
          });
          try {
            const { id: convId, userMessageCount } = await persistTurn({
              conversationId,
              userText: message,
              assistantText: final.text,
              meta: finalMeta,
              visitorUuid,
            });
            sseEvent(res, 'conversation', { conversationId: convId });
            enrichVisitorAsync(convId, visitorUuid, intent, userMessageCount, capturedLead);
            // Capture every real concierge turn as a training example.
            // dispatchId = convId so the /feedback endpoint can apply quality labels.
            const trainingPriority = (intent === 'comparison' || intent === 'pricing' || intent === 'services') ? 'HIGH' : 'NORMAL';
            WaandaTrainingPipeline.captureSpeak({
              system:          'CONCIERGE',
              trigger:         intent,
              systemPrompt:    CONCIERGE_ROLE,
              userPrompt:      message,
              completion:      final.text,
              priority:        trainingPriority,
              dispatchId:      convId,
              conversationId:  convId,
              modelVersion:    CONCIERGE_MODEL_VERSION,
            });
          } catch (err: any) {
            logger.error(`concierge.persist.error: ${err.message}`);
          } finally {
            res.end();
          }
        },
        onError: (err) => {
          logger.error(`concierge.stream.error: ${err.message}`);
          sseEvent(res, 'error', { message: 'Concierge unavailable' });
          sseEvent(res, 'delta', { text: HANDOFF_MESSAGE });
          sseEvent(res, 'done', {
            text: HANDOFF_MESSAGE,
            citations: [],
            guardrailsTripped: [{ rule: 'upstream-error' }],
            rewritten: false,
          });
          res.end();
        },
      }, retrievedChunks);
    } catch (e: any) {
      logger.error(`concierge.unexpected: ${e.message}`);
      if (!res.writableEnded) {
        sseEvent(res, 'error', { message: 'Concierge unavailable' });
        res.end();
      }
    }
  }
);

const feedbackSchema = Joi.object({
  conversationId: Joi.string().required(),
  messageIndex: Joi.number().integer().min(0).required(),
  rating: Joi.string().valid('up', 'down').required(),
  reason: Joi.string().max(500).optional().allow(''),
});

router.post(
  '/feedback',
  conciergeLeadLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = feedbackSchema.validate(req.body);
      if (error) throw createError(error.details[0].message, 400);
      const conv = await prisma.conversation.findUnique({
        where: { id: value.conversationId },
      });
      if (!conv || conv.kind !== 'concierge') {
        throw createError('Conversation not found', 404);
      }
      const created = await prisma.conciergeFeedback.create({
        data: {
          conversationId: value.conversationId,
          messageIndex: value.messageIndex,
          rating: value.rating,
          reason: value.reason || null,
        },
      });
      logger.info(
        `concierge.feedback rating=${value.rating} conversationId=${value.conversationId} idx=${value.messageIndex}`
      );
      // Apply human quality label to the training example for this conversation turn.
      // dispatchId was set to convId at capture time, so this directly labels it.
      WaandaTrainingPipeline.applyFeedback({
        dispatchId: value.conversationId,
        feedback:   value.rating === 'up' ? 'ACCEPTED' : 'DISMISSED',
        correction: value.reason || undefined,
      }).catch(() => {});
      res.status(201).json({ ok: true, id: created.id });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/conversations/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || id.length > 64) {
        throw createError('Invalid id', 400);
      }
      const conv = await prisma.conversation.findUnique({ where: { id } });
      if (!conv || conv.kind !== 'concierge') {
        return res.status(404).json({ error: 'Not found' });
      }
      const messages = Array.isArray(conv.messages) ? (conv.messages as any[]) : [];
      const meta: any = (conv.meta as any) || {};
      const turns: any[] = Array.isArray(meta.turns) ? meta.turns : [];

      // Pair each assistant turn with its citations (turns are recorded per-turn,
      // which means turns[i] corresponds to assistant message at index 2*i+1).
      const enriched = messages.map((m, i) => {
        if (m?.role !== 'assistant') return { role: m.role, content: m.content };
        const turnIdx = Math.floor(i / 2);
        const turn = turns[turnIdx];
        return {
          role: 'assistant',
          content: m.content,
          citations: turn?.citations || [],
        };
      });

      res.json({
        id: conv.id,
        kind: conv.kind,
        messages: enriched,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/lead',
  conciergeLeadLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = leadSchema.validate(req.body);
      if (error) {
        throw createError(error.details[0].message, 400);
      }
      const { conversationId, name, email, organization, intent } = value;

      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          organization: organization || undefined,
          subject: intent || 'eQORE Concierge Lead',
          message: intent || `Lead captured via eQORE Concierge${conversationId ? ` (conversation ${conversationId})` : ''}`,
          source: 'concierge',
          inquiryType: 'Concierge',
        },
      });

      try {
        await emailService.sendEmail({
          to: email,
          subject: 'We received your message - Kangqore',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Thanks for reaching out</h2>
              <p>Dear ${name},</p>
              <p>A Kangqore consultant will be in touch within one business day.</p>
              ${intent ? `<div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>What you wanted to discuss:</strong><br/>${intent}</div>` : ''}
              <p>Best regards,<br/>The Kangqore Team</p>
            </div>
          `,
        });
        await emailService.sendEmail({
          to: process.env.ADMIN_EMAIL || 'admin@kangqore.com',
          subject: `New Concierge Lead: ${name}`,
          html: `
            <h3>New eQORE Concierge Lead</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
            <p><strong>Intent:</strong> ${intent || 'Not provided'}</p>
            <p><strong>Conversation:</strong> ${conversationId || 'N/A'}</p>
          `,
        });
      } catch (emailError: any) {
        logger.error(`concierge.lead.email.error: ${emailError.message}`);
      }

      if (conversationId) {
        try {
          const conv = await prisma.conversation.findUnique({
            where: { id: conversationId },
          });
          if (conv) {
            const meta = (conv.meta as any) || {};
            meta.leadCaptured = {
              contactId: contact.id,
              at: new Date().toISOString(),
            };
            await prisma.conversation.update({
              where: { id: conversationId },
              data: { meta },
            });
          }
        } catch (e: any) {
          logger.warn(`concierge.lead.conversation.update.failed: ${e.message}`);
        }
      }

      logger.info(`concierge.lead.captured contactId=${contact.id} email=${email}`);
      res.status(201).json({
        ok: true,
        contactId: contact.id,
        message: 'A Kangqore consultant will be in touch shortly.',
      });
    } catch (e) {
      next(e);
    }
  }
);

async function persistTurn(args: {
  conversationId?: string;
  userText: string;
  assistantText: string;
  meta: any;
  visitorUuid?: string;
}): Promise<{ id: string; userMessageCount: number }> {
  const { conversationId, userText, assistantText, meta, visitorUuid } = args;
  const now = new Date().toISOString();

  const newMessages = [
    { role: 'user', content: userText, timestamp: now },
    { role: 'assistant', content: assistantText, timestamp: now },
  ];

  if (conversationId) {
    const existing = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (existing) {
      const prior = Array.isArray(existing.messages)
        ? (existing.messages as any[])
        : [];
      const priorMeta = (existing.meta as any) || {};
      const turns = (priorMeta.turns || []) as any[];
      turns.push(meta);
      const intents: Record<string, number> = { ...(priorMeta.intents || {}) };
      if (meta?.intent) intents[meta.intent] = (intents[meta.intent] || 0) + 1;
      const allMessages = [...prior, ...newMessages];
      const updated = await prisma.conversation.update({
        where: { id: existing.id },
        data: {
          messages: allMessages as any,
          meta: { ...priorMeta, turns, lastTurn: meta, intents, visitorUuid: visitorUuid || priorMeta.visitorUuid },
          kind: existing.kind || 'concierge',
        },
      });
      const userCount = allMessages.filter((m: any) => m.role === 'user').length;
      return { id: updated.id, userMessageCount: userCount };
    }
  }

  const intents: Record<string, number> = {};
  if (meta?.intent) intents[meta.intent] = 1;
  const created = await prisma.conversation.create({
    data: {
      kind: 'concierge',
      messages: newMessages as any,
      meta: { turns: [meta], lastTurn: meta, intents, visitorUuid },
    },
  });
  return { id: created.id, userMessageCount: 1 };
}

export default router;
