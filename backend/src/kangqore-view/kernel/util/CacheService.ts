import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 600) {
    // stdTTL: the default time-to-live for each cached element in seconds
    // checkperiod: the period in seconds, as a number, used for the automatic delete check interval
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set a value in the cache
   */
  set(key: string, value: any, ttl?: number): boolean {
    if (ttl) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  /**
   * Delete a key from the cache
   */
  del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Flush all data from the cache
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   */
  getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }
}

// Singleton instance
export const cacheService = new CacheService();
