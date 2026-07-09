import { OptimizationProblem, CandidateStrategy, ScoredBranch, Recommendation } from './contracts/types';

export class OptimizationLedger {
  private static instance: OptimizationLedger;
  private logs: any[] = [];

  private constructor() {}

  public static getInstance(): OptimizationLedger {
    if (!OptimizationLedger.instance) {
      OptimizationLedger.instance = new OptimizationLedger();
    }
    return OptimizationLedger.instance;
  }

  public recordRun(
    problem: OptimizationProblem,
    strategiesGenerated: CandidateStrategy[],
    frontier: ScoredBranch[],
    recommendation: Recommendation
  ): string {
    const runId = `OPT_RUN_${Date.now()}`;
    
    const entry = {
      runId,
      timestamp: new Date(),
      problemId: problem.problemId,
      objectives: problem.objectives.map(o => o.objectiveId),
      variables: problem.variables.map(v => v.id),
      environment: problem.environment,
      searchSpaceSize: strategiesGenerated.length,
      paretoFrontierSize: frontier.length,
      recommendationStrategyId: recommendation.strategy.strategyId,
      expectedOutcome: recommendation.expectedBusinessImpact,
      // Future hook: When the plan is executed, actual outcomes will be linked back to this runId
      actualOutcome: null 
    };

    this.logs.push(entry);
    console.log(`[OptimizationLedger] Recorded Optimization Run: ${runId}`);
    return runId;
  }
}
