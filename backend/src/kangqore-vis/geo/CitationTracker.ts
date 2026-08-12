import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class CitationTracker {
  static list(filter?: { engine?: string; cited?: boolean }) {
    return prisma.kangqoreVisAiCitation.findMany({
      where: { engine: filter?.engine, cited: filter?.cited },
      orderBy: { checkedAt: 'desc' },
    });
  }

  static record(data: Prisma.KangqoreVisAiCitationUncheckedCreateInput) {
    return prisma.kangqoreVisAiCitation.create({ data });
  }

  static async summaryByEngine() {
    const rows = await prisma.kangqoreVisAiCitation.groupBy({
      by: ['engine'],
      _count: { _all: true },
      where: { cited: true },
    });
    return rows.map((r) => ({ engine: r.engine, citedCount: r._count._all }));
  }
}
