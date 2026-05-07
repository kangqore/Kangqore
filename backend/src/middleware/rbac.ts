import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.service';
import { createAuditLog, extractRequestMetadata, AUDIT_ACTIONS } from '../services/audit.service';

/**
 * Extended Request interface with user data
 */
// Extended Request interface is no longer strictly needed if we augmented Express.User,
// but for backward compatibility and specific JWT typing, we can keep it compatible.
export interface AuthRequest extends Request {
  // We don't need to redefine user if Express.User is augmented, 
  // but to match previous specific JWT shape:
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: { message: 'No authorization token provided' } });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = verifyAccessToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: { message: 'Invalid or expired token. Verification failed in RBAC.' } });
    }

    // Attach user to request
    // Attach user to request
    // Payload from verifyAccessToken is { userId, role, sessionId }
    req.user = payload as any; // Cast to avoid strict type mismatch if Express.User differs slightly
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: { message: 'Authentication failed' } });
  }
};

/**
 * Middleware to require specific role(s)
 * Usage: requireRole(['ADMIN', 'CLIENT'])
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: { message: 'Authentication required' } });
      }

      const userRole = req.user.role;

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(userRole)) {
        // Log unauthorized access attempt
        const metadata = extractRequestMetadata(req);
        await createAuditLog({
          userId: req.user.userId,
          action: AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
          resource: req.path,
          newValue: {
            attemptedAccess: req.path,
            userRole,
            requiredRoles: allowedRoles
          },
          ...metadata
        });

        return res.status(403).json({ 
          error: { 
            message: 'Insufficient permissions',
            required: allowedRoles,
            current: userRole
          } 
        });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({ error: { message: 'Authorization check failed' } });
    }
  };
};

/**
 * Middleware to block any attempt to modify user role
 */
export const blockRoleModification = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check if request body contains role field
  if (req.body && 'role' in req.body) {
    const metadata = extractRequestMetadata(req);
    
    // Log the attempt
    createAuditLog({
      userId: req.user?.userId,
      action: AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
      resource: 'user.role',
      newValue: { attemptedRole: req.body.role },
      ...metadata
    });

    return res.status(403).json({ 
      error: { message: 'Role modification is not allowed. Contact administrator.' } 
    });
  }

  next();
};

/**
 * Middleware to verify email domain for EMPLOYEE role
 */
export const validateEmployeeEmail = (allowedDomains: string[] = ['kangqore.com']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { email, role } = req.body;

    // Only apply to EMPLOYEE role
    if (role === 'EMPLOYEE' && email) {
      const emailDomain = email.split('@')[1];
      
      if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({
          error: {
            message: `Employee email must be from allowed domains: ${allowedDomains.join(', ')}`,
            field: 'email'
          }
        });
      }
    }

    next();
  };
};

/**
 * Middleware to ensure user can only access their own resources
 * unless they're an admin
 */
export const requireOwnResourceOrAdmin = (userIdParam: string = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Authentication required' } });
    }

    const requestedUserId = req.params[userIdParam] || req.body[userIdParam];
    const currentUserId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && requestedUserId !== currentUserId) {
      const metadata = extractRequestMetadata(req);
      createAuditLog({
        userId: currentUserId,
        action: AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
        resource: req.path,
        newValue: {
          requestedUserId,
          currentUserId
        },
        ...metadata
      });

      return res.status(403).json({ 
        error: { message: 'You can only access your own resources' } 
      });
    }

    next();
  };
};
