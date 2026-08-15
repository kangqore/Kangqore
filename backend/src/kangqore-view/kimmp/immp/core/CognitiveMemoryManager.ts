import { MemoryProvider, CognitiveKnowledge, CognitiveLesson, CognitiveReasoningTrace } from './memory/MemoryProvider';
import { PostgresMemoryProvider } from './memory/PostgresMemoryProvider';

export class CognitiveMemoryManager {
  private static provider: MemoryProvider;

  static getProvider(): MemoryProvider {
    if (!this.provider) {
      // For Phase 2.5, we default to the PostgreSQL provider.
      // In the future, this could be resolved dynamically via DI or config
      // to return a Pinecone, Milvus, or pgvector implementation.
      this.provider = new PostgresMemoryProvider();
    }
    return this.provider;
  }

  // --- Facade Methods ---

  static async storeKnowledge(concept: string, description: string, source?: string): Promise<CognitiveKnowledge> {
    return this.getProvider().storeKnowledge({ concept, description, source });
  }

  static async storeLesson(context: string, insight: string, missionId?: string): Promise<CognitiveLesson> {
    return this.getProvider().storeLesson({ context, insight, missionId });
  }

  static async logReasoning(goal: string, steps: any[], conclusion: string, missionId?: string): Promise<CognitiveReasoningTrace> {
    return this.getProvider().storeReasoningTrace({ goal, steps, conclusion, missionId });
  }
}
