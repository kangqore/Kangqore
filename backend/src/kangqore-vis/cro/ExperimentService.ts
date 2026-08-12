import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class ExperimentService {
  static list(filter?: { status?: string; blueprintId?: string }) {
    return prisma.kangqoreVisExperiment.findMany({
      where: { status: filter?.status, blueprintId: filter?.blueprintId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static create(data: Prisma.KangqoreVisExperimentUncheckedCreateInput) {
    return prisma.kangqoreVisExperiment.create({ data: { ...data, status: data.status ?? 'DRAFT' } });
  }

  static update(id: string, data: Prisma.KangqoreVisExperimentUncheckedUpdateInput) {
    return prisma.kangqoreVisExperiment.update({ where: { id }, data });
  }

  static conclude(id: string, winner: string) {
    return prisma.kangqoreVisExperiment.update({
      where: { id },
      data: { status: winner ? 'WON' : 'LOST', winner, endedAt: new Date() },
    });
  }
}
