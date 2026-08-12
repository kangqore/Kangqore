import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class ImageAssetService {
  static list(filter?: { blueprintId?: string }) {
    return prisma.kangqoreVisImageAsset.findMany({
      where: { blueprintId: filter?.blueprintId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static create(data: Prisma.KangqoreVisImageAssetUncheckedCreateInput) {
    return prisma.kangqoreVisImageAsset.create({ data });
  }

  static update(id: string, data: Prisma.KangqoreVisImageAssetUncheckedUpdateInput) {
    return prisma.kangqoreVisImageAsset.update({ where: { id }, data });
  }

  static missingDimensions() {
    return prisma.kangqoreVisImageAsset.findMany({
      where: { OR: [{ width: null }, { height: null }] },
    });
  }
}
