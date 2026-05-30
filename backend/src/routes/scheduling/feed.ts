import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { format } from 'date-fns';

const router = Router();

/**
 * GET /api/scheduling/feed/:token
 * Returns a read-only .ics format feed of the user's scheduled events.
 */
router.get('/:token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // In a real implementation, the User model would have an `icalToken` field.
    // For this demonstration, we assume `token` matches a user's ID or a specific token column.
    // We'll just look up the user by ID for simplicity if token == userId,
    // though in production this should be a secure random token.
    const user = await prisma.user.findFirst({
      where: {
        // If we added an icalToken field, we'd query by that.
        // For Phase 1 demo, we'll match on ID to avoid another Prisma migration.
        id: token
      }
    });

    if (!user) {
      return res.status(404).send('Invalid calendar feed token');
    }

    const events = await prisma.scheduledEvent.findMany({
      where: { hostId: user.id, status: 'ACTIVE' },
      include: { invitees: true, eventType: true }
    });

    let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Kangqore//Scheduling//EN\r\n`;

    for (const event of events) {
      const start = format(new Date(event.startTime), "yyyyMMdd'T'HHmmss'Z'");
      const end = format(new Date(event.endTime), "yyyyMMdd'T'HHmmss'Z'");
      const stamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
      
      const inviteeNames = event.invitees.map(i => i.name).join(', ');

      icsContent += `BEGIN:VEVENT\r\n`;
      icsContent += `UID:${event.id}@kangqore.com\r\n`;
      icsContent += `DTSTAMP:${stamp}\r\n`;
      icsContent += `DTSTART:${start}\r\n`;
      icsContent += `DTEND:${end}\r\n`;
      icsContent += `SUMMARY:${event.title}\r\n`;
      icsContent += `DESCRIPTION:Meeting with ${inviteeNames}.\\nJoin here: ${event.joinUrl}\r\n`;
      if (event.locationValue) {
        icsContent += `LOCATION:${event.locationValue}\r\n`;
      }
      icsContent += `END:VEVENT\r\n`;
    }

    icsContent += `END:VCALENDAR`;

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="kangqore_calendar.ics"');
    res.send(icsContent);
  } catch (error) {
    next(error);
  }
});

export default router;
