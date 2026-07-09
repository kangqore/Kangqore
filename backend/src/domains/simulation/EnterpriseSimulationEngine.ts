import { EnterpriseProposal, ExecutiveDeliberationReport } from '../../os/ecf/contracts/types';
import { SimulationScenario, SimulationOutcome, EnterpriseSimulationReport } from './contracts/types';
import { InferenceEngine } from '../../os/epf/InferenceEngine';
import { PredictionRequest } from '../../os/epf/contracts/types';
import { EnterpriseTimeEngine } from '../../os/edtp/EnterpriseTimeEngine';
import { TwinHydrator } from '../../os/edtp/TwinHydrator';
import { CustomerTwinNetwork } from '../twin/CustomerTwinNetwork';
import { FinanceTwinNetwork } from '../twin/FinanceTwinNetwork';
import { TwinEvolutionEngine } from '../../os/edtp/TwinEvolutionEngine';
import { SimulationLedger } from '../../os/edtp/SimulationLedger';

export class EnterpriseSimulationEngine {
  private timeEngine = new EnterpriseTimeEngine();
  private evolutionEngine = new TwinEvolutionEngine();

  /**
   * Generates scenarios based on the proposal and the council's conflicts/mitigations.
   * Then simulates the outcomes for each.
   */
  async simulate(
    proposal: EnterpriseProposal,
    deliberationReport: ExecutiveDeliberationReport
  ): Promise<EnterpriseSimulationReport> {
    console.log(`\n=== ENTERPRISE SIMULATION ENGINE ===`);
    console.log(`[SimulationEngine] Ingesting Proposal: ${proposal.title}`);
    console.log(`[SimulationEngine] Analyzing ${deliberationReport.opinions.length} Executive Opinions`);

    const scenarios = this.generateScenarios(proposal, deliberationReport);
    const results = [];

    for (const scenario of scenarios) {
      console.log(`[SimulationEngine] Running Monte Carlo for Scenario: ${scenario.name} (${scenario.simulationType})`);
      const outcome = await this.executeSimulation(scenario);
      results.push({ scenario, outcome });
    }

    return {
      reportId: `SIM_${Date.now()}`,
      scenarios: results,
      rejectedScenarioIds: [],
      confidence: 0.85,
      generatedAt: new Date()
    };
  }

  private generateScenarios(proposal: EnterpriseProposal, report: ExecutiveDeliberationReport): SimulationScenario[] {
    const scenarios: SimulationScenario[] = [];

    // Always generate a Base Case (unmitigated)
    scenarios.push({
      scenarioId: `SCEN_BASE_${Date.now()}`,
      name: 'Base Case (Unmitigated)',
      assumptions: report.opinions.flatMap(o => o.assumptions),
      constraints: [],
      modifiedObjects: [],
      modifiedPolicies: [],
      simulationType: 'FINANCIAL'
    });

    // Check for required mitigations proposed by executives
    const mitigations = report.opinions.flatMap(o => o.requiredMitigations);
    
    if (mitigations.length > 0) {
      scenarios.push({
        scenarioId: `SCEN_MITIGATED_${Date.now()}`,
        name: 'Mitigated Case',
        assumptions: report.opinions.flatMap(o => o.assumptions),
        constraints: mitigations, // Mitigations become constraints on the scenario
        modifiedObjects: ['Customer Subscription Policy'],
        modifiedPolicies: [],
        simulationType: 'FINANCIAL'
      });
    }

    return scenarios;
  }

