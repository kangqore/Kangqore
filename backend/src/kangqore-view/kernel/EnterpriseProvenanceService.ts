import { MissionRepository } from './MissionRepository';
import { EnterpriseMemoryManager } from './EnterpriseMemoryManager';

export class EnterpriseProvenanceService {
  /**
   * Retrieves the full provenance trace for a given mission.
   * Answers the question: "Why did we do this?"
   */
  static async getMissionTrace(missionId: string) {
    const mission = await MissionRepository.getMission(missionId);
    if (!mission) throw new Error(`Mission ${missionId} not found`);

    const memoryRecords = await EnterpriseMemoryManager.recallMissionMemory(missionId);

    // If there is a parent mission, fetch that too for context
    let parentMission = null;
    if (mission.parentMissionId) {
      parentMission = await MissionRepository.getMission(mission.parentMissionId);
    }

    return {
      mission: {
        id: mission.id,
        goal: mission.goal,
        requester: mission.requester,
        context: mission.missionContext,
        outcome: mission.result,
        status: mission.currentState
      },
      parentMission: parentMission ? {
        id: parentMission.id,
        goal: parentMission.goal
      } : null,
      decisions: memoryRecords.map(record => ({
        actor: record.actor,
        capability: record.capability,
        evidence: record.evidence,
        reasoning: record.reasoning,
        policy: record.policy,
        outcome: record.outcome,
        timestamp: record.timestamp
      }))
    };
  }
}
