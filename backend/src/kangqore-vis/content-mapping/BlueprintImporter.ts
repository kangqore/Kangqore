import { prisma } from '../../lib/prisma';
import { SEED_BLUEPRINTS } from './data/seedBlueprints';

export class BlueprintImporter {
  static async importSeed(): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    for (const seed of SEED_BLUEPRINTS) {
      const existing = await prisma.kangqoreVisPageBlueprint.findUnique({ where: { url: seed.url } });
      if (existing) {
        await prisma.kangqoreVisPageBlueprint.update({
          where: { url: seed.url },
          data: { ...seed, source: existing.source ?? 'seed' },
        });
        updated++;
      } else {
        await prisma.kangqoreVisPageBlueprint.create({
          data: { ...seed, source: 'seed' },
        });
        created++;
      }
    }

    return { created, updated };
  }
}
