// For Phase 1, Event Registry will be a simple in-memory map or service that 
// tracks the semantic events that KORE emits.
// In Phase 2, this might be backed by Prisma or Kafka topics directly.

export interface KoreEventDefinition {
  eventName: string;
  description: string;
  payloadSchema?: any; // JSON Schema for validation
}

export class EventRegistry {
  private static events: Map<string, KoreEventDefinition> = new Map();

  /**
   * Registers a new event definition.
   */
  static registerEvent(event: KoreEventDefinition) {
    if (this.events.has(event.eventName)) {
      throw new Error(`Event '${event.eventName}' is already registered.`);
    }
    this.events.set(event.eventName, event);
  }

  /**
   * Retrieves an event definition.
   */
  static getEvent(eventName: string): KoreEventDefinition {
    const event = this.events.get(eventName);
    if (!event) {
      throw new Error(`Event '${eventName}' not found in registry.`);
    }
    return event;
  }

  /**
   * Lists all registered events.
   */
  static listEvents(): KoreEventDefinition[] {
    return Array.from(this.events.values());
  }
}
