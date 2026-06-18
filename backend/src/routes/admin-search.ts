import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'
import { authorize } from '../middleware/auth'

const router = Router()

export interface SearchResult {
  type: 'lead' | 'client' | 'consultation' | 'project' | 'partner'
  id: string
  title: string
  subtitle: string
  path: string
  meta?: string
}

router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { q = '' } = req.query
    const query = String(q).trim()

    if (query.length < 2) {
      return res.json({ results: [], query })
    }

    const mode = 'insensitive' as const
    const take = 6

    const [leads, clients, consultations, projects, partners] = await Promise.all([

      prisma.contact.findMany({
        where: {
          OR: [
            { name:    { contains: query, mode } },
            { email:   { contains: query, mode } },
            { subject: { contains: query, mode } },
            { company: { contains: query, mode } },
          ],
        },
        select: { id: true, name: true, email: true, subject: true, status: true },
        take,
        orderBy: { createdAt: 'desc' },
      }),

      prisma.clientCRM.findMany({
        where: {
          OR: [
            { name:     { contains: query, mode } },
            { industry: { contains: query, mode } },
            { country:  { contains: query, mode } },
          ],
        },
        select: { id: true, name: true, industry: true, tier: true, status: true },
        take,
      }),

      prisma.consultation.findMany({
        where: {
          OR: [
            { name:    { contains: query, mode } },
            { email:   { contains: query, mode } },
            { service: { contains: query, mode } },
            { company: { contains: query, mode } },
          ],
        },
        select: { id: true, name: true, email: true, service: true, status: true },
        take,
        orderBy: { createdAt: 'desc' },
      }),

      prisma.project.findMany({
        where: {
          OR: [
            { title:       { contains: query, mode } },
            { description: { contains: query, mode } },
          ],
        },
        select: { id: true, title: true, description: true, status: true },
        take,
      }),

      prisma.partnerCRM.findMany({
        where: {
          OR: [
            { name: { contains: query, mode } },
            { type: { contains: query, mode } },
          ],
        },
        select: { id: true, name: true, type: true, tier: true, status: true },
        take,
      }),
    ])

    const results: SearchResult[] = [
      ...leads.map(r => ({
        type: 'lead' as const,
        id:       r.id,
        title:    r.name,
        subtitle: r.email,
        path:     '/kangqore-view/admin/leads',
        meta:     r.status ?? undefined,
      })),
      ...clients.map(r => ({
        type: 'client' as const,
        id:       r.id,
        title:    r.name,
        subtitle: [r.industry, r.tier].filter(Boolean).join(' · '),
        path:     '/kangqore-view/admin/clients',
        meta:     r.status,
      })),
      ...consultations.map(r => ({
        type: 'consultation' as const,
        id:       r.id,
        title:    r.name,
        subtitle: r.service ?? r.email,
        path:     '/kangqore-view/admin/consultations',
        meta:     r.status?.toLowerCase(),
      })),
      ...projects.map(r => ({
        type: 'project' as const,
        id:       r.id,
        title:    r.title,
        subtitle: (r.description ?? '').slice(0, 70),
        path:     '/kangqore-view/admin/projects',
        meta:     r.status?.toLowerCase().replace(/_/g, ' '),
      })),
      ...partners.map(r => ({
        type: 'partner' as const,
        id:       r.id,
        title:    r.name,
        subtitle: `${r.type} · ${r.tier}`,
        path:     '/kangqore-view/admin/partners',
        meta:     r.status,
      })),
    ]

    res.json({ results, query, total: results.length })
  } catch (error) {
    next(error)
  }
})

export default router
