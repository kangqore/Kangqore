import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { EqoreLeadAssignmentService } from './leadAssignment.service';
import { EqoreSalesTaskService } from './salesTask.service';
import { EqoreSalesNotificationService } from './salesNotification.service';
import { eqoreCrmSyncService } from './crmSync.service';
import { EqoreFollowUpAutomationService } from './followUpAutomation.service';

export class EqoreSalesPipelineService {
  /**
   * Evaluates if a lead qualifies for the sales pipeline and creates an opportunity if so.
   */
  static async evaluateAndCreateOpportunity(leadId: string): Promise<boolean> {
    try {
      const lead = await prisma.eqoreLead.findUnique({
        where: { id: leadId },
        include: { opportunity: true }
      });

      if (!lead) {
        logger.warn(`evaluateAndCreateOpportunity: Lead ${leadId} not found`);
        return false;
      }

      if (lead.opportunity) {
        logger.info(`Lead ${leadId} already has a sales opportunity. Skipping creation.`);
        return false;
      }

      // Exclusion rules
      const exclusions = ['Student', 'Researcher', 'Competitor', 'Job Seeker', 'Spam/Bot Risk'];
      if (lead.visitorType && exclusions.includes(lead.visitorType)) {
        logger.info(`Lead ${leadId} excluded from sales pipeline due to visitor type: ${lead.visitorType}`);
        return false;
      }

      // Qualification rules
      const isQualifiedScore = (lead.leadScore >= 75 && lead.leadConfidence >= 50);
      const isBooked = lead.schedulingStatus === 'BOOKED';
      const isCrisis = lead.urgency === 'CRISIS' || (lead as any).urgencyLevel === 'CRISIS';
      const isGolden = lead.leadCategory === 'Golden Lead';
      
      // We assume assuranceCategory high-risk is part of CRISIS/Golden for now

      if (!isQualifiedScore && !isBooked && !isCrisis && !isGolden) {
        logger.info(`Lead ${leadId} does not meet qualification triggers yet.`);
        return false;
      }

      logger.info(`Lead ${leadId} qualifies for Sales Pipeline. Creating Opportunity...`);

      // 1. Assign Owner
      const assignment = await EqoreLeadAssignmentService.assignOwner(lead);

      // Determine Initial Sales Priority & Stage
      let priority = 'MEDIUM';
      if (isCrisis) priority = 'CRISIS';
      else if (isGolden) priority = 'HIGH';

      let stage = 'QUALIFIED';
      if (isGolden || isCrisis) stage = 'SALES_REVIEW';
      if (isBooked) stage = 'CONSULTATION_BOOKED';

      // 2. Create Opportunity & Update Lead
      const opportunity = await prisma.eqoreSalesOpportunity.create({
        data: {
          leadId: lead.id,
          ownerId: assignment.ownerId,
          stage,
          priority,
          estimatedValue: lead.projectedValue || 0,
          primaryDepartment: lead.primaryDepartment,
          matchedServices: lead.matchedServices || [],
          recommendedPackage: lead.recommendedSolutionPackage
        }
      });

      await prisma.eqoreLead.update({
        where: { id: lead.id },
        data: {
          assignedOwnerId: assignment.ownerId,
          assignedOwnerName: assignment.ownerName,
          assignedTeam: assignment.team,
          assignmentReason: assignment.reason,
          assignedAt: new Date(),
          assignmentStatus: 'ASSIGNED',
          salesStage: stage,
          salesPriority: priority,
          lastSalesActivityAt: new Date()
        }
      });

      // 3. Log Activity
      await prisma.eqoreSalesActivity.create({
        data: {
          leadId: lead.id,
          opportunityId: opportunity.id,
          activityType: 'OPPORTUNITY_CREATED',
          description: `Sales opportunity created. Assigned to ${assignment.ownerName} (${assignment.team}).`,
          metadata: { reason: assignment.reason }
        }
      });

      // 4. Generate Tasks
      await EqoreSalesTaskService.generateInitialTasks(lead, opportunity.id, assignment.ownerId);

      // 5. Send Alerts
      if (isCrisis) {
        await EqoreSalesNotificationService.sendAlert('CRISIS_ASSURANCE_QUERY', lead, opportunity);
      } else if (isGolden) {
        await EqoreSalesNotificationService.sendAlert('GOLDEN_LEAD_CREATED', lead, opportunity);
      } else if (lead.leadCategory === 'Hot Lead') {
        await EqoreSalesNotificationService.sendAlert('HOT_LEAD_CREATED', lead, opportunity);
      } else if (isBooked) {
        await EqoreSalesNotificationService.sendAlert('CONSULTATION_BOOKED', lead, opportunity);
      }

      // 6. CRM Sync (Internal dummy provider)
      // Fire and forget so it doesn't block
      eqoreCrmSyncService.syncOpportunity(opportunity.id).catch(err => {
        logger.error(`CRM sync error for opp ${opportunity.id}`, err);
      });

      // 7. Follow-up Automation
      if (isBooked) {
        await EqoreFollowUpAutomationService.scheduleConsultationReminders(lead, opportunity.id);
      }

      logger.info(`Sales Opportunity ${opportunity.id} successfully created and initialized for Lead ${lead.id}`);
      return true;

    } catch (error) {
      logger.error(`Failed to evaluate and create opportunity for lead ${leadId}:`, error);
      return false;
    }
  }

  static async updateOpportunityStage(opportunityId: string, stage: string, reason?: string) {
    const opp = await prisma.eqoreSalesOpportunity.update({
      where: { id: opportunityId },
      data: { 
        stage,
        ...(stage === 'WON' ? { wonReason: reason, closedAt: new Date() } : {}),
        ...(stage === 'LOST' ? { lostReason: reason, closedAt: new Date() } : {})
      }
    });

    await prisma.eqoreLead.update({
      where: { id: opp.leadId },
      data: { salesStage: stage, lastSalesActivityAt: new Date() }
    });

    if (stage === 'WON') {
      await EqoreSalesNotificationService.sendAlert('DEAL_WON', { id: opp.leadId }, opp);
    } else if (stage === 'LOST') {
      await EqoreSalesNotificationService.sendAlert('DEAL_LOST', { id: opp.leadId }, opp);
    }

    return opp;
  }
}
