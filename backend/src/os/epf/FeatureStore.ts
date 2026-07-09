import { EnterpriseFeature, PredictionTarget } from './contracts/types';
import { AnalyticsRegistry } from '../../domains/analytics/AnalyticsRegistry';

export class FeatureStore {
  private static instance: FeatureStore;
  private featureCache: Map<string, EnterpriseFeature> = new Map();

  private constructor() {}

  public static getInstance(): FeatureStore {
    if (!FeatureStore.instance) {
      FeatureStore.instance = new FeatureStore();
    }
    return FeatureStore.instance;
  }

  // Hydrate features for a specific prediction target
  public async getFeaturesForTarget(target: PredictionTarget): Promise<EnterpriseFeature[]> {
    console.log(`[FeatureStore] Hydrating features for target: ${target}`);
    const features: EnterpriseFeature[] = [];
    const analytics = AnalyticsRegistry.getInstance();
    const now = new Date();

    if (target === 'CUSTOMER_CHURN') {
      // Pull Support Escalations
      const escalations = analytics.getKpi('KPI_CHURN');
      if (escalations) {
        features.push({
          featureId: 'FEAT_CHURN_COUNT',
          version: 'v1.0',
          name: 'Churn Count',
          source: 'ANALYTICS',
          datatype: 'NUMBER',
          value: escalations.currentValue,
          lineage: ['METRIC_CHURN_COUNT', 'KPI_CHURN'],
          freshness: now,
          qualityScore: 0.95,
          generatedAt: now
        });
      }
      
      const openEscalations = analytics.generateReport().metrics.find(m => m.metricId === 'METRIC_OPEN_ESCALATIONS');
      if (openEscalations) {
        features.push({
          featureId: 'FEAT_OPEN_ESCALATIONS',
          version: 'v1.0',
          name: 'Open Escalations',
          source: 'ANALYTICS',
          datatype: 'NUMBER',
          value: openEscalations.value,
          lineage: ['METRIC_OPEN_ESCALATIONS'],
          freshness: now,
          qualityScore: 0.9,
          generatedAt: now
        });
      }
    }

    if (target === 'REVENUE') {
      const revenue = analytics.getKpi('KPI_REVENUE');
      if (revenue) {
        features.push({
          featureId: 'FEAT_CURRENT_REVENUE',
          version: 'v1.0',
          name: 'Current Revenue',
          source: 'ANALYTICS',
          datatype: 'NUMBER',
          value: revenue.currentValue,
          lineage: ['METRIC_REVENUE', 'KPI_REVENUE'],
          freshness: now,
          qualityScore: 0.98,
          generatedAt: now
        });
      }
      
      // Mocking pipeline velocity from Enterprise Memory
      features.push({
        featureId: 'FEAT_PIPELINE_VELOCITY',
        version: 'v2.1',
        name: 'Pipeline Velocity',
        source: 'ENTERPRISE_MEMORY',
        datatype: 'NUMBER',
        value: 14, // 14 days average
        lineage: ['MEM_OPPORTUNITY_CLOSED'],
        freshness: now,
        qualityScore: 0.85,
        generatedAt: now
      });
    }

    return features;
  }
}
