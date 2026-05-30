import { Router, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

/**
 * GET /api/scheduling/audit
 * Get recent scheduling audit logs for the current user.
 */
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;

    // We fetch logs where action starts with 'scheduling.'
    // If the user is an admin, they might see all. For now, restrict to logs tied to their ID or where they are the host.
    // Our AuditLogger sets userId to the hostId in bookEvent/cancelEvent.
    
    const logs = await prisma.auditLog.findMany({
      where: {
        userId,
        action: { startsWith: 'scheduling.' }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    next(error);
  }
});

export default router;
