import { prisma } from '../../lib/prisma';

const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

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

    if (entries.length === 0) {
      entries.push({
        url: BASE_URL,
        lastmod: new Date().toISOString().split('T')[0],
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
