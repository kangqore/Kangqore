import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class PriorityRegistryService {
  static list(filter?: { active?: boolean }) {
    return prisma.kangqoreVisPriorityRegistry.findMany({
      where: { active: filter?.active },
      orderBy: { priorityWeight: 'desc' },
    });
  }

  static create(data: Prisma.KangqoreVisPriorityRegistryUncheckedCreateInput) {
    return prisma.kangqoreVisPriorityRegistry.create({ data });
  }

  static update(id: string, data: Prisma.KangqoreVisPriorityRegistryUncheckedUpdateInput) {
    return prisma.kangqoreVisPriorityRegistry.update({ where: { id }, data });
  }

  static remove(id: string) {
    return prisma.kangqoreVisPriorityRegistry.delete({ where: { id } });
  }

  /** Active rows only — what the scoring engine actually reads. */
  static listActive() {
    return prisma.kangqoreVisPriorityRegistry.findMany({ where: { active: true } });
  }
}
