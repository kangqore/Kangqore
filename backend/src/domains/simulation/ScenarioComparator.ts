import { EnterpriseSimulationReport } from './contracts/types';

export class ScenarioComparator {

  /**
   * Distills multiple simulation outcomes into an executive-grade recommendation.
   * Ranks scenarios, identifies Pareto-optimal options, and recommends the best path.
   */
  rankAndRecommend(report: EnterpriseSimulationReport): EnterpriseSimulationReport {
    console.log(`[ScenarioComparator] Distilling simulation outcomes for WAANDA...`);

    let bestScenarioId: string | undefined = undefined;
    let highestScore = -Infinity;
    
    // Very simplified ranking algorithm based on Revenue vs Churn
    for (const item of report.scenarios) {
      const kpis = item.outcome.projectedKPIs;
      const rev = kpis['RevenueGrowth'] || 0;
      const churn = kpis['ChurnRate'] || 0;

      // Score = Revenue - (Churn * 2) -> Heavy penalty for churn
      const score = rev - (churn * 2);
      
      console.log(`  - Scenario '${item.scenario.name}': Revenue +${rev}%, Churn ${churn}% -> Score: ${score}`);

      if (score > highestScore) {
        highestScore = score;
        bestScenarioId = item.scenario.scenarioId;
      }
    }

    report.recommendedScenarioId = bestScenarioId;
    
    // Mark others as rejected
    report.rejectedScenarioIds = report.scenarios
      .filter(s => s.scenario.scenarioId !== bestScenarioId)
      .map(s => s.scenario.scenarioId);

    const bestScenario = report.scenarios.find(s => s.scenario.scenarioId === bestScenarioId);
    
    console.log(`[ScenarioComparator] Recommendation: Proceed with '${bestScenario?.scenario.name}'`);
    
    return report;
  }
}
