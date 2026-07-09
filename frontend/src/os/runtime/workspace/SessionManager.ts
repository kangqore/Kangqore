// Session Manager
// Generation III Runtime

import { WorkspaceSession, WorkspaceState } from '../types/state';

/**
 * Manages the active operating context.
 */
export class SessionManager {
    private currentSession: WorkspaceSession | null = null;

    public createSession(userId: string, workspaceId: string, initialState: WorkspaceState): WorkspaceSession {
        this.currentSession = {
            sessionId: crypto.randomUUID(),
            workspaceId,
            userId,
            startedAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
            state: initialState
        };
        return this.currentSession;
    }

    public getSession(): WorkspaceSession | null {
        return this.currentSession;
    }

    public updateState(partialState: Partial<WorkspaceState>) {
        if (this.currentSession) {
            this.currentSession.state = {
                ...this.currentSession.state,
                ...partialState
            };
            this.currentSession.lastActiveAt = new Date().toISOString();
        }
    }

    public endSession() {
        // Persist session to Enterprise Memory if needed
        this.currentSession = null;
    }
}
