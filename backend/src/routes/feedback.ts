import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Get all feedback for a project/client
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { projectId, clientId } = req.query;
        const where: any = {};

        if (projectId) where.projectId = projectId;
        if (clientId) where.clientId = clientId;

        // Security: Clients only see their own feedback
        if (req.user!.role === 'CLIENT') {
            where.clientId = req.user!.id;
        }

        const feedbacks = await prisma.clientFeedback.findMany({
            where,
            include: {
                client: { select: { name: true, company: true } },
                project: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(feedbacks);
    } catch (error) { next(error); }
});

// Submit Feedback (Client)
router.post('/', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { projectId, npsScore, comment, testimonial, isPublic, designation, clientName, idNumber, companyName, logoUrl, photoUrl } = req.body;

        if (!projectId || npsScore === undefined) {
            throw createError('Project ID and NPS Score are required', 400);
        }

        const feedback = await prisma.clientFeedback.create({
            data: {
                projectId,
                clientId: req.user!.id,
                npsScore,
                comment,
                testimonial,
                isPublic: isPublic || false,
                designation,
                clientName,
                idNumber,
                companyName,
                logoUrl,
                photoUrl,
                status: 'PENDING'
            }
        });

        res.status(201).json(feedback);
    } catch (error) { next(error); }
});

// Respond to Feedback (Admin)
router.patch('/:id/respond', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { adminResponse, status } = req.body;

        const feedback = await prisma.clientFeedback.update({
            where: { id },
            data: { 
                adminResponse,
                status: status || 'ACTIONED'
            }
        });

        res.json(feedback);
    } catch (error) { next(error); }
});

export default router;
