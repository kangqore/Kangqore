import { Router, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { createError } from '../middleware/errorHandler';
import { requireAuth, requireRole, AuthRequest } from '../middleware/rbac';
import logger from '../utils/logger';
import {
  embedDocuments,
  getEmbeddingModel,
  isEmbeddingsConfigured,
} from '../kangqore-view/kimmp/knowledge/EmbeddingsService';
import {
  getIndexState,
  indexKnowledgeBase,
} from '../kangqore-view/waanda/intelligence/ConciergeRetrieval';
import { getKB, reloadKB } from '../kangqore-view/kimmp/knowledge/KbLoader';

const router = Router();

const adminGuard = [requireAuth, requireRole(['ADMIN'])];

router.get('/analytics', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sinceDays = Math.min(parseInt(String(req.query.days || '30'), 10) || 30, 365);
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);

    const conversations = await prisma.conversation.findMany({
      where: { kind: 'concierge', createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });

    let totalTurns = 0;
    let assistantTurns = 0;
    let citedAssistantTurns = 0;
    let leadsCaptured = 0;
    let promptTokens = 0;
    let outputTokens = 0;
    let cacheReadTokens = 0;
    const intentCounts: Record<string, number> = {};
    const guardrailCounts: Record<string, number> = {};
    const tokensByDay: Record<string, { input: number; output: number; cacheRead: number; turns: number }> = {};
    const topQuestionMap = new Map<string, { count: number; sample: string }>();
    const dropoffByTurn: Record<number, number> = {};

    for (const conv of conversations) {
      const meta = (conv.meta as any) || {};
      const turns = Array.isArray(meta.turns) ? meta.turns : [];
      const messages = Array.isArray(conv.messages) ? (conv.messages as any[]) : [];
      const userTurns = messages.filter((m) => m?.role === 'user');
      dropoffByTurn[userTurns.length] = (dropoffByTurn[userTurns.length] || 0) + 1;

      if (meta.leadCaptured?.contactId) leadsCaptured++;

      for (let i = 0; i < turns.length; i++) {
        const t = turns[i] || {};
        totalTurns++;
        assistantTurns++;
        if (Array.isArray(t.citations) && t.citations.length > 0) citedAssistantTurns++;
        if (t.intent) intentCounts[t.intent] = (intentCounts[t.intent] || 0) + 1;
        if (Array.isArray(t.guardrailsTripped)) {
          for (const g of t.guardrailsTripped) {
            const rule = g?.rule || 'unknown';
            guardrailCounts[rule] = (guardrailCounts[rule] || 0) + 1;
          }
        }
        const tk = t.tokens || {};
        promptTokens += Number(tk.input || 0);
        outputTokens += Number(tk.output || 0);
        cacheReadTokens += Number(tk.cacheRead || 0);

        const day = new Date(conv.updatedAt).toISOString().slice(0, 10);
        const cell =
          tokensByDay[day] || (tokensByDay[day] = { input: 0, output: 0, cacheRead: 0, turns: 0 });
        cell.input += Number(tk.input || 0);
        cell.output += Number(tk.output || 0);
        cell.cacheRead += Number(tk.cacheRead || 0);
        cell.turns += 1;

        const userMessage = messages[i * 2]?.content;
        if (typeof userMessage === 'string' && userMessage.trim().length > 0) {
          const key = userMessage.toLowerCase().trim().slice(0, 200);
          const entry = topQuestionMap.get(key);
          if (entry) entry.count += 1;
          else topQuestionMap.set(key, { count: 1, sample: userMessage.trim().slice(0, 200) });
        }
      }
    }

    const topQuestions = Array.from(topQuestionMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const feedback = await prisma.conciergeFeedback.findMany({
      where: { createdAt: { gte: since } },
    });
    const feedbackUp = feedback.filter((f) => f.rating === 'up').length;
    const feedbackDown = feedback.filter((f) => f.rating === 'down').length;

    const indexState = getIndexState();

    res.json({
      windowDays: sinceDays,
      since,
      conversations: conversations.length,
      totalTurns,
      citationCoverage: assistantTurns ? citedAssistantTurns / assistantTurns : 0,
      leadsCaptured,
      conversionRate: conversations.length ? leadsCaptured / conversations.length : 0,
      tokens: { input: promptTokens, output: outputTokens, cacheRead: cacheReadTokens },
      tokensByDay: Object.entries(tokensByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, v]) => ({ day, ...v })),
      intents: Object.entries(intentCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([intent, count]) => ({ intent, count })),
      guardrailTrips: Object.entries(guardrailCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([rule, count]) => ({ rule, count })),
      dropoffByTurn: Object.entries(dropoffByTurn)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([turn, count]) => ({ turn: Number(turn), count })),
      topQuestions,
      feedback: { up: feedbackUp, down: feedbackDown, total: feedback.length },
      retrievalIndex: indexState,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/knowledge', adminGuard, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const kb = getKB();
    const dbChunks = await prisma.knowledgeChunk.findMany({
      orderBy: { id: 'asc' },
    });
    const dbById = new Map(dbChunks.map((c) => [c.id, c]));
    const chunks = Array.from(kb.chunks.values()).map((c) => {
      const db = dbById.get(c.id);
      return {
        id: c.id,
        parentId: c.parentId,
        sourceFile: c.sourceFile,
        title: c.title,
        bodyPreview: c.body.slice(0, 240),
        bodyLength: c.body.length,
        tags: c.tags,
        populated: c.populated,
        internal: c.internal,
        contentHash: c.contentHash,
        embedded: Boolean(db && Array.isArray(db.embedding) && db.embedding.length > 0),
        embedModel: db?.embedModel || null,
        embeddedAt: db?.updatedAt || null,
      };
    });
    res.json({
      chunks,
      parents: Array.from(kb.parentDocs.values()).map((p) => ({
        id: p.id,
        sourceFile: p.sourceFile,
        title: p.title,
        populated: p.populated,
        internal: p.internal,
      })),
      indexState: getIndexState(),
      embeddingsConfigured: isEmbeddingsConfigured(),
      embeddingModel: getEmbeddingModel(),
    });
  } catch (e) {
    next(e);
  }
});

