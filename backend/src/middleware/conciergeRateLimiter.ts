import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

const chatLimiter = new RateLimiterMemory({
  points: parseInt(process.env.CONCIERGE_RATE_LIMIT_POINTS || '20', 10),
  duration: parseInt(process.env.CONCIERGE_RATE_LIMIT_DURATION || '300', 10),
} as any);

const burstLimiter = new RateLimiterMemory({
  points: parseInt(process.env.CONCIERGE_BURST_POINTS || '5', 10),
  duration: parseInt(process.env.CONCIERGE_BURST_DURATION || '60', 10),
} as any);

const leadLimiter = new RateLimiterMemory({
  points: parseInt(process.env.CONCIERGE_LEAD_POINTS || '5', 10),
  duration: parseInt(process.env.CONCIERGE_LEAD_DURATION || '600', 10),
} as any);

export const conciergeChatLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.ip || 'unknown';
  try {
    await burstLimiter.consume(key);
    await chatLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const secs = Math.round((rejRes.msBeforeNext || 60000) / 1000) || 1;
    res.set('Retry-After', String(secs));
    next(createError('Too Many Requests', 429));
  }
};

export const conciergeLeadLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.ip || 'unknown';
  try {
    await leadLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const secs = Math.round((rejRes.msBeforeNext || 60000) / 1000) || 1;
    res.set('Retry-After', String(secs));
    next(createError('Too Many Requests', 429));
  }
};
