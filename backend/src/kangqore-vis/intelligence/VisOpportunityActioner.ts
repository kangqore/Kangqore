// ---------------------------------------------------------------------------
// KIMMP → VIS return channel for AUTHORITY_OPPORTUNITY decisions.
//
// Called by authorityOpportunityExecutor.ts when an admin APPROVES and
// executes a cross-capability opportunity. Drafts a real KangqoreVisPageBlueprint
// so the recommendation becomes something an editor can actually review —
// never publishes it. Publishing still requires PublishChecklist to pass,
// same as every other blueprint.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma';
import { PageBlueprintService } from '../content-mapping/PageBlueprintService';
import { candidateUrl } from './scoring/candidateUrl';
import logger from '../../utils/logger';

export interface DraftBlueprintResult {
  drafted: boolean;
  blueprintId?: string;
  url?: string;
  reason?: string;
}

export class VisOpportunityActioner {
  static async draftBlueprint(params: {
    entitySlugs: string[];
    reasoning: string;
  }): Promise<DraftBlueprintResult> {
    const url = candidateUrl(params.entitySlugs);
    if (!url) {
      return { drafted: false, reason: 'AUTHORITY_OPPORTUNITY needs at least 2 entity slugs to draft an industry page.' };
    }
    const [slugA, slugB] = url.replace('/industries/', '').split('/');

    try {
      const entities = await prisma.kangqoreVisEntity.findMany({ where: { slug: { in: [slugA, slugB] } } });
      const nameA = entities.find((e) => e.slug === slugA)?.name ?? slugA;
      const nameB = entities.find((e) => e.slug === slugB)?.name ?? slugB;

      const hub = await prisma.kangqoreVisHub.findFirst({ where: { slug: { in: [slugA, slugB] } } });

      const blueprint = await PageBlueprintService.upsertByUrl(url, {
        pageName: `${nameA} + ${nameB}`,
        url,
        pageType: 'INDUSTRY',
        primaryKeyword: `${nameA} ${nameB}`,
        searchIntent: 'LEARN_EVALUATE_HIRE',
        problemSolved: params.reasoning,
        businessOutcome: params.reasoning,
        parentHubId: hub?.id,
        faqRequired: true,
        schemaRequired: ['ORGANIZATION', 'WEBPAGE'],
        ctaKind: 'BOOK_CONSULTATION',
        status: 'DRAFT',
        source: 'vis-intelligence-kernel',
      });

      logger.info(`[VIS:INTELLIGENCE] Drafted industry blueprint "${url}" from AUTHORITY_OPPORTUNITY (${nameA} + ${nameB})`);
      return { drafted: true, blueprintId: blueprint.id, url };
    } catch (err) {
      logger.warn(`[VIS:INTELLIGENCE] draftBlueprint failed: ${(err as Error).message}`);
      return { drafted: false, reason: (err as Error).message };
    }
  }
}
