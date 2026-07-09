import { AnalyticsRegistry } from './AnalyticsRegistry';
import { Insight } from './contracts/types';

export class InsightEngine {
  private registry = AnalyticsRegistry.getInstance();

  /**
   * Scans KPIs and metrics to generate explainable, provenanced insights.
   */
  public generateInsights(): void {
    console.log(`[InsightEngine] Synthesizing executive insights...`);
    
    const kpis = this.registry.getAllKpis();
    
    for (const kpi of kpis) {
      if (kpi.status === 'AT_RISK' || kpi.status === 'OFF_TRACK') {
        this.generateDeviationInsight(kpi.kpiId);
      }
    }
  }

  private generateDeviationInsight(kpiId: string) {
    const kpi = this.registry.getKpi(kpiId);
    if (!kpi) return;

    if (kpiId === 'KPI_CHURN') {
      const escalations = this.registry.getMetric('METRIC_OPEN_ESCALATIONS')?.value || 0;
      
      const insight: Insight = {
        insightId: `INSIGHT_CHURN_${Date.now()}`,
        domainId: kpi.domainId,
        title: `Customer Churn is ${kpi.status.replace('_', ' ')}`,
        provenance: {
          observation: 'Churn has exceeded the maximum tolerance threshold.',
          metricId: kpi.metricId,
          kpiId: kpi.kpiId,
          evidence: [
            `Current churn count is ${kpi.currentValue}, exceeding target of ${kpi.targetValue}.`,
            `Support escalations are abnormally high (${escalations} open tickets).`
          ]
        },
        confidence: 0.93,
        recommendation: 'Investigate the correlation between recent support escalations and churned accounts immediately.',
        generatedAt: new Date()
      };
      
      this.registry.addInsight(insight);
      console.log(`[InsightEngine] Published Insight: ${insight.title}`);
    }
  }
}
