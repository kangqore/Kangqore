import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export type BlueprintCreateInput = Prisma.KangqoreVisPageBlueprintUncheckedCreateInput;
export type BlueprintUpdateInput = Prisma.KangqoreVisPageBlueprintUncheckedUpdateInput;

export class PageBlueprintService {
  static list(filter?: { status?: string; pageType?: string }) {
    return prisma.kangqoreVisPageBlueprint.findMany({
      where: {
        status: filter?.status as any,
        pageType: filter?.pageType as any,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static getById(id: string) {
    return prisma.kangqoreVisPageBlueprint.findUnique({
      where: { id },
      include: { schemas: true, faqs: true, keywords: true },
    });
  }

  static getByUrl(url: string) {
    return prisma.kangqoreVisPageBlueprint.findUnique({
      where: { url },
      include: { schemas: true, faqs: true },
    });
  }

  static create(data: BlueprintCreateInput) {
    return prisma.kangqoreVisPageBlueprint.create({ data });
  }

  static update(id: string, data: BlueprintUpdateInput) {
    return prisma.kangqoreVisPageBlueprint.update({ where: { id }, data });
  }

  static remove(id: string) {
    return prisma.kangqoreVisPageBlueprint.delete({ where: { id } });
  }

  static upsertByUrl(url: string, data: BlueprintCreateInput) {
    return prisma.kangqoreVisPageBlueprint.upsert({
      where: { url },
      create: data,
      update: data,
    });
  }
}
