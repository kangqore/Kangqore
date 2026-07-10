// Runtime Scheduler
// Generation III Runtime

export type ExecutionPriority = 'CRITICAL' | 'VISIBLE' | 'BACKGROUND' | 'IDLE';

// WidgetPriority (from manifest) uses a different vocabulary than ExecutionPriority.
// This map normalises manifest priorities into scheduler queue slots so that
// widgets declaring HIGH/NORMAL/LOW don't crash with "undefined.push()".
const PRIORITY_MAP: Record<string, ExecutionPriority> = {
    CRITICAL:   'CRITICAL',
    HIGH:       'VISIBLE',
    NORMAL:     'VISIBLE',
    VISIBLE:    'VISIBLE',
    LOW:        'BACKGROUND',
    BACKGROUND: 'BACKGROUND',
    IDLE:       'IDLE',
};

interface ScheduledTask {
    id: string;
    priority: ExecutionPriority;
    execute: () => Promise<void>;
}

/**
 * Manages execution priorities, lazy loading, predictive prefetch,
 * and concurrency limits across the Generation III Runtime.
 */
export class RuntimeScheduler {
    private queues: Record<ExecutionPriority, ScheduledTask[]> = {
        CRITICAL: [],
        VISIBLE: [],
        BACKGROUND: [],
        IDLE: []
    };
    private isProcessing: boolean = false;

    public schedule(priority: string, execute: () => Promise<void>): string {
        const resolved: ExecutionPriority = PRIORITY_MAP[priority] ?? 'VISIBLE';
        const id = crypto.randomUUID();
        this.queues[resolved].push({ id, priority: resolved, execute });
        this.processQueues();
        return id;
    }

    private async processQueues() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            while (this.hasPendingTasks()) {
                const task = this.getNextTask();
                if (task) {
                    await task.execute(); // In a real OS scheduler, we'd handle time-slicing and preemption
                }
            }
        } finally {
            this.isProcessing = false;
        }
    }

    private hasPendingTasks(): boolean {
        return Object.values(this.queues).some(queue => queue.length > 0);
    }

    private getNextTask(): ScheduledTask | undefined {
        if (this.queues.CRITICAL.length > 0) return this.queues.CRITICAL.shift();
        if (this.queues.VISIBLE.length > 0) return this.queues.VISIBLE.shift();
        if (this.queues.BACKGROUND.length > 0) return this.queues.BACKGROUND.shift();
        if (this.queues.IDLE.length > 0) return this.queues.IDLE.shift();
        return undefined;
    }
}
