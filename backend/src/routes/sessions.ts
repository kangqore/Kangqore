import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, AuthRequest } from '../middleware/rbac';
import { 
  createSession, 
  refreshSession, 
  getUserSessions, 
  deleteSession, 
  deleteAllUserSessions,
  deleteSessionByToken 
} from '../kangqore-view/kernel/auth/SessionService';
import { createAuditLog, extractRequestMetadata, AUDIT_ACTIONS } from '../kangqore-view/kernel/audit/AuditService';
import { verifyRefreshToken } from '../kangqore-view/kernel/auth/TokenService';

const router = Router();

/**
 * GET /api/sessions/me
 * Get all active sessions for current user
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const sessions = await getUserSessions(userId);

    // Map sessions to safe response format
    const safeSessions = sessions.map(session => ({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      lastActive: session.lastActive,
      createdAt: session.createdAt
    }));

    res.json({ sessions: safeSessions });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/sessions/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: { message: 'Refresh token is required' } });
    }

    const newTokens = await refreshSession(refreshToken);

    if (!newTokens) {
      return res.status(401).json({ error: { message: 'Invalid or expired refresh token' } });
    }

    res.json({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/sessions/logout
 * Logout from current session
 */
router.post('/logout', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await deleteSessionByToken(refreshToken);
    }

    // Create audit log
    const metadata = extractRequestMetadata(req);
    await createAuditLog({
      userId: req.user!.userId,
      action: AUDIT_ACTIONS.LOGOUT,
      ...metadata
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/sessions/logout-all
 * Logout from all sessions (all devices)
 */
router.post('/logout-all', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const count = await deleteAllUserSessions(userId);

    // Create audit log
    const metadata = extractRequestMetadata(req);
    await createAuditLog({
      userId,
      action: AUDIT_ACTIONS.LOGOUT_ALL,
      newValue: { sessionsDeleted: count },
      ...metadata
    });

    res.json({ 
      message: 'Logged out from all devices successfully',
      sessionsDeleted: count
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/sessions/:sessionId
 * Delete a specific session
 */
router.delete('/:sessionId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.userId;

    // Verify session belongs to user
    const sessions = await getUserSessions(userId);
    const sessionExists = sessions.some(s => s.id === sessionId);

    if (!sessionExists) {
      return res.status(403).json({ error: { message: 'Session not found or unauthorized' } });
    }

    await deleteSession(sessionId);

    // Create audit log
    const metadata = extractRequestMetadata(req);
    await createAuditLog({
      userId,
      action: AUDIT_ACTIONS.LOGOUT,
      resource: `session:${sessionId}`,
      ...metadata
    });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
