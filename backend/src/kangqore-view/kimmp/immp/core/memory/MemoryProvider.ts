export interface CognitiveKnowledge {
  id?: string;
  concept: string;
  description: string;
  confidence?: number;
  source?: string;
}

export interface CognitiveLesson {
  id?: string;
  context: string;
  insight: string;
  impact?: string;
  missionId?: string;
}

export interface CognitiveReasoningTrace {
  id?: string;
  goal: string;
  steps: any;
  conclusion: string;
  missionId?: string;
}

export interface MemoryProvider {
  // Knowledge
  storeKnowledge(knowledge: CognitiveKnowledge): Promise<CognitiveKnowledge>;
  findKnowledge(concept: string): Promise<CognitiveKnowledge | null>;
  
  // Lessons
  storeLesson(lesson: CognitiveLesson): Promise<CognitiveLesson>;
  getLessonsByContext(context: string): Promise<CognitiveLesson[]>;
  
  // Reasoning Traces
  storeReasoningTrace(trace: CognitiveReasoningTrace): Promise<CognitiveReasoningTrace>;
  getReasoningTrace(missionId: string): Promise<CognitiveReasoningTrace | null>;
}
