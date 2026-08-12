import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class VoiceQueryService {
  static list(filter?: { answered?: boolean; blueprintId?: string }) {
    return prisma.kangqoreVisVoiceQuery.findMany({
      where: { answered: filter?.answered, blueprintId: filter?.blueprintId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static record(data: Prisma.KangqoreVisVoiceQueryUncheckedCreateInput) {
    return prisma.kangqoreVisVoiceQuery.create({ data });
  }

  static markAnswered(id: string, speakableSelector?: string) {
    return prisma.kangqoreVisVoiceQuery.update({
      where: { id },
      data: { answered: true, speakableSelector },
    });
  }
}
