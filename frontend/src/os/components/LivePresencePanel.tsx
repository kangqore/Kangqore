import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, ArrowUpRight } from '@phosphor-icons/react'
import { getSocket, connectSocket } from '@lib/socket'

interface PresenceEntry {
  visitorUuid:   string
  path:          string
  title:         string
  country:       string | null
  city:          string | null
  sessionCount:  number
  isLead:        boolean
  stitchedName:  string | null
  stitchedEmail: string | null
  updatedAt:     number
}

function countryFlag(code: string | null | undefined) {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
}

function heatColor(entry: PresenceEntry) {
  if (entry.stitchedName || entry.isLead) return 'bg-red-500'
  if (entry.sessionCount >= 2)            return 'bg-amber-400'
  return 'bg-slate-500'
}

function heatLabel(entry: PresenceEntry) {
  if (entry.stitchedName || entry.isLead) return 'Known'
  if (entry.sessionCount >= 2)            return 'Returning'
  return 'New'
}

function secsAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000)
  return s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`
}

export function LivePresencePanel({ onClose }: { onClose: () => void }) {
  const [visitors, setVisitors] = useState<PresenceEntry[]>([])
  const navigate  = useNavigate()
  const panelRef  = useRef<HTMLDivElement>(null)

  // Initial snapshot + socket subscription
  useEffect(() => {
    fetch('/api/admin/visitor/presence', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setVisitors(data) })
      .catch(() => {})

    connectSocket()
    const socket = getSocket()
    const onUpdate = (data: PresenceEntry[]) => setVisitors(data)
    socket.on('visitor:presence:update', onUpdate)
    return () => { socket.off('visitor:presence:update', onUpdate) }
  }, [])

  // Click-outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[380px] rounded-2xl z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-150"
      style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: 'var(--os-shadow-md)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--os-border)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-1)]">
            Live on site
          </span>
          <span className="text-[10px] text-[var(--os-text-2)] ml-1">{visitors.length} active</span>
        </div>
        <button
          onClick={() => navigate('/kangqore-view/admin/visitors')}
          className="text-[10px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] flex items-center gap-1 transition-colors"
        >
          All visitors <ArrowUpRight size={10} />
        </button>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto">
        {visitors.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-[var(--os-text-2)]">
            No one on site right now.
          </div>
        ) : (
          visitors.map(v => (
            <button
              key={v.visitorUuid}
              onClick={() => { navigate('/kangqore-view/admin/visitors'); onClose() }}
              className="w-full flex items-start gap-3 px-4 py-3 border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] transition-colors text-left"
            >
              {/* Heat dot */}
              <div className="flex-shrink-0 mt-1 flex flex-col items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${heatColor(v)}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12px] font-semibold text-[var(--os-text-1)] truncate">
                    {v.stitchedName ?? (v.isLead ? 'Known Lead' : 'Anonymous')}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    v.stitchedName || v.isLead
                      ? 'bg-red-500/10 text-red-400'
                      : v.sessionCount >= 2
                        ? 'bg-amber-400/10 text-amber-400'
                        : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {heatLabel(v)}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--os-text-2)] truncate">{v.path}</p>
                {v.stitchedEmail && (
                  <p className="text-[10px] text-[var(--os-text-2)] truncate">{v.stitchedEmail}</p>
                )}
              </div>

              {/* Right: location + time */}
              <div className="flex-shrink-0 text-right">
                <p className="text-[11px] text-[var(--os-text-2)]">
                  {v.country ? `${countryFlag(v.country)} ${v.city ?? v.country}` : '—'}
                </p>
                <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{secsAgo(v.updatedAt)}</p>
                <p className="text-[9px] text-[var(--os-text-2)] mt-0.5">{v.sessionCount} sess.</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
