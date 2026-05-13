import { prisma } from '../../lib/prisma';

export class DisavowList {
  static list() {
    return prisma.kangqoreVisBacklink.findMany({ where: { disavowed: true } });
  }

  static add(id: string) {
    return prisma.kangqoreVisBacklink.update({ where: { id }, data: { disavowed: true } });
  }

  static remove(id: string) {
    return prisma.kangqoreVisBacklink.update({ where: { id }, data: { disavowed: false } });
  }
}
