// Event Bus
// Generation III Runtime

type EventHandler = (payload?: any) => void;

/**
 * The EventBus decouples modules via events.
 */
export class EventBus {
    private listeners: Map<string, EventHandler[]> = new Map();

    public on(event: string, handler: EventHandler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(handler);
    }

    public off(event: string, handler: EventHandler) {
        if (this.listeners.has(event)) {
            const handlers = this.listeners.get(event)!.filter(h => h !== handler);
            this.listeners.set(event, handlers);
        }
    }

    public emit(event: string, payload?: any) {
        if (this.listeners.has(event)) {
            this.listeners.get(event)!.forEach(handler => {
                try {
                    handler(payload);
                } catch (e) {
                    console.error(`[EventBus] Error in handler for event ${event}:`, e);
                }
            });
        }
    }
}
