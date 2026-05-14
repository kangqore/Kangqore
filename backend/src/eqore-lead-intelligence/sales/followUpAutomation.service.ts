import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';

export class EqoreFollowUpAutomationService {
  /**
   * Schedule consultation reminders. 
   * In v1, this will just log or create a scheduled task if a cron is set up.
   * For immediate action, it logs the intent to send an email.
   */
  static async scheduleConsultationReminders(lead: any, opportunityId: string): Promise<void> {
    if (lead.schedulingStatus !== 'BOOKED' || !lead.preferredConsultationTime) {
      return;
    }

    const meetingTime = new Date(lead.preferredConsultationTime);
    logger.info(`Scheduling reminders for consultation at ${meetingTime} for lead ${lead.id}`);

    // In a full implementation, we'd add entries to a Cron job table or queue
    // V1: Log the activity
    try {
      await prisma.eqoreSalesActivity.create({
        data: {
          leadId: lead.id,
          opportunityId,
          activityType: 'REMINDERS_SCHEDULED',
          description: `Scheduled 24h and 2h email reminders for consultation at ${meetingTime.toISOString()}`,
          metadata: { meetingTime: meetingTime.toISOString() }
        }
      });
    } catch (error) {
      logger.error('Failed to log reminder scheduling', error);
    }
  }

  /**
   * Handles post consultation cleanup (e.g. creating follow-up task if completed)
   */
  static async handlePostConsultation(leadId: string, opportunityId: string): Promise<void> {
    logger.info(`Executing post-consultation automation for lead ${leadId}`);
    try {
      await prisma.eqoreSalesTask.create({
        data: {
          leadId,
          opportunityId,
          title: 'Post-Consultation Review',
          description: 'Consultation is marked complete. Add call notes and determine next steps.',
          taskType: 'POST_CALL_REVIEW',
          priority: 'HIGH',
          dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
          status: 'OPEN'
        }
      });
    } catch (error) {
      logger.error('Failed to create post-consultation task', error);
    }
  }
}
