import { prisma } from '../../../../../lib/prisma';
import { 
  MemoryProvider, 
  CognitiveKnowledge, 
  CognitiveLesson, 
  CognitiveReasoningTrace 
} from './MemoryProvider';

export class PostgresMemoryProvider implements MemoryProvider {
  async storeKnowledge(knowledge: CognitiveKnowledge): Promise<CognitiveKnowledge> {
    const result = await prisma.kimmpCognitiveKnowledge.create({
      data: {
        concept: knowledge.concept,
        description: knowledge.description,
        confidence: knowledge.confidence ?? 1.0,
        source: knowledge.source
      }
    });
    return result as CognitiveKnowledge;
  }

  async findKnowledge(concept: string): Promise<CognitiveKnowledge | null> {
    const result = await prisma.kimmpCognitiveKnowledge.findFirst({
      where: { concept }
    });
    return result as CognitiveKnowledge | null;
  }

  async storeLesson(lesson: CognitiveLesson): Promise<CognitiveLesson> {
    const result = await prisma.kimmpCognitiveLesson.create({
      data: {
        context: lesson.context,
        insight: lesson.insight,
        impact: lesson.impact,
        missionId: lesson.missionId
      }
    });
    return result as CognitiveLesson;
  }

  async getLessonsByContext(context: string): Promise<CognitiveLesson[]> {
    const results = await prisma.kimmpCognitiveLesson.findMany({
      where: {
        context: { contains: context, mode: 'insensitive' }
      }
    });
    return results as CognitiveLesson[];
  }

  async storeReasoningTrace(trace: CognitiveReasoningTrace): Promise<CognitiveReasoningTrace> {
    const result = await prisma.kimmpCognitiveReasoningTrace.create({
      data: {
        goal: trace.goal,
        steps: trace.steps,
        conclusion: trace.conclusion,
        missionId: trace.missionId
      }
    });
    return result as CognitiveReasoningTrace;
  }

  async getReasoningTrace(missionId: string): Promise<CognitiveReasoningTrace | null> {
    const result = await prisma.kimmpCognitiveReasoningTrace.findFirst({
      where: { missionId }
    });
    return result as CognitiveReasoningTrace | null;
  }
}
