/**
 * eQORE Big Brain Knowledge Graph — Admin Controller (Phase 5)
 * 
 * Exposes graph data via admin API under /api/admin/eqore/graph/*
 */

import { Request, Response } from 'express';
import { GraphQueryService } from '../graph/graphQuery.service';
import { GraphSyncService } from '../graph/graphSync.service';
import { GraphRecommendationService } from '../graph/graphRecommendation.service';
import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';

export class EqoreGraphController {
  /**
   * GET /api/admin/eqore/graph/nodes
   * List graph nodes with optional type filter and pagination.
   */
  static async listNodes(req: Request, res: Response) {
    try {
      const { type, page = '1', limit = '50' } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = { isActive: true };
      if (type) where.type = type;

      const [nodes, total] = await Promise.all([
        prisma.eqoreGraphNode.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          orderBy: { type: 'asc' }
        }),
        prisma.eqoreGraphNode.count({ where })
      ]);

      res.json({ nodes, total, page: parseInt(page as string), limit: parseInt(limit as string) });
    } catch (error) {
      logger.error('EqoreGraphController.listNodes error:', error);
      res.status(500).json({ error: 'Failed to fetch graph nodes' });
    }
  }

  /**
   * GET /api/admin/eqore/graph/nodes/:id/edges
   * Get all edges for a specific node.
   */
  static async getNodeEdges(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const edges = await prisma.eqoreGraphEdge.findMany({
        where: {
          isActive: true,
          OR: [{ fromNodeId: id }, { toNodeId: id }]
        },
        include: { fromNode: true, toNode: true },
        take: 50
      });

      res.json({ edges, count: edges.length });
    } catch (error) {
      logger.error('EqoreGraphController.getNodeEdges error:', error);
      res.status(500).json({ error: 'Failed to fetch node edges' });
    }
  }

  /**
   * GET /api/admin/eqore/graph/leads/:leadId/context
   * Get full graph context for a lead.
   */
  static async getLeadContext(req: Request, res: Response) {
    try {
      const { leadId } = req.params;

      // Check if we have cached context
      const lead = await prisma.eqoreLead.findUnique({
        where: { id: leadId },
        select: {
          graphContext: true,
          graphEnrichedAt: true,
          graphContextVersion: true,
          recommendedCrossSells: true,
          recommendedCaseStudies: true,
          recommendedConsultant: true
        }
      });

      if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      // If already enriched, return cached version
      if (lead.graphContext) {
        return res.json({
          cached: true,
          enrichedAt: lead.graphEnrichedAt,
          version: lead.graphContextVersion,
          context: lead.graphContext,
          crossSells: lead.recommendedCrossSells,
          caseStudies: lead.recommendedCaseStudies,
          consultant: lead.recommendedConsultant
        });
      }

      // Generate fresh context
      const context = await GraphQueryService.getFullContext(leadId);
      if (!context) {
        return res.json({
          cached: false,
          context: null,
          message: 'No graph context available — lead may not have matched services yet'
        });
      }

      res.json({ cached: false, context });
    } catch (error) {
      logger.error('EqoreGraphController.getLeadContext error:', error);
      res.status(500).json({ error: 'Failed to fetch lead graph context' });
    }
  }

  /**
   * POST /api/admin/eqore/graph/leads/:leadId/enrich
   * Trigger graph enrichment for a specific lead.
   */
  static async enrichLead(req: Request, res: Response) {
    try {
      const { leadId } = req.params;
      const success = await GraphRecommendationService.enrichLeadContext(leadId);

      if (success) {
        const lead = await prisma.eqoreLead.findUnique({
          where: { id: leadId },
          select: {
            graphContext: true,
            graphEnrichedAt: true,
            recommendedCrossSells: true,
            recommendedCaseStudies: true,
            recommendedConsultant: true
          }
        });
        res.json({ success: true, lead });
      } else {
        res.status(422).json({ success: false, error: 'Graph enrichment failed or no data available' });
      }
    } catch (error) {
      logger.error('EqoreGraphController.enrichLead error:', error);
      res.status(500).json({ error: 'Failed to enrich lead context' });
    }
  }

  /**
   * GET /api/admin/eqore/graph/stats
   * Graph statistics (node counts, edge counts by type).
   */
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await GraphSyncService.getStats();
      res.json(stats);
    } catch (error) {
      logger.error('EqoreGraphController.getStats error:', error);
      res.status(500).json({ error: 'Failed to fetch graph stats' });
    }
  }

  /**
   * POST /api/admin/eqore/graph/sync
   * Trigger manual graph sync.
   */
  static async syncGraph(req: Request, res: Response) {
    try {
      const result = await GraphSyncService.syncAll();
      res.json({
        success: true,
        message: 'Graph sync completed',
        ...result
      });
    } catch (error) {
      logger.error('EqoreGraphController.syncGraph error:', error);
      res.status(500).json({ error: 'Graph sync failed' });
    }
  }
}
