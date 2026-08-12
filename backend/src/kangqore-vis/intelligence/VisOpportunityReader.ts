import { prisma } from '../../lib/prisma';

export class VisOpportunityReader {
  /** Scored cross-capability opportunities, highest priority first. */
  static list(status?: string) {
    return prisma.kangqoreVisOpportunity.findMany({
      where: status ? { status } : {},
      orderBy: [{ priorityScore: 'desc' }, { createdAt: 'desc' }],
      take: 200,
    });
  }

  /** Full record including the per-dimension scoring breakdown. */
  static getById(id: string) {
    return prisma.kangqoreVisOpportunity.findUnique({ where: { id } });
  }
}
