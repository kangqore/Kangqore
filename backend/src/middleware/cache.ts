import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';

/**
 * Middleware to cache successful GET responses
 * @param durationSeconds Duration in seconds to cache the response
 */
export const cacheMiddleware = (durationSeconds: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate a simple cache key based on the URL (includes query params)
    const key = `__express__${req.originalUrl || req.url}`;
    
    // Try to get cached body
    const cachedBody = cacheService.get(key);

    if (cachedBody) {
      // Setup headers to indicate cache hit (optional but good for debugging)
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedBody);
    }
    
    // Cache miss - intercept response
    res.setHeader('X-Cache', 'MISS');
    
    // Override res.json to capture the body
    const originalJson = res.json;
    
    res.json = function(body: any): Response {
      // Restore original json function to avoid infinite loop if called again
      res.json = originalJson;

      // Cache the body if status is 200
      if (res.statusCode === 200) {
        cacheService.set(key, body, durationSeconds);
      }
      
      // Call original json
      return originalJson.call(this, body);
    };

    next();
  };
};
