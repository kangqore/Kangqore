import { useEffect, useRef } from 'react'

const SESSION_KEY      = 'kq_eqore_proactive_shown'
const SCROLL_THRESHOLD = 0.35
const EXIT_DELAY_MS    = 300
const TIME_ON_PAGE_MS  = 8000  // fire if user stays 8s and no other trigger beats it

function openEQORE() {
  window.dispatchEvent(new CustomEvent('toggle-eqore-chatbot', {
    detail: { openOnly: true, proactive: true, page: window.location.pathname },
  }))
  sessionStorage.setItem(SESSION_KEY, '1')
}

function alreadyShown() {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

function isPublicRoute() {
  const p = window.location.pathname
  return !p.startsWith('/kangqore-view') && !p.startsWith('/dashboard')
}

export function useProactiveEQORE() {
  const firedRef     = useRef(false)
  const exitTimerRef = useRef(null)

  useEffect(() => {
    // Gate: shown this session already — attach nothing
    if (alreadyShown()) return

    // ── Trigger 1: Scroll 35% ────────────────────────────────────────────
    // Route is checked at event time, not at effect-mount time, so navigating
    // from OS → public works even though the effect only runs once.
    const onScroll = () => {
      if (!isPublicRoute() || firedRef.current || alreadyShown()) return
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (pct >= SCROLL_THRESHOLD) {
        firedRef.current = true
        openEQORE()
      }
    }

    // ── Trigger 2: Exit intent ────────────────────────────────────────────
    const onMouseMove = (e) => {
      if (!isPublicRoute() || firedRef.current || alreadyShown()) return
      if (e.clientY < window.innerHeight * 0.08) {
        exitTimerRef.current = setTimeout(() => {
          if (!firedRef.current && !alreadyShown()) {
            firedRef.current = true
            openEQORE()
          }
        }, EXIT_DELAY_MS)
      } else {
        clearTimeout(exitTimerRef.current)
      }
    }

    // ── Trigger 3: Returning visitor (2nd+ session) ───────────────────────
    const returningTimer = setTimeout(() => {
      if (!isPublicRoute() || firedRef.current || alreadyShown()) return
      try {
        const uuid = localStorage.getItem('kq_visitor_uuid')
        if (!uuid) return
        fetch(`/api/public/visitor/footprint/${uuid}`)
          .then(r => r.json())
          .then(data => {
            if (data && data.sessionCount >= 2 && !firedRef.current && !alreadyShown()) {
              firedRef.current = true
              openEQORE()
            }
          })
          .catch(() => {})
      } catch {}
    }, 3000)

    // ── Trigger 4: Time on page ───────────────────────────────────────────
    // Catches users who don't scroll (short pages) and don't move mouse to
    // the top. Falls back to a simple dwell-time trigger.
    const dwellTimer = setTimeout(() => {
      if (!isPublicRoute() || firedRef.current || alreadyShown()) return
      firedRef.current = true
      openEQORE()
    }, TIME_ON_PAGE_MS)

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mousemove', onMouseMove)

    // Run scroll check immediately — fires for pages already scrolled past threshold
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mousemove', onMouseMove)
      clearTimeout(exitTimerRef.current)
      clearTimeout(returningTimer)
      clearTimeout(dwellTimer)
    }
  }, [])
}
