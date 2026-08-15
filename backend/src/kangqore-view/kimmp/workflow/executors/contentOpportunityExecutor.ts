// ---------------------------------------------------------------------------
// KIMMP Workflow — Content Opportunity executor (targetModule: vis)
//
// Promotes an existing KimmpPageOpportunity to PENDING (ready for generation)
// or, if the signal's value resolves to a slug, locates it by slug.
// If there is a leadId, also logs a lead event so the recommendation is
// visible in the lead timeline.
// ---------------------------------------------------------------------------

import { prisma } from '../../../../lib/prisma';
import logger from '../../../../utils/logger';
import { ExecutorInput, ExecutorResult } from './salesAlertExecutor';

export async function runContentOpportunity(
  input: ExecutorInput & { signalValue?: string | null }
): Promise<ExecutorResult> {
  let oppPromoted = false;

  // Attempt to promote the page opportunity referenced by the signal value (the slug).
  if (input.signalValue) {
    try {
      const opp = await (prisma as any).kimmpPageOpportunity.findFirst({
        where: { suggestedSlug: input.signalValue, status: 'OPEN' },
      });
      if (opp) {
        await (prisma as any).kimmpPageOpportunity.update({
          where: { id: opp.id },
          data: { status: 'PENDING', updatedAt: new Date() },
        });
        oppPromoted = true;
        logger.info(`[KIMMP:WORKFLOW] CONTENT_OPPORTUNITY promoted opp=${opp.id} slug=${input.signalValue}`);
      }
    } catch (err) {
      logger.warn(`[KIMMP:WORKFLOW] CONTENT_OPPORTUNITY opp lookup failed: ${(err as Error).message}`);
    }
  }

  // If there is a leadId, log a lead event so it appears in the lead timeline.
  if (input.leadId) {
    try {
      await prisma.eqoreLeadEvent.create({
        data: {
          leadId: input.leadId,
          eventType: 'KIMMP_CONTENT_OPPORTUNITY',
          reason: input.recommendedAction,
          eventData: {
            decisionId: input.decisionId,
            signalValue: input.signalValue,
            oppPromoted,
            source: 'KIMMP_WORKFLOW',
          } as any,
        },
      });
    } catch {
      // Lead event is optional — a content opportunity action does not require a lead.
    }
  }

  return {
    action: oppPromoted ? 'OPPORTUNITY_PROMOTED_TO_PENDING' : 'RECOMMENDATION_LOGGED',
    detail: { signalValue: input.signalValue, oppPromoted },
  };
}
