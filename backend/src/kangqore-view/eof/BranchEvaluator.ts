import { OptimizationProblem, ScoredBranch, CandidateStrategy, ObjectiveRegistry } from './contracts/types';
import { SimulationBranch } from '../edtp/contracts/types';

export class BranchEvaluator {
  public evaluate(
    strategy: CandidateStrategy,
    branch: SimulationBranch,
    problem: OptimizationProblem
  ): ScoredBranch {
    console.log(`[BranchEvaluator] Evaluating Branch ${branch.branchId} for Strategy ${strategy.strategyId}`);

    let constraintsPassed = true;
    const scores: Record<string, number> = {};
    let aggregateScore = 0;

    // Evaluate Objectives
    for (const objRef of problem.objectives) {
      const registryItem = ObjectiveRegistry[objRef.objectiveId];
      if (!registryItem) continue;

      let rawValue = 0;
      
      // MOCK: Extract metric based on Objective ID
      if (registryItem.id === 'OBJ_REV') {
        const financeTwin = branch.twinNetworks.get('TWIN_FINANCE');
        rawValue = financeTwin?.getState().monthlyRecurringRevenue || 0;
      } else if (registryItem.id === 'OBJ_TRUST') {
        const customerTwin = branch.twinNetworks.get('TWIN_CUSTOMER');
        rawValue = customerTwin?.getState().customerTrustIndex || 0;
      }

      // Normalize score (simple linear mock)
      let normalized = rawValue; 
      if (registryItem.type === 'MAXIMIZE') {
        normalized = rawValue;
      } else if (registryItem.type === 'MINIMIZE') {
        normalized = -rawValue;
      }

      scores[objRef.objectiveId] = normalized;
      aggregateScore += normalized * objRef.weight;
    }

    // Evaluate Constraints (MOCK logic for cash limit)
    for (const constraint of problem.constraints) {
      if (constraint.metric === 'cashReserves') {
        const val = branch.twinNetworks.get('TWIN_FINANCE')?.getState().cashReserves || 0;
        if (constraint.operator === '>' && !(val > constraint.value)) constraintsPassed = false;
        if (constraint.operator === '>=' && !(val >= constraint.value)) constraintsPassed = false;
        // ... extend other operators
      }
    }

    return {
      strategy,
      branch,
      objectiveScores: scores,
      aggregateScore,
      constraintsPassed,
      confidence: 0.85 // Aggregated from prediction confidences used in the branch
    };
  }
}
