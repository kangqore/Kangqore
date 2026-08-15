// ---------------------------------------------------------------------------
// KIMMP Workflow — Sales Alert executor (targetModule: lead-intelligence)
//
// Creates or updates an EqoreSalesOpportunity and logs a lead event so the
// sales team has a concrete record of the KIMMP recommendation.
// Never silently changes anything — every write is logged.
// ---------------------------------------------------------------------------

import { prisma } from '../../../../lib/prisma';
import logger from '../../../../utils/logger';

export interface ExecutorInput {
  decisionId: string;
  leadId?: string | null;
  conversationId?: string | null;
  recommendedAction: string;
  priority: number;
}

export interface ExecutorResult {
  action: string;
  detail?: Record<string, unknown>;
}

export async function runSalesAlert(input: ExecutorInput): Promise<ExecutorResult> {
  if (!input.leadId) {
    return { action: 'SKIPPED_NO_LEAD_ID', detail: { reason: 'SALES_ALERT decision has no leadId — cannot act.' } };
  }

  const lead = await prisma.eqoreLead.findUnique({
    where: { id: input.leadId },
    select: { id: true, status: true, companyName: true, email: true },
  });

  if (!lead) {
    return { action: 'SKIPPED_LEAD_NOT_FOUND', detail: { leadId: input.leadId } };
  }

  // Log the sales alert as a lead event (always, regardless of opportunity state).
  await prisma.eqoreLeadEvent.create({
    data: {
      leadId: input.leadId,
      eventType: 'KIMMP_SALES_ALERT',
      reason: input.recommendedAction,
      eventData: { decisionId: input.decisionId, priority: input.priority, source: 'KIMMP_WORKFLOW' } as any,
    },
  });

  // Create a sales opportunity if none exists.
  let oppAction = 'LEAD_EVENT_LOGGED';
  try {
    const existing = await prisma.eqoreSalesOpportunity.findUnique({ where: { leadId: input.leadId } });
    if (!existing) {
      const oppPriority = input.priority >= 21 ? 'CRISIS' : input.priority >= 13 ? 'HIGH' : 'MEDIUM';
      await prisma.eqoreSalesOpportunity.create({
        data: {
          leadId: input.leadId,
          stage: 'PIPELINE',
          priority: oppPriority,
          nextAction: input.recommendedAction,
        },
      });
      oppAction = 'OPPORTUNITY_CREATED';
      logger.info(`[KIMMP:WORKFLOW] SALES_ALERT created opportunity for lead=${input.leadId}`);
    } else {
      oppAction = 'OPPORTUNITY_ALREADY_EXISTS';
    }
  } catch (err) {
    logger.warn(`[KIMMP:WORKFLOW] SALES_ALERT opportunity upsert failed: ${(err as Error).message}`);
  }

  return {
    action: oppAction,
    detail: { leadId: input.leadId, leadStatus: lead.status },
  };
}
