// Dependency Graph
// Generation III Runtime

/**
 * Ensures all workspaces resolve dependencies through the runtime, 
 * preventing hidden workspace-to-workspace coupling.
 */
export class DependencyGraph {
    private registeredCapabilities: Set<string> = new Set();
    private workspaceDependencies: Map<string, string[]> = new Map();

    public registerCapability(capabilityId: string) {
        this.registeredCapabilities.add(capabilityId);
    }

    public registerWorkspaceDependencies(workspaceId: string, requiredCapabilities: string[]) {
        this.workspaceDependencies.set(workspaceId, requiredCapabilities);
    }

    public verifyDependencies(workspaceId: string): boolean {
        const required = this.workspaceDependencies.get(workspaceId) || [];
        for (const req of required) {
            if (!this.registeredCapabilities.has(req)) {
                console.warn(`[DependencyGraph] Missing capability: ${req} required by ${workspaceId}`);
                return false;
            }
        }
        return true; // No circular deps by design, as workspaces depend on capabilities, not each other
    }
}
