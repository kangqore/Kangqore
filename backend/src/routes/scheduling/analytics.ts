import { Router, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';

const router = Router();

/**
 * GET /api/scheduling/analytics
 * Get scheduling KPI metrics, time-series data, and heatmap for the current user (host).
 */
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const days = parseInt(req.query.days as string) || 30;
    
    const startDate = startOfDay(subDays(new Date(), days - 1));
    const endDate = endOfDay(new Date());

    // Get all events for the host in the date range
    const events = await prisma.scheduledEvent.findMany({
      where: {
        hostId: userId,
        startTime: { gte: startDate, lte: endDate }
      },
      include: {
        eventType: { select: { name: true } },
        noShows: true
      }
    });

    const totalBookings = events.length;
    let noShows = 0;
    let cancellations = 0;
    let reschedules = 0;

    // Time series data: mapping date to booking count
    const timeSeriesMap = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      timeSeriesMap.set(format(subDays(endDate, i), 'yyyy-MM-dd'), 0);
    }

    // Heatmap data: array of 7 days (0-6) x 24 hours (0-23)
    // Initialize with 0s
    const heatmap = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));

    // Per event type breakdown
    const eventTypeBreakdown: Record<string, number> = {};

    events.forEach(event => {
      // Metrics
      if (event.status === 'CANCELLED') cancellations++;
      if (event.noShows.length > 0) noShows++;
      // A reschedule creates a new event but we don't strictly track if an event was born from a reschedule unless we track originalEventId. We'll approximate or leave 0 for now.

      // Time Series
      const dateStr = format(event.startTime, 'yyyy-MM-dd');
      if (timeSeriesMap.has(dateStr)) {
        timeSeriesMap.set(dateStr, timeSeriesMap.get(dateStr)! + 1);
      }

      // Heatmap
      const dayOfWeek = event.startTime.getDay(); // 0 = Sunday
      const hourOfDay = event.startTime.getHours();
      heatmap[dayOfWeek][hourOfDay]++;

      // Event Type Breakdown
      const typeName = event.eventType.name;
      eventTypeBreakdown[typeName] = (eventTypeBreakdown[typeName] || 0) + 1;
    });

    // Format output
    const timeSeries = Array.from(timeSeriesMap.entries())
      .map(([date, count]) => ({ date, bookings: count }))
      .sort((a, b) => a.date.localeCompare(b.date)); // chronological

    const breakdownList = Object.entries(eventTypeBreakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    res.json({
      success: true,
      metrics: {
        totalBookings,
        cancellationRate: totalBookings > 0 ? (cancellations / totalBookings) * 100 : 0,
        noShowRate: totalBookings > 0 ? (noShows / totalBookings) * 100 : 0,
      },
      timeSeries,
      heatmap,
      eventTypeBreakdown: breakdownList
    });

  } catch (error) {
    next(error);
  }
});

export default router;
