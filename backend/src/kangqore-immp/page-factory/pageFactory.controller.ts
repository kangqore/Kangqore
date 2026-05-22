// ---------------------------------------------------------------------------
// KIMMP Page Factory — controller (PR-A1)
//
// Backend "rails": create / list / get / update / publish / unpublish pages,
// plus a public render endpoint the frontend renderer (PR-A2) consumes.
// ---------------------------------------------------------------------------

import { Request, Response } from 'express';
import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { createPageSchema, updatePageSchema, PAGE_TYPES, PAGE_STATUSES } from './pageSchema';
import { PageStore } from './pageStore.service';

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
      const page = await PageStore.publish(req.params.id, publishedBy);
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** POST /page-factory/pages/:id/unpublish — return a page to DRAFT. */
  static async unpublish(req: Request, res: Response) {
    try {
      const page = await PageStore.unpublish(req.params.id);
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** GET /page-factory/rendered/:slug — PUBLIC. Only returns PUBLISHED pages. */
  static async rendered(req: Request, res: Response) {
    try {
      const page = await PageStore.getPublishedBySlug(req.params.slug);
      if (!page) return res.status(404).json({ error: 'Page not found or not published' });
      return res.json({ page });
    } catch (error) {
      return void handleDbError(error, res);
    }
  }

  /** GET /page-factory/meta — allowed page types & statuses (for the admin UI). */
  static meta(_req: Request, res: Response) {
    return res.json({ pageTypes: PAGE_TYPES, statuses: PAGE_STATUSES });
  }
}