router.get('/knowledge/:id', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const kb = getKB();
    const chunk = kb.chunks.get(req.params.id);
    if (!chunk) throw createError('Chunk not found', 404);
    const db = await prisma.knowledgeChunk.findUnique({ where: { id: chunk.id } });
    res.json({
      ...chunk,
      embedded: Boolean(db && Array.isArray(db.embedding) && db.embedding.length > 0),
      embedModel: db?.embedModel || null,
      embeddedAt: db?.updatedAt || null,
    });
  } catch (e) {
    next(e);
  }
});

const updateSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  body: Joi.string().min(1).max(20000).optional(),
  tags: Joi.array().items(Joi.string().max(40)).max(20).optional(),
  populated: Joi.boolean().optional(),
});

router.patch('/knowledge/:id', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const kb = getKB();
    const existing = kb.chunks.get(req.params.id);
    if (!existing) throw createError('Chunk not found', 404);

    const newTitle = value.title ?? existing.title;
    const newBody = value.body ?? existing.body;
    const newTags = value.tags ?? existing.tags;
    const newPopulated = value.populated ?? existing.populated;

    const data: any = {
      id: existing.id,
      sourceFile: existing.sourceFile,
      parentId: existing.parentId,
      title: newTitle,
      body: newBody,
      tags: newTags,
      populated: newPopulated,
      internal: existing.internal,
      contentHash: require('crypto').createHash('sha256').update(newBody).digest('hex').slice(0, 16),
    };

    if (isEmbeddingsConfigured() && newPopulated) {
      try {
        const [emb] = await embedDocuments([`${newTitle}\n\n${newBody}`]);
        data.embedding = emb;
        data.embedModel = getEmbeddingModel();
      } catch (embErr: any) {
        logger.warn(`admin.kb.embed.failed: ${embErr.message}`);
      }
    } else {
      data.embedding = [];
    }

    const upserted = await prisma.knowledgeChunk.upsert({
      where: { id: existing.id },
      create: data,
      update: data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId || req.user?.id,
        action: 'CONCIERGE_KB_UPDATE',
        resource: existing.id,
        oldValue: { title: existing.title, body: existing.body, tags: existing.tags, populated: existing.populated },
        newValue: { title: newTitle, body: newBody, tags: newTags, populated: newPopulated },
      },
    });

    logger.info(`admin.kb.update id=${existing.id} userId=${req.user?.userId || req.user?.id}`);
    res.json({ ok: true, id: upserted.id, embedded: Array.isArray(data.embedding) && data.embedding.length > 0 });
  } catch (e) {
    next(e);
  }
});

