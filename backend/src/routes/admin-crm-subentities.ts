/**
 * CRM sub-entity routes — all return flat arrays so the frontend stores
 * can filter them client-side (same pattern as the rest of the CRM).
 *
 * Client sub-entities:   GET /api/admin/crm/interactions|slas|milestones|governance
 * Partner sub-entities:  GET /api/admin/crm/partner-tasks|partner-deliverables|partner-payments|partner-notes
 * Investor financials:   GET /api/admin/crm/cap-table|fundraising-rounds
 */
import { Router, Response, NextFunction } from 'express'
import { PrismaClient }                   from '@prisma/client'
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()
const AUTH   = [authenticate, authorize(['ADMIN'])] as const

// ── Client sub-entities ────────────────────────────────────────────────────────

router.get('/interactions', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientInteraction.findMany({ orderBy: { date: 'desc' } })
    res.json({ interactions: rows })
  } catch (err) { next(err) }
})

router.get('/slas', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientSLA.findMany()
    res.json({ slas: rows })
  } catch (err) { next(err) }
})

router.get('/milestones', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientMilestone.findMany({ orderBy: { dueDate: 'asc' } })
    res.json({ milestones: rows })
  } catch (err) { next(err) }
})

router.get('/governance', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.clientGovernanceItem.findMany({ orderBy: { date: 'desc' } })
    res.json({ governance: rows })
  } catch (err) { next(err) }
})

// ── Partner sub-entities ───────────────────────────────────────────────────────

router.get('/partner-tasks', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerTask.findMany({ orderBy: { assignedDate: 'desc' } })
    res.json({ tasks: rows })
  } catch (err) { next(err) }
})

router.get('/partner-deliverables', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerDeliverable.findMany({ orderBy: { dueDate: 'desc' } })
    res.json({ deliverables: rows })
  } catch (err) { next(err) }
})

router.get('/partner-payments', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerPayment.findMany({ orderBy: { issuedDate: 'desc' } })
    res.json({ payments: rows })
  } catch (err) { next(err) }
})

router.get('/partner-notes', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.crmPartnerNote.findMany({ orderBy: { date: 'desc' } })
    res.json({ notes: rows })
  } catch (err) { next(err) }
})

// ── Investor financials ────────────────────────────────────────────────────────

router.get('/cap-table', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.capTableEntry.findMany({ orderBy: { ownership: 'desc' } })
    res.json({ capTable: rows })
  } catch (err) { next(err) }
})

router.get('/fundraising-rounds', ...AUTH, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.fundraisingRound.findMany({ orderBy: { openDate: 'desc' } })
    res.json({ rounds: rows })
  } catch (err) { next(err) }
})

export default router
