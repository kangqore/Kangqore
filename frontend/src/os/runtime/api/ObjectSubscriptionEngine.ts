// Object Subscription Engine
// Generation III Runtime

import { EventBus } from '../workspace/EventBus';

/**
 * Upgrades the BFF from request/response polling to live event-driven streams.
 * Workspaces subscribe to Enterprise Objects and receive live updates.
 */
export class ObjectSubscriptionEngine {
    private subscriptions: Map<string, Set<string>> = new Map(); // objectId -> Set<workspaceId>

    constructor(private eventBus: EventBus) {}

    public subscribe(objectId: string, workspaceId: string) {
        if (!this.subscriptions.has(objectId)) {
            this.subscriptions.set(objectId, new Set());
            // Instruct backend (BFF) to open SSE/WebSocket stream for this object
            this.initiateBackendStream(objectId);
        }
        this.subscriptions.get(objectId)!.add(workspaceId);
        console.log(`[SubscriptionEngine] Workspace ${workspaceId} subscribed to Object ${objectId}`);
    }

    public unsubscribe(objectId: string, workspaceId: string) {
        const subs = this.subscriptions.get(objectId);
        if (subs) {
            subs.delete(workspaceId);
            if (subs.size === 0) {
                this.subscriptions.delete(objectId);
                // Instruct backend to close stream
            }
        }
    }

    private initiateBackendStream(objectId: string) {
        // Mocking an incoming event from the backend
        setTimeout(() => {
            this.eventBus.emit('OBJECT_STATE_CHANGED', {
                objectId,
                delta: { status: 'UPDATED' }
            });
        }, 5000);
    }
}
