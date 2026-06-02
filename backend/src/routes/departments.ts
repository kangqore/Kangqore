import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { Response, NextFunction } from 'express';

const router = Router();
const prisma = new PrismaClient();

function shapeDepartment(d: Awaited<ReturnType<typeof prisma.department.findMany>>[0] & {
  budgetRows: { annual: number; q1: number; q1Spent: number; q2: number; q2Spent: number; q3: number; q3Budget: number; q4: number; q4Budget: number; categories: unknown }[]
}) {
  return {
    id:           d.id,
    name:         d.name,
    head:         d.head,
    headTitle:    d.headTitle,
    status:       d.status,
    headcount:    d.headcount,
    openRoles:    d.openRoles,
    budget:       d.budget,
    spent:        d.spent,
    budgetStatus: d.budgetStatus,
    costCenter:   d.costCenter,
    description:  d.description,
    tags:         d.tags,
    kpis:         d.kpis,
  }
}

function shapeBudget(b: Awaited<ReturnType<typeof prisma.deptBudget.findMany>>[0] & {
  department: { id: string; name: string }
}) {
  return {
    deptId:   b.departmentId,
    deptName: b.department.name,
    annual:   b.annual,
    q1: b.q1, q1Spent: b.q1Spent,
    q2: b.q2, q2Spent: b.q2Spent,
    q3: b.q3, q3Budget: b.q3Budget,
    q4: b.q4, q4Budget: b.q4Budget,
    categories: b.categories,
  }
}

// GET /api/departments
router.get('/', authenticate, authorize(['ADMIN']), async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [departments, orgNodes, budgets] = await Promise.all([
      prisma.department.findMany({
        include: { budgetRows: true },
        orderBy: { name: 'asc' },
      }),
      prisma.orgNode.findMany({ orderBy: [{ level: 'asc' }, { name: 'asc' }] }),
      prisma.deptBudget.findMany({
        include: { department: { select: { id: true, name: true } } },
      }),
    ])

    res.json({
      departments: departments.map(shapeDepartment),
      orgNodes: orgNodes.map(n => ({
        id: n.id, name: n.name, title: n.title,
        department: n.deptName, reportsTo: n.reportsTo ?? undefined,
        level: n.level, headcount: n.headcount ?? undefined,
      })),
      budgets: budgets.map(shapeBudget),
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/departments/:id
router.patch('/:id', authenticate, authorize(['ADMIN']), async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { status, headcount, openRoles, spent, budgetStatus, description } = req.body

    const updated = await prisma.department.update({
      where: { id },
      data: {
        ...(status       !== undefined && { status }),
        ...(headcount    !== undefined && { headcount: Number(headcount) }),
        ...(openRoles    !== undefined && { openRoles: Number(openRoles) }),
        ...(spent        !== undefined && { spent: Number(spent) }),
        ...(budgetStatus !== undefined && { budgetStatus }),
        ...(description  !== undefined && { description }),
      },
      include: { budgetRows: true },
    })

    res.json(shapeDepartment(updated))
  } catch (err) {
    next(err)
  }
})

export default router;