router.post('/knowledge/reindex', adminGuard, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    reloadKB();
    const result = await indexKnowledgeBase({ force: true });
    res.json({ ok: true, ...result });
  } catch (e) {
    next(e);
  }
});

router.get('/embedding-check', adminGuard, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!isEmbeddingsConfigured()) {
      return res.json({
        ok: false,
        configured: false,
        message: 'VOYAGE_API_KEY is not set. Add it to backend/.env to enable retrieval.',
      });
    }
    const start = Date.now();
    try {
      const probe = await embedDocuments(['Kangqore concierge embedding probe.']);
      const dim = Array.isArray(probe[0]) ? probe[0].length : 0;
      res.json({
        ok: true,
        configured: true,
        model: getEmbeddingModel(),
        dim,
        latencyMs: Date.now() - start,
      });
    } catch (e: any) {
      res.status(502).json({
        ok: false,
        configured: true,
        model: getEmbeddingModel(),
        error: e.message?.slice(0, 300) || 'unknown',
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get('/feedback', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || '50'), 10) || 50, 500);
    const rating = req.query.rating ? String(req.query.rating) : undefined;
    const rows = await prisma.conciergeFeedback.findMany({
      where: rating === 'up' || rating === 'down' ? { rating } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    res.json({ feedback: rows });
  } catch (e) {
    next(e);
  }
});

router.get('/transcripts', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page       = Math.max(1, parseInt(String(req.query.page  || '1'),  10) || 1);
    const limit      = Math.min(50, parseInt(String(req.query.limit || '20'), 10) || 20);
    const skip       = (page - 1) * limit;
    const visitorUuid = req.query.visitorUuid ? String(req.query.visitorUuid) : undefined;

    const where: any = { kind: 'concierge' };
    if (visitorUuid) {
      where.meta = { path: ['visitorUuid'], equals: visitorUuid };
    }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        select: { id: true, messages: true, meta: true, createdAt: true, updatedAt: true },
      }),
      prisma.conversation.count({ where }),
    ]);

    const transcripts = conversations.map((c) => {
      const msgs  = Array.isArray(c.messages) ? (c.messages as any[]) : [];
      const meta  = (c.meta as any) || {};
      const userMsgs  = msgs.filter((m: any) => m.role === 'user');
      const firstUser = userMsgs[0]?.content ?? null;
      const intents   = meta.intents ? Object.keys(meta.intents) : [];
      return {
        id:           c.id,
        createdAt:    c.createdAt,
        updatedAt:    c.updatedAt,
        messageCount: msgs.length,
        turnCount:    userMsgs.length,
        firstMessage: firstUser ? String(firstUser).slice(0, 160) : null,
        intents,
        leadCaptured: !!(meta.leadCaptured),
        visitorUuid:  meta.visitorUuid ?? null,
      };
    });

    res.json({ transcripts, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
});

router.get('/transcripts/:id', adminGuard, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const conv = await prisma.conversation.findUnique({
      where: { id },
      select: { id: true, messages: true, meta: true, createdAt: true, updatedAt: true },
    });
    if (!conv || (conv as any).kind === undefined) {
      return res.status(404).json({ error: 'Not found' });
    }
    const msgs  = Array.isArray(conv.messages) ? (conv.messages as any[]) : [];
    const meta  = (conv.meta as any) || {};
    const turns: any[] = Array.isArray(meta.turns) ? meta.turns : [];
    const enriched = msgs.map((m: any, i: number) => {
      if (m?.role !== 'assistant') return { role: m.role, content: m.content, timestamp: m.timestamp };
      const turn = turns[Math.floor(i / 2)];
      return { role: 'assistant', content: m.content, timestamp: m.timestamp, citations: turn?.citations || [] };
    });
    res.json({
      id:          conv.id,
      createdAt:   conv.createdAt,
      updatedAt:   conv.updatedAt,
      messages:    enriched,
      intents:     meta.intents ?? {},
      leadCaptured: !!(meta.leadCaptured),
      visitorUuid: meta.visitorUuid ?? null,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
