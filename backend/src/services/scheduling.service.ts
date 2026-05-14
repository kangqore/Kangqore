import { prisma } from '../lib/prisma';
import { AvailabilityService } from './availability.service';
import { emailService } from './email.service';
import { createError } from '../middleware/errorHandler';
import { addMinutes, format } from 'date-fns';
import logger from '../utils/logger';

export class SchedulingService {
  /**
   * Book an event from a public request
   */
  static async bookEvent(data: {
    eventTypeId: string;
    startTime: string;
    invitee: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      timezone?: string;
      responses?: any;
    };
    schedulingLinkId?: string;
  }) {
    const { eventTypeId, startTime, invitee, schedulingLinkId } = data;

    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: { host: true }
    });

    if (!eventType) throw createError('Event type not found', 404);

    const start = new Date(startTime);
    const end = addMinutes(start, eventType.duration);

    // 1. Verify slot is still available
    const slots = await AvailabilityService.getAvailableSlots(
      eventTypeId,
      start,
      end,
      invitee.timezone || 'UTC'
    );

    const isAvailable = slots.some(s => s.startTime.getTime() === start.getTime());
    if (!isAvailable) {
      throw createError('This time slot is no longer available', 400);
    }

    // 2. Check scheduling link constraints if provided
    if (schedulingLinkId) {
      const link = await prisma.schedulingLink.findUnique({
        where: { id: schedulingLinkId }
      });
      if (!link || !link.isActive) throw createError('Scheduling link is no longer active', 400);
      if (link.expiresAt && link.expiresAt < new Date()) throw createError('Scheduling link has expired', 400);
      if (link.maxUses && link.useCount >= link.maxUses) throw createError('Scheduling link has reached its maximum uses', 400);
    }

    // 3. Create event and invitee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.scheduledEvent.create({
        data: {
          eventTypeId,
          hostId: eventType.hostId,
          title: `${eventType.name} with ${invitee.name}`,
          startTime: start,
          endTime: end,
          locationType: eventType.locationType,
          locationValue: eventType.location,
          schedulingLinkId,
          invitees: {
            create: {
              name: invitee.name,
              email: invitee.email,
              phone: invitee.phone,
              company: invitee.company,
              timezone: invitee.timezone,
              responses: invitee.responses
            }
          }
        },
        include: {
          invitees: true,
          host: true,
          eventType: true
        }
      });

      if (schedulingLinkId) {
        await tx.schedulingLink.update({
          where: { id: schedulingLinkId },
          data: { useCount: { increment: 1 } }
        });
      }

      return event;
    });

    // 4. Send emails
    try {
      await emailService.sendEmail({
        to: invitee.email,
        subject: `Confirmed: ${result.title}`,
        text: `Your meeting has been scheduled for ${format(start, 'PPPP p')}.`,
        html: `<h1>Meeting Confirmed</h1><p>Your meeting <strong>${result.title}</strong> is scheduled for ${format(start, 'PPPP p')}.</p>`
      });

      await emailService.sendEmail({
        to: result.host.email,
        subject: `New Meeting: ${result.title}`,
        text: `${invitee.name} has scheduled a meeting for ${format(start, 'PPPP p')}.`,
        html: `<h1>New Meeting Scheduled</h1><p><strong>${invitee.name}</strong> (${invitee.email}) has scheduled <strong>${eventType.name}</strong> for ${format(start, 'PPPP p')}.</p>`
      });
    } catch (err) {
      logger.error('Failed to send scheduling confirmation emails', err);
    }

    return result;
  }

  static async cancelEvent(eventId: string, reason?: string, cancelledBy: 'host' | 'invitee' = 'host') {
    const event = await prisma.scheduledEvent.update({
      where: { id: eventId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy,
        cancelReason: reason
      },
      include: { invitees: true, host: true }
    });

    // Notify participants
    // ... email notifications ...

    return event;
  }
}
