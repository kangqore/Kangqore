import { prisma } from '../../lib/prisma';

export interface ConversionEvent {
  url: string;
  ctaKind: string;
  blueprintId?: string;
}

export class ConversionTracker {
  static async record(event: ConversionEvent): Promise<void> {
    await prisma.kangqoreVisKpiSnapshot
      .create({
        data: {
          metric: 'cta_click',
          value: 1,
          dimension: `${event.ctaKind}|${event.url}`,
          source: 'sxo',
        },
      })
      .catch(() => undefined);
  }

  static async ctaCtrByPage(): Promise<Array<{ url: string; clicks: number }>> {
    const grouped = await prisma.kangqoreVisKpiSnapshot.groupBy({
      by: ['dimension'],
      where: { metric: 'cta_click' },
      _sum: { value: true },
    });
    return grouped.map((g) => ({
      url: g.dimension?.split('|')[1] ?? 'unknown',
      clicks: g._sum.value ?? 0,
    }));
  }
}
