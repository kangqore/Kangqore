import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class UxFindingService {
  static list(filter?: { resolved?: boolean; blueprintId?: string }) {
    return prisma.kangqoreVisUxFinding.findMany({
      where: { resolved: filter?.resolved, blueprintId: filter?.blueprintId },
      orderBy: { foundAt: 'desc' },
    });
  }

  static create(data: Prisma.KangqoreVisUxFindingUncheckedCreateInput) {
    return prisma.kangqoreVisUxFinding.create({ data });
  }

  static resolve(id: string) {
    return prisma.kangqoreVisUxFinding.update({ where: { id }, data: { resolved: true } });
  }
}
