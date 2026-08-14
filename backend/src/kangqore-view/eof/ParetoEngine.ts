import { ScoredBranch } from './contracts/types';

export class ParetoEngine {
  public calculateFrontier(scoredBranches: ScoredBranch[]): ScoredBranch[] {
    console.log(`[ParetoEngine] Calculating Pareto Frontier from ${scoredBranches.length} evaluated branches...`);
    
    // Filter out branches that failed constraints
    const validBranches = scoredBranches.filter(b => b.constraintsPassed);

    if (validBranches.length === 0) {
      console.warn(`[ParetoEngine] All generated strategies failed constraints!`);
      return [];
    }

    const frontier: ScoredBranch[] = [];

    // Simple non-dominated sorting
    for (const current of validBranches) {
      let isDominated = false;

      for (const other of validBranches) {
        if (current === other) continue;

        let otherIsBetterOrEqualInAll = true;
        let otherIsStrictlyBetterInAtLeastOne = false;

        for (const objId of Object.keys(current.objectiveScores)) {
          const currentScore = current.objectiveScores[objId];
          const otherScore = other.objectiveScores[objId];

          if (otherScore < currentScore) {
            otherIsBetterOrEqualInAll = false;
            break;
          }
          if (otherScore > currentScore) {
            otherIsStrictlyBetterInAtLeastOne = true;
          }
        }

        if (otherIsBetterOrEqualInAll && otherIsStrictlyBetterInAtLeastOne) {
          isDominated = true;
          break;
        }
      }

      if (!isDominated) {
        frontier.push(current);
      }
    }

    console.log(`[ParetoEngine] Found ${frontier.length} Pareto optimal strategies.`);
    return frontier;
  }
}
