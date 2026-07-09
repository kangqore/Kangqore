import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export type CapabilityCreateInput = Prisma.KoreCapabilityCreateInput;
export type CapabilityProviderCreateInput = Prisma.KoreCapabilityProviderCreateInput;

export class CapabilityRegistry {
  static async registerCapability(data: CapabilityCreateInput) {
    return prisma.koreCapability.create({
      data,
    });
  }

  static async getCapabilityByName(name: string) {
    return prisma.koreCapability.findUnique({
      where: { name },
      include: {
        providers: {
          orderBy: { priority: 'asc' },
        },
      },
    });
  }

  static async registerProvider(data: CapabilityProviderCreateInput) {
    return prisma.koreCapabilityProvider.create({
      data,
    });
  }

  static async listCapabilities() {
    return prisma.koreCapability.findMany({
      include: {
        providers: {
          orderBy: { priority: 'asc' },
        },
      },
    });
  }
}
