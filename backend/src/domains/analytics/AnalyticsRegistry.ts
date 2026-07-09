import { Metric, KPI, Insight, AnalyticsReport } from './contracts/types';

export class AnalyticsRegistry {
  private static instance: AnalyticsRegistry;

  private metrics: Map<string, Metric> = new Map();
  private kpis: Map<string, KPI> = new Map();
  private insights: Map<string, Insight> = new Map();

  private constructor() {}

  public static getInstance(): AnalyticsRegistry {
    if (!AnalyticsRegistry.instance) {
      AnalyticsRegistry.instance = new AnalyticsRegistry();
    }
    return AnalyticsRegistry.instance;
  }

  // --- Metrics ---
  public setMetric(metric: Metric): void {
    this.metrics.set(metric.metricId, metric);
  }

  public getMetric(metricId: string): Metric | undefined {
    return this.metrics.get(metricId);
  }

  public getAllMetrics(): Metric[] {
    return Array.from(this.metrics.values());
  }

  public getMetricsByDomain(domainId: string): Metric[] {
    return this.getAllMetrics().filter(m => m.domainId === domainId);
  }

  // --- KPIs ---
  public setKpi(kpi: KPI): void {
    this.kpis.set(kpi.kpiId, kpi);
  }

  public getKpi(kpiId: string): KPI | undefined {
    return this.kpis.get(kpiId);
  }

  public getAllKpis(): KPI[] {
    return Array.from(this.kpis.values());
  }

  public getKpisByDomain(domainId: string): KPI[] {
    return this.getAllKpis().filter(k => k.domainId === domainId);
  }

  // --- Insights ---
  public addInsight(insight: Insight): void {
    this.insights.set(insight.insightId, insight);
  }

  public getInsightsByDomain(domainId: string): Insight[] {
    return Array.from(this.insights.values()).filter(i => i.domainId === domainId);
  }

  public getAllInsights(): Insight[] {
    return Array.from(this.insights.values());
  }

  // --- Reporting ---
  public generateReport(domainId?: string): AnalyticsReport {
    const reportId = `REP_ANALYTICS_${Date.now()}`;
    if (domainId) {
      return {
        reportId,
        domainId,
        metrics: this.getMetricsByDomain(domainId),
        kpis: this.getKpisByDomain(domainId),
        insights: this.getInsightsByDomain(domainId),
        generatedAt: new Date()
      };
    }
    return {
      reportId,
      domainId: 'ENTERPRISE',
      metrics: this.getAllMetrics(),
      kpis: this.getAllKpis(),
      insights: this.getAllInsights(),
      generatedAt: new Date()
    };
  }
}