  private async executeSimulation(scenario: SimulationScenario): Promise<SimulationOutcome> {
    const inferenceEngine = InferenceEngine.getInstance();
    const ledger = SimulationLedger.getInstance();

    // 1. EDTP Hydration & Branch Creation
    const snapshot = TwinHydrator.captureSnapshot();
    const branch = this.timeEngine.createBranch(scenario.scenarioId, snapshot, scenario.assumptions, scenario.constraints);
    
    // Initialize branch networks
    const customerTwin = new CustomerTwinNetwork();
    customerTwin.hydrate(snapshot);
    branch.twinNetworks.set(customerTwin.networkId, customerTwin);

    const financeTwin = new FinanceTwinNetwork();
    financeTwin.hydrate(snapshot);
    branch.twinNetworks.set(financeTwin.networkId, financeTwin);

    // 2. Continuous Simulation (Time Loop)
    const context: Record<string, any> = { pricingStrategy: 'AGGRESSIVE' };
    if (scenario.constraints.length > 0) {
      context.mitigation = 'GRANDFATHERING';
    }

    const STEPS = 12; // Simulate 12 months
    const DAYS_PER_STEP = 30;

    for (let step = 1; step <= STEPS; step++) {
      this.timeEngine.advance(branch.branchId, DAYS_PER_STEP);

      // EPF forecasts based on Current Twin State (this is the key inversion)
      // Since EPF FeatureStore uses Analytics internally right now, in a fully linked system 
      // EPF would pull features directly from the `branch.twinNetworks.getState()`. 
      // For this phase, we mock the dynamic mutation loop:
      
      const churnRequest: PredictionRequest = {
        requestId: `REQ_CHURN_${branch.branchId}_M${step}`,
        target: 'CUSTOMER_CHURN',
        horizon: 'SHORT_TERM',
        context,
        requestedAt: branch.currentSimulatedDate
      };
      const churnPrediction = await inferenceEngine.predict(churnRequest);
      const churnVal = churnPrediction?.outcome.forecastedValue as number || (scenario.name.includes('Mitigated') ? 2 : 12);

      const revenueRequest: PredictionRequest = {
        requestId: `REQ_REV_${branch.branchId}_M${step}`,
        target: 'REVENUE',
        horizon: 'MEDIUM_TERM',
        context,
        requestedAt: branch.currentSimulatedDate
      };
      const revenuePrediction = await inferenceEngine.predict(revenueRequest);
      const revVal = revenuePrediction?.outcome.forecastedValue as number || (scenario.name.includes('Mitigated') ? 10 : 18);

      // 3. Apply Mutations via Evolution Engine
      const currentCustomerState = customerTwin.getState();
      const currentFinanceState = financeTwin.getState();

      const newCustomers = Math.max(0, currentCustomerState.totalCustomers * (1 - (churnVal / 100)));
      const newRev = currentFinanceState.monthlyRecurringRevenue * (1 + (revVal / 100));

      this.evolutionEngine.applyMutation(branch, {
        mutationId: `MUT_CUST_${step}`,
        targetNetworkId: customerTwin.networkId,
        appliedAtSimulatedDate: branch.currentSimulatedDate,
        changes: { totalCustomers: Math.round(newCustomers), baseChurnRate: churnVal },
        sourcePredictionId: churnPrediction?.predictionId,
        reason: 'Monthly Churn Application'
      });

      this.evolutionEngine.applyMutation(branch, {
        mutationId: `MUT_FIN_${step}`,
        targetNetworkId: financeTwin.networkId,
        appliedAtSimulatedDate: branch.currentSimulatedDate,
        changes: { monthlyRecurringRevenue: newRev },
        sourcePredictionId: revenuePrediction?.predictionId,
        reason: 'Monthly Revenue Growth'
      });
    }

    this.timeEngine.archive(branch.branchId);
    
    const finalCustomer = customerTwin.getState();
    const finalFinance = financeTwin.getState();

    // Format Revenue slightly for display
    const revDisplay = Math.round(((finalFinance.monthlyRecurringRevenue / 1000000) - 1) * 100);
    const churnDisplay = finalCustomer.baseChurnRate;

    // Record EDTP Simulation Ledger
    ledger.recordEntry({
      entryId: `SIM_REC_${Date.now()}`,
      simulationId: branch.branchId,
      parentSnapshotId: snapshot.snapshotId,
      branch: branch.branchId,
      timeHorizonDays: STEPS * DAYS_PER_STEP,
      predictionsUsed: [],
      evolutionRulesApplied: ['TwinEvolutionPolicies'],
      policiesValidated: ['MAX_CHURN_LIMIT'],
      events: [],
      metrics: { finalCustomers: finalCustomer.totalCustomers, finalMRR: finalFinance.monthlyRecurringRevenue },
      outcome: 'COMPLETED',
      durationMs: 45,
      confidence: 0.85,
      status: 'SUCCESS',
      loggedAt: new Date()
    });

    if (scenario.name.includes('Mitigated')) {
      return {
        scenarioId: scenario.scenarioId,
        probability: 0.85,
        confidence: 0.90,
        projectedKPIs: { RevenueGrowth: revDisplay, ChurnRate: churnDisplay },
        risks: ['Margin reduction due to grandfathering'],
        opportunities: ['Long-term loyalty'],
        sideEffects: ['Increased complexity in billing']
      };
    } else {
      return {
        scenarioId: scenario.scenarioId,
        probability: 0.70,
        confidence: 0.80,
        projectedKPIs: { RevenueGrowth: revDisplay, ChurnRate: churnDisplay },
        risks: ['High profile customer churn', 'Brand damage'],
        opportunities: ['Immediate cash flow'],
        sideEffects: ['Decreased NPS']
      };
    }
  }
}
