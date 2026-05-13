import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class EntityService {
  static list() {
    return prisma.kangqoreVisEntity.findMany({
      include: { fromRels: { include: { to: true } } },
      orderBy: { name: 'asc' },
    });
  }

  static getBySlug(slug: string) {
    return prisma.kangqoreVisEntity.findUnique({
      where: { slug },
      include: { fromRels: { include: { to: true } }, toRels: { include: { from: true } } },
    });
  }

  static create(data: Prisma.KangqoreVisEntityUncheckedCreateInput) {
    return prisma.kangqoreVisEntity.create({ data });
  }

  static upsertBySlug(slug: string, data: Prisma.KangqoreVisEntityUncheckedCreateInput) {
    return prisma.kangqoreVisEntity.upsert({ where: { slug }, create: data, update: data });
  }

  static linkEntities(fromSlug: string, toSlug: string, kind: string, weight = 1.0) {
    return prisma.$transaction(async (tx) => {
      const from = await tx.kangqoreVisEntity.findUnique({ where: { slug: fromSlug } });
      const to = await tx.kangqoreVisEntity.findUnique({ where: { slug: toSlug } });
      if (!from || !to) throw new Error('Entity not found');
      return tx.kangqoreVisEntityRelation.upsert({
        where: { fromId_toId_kind: { fromId: from.id, toId: to.id, kind } },
        create: { fromId: from.id, toId: to.id, kind, weight },
        update: { weight },
      });
    });
  }
}
