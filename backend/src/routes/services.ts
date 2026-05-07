
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/services - List all service lines with latest metrics
router.get('/', async (req, res) => {
  try {
    const services = await prisma.serviceLine.findMany({
      include: {
        metrics: {
          orderBy: { period: 'desc' },
          take: 1
        },
        lead: {
          select: { name: true, avatarUrl: true }
        }
      }
    });

    // Format for frontend
    const formatted = services.map(s => {
      const latest = s.metrics[0];
      return {
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        lead: s.lead,
        // Flatten latest metrics
        revenue: Number(latest?.revenue ?? 0),
        margin: Number(latest?.margin ?? 0),
        utilization: Number(latest?.utilization ?? 0),
        headcount: latest?.headcount ?? 0,
        bench: latest?.bench ?? 0,
        lastUpdated: latest?.period
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/services/:slug - Get detailed history for a service line
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await prisma.serviceLine.findUnique({
      where: { slug },
      include: {
        metrics: {
          orderBy: { period: 'asc' },
          take: 12 // Last 12 months
        },
        lead: {
          select: { name: true, avatarUrl: true, email: true }
        },
        projects: {
          where: { status: 'ACTIVE' },
          select: { id: true, title: true, client: { select: { name: true } } },
          take: 5
        }
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service line not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({ error: 'Failed to fetch service details' });
  }
});

export default router;
