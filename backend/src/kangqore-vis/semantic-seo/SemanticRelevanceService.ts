import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class SemanticRelevanceService {
  static list(filter?: { blueprintId?: string; isGap?: boolean }) {
    return prisma.kangqoreVisTopicRelevance.findMany({
      where: { blueprintId: filter?.blueprintId, isGap: filter?.isGap },
      orderBy: { relevanceScore: 'asc' },
    });
  }

  static record(data: Prisma.KangqoreVisTopicRelevanceUncheckedCreateInput) {
    return prisma.kangqoreVisTopicRelevance.create({
      data: { ...data, isGap: data.isGap ?? data.relevanceScore < 0.4 },
    });
  }

  static gaps() {
    return prisma.kangqoreVisTopicRelevance.findMany({
      where: { isGap: true },
      orderBy: { scoredAt: 'desc' },
    });
  }
}
