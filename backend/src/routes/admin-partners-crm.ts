import { Router, Response, NextFunction } from 'express'
import { PrismaClient }                   from '@prisma/client'
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

/**
 * GET /api/admin/crm/partners
 */
router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, tier, type, search } = req.query
    const where: Record<string, unknown> = {}
    if (status && status !== 'all') where.status = String(status)
    if (tier   && tier   !== 'all') where.tier   = String(tier)
    if (type   && type   !== 'all') where.type   = String(type)
    if (search) {
      where.OR = [
        { name:    { contains: String(search), mode: 'insensitive' } },
        { country: { contains: String(search), mode: 'insensitive' } },
      ]
    }
    const partners = await prisma.partnerCRM.findMany({
      where,
      orderBy: { totalEarned: 'desc' },
    })
    res.json({ partners })
  } catch (err) { next(err) }
})

/**
 * GET /api/admin/crm/partners/:id
 */
router.get('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const partner = await prisma.partnerCRM.findUnique({ where: { id: req.params.id } })
    if (!partner) return res.status(404).json({ error: 'Partner not found' })
    res.json({ partner })
  } catch (err) { next(err) }
})

/**
 * POST /api/admin/crm/partners
 */
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'name is required' })
    const partner = await prisma.partnerCRM.create({
      data: {
        ...req.body,
        joinDate: req.body.joinDate ? new Date(req.body.joinDate) : null,
      },
    })
    res.status(201).json({ partner })
  } catch (err) { next(err) }
})

/**
 * PATCH /api/admin/crm/partners/:id
 */
router.patch('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const allowed = ['name','type','tier','status','country','specialisms','rating',
                     'contactName','contactRole','contactEmail','contactPhone',
                     'joinDate','totalEarned','pendingPayment','activeTasks',
                     'completedProjects','description','logo','hourlyRate','projectIds']
    const data: Record<string, unknown> = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        data[key] = key === 'joinDate' && req.body[key] ? new Date(req.body[key]) : req.body[key]
      }
    }
    const partner = await prisma.partnerCRM.update({ where: { id: req.params.id }, data })
    res.json({ partner })
  } catch (err) { next(err) }
})

export default router
