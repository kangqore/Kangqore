import { 
  ExecutiveDecision, 
  SituationReport, 
  OpportunityAssessment, 
  ThreatAssessment,
  Goal
} from '../contracts/types';
import { ExecutiveContextPackage } from '../../memory/types';

export interface ISituationAssessmentEngine {
  assess(context: ExecutiveContextPackage): SituationReport;
}

export interface IOpportunityEngine {
  analyze(situation: SituationReport): OpportunityAssessment[];
}

export interface IThreatEngine {
  analyze(situation: SituationReport): ThreatAssessment[];
}

export interface IObjectiveManager {
  getObjectives(): Goal[];
  prioritizeObjectives(objectives: Goal[]): Goal[];
}

export interface IGoalEngine {
  align(opportunities: OpportunityAssessment[], threats: ThreatAssessment[], objectives: Goal[]): number; // returns alignment score
}

export interface IReasoningEngine {
  synthesize(
    situation: SituationReport,
    opportunities: OpportunityAssessment[],
    threats: ThreatAssessment[],
    alignmentScore: number
  ): string; // returns synthesized context/reasoning
}

export interface ISimulationEngine {
  simulate(reasoning: string): string; // returns simulated outcomes
}

export interface IDecisionEngine {
  decide(simulation: string): ExecutiveDecision;
}

export interface IDecisionReviewEngine {
  review(decision: ExecutiveDecision): boolean; // validates against policies/confidence
}

export interface IReflectionEngine {
  reflect(decision: ExecutiveDecision, actualOutcome: string): string; // "What happened?"
}

export interface ILearningEngine {
  learn(reflection: string): string; // "What should change next time?"
}
