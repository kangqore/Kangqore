// Lifecycle Engine
// Generation III Runtime

import { WorkspaceLifecycle } from '../types/manifest';
import { EventBus } from './EventBus';
import { RuntimeHealth } from '../core/RuntimeHealth';

/**
 * The Lifecycle Engine orchestrates the state transitions of a workspace.
 */
export class LifecycleEngine {
    private currentLifecycle: WorkspaceLifecycle | null = null;
    private state: 'IDLE' | 'INITIALIZING' | 'READY' | 'SUSPENDED' | 'DISPOSED' = 'IDLE';

    constructor(
        private eventBus: EventBus,
        private health: RuntimeHealth
    ) {}

    public async mount(lifecycle: WorkspaceLifecycle, sessionData?: any, contextData?: any): Promise<void> {
        this.currentLifecycle = lifecycle;
        
        try {
            this.state = 'INITIALIZING';
            this.eventBus.emit('LIFECYCLE_START_INITIALIZE');
            
            const start = performance.now();
            await this.currentLifecycle.initialize();
            
            if (sessionData) {
                await this.currentLifecycle.restore(sessionData);
            }
            
            await this.currentLifecycle.compose(contextData);
            this.currentLifecycle.render();
            
            this.health.recordLatency('lifecycle.mount', performance.now() - start);
            
            this.state = 'READY';
            this.eventBus.emit('LIFECYCLE_READY');
        } catch (error) {
            this.health.recordError('lifecycle.mount', error);
            throw error;
        }
    }

    public async suspend(): Promise<void> {
        if (this.state === 'READY' && this.currentLifecycle) {
            await this.currentLifecycle.suspend();
            this.state = 'SUSPENDED';
            this.eventBus.emit('LIFECYCLE_SUSPENDED');
        }
    }

    public async resume(): Promise<void> {
        if (this.state === 'SUSPENDED' && this.currentLifecycle) {
            await this.currentLifecycle.resume();
            this.state = 'READY';
            this.eventBus.emit('LIFECYCLE_RESUMED');
        }
    }

    public async unmount(): Promise<void> {
        if (this.currentLifecycle) {
            await this.currentLifecycle.dispose();
            this.currentLifecycle = null;
            this.state = 'DISPOSED';
            this.eventBus.emit('LIFECYCLE_DISPOSED');
        }
    }

    public getState() {
        return this.state;
    }
}
