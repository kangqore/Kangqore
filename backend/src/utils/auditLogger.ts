import { prisma } from '../lib/prisma';
import logger from './logger';

export class AuditLogger {
  /**
   * Log an action to the AuditLog table
   */
  static async log(
    action: string,
    userId: string | null,
    resource: string | null = null,
    oldValue: any = null,
    newValue: any = null,
    ipAddress: string | null = null,
    userAgent: string | null = null
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          userId,
          resource,
          oldValue,
          newValue,
          ipAddress,
          userAgent
        }
      });
    } catch (error) {
      logger.error('Failed to write to AuditLog', { action, userId, error });
    }
  }
}
