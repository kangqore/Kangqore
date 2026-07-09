import { OptimizationProblem, OptimizationExecution, ScoredBranch, Recommendation, OptimizationPolicyLayer } from './contracts/types';
import { SearchEngine } from './SearchEngine';
import { BranchEvaluator } from './BranchEvaluator';
import { ParetoEngine } from './ParetoEngine';
import { RecommendationEngine } from './RecommendationEngine';
import { OptimizationLedger } from './OptimizationLedger';
import { EnterpriseSimulationEngine } from '../../domains/simulation/EnterpriseSimulationEngine';

export class EnterpriseOptimizer {
  private searchEngine = new SearchEngine();
  private branchEvaluator = new BranchEvaluator();
  private paretoEngine = new ParetoEngine();
  private recommendationEngine = new RecommendationEngine();
  private ledger = OptimizationLedger.getInstance();

  public async optimize(
    problem: OptimizationProblem,
    execution: OptimizationExecution,
    policies: OptimizationPolicyLayer
  ): Promise<{ runId: string, recommendation: Recommendation, frontier: ScoredBranch[] }> {
    console.log(`\n======================================================`);
    console.log(`[EnterpriseOptimizer] Starting Optimization Run`);
    console.log(`======================================================`);
    console.log(`- Problem: ${problem.problemId}`);
    console.log(`- Environment: ${problem.environment}`);
    console.log(`- Algorithm: ${execution.algorithm}`);

    // 1. Check Policies (e.g. Max Search Space)
    const expectedSpace = problem.variables.reduce((acc, v) => {
      if (v.allowedValues) return acc * v.allowedValues.length;
      if (v.type === 'BOOLEAN') return acc * 2;
      return acc * 3; // rough mock for bounded continuous
    }, 1);

    if (expectedSpace > policies.maxSearchSpace) {
      throw new Error(`Policy Violation: Search space (${expectedSpace}) exceeds max (${policies.maxSearchSpace})`);
    }

    // 2. Generate Candidate Strategies
    const candidates = this.searchEngine.generateCandidates(problem.variables, execution);
    console.log(`[EnterpriseOptimizer] Generated ${candidates.length} Candidate Strategies.`);

    // 3. Simulate and Evaluate
    const simulationEngine = new EnterpriseSimulationEngine();
    const scoredBranches: ScoredBranch[] = [];

    for (const candidate of candidates) {
      // Create a mock proposal for the ESF based on candidate variables
      const proposal = {
        proposalId: candidate.strategyId,
        title: `Strategy ${candidate.strategyId}`,
        description: 'Auto-generated strategy',
        strategicObjective: 'Optimization',
        proposedAction: JSON.stringify(candidate.variables),
        contextVersion: 'v1'
      };

      const mitigation = candidate.variables['VAR_MITIGATION'] === true ? ['GRANDFATHERING'] : [];
      
      const report = {
        proposalId: proposal.proposalId,
        consensusScore: 0.8,
        opinions: [{ requiredMitigations: mitigation, assumptions: [] }],
        generatedAt: new Date()
      };

      console.log(`[EnterpriseOptimizer] Simulating Candidate: ${candidate.strategyId}`);
      // In reality ESF returns a branch, here we're adapting the earlier ESF to return outcome 
      // and we mock grabbing the branch. For architecture purity we pretend we get the branch.
      await simulationEngine.simulate(proposal, report as any);

      // Mock evaluating the branch outcome
      const mockBranch: any = {
        branchId: `BR_${candidate.strategyId}`,
        twinNetworks: new Map([
          ['TWIN_FINANCE', { getState: () => ({ monthlyRecurringRevenue: candidate.variables['VAR_PRICE_INCREASE'] === 0.20 ? 1200000 : 1050000, cashReserves: 2000000 }) }],
          ['TWIN_CUSTOMER', { getState: () => ({ customerTrustIndex: candidate.variables['VAR_MITIGATION'] ? 85 : 60 }) }]
        ])
      };

      const scored = this.branchEvaluator.evaluate(candidate, mockBranch, problem);
      scoredBranches.push(scored);
    }

    // 4. Calculate Pareto Frontier
    const frontier = this.paretoEngine.calculateFrontier(scoredBranches);

    // 5. Generate Recommendation
    const recommendation = this.recommendationEngine.generateRecommendation(frontier, problem);

    // 6. Record to Ledger
    const runId = this.ledger.recordRun(problem, candidates, frontier, recommendation);

    console.log(`[EnterpriseOptimizer] Run Complete. Selected Strategy: ${recommendation.strategy.strategyId}\n`);
    
    return { runId, recommendation, frontier };
  }
}
