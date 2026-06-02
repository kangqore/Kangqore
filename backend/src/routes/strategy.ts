import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';
import type { Response, NextFunction } from 'express';

const router = Router();
const prisma = new PrismaClient();

// Helper — shape a pillar row into the frontend Pillar type
function shapePillar(p: Awaited<ReturnType<typeof prisma.strategicPillar.findMany>>[0] & {
  _count?: { objectives: number; programs: number }
}) {
  return {
    id:           p.id,
    name:         p.name,
    description:  p.description,
    color:        p.color,
    owner:        p.owner,
    health:       p.health,
    budget:       p.budget,
    spent:        p.spent,
    okrCount:     p._count?.objectives ?? 0,
    programCount: p._count?.programs ?? 0,
  }
}

// Helper — shape an objective + key results into the frontend Objective type
function shapeObjective(o: Awaited<ReturnType<typeof prisma.strategicObjective.findMany>>[0] & {
  pillar: { name: string; color: string };
  keyResults: { id: string; title: string; current: number; target: number; unit: string; status: string }[];
}) {
  return {
    id:          o.id,
    pillarId:    o.pillarId,
    pillarName:  o.pillar.name,
    pillarColor: o.pillar.color,
    quarter:     o.quarter,
    title:       o.title,
    description: o.description,
    owner:       o.owner,
    status:      o.status,
    progress:    o.progress,
    keyResults:  o.keyResults.map(kr => ({
      id:          kr.id,
      objectiveId: o.id,
      title:       kr.title,
      current:     kr.current,
      target:      kr.target,
      unit:        kr.unit,
      progress:    kr.target > 0 ? Math.round((kr.current / kr.target) * 100) : 0,
      status:      kr.status,
    })),
  }
}

// Helper — shape a program row into the frontend Program type
function shapeProgram(p: Awaited<ReturnType<typeof prisma.strategicProgram.findMany>>[0] & {
  pillar: { name: string; color: string }
}) {
  return {
    id:          p.id,
    pillarId:    p.pillarId,
    pillarName:  p.pillar.name,
    pillarColor: p.pillar.color,
    name:        p.name,
    description: p.description,
    status:      p.status,
    health:      p.health,
    owner:       p.owner,
    budget:      p.budget,
    spent:       p.spent,
    progress:    p.progress,
    teamSize:    p.teamSize,
    startDate:   p.startDate.toISOString().slice(0, 10),
    endDate:     p.endDate.toISOString().slice(0, 10),
  }
}

// GET /api/strategy — pillars + objectives + programs in one shot
router.get('/', authenticate, authorize(['ADMIN']), async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [pillarRows, objectiveRows, programRows] = await Promise.all([
      prisma.strategicPillar.findMany({
        include: { _count: { select: { objectives: true, programs: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.strategicObjective.findMany({
        include: { pillar: true, keyResults: true },
        orderBy: { quarter: 'asc' },
      }),
      prisma.strategicProgram.findMany({
        include: { pillar: true },
        orderBy: { name: 'asc' },
      }),
    ])

    res.json({
      pillars:    pillarRows.map(shapePillar),
      objectives: objectiveRows.map(shapeObjective),
      programs:   programRows.map(shapeProgram),
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/strategy/objectives/:id — update status and/or progress
router.patch('/objectives/:id', authenticate, authorize(['ADMIN']), async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, progress } = req.body
    const updated = await prisma.strategicObjective.update({
      where: { id: req.params.id },
      data: {
        ...(status   !== undefined && { status }),
        ...(progress !== undefined && { progress: Number(progress) }),
        updatedAt: new Date(),
      },
    })
    res.json({ objective: updated })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/strategy/key-results/:id — update current value (and recompute status)
router.patch('/key-results/:id', authenticate, authorize(['ADMIN']), async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { current, status } = req.body
    const updated = await prisma.keyResult.update({
      where: { id: req.params.id },
      data: {
        ...(current !== undefined && { current: Number(current) }),
        ...(status  !== undefined && { status }),
        updatedAt: new Date(),
      },
    })
    res.json({ keyResult: updated })
  } catch (err) {
    next(err)
  }
})

export default router
