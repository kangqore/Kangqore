import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class BacklinkService {
  static list(filter?: { status?: string }) {
    return prisma.kangqoreVisBacklink.findMany({
      where: { status: filter?.status, disavowed: false },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  static record(data: Prisma.KangqoreVisBacklinkUncheckedCreateInput) {
    return prisma.kangqoreVisBacklink.upsert({
      where: { sourceUrl_targetUrl: { sourceUrl: data.sourceUrl, targetUrl: data.targetUrl } },
      create: { ...data, lastSeenAt: new Date() },
      update: { ...data, lastSeenAt: new Date() },
    });
  }

  static disavow(id: string) {
    return prisma.kangqoreVisBacklink.update({ where: { id }, data: { disavowed: true } });
  }
}
