// ---------------------------------------------------------------------------
// KIMMP Signal Ledger (Phase 1)
//
// The one hub every Kangqore system writes signals to, and KIMMP reads from.
// This PR ships the ledger itself plus its first producer (the behavior shadow
// observer). The eQORE / Lead-Intelligence / ALIS / VIS producers and the
// Decision Engine that consumes the ledger are Phase 2+ (see KIMMP_ROADMAP.md).
//
// `record()` is best-effort: it never throws, so a signal-write failure can
// never break the producer that emitted it. `prisma as any` — the generated
// client may lack the kimmpSignal accessor on a fresh checkout.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { emitToAdmins } from '../../socket';
import { SignalIngestInput } from './signalSchema';

export interface SignalQueryFilters {
  sourceModule?: string;
  signalCategory?: string;
  severity?: string;
  status?: string;
  limit?: number;
}

export class SignalLedger {
  /** Write a signal. Returns the new id, or null if storage is unavailable. */
  static async record(input: SignalIngestInput): Promise<string | null> {
    try {
      const row = await (prisma as any).kimmpSignal.create({
        data: {
          sourceModule: input.sourceModule,
          signalType: input.signalType,
          signalCategory: input.signalCategory,
          signalValue: input.signalValue,
          confidence: input.confidence ?? 0,
          severity: input.severity ?? 'LOW',
          conversationId: input.conversationId ?? null,
          leadId: input.leadId ?? null,
          sessionId: input.sessionId ?? null,
          metadata: (input.metadata as any) ?? null,
        },
      });
      // Push to all connected admin dashboards (best-effort)
      try {
        const payload = {
          id: row.id,
          sourceModule: input.sourceModule,
          signalType: input.signalType,
          signalCategory: input.signalCategory,
          signalValue: input.signalValue,
          severity: input.severity ?? 'LOW',
          confidence: input.confidence ?? 0,
          createdAt: new Date().toISOString(),
        };
        emitToAdmins('kimmp:signal', payload);
        if (input.severity === 'CRITICAL' || input.severity === 'HIGH') {
          emitToAdmins('kimmp:critical', payload);
        }
      } catch {}

      return row.id as string;
    } catch (error) {
      logger.warn(
        'KIMMP signal not recorded (apply the migration or check the DB): ' +
          (error as Error).message
      );
      return null;
    }
  }

  /** Query signals, most-recent-first. Returns null if storage is unavailable. */
  static async query(filters: SignalQueryFilters = {}): Promise<unknown[] | null> {
    try {
      const where: Record<string, unknown> = {};
      if (filters.sourceModule) where.sourceModule = filters.sourceModule;
      if (filters.signalCategory) where.signalCategory = filters.signalCategory;
      if (filters.severity) where.severity = filters.severity;
      if (filters.status) where.status = filters.status;
      return await (prisma as any).kimmpSignal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(Math.max(1, filters.limit ?? 100), 500),
      });
    } catch {
      return null;
    }
  }

  /** Mark a signal as PROCESSED (a consumer has acted on it). */
  static async markProcessed(id: string): Promise<boolean> {
    try {
      await (prisma as any).kimmpSignal.update({
        where: { id },
        data: { status: 'PROCESSED' },
      });
      return true;
    } catch {
      return false;
    }
  }
}
