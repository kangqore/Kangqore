// ---------------------------------------------------------------------------
// ALIS → Signal Ledger producer (Phase 2)
//
// Scans demand trends and emits MARKET signals when significant patterns are
// detected — high-demand departments, pipeline concentrations, or hot-lead
// spikes. Called from the ALIS admin endpoint or a scheduled cron job.
//
// Best-effort: never throws. Uses `prisma as any` — the kimmpSignal accessor
// may be absent on a fresh checkout before the KIMMP migration is applied.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import { SignalLedger } from '../../kangqore-immp/signals/signalLedger.service';
import { AlisVisSync } from '../services/alisVisSync.service';
import logger from '../../utils/logger';

export interface AlisSignalScanResult {
  signalsEmitted: number;
}

/** Minimum hot-lead count before a department warrants a MARKET signal. */
const HOT_LEAD_THRESHOLD = 3;

export class AlisSignalProducer {
  /**
   * Scan the last 7 days of lead data. For each department exceeding the hot-
   * lead threshold, emit one MARKET signal (deduped by signalType + value per
   * day — best-effort, not transactional).
   */
  static async scanAndEmit(): Promise<AlisSignalScanResult> {
    let emitted = 0;
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const leads = await prisma.eqoreLead.findMany({
        where: {
          createdAt: { gte: since },
          primaryDepartment: { not: null },
        },
        select: { primaryDepartment: true, status: true, projectedValue: true },
      });

      const deptMap: Record<string, { total: number; hot: number; pipeline: number }> = {};
      for (const l of leads) {
        const dept = l.primaryDepartment!;
        if (!deptMap[dept]) deptMap[dept] = { total: 0, hot: 0, pipeline: 0 };
        deptMap[dept].total++;
        if (l.status === 'HOT' || l.status === 'GOLDEN') deptMap[dept].hot++;
        deptMap[dept].pipeline += Number(l.projectedValue || 0);
      }

      for (const [dept, stats] of Object.entries(deptMap)) {
        if (stats.hot < HOT_LEAD_THRESHOLD) continue;

        const severity =
          stats.hot >= 10 ? 'CRITICAL'
          : stats.hot >= 6 ? 'HIGH'
          : stats.hot >= 4 ? 'MODERATE'
          : 'LOW';

        await SignalLedger.record({
          sourceModule: 'alis',
          signalType: 'DEMAND_SPIKE',
          signalCategory: 'MARKET',
          signalValue: dept,
          confidence: Math.min(1, stats.hot / 10),
          severity,
          metadata: {
            department: dept,
            hotLeads: stats.hot,
            totalLeads: stats.total,
            pipeline: stats.pipeline,
            windowDays: 7,
          },
        });
        emitted++;
        // ALIS → VIS: push demand spike into VIS content priority
        AlisVisSync.pushDemandToVis(dept, stats.hot).catch(() => {});
      }
    } catch (err) {
      logger.warn('AlisSignalProducer.scanAndEmit failed: ' + (err as Error).message);
    }
    return { signalsEmitted: emitted };
  }
}
