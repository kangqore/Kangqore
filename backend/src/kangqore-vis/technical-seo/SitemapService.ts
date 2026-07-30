import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '../../lib/prisma';

const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

// Canonical static route manifest produced by scripts/generate-sitemap.mjs.
// This is the floor for the sitemap: the CMS-backed tables below ADD to it,
// they never replace it. Previously an empty CMS table collapsed the whole
// sitemap to a single homepage URL, hiding all 106 canonical routes.
interface RouteManifestEntry {
  path: string;
  type: string;
  priority: string;
  changefreq: string;
}

let manifestCache: RouteManifestEntry[] | null = null;

function loadRouteManifest(): RouteManifestEntry[] {
  if (manifestCache) return manifestCache;
  const candidates = [
    path.resolve(__dirname, '../../../../shared/siteRoutes.json'),
    path.resolve(process.cwd(), 'shared/siteRoutes.json'),
    path.resolve(process.cwd(), '../shared/siteRoutes.json'),
  ];
  for (const file of candidates) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.routes) && parsed.routes.length > 0) {
        manifestCache = parsed.routes as RouteManifestEntry[];
        return manifestCache;
      }
    } catch {
      /* try next candidate */
    }
  }
  console.warn('[SitemapService] siteRoutes.json not found — sitemap will only contain CMS pages');
  return [];
}

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const PRIORITY_BY_TYPE: Record<string, string> = {
  HOME: '1.0',
  DEPARTMENT: '0.9',
  SERVICE: '0.8',
  INDUSTRY: '0.8',
  CASE_STUDY: '0.7',
  INSIGHT: '0.6',
  BLOG: '0.6',
  WHITE_PAPER: '0.6',
  EVENT: '0.5',
  BROCHURE: '0.5',
  COMPANY: '0.7',
  CAREERS: '0.6',
  CONTACT: '0.7',
  LEGAL: '0.3',
  OTHER: '0.5',
};

export class SitemapService {
  static async generate(): Promise<string> {
    const blueprints = await prisma.kangqoreVisPageBlueprint.findMany({
      where: { status: 'PUBLISHED' },
      select: { url: true, updatedAt: true, pageType: true },
    });

    const entries: SitemapEntry[] = blueprints.map((b) => ({
      url: this.absolute(b.url),
      lastmod: b.updatedAt.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: PRIORITY_BY_TYPE[b.pageType] ?? '0.5',
    }));

    // KIMMP Page Factory — include published generated pages (PR-D).
    // `prisma as any`: kimmpGeneratedPage may be absent from the generated
    // client on a fresh checkout. A failure here must not break the sitemap.
    try {
      const kimmpPages = await (prisma as any).kimmpGeneratedPage.findMany({
        where: { status: 'PUBLISHED' },
        select: { route: true, updatedAt: true },
      });
      for (const p of kimmpPages) {
        entries.push({
          url: this.absolute(p.route),
          lastmod: new Date(p.updatedAt).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    } catch {
      /* KIMMP pages unavailable — sitemap still serves the VIS blueprints */
    }

    // Merge the static route manifest underneath the CMS entries. CMS rows win
    // on collision so an editor-managed lastmod/priority still takes effect.
    const today = new Date().toISOString().split('T')[0];
    const seen = new Set(entries.map((e) => e.url));
    for (const route of loadRouteManifest()) {
      const url = this.absolute(route.path);
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({
        url,
        lastmod: today,
        changefreq: route.changefreq,
        priority: route.priority,
      });
    }

    if (entries.length === 0) {
      // Only reachable if the manifest is missing AND the CMS is empty — a real
      // misconfiguration, so make it loud rather than silently shipping 1 URL.
      console.error('[SitemapService] no routes resolved — sitemap is empty');
      entries.push({
        url: BASE_URL,
        lastmod: today,
        changefreq: 'weekly',
        priority: '1.0',
      });
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries.map(
        (e) =>
          `  <url><loc>${e.url}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
      ),
      '</urlset>',
    ].join('\n');

    return xml;
  }

  private static absolute(url: string): string {
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
  }
}
