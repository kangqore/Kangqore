import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class LocaleTargetService {
  static list(filter?: { blueprintId?: string; locale?: string }) {
    return prisma.kangqoreVisLocaleTarget.findMany({
      where: { blueprintId: filter?.blueprintId, locale: filter?.locale },
      orderBy: { locale: 'asc' },
    });
  }

  static create(data: Prisma.KangqoreVisLocaleTargetUncheckedCreateInput) {
    return prisma.kangqoreVisLocaleTarget.create({ data });
  }

  static update(id: string, data: Prisma.KangqoreVisLocaleTargetUncheckedUpdateInput) {
    return prisma.kangqoreVisLocaleTarget.update({ where: { id }, data });
  }

  static remove(id: string) {
    return prisma.kangqoreVisLocaleTarget.delete({ where: { id } });
  }
}
