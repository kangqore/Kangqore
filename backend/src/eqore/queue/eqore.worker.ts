/**
 * eQORE Worker Process Entrypoint
 *
 * This is the standalone BullMQ worker process for staging/production.
 * Run separately from the API server:
 *
 *   npm run start:eqore-worker
 *
 * CTO requirement: BullMQ workers must run as a separate process with
 * their own Redis connection using maxRetriesPerRequest: null.
 */

import './config/env'; // Load env vars first

import logger from '../../utils/logger';
import { eqoreShadowWorker } from './shadowLead.worker';
import { eqoreNurtureWorker } from './nurture.worker';

logger.info('eQORE Worker Process starting...');
logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`MOCK_REDIS: ${process.env.MOCK_REDIS || 'false'}`);

if (process.env.MOCK_REDIS === 'true') {
  logger.error('FATAL: Cannot start worker process with MOCK_REDIS=true. This is a staging/production process.');
  process.exit(1);
}

// Workers are instantiated on import — just log that they are active
logger.info('Shadow Lead Worker: ACTIVE');
logger.info('Nurture Worker: ACTIVE');
logger.info('eQORE Worker Process ready. Waiting for jobs...');

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.warn('SIGTERM received. Shutting down workers gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.warn('SIGINT received. Shutting down workers gracefully...');
  process.exit(0);
});
