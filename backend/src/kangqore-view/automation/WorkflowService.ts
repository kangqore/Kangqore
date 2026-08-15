import { prisma } from '../../lib/prisma';
import { emailService } from '../../services/email.service';
import { webhookService } from '../eaf/scheduling/WebhookService';
import logger from '../../utils/logger';

export class WorkflowService {
  /**
   * Evaluate ON_BOOKED, BEFORE_EVENT, AFTER_EVENT workflows when an event is created.
   */
  async evaluateOnBookingCreated(eventId: string) {
    const event = await prisma.scheduledEvent.findUnique({
      where: { id: eventId },
      include: {
        eventType: true,
        invitees: true,
        host: true
      }
    });

    if (!event) return;

    // Find workflows for this eventType
    const workflows = await prisma.workflow.findMany({
      where: {
        eventTypeId: event.eventTypeId,
        isActive: true
      }
    });

    for (const workflow of workflows) {
      if (workflow.trigger === 'ON_BOOKED') {
        // Execute immediately
        await this.scheduleJob(workflow.id, event.id, new Date());
      } else if (workflow.trigger === 'BEFORE_EVENT') {
        // e.g. offsetMinutes = -1440 for 24 hours before
        if (workflow.offsetMinutes) {
          const scheduledTime = new Date(event.startTime.getTime() + workflow.offsetMinutes * 60000);
          if (scheduledTime > new Date()) {
            await this.scheduleJob(workflow.id, event.id, scheduledTime);
          } else {
            // Already past time, skip or execute immediately? Let's skip.
          }
        }
      } else if (workflow.trigger === 'AFTER_EVENT') {
        // e.g. offsetMinutes = 60 for 1 hour after
        if (workflow.offsetMinutes) {
          const scheduledTime = new Date(event.endTime.getTime() + workflow.offsetMinutes * 60000);
          await this.scheduleJob(workflow.id, event.id, scheduledTime);
        }
      }
    }
  }

  /**
   * Cancel pending jobs for this event
   */
  async cancelPendingJobs(eventId: string) {
    await prisma.workflowJob.updateMany({
      where: {
        eventId,
        status: 'PENDING'
      },
      data: {
        status: 'CANCELLED',
        resultLog: 'Event cancelled or rescheduled'
      }
    });
  }

  private async scheduleJob(workflowId: string, eventId: string, scheduledFor: Date) {
    await prisma.workflowJob.create({
      data: {
        workflowId,
        eventId,
        scheduledFor,
        status: 'PENDING'
      }
    });
  }

  /**
   * Execute a specific job (called by Cron)
   */
  async executeJob(jobId: string) {
    const job = await prisma.workflowJob.findUnique({
      where: { id: jobId },
      include: {
        workflow: true,
        event: {
          include: {
            invitees: true,
            host: true
          }
        }
      }
    });

    if (!job || job.status !== 'PENDING') return;

    // Check if event is still active
    if (job.event.status !== 'ACTIVE') {
      await prisma.workflowJob.update({
        where: { id: jobId },
        data: { status: 'CANCELLED', resultLog: 'Event is not ACTIVE' }
      });
      return;
    }

    const { workflow, event } = job;
    const invitee = event.invitees[0];
    const actionConfig = workflow.actionConfig as any || {};

    try {
      if (workflow.action === 'SEND_EMAIL') {
        if (!invitee) throw new Error('No invitee to email');
        
        // This relies on emailService templates or fallback.
        // For custom workflows we might use a generic sendEmail, but for now we'll route to a custom template.
        // Simulating a generic email send
        await emailService.sendBookingConfirmation({
          inviteeName: invitee.name,
          inviteeEmail: invitee.email,
          hostName: event.host.name,
          hostEmail: event.host.email,
          eventTypeId: event.eventTypeId,
          eventTitle: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          timezone: event.timezone,
          joinUrl: event.joinUrl || '',
          cancelToken: event.cancelToken || '',
          rescheduleToken: event.rescheduleToken || '',
          frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
        });

      } else if (workflow.action === 'CALL_WEBHOOK') {
        const payload = {
          eventId: event.id,
          workflowId: workflow.id,
          title: event.title,
          startTime: event.startTime,
          inviteeEmail: invitee?.email
        };
        await webhookService.dispatchEvent(event.eventTypeId, 'booking.created', payload);
      }

      await prisma.workflowJob.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', resultLog: 'Executed successfully' }
      });

    } catch (error: any) {
      logger.error(`WorkflowJob ${jobId} failed:`, error);
      await prisma.workflowJob.update({
        where: { id: jobId },
        data: { status: 'FAILED', resultLog: error.message }
      });
    }
  }
}

export const workflowService = new WorkflowService();
