/**
 * The shape a connected adapter's `fetch()` must return in `AdapterResult.data`
 * for OutcomeSyncService to persist it as a KangqoreVisOutcome row. No adapter
 * implements this yet (all 7 are unconnected — no credentials configured) —
 * this documents the contract for whichever gets a real fetch() first.
 */
export interface OutcomeRecord {
  metric: string;
  value: number;
  measuredAt: Date;
  blueprintId?: string;
  raw?: unknown;
}
