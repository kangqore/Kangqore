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
