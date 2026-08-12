import { prisma } from '../../lib/prisma';

export interface EntityTag {
  slug: string;
  name: string;
}

let cache: EntityTag[] | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

async function loadEntities(): Promise<EntityTag[]> {
  const now = Date.now();
  if (cache && now - cachedAt < CACHE_MS) return cache;
  const rows = await prisma.kangqoreVisEntity.findMany({ select: { slug: true, name: true } });
  cache = rows;
  cachedAt = now;
  return rows;
}

/** Match free text against known VIS entities. Returns matched entity slugs. */
export async function matchEntitySlugs(...texts: (string | null | undefined)[]): Promise<string[]> {
  const haystack = texts.filter(Boolean).join(' ').toLowerCase();
  if (!haystack) return [];
  const entities = await loadEntities();
  const matched = entities.filter((e) => haystack.includes(e.name.toLowerCase()));
  return [...new Set(matched.map((e) => e.slug))];
}
