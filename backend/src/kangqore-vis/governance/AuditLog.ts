import { prisma } from '../../lib/prisma';

export class AuditLog {
  static recent(limit = 50) {
    return prisma.kangqoreVisAudit.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  static async resolve(id: string) {
    return prisma.kangqoreVisAudit.update({
      where: { id },
      data: { resolved: true, resolvedAt: new Date() },
    });
  }
}
