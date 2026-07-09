import { CognitiveMemoryManager } from '../../immp/core/CognitiveMemoryManager';
import { DecisionRepository } from '../kernel/DecisionRepository';
// Assuming KORE Object Registry exists at this path, stub if not
import { ObjectRegistry } from '../kore/language/ObjectRegistry'; 

export class EnterpriseKnowledgeService {
  /**
   * Universal Interface for AI Agents (WAANDA/KIMMP/URGI) to query the enterprise reality.
   */

  // --- KORE Ontology (Structural Reality) ---
  static async queryOntology(objectName?: string): Promise<any> {
    if (objectName) {
      return ObjectRegistry.getObjectDefinition(objectName);
    } else {
      return ObjectRegistry.listObjects();
    }
  }

  // --- KEOS Operational Memory (What Happened) ---
  static async queryOperationalHistory(missionId?: string): Promise<any> {
    if (missionId) {
      return DecisionRepository.listDecisionsForMission(missionId);
    } else {
      return DecisionRepository.listRecentDecisions(50); // Get last 50 decisions
    }
  }

  // --- KIMMP Cognitive Memory (What It Means) ---
  static async queryStrategicLessons(context: string): Promise<any> {
    return CognitiveMemoryManager.getProvider().getLessonsByContext(context);
  }

  static async queryEnterpriseKnowledge(concept: string): Promise<any> {
    return CognitiveMemoryManager.getProvider().findKnowledge(concept);
  }
}
