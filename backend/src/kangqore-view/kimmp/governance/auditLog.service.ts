// ---------------------------------------------------------------------------
// KIMMP Phase 4 — Governance Audit Log
//
// Immutable record of every governance action taken on KIMMP artefacts.
// `record()` is best-effort — it never throws so an audit write failure can
// never block the action it is recording.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';

export type AuditAction =
  | 'DECISION_APPROVED'
  | 'DECISION_DISMISSED'
  | 'DECISION_EXECUTED'
  | 'SIGNAL_DISMISSED'
  | 'ENGINE_RUN'
  | 'COST_RECORDED';

export type AuditTargetType = 'decision' | 'signal' | 'engine' | 'cost';

export interface AuditRecordInput {
  actor: string;
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export class KimmpAuditLog {
  /** Write an audit entry. Returns the new id, or null if the table is unavailable. */
  static async record(input: AuditRecordInput): Promise<string | null> {
    try {
      const row = await (prisma as any).kimmpAuditEntry.create({
        data: {
          id: crypto.randomUUID(),
          actor: input.actor,
          action: input.action,
          targetType: input.targetType,
          targetId: input.targetId ?? null,
          notes: input.notes ?? null,
          metadata: (input.metadata as any) ?? null,
        },
      });
      return row.id as string;
    } catch (err) {
      logger.warn('KIMMP audit entry not written: ' + (err as Error).message);
      return null;
    }
  }

  /** Query recent audit entries, newest-first. Returns null if unavailable. */
  static async query(opts: {
    action?: AuditAction;
    targetType?: AuditTargetType;
    targetId?: string;
    limit?: number;
  } = {}): Promise<unknown[] | null> {
    try {
      const where: Record<string, unknown> = {};
      if (opts.action) where.action = opts.action;
      if (opts.targetType) where.targetType = opts.targetType;
      if (opts.targetId) where.targetId = opts.targetId;
      return await (prisma as any).kimmpAuditEntry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(1, opts.limit ?? 100), 500),
      });
    } catch {
      return null;
    }
  }
}
