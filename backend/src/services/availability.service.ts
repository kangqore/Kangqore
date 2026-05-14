import { prisma } from '../lib/prisma';
import { 
  addMinutes, 
  format, 
  parse, 
  isBefore, 
  isAfter, 
  startOfDay, 
  endOfDay, 
  eachDayOfInterval,
  getDay,
  parseISO
} from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface WeeklyRule {
  day: number; // 0-6 (Sun-Sat)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface DateOverride {
  date: string; // "2026-05-10"
  available: boolean;
  startTime?: string;
  endTime?: string;
}

export class AvailabilityService {
  /**
   * Get available slots for an event type in a given date range
   */
  static async getAvailableSlots(
    eventTypeId: string,
    rangeStart: Date,
    rangeEnd: Date,
    viewerTimezone: string = 'UTC'
  ): Promise<TimeSlot[]> {
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        host: {
          include: {
            availabilitySchedules: {
              where: { isDefault: true }
            }
          }
        }
      }
    });

    if (!eventType) throw new Error('Event type not found');
    
    const host = eventType.host;
    const schedule = host.availabilitySchedules[0];
    if (!schedule) throw new Error('Host has no availability schedule');

    const hostTimezone = schedule.timezone || 'UTC';
    const rules = schedule.rules as unknown as WeeklyRule[];
    const overrides = (schedule.overrides as unknown as DateOverride[]) || [];

    // 1. Get all busy times (existing events)
    const busyEvents = await prisma.scheduledEvent.findMany({
      where: {
        hostId: host.id,
        status: 'ACTIVE',
        startTime: { gte: rangeStart },
        endTime: { lte: addMinutes(rangeEnd, eventType.bufferAfter) }
      }
    });

    // 2. Generate all possible days in range
    const daysInRange = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
    const allSlots: TimeSlot[] = [];

    for (const day of daysInRange) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayOfWeek = getDay(day);

      // Check for overrides first
      const override = overrides.find(o => o.date === dateStr);
      
      let dayRules: WeeklyRule[] = [];
      if (override) {
        if (!override.available) continue; // Full day off
        if (override.startTime && override.endTime) {
          dayRules = [{ day: dayOfWeek, startTime: override.startTime, endTime: override.endTime }];
        }
      } else {
        dayRules = rules.filter(r => r.day === dayOfWeek);
      }

      if (dayRules.length === 0) continue;

      for (const rule of dayRules) {
        const [startHour, startMin] = rule.startTime.split(':').map(Number);
        const [endHour, endMin] = rule.endTime.split(':').map(Number);

        // Create start/end for this rule in host timezone
        let currentSlotStart = toDate(`${dateStr}T${rule.startTime}:00`, { timeZone: hostTimezone });
        const ruleEnd = toDate(`${dateStr}T${rule.endTime}:00`, { timeZone: hostTimezone });

        while (isBefore(addMinutes(currentSlotStart, eventType.duration), ruleEnd)) {
          const slotEnd = addMinutes(currentSlotStart, eventType.duration);
          
          // Check constraints
          const isBusy = this.isSlotBusy(
            currentSlotStart, 
            slotEnd, 
            busyEvents, 
            eventType.bufferBefore, 
            eventType.bufferAfter
          );
          
          const isTooSoon = isBefore(currentSlotStart, addMinutes(new Date(), eventType.minNotice));

          if (!isBusy && !isTooSoon) {
            allSlots.push({
              startTime: currentSlotStart,
              endTime: slotEnd,
              isAvailable: true
            });
          }

          // Move to next slot (increments of 15 or duration?) 
          // Calendly usually uses increments, let's use 15 for flexibility
          currentSlotStart = addMinutes(currentSlotStart, 15);
        }
      }
    }

    return allSlots;
  }

  private static isSlotBusy(
    start: Date, 
    end: Date, 
    busyEvents: any[], 
    bufferBefore: number, 
    bufferAfter: number
  ): boolean {
    return busyEvents.some(event => {
      const eventStartWithBuffer = addMinutes(new Date(event.startTime), -bufferBefore);
      const eventEndWithBuffer = addMinutes(new Date(event.endTime), bufferAfter);
      
      // Overlap detection
      return (isBefore(start, eventEndWithBuffer) && isAfter(end, eventStartWithBuffer));
    });
  }
}
