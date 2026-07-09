import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { AccountabilityService } from '../services/AccountabilityService';
import { emailService } from '../services/email.service';
import { smsService } from '../services/sms.service';
import { WorkflowExecutor } from './WorkflowExecutor';
import { addMinutes, addHours } from 'date-fns';
import logger from '../utils/logger';
import { createNotification } from '../services/notificationService';
import { notifyClient } from '../services/clientEmail.service';

const accountabilityService = new AccountabilityService();

export class CronManager {

  static initialize() {
    console.log('⏰ Initializing Cron Jobs...');
    this.scheduleNightlySnapshots();
    this.scheduleOverdueMonitor();
    this.scheduleImpactAccrual();
    this.scheduleMeetingReminders();
    this.scheduleWorkflowExecutor();
    this.scheduleInvoiceNotifications();
    this.scheduleProjectOpsHealthSweep();
  }

  /**
   * Run every 15 minutes to process workflow jobs
   */
  private static scheduleWorkflowExecutor() {
    cron.schedule('*/15 * * * *', async () => {
      try {
        await WorkflowExecutor.run();
      } catch (err) {
        console.error('❌ Error in Workflow Executor:', err);
      }
    });
    console.log('   -> Workflow Executor scheduled (Every 15m)');
  }

  /**
   * Run nightly at 23:30
   */
  private static scheduleImpactAccrual() {
    cron.schedule('30 23 * * *', async () => {
      try {
        await accountabilityService.processDailyImpactAccruals();
      } catch (err) {
        console.error('❌ Error in Impact Accrual:', err);
      }
    });
    console.log('   -> Impact Accrual scheduled (23:30 Daily)');
  }

  /**
   * Run hourly to check for overdue items
   */
  private static scheduleOverdueMonitor() {
    cron.schedule('0 * * * *', async () => {
      try {
        await accountabilityService.checkOverdueObligations();
      } catch (err) {
        console.error('❌ Error in Overdue Monitor:', err);
      }
    });
    console.log('   -> Overdue Monitor scheduled (Hourly)');
  }

  /**
   * Run nightly at 00:00 (Midnight)
   */
  private static scheduleNightlySnapshots() {
    cron.schedule('0 0 * * *', async () => {
      console.log('🌙 Starting Nightly Accountability Snapshot Job...');
      try {
        const projects = await prisma.project.findMany({
          where: { status: 'ACTIVE' },
          select: { id: true, title: true, clientId: true }
        });

        console.log(`📋 Found ${projects.length} active projects for snapshot generation.`);

        for (const project of projects) {
          try {
            await accountabilityService.generateDailySnapshot(project.id, project.clientId);
            console.log(`✅ Snapshot generated for project: ${project.title}`);
          } catch (err) {
            console.error(`❌ Failed to generate snapshot for project ${project.title}:`, err);
          }
        }

        console.log('🌙 Nightly Accountability Snapshot Job Completed.');
      } catch (error) {
        console.error('❌ Critical error in Nightly Snapshot Job:', error);
      }
    });
    console.log('   -> Nightly Snapshot Job scheduled (00:00 Daily)');
  }

  /**
   * Every 15 minutes — send 24h and 1h pre-meeting reminders.
   * Uses reminderSent24h / reminderSent1h flags to prevent duplicates.
   */
  private static scheduleMeetingReminders() {
    cron.schedule('*/15 * * * *', async () => {
      try {
        const now = new Date();

        // Find events that start within 23h45m – 24h15m (24h window, ±15 min)
        const upcoming24h = await prisma.scheduledEvent.findMany({
          where: {
            status: 'ACTIVE',
            reminderSent24h: false,
            startTime: {
              gte: addMinutes(addHours(now, 23), 45),
              lte: addMinutes(addHours(now, 24), 15)
            }
          },
          include: { invitees: true, host: true }
        });

        for (const event of upcoming24h) {
          const invitee = event.invitees[0];
          if (!invitee) continue;
          try {
            await emailService.sendReminderEmail({
              inviteeName: invitee.name,
              inviteeEmail: invitee.email,
              hostEmail: event.host.email,
              eventTypeId: event.eventTypeId,
              eventTitle: event.title,
              startTime: event.startTime,
              joinUrl: event.joinUrl || undefined,
              minutesBefore: 1440
            });
            await prisma.scheduledEvent.update({
              where: { id: event.id },
              data: { reminderSent24h: true }
            });
            
            if (invitee.phone && invitee.smsOptIn) {
              const smsMessage = `Reminder: Your meeting "${event.title}" is in 24 hours at ${event.startTime}.`;
              await smsService.sendReminderSms(invitee.phone, smsMessage);
            }
            
            logger.info(`24h reminder sent for event ${event.id}`);
          } catch (err) {
            logger.error(`Failed to send 24h reminder for event ${event.id}`, err);
          }
        }

        // Find events that start within 45m – 1h15m (1h window, ±15 min)
        const upcoming1h = await prisma.scheduledEvent.findMany({
          where: {
            status: 'ACTIVE',
            reminderSent1h: false,
            startTime: {
              gte: addMinutes(now, 45),
              lte: addMinutes(now, 75)
            }
          },
          include: { invitees: true, host: true }
        });

        for (const event of upcoming1h) {
          const invitee = event.invitees[0];
          if (!invitee) continue;
          try {
            await emailService.sendReminderEmail({
              inviteeName: invitee.name,
              inviteeEmail: invitee.email,
              hostEmail: event.host.email,
              eventTypeId: event.eventTypeId,
              eventTitle: event.title,
              startTime: event.startTime,
              joinUrl: event.joinUrl || undefined,
              minutesBefore: 60
            });
            await prisma.scheduledEvent.update({
              where: { id: event.id },
              data: { reminderSent1h: true }
            });
            
            if (invitee.phone && invitee.smsOptIn) {
              const smsMessage = `Reminder: Your meeting "${event.title}" is in 1 hour. ${event.joinUrl ? `Join: ${event.joinUrl}` : ''}`;
              await smsService.sendReminderSms(invitee.phone, smsMessage);
            }

            logger.info(`1h reminder sent for event ${event.id}`);
          } catch (err) {
            logger.error(`Failed to send 1h reminder for event ${event.id}`, err);
          }
        }
      } catch (err) {
        logger.error('Error in Meeting Reminder job', err);
      }
    });
    console.log('   -> Meeting Reminders scheduled (every 15 min — 24h + 1h pre-meeting)');
  }

