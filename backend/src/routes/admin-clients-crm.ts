import { Router, Response, NextFunction } from 'express'
import { PrismaClient }                   from '@prisma/client'
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

const WITH_CONTACTS = { contacts: { orderBy: { isPrimary: 'desc' as const } } }

/**
 * GET /api/admin/crm/clients
 * List all CRM clients (with contacts).
 */
router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, health, tier, search } = req.query
    const where: Record<string, unknown> = {}
    if (status && status !== 'all') where.status = String(status)
    if (health && health !== 'all') where.health = String(health)
    if (tier   && tier   !== 'all') where.tier   = String(tier)
    if (search) {
      where.OR = [
        { name:     { contains: String(search), mode: 'insensitive' } },
        { industry: { contains: String(search), mode: 'insensitive' } },
      ]
    }

    const clients = await prisma.clientCRM.findMany({
      where,
      include: WITH_CONTACTS,
      orderBy: { arr: 'desc' },
    })
    res.json({ clients })
  } catch (err) { next(err) }
})

/**
 * GET /api/admin/crm/clients/:id
 * Single client with contacts.
 */
router.get('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const client = await prisma.clientCRM.findUnique({
      where: { id: req.params.id },
      include: WITH_CONTACTS,
    })
    if (!client) return res.status(404).json({ error: 'Client not found' })
    res.json({ client })
  } catch (err) { next(err) }
})

/**
 * POST /api/admin/crm/clients
 * Create a new CRM client.
 */
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { contacts, ...data } = req.body
    if (!data.name) return res.status(400).json({ error: 'name is required' })
    const client = await prisma.clientCRM.create({
      data: {
        ...data,
        contractStart: data.contractStart ? new Date(data.contractStart) : null,
        contractEnd:   data.contractEnd   ? new Date(data.contractEnd)   : null,
        contacts: contacts?.length ? { create: contacts } : undefined,
      },
      include: WITH_CONTACTS,
    })
    res.status(201).json({ client })
  } catch (err) { next(err) }
})

/**
 * PATCH /api/admin/crm/clients/:id
 * Update a CRM client.
 */
router.patch('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const allowed = ['name','industry','country','tier','status','health','arr',
                     'contractStart','contractEnd','accountManager','satisfactionScore',
                     'description','logo','projectIds']
    const data: Record<string, unknown> = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        data[key] = (key === 'contractStart' || key === 'contractEnd') && req.body[key]
          ? new Date(req.body[key])
          : req.body[key]
      }
    }
    const client = await prisma.clientCRM.update({
      where: { id: req.params.id },
      data,
      include: WITH_CONTACTS,
    })
    res.json({ client })
  } catch (err) { next(err) }
})

export default router
