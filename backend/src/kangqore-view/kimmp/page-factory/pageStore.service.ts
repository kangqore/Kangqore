// ---------------------------------------------------------------------------
// KIMMP Page Factory — Page Store (PR-A1)
//
// CRUD + publish lifecycle for generated pages. Pages are DRAFT until an admin
// explicitly publishes them — KIMMP never auto-publishes.
//
// `prisma as any`: the repo has no postinstall `prisma generate`, so the
// generated client may not carry the `kimmpGeneratedPage` accessor on a fresh
// checkout. `as any` keeps this compile-safe; callers handle DB errors.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import { CreatePageInput, UpdatePageInput } from './pageSchema';

/** A slug becomes a route by ensuring a single leading slash. */
export function slugToRoute(slug: string): string {
  const clean = slug.replace(/^\/+/, '');
  return `/${clean}`;
}

export class PageStore {
  static create(input: CreatePageInput, createdBy?: string) {
    return (prisma as any).kimmpGeneratedPage.create({
      data: {
        slug: input.slug.replace(/^\/+/, ''),
        route: slugToRoute(input.slug),
        pageType: input.pageType,
        title: input.title,
        department: input.department ?? null,
        primaryService: input.primaryService ?? null,
        contentJson: input.content as any,
        status: 'DRAFT',
        createdBy: createdBy ?? null,
      },
    });
  }

  static list(filter?: { status?: string; pageType?: string }) {
    const where: Record<string, unknown> = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.pageType) where.pageType = filter.pageType;
    return (prisma as any).kimmpGeneratedPage.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });
  }

  static getById(id: string) {
    return (prisma as any).kimmpGeneratedPage.findUnique({ where: { id } });
  }

  /** Only returns PUBLISHED pages — used by the public renderer endpoint. */
  static getPublishedBySlug(slug: string) {
    return (prisma as any).kimmpGeneratedPage.findFirst({
      where: { slug: slug.replace(/^\/+/, ''), status: 'PUBLISHED' },
    });
  }

  static update(id: string, input: UpdatePageInput) {
    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.department !== undefined) data.department = input.department;
    if (input.primaryService !== undefined) data.primaryService = input.primaryService;
    if (input.content !== undefined) {
      data.contentJson = input.content;
      data.version = { increment: 1 };
    }
    return (prisma as any).kimmpGeneratedPage.update({ where: { id }, data });
  }

  static publish(id: string, publishedBy?: string) {
    return (prisma as any).kimmpGeneratedPage.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date(), publishedBy: publishedBy ?? null },
    });
  }

  static unpublish(id: string) {
    return (prisma as any).kimmpGeneratedPage.update({
      where: { id },
      data: { status: 'DRAFT' },
    });
  }
}
