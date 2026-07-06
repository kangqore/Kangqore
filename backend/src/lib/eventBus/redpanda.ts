// Redpanda (Kafka-compatible) event bus implementation.
// Requires: REDPANDA_BROKERS env var (e.g. localhost:9092)
// Install client: npm install kafkajs
//
// Advantages over NATS:
//   - Kafka API compatibility — existing Kafka ecosystem (Connect, ksqlDB)
//   - Higher throughput ceiling: 1M+ msgs/sec per node
//   - Better for analytics workloads (long-term log retention)
//   - Native schema registry support
//   - Partitioned topics allow parallel consumers
//
// Spike comparison verdict: prefer Redpanda only if:
//   - Need Kafka ecosystem integration (Debezium, Spark, Flink)
//   - Analytics requires replaying months of events
//   - CDC volume exceeds 50k events/sec sustained
//   - Existing Kafka investment to leverage

import { EventBus, EventHandler } from './types'

export class RedpandaEventBus implements EventBus {
  readonly name = 'redpanda' as const
  private kafka: any = null
  private producer: any = null
  private consumers: any[] = []

  constructor(
    private readonly brokers: string[] = (process.env.REDPANDA_BROKERS ?? 'localhost:9092').split(','),
    private readonly clientId = 'kangqore-os',
  ) {}

  async connect(): Promise<boolean> {
    try {
      const { Kafka } = await import('kafkajs' as any)
      this.kafka = new Kafka({ clientId: this.clientId, brokers: this.brokers })
      this.producer = this.kafka.producer()
      await this.producer.connect()
      console.info(`[EventBus:redpanda] connected to ${this.brokers.join(', ')}`)
      return true
    } catch (e) {
      console.warn(`[EventBus:redpanda] connection failed — falling back to InMemory:`, (e as Error).message)
      return false
    }
  }

  async publish<T>(topic: string, event: T): Promise<void> {
    if (!this.producer) return
    try {
      await this.producer.send({
        topic: topic.replace(/\//g, '-'),
        messages: [{ value: JSON.stringify(event), timestamp: Date.now().toString() }],
      })
    } catch (e) {
      console.error(`[EventBus:redpanda] publish error:`, e)
    }
  }

  subscribe<T>(topic: string, handler: EventHandler<T>): () => void {
    if (!this.kafka) return () => {}
    const consumer = this.kafka.consumer({ groupId: `kangqore-${topic.replace(/\//g, '-')}-${Date.now()}` })
    this.consumers.push(consumer)
    const topicKey = topic.replace(/\//g, '-')
    consumer.connect().then(() => consumer.subscribe({ topic: topicKey, fromBeginning: false }))
      .then(() => consumer.run({
        eachMessage: async ({ message }: any) => {
          try { await handler(JSON.parse(message.value.toString())) } catch {}
        }
      })).catch(() => {})
    return () => { consumer.disconnect().catch(() => {}) }
  }

  async close(): Promise<void> {
    await Promise.all(this.consumers.map(c => c.disconnect().catch(() => {})))
    await this.producer?.disconnect().catch(() => {})
    this.kafka = null
    this.producer = null
  }
}
