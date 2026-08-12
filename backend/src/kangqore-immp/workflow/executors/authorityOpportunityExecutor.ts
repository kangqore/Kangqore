// ---------------------------------------------------------------------------
// KIMMP Workflow — Authority Opportunity executor (targetModule: vis)
//
// Handles AUTHORITY_OPPORTUNITY decisions: cross-capability VIS patterns
// detected by kimmpCorrelation.service.ts Rule 5. Reads the entity slugs off
// the originating signal's metadata and asks VIS to draft a real page
// blueprint for the theme. Never publishes anything — drafts only.
// ---------------------------------------------------------------------------

import { VisOpportunityActioner } from '../../../kangqore-vis/intelligence/VisOpportunityActioner';
import { ExecutorInput, ExecutorResult } from './salesAlertExecutor';

export async function runAuthorityOpportunity(
  input: ExecutorInput & { reasoning?: string; signalMetadata?: Record<string, unknown> | null }
): Promise<ExecutorResult> {
  const entitySlugs = Array.isArray(input.signalMetadata?.entitySlugs)
    ? (input.signalMetadata!.entitySlugs as string[])
    : [];

  const result = await VisOpportunityActioner.draftBlueprint({
    entitySlugs,
    reasoning: input.reasoning ?? input.recommendedAction,
  });

  return {
    action: result.drafted ? 'BLUEPRINT_DRAFTED' : 'DRAFT_SKIPPED',
    detail: { entitySlugs, ...result },
  };
}
