// ---------------------------------------------------------------------------
// KIMMP Page Factory — controller (PR-A1)
//
// Backend "rails": create / list / get / update / publish / unpublish pages,
// plus a public render endpoint the frontend renderer (PR-A2) consumes.
// ---------------------------------------------------------------------------

import { Request, Response } from 'express';
import logger from '../../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { createPageSchema, updatePageSchema, PAGE_TYPES, PAGE_STATUSES } from './pageSchema';
import { PageStore } from './pageStore.service';
import { MissingPageDetector } from './missingPageDetector.service';
import { PageGenerator } from './pageGenerator.service';
import { PublishWorkflow } from './publishWorkflow.service';

/** Maps a thrown DB error to an HTTP response. Returns true if handled. */
function handleDbError(error: unknown, res: Response): boolean {
  const code = (error as { code?: string }).code;
  if (code === 'P2002') {
    res.status(409).json({ error: 'A page with that slug already exists' });
    return true;
  }
  if (code === 'P2025') {
    res.status(404).json({ error: 'Page not found' });
    return true;
  }
  logger.error('KIMMP Page Factory DB error:', error);
  res.status(500).json({
    error: 'Page Factory storage error',
    hint: 'The kimmp_generated_pages table may be missing — run `prisma migrate deploy`.',
  });
  return true;
}

/** Derive a valid page slug from free text. */
function slugify(s: string): string {
  const text = String(s || '').slice(0, 100).toLowerCase();
  const rawSlug = text.replace(/[^a-z0-9]+/g, '-');
  let start = 0;
  let end = rawSlug.length;
  while (start < end && rawSlug[start] === '-') start++;
  while (end > start && rawSlug[end - 1] === '-') end--;
  const slug = rawSlug.slice(start, end).slice(0, 80);
  return slug || 'page';
}

