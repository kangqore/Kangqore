import { useEffect, useRef } from 'react'
import { getVisitorUuid } from './useVisitorIdentity'

const BASE = import.meta.env.VITE_API_URL ?? ''
const URL  = `${BASE}/api/public/visitor/heartbeat`
const INTERVAL_MS = 30_000

function beat() {
  const uuid = getVisitorUuid()
  if (!uuid) return
  const body = JSON.stringify({ visitorUuid: uuid, path: window.location.pathname, title: document.title })
  // keepalive ensures the request survives tab close
  fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
}

export function usePresenceHeartbeat() {
  const pathRef = useRef(window.location.pathname)

  useEffect(() => {
    beat()
    const timer = setInterval(beat, INTERVAL_MS)

    // Re-fire when path changes (SPA navigation)
    const onNav = () => {
      if (window.location.pathname !== pathRef.current) {
        pathRef.current = window.location.pathname
        beat()
      }
    }
    window.addEventListener('popstate', onNav)

    // Patch history pushState so SPA navigations also trigger
    const origPush = history.pushState.bind(history)
    history.pushState = (...args) => { origPush(...args); onNav() }

    return () => {
      clearInterval(timer)
      window.removeEventListener('popstate', onNav)
      history.pushState = origPush
    }
  }, [])
}
