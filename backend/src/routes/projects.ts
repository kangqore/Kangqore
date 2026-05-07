import { Router, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

const projectSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('ACTIVE', 'COMPLETED', 'ARCHIVED').default('ACTIVE'),
  clientId: Joi.string().optional(), // Allowed for admin to assign to specific client
  partnerId: Joi.string().allow('', null).optional(), // Allowed for admin/client to assign a partner
  vision: Joi.string().allow('', null).optional(),
  visionWorkflows: Joi.object().optional(),
  visionStatus: Joi.string().valid('PENDING', 'APPROVED', 'REVISION_REQUESTED').optional(),
  visionClientFeedback: Joi.string().allow('', null).optional(),
  slaMetrics: Joi.object().optional()
});

// Get all projects for authenticated user
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user!.id;

    const where: any = {};

    if (req.user!.role === 'CLIENT') {
      where.clientId = userId;
    } else if (req.user!.role === 'PARTNER') {
      where.partnerId = userId;
    }

    if (status) {
      where.status = status;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        deliverables: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            company: true
          }
        },
        partner: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            deliverables: true,
            tasks: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string)
    });

    const total = await prisma.project.count({ where });

    res.json({
      projects,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single project
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const where: any = { id };

    if (req.user!.role === 'CLIENT') {
      where.clientId = userId;
    } else if (req.user!.role === 'PARTNER') {
      where.partnerId = userId;
    }

    const project = await prisma.project.findFirst({
      where,
      include: {
        deliverables: true,
        tasks: true,
        client: {
          select: {
            name: true,
            company: true,
            email: true
          }
        }
      }
    });

    if (!project) {
      throw createError('Project not found', 404);
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Create project
router.post('/', authenticate, authorize(['CLIENT', 'ADMIN', 'PARTNER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const targetClientId = (req.user!.role === 'ADMIN' && req.body.clientId) ? req.body.clientId : req.user!.id;

    const project = await prisma.project.create({
      data: {
        ...value,
        partnerId: value.partnerId || null,
        clientId: targetClientId
      },
      include: {
        client: {
          select: {
            name: true,
            company: true
          }
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// Update project
router.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error, value } = projectSchema.validate(req.body);
    
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const where: any = { id };
    if (req.user!.role === 'CLIENT') {
      where.clientId = req.user!.id;
    } else if (req.user!.role === 'PARTNER') {
      where.partnerId = req.user!.id;
    }

    const existingProject = await prisma.project.findFirst({
      where
    });

    if (!existingProject) {
      throw createError('Project not found', 404);
    }

    const project = await prisma.project.update({
      where: { id },
      data: value,
      include: {
        deliverables: true,
        tasks: true
      }
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Update Project Vision Status (Client Approval/Feedback)
router.post('/:id/vision/respond', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body; 

        const existing = await prisma.project.findFirst({ where: { id, clientId: req.user!.id } });
        if (!existing) throw createError('Project not found', 404);

        const project = await prisma.project.update({
            where: { id },
            data: { 
                visionStatus: status,
                visionClientFeedback: feedback || null
            }
        });

        res.json(project);
    } catch (error) { next(error); }
});

// Create Task for Project
router.post('/:id/tasks', authenticate, authorize(['CLIENT', 'ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, partnerId, priority, dueDate } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: 'todo',
        projectId: id,
        clientId: project.clientId,
        partnerId: partnerId || null // Optional assignment
      }
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const where: any = { id };
    if (req.user!.role === 'CLIENT') {
      where.clientId = req.user!.id;
    }

    const existingProject = await prisma.project.findFirst({
      where
    });

    if (!existingProject) {
      throw createError('Project not found', 404);
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Alignment Assurance (Pulse Endpoints)

// POST /api/projects/:id/pulse/admin (Update Internal Confidence)
router.post('/:id/pulse/admin', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { score } = req.body; // 0-100

        if (typeof score !== 'number' || score < 0 || score > 100) {
            return res.status(400).json({ message: 'Score must be 0-100' });
        }

        const project = await prisma.project.update({
            where: { id },
            data: { 
                adminConfidenceScore: score,
                lastAlignmentCheck: new Date()
            }
        });

        res.json(project);
    } catch (error) { next(error); }
});

// POST /api/projects/:id/pulse/client (Update Client Sentiment)
router.post('/:id/pulse/client', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { score } = req.body; // 0-100

        // Ensure client owns the project
        const existing = await prisma.project.findFirst({ where: { id, clientId: req.user!.id } });
        if (!existing) throw createError('Project not found', 404);

        const project = await prisma.project.update({
            where: { id },
            data: { 
                clientSentimentScore: score,
                lastAlignmentCheck: new Date()
            }
        });

        res.json(project);
    } catch (error) { next(error); }
});

export default router;