export class PageFactoryController {
  /** POST /page-factory/pages — create a DRAFT page. */
  static async create(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    const parsed = createPageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        error: 'Invalid page payload',
        details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    try {
      const createdBy = (req as any).user?.userId;
      const page = await PageStore.create(parsed.data, createdBy);
      await PublishWorkflow.recordCreation(page, createdBy, false);
      return res.status(201).json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** GET /page-factory/pages?status=&pageType= — list pages. */
  static async list(req: Request, res: Response) {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const pageType = typeof req.query.pageType === 'string' ? req.query.pageType : undefined;
    try {
      const pages = await PageStore.list({ status, pageType });
      return res.json({ pages, count: pages.length });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** GET /page-factory/pages/:id — fetch one page (any status). */
  static async getById(req: Request, res: Response) {
    try {
      const page = await PageStore.getById(req.params.id);
      if (!page) return res.status(404).json({ error: 'Page not found' });
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** PATCH /page-factory/pages/:id — update a page's content/metadata. */
  static async update(req: Request, res: Response) {
    const parsed = updatePageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        error: 'Invalid update payload',
        details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    try {
      const page = await PageStore.update(req.params.id, parsed.data);
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** POST /page-factory/pages/:id/publish — publish a page (admin-gated). */
  static async publish(req: Request, res: Response) {
    try {
      const publishedBy = (req as any).user?.userId;
      const page = await PublishWorkflow.publish(req.params.id, publishedBy);
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** POST /page-factory/pages/:id/unpublish — return a page to DRAFT. */
  static async unpublish(req: Request, res: Response) {
    try {
      const page = await PublishWorkflow.unpublish(req.params.id, (req as any).user?.userId);
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** GET /page-factory/rendered/:slug — PUBLIC. Only returns PUBLISHED pages. */
  static async rendered(req: Request, res: Response) {
    try {
      const rawSlug = req.params.slug;
      const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : (rawSlug || '');
      const page = await PageStore.getPublishedBySlug(slug);
      if (!page) return res.status(404).json({ error: 'Page not found or not published' });
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** POST /page-factory/opportunities/scan — detect missing-page opportunities. */
  static async scanOpportunities(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    try {
      const limit = Number(req.query.limit);
      const result = await MissingPageDetector.scan({
        conversationLimit: Number.isFinite(limit) ? Math.min(Math.max(1, limit), 2000) : undefined,
      });
      return res.json({ result });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** GET /page-factory/opportunities?status= — list detected opportunities. */
  static async listOpportunities(req: Request, res: Response) {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    try {
      const opportunities = await MissingPageDetector.list(status);
      return res.json({ opportunities, count: opportunities.length });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** PATCH /page-factory/opportunities/:id — update an opportunity's status. */
  static async updateOpportunity(req: Request, res: Response) {
    const status = (req.body || {}).status;
    if (!['OPEN', 'DISMISSED', 'CONVERTED'].includes(status)) {
      return res.status(422).json({ error: 'status must be OPEN, DISMISSED, or CONVERTED' });
    }
    try {
      const opportunity = await MissingPageDetector.setStatus(req.params.id, status);
      return res.json({ opportunity });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** POST /page-factory/generate — KIMMP drafts a page via Claude, saved as DRAFT. */
  static async generate(req: Request, res: Response) {
    if (!KimmpFlags.enabled()) {
      return res.status(503).json({ error: 'KIMMP is disabled (KIMMP_ENABLED=false)' });
    }
    const { title, pageType, slug, department, primaryService, opportunityId } = req.body || {};
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(422).json({ error: 'title is required' });
    }
    if (!PAGE_TYPES.includes(pageType)) {
      return res.status(422).json({ error: `pageType must be one of: ${PAGE_TYPES.join(', ')}` });
    }

    try {
      const generated = await PageGenerator.generate({
        title: title.trim(),
        pageType,
        department: typeof department === 'string' ? department : undefined,
        primaryService: typeof primaryService === 'string' ? primaryService : undefined,
      });

      // Locked rule: never save a page carrying unsupported claims.
      if (generated.claimIssues.length > 0) {
        return res.status(422).json({
          error: 'Generated content contained unsupported claims — nothing was saved.',
          claimIssues: generated.claimIssues,
        });
      }

      const page = await PageStore.create(
        {
          slug: typeof slug === 'string' && slug.trim() ? slug.trim() : slugify(title),
          pageType,
          title: title.trim(),
          department:
            typeof department === 'string' && department.trim() ? department.trim() : undefined,
          primaryService:
            typeof primaryService === 'string' && primaryService.trim()
              ? primaryService.trim()
              : undefined,
          content: generated.content,
        },
        (req as any).user?.userId
      );
      await PublishWorkflow.recordCreation(page, (req as any).user?.userId, true);

      // If this came from a detected opportunity, mark it converted.
      if (typeof opportunityId === 'string' && opportunityId) {
        try {
          await MissingPageDetector.setStatus(opportunityId, 'CONVERTED');
        } catch {
          /* non-fatal — the page was still created */
        }
      }

      return res.status(201).json({
        page,
        generation: { model: generated.model, status: 'DRAFT' },
      });
    } catch (error) {
      const msg = (error as Error).message || '';
      if (msg.includes('ANTHROPIC_API_KEY')) {
        return res
          .status(503)
          .json({ error: 'Page generation unavailable: ANTHROPIC_API_KEY not set' });
      }
      if ((error as { code?: string }).code === 'P2002') {
        return res.status(409).json({ error: 'A page with that slug already exists' });
      }
      if ((error as { status?: number }).status === 529 || /overloaded/i.test(msg)) {
        return res.status(503).json({
          error: 'Page generation temporarily unavailable — the model is overloaded. Retry shortly.',
        });
      }
      logger.error('KIMMP page generation failed:', error);
      return res.status(500).json({ error: 'Page generation failed', detail: msg });
    }
  }

  /** GET /page-factory/audit — page lifecycle audit trail. */
  static async audit(req: Request, res: Response) {
    const raw = Number(req.query.limit);
    const limit = Number.isFinite(raw) ? Math.min(Math.max(1, raw), 500) : 100;
    try {
      const entries = await PublishWorkflow.recent(limit);
      return res.json({ entries, count: entries.length });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** GET /page-factory/meta — allowed page types & statuses (for the admin UI). */
  static meta(_req: Request, res: Response) {
    return res.json({ pageTypes: PAGE_TYPES, statuses: PAGE_STATUSES });
  }
}
