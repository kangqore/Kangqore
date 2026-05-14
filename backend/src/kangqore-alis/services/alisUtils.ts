// ---------------------------------------------------------------------------
// Kangqore ALIS — Shared Time Range Utilities
// ---------------------------------------------------------------------------

export type TimeRange =
  | '30m'
  | '1h'
  | '6h'
  | '12h'
  | 'today'
  | '7d'
  | '30d'
  | '90d'
  | 'all';

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '30m': 'Last 30 minutes',
  '1h': 'Last hour',
  '6h': 'Last 6 hours',
  '12h': 'Last 12 hours',
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  all: 'All time',
};

const VALID_RANGES = Object.keys(TIME_RANGE_LABELS) as TimeRange[];

export function isValidRange(value: string): value is TimeRange {
  return VALID_RANGES.includes(value as TimeRange);
}

export function getDateFilter(range: TimeRange): Date | null {
  if (range === 'all') return null;

  const now = new Date();

  switch (range) {
    case '30m':
      return new Date(now.getTime() - 30 * 60 * 1000);
    case '1h':
      return new Date(now.getTime() - 60 * 60 * 1000);
    case '6h':
      return new Date(now.getTime() - 6 * 60 * 60 * 1000);
    case '12h':
      return new Date(now.getTime() - 12 * 60 * 60 * 1000);
    case 'today': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

export function whereCreatedAt(range: TimeRange) {
  const since = getDateFilter(range);
  return since ? { createdAt: { gte: since } } : {};
}
