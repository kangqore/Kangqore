import { prisma } from '../lib/prisma';
import { AvailabilityService } from './availability.service';
import { emailService } from './email.service';
import { createError } from '../middleware/errorHandler';
import { addMinutes, format } from 'date-fns';
import { randomBytes } from 'crypto';
import logger from '../utils/logger';

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

function generateJitsiUrl(eventId: string): string {
  // Jitsi Meet — no API key required, fully open
  const slug = `kangqore-${eventId.slice(-8)}`;
  return `https://meet.jit.si/${slug}`;
}

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

    // Verify slot is still available
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

    // Check scheduling link constraints if provided
    if (schedulingLinkId) {
      const link = await prisma.schedulingLink.findUnique({ where: { id: schedulingLinkId } });
      if (!link || !link.isActive) throw createError('Scheduling link is no longer active', 400);
      if (link.expiresAt && link.expiresAt < new Date()) throw createError('Scheduling link has expired', 400);
      if (link.maxUses && link.useCount >= link.maxUses) throw createError('Scheduling link has reached its maximum uses', 400);
    }

    const cancelToken = generateToken();
    const rescheduleToken = generateToken();

    // Generate Jitsi meet URL — created before DB insert so we can store it
    const tempId = randomBytes(4).toString('hex');
    const joinUrl = generateJitsiUrl(tempId);

    // Create event and invitee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.scheduledEvent.create({
        data: {
          eventTypeId,
          hostId: eventType.hostId,
          title: `${eventType.name} with ${invitee.name}`,
          startTime: start,
          endTime: end,
          timezone: invitee.timezone || 'Asia/Kolkata',
          locationType: eventType.locationType,
          locationValue: joinUrl,
          joinUrl,
          cancelToken,
          rescheduleToken,
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

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Send confirmation emails with .ics calendar invite
    try {
      await emailService.sendBookingConfirmation({
        inviteeName: invitee.name,
        inviteeEmail: invitee.email,
        hostName: result.host.name,
        hostEmail: result.host.email,
        eventTitle: result.title,
        startTime: start,
        endTime: end,
        timezone: invitee.timezone || 'Asia/Kolkata',
        joinUrl,
        cancelToken,
        rescheduleToken,
        frontendUrl
      });
    } catch (err) {
      logger.error('Failed to send booking confirmation emails', err);
    }

    return {
      ...result,
      cancelLink: `${frontendUrl}/booking/cancel/${cancelToken}`,
      rescheduleLink: `${frontendUrl}/booking/reschedule/${rescheduleToken}`
    };
  }

  /**
   * Cancel an event by ID (authenticated — host/admin)
   */
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

    try {
      if (event.invitees.length > 0) {
        const invitee = event.invitees[0];
        await emailService.sendCancelNotification({
          inviteeName: invitee.name,
          inviteeEmail: invitee.email,
          hostEmail: event.host.email,
          eventTitle: event.title,
          startTime: event.startTime,
          cancelReason: reason,
          cancelledBy
        });
      }
    } catch (err) {
      logger.error('Failed to send cancellation emails', err);
    }

    return event;
  }

  /**
   * Cancel an event by public token (no auth required)
   */
  static async cancelByToken(token: string, reason?: string) {
    const event = await prisma.scheduledEvent.findUnique({
      where: { cancelToken: token },
      include: { invitees: true, host: true }
    });

    if (!event) throw createError('Invalid or expired cancel link', 404);
    if (event.status !== 'ACTIVE') throw createError('This meeting has already been cancelled or completed', 400);

    return this.cancelEvent(event.id, reason || 'Cancelled by attendee', 'invitee');
  }

  /**
   * Get event details for rescheduling by token
   */
  static async getEventByRescheduleToken(token: string) {
    const event = await prisma.scheduledEvent.findUnique({
      where: { rescheduleToken: token },
      include: {
        invitees: true,
        host: { select: { id: true, name: true, email: true } },
        eventType: true
      }
    });

    if (!event) throw createError('Invalid or expired reschedule link', 404);
    if (event.status !== 'ACTIVE') throw createError('This meeting cannot be rescheduled', 400);

    return event;
  }

  /**
   * Reschedule an event by public token
   */
  static async rescheduleByToken(token: string, newStartTime: string) {
    const oldEvent = await this.getEventByRescheduleToken(token);
    const invitee = oldEvent.invitees[0];
    if (!invitee) throw createError('No invitee found for this event', 400);

    const newStart = new Date(newStartTime);
    const newEnd = addMinutes(newStart, oldEvent.eventType.duration);

    // Verify new slot is available
    const slots = await AvailabilityService.getAvailableSlots(
      oldEvent.eventTypeId,
      newStart,
      newEnd,
      invitee.timezone || 'UTC'
    );

    const isAvailable = slots.some(s => s.startTime.getTime() === newStart.getTime());
    if (!isAvailable) throw createError('The selected time slot is no longer available', 400);

    const newCancelToken = generateToken();
    const newRescheduleToken = generateToken();
    const newJoinUrl = generateJitsiUrl(randomBytes(4).toString('hex'));
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const newEvent = await prisma.$transaction(async (tx) => {
      // Cancel the old event
      await tx.scheduledEvent.update({
        where: { id: oldEvent.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: 'invitee',
          cancelReason: 'Rescheduled by attendee'
        }
      });

      // Create the rescheduled event
      return tx.scheduledEvent.create({
        data: {
          eventTypeId: oldEvent.eventTypeId,
          hostId: oldEvent.hostId,
          title: oldEvent.title,
          startTime: newStart,
          endTime: newEnd,
          timezone: invitee.timezone || 'Asia/Kolkata',
          locationType: oldEvent.locationType,
          locationValue: newJoinUrl,
          joinUrl: newJoinUrl,
          cancelToken: newCancelToken,
          rescheduleToken: newRescheduleToken,
          rescheduledFrom: oldEvent.id,
          invitees: {
            create: {
              name: invitee.name,
              email: invitee.email,
              phone: invitee.phone,
              company: invitee.company,
              timezone: invitee.timezone
            }
          }
        },
        include: { invitees: true, host: true, eventType: true }
      });
    });

    try {
      await emailService.sendBookingConfirmation({
        inviteeName: invitee.name,
        inviteeEmail: invitee.email,
        hostName: newEvent.host.name,
        hostEmail: newEvent.host.email,
        eventTitle: `[Rescheduled] ${newEvent.title}`,
        startTime: newStart,
        endTime: newEnd,
        timezone: invitee.timezone || 'Asia/Kolkata',
        joinUrl: newJoinUrl,
        cancelToken: newCancelToken,
        rescheduleToken: newRescheduleToken,
        frontendUrl
      });
    } catch (err) {
      logger.error('Failed to send reschedule confirmation emails', err);
    }

    return {
      ...newEvent,
      cancelLink: `${frontendUrl}/booking/cancel/${newCancelToken}`,
      rescheduleLink: `${frontendUrl}/booking/reschedule/${newRescheduleToken}`
    };
  }
}
