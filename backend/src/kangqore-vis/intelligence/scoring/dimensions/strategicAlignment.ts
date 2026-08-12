import type { ScoredDimension } from '../types';
import { DIMENSION_WEIGHTS } from '../weights';
import { PriorityRegistryService } from '../../../priority-registry/PriorityRegistryService';

/**
 * VIS 3.2 — consumes the VIS Priority Registry (seeded from the canonical
 * 6-department/62-service taxonomy — frontend/src/data/departmentsData.js +
 * servicesData.js, mirrored in priority-registry/data/canonicalTaxonomy.ts —
 * see PriorityRegistryImporter). Fuzzy (case-insensitive, either-direction
 * substring) match, since VIS entity slugs won't always match registry
 * slugs exactly.
 *
 * Status is CONFIGURED (not AVAILABLE) when matched — this dimension isn't
 * native VIS signal data, it's read from a separately-configured registry.
 * Genuinely unconfigured themes stay UNAVAILABLE — never a fabricated
 * "average" priority for something nobody has actually prioritized. Note:
 * there's no canonical "industry" concept in this taxonomy (services and
 * departments only) — an entity like "Healthcare" will only match if it's
 * separately added to the registry manually via the CRUD routes.
 */
export async function scoreStrategicAlignment(entitySlugs: string[]): Promise<ScoredDimension> {
  const registry = await PriorityRegistryService.listActive();

  const matches: { slug: string; registrySlug: string; weight: number }[] = [];
  for (const entitySlug of entitySlugs) {
    const needle = entitySlug.toLowerCase();
    for (const entry of registry) {
      const candidates = [entry.priorityIndustry, entry.priorityService, entry.priorityProduct].filter(
        (v): v is string => Boolean(v),
      );
      const hit = candidates.find((c) => {
        const haystack = c.toLowerCase();
        return haystack.includes(needle) || needle.includes(haystack);
      });
      if (hit) matches.push({ slug: entitySlug, registrySlug: hit, weight: entry.priorityWeight });
    }
  }

  if (matches.length === 0) {
    return {
      status: 'UNAVAILABLE',
      weight: DIMENSION_WEIGHTS.strategicAlignment,
      detail: `NOT_CONFIGURED — no matching Priority Registry entry for [${entitySlugs.join(', ')}].`,
    };
  }

  const score = Math.round((matches.reduce((sum, m) => sum + m.weight, 0) / matches.length) * 100);
  const matchSummary = matches.map((m) => `${m.slug}↔${m.registrySlug}`).join(', ');

  return {
    status: 'CONFIGURED',
    score,
    weight: DIMENSION_WEIGHTS.strategicAlignment,
    detail: `Matched Priority Registry: ${matchSummary}.`,
  };
}
