// F-Infra: EventBus + CDC type definitions

export type CDCOperation = 'INSERT' | 'UPDATE' | 'DELETE' | 'UPSERT'

export interface CDCEvent<T = Record<string, any>> {
  id:        string         // unique event id
  table:     string         // e.g. 'ontology_objects'
  op:        CDCOperation
  before:    T | null       // state before change (null for INSERT)
  after:     T | null       // state after change (null for DELETE)
  timestamp: string         // ISO
  source:    string         // 'prisma' | 'trigger' | 'manual'
  meta?:     Record<string, any>
}

export type EventHandler<T = any> = (event: T) => void | Promise<void>

export interface EventBus {
  publish<T>(topic: string, event: T): Promise<void>
  subscribe<T>(topic: string, handler: EventHandler<T>): () => void   // returns unsubscribe fn
  close(): Promise<void>
  readonly name: string  // 'memory' | 'nats' | 'redpanda'
}
