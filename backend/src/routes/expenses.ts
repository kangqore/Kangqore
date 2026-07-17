import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth'

const router = Router()

// GET /api/expenses
router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, category } = req.query
    const where: any = {}
    if (status)   where.status   = status as string
    if (category) where.category = category as string

    const expenses = await (prisma as any).expense.findMany({
      where,
      orderBy: { expenseDate: 'desc' },
    })
    res.json({ expenses })
  } catch (e) { next(e) }
})

// POST /api/expenses
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, category, amount, currency, expenseDate, notes, projectId } = req.body
    const expense = await (prisma as any).expense.create({
      data: {
        title,
        category: category || 'Other',
        amount: parseFloat(amount),
        currency: currency || 'INR',
        expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
        notes,
        projectId: projectId || null,
        submittedBy: req.user!.id,
        status: 'PENDING',
      },
    })
    res.status(201).json(expense)
  } catch (e) { next(e) }
})

// PATCH /api/expenses/:id/status
router.patch('/:id/status', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body
    const expense = await (prisma as any).expense.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'APPROVED' ? { approvedBy: req.user!.id, approvedAt: new Date() } : {}),
      },
    })
    res.json(expense)
  } catch (e) { next(e) }
})

// DELETE /api/expenses/:id
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await (prisma as any).expense.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

export default router
