// ---------------------------------------------------------------------------
// KIMMP Page Factory — Publish Workflow (PR-D)
//
// Wraps the page lifecycle so every create / generate / publish / unpublish is
// recorded in an audit trail. Publishing stays admin-gated — this service does
// not change WHO can publish, only ensures the action is logged.
//
// Sitemap: published pages are picked up automatically — SitemapService now
// includes KimmpGeneratedPage rows, so no explicit "refresh" step is needed.
//
// `prisma as any`: the generated client may not carry the kimmpPageAudit
// accessor on a fresh checkout (no postinstall generate). Audit writes are
// best-effort and never block the lifecycle action.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { PageStore } from './pageStore.service';

type AuditAction = 'CREATED' | 'GENERATED' | 'PUBLISHED' | 'UNPUBLISHED';

async function writeAudit(
  pageId: string | null,
  slug: string,
  action: AuditAction,
  actor?: string,
  detail?: string
): Promise<void> {
  try {
    await (prisma as any).kimmpPageAudit.create({
      data: { pageId, slug, action, actor: actor ?? null, detail: detail ?? null },
    });
  } catch (error) {
    // Best-effort — never let an audit failure break the lifecycle action.
    logger.warn(`KIMMP page audit not written (${action}): ${(error as Error).message}`);
  }
}

export class PublishWorkflow {
  /** Publish a page and record it. */
  static async publish(id: string, actor?: string) {
    const page = await PageStore.publish(id, actor);
    await writeAudit(page.id, page.slug, 'PUBLISHED', actor, `route ${page.route}`);
    return page;
  }

  /** Return a page to DRAFT and record it. */
  static async unpublish(id: string, actor?: string) {
    const page = await PageStore.unpublish(id);
    await writeAudit(page.id, page.slug, 'UNPUBLISHED', actor);
    return page;
  }

  /** Record a page creation (CREATED for manual, GENERATED for AI-drafted). */
  static async recordCreation(
    page: { id: string; slug: string },
    actor?: string,
    generated = false
  ): Promise<void> {
    await writeAudit(page.id, page.slug, generated ? 'GENERATED' : 'CREATED', actor);
  }

  /** Most-recent-first audit trail. */
  static recent(limit = 100) {
    return (prisma as any).kimmpPageAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(1, limit), 500),
    });
  }
}
