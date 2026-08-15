import { Router, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { emailService } from '../../kangqore-view/eaf/channels/EmailService';
import { startOfDay, endOfDay, format } from 'date-fns';
import { json2csv } from 'json-2-csv';

const router = Router();

/**
 * POST /api/scheduling/export
 * Trigger an asynchronous CSV export of bookings. The CSV is generated and emailed to the host.
 */
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { startDate, endDate } = req.body;

    const start = startDate ? startOfDay(new Date(startDate)) : startOfDay(new Date(0));
    const end = endDate ? endOfDay(new Date(endDate)) : endOfDay(new Date());

    // Send immediate response
    res.json({
      success: true,
      message: 'Your export is being generated and will be emailed to you shortly.'
    });

    // Run export process asynchronously
    (async () => {
      try {
        const events = await prisma.scheduledEvent.findMany({
          where: {
            hostId: userId,
            startTime: { gte: start, lte: end }
          },
          include: {
            eventType: { select: { name: true } },
            invitees: true
          },
          orderBy: { startTime: 'desc' }
        });

        // Map events to flat format for CSV
        const exportData = events.map(event => {
          const invitee = event.invitees[0] || {} as any;
          return {
            'Event ID': event.id,
            'Event Type': event.eventType.name,
            'Title': event.title,
            'Status': event.status,
            'Start Time (UTC)': event.startTime.toISOString(),
            'End Time (UTC)': event.endTime.toISOString(),
            'Timezone': event.timezone,
            'Invitee Name': invitee.name || '',
            'Invitee Email': invitee.email || '',
            'Invitee Phone': invitee.phone || '',
            'Invitee Company': invitee.company || '',
            'Cancelled At': event.cancelledAt ? event.cancelledAt.toISOString() : '',
            'Cancel Reason': event.cancelReason || '',
            'Created At': event.createdAt.toISOString()
          };
        });

        let csvString = '';
        if (exportData.length > 0) {
          csvString = json2csv(exportData);
        } else {
          csvString = 'No bookings found in this date range.';
        }

        const base64Csv = Buffer.from(csvString).toString('base64');
        const fileName = `Bookings_Export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

        // We need to add an attachment method to emailService or use sendEmail with attachment
        // Wait, looking at emailService, we can add attachment support to sendEmail
        await emailService.sendEmailWithAttachment({
          to: req.user!.email,
          subject: 'Your Bookings Export (Kangqore)',
          text: 'Attached is your requested bookings export.',
          attachment: {
            content: base64Csv,
            filename: fileName,
            type: 'text/csv',
            disposition: 'attachment'
          }
        });

      } catch (err) {
        console.error('Async CSV Export Error:', err);
      }
    })();

  } catch (error) {
    next(error);
  }
});

export default router;
