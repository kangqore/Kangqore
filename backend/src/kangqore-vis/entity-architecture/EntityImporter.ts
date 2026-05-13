import { prisma } from '../../lib/prisma';
import { SEED_ENTITIES } from './data/seedEntities';

export class EntityImporter {
  static async importSeed(): Promise<{ entities: number; hubs: number; spokes: number }> {
    let entities = 0;
    let hubs = 0;
    let spokes = 0;

    for (const seed of SEED_ENTITIES) {
      await prisma.kangqoreVisEntity.upsert({
        where: { slug: seed.slug },
        create: {
          slug: seed.slug,
          name: seed.name,
          description: seed.description,
          category: seed.category,
          url: seed.url,
          schemaType: seed.schemaType,
          sameAs: seed.sameAs ?? [],
          proofPoints: seed.proofPoints ?? [],
        },
        update: {
          name: seed.name,
          description: seed.description,
          url: seed.url,
          schemaType: seed.schemaType,
        },
      });
      entities++;

      if (seed.category === 'department') {
        await prisma.kangqoreVisHub.upsert({
          where: { slug: seed.slug },
          create: {
            slug: seed.slug,
            name: seed.name,
            description: seed.description,
            category: 'department',
            url: seed.url,
          },
          update: {},
        });
        hubs++;
      }
    }

    return { entities, hubs, spokes };
  }
}
