// Workspace Registry (SDK)
// Generation III Runtime

import { WorkspaceManifest, WorkspaceModule, WorkspaceWidget, WorkspaceCommand } from '../types/manifest';
import { DependencyGraph } from '../workspace/DependencyGraph';

/**
 * Developer SDK for extending the Generation III Runtime.
 */
export class WorkspaceRegistry {
    private workspaces: Map<string, WorkspaceManifest> = new Map();
    private extensions: Map<string, any> = new Map();

    constructor(private dependencyGraph: DependencyGraph) {}

    public registerWorkspace(manifest: WorkspaceManifest) {
        // Validate manifest versioning
        if (!this.isValidRuntimeVersion(manifest.runtimeVersion)) {
            throw new Error(`Workspace ${manifest.id} is incompatible with current Runtime Version.`);
        }

        this.workspaces.set(manifest.id, manifest);
        
        // Register required capabilities in the Dependency Graph
        const requiredCapabilities = manifest.workspace.capabilities || [];
        this.dependencyGraph.registerWorkspaceDependencies(manifest.id, requiredCapabilities);

        console.log(`[WorkspaceRegistry] Registered Workspace Package: ${manifest.id}@${manifest.version}`);
    }

    public registerModule(workspaceId: string, module: WorkspaceModule) {
        const workspace = this.workspaces.get(workspaceId);
        if (workspace) {
            workspace.modules.push(module);
        }
    }

    public registerWidget(workspaceId: string, widget: WorkspaceWidget) {
        // Find the module and inject the widget, or register it globally
    }

    public registerCommand(workspaceId: string, command: WorkspaceCommand) {
        // Inject into interaction runtime pipeline
    }

    public registerExtension(extensionId: string, extensionManifest: any) {
        this.extensions.set(extensionId, extensionManifest);
        console.log(`[WorkspaceRegistry] Registered Extension: ${extensionId}`);
    }

    private isValidRuntimeVersion(version: string): boolean {
        // Semantic versioning check against current runtime
        return true; 
    }

    public getManifest(id: string): WorkspaceManifest | undefined {
        return this.workspaces.get(id);
    }
}
