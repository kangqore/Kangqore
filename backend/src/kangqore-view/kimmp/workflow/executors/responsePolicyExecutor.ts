// ---------------------------------------------------------------------------
// KIMMP Workflow — Response Policy executor (targetModule: eqore)
//
// RESPONSE_POLICY decisions recommend changing how eQORE responds to a specific
// lead or conversation. Applying the policy automatically would risk an untested
// change to the live chat path, so the executor logs the recommendation and
// records a lead event only. A human must manually enable the flag or adjust
// eQORE's configuration.
//
// If KIMMP_EQORE_INFLUENCE is ever promoted from advisory to active, this
// executor is the place to add the actual flag-flip logic.
// ---------------------------------------------------------------------------

import { prisma } from '../../../../lib/prisma';
import logger from '../../../../utils/logger';
import { ExecutorInput, ExecutorResult } from './salesAlertExecutor';

export async function runResponsePolicy(input: ExecutorInput): Promise<ExecutorResult> {
  if (input.leadId) {
    try {
      await prisma.eqoreLeadEvent.create({
        data: {
          leadId: input.leadId,
          eventType: 'KIMMP_RESPONSE_POLICY',
          reason: input.recommendedAction,
          eventData: {
            decisionId: input.decisionId,
            note: 'Policy recommendation logged. Enable KIMMP_EQORE_INFLUENCE to activate.',
            source: 'KIMMP_WORKFLOW',
          } as any,
        },
      });
    } catch {
      // Non-blocking — the recommendation is still visible in the decision record.
    }
  }

  logger.info(
    `[KIMMP:WORKFLOW] RESPONSE_POLICY recommendation logged decisionId=${input.decisionId} ` +
      `(no eQORE mutation — enable KIMMP_EQORE_INFLUENCE manually if appropriate)`
  );

  return {
    action: 'POLICY_RECOMMENDATION_LOGGED',
    detail: {
      note: 'No automatic eQORE change. Enable KIMMP_EQORE_INFLUENCE flag to activate behavior shaping.',
    },
  };
}
