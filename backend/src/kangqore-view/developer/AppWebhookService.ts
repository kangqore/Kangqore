// Phase 5.1 — App webhook delivery.
//
// Manifests have always been able to declare `webhooks: [{ event, targetUrl }]`,
// but nothing consumed them — certification scored the URL's HTTPS-ness and that
// was all. This delivers them.
//
// Delivery is fan-out over *installations*, not apps: a webhook fires to an
// app's target only for the tenant whose activity triggered it, and only while
// that tenant's installation is ACTIVE. Every attempt is recorded, including
// failures, so an undelivered event is visible rather than silent.

import crypto from 'crypto'
import { prisma } from '../../lib/prisma'
import type { KangqoreAppManifest } from './AppManifest'

export type AppWebhookEvent =
  | 'app.installed'
  | 'app.uninstalled'
  | 'app.published'
  | 'action.executed'
  | 'action.denied'

const DELIVERY_TIMEOUT_MS = 8_000

/** Signature header value: `sha256=<hex>` over the exact JSON body sent. */
export function signPayload(body: string, secret: string): string {
  return 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex')
}

/**
 * Verify an inbound signature in constant time. Exported so app authors can
 * import the same implementation the platform signs with.
 */
export function verifySignature(body: string, secret: string, header: string): boolean {
  const expected = Buffer.from(signPayload(body, secret))
  const provided = Buffer.from(header ?? '')
  if (expected.length !== provided.length) return false
  return crypto.timingSafeEqual(expected, provided)
}

async function deliverOne(args: {
  appId: string
  installationId: string | null
  tenantId: string
  event: AppWebhookEvent
  targetUrl: string
  payload: Record<string, unknown>
  secret: string
}) {
  const body = JSON.stringify({
    event: args.event,
    appId: args.appId,
    tenantId: args.tenantId,
    sentAt: new Date().toISOString(),
    data: args.payload,
  })
  const signature = signPayload(body, args.secret)

  const row = await prisma.appWebhookDelivery.create({
    data: {
      appId: args.appId,
      installationId: args.installationId,
      tenantId: args.tenantId,
      event: args.event,
      targetUrl: args.targetUrl,
      payload: args.payload as any,
      signature,
      status: 'PENDING',
    },
    select: { id: true },
  })

  const started = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS)

  try {
    const res = await fetch(args.targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kangqore-Event': args.event,
        'X-Kangqore-Signature': signature,
        'X-Kangqore-Delivery': row.id,
        'User-Agent': 'Kangqore-View-Webhooks/1.0',
      },
      body,
      signal: controller.signal,
    })

    const text = await res.text().catch(() => '')
    await prisma.appWebhookDelivery.update({
      where: { id: row.id },
      data: {
        status: res.ok ? 'DELIVERED' : 'FAILED',
        responseStatus: res.status,
        responseBody: text.slice(0, 2000),
        attempts: 1,
        durationMs: Date.now() - started,
        deliveredAt: res.ok ? new Date() : null,
        errorMessage: res.ok ? null : `Target responded ${res.status}`,
      },
    })
    return { deliveryId: row.id, ok: res.ok, status: res.status }
  } catch (err: any) {
    const aborted = err?.name === 'AbortError'
    await prisma.appWebhookDelivery.update({
      where: { id: row.id },
      data: {
        status: 'FAILED',
        attempts: 1,
        durationMs: Date.now() - started,
        errorMessage: aborted ? `Timed out after ${DELIVERY_TIMEOUT_MS}ms` : err.message,
      },
    })
    return { deliveryId: row.id, ok: false, status: 0 }
  } finally {
    clearTimeout(timer)
  }
}

export const AppWebhookService = {
  signPayload,
  verifySignature,

  /**
   * Fan an event out to every app installed in this tenant that subscribes to
   * it. Never throws — a failing webhook target must not fail the action that
   * triggered it.
   */
  async dispatch(args: {
    event: AppWebhookEvent
    tenantId: string
    payload: Record<string, unknown>
    /** Restrict to a single app; omit to notify every subscribed installation. */
    appId?: string
  }): Promise<Array<{ deliveryId: string; ok: boolean; status: number }>> {
    try {
      const installations = await prisma.appInstallation.findMany({
        where: {
          tenantId: args.tenantId,
          status: 'ACTIVE',
          ...(args.appId ? { appId: args.appId } : {}),
        },
        include: { app: true },
      })

      const jobs: Array<Promise<{ deliveryId: string; ok: boolean; status: number }>> = []

      for (const inst of installations) {
        const manifest = inst.app.manifest as unknown as KangqoreAppManifest
        const hooks = (manifest?.webhooks ?? []).filter(w => w.event === args.event && w.targetUrl)
        for (const hook of hooks) {
          // Refuse plaintext targets outright rather than leaking a signed
          // payload over the wire.
          if (!hook.targetUrl.startsWith('https://')) continue
          jobs.push(
            deliverOne({
              appId: inst.appId,
              installationId: inst.id,
              tenantId: args.tenantId,
              event: args.event,
              targetUrl: hook.targetUrl,
              payload: args.payload,
              // The app's stored secret hash doubles as the signing key: the
              // app can derive it, nobody else can read it back out.
              secret: inst.app.clientSecretHash,
            }),
          )
        }
      }

      return await Promise.all(jobs)
    } catch {
      return []
    }
  },

  async listDeliveries(appId: string, limit = 50) {
    return prisma.appWebhookDelivery.findMany({
      where: { appId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
    })
  },
}
