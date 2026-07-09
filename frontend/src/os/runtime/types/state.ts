// Workspace State and Session Contracts
// Constitution 3 (v2.0) - Generation III Frontend Architecture

/**
 * EnterpriseState represents the actual reality of the enterprise
 * selected within the workspace context.
 */
export interface EnterpriseState {
    selectedObjectId: string | null;
    selectedMissionId: string | null;
    simulationBranchId: string | null;
}

/**
 * UIState represents purely presentational state (e.g. what tabs are open).
 */
export interface UIState {
    activePanelId: string | null;
    activeModuleId: string | null;
    filters: Record<string, any>;
    timeHorizon: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
}

/**
 * WorkspaceState is the composition of Enterprise and UI state.
 */
export interface WorkspaceState {
    enterprise: EnterpriseState;
    ui: UIState;
    waandaContext: Record<string, any>; // Context passed to WAANDA
}

/**
 * WorkspaceSession represents an active operating context that can be
 * serialized, handed off, or restored.
 */
export interface WorkspaceSession {
    sessionId: string;
    workspaceId: string; // Ref to Workspace Manifest ID
    userId: string;
    startedAt: string;
    lastActiveAt: string;
    state: WorkspaceState;
}

/**
 * WorkspaceMemory remembers historical state to provide continuity 
 * across sessions (e.g., "Recently viewed objects").
 */
export interface WorkspaceMemory {
    lastObjectId: string | null;
    lastModuleId: string | null;
    lastFilters: Record<string, any>;
    pinnedSimulations: string[];
    recentCommands: string[];
    draftMissions: string[];
}
