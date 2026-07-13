import { AnalyticsRegistry } from './AnalyticsRegistry';

export class MetricEngine {
  private readonly registry = AnalyticsRegistry.getInstance();

  /**
   * Processes raw events (simulated for now) and computes derived metrics.
   * In a real system, this would subscribe to KeosEventBus.
   */
  public processEvent(domainId: string, eventType: string, payload: any): void {
    console.log(`[MetricEngine] Ingesting Event: [${domainId}] ${eventType}`);

    if (domainId === 'SALES_DOMAIN' && eventType === 'DEAL_WON') {
      this.incrementMetric('SALES_DOMAIN', 'METRIC_REVENUE', 'Total Revenue', payload.amount, 'USD');
    }

    if (domainId === 'CUSTOMER_DOMAIN' && eventType === 'CUSTOMER_CHURNED') {
      this.incrementMetric('CUSTOMER_DOMAIN', 'METRIC_CHURN_COUNT', 'Total Churned Customers', 1, 'Count');
    }

    if (domainId === 'CUSTOMER_DOMAIN' && eventType === 'SUPPORT_ESCALATED') {
      this.incrementMetric('CUSTOMER_DOMAIN', 'METRIC_OPEN_ESCALATIONS', 'Open Support Escalations', 1, 'Count');
    }
  }

  private incrementMetric(domainId: string, metricId: string, name: string, amount: number, unit: string) {
    const existing = this.registry.getMetric(metricId);
    if (existing) {
      existing.value += amount;
      existing.timestamp = new Date();
      this.registry.setMetric(existing);
    } else {
      this.registry.setMetric({
        metricId,
        domainId,
        name,
        value: amount,
        unit,
        timestamp: new Date()
      });
    }
  }
}
