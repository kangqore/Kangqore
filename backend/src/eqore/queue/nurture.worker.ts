import { Worker } from 'bullmq';
import { redisConnection } from '../../lib/redis';
import logger from '../../utils/logger';
import { prisma } from '../../lib/prisma';
import { EqoreNurtureAgent } from '../agents/nurture.agent';
import { NurtureJob } from './eqore.queue';

export class EqoreNurtureWorker {
  private worker: Worker;

  constructor() {
    this.worker = new Worker('eqore-nurture', async (job) => {
      const { leadId } = job.data as NurtureJob;
      
      logger.info(`Processing Nurture Assets Job: ${job.id} for lead ${leadId}`);

      try {
        await EqoreNurtureAgent.generateNurtureAssets(leadId);
        logger.info(`Completed Nurture Assets Job: ${job.id}`);
      } catch (error) {
        logger.error(`Nurture Assets Job ${job.id} failed:`, error);
        throw error;
      }
    }, {
      connection: redisConnection,
      concurrency: 3
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Nurture Worker job ${job?.id} failed with ${err.message}`);
    });
  }
}

// Instantiate the worker
export const eqoreNurtureWorker = new EqoreNurtureWorker();
