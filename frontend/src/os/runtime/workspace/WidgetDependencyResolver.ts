// Widget Dependency Resolver
// Generation III Runtime

import { CapabilityBroker } from './CapabilityBroker';
import { PolicyAdapter } from './PolicyAdapter';
import { WorkspaceManifest } from '../types/manifest';

/**
 * Automatically injects Capabilities, Permissions, Objects, and Themes 
 * into Widgets based on their manifests.
 */
export class WidgetDependencyResolver {
    constructor(
        private capabilityBroker: CapabilityBroker,
        private policyAdapter: PolicyAdapter
    ) {}

    public async resolve(widgetManifest: any, context: any): Promise<any> {
        // 1. Resolve Permissions
        const isAuthorized = this.policyAdapter.evaluate(widgetManifest.permissions);
        if (!isAuthorized) {
            throw new Error(`[WidgetDependencyResolver] Unauthorized to render widget ${widgetManifest.id}`);
        }

        // 2. Resolve Required Capabilities
        const resolvedCapabilities: Record<string, any> = {};
        for (const capReq of (widgetManifest.requiredCapabilities || [])) {
            // Provide a bound execution function to the widget
            resolvedCapabilities[capReq] = async (inputs: any) => {
                return this.capabilityBroker.executeCapability(capReq, inputs, context);
            };
        }

        // 3. Resolve Objects (via Context/Lens)
        // Handled by the ExperienceAPI mapping before hitting the widget

        return {
            capabilities: resolvedCapabilities,
            authorized: true
        };
    }
}
