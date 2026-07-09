import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export type MissionCreateInput = Prisma.KoreMissionCreateInput;
export type MissionUpdateInput = Prisma.KoreMissionUpdateInput;

export class MissionRepository {
  static async createMission(data: MissionCreateInput) {
    return prisma.koreMission.create({
      data,
    });
  }

  static async updateMission(id: string, data: MissionUpdateInput) {
    return prisma.koreMission.update({
      where: { id },
      data,
    });
  }

  static async getMission(id: string) {
    return prisma.koreMission.findUnique({
      where: { id },
    });
  }

  static async listMissions(filter: Prisma.KoreMissionWhereInput = {}) {
    return prisma.koreMission.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
  }
}
