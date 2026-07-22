import { useState, useEffect, useCallback } from 'react'
import { api } from '@lib/api'

type PushStatus = 'idle' | 'checking' | 'subscribed' | 'denied' | 'unsupported'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>('idle')
  const [vapidKey, setVapidKey] = useState<string | null>(null)

  const supported = typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window

  useEffect(() => {
    if (!supported) { setStatus('unsupported'); return }

    // Check existing permission state on mount
    if (Notification.permission === 'denied') { setStatus('denied'); return }

    // Check if already subscribed
    setStatus('checking')
    navigator.serviceWorker.ready.then(reg =>
      reg.pushManager.getSubscription()
    ).then(sub => {
      setStatus(sub ? 'subscribed' : 'idle')
    }).catch(() => setStatus('idle'))

    // Fetch VAPID public key from backend
    api.get('/admin/push-vapid-key')
      .then(r => setVapidKey(r.data.publicKey ?? null))
      .catch(() => {})
  }, [supported])

  const subscribe = useCallback(async () => {
    if (!supported || !vapidKey) return
    setStatus('checking')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setStatus('denied'); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
      await api.post('/admin/push-subscribe', { subscription: sub.toJSON() })
      setStatus('subscribed')
    } catch {
      setStatus('idle')
    }
  }, [supported, vapidKey])

  const unsubscribe = useCallback(async () => {
    if (!supported) return
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) await sub.unsubscribe()
      setStatus('idle')
    } catch {}
  }, [supported])

  return { status, supported, subscribe, unsubscribe }
}
