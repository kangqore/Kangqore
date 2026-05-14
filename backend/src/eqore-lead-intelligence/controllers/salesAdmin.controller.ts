import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { EqoreSalesPipelineService } from '../sales/salesPipeline.service';
import { eqoreCrmSyncService } from '../sales/crmSync.service';
import { EqoreSalesTaskService } from '../sales/salesTask.service';

export class EqoreSalesAdminController {
  static async listOpportunities(req: Request, res: Response) {
    try {
      const opportunities = await prisma.eqoreSalesOpportunity.findMany({
        orderBy: { priority: 'desc' },
        include: {
          lead: {
            select: { email: true, name: true, companyName: true, leadScore: true, urgency: true }
          }
        }
      });
      res.json({ opportunities });
    } catch (error) {
      logger.error('Failed to list opportunities', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getOpportunityDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const opportunity = await prisma.eqoreSalesOpportunity.findUnique({
        where: { id },
        include: {
          lead: true,
          tasks: { orderBy: { dueAt: 'asc' } },
          activities: { orderBy: { createdAt: 'desc' } },
          notes: { orderBy: { createdAt: 'desc' } },
          syncLogs: { orderBy: { createdAt: 'desc' }, take: 1 }
        }
      });
      
      if (!opportunity) {
        return res.status(404).json({ error: 'Opportunity not found' });
      }

      res.json({ opportunity });
    } catch (error) {
      logger.error('Failed to get opportunity', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateOpportunityStage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { stage, reason } = req.body;
      const opp = await EqoreSalesPipelineService.updateOpportunityStage(id, stage, reason);
      res.json({ success: true, opportunity: opp });
    } catch (error) {
      logger.error('Failed to update stage', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateOpportunityOwner(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { ownerId } = req.body;
      const opp = await prisma.eqoreSalesOpportunity.update({
        where: { id },
        data: { ownerId }
      });
      
      await prisma.eqoreLead.update({
        where: { id: opp.leadId },
        data: { assignedOwnerId: ownerId }
      });

      res.json({ success: true, opportunity: opp });
    } catch (error) {
      logger.error('Failed to update owner', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async listTasks(req: Request, res: Response) {
    try {
      const tasks = await prisma.eqoreSalesTask.findMany({
        where: { status: 'OPEN' },
        orderBy: { dueAt: 'asc' },
        include: {
          lead: { select: { name: true, email: true, companyName: true } }
        }
      });
      res.json({ tasks });
    } catch (error) {
      logger.error('Failed to list tasks', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createTask(req: Request, res: Response) {
    try {
      const task = await EqoreSalesTaskService.createTask(req.body);
      res.json({ success: true, task });
    } catch (error) {
      logger.error('Failed to create task', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await EqoreSalesTaskService.updateTask(id, req.body);
      res.json({ success: true, task });
    } catch (error) {
      logger.error('Failed to update task', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getNotes(req: Request, res: Response) {
    try {
      const { leadId } = req.params;
      const notes = await prisma.eqoreSalesNote.findMany({
        where: { leadId },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ notes });
    } catch (error) {
      logger.error('Failed to get notes', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async createNote(req: Request, res: Response) {
    try {
      const note = await prisma.eqoreSalesNote.create({
        data: req.body
      });
      res.json({ success: true, note });
    } catch (error) {
      logger.error('Failed to create note', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async syncCrm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await eqoreCrmSyncService.syncOpportunity(id);
      
      // Fetch latest log
      const log = await prisma.eqoreCrmSyncLog.findFirst({
        where: { opportunityId: id },
        orderBy: { createdAt: 'desc' }
      });
      
      res.json({ success: true, log });
    } catch (error) {
      logger.error('Failed to trigger CRM sync', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
