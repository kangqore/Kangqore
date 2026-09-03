import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../kangqore-view/kernel/auth/TokenService';

/**
 * Global rate limiting.
 *
 * This used to be a single bucket keyed on `req.ip`. Behind Docker's published
 * port — and behind any load balancer — every client arrives from the same
 * address, so *every user on the system shared one 1000-request window*. Proven
 * rather than assumed: 1000 requests from the host exhausted the bucket and
 * returned 429 to everything, while a request originating inside the container
 * still returned 200.
 *
 * That mattered because the OS home page costs 24 API calls to render. One
 * shared bucket therefore allowed roughly 41 page loads per 15 minutes across
 * the entire installation, after which the API returned 429 to everyone — and
 * a single tab left polling could lock out the whole system. It also produced
 * a confusing failure: some panels rendered and some did not, differently on
 * each load, because only part of a page's requests got through.
 *
 * So there are two buckets:
 *
 *   authenticated → keyed by the VERIFIED user id, one window per person
 *   everything else → keyed by IP, with the previous limit untouched
 *
 * The verification is the point. Keying on an unverified Authorization header
 * would let anyone mint an unlimited number of buckets by randomising it, which
 * is strictly worse than the shared bucket it replaced. Only a signature-valid
 * token earns its own window; anything else falls back to the IP bucket.
 */

const WINDOW_SECONDS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000;

/** Unauthenticated traffic. Deliberately unchanged — this is the abuse surface. */
const anonymousLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'),
  duration: WINDOW_SECONDS,
});

/**
 * Signed-in traffic, one window per user.
 *
 * Sized against what the product actually costs: the OS home is 24 calls, other
 * screens 10-20, plus background refetches every 120s. A 15-minute working
 * session lands near 700 requests, so 1000 left a real user with no headroom
 * and dev reloads exhausted it routinely. Abuse here is attributable to an
 * account and revocable, which anonymous traffic is not.
 */
const authenticatedLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_AUTHENTICATED || '3000'),
  duration: WINDOW_SECONDS,
});

/** The verified user id behind this request, or null if there isn't one. */
const verifiedUserId = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  try {
    return verifyAccessToken(header.substring(7))?.userId ?? null;
  } catch {
    return null;
  }
};

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = verifiedUserId(req);
  const limiter = userId ? authenticatedLimiter : anonymousLimiter;
  const key = userId ? `user:${userId}` : `ip:${req.ip || 'unknown'}`;

  try {
    await limiter.consume(key);
    next();
  } catch (rejRes: any) {
    const retryAfter = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(retryAfter));
    // Answered here rather than handed to the error handler, which serialises
    // as `{ error: { message, stack } }` in development. That leaks a stack
    // trace on a routine throttle, and clients rendering `error` directly
    // crash on the object.
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter,
      scope: userId ? 'user' : 'ip',
    });
  }
};

export { rateLimiterMiddleware as rateLimiter };
