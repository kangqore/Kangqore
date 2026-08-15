import { DecisionRepository, DecisionRecordCreateInput } from './DecisionRepository';

export class EnterpriseMemoryManager {
  /**
   * Commits a decision record to Enterprise Memory.
   * This forms the persistent cognition and provenance layer of KEOS.
   */
  static async commitMemory(record: Omit<DecisionRecordCreateInput, 'timestamp'>) {
    // In the future, this can also emit to a Kafka stream or Vector DB
    return DecisionRepository.recordDecision(record);
  }

  static async recallMissionMemory(missionId: string) {
    return DecisionRepository.listDecisionsForMission(missionId);
  }

  static async getMemoryRecord(id: string) {
    return DecisionRepository.getDecision(id);
  }
}
