import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { verifyAccessToken } from '../services/token.service';
import { createError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  // We rely on the global Express.User definition
  query: any;
  body: any;
  params: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided', 401);
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    
    if (!payload) {
      throw createError('Invalid token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        clearances: true,
      }
    });

    if (!user) {
      throw createError('User not found', 401);
    }

    req.user = {
      ...user,
      company: user.company || undefined,
      userId: user.id // Ensure compatibility with RBAC middleware
    } as any;
    next();
  } catch (error) {
    next(createError('Invalid token', 401));
  }
};

export const authorize = (roles: ('ADMIN' | 'CLIENT' | 'PARTNER' | 'INVESTOR' | 'JOB_SEEKER')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role as any)) {
      return next(createError('Insufficient permissions', 403));
    }

    next();
  };
};
