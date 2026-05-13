import { prisma } from '../../lib/prisma';

export class HubSpokeService {
  static listHubs() {
    return prisma.kangqoreVisHub.findMany({ include: { spokes: true } });
  }

  static getHub(slug: string) {
    return prisma.kangqoreVisHub.findUnique({ where: { slug }, include: { spokes: true } });
  }

  static createHub(data: { slug: string; name: string; description?: string; category?: string; url?: string }) {
    return prisma.kangqoreVisHub.create({ data });
  }

  static createSpoke(data: { slug: string; name: string; description?: string; hubId: string; url?: string }) {
    return prisma.kangqoreVisSpoke.create({ data });
  }
}
