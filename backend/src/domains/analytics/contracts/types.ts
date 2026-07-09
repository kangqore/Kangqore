export interface Metric {
  metricId: string;
  domainId: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export type KpiStatus = 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';

export interface KPI {
  kpiId: string;
  metricId: string;
  domainId: string;
  name: string;
  currentValue: number;
  targetValue: number;
  threshold: number; // e.g., deviation allowed before status changes
  status: KpiStatus;
  lastEvaluated: Date;
}

export interface InsightProvenance {
  observation: string;
  metricId: string;
  kpiId: string;
  evidence: string[]; // e.g. "Support tickets +35%"
}

export interface Insight {
  insightId: string;
  domainId: string;
  title: string;
  provenance: InsightProvenance;
  confidence: number; // 0 to 1
  recommendation: string;
  generatedAt: Date;
}

export interface AnalyticsReport {
  reportId: string;
  domainId: string; // Or 'ENTERPRISE' for an aggregate report
  metrics: Metric[];
  kpis: KPI[];
  insights: Insight[];
  generatedAt: Date;
}
