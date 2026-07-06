import IORedis from 'ioredis';
import logger from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// ─── In-memory fallback cache ─────────────────────────────────────────────────
// Used when Redis is unavailable. Entries expire using setTimeout.
// Non-persistent — cache is lost on restart, which is acceptable for a fallback.

interface CacheEntry { value: string; expiresAt: number }
const _mem = new Map<string, CacheEntry>()

const _memCache = {
  get: async (key: string) => {
    const e = _mem.get(key)
    if (!e) return null
    if (Date.now() > e.expiresAt) { _mem.delete(key); return null }
    return e.value
  },
  set: async (key: string, value: string) => {
    _mem.set(key, { value, expiresAt: Date.now() + 3_600_000 }); return 'OK' as const
  },
  setex: async (key: string, ttl: number, value: string) => {
    _mem.set(key, { value, expiresAt: Date.now() + ttl * 1000 }); return 'OK' as const
  },
  del: async (key: string) => { _mem.delete(key); return 1 as const },
  ping: async () => 'PONG' as const,
  quit: async () => 'OK' as const,
  on:   (_: string, __: any) => {},
}

// ─── Resilient wrapper ────────────────────────────────────────────────────────
// Wraps the real IORedis client. On any operation error, transparently falls back
// to the in-memory cache and tracks degraded state for health checks.

let _degraded  = false
let _degradedAt: number | null = null

function _makeDegradedAt() {
  if (!_degraded) {
    _degraded   = true
    _degradedAt = Date.now()
    logger.warn('[Redis] Connection lost — switched to in-memory fallback cache')
  }
}

function _makeRecovered() {
  if (_degraded) {
    _degraded   = false
    _degradedAt = null
    logger.info('[Redis] Connection restored — back to Redis')
  }
}

function _wrap(client: IORedis): typeof _memCache & IORedis {
  const proxy = new Proxy(client, {
    get(target, prop) {
      const original = (target as any)[prop]
      if (typeof original !== 'function') return original
      if (['on', 'off', 'once', 'emit', 'removeListener', 'quit', 'disconnect',
           'setMaxListeners', 'getMaxListeners', 'listeners', 'rawListeners',
           'eventNames', 'listenerCount'].includes(String(prop))) {
        return original.bind(target)
      }
      return async (...args: any[]) => {
        try {
          const result = await original.apply(target, args)
          _makeRecovered()
          return result
        } catch (err) {
          _makeDegradedAt()
          const fallbackFn = (_memCache as any)[String(prop)]
          if (typeof fallbackFn === 'function') return fallbackFn(...args)
          throw err
        }
      }
    },
  })
  return proxy as any
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const redisConnection: typeof _memCache & IORedis = process.env.MOCK_REDIS === 'true'
  ? (_memCache as any)
  : _wrap(new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        // exponential backoff: 100ms, 200ms, 400ms … cap at 10s
        const delay = Math.min(100 * Math.pow(2, times - 1), 10_000)
        logger.warn(`[Redis] Reconnect attempt ${times} in ${delay}ms`)
        return delay
      },
    }))

if (process.env.MOCK_REDIS === 'true') {
  logger.info('[Redis] Mock mode — in-memory no-op provider')
} else {
  ;(redisConnection as any)._events || {};  // proxy wraps event emitter; direct .on still works
  const raw = (redisConnection as any) as IORedis
  raw.on?.('error',   (err: Error) => { logger.error('[Redis] Error:', err.message); _makeDegradedAt() })
  raw.on?.('connect', ()           => { logger.info('[Redis] Connected'); _makeRecovered() })
  raw.on?.('ready',   ()           => logger.info('[Redis] Ready'))
}

// ─── Health ───────────────────────────────────────────────────────────────────

export function getRedisHealth() {
  const fallbackDurationMs = _degraded && _degradedAt != null ? Date.now() - _degradedAt : 0
  return {
    degraded:            _degraded,
    degradedAt:          _degradedAt,
    fallbackDurationMs,
    fallbackDurationSec: Math.floor(fallbackDurationMs / 1000),
    mode:                process.env.MOCK_REDIS === 'true' ? 'mock' : _degraded ? 'fallback' : 'redis',
    fallbackEntries:     _mem.size,
  }
}
