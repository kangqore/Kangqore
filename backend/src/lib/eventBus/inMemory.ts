// In-process event bus — zero external deps, immediate delivery.
// Default for dev. Useful for integration tests and single-instance deployments.

import { EventBus, EventHandler } from './types'

type HandlerMap = Map<string, Set<EventHandler>>

export class InMemoryEventBus implements EventBus {
  readonly name = 'memory' as const
  private handlers: HandlerMap = new Map()

  async publish<T>(topic: string, event: T): Promise<void> {
    const handlers = this.handlers.get(topic)
    if (!handlers) return
    for (const h of handlers) {
      try { await h(event) } catch (e) { console.error(`[EventBus:memory] handler error on ${topic}:`, e) }
    }
  }

  subscribe<T>(topic: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(topic)) this.handlers.set(topic, new Set())
    this.handlers.get(topic)!.add(handler as EventHandler)
    return () => { this.handlers.get(topic)?.delete(handler as EventHandler) }
  }

  async close(): Promise<void> {
    this.handlers.clear()
  }
}
