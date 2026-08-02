// S307 — Webhook registration for OntologyEvent notifications.
//
// Rather than sprinkling dispatch calls across every ontology mutation route
// (the same ON_CHANGE-scoping tradeoff made in S305's pipeline sync), this
// subscribes once to the CDC event bus that already fires on every
// `ontology_objects` INSERT/UPDATE (see admin-ontology.ts POST/PATCH /objects
// and lib/cdc/cdcService.ts) — one integration point covers every current and
// future write path that emits through CdcService, with no route-by-route wiring.

import crypto from 'crypto'
import { prisma } from '../lib/prisma'
import { getEventBus, CDCEvent } from '../lib/eventBus'

const CDC_TOPIC = 'cdc.events'
const ONTOLOGY_TABLE = 'ontology_objects'

function signPayload(payload: unknown, secret: string): string {
  return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')
}

async function deliver(subscription: { id: string; url: string; secret: string }, eventType: string, data: unknown) {
  const payload = { eventType, data, timestamp: new Date().toISOString() }
  const signature = signPayload(payload, subscription.secret)

  let status: string
  try {
    const res = await fetch(subscription.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Kangqore-Signature': `sha256=${signature}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })
    status = String(res.status)
  } catch (e: any) {
    status = `error: ${e?.message ?? 'unreachable'}`
  }

  await prisma.ontologySubscription.update({
    where: { id: subscription.id },
    data: { lastTriggeredAt: new Date(), lastStatus: status },
  }).catch(() => {})
}

async function handleCdcEvent(event: CDCEvent) {
  if (event.table !== ONTOLOGY_TABLE) return
  const after = event.after as { id?: string; typeId?: string } | null
  if (!after?.typeId) return

  const eventType = event.op === 'INSERT' ? 'object.created' : event.op === 'UPDATE' ? 'object.updated' : null
  if (!eventType) return

  const subs = await prisma.ontologySubscription.findMany({
    where: {
      enabled: true,
      eventTypes: { has: eventType },
      OR: [{ objectTypeId: null }, { objectTypeId: after.typeId }],
    },
  })

  await Promise.all(subs.map(s => deliver(s, eventType, after)))
}

export const OntologyWebhookSubscriptionService = {
  async init() {
    const bus = await getEventBus()
    bus.subscribe<CDCEvent>(CDC_TOPIC, (event) => {
      handleCdcEvent(event).catch(() => {})
    })
    console.info('[OntologyWebhooks] subscribed to CDC event bus for ontology_objects')
  },

  async test(subscriptionId: string) {
    const sub = await prisma.ontologySubscription.findUniqueOrThrow({ where: { id: subscriptionId } })
    await deliver(sub, 'test.ping', { message: 'Test delivery from Kangqore Ontology', subscriptionId })
    return prisma.ontologySubscription.findUnique({ where: { id: subscriptionId } })
  },
}
