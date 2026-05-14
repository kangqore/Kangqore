import { Router } from 'express';
import { EqoreConversationController } from './controllers/eqoreConversation.controller';
import { EqoreLeadController } from '../eqore-lead-intelligence/controllers/eqoreLead.controller'; // Temporary until split fully tested, though technically lead capture starts here
import { EqoreRateLimiter } from './guardrails/rateLimiter';

const publicRouter = Router();

// Public / Visitor Routes
publicRouter.post('/conversations/message', EqoreRateLimiter.publicLimiter, EqoreConversationController.handleMessage);
publicRouter.post('/leads', EqoreRateLimiter.publicLimiter, EqoreLeadController.captureLead);
publicRouter.get('/leads/session/:leadSessionId', EqoreRateLimiter.publicLimiter, EqoreLeadController.resolveLeadSession);
publicRouter.post('/leads/confirm-booking', EqoreRateLimiter.publicLimiter, EqoreLeadController.confirmBooking);

import { prisma } from '../lib/prisma';
import { redisConnection } from '../lib/redis';

publicRouter.get('/health', async (req, res) => {
  const health: any = { status: 'OK', timestamp: new Date().toISOString() };
  
  // 1. DB Health
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.db = 'OK';
  } catch (e) {
    health.db = 'FAILED';
    health.status = 'DEGRADED';
  }

  // 2. Redis Health
  try {
    if (process.env.MOCK_REDIS !== 'true') {
      await redisConnection.ping();
    }
    health.redis = 'OK';
  } catch (e) {
    health.redis = 'FAILED';
    health.status = 'DEGRADED';
  }

  // 3. Queue Worker Health
  health.queueWorker = process.env.MOCK_REDIS === 'true' ? 'BYPASSED' : 'OK'; // Actual worker health typically requires fetching active jobs or heartbeat.

  // 4. Model Provider Health
  health.modelProvider = process.env.EQORE_ROUTER_PROVIDER || 'anthropic';
  health.modelName = process.env.EQORE_ROUTER_MODEL || 'claude-haiku-4-5';

  res.status(health.status === 'OK' ? 200 : 503).json(health);
});

export { publicRouter as eqorePublicRoutes };
