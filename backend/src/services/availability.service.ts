import { prisma } from '../lib/prisma';
import {
  addMinutes,
  format,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  getDay,
  addDays
} from 'date-fns';
import { toDate } from 'date-fns-tz';

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

export interface DateAvailability {
  date: string; // "YYYY-MM-DD"
  availableCount: number;
  isWeekend: boolean;
}

export class AvailabilityService {
  /**
   * Get available slots for an event type in a given date range.
   * Enforces minNotice, buffer before/after, and maxPerDay.
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

    // Get all busy events (existing booked events in the range, with buffer)
    const busyEvents = await prisma.scheduledEvent.findMany({
      where: {
        hostId: host.id,
        status: 'ACTIVE',
        startTime: { gte: rangeStart },
        endTime: { lte: addMinutes(rangeEnd, eventType.bufferAfter) }
      }
    });

    const daysInRange = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
    const allSlots: TimeSlot[] = [];
    const now = new Date();

    for (const day of daysInRange) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayOfWeek = getDay(day);

      const override = overrides.find(o => o.date === dateStr);

      let dayRules: WeeklyRule[] = [];
      if (override) {
        if (!override.available) continue;
        if (override.startTime && override.endTime) {
          dayRules = [{ day: dayOfWeek, startTime: override.startTime, endTime: override.endTime }];
        }
      } else {
        dayRules = rules.filter(r => r.day === dayOfWeek);
      }

      if (dayRules.length === 0) continue;

      // Enforce maxPerDay — count already-booked events on this day
      if (eventType.maxPerDay !== null && eventType.maxPerDay !== undefined) {
        const dayStart = startOfDay(day);
        const dayEnd = endOfDay(day);
        const bookedToday = busyEvents.filter(e =>
          new Date(e.startTime) >= dayStart && new Date(e.startTime) <= dayEnd
        ).length;
        if (bookedToday >= eventType.maxPerDay) continue;
      }

      for (const rule of dayRules) {
        let currentSlotStart = toDate(`${dateStr}T${rule.startTime}:00`, { timeZone: hostTimezone });
        const ruleEnd = toDate(`${dateStr}T${rule.endTime}:00`, { timeZone: hostTimezone });

        while (isBefore(addMinutes(currentSlotStart, eventType.duration), ruleEnd) ||
               addMinutes(currentSlotStart, eventType.duration).getTime() === ruleEnd.getTime()) {
          const slotEnd = addMinutes(currentSlotStart, eventType.duration);

          const isBusy = this.isSlotBusy(
            currentSlotStart,
            slotEnd,
            busyEvents,
            eventType.bufferBefore,
            eventType.bufferAfter
          );

          const isTooSoon = isBefore(currentSlotStart, addMinutes(now, eventType.minNotice));

          if (!isBusy && !isTooSoon) {
            allSlots.push({
              startTime: currentSlotStart,
              endTime: slotEnd,
              isAvailable: true
            });
          }

          currentSlotStart = addMinutes(currentSlotStart, 15);
        }
      }
    }

    return allSlots;
  }

  /**
   * Returns per-day availability summary for a date range.
   * Used by the frontend date picker to show which days have open slots.
   */
  static async getDateAvailability(
    eventTypeId: string,
    rangeStart: Date,
    rangeDays: number,
    viewerTimezone: string = 'UTC'
  ): Promise<DateAvailability[]> {
    const rangeEnd = addDays(rangeStart, rangeDays);
    const slots = await this.getAvailableSlots(eventTypeId, rangeStart, rangeEnd, viewerTimezone);

    const countByDate: Record<string, number> = {};
    for (const slot of slots) {
      const key = format(slot.startTime, 'yyyy-MM-dd');
      countByDate[key] = (countByDate[key] || 0) + 1;
    }

    const days = eachDayOfInterval({ start: rangeStart, end: addDays(rangeEnd, -1) });
    return days.map(d => ({
      date: format(d, 'yyyy-MM-dd'),
      availableCount: countByDate[format(d, 'yyyy-MM-dd')] || 0,
      isWeekend: getDay(d) === 0 || getDay(d) === 6
    }));
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
      return isBefore(start, eventEndWithBuffer) && isAfter(end, eventStartWithBuffer);
    });
  }
}
