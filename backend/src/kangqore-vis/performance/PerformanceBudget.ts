export const CWV_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

export type CwvMetric = keyof typeof CWV_THRESHOLDS;

export function rateMetric(metric: CwvMetric, value: number): 'good' | 'needs-improvement' | 'poor' {
  const t = CWV_THRESHOLDS[metric];
  if (value <= t.good) return 'good';
  if (value <= t.poor) return 'needs-improvement';
  return 'poor';
}
