import { prisma } from '../lib/prisma';
import { workflowService } from '../kangqore-view/automation/WorkflowService';
import logger from '../utils/logger';

export class WorkflowExecutor {
  /**
   * Called by CronManager every 15 minutes.
   * Finds pending workflow jobs that are scheduled for now or in the past, and executes them.
   */
  static async run() {
    try {
      const pendingJobs = await prisma.workflowJob.findMany({
        where: {
          status: 'PENDING',
          scheduledFor: {
            lte: new Date()
          }
        },
        take: 100 // Process in batches
      });

      if (pendingJobs.length > 0) {
        logger.info(`[WorkflowExecutor] Found ${pendingJobs.length} pending jobs to execute.`);
      }

      for (const job of pendingJobs) {
        try {
          await workflowService.executeJob(job.id);
        } catch (error) {
          logger.error(`[WorkflowExecutor] Error executing job ${job.id}:`, error);
        }
      }
    } catch (error) {
      logger.error('[WorkflowExecutor] Error running batch:', error);
    }
  }
}
