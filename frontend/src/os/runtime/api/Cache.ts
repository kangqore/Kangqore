// API Cache
// Generation III Runtime (BFF)

/**
 * Provides client-side caching for the BFF layer to reduce backend load.
 */
export class ApiCache {
    private cache: Map<string, { data: any, expires: number }> = new Map();

    public get(key: string): any | null {
        const entry = this.cache.get(key);
        if (entry && entry.expires > Date.now()) {
            return entry.data;
        }
        return null;
    }

    public set(key: string, data: any, ttlMs: number = 60000) {
        this.cache.set(key, {
            data,
            expires: Date.now() + ttlMs
        });
    }

    public invalidate(key: string) {
        this.cache.delete(key);
    }
}
