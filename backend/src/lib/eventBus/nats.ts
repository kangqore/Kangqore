// NATS JetStream event bus implementation.
// Requires: NATS_URL env var (e.g. nats://localhost:4222)
// Install client: npm install nats
//
// Advantages over Redpanda:
//   - Ultra-low latency (< 1ms in LAN)
//   - Tiny operational footprint (single 10MB binary)
//   - JetStream provides at-least-once delivery + retention
//   - Native clustering without ZooKeeper
//   - Best fit for edge cases: IoT, low-latency agent communication
//
// Spike comparison verdict: prefer NATS for Kangqore OS because:
//   - Agent-to-agent messaging has <5ms latency requirement
//   - Operations team is small — NATS JetStream is operationally simpler
//   - JetStream subjects map 1:1 to our topic naming
//   - Redpanda only wins if >100k events/sec or Kafka ecosystem integration needed

import { EventBus, EventHandler } from './types'

export class NATSEventBus implements EventBus {
  readonly name = 'nats' as const
  private nc: any = null
  private js: any = null
  private subscriptions: Map<string, any> = new Map()

  constructor(private readonly url: string = process.env.NATS_URL ?? 'nats://localhost:4222') {}

  async connect(): Promise<boolean> {
    try {
      // Dynamic import so the module loads even without `nats` installed
      const { connect, StringCodec } = await import('nats' as any)
      this.nc = await connect({ servers: this.url, reconnect: true, maxReconnectAttempts: 3 })
      this.js = this.nc.jetstream()
      console.info(`[EventBus:nats] connected to ${this.url}`)
      return true
    } catch (e) {
      console.warn(`[EventBus:nats] connection failed — falling back to InMemory:`, (e as Error).message)
      return false
    }
  }

  async publish<T>(topic: string, event: T): Promise<void> {
    if (!this.js) return
    try {
      const { StringCodec } = await import('nats' as any)
      const sc = StringCodec()
      await this.js.publish(topic.replace(/\//g, '.'), sc.encode(JSON.stringify(event)))
    } catch (e) {
      console.error(`[EventBus:nats] publish error:`, e)
    }
  }

  subscribe<T>(topic: string, handler: EventHandler<T>): () => void {
    if (!this.js) return () => {}
    let sub: any
    const subjectKey = topic.replace(/\//g, '.')
    this.js.subscribe(subjectKey).then((s: any) => {
      sub = s
      this.subscriptions.set(topic, s)
      ;(async () => {
        const { StringCodec } = await import('nats' as any)
        const sc = StringCodec()
        for await (const m of s) {
          try { await handler(JSON.parse(sc.decode(m.data))) } catch {}
          m.ack()
        }
      })()
    }).catch(() => {})
    return () => { sub?.unsubscribe() }
  }

  async close(): Promise<void> {
    for (const s of this.subscriptions.values()) { try { s.unsubscribe() } catch {} }
    await this.nc?.drain()
    this.nc = null
    this.js = null
  }
}
