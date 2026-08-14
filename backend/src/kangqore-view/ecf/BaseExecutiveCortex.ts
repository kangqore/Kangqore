import { ExecutiveContextPackage } from '../memory/types';
import { ExecutiveDecision, EnterpriseProposal, ExecutiveOpinion } from './contracts/types';
import { 
  ISituationAssessmentEngine, 
  IOpportunityEngine, 
  IThreatEngine, 
  IObjectiveManager, 
  IGoalEngine, 
  IReasoningEngine, 
  ISimulationEngine, 
  IDecisionEngine, 
  IDecisionReviewEngine,
  IReflectionEngine,
  ILearningEngine
} from './engines/interfaces';

export const DecisionLedger: ExecutiveDecision[] = [];

export abstract class BaseExecutiveCortex {
  constructor(
    public readonly cortexId: string,
    public readonly scope: 'ENTERPRISE' | 'DOMAIN',
    public readonly domainId: string | null,
    protected situationEngine: ISituationAssessmentEngine,
    protected opportunityEngine: IOpportunityEngine,
    protected threatEngine: IThreatEngine,
    protected objectiveManager: IObjectiveManager,
    protected goalEngine: IGoalEngine,
    protected reasoningEngine: IReasoningEngine,
    protected simulationEngine: ISimulationEngine,
    protected decisionEngine: IDecisionEngine,
    protected reviewEngine: IDecisionReviewEngine,
    protected reflectionEngine: IReflectionEngine,
    protected learningEngine: ILearningEngine
  ) {}

  async processContext(context: ExecutiveContextPackage): Promise<ExecutiveDecision | null> {
    console.log(`\n=== [${this.cortexId}] EXECUTIVE CORTEX (${this.scope}) ===`);
    
    const situation = this.situationEngine.assess(context);
    const opportunities = this.opportunityEngine.analyze(situation);
    const threats = this.threatEngine.analyze(situation);
    
    const objectives = this.objectiveManager.getObjectives();
    const alignment = this.goalEngine.align(opportunities, threats, objectives);
    
    const reasoning = this.reasoningEngine.synthesize(situation, opportunities, threats, alignment);
    const simulation = this.simulationEngine.simulate(reasoning);
    const decision = this.decisionEngine.decide(simulation);
    
    const approved = this.reviewEngine.review(decision);
    
    if (approved) {
      DecisionLedger.push(decision);
      console.log(`[${this.cortexId}] Publication: Handoff to KIMMP (Strategy).`);
      return decision;
    } else {
      console.log(`[${this.cortexId}] Decision REJECTED. Knowledge Gap Report generated.`);
      return null;
    }
  }

  async processExecutionFeedback(decisionId: string, actualOutcome: string) {
    console.log(`\n=== [${this.cortexId}] EXECUTIVE FEEDBACK LOOP ===`);
    const decision = DecisionLedger.find(d => d.decisionId === decisionId);
    if (!decision) return;
    
    const reflection = this.reflectionEngine.reflect(decision, actualOutcome);
    this.learningEngine.learn(reflection);
  }

  async evaluateProposal(proposal: EnterpriseProposal): Promise<ExecutiveOpinion> {
    console.log(`[${this.cortexId}] Evaluating Proposal: ${proposal.title} -> ABSTAIN (No domain impact)`);
    return {
      domainId: this.domainId || 'UNKNOWN',
      executiveId: this.cortexId,
      stance: 'ABSTAIN',
      confidence: 1.0,
      domainRisk: 'LOW',
      impactAssessment: 'No direct impact on this domain.',
      supportingEvidence: [],
      assumptions: [],
      recommendedAlternatives: [],
      requiredMitigations: [],
      escalationLevel: 'NONE'
    };
  }
}
