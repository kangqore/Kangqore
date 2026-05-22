// ---------------------------------------------------------------------------
// KIMMP Page Factory — page content schema (zod v4)
//
// A generated page is structured data, not hand-written React. The frontend
// renderer (PR-A2) consumes this shape. KIMMP's content generator (PR-C) will
// later produce it; for PR-A1 an admin supplies it directly.
// ---------------------------------------------------------------------------

import { z } from 'zod';

export const PAGE_TYPES = [
  'solution',
  'service',
  'industry',
  'faq',
  'landing',
  'content',
] as const;

export const PAGE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

/** One content block. `type` drives which renderer component is used. */
export const pageSectionSchema = z
  .object({
    type: z.string().min(1),
    heading: z.string().optional(),
    body: z.string().optional(),
    items: z.array(z.string()).optional(),
    buttonLabel: z.string().optional(),
  })
  .passthrough();

/** The full structured content of a page. */
export const pageContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    subheadline: z.string().optional(),
  }),
  sections: z.array(pageSectionSchema).default([]),
  seo: z.object({
    title: z.string().min(1).max(70),
    description: z.string().min(1).max(320),
  }),
  schema: z.array(z.string()).default([]),
  internalLinks: z.array(z.string()).default([]),
});

export const createPageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(180)
    .regex(/^\/?[a-z0-9]+(?:[-/][a-z0-9]+)*$/, 'slug: lowercase letters, digits, hyphens and slashes only'),
  pageType: z.enum(PAGE_TYPES),
  title: z.string().min(1).max(200),
  department: z.string().optional(),
  primaryService: z.string().optional(),
  content: pageContentSchema,
});

export const updatePageSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    department: z.string().optional(),
    primaryService: z.string().optional(),
    content: pageContentSchema.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'no fields to update' });

export type PageContent = z.infer<typeof pageContentSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
