import { prisma } from '../../lib/prisma';

export class BrokenLinkAuditor {
  static async run(): Promise<{ scanned: number; broken: string[] }> {
    const links = await prisma.kangqoreVisInternalLink.findMany({
      include: { source: { select: { url: true } }, target: { select: { url: true, status: true } } },
    });

    const broken: string[] = [];
    for (const link of links) {
      if (!link.target || link.target.status !== 'PUBLISHED') {
        broken.push(`${link.source.url} -> ${link.target?.url ?? '<missing>'}`);
      }
    }

    return { scanned: links.length, broken };
  }
}
