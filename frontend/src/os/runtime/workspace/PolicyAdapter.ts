// Policy Adapter
// Generation III Runtime

/**
 * Adapts HANUMANAS policies to the UI.
 * Determines if a user has permission to view, edit, simulate, or execute.
 */
export class PolicyAdapter {
    private activePolicies: Set<string> = new Set(); // Would be populated from session/BFF

    public loadPolicies(policies: string[]) {
        this.activePolicies = new Set(policies);
    }

    public evaluate(requiredPermissions: string[]): boolean {
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        
        // Return true if the user has AT LEAST ONE of the required permissions
        for (const req of requiredPermissions) {
            if (this.activePolicies.has(req)) {
                return true;
            }
        }
        return false;
    }
}
