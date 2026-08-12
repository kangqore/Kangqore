import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

export class LocalListingService {
  static list(filter?: { city?: string; country?: string }) {
    return prisma.kangqoreVisLocalListing.findMany({
      where: { city: filter?.city, country: filter?.country },
      orderBy: { businessName: 'asc' },
    });
  }

  static create(data: Prisma.KangqoreVisLocalListingUncheckedCreateInput) {
    return prisma.kangqoreVisLocalListing.create({ data });
  }

  static update(id: string, data: Prisma.KangqoreVisLocalListingUncheckedUpdateInput) {
    return prisma.kangqoreVisLocalListing.update({ where: { id }, data });
  }

  static verify(id: string) {
    return prisma.kangqoreVisLocalListing.update({
      where: { id },
      data: { napConsistent: true, lastVerifiedAt: new Date() },
    });
  }

  static remove(id: string) {
    return prisma.kangqoreVisLocalListing.delete({ where: { id } });
  }
}
