import { useEffect, useRef, useCallback } from 'react'
import { getVisitorUuid } from './useVisitorIdentity'

const API = import.meta.env.VITE_BACKEND_URL || ''
const BATCH_INTERVAL = 5000

const hasPerformanceConsent = () => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) return false;
  if (consent === 'accepted') return true;
  try {
    const parsed = JSON.parse(consent);
    return !!parsed.performance;
  } catch (e) {
    return false;
  }
};

export default function useFootprintTracker() {
  const queueRef      = useRef([])
  const timerRef      = useRef(null)
  const pageStartRef  = useRef(Date.now())
  const scrollMarksRef = useRef(new Set())

  const flush = useCallback(() => {
    if (!hasPerformanceConsent()) {
      queueRef.current = [];
      return;
    }
    const uuid = getVisitorUuid()
    if (!uuid || !queueRef.current.length) return

    const batch = queueRef.current.splice(0)
    const payload = batch.map(ev => ({ ...ev, visitorUuid: uuid }))

    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API}/api/public/visitor/event`, JSON.stringify(payload))
    } else {
      fetch(`${API}/api/public/visitor/event`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    }
  }, [])

  const push = useCallback((type, path, data = {}) => {
    if (!hasPerformanceConsent()) return;
    queueRef.current.push({ type, path, data })
    if (!timerRef.current) {
      timerRef.current = setInterval(flush, BATCH_INTERVAL)
    }
  }, [flush])

  // PAGE_VIEW on mount
  useEffect(() => {
    const path = window.location.pathname
    pageStartRef.current = Date.now()
    scrollMarksRef.current.clear()
    push('PAGE_VIEW', path)

    return () => {
      // TIME_ON_PAGE on unmount
      const seconds = Math.round((Date.now() - pageStartRef.current) / 1000)
      if (seconds > 2) push('TIME_ON_PAGE', path, { seconds })
      flush()
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    }
  }, [window.location.pathname, push, flush])

  // SCROLL_DEPTH
  useEffect(() => {
    const onScroll = () => {
      const el     = document.documentElement
      const pct    = Math.round(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100)
      const marks  = [25, 50, 75, 90]
      for (const mark of marks) {
        if (pct >= mark && !scrollMarksRef.current.has(mark)) {
          scrollMarksRef.current.add(mark)
          push('SCROLL_DEPTH', window.location.pathname, { pct: mark })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [push])

  // EXIT_INTENT — mouse leaves to top
  useEffect(() => {
    let fired = false
    const onLeave = (e) => {
      if (e.clientY <= 0 && !fired) {
        fired = true
        push('EXIT_INTENT', window.location.pathname)
        flush()
      }
    }
    document.addEventListener('mouseleave', onLeave)
    return () => document.removeEventListener('mouseleave', onLeave)
  }, [push, flush])

  // Flush on page unload
  useEffect(() => {
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [flush])
}
