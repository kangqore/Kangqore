import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

const prisma = new PrismaClient();

export interface AuditLogData {
  userId?: string;
  action: string;
  resource?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create an audit log entry
 */
export const createAuditLog = async (data: AuditLogData): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        oldValue: data.oldValue,
        newValue: data.newValue,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging should never break the main flow
  }
};

/**
 * Helper to extract IP and User-Agent from Express request
 */
export const extractRequestMetadata = (req: Request): { ipAddress?: string; userAgent?: string } => {
  return {
    ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip,
    userAgent: req.headers['user-agent']
  };
};

/**
 * Get audit logs for a specific user
 */
export const getUserAuditLogs = async (userId: string, limit: number = 50) => {
  return await prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
};

/**
 * Get audit logs by action type
 */
export const getAuditLogsByAction = async (action: string, limit: number = 100) => {
  return await prisma.auditLog.findMany({
    where: { action },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
};

/**
 * Get all audit logs (admin only)
 */
export const getAllAuditLogs = async (page: number = 1, limit: number = 50) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    }),
    prisma.auditLog.count()
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

// Audit action constants
export const AUDIT_ACTIONS = {
  // Authentication & Session
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGOUT_ALL: 'LOGOUT_ALL',
  OAUTH_LOGIN: 'OAUTH_LOGIN',
  
  // Password Management
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  
  // User Management
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  ROLE_CHANGED: 'ROLE_CHANGED',
  
  // Governance: Risks
  RISK_CREATED: 'RISK_CREATED',
  RISK_UPDATED: 'RISK_UPDATED',
  RISK_ACCEPTED: 'RISK_ACCEPTED',
  RISK_ESCALATED: 'RISK_ESCALATED',
  
  // Governance: Decisions
  DECISION_CREATED: 'DECISION_CREATED',
  DECISION_APPROVED: 'DECISION_APPROVED',
  DECISION_REJECTED: 'DECISION_REJECTED',
  
  // Governance: Change Requests
  CHANGE_REQUEST_SUBMITTED: 'CHANGE_REQUEST_SUBMITTED',
  CHANGE_REQUEST_APPROVED: 'CHANGE_REQUEST_APPROVED',
  CHANGE_REQUEST_REJECTED: 'CHANGE_REQUEST_REJECTED',
  
  // Governance: Deliverables
  DELIVERABLE_SUBMITTED: 'DELIVERABLE_SUBMITTED',
  DELIVERABLE_ACCEPTED: 'DELIVERABLE_ACCEPTED',
  DELIVERABLE_REJECTED: 'DELIVERABLE_REJECTED',
  
  // Security
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  ACCOUNT_REACTIVATED: 'ACCOUNT_REACTIVATED',

  // RBAC / PermissionScope
  PERMISSION_GRANTED:      'PERMISSION_GRANTED',
  PERMISSION_REVOKED:      'PERMISSION_REVOKED',
  PERMISSION_CHECKED_PASS: 'PERMISSION_CHECKED_PASS',
  PERMISSION_CHECKED_DENY: 'PERMISSION_CHECKED_DENY',
} as const;
