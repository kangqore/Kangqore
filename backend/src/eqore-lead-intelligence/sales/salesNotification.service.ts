import logger from '../../utils/logger';
import { prisma } from '../../lib/prisma';

export class EqoreSalesNotificationService {
  /**
   * Dispatches internal sales alerts
   */
  static async sendAlert(eventType: string, lead: any, opportunity: any, task?: any): Promise<void> {
    logger.info(`[SALES_ALERT] Event: ${eventType} | Lead: ${lead.id} | Opp: ${opportunity.id}`);
    
    let message = '';
    
    switch (eventType) {
      case 'CRISIS_ASSURANCE_QUERY':
        message = `🔥 CRISIS ALERT: Lead ${lead.email || 'Unknown'} reported a crisis.\n` +
                  `Department: ${lead.primaryDepartment}\n` +
                  `Recommended: ${lead.recommendedSolutionPackage}\n` +
                  `Assigned to: ${lead.assignedOwnerName}`;
        break;
      case 'GOLDEN_LEAD_CREATED':
      case 'HOT_LEAD_CREATED':
        message = `⭐ ${eventType.replace('_CREATED', '')} Detected!\n` +
                  `Score: ${lead.leadScore} | Confidence: ${lead.leadConfidence}\n` +
                  `Assigned to: ${lead.assignedOwnerName}\n` +
                  `Next Action: ${opportunity.nextAction || 'Follow up immediately'}`;
        break;
      case 'CONSULTATION_BOOKED':
        message = `📅 Consultation Booked by ${lead.email || 'Lead'}.\n` +
                  `Time: ${lead.preferredConsultationTime || 'TBD'}\n` +
                  `Assigned to: ${lead.assignedOwnerName}`;
        break;
      case 'SALES_TASK_CREATED':
        message = `📋 New Task: ${task?.title}\nDue: ${task?.dueAt}`;
        break;
      case 'DEAL_WON':
        message = `🏆 DEAL WON! Lead ${lead.email || 'Unknown'} closed.\nValue: $${opportunity.estimatedValue || 0}\nReason: ${opportunity.wonReason}`;
        break;
      case 'DEAL_LOST':
        message = `❌ Deal Lost: Lead ${lead.email || 'Unknown'}.\nReason: ${opportunity.lostReason}`;
        break;
      default:
        message = `Alert: ${eventType} for lead ${lead.id}`;
    }

    // V1 Placeholder for Email/Slack integration
    // In a real implementation, we would call sendgrid/slack webhook here
    logger.info(`[SALES_ALERT_PAYLOAD]\n${message}\n------------------------`);

    // Log as activity
    try {
      await prisma.eqoreSalesActivity.create({
        data: {
          leadId: lead.id,
          opportunityId: opportunity.id,
          activityType: 'ALERT_SENT',
          description: `System sent alert: ${eventType}`,
          metadata: { eventType, message }
        }
      });
    } catch (error) {
      logger.error('Failed to log sales activity for alert', error);
    }
  }
}
