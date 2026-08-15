import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export type DecisionRecordCreateInput = Prisma.KoreDecisionRecordCreateInput;

export class DecisionRepository {
  static async recordDecision(data: DecisionRecordCreateInput) {
    return prisma.koreDecisionRecord.create({
      data,
    });
  }

  static async getDecision(id: string) {
    return prisma.koreDecisionRecord.findUnique({
      where: { id },
    });
  }

  static async listDecisionsForMission(missionId: string) {
    return prisma.koreDecisionRecord.findMany({
      where: { missionId },
      orderBy: { timestamp: 'asc' }
    });
  }

  static async listRecentDecisions(limit: number = 50) {
    return prisma.koreDecisionRecord.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }
}
