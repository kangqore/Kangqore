import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''
const UUID_KEY = 'kq_visitor_uuid'

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

async function buildFingerprint() {
  const parts = [
    navigator.language,
    navigator.platform,
    String(screen.width) + 'x' + String(screen.height),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(navigator.hardwareConcurrency ?? 0),
  ].join('|')

  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(parts))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
  } catch {
    return null
  }
}

function getUTMs() {
  const p = new URLSearchParams(window.location.search)
  return {
    utmSource:   p.get('utm_source')   || undefined,
    utmMedium:   p.get('utm_medium')   || undefined,
    utmCampaign: p.get('utm_campaign') || undefined,
    referrer:    document.referrer     || undefined,
  }
}

let _cachedUuid = null
let _cachedSessionUuid = null
let _cachedVisitorId = null

export function getVisitorUuid() { return _cachedUuid }
export function getVisitorId()   { return _cachedVisitorId }
export function getSessionUuid() {
  if (!_cachedSessionUuid) {
    let sessionUuid = sessionStorage.getItem('kq_session_uuid')
    if (!sessionUuid) {
      sessionUuid = generateUUID()
      sessionStorage.setItem('kq_session_uuid', sessionUuid)
    }
    _cachedSessionUuid = sessionUuid
  }
  return _cachedSessionUuid
}

export default function useVisitorIdentity() {
  const [state, setState] = useState({ visitorUuid: _cachedUuid, visitorId: _cachedVisitorId, ready: !!_cachedUuid })

  useEffect(() => {
    if (_cachedUuid) return

    let uuid = localStorage.getItem(UUID_KEY)
    if (!uuid) {
      uuid = generateUUID()
      localStorage.setItem(UUID_KEY, uuid)
    }
    _cachedUuid = uuid

    ;(async () => {
      const fingerprint  = await buildFingerprint()
      const ua = navigator.userAgent
      const browser = ua.includes('Edg/') ? 'Edge' : ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Opera') ? 'Opera' : 'Other'
      const os      = ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' : ua.includes('Android') ? 'Android' : ua.includes('Mac') ? 'macOS' : ua.includes('Windows') ? 'Windows' : ua.includes('Linux') ? 'Linux' : 'Other'
      const device  = /Mobi|Android|iPhone/.test(ua) ? 'Mobile' : /iPad|Tablet/.test(ua) ? 'Tablet' : 'Desktop'
      const conn    = navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection
      const deviceSignals = {
        ua:         ua.slice(0, 300),
        browser,
        os,
        device,
        tz:         Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen:     `${screen.width}x${screen.height}`,
        dpr:        window.devicePixelRatio ?? 1,
        lang:       navigator.language,
        languages:  (navigator.languages ?? []).slice(0, 3).join(','),
        connection: conn?.effectiveType ?? null,
        platform:   navigator.platform,
        cookies:    navigator.cookieEnabled,
        dnt:        navigator.doNotTrack === '1',
      }

      try {
        const res = await fetch(`${API}/api/public/visitor/identify`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ visitorUuid: uuid, fingerprint, deviceSignals, ...getUTMs() }),
        })
        if (res.ok) {
          const data = await res.json()
          _cachedVisitorId = data.visitorId
          setState({ visitorUuid: uuid, visitorId: data.visitorId, ready: true })
        } else {
          setState({ visitorUuid: uuid, visitorId: null, ready: true })
        }
      } catch {
        setState({ visitorUuid: uuid, visitorId: null, ready: true })
      }
    })()
  }, [])

  return state
}
