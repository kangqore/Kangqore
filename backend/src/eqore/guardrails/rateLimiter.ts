import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { redisConnection } from '../../lib/redis';
import logger from '../../utils/logger';
import { prisma } from '../../lib/prisma';

// MOCK_REDIS bypass for testing environments
const isMockRedis = process.env.MOCK_REDIS === 'true';

const publicRateLimiter = new RateLimiterRedis({
  storeClient: redisConnection,
  keyPrefix: 'ratelimit_public',
  points: 10, // 10 requests
  duration: 60, // per 60 seconds by IP
});

const adminRateLimiter = new RateLimiterRedis({
  storeClient: redisConnection,
  keyPrefix: 'ratelimit_admin',
  points: 100, // 100 requests
  duration: 60, // per 60 seconds by User ID/IP
});

export class EqoreRateLimiter {
  static async publicLimiter(req: Request, res: Response, next: NextFunction) {
    if (isMockRedis) return next();

    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      await publicRateLimiter.consume(ip as string);
      next();
    } catch (rejRes) {
      logger.warn(`RATE_LIMIT_TRIGGERED for IP: ${req.ip}`);
      
      // Log abuse if lead is attached
      if (req.body.leadId) {
        await prisma.eqoreLeadEvent.create({
          data: {
            leadId: req.body.leadId,
            eventType: 'ABUSE_PATTERN_DETECTED',
            reason: 'Rate limit exceeded for public endpoint'
          }
        }).catch(() => {});
      }

      res.status(429).json({ error: 'Too Many Requests', message: 'You have exceeded the allowed request limit. Please try again later.' });
    }
  }

  static async adminLimiter(req: Request, res: Response, next: NextFunction) {
    if (isMockRedis) return next();

    try {
      const id = (req as any).user?.id || req.ip || 'unknown';
      await adminRateLimiter.consume(id as string);
      next();
    } catch (rejRes) {
      logger.warn(`RATE_LIMIT_TRIGGERED for Admin ID: ${(req as any).user?.id || req.ip}`);
      res.status(429).json({ error: 'Too Many Requests', message: 'Admin rate limit exceeded.' });
    }
  }
}
