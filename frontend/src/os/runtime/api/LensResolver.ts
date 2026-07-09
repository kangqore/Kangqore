// Lens Resolver
// Generation III Runtime (BFF)

/**
 * Determines *how* the object should be viewed based on the active workspace.
 */
export class LensResolver {
    public resolveLens(workspaceId: string): any {
        // e.g., Revenue Workspace lens focuses on ARR, Pipeline, Renewals.
        // Operations Workspace lens focuses on active projects, support tickets.
        return {
            lensId: workspaceId,
            focusMetrics: workspaceId === 'revenue-workspace' ? ['ARR', 'PIPELINE'] : ['TICKETS', 'NPS'],
            excludedData: ['PII', 'INTERNAL_COSTS']
        };
    }
}
