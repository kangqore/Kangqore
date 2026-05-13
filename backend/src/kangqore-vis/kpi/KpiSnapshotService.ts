import { prisma } from '../../lib/prisma';
import { KpiAggregator } from './KpiAggregator';

export class KpiSnapshotService {
  static async snapshot(): Promise<void> {
    const { kpis } = await KpiAggregator.overview();
    for (const kpi of kpis) {
      if (typeof kpi.value !== 'number') continue;
      await prisma.kangqoreVisKpiSnapshot
        .create({
          data: {
            metric: kpi.metric,
            value: kpi.value,
            source: kpi.source,
          },
        })
        .catch(() => undefined);
    }
  }
}