  /**
   * Run daily at 08:00 — notify clients about invoices due in 3 days and mark/notify overdue.
   */
  private static scheduleInvoiceNotifications() {
    cron.schedule('0 8 * * *', async () => {
      try {
        const now = new Date();
        const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const in4Days = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

        // Due-in-3-days: window between 3d and 4d out to avoid re-notifying daily
        const dueSoon = await prisma.invoice.findMany({
          where: {
            status: { notIn: ['PAID', 'CANCELLED', 'DRAFT'] },
            dueDate: { gte: in3Days, lt: in4Days },
          },
          select: { id: true, invoiceNumber: true, clientId: true, dueDate: true },
        });

        for (const inv of dueSoon) {
          await createNotification({
            userId: inv.clientId,
            title: 'Invoice due in 3 days',
            message: `Invoice ${inv.invoiceNumber} is due on ${new Date(inv.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}.`,
            type: 'WARNING',
            link: '/kangqore-view/client/invoices',
          });
          await notifyClient(inv.clientId, {
            type: 'INVOICE_DUE',
            invoiceNumber: inv.invoiceNumber,
            dueDate: new Date(inv.dueDate),
          });
        }

        // Overdue: dueDate in the past, still unpaid — notify once (today they crossed the line)
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const nowOverdue = await prisma.invoice.findMany({
          where: {
            status: { notIn: ['PAID', 'CANCELLED', 'DRAFT', 'OVERDUE'] },
            dueDate: { gte: yesterday, lt: now },
          },
          select: { id: true, invoiceNumber: true, clientId: true },
        });

        for (const inv of nowOverdue) {
          await prisma.invoice.update({ where: { id: inv.id }, data: { status: 'OVERDUE' } });
          await createNotification({
            userId: inv.clientId,
            title: 'Invoice overdue',
            message: `Invoice ${inv.invoiceNumber} is now overdue. Please arrange payment.`,
            type: 'ERROR',
            link: '/kangqore-view/client/invoices',
          });
          await notifyClient(inv.clientId, {
            type: 'INVOICE_OVERDUE',
            invoiceNumber: inv.invoiceNumber,
          });
        }

        if (dueSoon.length + nowOverdue.length > 0) {
          console.log(`   -> Invoice notifications: ${dueSoon.length} due-soon, ${nowOverdue.length} overdue`);
        }
      } catch (err) {
        console.error('❌ Error in Invoice Notifications:', err);
      }
    });
    console.log('   -> Invoice Notifications scheduled (08:00 Daily)');
  }

  /**
   * Daily 07:00 — sweep all active projects for health scores (Gate 8 Mission 1 feed)
   */
  private static scheduleProjectOpsHealthSweep() {
    cron.schedule('0 7 * * *', async () => {
      try {
        const { sweepAllProjects } = await import('../scripts/gate8/projectOps.service')
        const result = await sweepAllProjects()
        logger.info(`[CronManager] Project health sweep: ${result.assessed} projects, avg health ${result.avgHealth}`)
      } catch (err) {
        console.error('❌ Error in Project Ops Health Sweep:', err)
      }
    })
    console.log('   -> Project Ops Health Sweep scheduled (07:00 Daily)')
  }
}
