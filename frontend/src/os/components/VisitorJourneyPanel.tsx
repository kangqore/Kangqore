import { useEffect, useState } from 'react'
import { Globe, MessageSquare, Target, Clock, Eye, ArrowUpRight } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || ''

const EVENT_LABELS: Record<string, string> = {
  PAGE_VIEW:    'Viewed',
  SCROLL_DEPTH: 'Scrolled',
  EQORE_QUERY:  'Asked eQORE',
  CTA_CLICK:    'Clicked CTA',
  EXIT_INTENT:  'Exit intent',
  SESSION_START:'Session start',
  TIME_ON_PAGE: 'Time on page',
}

const EVENT_COLORS: Record<string, string> = {
  PAGE_VIEW:    'bg-blue-500/15 text-blue-400',
  SCROLL_DEPTH: 'bg-slate-500/15 text-slate-400',
  EQORE_QUERY:  'bg-purple-500/15 text-purple-400',
  CTA_CLICK:    'bg-green-500/15 text-green-400',
  EXIT_INTENT:  'bg-amber-500/15 text-amber-400',
  SESSION_START:'bg-cyan-500/15 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent',
  TIME_ON_PAGE: 'bg-slate-500/15 text-slate-300',
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface Props {
  userId?: string
  email?: string
}

export function VisitorJourneyPanel({ userId, email }: Props) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId && !email) return
    setLoading(true)
    const token = localStorage.getItem('token')
    const url = userId
      ? `${API}/api/admin/visitor/by-user/${encodeURIComponent(userId)}`
      : `${API}/api/admin/visitor/by-email/${encodeURIComponent(email!)}`

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [userId, email])

  if (!userId && !email) return null

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] p-5">
        <div className="h-4 w-32 bg-[var(--os-surface-0)] rounded animate-pulse" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] p-5">
        <p className="text-xs text-[var(--os-text-2)] flex items-center gap-2">
          <Eye size={13} /> No pre-registration visitor journey found.
        </p>
      </div>
    )
  }

  const events: any[] = (data.events ?? []).slice(0, 30)
  const pageViews = events.filter(e => e.type === 'PAGE_VIEW')
  const queries   = events.filter(e => e.type === 'EQORE_QUERY')

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--os-border)] flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-[var(--os-text-2)] uppercase">
          Visitor Journey
        </span>
        <span className="text-[10px] text-[var(--os-text-2)]">
          Pre-registration footprint
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-[var(--os-border)] border-b border-[var(--os-border)]">
        <Stat icon={<Globe size={12} />} label="Sessions" value={data.sessionCount ?? 0} />
        <Stat icon={<Eye size={12} />} label="Pages" value={pageViews.length} />
        <Stat icon={<MessageSquare size={12} />} label="eQORE queries" value={queries.length} />
      </div>

      {/* Top pages */}
      {data.topPages?.length > 0 && (
        <div className="px-5 py-3 border-b border-[var(--os-border)]">
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Globe size={10} /> Top pages visited
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.topPages.slice(0, 6).map((p: string) => (
              <span key={p} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                {p} <ArrowUpRight size={9} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Intent signals */}
      {data.intentTags?.length > 0 && (
        <div className="px-5 py-3 border-b border-[var(--os-border)]">
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Target size={10} /> Intent signals
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.intentTags.map((t: string) => (
              <span key={t} className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* eQORE queries */}
      {queries.length > 0 && (
        <div className="px-5 py-3 border-b border-[var(--os-border)]">
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <MessageSquare size={10} /> What they asked eQORE
          </p>
          <div className="space-y-1">
            {queries.slice(0, 5).map((q, i) => (
              <p key={i} className="text-xs text-[var(--os-text-2)] truncate">
                "{(q.data as any)?.query}"
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Event timeline */}
      {events.length > 0 && (
        <div className="px-5 py-3">
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Clock size={10} /> Event timeline
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {events.map((ev, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${EVENT_COLORS[ev.type] ?? 'bg-slate-500/15 text-slate-400'}`}>
                  {EVENT_LABELS[ev.type] ?? ev.type}
                </span>
                <span className="text-[10px] text-[var(--os-text-2)] truncate flex-1">{ev.path}</span>
                <span className="text-[9px] text-[var(--os-text-2)] whitespace-nowrap">{timeAgo(ev.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First seen */}
      <div className="px-5 py-2.5 bg-[var(--os-surface-0)] border-t border-[var(--os-border)]">
        <p className="text-[10px] text-[var(--os-text-2)]">
          First seen {new Date(data.firstSeen).toLocaleDateString()} · Last seen {timeAgo(data.lastSeen)}
          {data.utmSource && ` · Source: ${data.utmSource}`}
          {data.referrer && ` · Referrer: ${new URL(data.referrer).hostname}`}
        </p>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="px-4 py-3 flex flex-col items-center gap-0.5">
      <span className="text-[var(--os-text-2)] flex items-center gap-1 text-[10px]">{icon}{label}</span>
      <span className="text-lg font-bold text-[var(--os-text-1)]">{value}</span>
    </div>
  )
}
