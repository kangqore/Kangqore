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
import { CalendarSyncService } from './calendarSync.service';

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  availableUserIds: string[];
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
   * Handles Round-Robin, Collective, and Host-Pick strategies.
   */
  static async getAvailableSlots(
    eventTypeId: string,
    rangeStart: Date,
    rangeEnd: Date,
    viewerTimezone: string = 'UTC',
    requestedDuration?: number,
    specificHostId?: string
  ): Promise<TimeSlot[]> {
    const eventType = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
      include: {
        host: true,
        teamMembers: true
      }
    });

    if (!eventType) throw new Error('Event type not found');

    const durationToUse = requestedDuration || eventType.duration;
    const strategy = eventType.assignmentStrategy;

    let userIdsToCheck: string[] = [];

    if (strategy === 'SINGLE_HOST') {
      userIdsToCheck = [eventType.hostId];
    } else if (strategy === 'HOST_PICK' && specificHostId) {
      userIdsToCheck = [specificHostId];
    } else {
      userIdsToCheck = eventType.teamMembers.map(tm => tm.userId);
      if (userIdsToCheck.length === 0) userIdsToCheck = [eventType.hostId];
    }

    // Get slots for each user
    const userSlotsPromises = userIdsToCheck.map(userId => 
      this.getAvailableSlotsForUser(userId, eventType, rangeStart, rangeEnd, durationToUse)
    );

    const allUserSlots = await Promise.all(userSlotsPromises);

    if (allUserSlots.length === 0) return [];

    if (strategy === 'COLLECTIVE') {
      // Intersection: Slot must exist in ALL users' slot lists
      const firstUserSlots = allUserSlots[0];
      return firstUserSlots.filter(slot1 => {
        // Check if this exact slot exists for all other users
        return allUserSlots.every(otherSlots => 
          otherSlots.some(slot2 => slot1.startTime.getTime() === slot2.startTime.getTime())
        );
      }).map(slot => ({ ...slot, availableUserIds: userIdsToCheck }));
    } else {
      // Union: ROUND_ROBIN, HOST_PICK, or SINGLE_HOST
      // Merge and deduplicate slots
      const slotMap = new Map<number, TimeSlot>();
      for (let i = 0; i < allUserSlots.length; i++) {
        const slots = allUserSlots[i];
        const userId = userIdsToCheck[i];
        for (const slot of slots) {
          const time = slot.startTime.getTime();
          if (slotMap.has(time)) {
            slotMap.get(time)!.availableUserIds.push(userId);
          } else {
            slotMap.set(time, { ...slot, availableUserIds: [userId] });
          }
        }
      }
      return Array.from(slotMap.values()).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }
  }

  private static async getAvailableSlotsForUser(
    userId: string,
    eventType: any,
    rangeStart: Date,
    rangeEnd: Date,
    durationToUse: number
  ): Promise<TimeSlot[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        availabilitySchedules: {
          where: { isDefault: true }
        }
      }
    });

    if (!user) return [];
    const schedule = user.availabilitySchedules[0];
    if (!schedule) return [];

    const hostTimezone = schedule.timezone || 'UTC';
    const rules = schedule.rules as unknown as WeeklyRule[];
    const overrides = (schedule.overrides as unknown as DateOverride[]) || [];

    const internalBusyEvents = await prisma.scheduledEvent.findMany({
      where: {
        hostId: userId,
        status: 'ACTIVE',
        startTime: { gte: rangeStart },
        endTime: { lte: addMinutes(rangeEnd, eventType.bufferAfter) }
      }
    });

    const externalBusySlots = await CalendarSyncService.getExternalBusySlots(userId, rangeStart, rangeEnd);
    
    const busyEvents = [
      ...internalBusyEvents,
      ...externalBusySlots.map(slot => ({
        startTime: slot.start,
        endTime: slot.end
      }))
    ];

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

        while (isBefore(addMinutes(currentSlotStart, durationToUse), ruleEnd) ||
               addMinutes(currentSlotStart, durationToUse).getTime() === ruleEnd.getTime()) {
          const slotEnd = addMinutes(currentSlotStart, durationToUse);

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
              isAvailable: true,
              availableUserIds: [userId]
            });
          }

          currentSlotStart = addMinutes(currentSlotStart, 15);
        }
      }
    }

    return allSlots;
  }

  static async getDateAvailability(
    eventTypeId: string,
    rangeStart: Date,
    rangeDays: number,
    viewerTimezone: string = 'UTC',
    requestedDuration?: number,
    specificHostId?: string
  ): Promise<DateAvailability[]> {
    const rangeEnd = addDays(rangeStart, rangeDays);
    const slots = await this.getAvailableSlots(eventTypeId, rangeStart, rangeEnd, viewerTimezone, requestedDuration, specificHostId);

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
