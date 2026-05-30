import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { AccountabilityService } from '../services/AccountabilityService';
import { emailService } from '../services/email.service';
import { smsService } from '../services/sms.service';
import { addMinutes, addHours, addDays } from 'date-fns';
import logger from '../utils/logger';

const accountabilityService = new AccountabilityService();

export class CronManager {

  static initialize() {
    console.log('⏰ Initializing Cron Jobs...');
    this.scheduleNightlySnapshots();
    this.scheduleOverdueMonitor();
    this.scheduleImpactAccrual();
    this.scheduleMeetingReminders();
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
}
