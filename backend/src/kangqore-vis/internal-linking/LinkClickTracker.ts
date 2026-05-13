import { prisma } from '../../lib/prisma';

export class LinkClickTracker {
  static async record(payload: {
    sourceUrl: string;
    targetUrl: string;
    anchorText?: string;
    position?: string;
  }): Promise<void> {
    const source = await prisma.kangqoreVisPageBlueprint.findUnique({ where: { url: payload.sourceUrl } });
    const target = await prisma.kangqoreVisPageBlueprint.findUnique({ where: { url: payload.targetUrl } });
    if (!source || !target) return;

    await prisma.kangqoreVisInternalLink
      .upsert({
        where: {
          sourceId_targetId_anchorText: {
            sourceId: source.id,
            targetId: target.id,
            anchorText: payload.anchorText ?? '',
          },
        },
        create: {
          sourceId: source.id,
          targetId: target.id,
          anchorText: payload.anchorText,
          position: payload.position,
        },
        update: {},
      })
      .catch(() => undefined);
  }
}
