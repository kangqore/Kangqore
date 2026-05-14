import IORedis from 'ioredis';
import logger from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// MOCK_REDIS disables real connection attempts for E2E tests without Docker
export const redisConnection = process.env.MOCK_REDIS === 'true' 
  ? {
      on: () => {},
      get: async () => null,
      set: async () => 'OK',
      setex: async () => 'OK',
      del: async () => 1,
      ping: async () => 'PONG',
      quit: async () => 'OK'
    } as any
  : new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

if (process.env.MOCK_REDIS === 'true') {
  logger.info('Redis Mocked: Using in-memory no-op provider');
} else {
  redisConnection.on('error', (err: Error) => {
    logger.error('Redis Connection Error:', err);
  });

  redisConnection.on('connect', () => {
    logger.info('Connected to Redis for eQORE Queues');
  });
}
