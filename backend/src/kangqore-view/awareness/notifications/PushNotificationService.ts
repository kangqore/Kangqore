import webpush from 'web-push'
import { prisma } from '../../../lib/prisma'

const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY  ?? ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT     ?? 'mailto:admin@kangqore.com'

let configured = false

function ensureConfigured() {
  if (configured || !VAPID_PUBLIC || !VAPID_PRIVATE) return
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
  configured = true
}

export async function saveSubscription(
  endpoint: string,
  auth: string,
  p256dh: string,
  userId?: string,
) {
  return (prisma as any).pushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, auth, p256dh, userId },
    update: { auth, p256dh, userId },
  })
}

export async function sendPushToAll(payload: {
  title: string
  body: string
  type?: string
  url?: string
}) {
  ensureConfigured()
  if (!configured) return // VAPID keys not set — skip silently

  const subs = await (prisma as any).pushSubscription.findMany().catch(() => [])
  const message = JSON.stringify(payload)

  await Promise.allSettled(
    subs.map(async (sub: any) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { auth: sub.auth, p256dh: sub.p256dh } },
          message,
        )
      } catch (err: any) {
        // 404/410 = subscription expired — remove it
        if (err.statusCode === 404 || err.statusCode === 410) {
          await (prisma as any).pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {})
        }
      }
    }),
  )
}
