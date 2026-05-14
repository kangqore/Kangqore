import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export class EqoreAdminController {
  /**
   * Get all leads for the admin dashboard
   */
  static async listLeads(req: Request, res: Response) {
    try {
      const leads = await prisma.eqoreLead.findMany({
        orderBy: { leadScore: 'desc' },
        take: 100,
      });

      res.json({ leads });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  /**
   * Get detail for a specific lead, including events and chat transcript
   */
  static async getLeadDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const lead = await prisma.eqoreLead.findUnique({
        where: { id },
        include: {
          events: { orderBy: { createdAt: 'desc' } },
          conversation: {
            include: {
              messages: { orderBy: { createdAt: 'asc' } }
            }
          },
          opportunity: true,
          salesTasks: { where: { status: 'OPEN' } }
        }
      });

      if (!lead) return res.status(404).json({ error: 'Lead not found' });

      res.json({ lead });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lead detail' });
    }
  }

  /**
   * Update lead status (e.g., from admin UI)
   */
  static async updateLeadStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) return res.status(400).json({ error: 'Status is required' });

      const updated = await prisma.eqoreLead.update({
        where: { id },
        data: { status }
      });

      await prisma.eqoreLeadEvent.create({
        data: {
          leadId: id,
          eventType: 'STATUS_UPDATED',
          reason: `Admin updated status to ${status}`,
        }
      });

      res.json({ success: true, lead: updated });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update lead status' });
    }
  }
}
