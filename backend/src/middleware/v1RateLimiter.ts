import { Request, Response, NextFunction } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'

// 60 requests per minute per API key — stricter than the global 1000/15min IP limiter
const limiter = new RateLimiterMemory({
  points:   60,
  duration: 60,
})

export async function v1RateLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
  const key = (req as any).apiKey?.prefix ?? req.ip ?? 'unknown'
  try {
    const result = await limiter.consume(key)
    res.setHeader('X-RateLimit-Limit',     '60')
    res.setHeader('X-RateLimit-Remaining', String(result.remainingPoints))
    res.setHeader('X-RateLimit-Reset',     String(Math.ceil(Date.now() / 1000) + Math.ceil(result.msBeforeNext / 1000)))
    next()
  } catch (rej: any) {
    res.setHeader('Retry-After', String(Math.ceil(rej.msBeforeNext / 1000)))
    res.status(429).json({
      error:       'Rate limit exceeded',
      retryAfter:  Math.ceil(rej.msBeforeNext / 1000),
      limit:       60,
      windowSecs:  60,
    })
  }
}
