import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { Response, NextFunction } from 'express';

const router = Router();
const prisma = new PrismaClient();

function shapeCampaign(c: Awaited<ReturnType<typeof prisma.campaign.findMany>>[0]) {
  return {
    id:          c.id,
    name:        c.name,
    channel:     c.channel,
    status:      c.status,
    startDate:   c.startDate.toISOString().slice(0, 10),
    endDate:     c.endDate?.toISOString().slice(0, 10),
    budget:      c.budget,
    spent:       c.spent,
    impressions: c.impressions,
    clicks:      c.clicks,
    leads:       c.leads,
    mqls:        c.mqls,
    sqls:        c.sqls,
    revenue:     c.revenue,
    owner:       c.owner,
    description: c.description,
    tags:        c.tags,
  }
}

function shapeContent(p: Awaited<ReturnType<typeof prisma.contentPiece.findMany>>[0]) {
  return {
    id:          p.id,
    title:       p.title,
    type:        p.type,
    status:      p.status,
    publishDate: p.publishDate?.toISOString().slice(0, 10),
    author:      p.author,
    views:       p.views,
    leads:       p.leads,
    url:         p.url ?? undefined,
    tags:        p.tags,
  }
}

// GET /api/marketing
router.get('/', authenticate, authorize(['ADMIN']), async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [campaigns, content, metrics] = await Promise.all([
      prisma.campaign.findMany({ orderBy: { startDate: 'desc' } }),
      prisma.contentPiece.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.marketingMetric.findMany({ orderBy: { month: 'asc' } }),
    ])

    res.json({
      campaigns: campaigns.map(shapeCampaign),
      content:   content.map(shapeContent),
      metrics:   metrics.map(m => ({
        month:          m.month,
        spend:          m.spend,
        mqls:           m.mqls,
        sqls:           m.sqls,
        websiteVisits:  m.websiteVisits,
        conversionRate: m.conversionRate,
        cpl:            m.cpl,
        cac:            m.cac,
      })),
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/marketing/campaigns/:id
router.patch('/campaigns/:id', authenticate, authorize(['ADMIN']), async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { status, spent, budget, endDate } = req.body

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        ...(status  !== undefined && { status }),
        ...(spent   !== undefined && { spent:  Number(spent) }),
        ...(budget  !== undefined && { budget: Number(budget) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
      },
    })

    res.json(shapeCampaign(updated))
  } catch (err) {
    next(err)
  }
})

export default router;
