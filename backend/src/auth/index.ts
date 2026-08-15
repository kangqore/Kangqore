/**
 * Auth Module - Centralized authentication and authorization
 * 
 * This module consolidates all auth-related functionality:
 * - JWT authentication middleware
 * - Role-based access control (RBAC)
 * - Session management
 * - Token utilities
 */

// Re-export from middleware
export { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
export { 
  requireAuth, 
  requireRole, 
  blockRoleModification, 
  validateEmployeeEmail, 
  requireOwnResourceOrAdmin, 
  AuthRequest 
} from '../middleware/rbac';

// Re-export from services - Session management
export { 
  createSession, 
  refreshSession, 
  getUserSessions, 
  deleteSession, 
  deleteAllUserSessions, 
  deleteSessionByToken, 
  cleanupExpiredSessions, 
  updateSessionActivity 
} from '../kangqore-view/kernel/auth/SessionService';

// Re-export from services - Token management
export { 
  generateTokenPair, 
  verifyAccessToken, 
  verifyRefreshToken, 
  decodeToken, 
  isTokenExpired 
} from '../kangqore-view/kernel/auth/TokenService';

// Re-export from utils
export { hashPassword, comparePassword } from '../utils/password';
export { generateToken, verifyToken, extractTokenFromHeader } from '../utils/jwt';
