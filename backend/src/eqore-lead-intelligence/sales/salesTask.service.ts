import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';

export class EqoreSalesTaskService {
  /**
   * Generates initial follow-up tasks for a new sales opportunity
   */
  static async generateInitialTasks(lead: any, opportunityId: string, ownerId: string): Promise<void> {
    const isCrisis = lead.urgency === 'CRISIS' || lead.urgencyLevel === 'CRISIS';
    const isGolden = lead.leadCategory === 'Golden Lead';
    const isHot = lead.leadCategory === 'Hot Lead';
    const isBooked = lead.schedulingStatus === 'BOOKED';
    
    let title = 'Follow up with lead';
    let description = 'General follow-up required based on recent lead activity.';
    let priority = 'MEDIUM';
    let dueHours = 48;
    let taskType = 'FOLLOW_UP';

    if (isCrisis) {
      title = 'URGENT: Executive Crisis Call';
      description = 'Lead is experiencing a CRISIS. Call within 1 hour and review incident timeline.';
      priority = 'CRISIS';
      dueHours = 1;
      taskType = 'EMERGENCY_CALL';
    } else if (isGolden) {
      title = 'Golden Lead Follow-up';
      description = 'High-value Golden Lead detected. Follow up within 1 hour.';
      priority = 'HIGH';
      dueHours = 1;
      taskType = 'EXECUTIVE_OUTREACH';
    } else if (isHot) {
      title = 'Hot Lead Follow-up';
      description = 'Hot Lead detected. Follow up today.';
      priority = 'HIGH';
      dueHours = 24;
      taskType = 'SALES_CALL';
    } else if (isBooked) {
      title = 'Prepare Consultation Brief';
      description = 'Consultation booked. Review transcript and prepare call brief before meeting.';
      priority = 'MEDIUM';
      dueHours = 24; // Ideally dynamic based on meeting time, but 24h is a good default for prep
      taskType = 'MEETING_PREP';
    } else if (lead.salesStage === 'PROPOSAL_REQUESTED') {
      title = 'Prepare Proposal';
      description = 'Lead requested a proposal. Draft and send.';
      priority = 'HIGH';
      dueHours = 48;
      taskType = 'PROPOSAL_CREATION';
    } else {
      title = 'Warm Lead Follow-up';
      description = 'Follow up with warm lead within 48 hours.';
      priority = 'LOW';
      dueHours = 48;
      taskType = 'EMAIL_OUTREACH';
    }

    const dueAt = new Date();
    dueAt.setHours(dueAt.getHours() + dueHours);

    try {
      await prisma.eqoreSalesTask.create({
        data: {
          leadId: lead.id,
          opportunityId,
          ownerId,
          title,
          description,
          taskType,
          priority,
          dueAt,
          status: 'OPEN'
        }
      });
      logger.info(`Generated initial sales task for opportunity ${opportunityId}`);
    } catch (error) {
      logger.error('Failed to generate sales task:', error);
    }
  }

  static async createTask(data: any) {
    return prisma.eqoreSalesTask.create({ data });
  }

  static async updateTask(id: string, updates: any) {
    return prisma.eqoreSalesTask.update({
      where: { id },
      data: updates
    });
  }

  static async getTasksForLead(leadId: string) {
    return prisma.eqoreSalesTask.findMany({
      where: { leadId },
      orderBy: { dueAt: 'asc' }
    });
  }
}
