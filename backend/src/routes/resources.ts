import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { Response, NextFunction } from 'express';

const router = Router();
const prisma = new PrismaClient();

function shapeMember(m: Awaited<ReturnType<typeof prisma.staffMember.findMany>>[0] & {
  allocations: {
    id: string; projectId: string; projectName: string; projectColor: string;
    hoursPerWeek: number; allocationPct: number; startDate: Date; endDate: Date;
  }[]
}) {
  return {
    id:           m.id,
    name:         m.name,
    role:         m.role,
    department:   m.department,
    email:        m.email,
    location:     m.location,
    skills:       m.skills,
    status:       m.status,
    utilization:  m.utilization,
    availability: m.availability,
    billableRate: m.billableRate,
    joinDate:     m.joinDate.toISOString().slice(0, 10),
    projectIds:   m.allocations.map(a => a.projectId),
    allocations:  m.allocations.map(a => ({
      id:            a.id,
      memberId:      m.id,
      memberName:    m.name,
      projectId:     a.projectId,
      projectName:   a.projectName,
      projectColor:  a.projectColor,
      hoursPerWeek:  a.hoursPerWeek,
      allocationPct: a.allocationPct,
      startDate:     a.startDate.toISOString().slice(0, 10),
      endDate:       a.endDate.toISOString().slice(0, 10),
    })),
  }
}

// GET /api/resources — team members with their allocations
router.get('/', authenticate, authorize(['ADMIN']), async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const members = await prisma.staffMember.findMany({
      include: { allocations: true },
      orderBy: { name: 'asc' },
    })

    const shaped = members.map(shapeMember)
    const allocations = shaped.flatMap(m => m.allocations)

    res.json({ team: shaped, allocations })
  } catch (err) {
    next(err)
  }
})

// GET /api/resources/project-finance — allocation burn by project, merged with Project budget
router.get('/project-finance', authenticate, authorize(['ADMIN']), async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allocations = await prisma.staffAllocation.findMany({
      include: { member: { select: { billableRate: true } } },
    })

    const members = await prisma.staffMember.findMany({
      select: { id: true, billableRate: true },
    })
    const rateMap = new Map(members.map(m => [m.id, m.billableRate ?? 0]))

    // Group allocations by projectId
    const byProject = new Map<string, {
      projectId: string; projectName: string; projectColor: string;
      totalHoursPerWeek: number; estimatedWeeks: number; estimatedCost: number;
      memberCount: number;
    }>()

    const now = new Date()
    for (const a of allocations) {
      const endDate    = new Date(a.endDate)
      const startDate  = new Date(a.startDate)
      const weeksLeft  = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (7 * 86_400_000)))
      const weeksTotal = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 86_400_000)))
      const rate       = rateMap.get(a.memberId) ?? 0
      const costAlloc  = a.hoursPerWeek * weeksTotal * rate

      if (!byProject.has(a.projectId)) {
        byProject.set(a.projectId, {
          projectId: a.projectId, projectName: a.projectName, projectColor: a.projectColor,
          totalHoursPerWeek: 0, estimatedWeeks: weeksTotal, estimatedCost: 0, memberCount: 0,
        })
      }
      const row = byProject.get(a.projectId)!
      row.totalHoursPerWeek += a.hoursPerWeek
      row.estimatedCost     += costAlloc
      row.memberCount       += 1
      row.estimatedWeeks     = Math.max(row.estimatedWeeks, weeksTotal)
    }

    // Merge with Project table budget where projectId matches
    let projects: any[] = []
    try {
      projects = await (prisma as any).project.findMany({
        select: { id: true, title: true, budget: true, spend: true, status: true },
      })
    } catch { /* Project table may not be seeded */ }

    const budgetMap = new Map(projects.map((p: any) => [p.id, p]))

    const rows = [...byProject.values()].map(row => {
      const proj = budgetMap.get(row.projectId)
      return {
        ...row,
        budget:       proj ? Number(proj.budget ?? 0) : null,
        spend:        proj ? Number(proj.spend  ?? 0) : null,
        projectTitle: proj?.title ?? row.projectName,
        projectStatus: proj?.status ?? null,
      }
    })

    res.json({ rows })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/resources/team/:id — update utilization, availability, or status
router.patch('/team/:id', authenticate, authorize(['ADMIN']), async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { utilization, availability, status } = req.body
    const updated = await prisma.staffMember.update({
      where: { id: req.params.id },
      data: {
        ...(utilization  !== undefined && { utilization:  Number(utilization) }),
        ...(availability !== undefined && { availability: Number(availability) }),
        ...(status       !== undefined && { status }),
        updatedAt: new Date(),
      },
    })
    res.json({ member: updated })
  } catch (err) {
    next(err)
  }
})

export default router
