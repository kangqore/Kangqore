import { prisma } from '../../lib/prisma';
import { CANONICAL_DEPARTMENTS, CANONICAL_SERVICES } from './data/canonicalTaxonomy';

// `featured` on servicesData.js is the only real prioritization signal that
// exists in the canonical taxonomy today (8 of 62 services are featured) —
// used as-is rather than inventing a finer-grained score. Departments have
// no differentiating signal (they're 6 peer pillars, not ranked), so a
// service's `strategicPillar` carries its department for context, but no
// separate department-only registry row is created — nothing would ever
// match a VIS entity slug against a department name alone.
const FEATURED_WEIGHT = 0.85;
const STANDARD_WEIGHT = 0.4;

export class PriorityRegistryImporter {
  /**
   * Seeds the registry from the canonical 6-department/62-service taxonomy
   * (frontend/src/data/departmentsData.js + servicesData.js, mirrored
   * backend-side in ./data/canonicalTaxonomy.ts — see that file's header).
   * Idempotent — safe to re-run after the canonical taxonomy changes;
   * existing seeded rows are updated in place rather than duplicated.
   *
   * NOTE: there is no canonical "priority industry" or "priority product"
   * source anywhere in the codebase today (checked: no
   * frontend/src/data/industries* file, and the only industry list found —
   * eqore-lead-intelligence/taxonomy/kangqoreIndustryTaxonomy.ts — is an
   * internal lead-scoring taxonomy, not Kangqore's own public service
   * structure). This importer intentionally does not populate
   * `priorityIndustry`/`priorityProduct` — those stay empty until a real
   * source exists, rather than guessing.
   */
  static async importFromTaxonomy(): Promise<{ services: number }> {
    const deptNameBySlug = new Map(CANONICAL_DEPARTMENTS.map((d) => [d.slug, d.name]));

    let services = 0;
    for (const service of CANONICAL_SERVICES) {
      const data = {
        priorityService: service.slug,
        strategicPillar: deptNameBySlug.get(service.departmentSlug) ?? service.departmentSlug,
        priorityWeight: service.featured ? FEATURED_WEIGHT : STANDARD_WEIGHT,
        source: 'seed:canonicalServices',
        notes: service.featured ? `Featured service — ${service.name}.` : service.name,
      };
      const existing = await prisma.kangqoreVisPriorityRegistry.findFirst({
        where: { priorityService: service.slug, source: 'seed:canonicalServices' },
      });
      if (existing) await prisma.kangqoreVisPriorityRegistry.update({ where: { id: existing.id }, data });
      else await prisma.kangqoreVisPriorityRegistry.create({ data });
      services++;
    }

    return { services };
  }
}
