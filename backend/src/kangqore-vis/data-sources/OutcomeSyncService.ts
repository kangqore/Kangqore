// ---------------------------------------------------------------------------
// VIS 3.4 — Outcome Telemetry sync
//
// Runs every registered adapter and persists whatever real data connected
// ones return. As of this build, all 7 adapters (GSC/GA4/Bing/Ahrefs/
// Semrush/Lighthouse/AnswerEngine) are unconnected — no credentials exist —
// and none override fetch(), so this is a correct, honest no-op today: 0
// connected, 0 outcomes synced. That's the expected result, not a bug.
// Implementing a real adapter's fetch() (see OutcomeRecord.ts for the
// contract it must return) is what turns this from plumbing into telemetry.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import { KangqoreVisRegistry } from '../core/KangqoreVisRegistry';
import { DataSourceRegistry } from './DataSourceRegistry';
import type { OutcomeRecord } from './OutcomeRecord';
import logger from '../../utils/logger';

export interface SyncResult {
  adaptersChecked: number;
  connected: number;
  outcomesSynced: number;
}

export class OutcomeSyncService {
  static async syncAll(): Promise<SyncResult> {
    await DataSourceRegistry.ensurePersistedRecords();

    const adapters = KangqoreVisRegistry.listAdapters();
    let connected = 0;
    let outcomesSynced = 0;

    for (const adapter of adapters) {
      const dataSource = await prisma.kangqoreVisDataSource.findUnique({ where: { name: adapter.name } });
      if (!dataSource) continue;

      const job = await prisma.kangqoreVisIngestionJob.create({ data: { dataSourceId: dataSource.id } });

      try {
        const result = await adapter.fetch();

        if (result.status === 'connected') {
          connected++;
          const records = (Array.isArray(result.data) ? result.data : []) as OutcomeRecord[];
          for (const rec of records) {
            await prisma.kangqoreVisOutcome.create({
              data: {
                dataSourceId: dataSource.id,
                blueprintId: rec.blueprintId,
                metric: rec.metric,
                value: rec.value,
                measuredAt: rec.measuredAt,
                raw: rec.raw as any,
              },
            });
            outcomesSynced++;
          }
          await prisma.kangqoreVisIngestionJob.update({
            where: { id: job.id },
            data: { status: 'SUCCESS', finishedAt: new Date(), rowsIngested: records.length },
          });
          await prisma.kangqoreVisDataSource.update({
            where: { id: dataSource.id },
            data: { status: 'CONNECTED', lastSyncAt: new Date(), lastError: null },
          });
        } else {
          const reason = result.status === 'error' ? result.error : result.reason;
          await prisma.kangqoreVisIngestionJob.update({
            where: { id: job.id },
            data: { status: 'SKIPPED', finishedAt: new Date(), error: reason },
          });
          if (result.status === 'error') {
            await prisma.kangqoreVisDataSource.update({
              where: { id: dataSource.id },
              data: { status: 'ERROR', lastError: result.error },
            });
          }
        }
      } catch (err) {
        logger.warn(`[VIS:OUTCOME_SYNC] ${adapter.name} threw: ${(err as Error).message}`);
        await prisma.kangqoreVisIngestionJob
          .update({
            where: { id: job.id },
            data: { status: 'ERROR', finishedAt: new Date(), error: (err as Error).message },
          })
          .catch(() => {});
      }
    }

    logger.info(`[VIS:OUTCOME_SYNC] checked=${adapters.length} connected=${connected} outcomes=${outcomesSynced}`);
    return { adaptersChecked: adapters.length, connected, outcomesSynced };
  }
}
