// S326 — Webhook registration for KIMMP operational events: eval regressions
// (Gate 3 drift alerts) and budget breaches. The operational-surface
// counterpart to ontologyWebhookSubscription.service.ts — same CDC-event-bus
// integration point (getEventBus, topic 'cdc.events'), new event types.
// Emit call sites: runBenchmarks.ts (drift alert computed) and
// kimmpGateway.service.ts (hard-stop budget breach) — both existing
// state transitions, not new triggers.

import crypto from 'crypto'
import { prisma } from '../lib/prisma'
import { getEventBus, CDCEvent } from '../lib/eventBus'

const CDC_TOPIC = 'cdc.events'
const EVAL_TABLE = 'kimmp_benchmark_runs'
const BUDGET_TABLE = 'token_budgets'

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

  await (prisma as any).kimmpOperationalSubscription.update({
    where: { id: subscription.id },
    data: { lastTriggeredAt: new Date(), lastStatus: status },
  }).catch(() => {})
}

async function handleCdcEvent(event: CDCEvent) {
  let eventType: string | null = null
  if (event.table === EVAL_TABLE) eventType = 'eval.drift_alert'
  else if (event.table === BUDGET_TABLE) eventType = 'budget.exceeded'
  if (!eventType) return

  const subs = await (prisma as any).kimmpOperationalSubscription.findMany({
    where: { enabled: true, eventTypes: { has: eventType } },
  })

  await Promise.all(subs.map((s: any) => deliver(s, eventType!, event.after)))
}

export const KimmpOperationalWebhookService = {
  async init() {
    const bus = await getEventBus()
    bus.subscribe<CDCEvent>(CDC_TOPIC, (event) => {
      handleCdcEvent(event).catch(() => {})
    })
    console.info('[KimmpOperationalWebhooks] subscribed to CDC event bus for eval drift + budget breach events')
  },

  async test(subscriptionId: string) {
    const sub = await (prisma as any).kimmpOperationalSubscription.findUniqueOrThrow({ where: { id: subscriptionId } })
    await deliver(sub, 'test.ping', { message: 'Test delivery from Kangqore KIMMP Operations', subscriptionId })
    return (prisma as any).kimmpOperationalSubscription.findUnique({ where: { id: subscriptionId } })
  },
}
