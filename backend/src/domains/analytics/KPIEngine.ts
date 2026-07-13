import { AnalyticsRegistry } from './AnalyticsRegistry';
import { KPI, KpiStatus } from './contracts/types';

export class KPIEngine {
  private readonly registry = AnalyticsRegistry.getInstance();

  /**
   * Evaluates all known metrics against registered KPI targets.
   */
  public evaluateKpis(): void {
    console.log(`[KPIEngine] Evaluating Enterprise KPIs...`);
    
    // Evaluate Revenue KPI
    this.evaluateRevenueKpi();
    
    // Evaluate Churn KPI
    this.evaluateChurnKpi();
  }

  private evaluateRevenueKpi() {
    const revenueMetric = this.registry.getMetric('METRIC_REVENUE');
    const currentValue = revenueMetric ? revenueMetric.value : 0;
    const targetValue = 100000; // Hardcoded goal for the demo
    
    let status: KpiStatus = 'ON_TRACK';
    if (currentValue < targetValue * 0.8) status = 'OFF_TRACK';
    else if (currentValue < targetValue) status = 'AT_RISK';

    const kpi: KPI = {
      kpiId: 'KPI_REVENUE',
      metricId: 'METRIC_REVENUE',
      domainId: 'SALES_DOMAIN',
      name: 'Q3 Revenue Target',
      currentValue,
      targetValue,
      threshold: 0.1, // 10% threshold
      status,
      lastEvaluated: new Date()
    };
    
    this.registry.setKpi(kpi);
  }

  private evaluateChurnKpi() {
    const churnMetric = this.registry.getMetric('METRIC_CHURN_COUNT');
    const currentValue = churnMetric ? churnMetric.value : 0;
    const targetValue = 5; // Target max churns
    
    let status: KpiStatus = 'ON_TRACK';
    if (currentValue > targetValue * 1.5) status = 'OFF_TRACK';
    else if (currentValue > targetValue) status = 'AT_RISK';

    const kpi: KPI = {
      kpiId: 'KPI_CHURN',
      metricId: 'METRIC_CHURN_COUNT',
      domainId: 'CUSTOMER_DOMAIN',
      name: 'Maximum Churn Tolerance',
      currentValue,
      targetValue,
      threshold: 0,
      status,
      lastEvaluated: new Date()
    };
    
    this.registry.setKpi(kpi);
  }
}
