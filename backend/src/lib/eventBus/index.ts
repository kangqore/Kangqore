// EventBus factory — selects implementation based on environment variables.
//
// Priority (highest first):
//   1. REDPANDA_BROKERS set → RedpandaEventBus
//   2. NATS_URL set         → NATSEventBus
//   3. default              → InMemoryEventBus

import { EventBus } from './types'
import { InMemoryEventBus } from './inMemory'
import { NATSEventBus } from './nats'
import { RedpandaEventBus } from './redpanda'

export * from './types'

let _bus: EventBus | null = null

export async function getEventBus(): Promise<EventBus> {
  if (_bus) return _bus

  if (process.env.REDPANDA_BROKERS) {
    const bus = new RedpandaEventBus()
    const ok = await bus.connect()
    if (ok) { _bus = bus; return _bus }
  }

  if (process.env.NATS_URL) {
    const bus = new NATSEventBus()
    const ok = await bus.connect()
    if (ok) { _bus = bus; return _bus }
  }

  _bus = new InMemoryEventBus()
  console.info('[EventBus] using InMemoryEventBus (set NATS_URL or REDPANDA_BROKERS to use a broker)')
  return _bus
}

export function currentBusName(): string {
  return _bus?.name ?? 'uninitialized'
}

export const BROKER_COMPARISON = [
  {
    dimension:   'Latency (P99)',
    nats:        '< 1ms',
    redpanda:    '2–5ms',
    winner:      'NATS',
    notes:       'NATS publish-subscribe is in-process and avoids TCP round-trips in JetStream direct mode',
  },
  {
    dimension:   'Throughput ceiling',
    nats:        '~10M msgs/sec (JetStream)',
    redpanda:    '~1M msgs/sec per node',
    winner:      'NATS',
    notes:       'NATS core is ~60M msgs/sec. JetStream (persistent) caps lower but still ahead for our workload',
  },
  {
    dimension:   'Operational complexity',
    nats:        'Single 10MB binary, no ZooKeeper',
    redpanda:    'Single binary (no ZK), Docker-ready',
    winner:      'NATS',
    notes:       'Both are operationally lean. NATS wins on binary size and configuration surface',
  },
  {
    dimension:   'Persistence / durability',
    nats:        'JetStream: configurable limits, replay',
    redpanda:    'Kafka-log: unlimited retention, compaction',
    winner:      'Redpanda',
    notes:       'Redpanda\'s log storage is more battle-tested for long-term analytics replay',
  },
  {
    dimension:   'Ecosystem',
    nats:        'NATS connectors, K8s operator',
    redpanda:    'Full Kafka ecosystem (Connect, ksqlDB, Debezium)',
    winner:      'Redpanda',
    notes:       'Kafka ecosystem is vastly larger; critical if Debezium or Flink integration is needed',
  },
  {
    dimension:   'Schema Registry',
    nats:        'None built-in (use external)',
    redpanda:    'Built-in Confluent-compatible registry',
    winner:      'Redpanda',
    notes:       'Schema evolution for CDC events is safer with Redpanda\'s built-in registry',
  },
  {
    dimension:   'Multi-tenancy',
    nats:        'Accounts + JetStream domains',
    redpanda:    'Kafka ACLs + topic isolation',
    winner:      'Tied',
    notes:       'Both support tenant isolation; NATS accounts are simpler to configure',
  },
  {
    dimension:   'Cost (self-hosted)',
    nats:        'Free, Apache 2.0',
    redpanda:    'Free Community; Enterprise $$$',
    winner:      'NATS',
    notes:       'NATS has no enterprise tier paywall for features we need in v1',
  },
  {
    dimension:   'Fit for Kangqore OS v1',
    nats:        '✅ Agent messaging + low-latency CDC',
    redpanda:    '⚠️ Overkill for < 50k events/day',
    winner:      'NATS',
    notes:       'At Kangqore\'s current scale, NATS JetStream covers CDC + WAANDA agent comms in one system. Migrate to Redpanda if analytics replay or Debezium is required.',
  },
] as const

export const SPIKE_VERDICT = {
  recommendation: 'NATS',
  rationale: 'NATS JetStream satisfies all Sprint +4 requirements: sub-millisecond CDC event delivery, durable replay for audit, and native cluster support — at zero operational overhead. Redpanda becomes the right choice only if the platform needs Kafka ecosystem integration (Debezium CDC from third-party databases, Flink analytics pipelines, or > 50k sustained CDC events/sec).',
  nextStep: 'Install NATS server via Docker (nats -js) and set NATS_URL=nats://localhost:4222 to upgrade from InMemoryEventBus to JetStream.',
}
