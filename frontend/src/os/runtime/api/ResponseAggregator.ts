// Response Aggregator
// Generation III Runtime (BFF)

/**
 * Aggregates responses from multiple backend systems (EDF, EPF, ESF).
 */
export class ResponseAggregator {
    public async aggregate(requests: Promise<any>[]): Promise<any[]> {
        // Waits for multiple services, handles partial failures gracefully
        const results = await Promise.allSettled(requests);
        return results.map(res => res.status === 'fulfilled' ? res.value : null);
    }
}
