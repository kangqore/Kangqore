import { prisma } from '../../lib/prisma';
import { KangqoreVisRegistry } from '../core/KangqoreVisRegistry';

export interface DataSourceStatusReport {
  name: string;
  kind: string;
  status: 'connected' | 'unconnected' | 'error';
  lastSyncAt: Date | null;
  lastError: string | null;
}

export class DataSourceRegistry {
  static async report(): Promise<DataSourceStatusReport[]> {
    const adapters = KangqoreVisRegistry.listAdapters();
    const reports: DataSourceStatusReport[] = [];

    for (const adapter of adapters) {
      const connected = await adapter.isConnected().catch(() => false);
      const persisted = await prisma.kangqoreVisDataSource
        .findUnique({ where: { name: adapter.name } })
        .catch(() => null);

      reports.push({
        name: adapter.name,
        kind: adapter.kind,
        status: connected ? 'connected' : 'unconnected',
        lastSyncAt: persisted?.lastSyncAt ?? null,
        lastError: persisted?.lastError ?? null,
      });
    }

    return reports;
  }

  static async ensurePersistedRecords(): Promise<void> {
    const adapters = KangqoreVisRegistry.listAdapters();
    for (const adapter of adapters) {
      const kindUpper = adapter.kind.toUpperCase().replace('-', '_') as
        | 'ANALYTICS'
        | 'SEO'
        | 'PERFORMANCE'
        | 'ANSWER_ENGINE';
      await prisma.kangqoreVisDataSource
        .upsert({
          where: { name: adapter.name },
          create: { name: adapter.name, kind: kindUpper, status: 'UNCONNECTED' },
          update: {},
        })
        .catch((err) => {
          console.error(`kangqore-vis.dataSource.persist.error(${adapter.name})`, err);
        });
    }
  }
}
