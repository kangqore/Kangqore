// ---------------------------------------------------------------------------
// KIMMP Phase 4 — Structured Tracer
//
// Emits structured, greppable trace events for the full KIMMP lifecycle:
// signal written → decision proposed → decision approved/dismissed →
// (Phase 3 remainder) decision executed.
//
// This is a lightweight in-process tracer (no OpenTelemetry dependency).
// Each event is a single JSON line written via the existing logger so it flows
// into whatever log aggregator is configured. The prefix [KIMMP:TRACE] makes
// it trivially filterable in Datadog, CloudWatch, or any grep-based search.
//
// Upgrade path: when the team adds @opentelemetry/sdk-node, replace the
// logger.info calls with span.addEvent() and the trace data shape stays the
// same.
// ---------------------------------------------------------------------------

import logger from '../../utils/logger';

export type TraceEvent =
  | 'SIGNAL_RECEIVED'
  | 'DECISION_PROPOSED'
  | 'DECISION_APPROVED'
  | 'DECISION_DISMISSED'
  | 'DECISION_EXECUTED'
  | 'ENGINE_RUN'
  | 'COST_RECORDED';

export interface TraceContext {
  signalId?: string;
  decisionId?: string;
  actor?: string;
  targetModule?: string;
  decisionType?: string;
  priority?: number;
  confidence?: number;
  leadId?: string;
  conversationId?: string;
  [key: string]: unknown;
}

export class KimmpTracer {
  static emit(event: TraceEvent, ctx: TraceContext = {}): void {
    logger.info(
      `[KIMMP:TRACE] event=${event} ` +
        Object.entries(ctx)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
          .join(' ')
    );
  }

  static signalReceived(signalId: string, ctx: Omit<TraceContext, 'signalId'>): void {
    KimmpTracer.emit('SIGNAL_RECEIVED', { signalId, ...ctx });
  }

  static decisionProposed(decisionId: string, ctx: Omit<TraceContext, 'decisionId'>): void {
    KimmpTracer.emit('DECISION_PROPOSED', { decisionId, ...ctx });
  }

  static decisionApproved(decisionId: string, actor: string, ctx: Omit<TraceContext, 'decisionId' | 'actor'>): void {
    KimmpTracer.emit('DECISION_APPROVED', { decisionId, actor, ...ctx });
  }

  static decisionDismissed(decisionId: string, actor: string, ctx: Omit<TraceContext, 'decisionId' | 'actor'>): void {
    KimmpTracer.emit('DECISION_DISMISSED', { decisionId, actor, ...ctx });
  }

  static engineRun(result: { signalsEvaluated: number; decisionsProposed: number; noActionNeeded: number }): void {
    KimmpTracer.emit('ENGINE_RUN', result);
  }
}
