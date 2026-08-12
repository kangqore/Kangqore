import type { ScoredDimension } from '../types';
import { prisma } from '../../../../lib/prisma';
import { PageBlueprintService } from '../../../content-mapping/PageBlueprintService';
import { candidateUrl } from '../candidateUrl';

// Matches the LOW/MEDIUM/HIGH multiplier thresholds OpportunityScoringEngine
// already applies (>=70 LOW, >=40 MEDIUM, else HIGH) — see weights.ts
// EFFORT_MULTIPLIERS and the branch that reads this score.
const EFFORT_SCORE = { LOW: 85, MEDIUM: 55, HIGH: 25 } as const;

/**
 * VIS 3.3 — deterministic implementation-effort estimate. Every input is a
 * real lookup against tables that already exist (no new schema): does the
 * candidate page already exist, is there an organizing hub, do the
 * entities already carry a schema type, and how many entities does the
 * opportunity span. status is ESTIMATED (a real heuristic model) rather
 * than AVAILABLE (native signal) or CONFIGURED (external registry) — see
 * VIS 3.1/3.2 for those.
 */
export async function scoreEffort(entitySlugs: string[]): Promise<ScoredDimension> {
  const url = candidateUrl(entitySlugs);
  const pageExists = url ? Boolean(await PageBlueprintService.getByUrl(url)) : false;

  const hub = entitySlugs.length
    ? await prisma.kangqoreVisHub.findFirst({ where: { slug: { in: entitySlugs } } })
    : null;
  const hubExists = Boolean(hub);

  const entities = entitySlugs.length
    ? await prisma.kangqoreVisEntity.findMany({ where: { slug: { in: entitySlugs } } })
    : [];
  const schemaSupported = entities.length > 0 && entities.every((e) => e.schemaType !== null);

  const scope = entitySlugs.length;
  const groundworkExists = hubExists && schemaSupported;

  let tier: 'LOW' | 'MEDIUM' | 'HIGH';
  if (pageExists) tier = 'LOW';
  else if (scope >= 4) tier = 'HIGH';
  else if (scope === 3) tier = groundworkExists ? 'MEDIUM' : 'HIGH';
  else tier = groundworkExists ? 'LOW' : 'MEDIUM';

  const detail =
    `${pageExists ? 'Page already exists' : 'No existing page'}; ` +
    `${hubExists ? 'hub exists' : 'no matching hub'}; ` +
    `${schemaSupported ? 'schema already supported' : 'schema not yet supported on all entities'}; ` +
    `${scope}-entity scope → ${tier}.`;

  return {
    status: 'ESTIMATED',
    score: EFFORT_SCORE[tier],
    weight: 0,
    detail,
  };
}
