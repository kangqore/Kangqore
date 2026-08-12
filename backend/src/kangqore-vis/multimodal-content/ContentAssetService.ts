import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class ContentAssetService {
  static list(filter?: { blueprintId?: string; format?: string }) {
    return prisma.kangqoreVisContentAsset.findMany({
      where: { blueprintId: filter?.blueprintId, format: filter?.format },
      orderBy: { createdAt: 'desc' },
    });
  }

  static create(data: Prisma.KangqoreVisContentAssetUncheckedCreateInput) {
    return prisma.kangqoreVisContentAsset.create({ data });
  }

  static async coverageByBlueprint(blueprintId: string) {
    const assets = await prisma.kangqoreVisContentAsset.findMany({ where: { blueprintId } });
    const formats = new Set(assets.map((a) => a.format));
    return { blueprintId, formats: Array.from(formats), assetCount: assets.length };
  }
}
