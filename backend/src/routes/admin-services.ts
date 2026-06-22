import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// GET /api/admin/services
router.get('/', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.serviceLine.findMany({
      include: {
        metrics: {
          orderBy: { period: 'desc' },
          take: 1,
        },
      },
    })

    const formatted = services
      .map(s => {
        const m = s.metrics[0]
        return {
          id:          s.id,
          name:        s.name,
          slug:        s.slug,
          leadId:      s.leadId,
          revenue:     m ? Number(m.revenue)     : 0,
          cost:        m ? Number(m.cost)         : 0,
          margin:      m ? Number(m.margin)       : 0,
          utilization: m ? Number(m.utilization)  : 0,
          headcount:   m?.headcount ?? 0,
          bench:       m?.bench     ?? 0,
          period:      m?.period    ?? null,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    res.json(formatted)
  } catch (err) { next(err) }
})

export default router
