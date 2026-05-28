// ---------------------------------------------------------------------------
// KIMMP Workflow — Human Handoff executor (targetModule: human)
//
// Marks the conversation/lead for immediate human escalation via a lead event.
// Does NOT auto-reassign or message anyone — a human must take over explicitly.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';
import logger from '../../../utils/logger';
import { ExecutorInput, ExecutorResult } from './salesAlertExecutor';

export async function runHumanHandoff(input: ExecutorInput): Promise<ExecutorResult> {
  if (!input.leadId) {
    return { action: 'SKIPPED_NO_LEAD_ID', detail: { reason: 'HUMAN_HANDOFF decision has no leadId.' } };
  }

  const lead = await prisma.eqoreLead.findUnique({
    where: { id: input.leadId },
    select: { id: true, status: true },
  });

  if (!lead) {
    return { action: 'SKIPPED_LEAD_NOT_FOUND', detail: { leadId: input.leadId } };
  }

  // Log the handoff request as a lead event.
  await prisma.eqoreLeadEvent.create({
    data: {
      leadId: input.leadId,
      eventType: 'KIMMP_HUMAN_HANDOFF',
      reason: input.recommendedAction,
      previousStatus: lead.status,
      eventData: {
        decisionId: input.decisionId,
        conversationId: input.conversationId,
        source: 'KIMMP_WORKFLOW',
      } as any,
    },
  });

  // Escalate the lead status if it is below ESCALATED.
  const LOW_STATUSES = new Set(['NEW', 'ACTIVE', 'WARM']);
  let statusUpdated = false;
  if (LOW_STATUSES.has(lead.status)) {
    await prisma.eqoreLead.update({
      where: { id: input.leadId },
      data: { status: 'ESCALATED', updatedAt: new Date() },
    });
    statusUpdated = true;
  }

  logger.info(
    `[KIMMP:WORKFLOW] HUMAN_HANDOFF lead=${input.leadId} statusUpdated=${statusUpdated}`
  );

  return {
    action: statusUpdated ? 'LEAD_ESCALATED_AND_EVENT_LOGGED' : 'LEAD_EVENT_LOGGED',
    detail: { leadId: input.leadId, previousStatus: lead.status, statusUpdated },
  };
}
