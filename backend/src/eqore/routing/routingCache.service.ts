/**
 * eQORE Intent Gateway — Routing Cache Service (Phase 6)
 * 
 * Caches intent routing decisions using Redis to save LLM tokens and latency.
 */

import { redisConnection as redisClient } from '../../lib/redis';
import crypto from 'crypto';
import { EqoreRoutingDecision } from './intentSchema';
import logger from '../../utils/logger';

export class RoutingCacheService {
  /**
   * Retrieves a cached routing decision.
   */
  static async get(message: string): Promise<EqoreRoutingDecision | null> {
    try {
      const key = this.getCacheKey(message);
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data) as EqoreRoutingDecision;
      }
      return null;
    } catch (error) {
      logger.warn('RoutingCacheService.get failed:', error);
      return null;
    }
  }

  /**
   * Caches a routing decision.
   * TTL is shorter for LLM classifier, longer for deterministic.
   */
  static async set(message: string, decision: EqoreRoutingDecision): Promise<void> {
    // Do not cache UNKNOWN or FALLBACK to avoid poisoning the cache
    if (decision.intent === 'UNKNOWN' || decision.source === 'FALLBACK') {
      return;
    }

    try {
      const key = this.getCacheKey(message);
      const ttlHours = decision.source === 'DETERMINISTIC' ? 24 : 3;
      const ttlSeconds = ttlHours * 3600;

      // Mark the source as CACHE for future retrievals
      const cachedDecision = {
        ...decision,
        source: 'CACHE'
      };

      await redisClient.setex(key, ttlSeconds, JSON.stringify(cachedDecision));
    } catch (error) {
      logger.warn('RoutingCacheService.set failed:', error);
    }
  }

  private static getCacheKey(message: string): string {
    const normalized = message.toLowerCase().trim().replace(/\s+/g, ' ');
    const hash = crypto.createHash('sha256').update(normalized).digest('hex');
    return `eqore:route:v1:${hash}`;
  }
}
