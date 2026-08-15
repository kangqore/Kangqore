type EventHandler = (event: any) => Promise<void> | void;

export class KeosEventBus {
  private static handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Publish an event to the KEOS Event Bus.
   * This is the final step in the Mission Execution Pipeline.
   */
  static async publish(eventType: string, payload: any) {
    console.log(`[KEOS Event Bus] Publishing Event: ${eventType}`);
    const eventHandlers = this.handlers.get(eventType) || [];
    
    // Execute handlers asynchronously so we don't block
    eventHandlers.forEach(handler => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[KEOS Event Bus] Handler failed for ${eventType}:`, err);
      }
    });

    // We can also log to an Event table in the DB here if needed
  }

  static subscribe(eventType: string, handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }
}
