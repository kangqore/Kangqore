import { prisma } from '../../lib/prisma';
import type { CwvSamplePayload } from '../core/types';

export class WebVitalsCollector {
  static async record(payload: CwvSamplePayload): Promise<void> {
    if (!payload?.url || !payload?.metric || typeof payload.value !== 'number') return;
    const blueprint = await prisma.kangqoreVisPageBlueprint.findUnique({
      where: { url: payload.url },
      select: { id: true },
    });
    await prisma.kangqoreVisCwvSample
      .create({
        data: {
          blueprintId: blueprint?.id,
          url: payload.url,
          metric: payload.metric,
          value: payload.value,
          rating: payload.rating,
          navigationType: payload.navigationType,
          userAgent: payload.userAgent,
        },
      })
      .catch(() => undefined);
  }

  static async rollup(metric: string): Promise<{ p50: number; p75: number; p95: number; samples: number }> {
    const rows = await prisma.kangqoreVisCwvSample.findMany({
      where: { metric },
      select: { value: true },
      take: 5000,
      orderBy: { createdAt: 'desc' },
    });
    if (rows.length === 0) return { p50: 0, p75: 0, p95: 0, samples: 0 };
    const sorted = rows.map((r: { value: number }) => r.value).sort((a: number, b: number) => a - b);
    const at = (p: number) => sorted[Math.floor((sorted.length - 1) * p)];
    return { p50: at(0.5), p75: at(0.75), p95: at(0.95), samples: rows.length };
  }
}
