import * as chrono from 'chrono-node';
import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { AvailabilityService, TimeSlot } from '../../kangqore-view/eaf/scheduling/AvailabilityService';
import { EqoreSchedulingStatus } from '@prisma/client';
import { addDays, startOfDay, endOfDay, format } from 'date-fns';

export interface SchedulingRecommendation {
  schedulingIntent: boolean;
  rawTimeText?: string;
  parsedWindow?: { start: Date; end: Date };
  offeredSlots: { id: string; label: string; start: Date; end: Date }[];
  status: EqoreSchedulingStatus;
}

export class EqoreSchedulingAgentService {
  private static DEFAULT_EVENT_TYPE_SLUG = process.env.EQORE_DEFAULT_EVENT_TYPE_SLUG || 'eqore-executive-consultation-30';
  private static DEFAULT_TIMEZONE = 'Asia/Kolkata';

  /**
   * Main entry point to process a lead's message for scheduling intent.
   */
  static async processSchedulingIntent(leadId: string, message: string): Promise<SchedulingRecommendation | null> {
    try {
      // 1. Detect Intent & Parse Time
      const results = chrono.parse(message);
      if (results.length === 0) {
        // Fallback: check for explicit but non-dated intent like "I want to talk"
        const explicitKeywords = ['schedule', 'book', 'talk', 'meet', 'consultation', 'appointment', 'call'];
        const hasExplicitIntent = explicitKeywords.some(k => message.toLowerCase().includes(k));
        
        if (!hasExplicitIntent) return null;

        // If intent but no date, we might suggest "next week" as a default to explore
        return {
          schedulingIntent: true,
          status: 'INTERESTED',
          offeredSlots: []
        };
      }

      const parsedDate = results[0].start.date();
      const rawText = results[0].text;

      // 2. Define search window
      // If user says "tomorrow", we look at that day. 
      // If user says "next week", chrono usually gives a start date, we'll look 7 days from there.
      const windowStart = parsedDate;
      const windowEnd = addDays(parsedDate, 1); // Default to a 24h window for specific mentions

      // 3. Fetch default event type
      const eventType = await prisma.eventType.findUnique({
        where: { slug: this.DEFAULT_EVENT_TYPE_SLUG }
      });

      if (!eventType) {
        logger.error(`EqoreSchedulingAgent: Default event type ${this.DEFAULT_EVENT_TYPE_SLUG} not found.`);
        return null;
      }

      // 4. Get Availability
      const availableSlots = await AvailabilityService.getAvailableSlots(
        eventType.id,
        windowStart,
        windowEnd,
        this.DEFAULT_TIMEZONE
      );

      // 5. Rank and Select Top 3
      const selectedSlots = this.rankSlots(availableSlots).slice(0, 3);

      const recommendation: SchedulingRecommendation = {
        schedulingIntent: true,
        rawTimeText: rawText,
        parsedWindow: { start: windowStart, end: windowEnd },
        offeredSlots: selectedSlots.map((s, i) => ({
          id: `slot_${i + 1}`,
          label: format(s.startTime, 'EEEE, MMM do @ h:mm a'),
          start: s.startTime,
          end: s.endTime
        })),
        status: selectedSlots.length > 0 ? 'SLOT_OFFERED' : 'NEGOTIATING'
      };

      // 6. Update Lead State
      await prisma.eqoreLead.update({
        where: { id: leadId },
        data: {
          schedulingStatus: recommendation.status,
          preferredConsultationTime: rawText,
          parsedConsultationWindow: { start: windowStart, end: windowEnd } as any,
          offeredSlots: recommendation.offeredSlots as any,
          lastSchedulingIntentAt: new Date()
        }
      });

      return recommendation;
    } catch (error) {
      logger.error('EqoreSchedulingAgent.processSchedulingIntent failed:', error);
      return null;
    }
  }

  /**
   * Ranks slots to provide the most 'strategic' options.
   * V1: Simply takes the earliest available slots that aren't too soon.
   */
  private static rankSlots(slots: TimeSlot[]): TimeSlot[] {
    return slots
      .filter(s => s.isAvailable)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  /**
   * Finalizes a booking for a selected slot.
   */
  static async confirmBooking(leadId: string, slotId: string) {
    const lead = await prisma.eqoreLead.findUnique({
      where: { id: leadId }
    });

    if (!lead || !lead.offeredSlots) throw new Error('Lead or offered slots not found');

    const slots = lead.offeredSlots as any[];
    const selectedSlot = slots.find(s => s.id === slotId);

    if (!selectedSlot) throw new Error('Invalid slot selection');

    // Collect host from config/DB
    const eventType = await prisma.eventType.findUnique({
      where: { slug: this.DEFAULT_EVENT_TYPE_SLUG }
    });
    if (!eventType) throw new Error('Default event type not found');

    // Import SchedulingService dynamically to avoid circular dependencies if any
    const { SchedulingService } = await import('../../kangqore-view/eaf/scheduling/SchedulingService');

    // Race-condition check: ensure the slot is still available right before booking
    const availableSlots = await AvailabilityService.getAvailableSlots(eventType.id, new Date(selectedSlot.start), new Date(selectedSlot.end));
    const isStillAvailable = availableSlots.some(
      (s: TimeSlot) => s.startTime.getTime() === new Date(selectedSlot.start).getTime()
    );

    if (!isStillAvailable) {
      throw new Error('This time slot has just been booked. Please select a different time.');
    }

    const bookingResult = await SchedulingService.bookEvent({
      eventTypeId: eventType.id,
      startTime: selectedSlot.start,
      invitee: {
        name: lead.name || 'eQORE Lead',
        email: lead.email!,
        company: lead.companyName || undefined,
        timezone: lead.consultationTimezone || this.DEFAULT_TIMEZONE
      }
    });

    // Update Lead
    await prisma.eqoreLead.update({
      where: { id: leadId },
      data: {
        schedulingStatus: 'BOOKED',
        scheduledEventId: bookingResult.id,
        selectedSlot: selectedSlot as any
      }
    });

    return bookingResult;
  }
}
