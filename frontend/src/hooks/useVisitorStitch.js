import { useEffect } from 'react'
import { getVisitorUuid } from './useVisitorIdentity'

const API = import.meta.env.VITE_BACKEND_URL || ''
const STITCHED_KEY = 'kq_visitor_stitched'

export default function useVisitorStitch(userId) {
  useEffect(() => {
    if (!userId) return
    const uuid = getVisitorUuid()
    if (!uuid) return

    const alreadyStitched = localStorage.getItem(STITCHED_KEY)
    if (alreadyStitched === userId) return

    fetch(`${API}/api/public/visitor/stitch`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ visitorUuid: uuid, userId }),
    })
      .then(r => r.ok && localStorage.setItem(STITCHED_KEY, userId))
      .catch(() => {})
  }, [userId])
}
