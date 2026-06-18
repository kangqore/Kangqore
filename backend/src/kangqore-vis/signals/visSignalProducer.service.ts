// ---------------------------------------------------------------------------
// VIS → Signal Ledger producer (Phase 2)
//
// Reads high-priority page opportunities from kimmp_page_opportunities and
// emits CONTENT signals into the Signal Ledger so the Decision Engine can
// propose content-creation actions. Called from a VIS admin endpoint or a
// scheduled scan.
//
// Best-effort: never throws. `prisma as any` — the kimmpPageOpportunity
// accessor may be absent on a fresh checkout.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import { SignalLedger } from '../../kangqore-immp/signals/signalLedger.service';
import { AlisVisSync } from '../../kangqore-alis/services/alisVisSync.service';
import logger from '../../utils/logger';

export interface VisSignalScanResult {
  opportunitiesScanned: number;
  signalsEmitted: number;
}

/** Fibonacci priority threshold — only signal opportunities with real demand. */
const MIN_PRIORITY = 5;

export class VisSignalProducer {
  /**
   * Scan open page opportunities with priority >= MIN_PRIORITY and emit one
   * CONTENT signal per opportunity. Already-processed opportunities are
   * skipped (best-effort via existing signalValue dedup).
   */
  static async scanAndEmit(): Promise<VisSignalScanResult> {
    let scanned = 0;
    let emitted = 0;
    try {
      const opportunities: any[] = await (prisma as any).kimmpPageOpportunity.findMany({
        where: {
          status: { in: ['OPEN', 'PENDING'] },
          priority: { gte: MIN_PRIORITY },
        },
        orderBy: { priority: 'desc' },
        take: 100,
      });

      scanned = opportunities.length;

      for (const opp of opportunities) {
        const severity =
          opp.priority >= 21 ? 'CRITICAL'
          : opp.priority >= 13 ? 'HIGH'
          : opp.priority >= 8 ? 'MODERATE'
          : 'LOW';

        await SignalLedger.record({
          sourceModule: 'vis',
          signalType: 'CONTENT_GAP',
          signalCategory: 'CONTENT',
          signalValue: opp.slug ?? opp.id,
          confidence: Math.min(1, opp.priority / 34),
          severity,
          metadata: {
            opportunityId: opp.id,
            slug: opp.slug,
            title: opp.title,
            priority: opp.priority,
            priorityLabel: opp.priorityLabel,
            signalCount: opp.signalCount,
          },
        });
        emitted++;
        // VIS → ALIS: apply content coverage boost to leads in this service area
        if (opp.title) AlisVisSync.applyCoverageToLeads(opp.title).catch(() => {});
      }
    } catch (err) {
      logger.warn('VisSignalProducer.scanAndEmit failed: ' + (err as Error).message);
    }
    return { opportunitiesScanned: scanned, signalsEmitted: emitted };
  }
}
