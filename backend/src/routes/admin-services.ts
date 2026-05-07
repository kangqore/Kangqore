// @ts-nocheck
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/services - List Service Lines with Latest Metrics
router.get('/', async (req, res) => {
  try {
    const services: any = await prisma.serviceLine.findMany({
      include: {
        metrics: {
          orderBy: { period: 'desc' },
          take: 1
        }
      }
    });

    const formatted = services.map((s: any) => {
      const latestMetric = s.metrics[0] || {};
      
      return {
        id: s.id,
        name: s.name,
        slug: s.slug,
        leadId: s.leadId,
        revenue: Number(latestMetric.revenue || 0),
        cost: Number(latestMetric.cost || 0),
        margin: Number(latestMetric.margin || 0), // Percentage
        utilization: Number(latestMetric.utilization || 0), // Percentage
        headcount: latestMetric.headcount || 0,
        bench: latestMetric.bench || 0,
        period: latestMetric.period
      };
    });
    
    // Sort by revenue desc
    formatted.sort((a: any, b: any) => b.revenue - a.revenue);

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/admin/services/stats - Aggregate Global Stats (Optional, fetched on frontend currently)
// Left as placeholder if needed later.

export default router;
