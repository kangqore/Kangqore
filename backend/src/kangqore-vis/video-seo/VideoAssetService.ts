import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class VideoAssetService {
  static list(filter?: { blueprintId?: string }) {
    return prisma.kangqoreVisVideoAsset.findMany({
      where: { blueprintId: filter?.blueprintId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static create(data: Prisma.KangqoreVisVideoAssetUncheckedCreateInput) {
    return prisma.kangqoreVisVideoAsset.create({ data });
  }

  static update(id: string, data: Prisma.KangqoreVisVideoAssetUncheckedUpdateInput) {
    return prisma.kangqoreVisVideoAsset.update({ where: { id }, data });
  }
}
