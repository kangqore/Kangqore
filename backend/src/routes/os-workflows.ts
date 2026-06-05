import { Router, Response, NextFunction } from 'express'
import { PrismaClient }                   from '@prisma/client'
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

/**
 * GET /api/os-workflows
 * List all automation workflows.
 */
router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, status } = req.query
    const where: Record<string, string> = {}
    if (category && category !== 'all') where.category = String(category)
    if (status   && status   !== 'all') where.status   = String(status)

    const workflows = await prisma.osWorkflow.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })
    res.json({ workflows })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/os-workflows/runs
 * Recent run log across all workflows (most recent first).
 */
router.get('/runs', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100)
    const runs = await prisma.osWorkflowRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: limit,
    })
    res.json({ runs })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/os-workflows/:id
 * Single workflow with its recent runs.
 */
router.get('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const workflow = await prisma.osWorkflow.findUnique({
      where: { id: req.params.id },
      include: {
        runs: { orderBy: { startedAt: 'desc' }, take: 20 },
      },
    })
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' })
    res.json({ workflow })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/os-workflows
 * Create a new workflow.
 */
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, category, triggerType, triggerConfig, steps, owner, tags } = req.body
    if (!name || !triggerType) return res.status(400).json({ error: 'name and triggerType are required' })

    const workflow = await prisma.osWorkflow.create({
      data: {
        name, description: description ?? '', category: category ?? 'ops',
        status: 'draft', triggerType, triggerConfig: triggerConfig ?? '',
        steps: steps ?? [], owner: owner ?? '', tags: tags ?? [],
      },
    })
    res.status(201).json({ workflow })
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/os-workflows/:id
 * Update a workflow (status, config, steps, etc.).
 */
router.patch('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const allowed = ['name', 'description', 'category', 'status', 'triggerType', 'triggerConfig', 'steps', 'nextRun', 'owner', 'tags']
    const data: Record<string, unknown> = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key]
    }
    const workflow = await prisma.osWorkflow.update({ where: { id: req.params.id }, data })
    res.json({ workflow })
  } catch (err) {
    next(err)
  }
})

/**
 * DELETE /api/os-workflows/:id
 * Archive (soft-delete) a workflow.
 */
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.osWorkflow.update({
      where: { id: req.params.id },
      data:  { status: 'archived' },
    })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/os-workflows/:id/runs
 * Record a manual run result.
 */
router.post('/:id/runs', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const wf = await prisma.osWorkflow.findUnique({ where: { id: req.params.id } })
    if (!wf) return res.status(404).json({ error: 'Workflow not found' })

    const { status = 'completed', duration, triggeredBy = 'Manual', stepsCompleted, errorMessage } = req.body
    const now = new Date()
    const run = await prisma.osWorkflowRun.create({
      data: {
        workflowId:     wf.id,
        workflowName:   wf.name,
        status,
        startedAt:      now,
        completedAt:    now,
        duration:       duration ?? null,
        triggeredBy,
        stepsCompleted: stepsCompleted ?? (wf.steps as unknown[]).length,
        stepsTotal:     (wf.steps as unknown[]).length,
        errorMessage:   errorMessage ?? null,
      },
    })

    // Update aggregate counters on the workflow
    await prisma.osWorkflow.update({
      where: { id: wf.id },
      data: {
        lastRun:    now,
        runsTotal:   { increment: 1 },
        runsSuccess: status === 'completed' ? { increment: 1 } : undefined,
        runsFailed:  status === 'failed'    ? { increment: 1 } : undefined,
      },
    })

    res.status(201).json({ run })
  } catch (err) {
    next(err)
  }
})

export default router
