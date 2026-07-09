// Manifest Types
// Generation III Runtime

export interface WorkspaceCapability {
    id: string;
    provider: string;
    version: string;
    platformCapability: string;
    permissions: string[];
    inputs: any[];
    outputs: any[];
}

export type WidgetState = 'LOADING' | 'EMPTY' | 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'UNAUTHORIZED' | 'ERROR';
export type WidgetPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW' | 'BACKGROUND';
export type RefreshPolicy = 'LIVE' | 'PERIODIC' | 'ON_DEMAND' | 'STATIC';

export interface WorkspaceWidget {
    id: string;
    title: string;
    component: string;
    permissions: string[];
    
    // Intent Advertisement
    purpose?: string;
    consumes?: string[];
    publishes?: string[];
    requiredCapabilities?: string[];
    priority?: WidgetPriority;
    refreshPolicy?: RefreshPolicy;
    cachePolicy?: string;
    subscription?: string;
}

export interface WorkspaceModule {
    id: string;
    title: string;
    supportedObjects: string[];
    supportedDomains: string[];
    widgets: WorkspaceWidget[];
    commands: WorkspaceCommand[];
    permissions: string[];
    routes: any[];
}

export interface WorkspaceCommand {
    id: string;
    title: string;
    description: string;
    action: string;
    shortcut?: string;
}

export interface WorkspaceSection {
    id: string;
    priority: number;
    visibleWhen?: string[]; // e.g. ["hasCapability('cap.tasks.read')"]
    collapsible: boolean;
    adaptive: boolean;
    widgets: WorkspaceWidget[];
}

export type WorkspaceMode = 'FOCUS' | 'MEETING' | 'TRAVEL' | 'OFFLINE' | 'INCIDENT' | 'APPROVAL' | 'LEARNING' | 'DEFAULT' | 'FORECASTING';

export type ProjectionScope = 'PERSONAL' | 'EXECUTIVE' | 'REVENUE'

export interface WorkspaceManifest {
    id: string;
    version: string;
    apiVersion: string;
    runtimeVersion: string;
    sdkVersion: string;
    
    metadata: {
        id: string;
        title: string;
        description: string;
        version: string;
        category: string;
        icon: string;
    };
    
    // Behavior Definition instead of Layout
    workspace: {
        adaptive: boolean;
        personality: string;
        layoutEngine: string;
        scheduler: string;
        cognitiveStateType: ProjectionScope; // declares which WEE adapter projects this workspace
        modes: Record<WorkspaceMode, string[]>; // mode -> array of section IDs to show/expand
        sections: Record<string, WorkspaceSection>;
        policies: string[];
        capabilities: string[];
        subscriptions: string[];
        memory: string[];
        modules?: WorkspaceModule[];
    };
}

export interface WorkspaceLifecycle {
    initialize(): Promise<void>
    restore(state: unknown): Promise<void>
    compose(): Promise<void>
    render(): void
    suspend(): void
    resume(): void
    dispose(): void
}
