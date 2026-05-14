import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { EqoreTokenService } from '../../eqore/session/token.service';
import { EqoreSchedulingAgentService } from '../../eqore/services/schedulingAgent.service';
import { eqoreQueue } from '../../eqore/queue/eqore.queue';

export class EqoreLeadController {
  /**
   * Explicitly capture lead details (e.g., when they provide email in chat).
   */
  static async captureLead(req: Request, res: Response) {
    try {
      const { sessionId, email, name } = req.body;

      if (!sessionId || !email) {
        return res.status(400).json({ error: 'Session ID and email are required' });
      }

      if (!EqoreTokenService.isValidToken(sessionId)) {
        return res.status(400).json({ error: 'Invalid session token format' });
      }

      const lead = await prisma.eqoreLead.findFirst({
        where: { sessionId },
        orderBy: { createdAt: 'desc' }
      });

      if (!lead) {
        return res.status(404).json({ error: 'Lead not found for session' });
      }

      await prisma.eqoreLead.update({
        where: { id: lead.id },
        data: {
          email: email,
          name: name,
        }
      });

      await prisma.eqoreLeadEvent.create({
        data: {
          leadId: lead.id,
          eventType: 'CONTACT_INFO_CAPTURED',
          reason: `Captured email: ${email}`,
        }
      });

      res.json({ success: true, message: 'Lead captured successfully' });
    } catch (error) {
      logger.error('EqoreLeadController.captureLead error', error);
      res.status(500).json({ error: 'Failed to capture lead' });
    }
  }

  /**
   * Resolves a secure session token after login/register redirect.
   * Only the hash of the token is ever stored in the DB.
   */
  static async resolveLeadSession(req: Request, res: Response) {
    try {
      const { leadSessionId } = req.params;

      if (!leadSessionId) {
        return res.status(400).json({ error: 'leadSessionId is required' });
      }

      const hash = EqoreTokenService.hashToken(leadSessionId);

      const lead = await prisma.eqoreLead.findFirst({
        where: { secureTokenHash: hash },
        include: { conversation: true }
      });

      if (!lead) {
        return res.status(404).json({ error: 'Invalid or expired lead session' });
      }

      res.json({ success: true, lead });
    } catch (error) {
      logger.error('EqoreLeadController.resolveLeadSession error', error);
      res.status(500).json({ error: 'Failed to resolve lead session' });
    }
  }

  /**
   * Confirms a selected scheduling slot.
   */
  static async confirmBooking(req: Request, res: Response) {
    try {
      const { leadId, slotId } = req.body;

      if (!leadId || !slotId) {
        return res.status(400).json({ error: 'leadId and slotId are required' });
      }

      const booking = await EqoreSchedulingAgentService.confirmBooking(leadId, slotId);

      // Log Event
      await prisma.eqoreLeadEvent.create({
        data: {
          leadId,
          eventType: 'CONSULTATION_BOOKED',
          reason: 'Visitor confirmed consultation slot via eQORE Chat',
          eventData: {
            bookingId: booking.id,
            startTime: booking.startTime,
            title: booking.title
          } as any
        }
      });

      // Enqueue Nurture Assets Generation (Phase 5)
      await eqoreQueue.enqueueNurture({ leadId });

      res.json({ success: true, booking });
    } catch (error) {
      logger.error('EqoreLeadController.confirmBooking error', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

