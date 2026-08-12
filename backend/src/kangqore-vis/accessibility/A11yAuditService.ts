import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class A11yAuditService {
  static list(filter?: { resolved?: boolean; url?: string }) {
    return prisma.kangqoreVisA11yIssue.findMany({
      where: { resolved: filter?.resolved, url: filter?.url },
      orderBy: { scannedAt: 'desc' },
    });
  }

  static record(data: Prisma.KangqoreVisA11yIssueUncheckedCreateInput) {
    return prisma.kangqoreVisA11yIssue.create({ data });
  }

  static resolve(id: string) {
    return prisma.kangqoreVisA11yIssue.update({ where: { id }, data: { resolved: true } });
  }
}
