import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import accountabilityService from '../services/AccountabilityService';

const router = Router();

// Middleware to check project access
const requireProjectAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const userId = req.user!.id;
        const role = req.user!.role;

        if (role === 'ADMIN') {
            return next();
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { clientId: true }
        });

        if (!project || project.clientId !== userId) {
            throw createError('Access denied to this project ledger', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};

// GET /api/accountability/project/:projectId/ledger
// Shared view of the "Joint Truth"
router.get('/project/:projectId/ledger', authenticate, requireProjectAccess, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const ledger = await accountabilityService.getProjectAccountabilityLedger(projectId);
        const metrics = await accountabilityService.getAccountabilityMetrics(projectId);
        res.json({ ledger, metrics });
    } catch (error) { next(error); }
});

// GET /api/accountability/project/:projectId/obligations
// Shared view of "Responsibilities"
router.get('/project/:projectId/obligations', authenticate, requireProjectAccess, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const { status } = req.query;
        // @ts-ignore
        const obligations = await accountabilityService.getProjectObligations(projectId, status);
        res.json({ obligations });
    } catch (error) { next(error); }
});

export default router;
