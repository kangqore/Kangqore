import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class PageTemplateService {
  static list() {
    return prisma.kangqoreVisPageTemplate.findMany({ orderBy: { name: 'asc' } });
  }

  static create(data: Prisma.KangqoreVisPageTemplateUncheckedCreateInput) {
    return prisma.kangqoreVisPageTemplate.create({ data });
  }

  static update(id: string, data: Prisma.KangqoreVisPageTemplateUncheckedUpdateInput) {
    return prisma.kangqoreVisPageTemplate.update({ where: { id }, data });
  }

  static recordGeneration(id: string, count: number) {
    return prisma.kangqoreVisPageTemplate.update({
      where: { id },
      data: { generatedCount: { increment: count }, lastGeneratedAt: new Date() },
    });
  }

  static remove(id: string) {
    return prisma.kangqoreVisPageTemplate.delete({ where: { id } });
  }
}
