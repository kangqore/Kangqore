import { Queue } from 'bullmq';
import { redisConnection } from '../../lib/redis';
import logger from '../../utils/logger';

export interface ShadowAnalysisJob {
  conversationId: string;
  leadId: string;
  latestMessageId: string;
}

export interface NurtureJob {
  leadId: string;
}

export interface EqoreQueue {
  enqueueShadowAnalysis(payload: ShadowAnalysisJob): Promise<void>;
  enqueueNurture(payload: NurtureJob): Promise<void>;
}

export class BullMqEqoreQueue implements EqoreQueue {
  private shadowQueue: Queue;
  private nurtureQueue: any;

  constructor() {
    if (process.env.MOCK_REDIS === 'true') {
      logger.info('MOCK_REDIS enabled. Bypassing BullMQ initialization.');
      this.shadowQueue = { add: async () => {} } as any;
      this.nurtureQueue = { add: async () => {} } as any;
      return;
    }

    const defaultJobOptions = {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000 // 2s, 4s, 8s
      },
      removeOnComplete: 100,
      removeOnFail: false // Keep failed jobs in DLQ
    };

    this.shadowQueue = new Queue('eqore-shadow-analysis', {
      connection: redisConnection,
      defaultJobOptions
    });

    this.nurtureQueue = new Queue('eqore-nurture', {
      connection: redisConnection,
      defaultJobOptions
    });

    // Worker Health Logging (if events were supported on Queue in this bullmq version, 
    // otherwise we log during enqueue/dequeue).
    logger.info('BullMQ Queues initialized with DLQ and Exponential Backoff.');
  }

  async enqueueShadowAnalysis(payload: ShadowAnalysisJob): Promise<void> {
    const jobId = `shadow:${payload.conversationId}:${payload.latestMessageId}`;
    
    try {
      await this.shadowQueue.add('analyze-shadow-lead', payload, {
        jobId,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 3000,
        }
      });
      logger.info(`Enqueued Shadow Analysis Job: ${jobId}`);
    } catch (err) {
      logger.error(`Failed to enqueue Shadow Analysis Job: ${jobId}`, err);
    }
  }

  async enqueueNurture(payload: NurtureJob): Promise<void> {
    const jobId = `nurture:${payload.leadId}:${Date.now()}`;
    try {
      await this.nurtureQueue.add('generate-nurture-assets', payload, {
        jobId,
        attempts: 2,
        backoff: { type: 'exponential', delay: 5000 }
      });
      logger.info(`Enqueued Nurture Job: ${jobId}`);
    } catch (err) {
      logger.error(`Failed to enqueue Nurture Job: ${jobId}`, err);
    }
  }
}

export const eqoreQueue = new BullMqEqoreQueue();
