// Composition Engine
// Generation III Runtime

import { WorkspaceManifest, WorkspaceCapability } from '../types/manifest';
import { DependencyGraph } from './DependencyGraph';
import { PolicyAdapter } from './PolicyAdapter';

export interface CompositionRequest {
    objectId?: string;
    lensId: string;
    context: any;
    missionId?: string;
}

export interface WorkspaceTree {
    rootNode: any;
    resolvedCapabilities: WorkspaceCapability[];
}

/**
 * The Composition Engine resolves explicit Capability Contracts (not React components).
 */
export class CompositionEngine {
    constructor(
        private readonly dependencyGraph: DependencyGraph,
        private readonly policyAdapter: PolicyAdapter
    ) {}

    public async compose(manifest: WorkspaceManifest, request: CompositionRequest): Promise<WorkspaceTree> {
        // 1. Verify dependencies are met in the Runtime Dependency Graph
        const canResolve = this.dependencyGraph.verifyDependencies(manifest.id);
        if (!canResolve) {
            throw new Error(`Workspace ${manifest.id} has unresolved dependencies.`);
        }

        // 2. Filter capabilities based on AEGIS policies (capabilities are string IDs in the manifest)
        const capabilityIds = manifest.workspace.capabilities
        const allowedCapabilities: WorkspaceCapability[] = capabilityIds
            .filter(id => this.policyAdapter.evaluate([id]))
            .map(id => ({ id, provider: '', version: '', platformCapability: id, permissions: [id], inputs: [], outputs: [] }))

        // 3. Build the virtual workspace tree
        const tree: WorkspaceTree = {
            rootNode: {
                lens: request.lensId,
                modules: Object.values((manifest.workspace as any).sections ?? {}),
            },
            resolvedCapabilities: allowedCapabilities
        };

        return tree;
    }
}
