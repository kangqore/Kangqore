// Orchestration Engine
// Generation III Runtime

import { PolicyAdapter } from '../workspace/PolicyAdapter';
import { RuntimeScheduler } from '../workspace/RuntimeScheduler';
import { WidgetDependencyResolver } from '../workspace/WidgetDependencyResolver';
import { CapabilityBroker } from '../workspace/CapabilityBroker';
import { RuntimeContainer } from '../core/RuntimeContainer';

/**
 * Handles HANUMANAS policy evaluation and subsystem initialization for the active workspace.
 */
export class OrchestrationEngine {
    private policyAdapter: PolicyAdapter;
    private scheduler: RuntimeScheduler;
    private resolver: WidgetDependencyResolver;
    private capabilityBroker: CapabilityBroker;

    constructor() {
        const container = RuntimeContainer.getInstance();
        
        this.policyAdapter = container.resolve<PolicyAdapter>('PolicyAdapter');
        this.capabilityBroker = container.resolve<CapabilityBroker>('CapabilityBroker');
        
        this.scheduler = new RuntimeScheduler();
        this.resolver = new WidgetDependencyResolver(this.capabilityBroker, this.policyAdapter);
    }

    public evaluateAccess(userId: string, workspaceManifest: any): boolean {
        // In a real implementation, this evaluates HANUMANAS policies
        // For now, if it requires 'role.employee', return true.
        const requiredPermissions = workspaceManifest.permissions || [];
        if (requiredPermissions.includes('role.employee')) return true;
        if (requiredPermissions.includes('role.executive')) return true;
        return false;
    }

    public getPolicyAdapter() { return this.policyAdapter; }
    public getScheduler() { return this.scheduler; }
    public getResolver() { return this.resolver; }
}
