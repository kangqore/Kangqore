// Interaction Runtime
// Generation III Runtime

import { PlatformAction } from './PlatformActions';
import { EventBus } from '../workspace/EventBus';

/**
 * Normalizes all human intent into structured Platform Actions.
 * Guarantees the Interaction Invariant: Every interaction resolves to an Action or Mission.
 */
export class InteractionRuntime {
    constructor(private eventBus: EventBus) {}

    public dispatchAction(action: PlatformAction) {
        console.log(`[InteractionRuntime] Dispatching Action from ${action.originChannel}:`, action);
        
        // Convert to Mission if it's an execution
        if (action.type === 'EXECUTION') {
            this.convertToMission(action);
        } else {
            // Forward to BFF/Platform
            this.eventBus.emit('PLATFORM_ACTION_DISPATCHED', action);
        }
    }

    private convertToMission(action: PlatformAction) {
        console.log(`[InteractionRuntime] Converting action to Mission...`);
        this.eventBus.emit('MISSION_CREATED', {
            originalAction: action,
            missionId: crypto.randomUUID()
        });
    }
}
