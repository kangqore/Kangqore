import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Globe, ChatCircle, Target, Clock, Eye, User, CalendarBlank, ArrowSquareOut, MapPin, WifiHigh, DeviceMobile, Desktop, Browser, ArrowUpRight } from '@phosphor-icons/react'
import { api } from '@lib/api'

const EVENT_LABELS: Record<string, string> = {
  PAGE_VIEW:    'Page view',
  SCROLL_DEPTH: 'Scroll depth',
  EQORE_QUERY:  'eQORE query',
  CTA_CLICK:    'CTA click',
  EXIT_INTENT:  'Exit intent',
  SESSION_START:'Session start',
  TIME_ON_PAGE: 'Time on page',
}

const EVENT_COLORS: Record<string, string> = {
  PAGE_VIEW:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  SCROLL_DEPTH: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  EQORE_QUERY:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  CTA_CLICK:    'bg-green-500/10 text-green-400 border-green-500/20',
  EXIT_INTENT:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  SESSION_START:'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  TIME_ON_PAGE: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
}

function countryFlag(code: string | null | undefined) {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
}

function fmt(date: string) {
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="os-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--os-border)] flex items-center gap-2">
        <span className="text-[var(--os-text-2)]">{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function EqoreConversationsSection({ visitorUuid }: { visitorUuid: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['visitor-transcripts', visitorUuid],
    queryFn: () => api.get(`/admin/concierge/transcripts?visitorUuid=${visitorUuid}&limit=5`).then(r => r.data),
    staleTime: 60_000,
  })
  const transcripts: any[] = data?.transcripts ?? []

  return (
    <Section title="eQORE conversations" icon={<ChatCircle size={13} />}>
      {isLoading ? (
        <div className="space-y-2">
          {[1,2].map(i => <div key={i} className="h-8 rounded bg-[var(--os-surface-0)] animate-pulse" />)}
        </div>
      ) : transcripts.length === 0 ? (
        <p className="text-xs text-[var(--os-text-2)]">No conversations stored for this visitor yet.</p>
      ) : (
        <div className="space-y-2">
          {transcripts.map((t: any) => (
            <Link
              key={t.id}
              to={`/kangqore-view/admin/visitors/transcripts`}
              state={{ openId: t.id }}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[var(--os-surface-0)] hover:bg-[var(--os-border)] transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--os-text-1)] truncate">{t.firstMessage ?? '(no preview)'}</p>
                <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{t.turnCount} turns · {new Date(t.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
              </div>
              <ArrowUpRight size={12} className="text-[var(--os-text-2)] flex-shrink-0 mt-0.5 group-hover:text-[var(--os-text-1)]" />
            </Link>
          ))}
          {(data?.total ?? 0) > 5 && (
            <Link
              to="/kangqore-view/admin/visitors/transcripts"
              className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
            >
              View all {data.total} conversations →
            </Link>
          )}
        </div>
      )}
    </Section>
  )
}

export function VisitorDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-visitor', id],
    queryFn: () => api.get(`/admin/visitor/${id}`).then(r => r.data),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="os-card p-6">
            <div className="h-4 w-48 bg-[var(--os-surface-0)] rounded animate-pulse mb-3" />
            <div className="h-3 w-full bg-[var(--os-surface-0)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="os-card p-10 text-center text-[var(--os-text-2)] text-sm">
        Visitor not found.
      </div>
    )
  }

  const { visitor, user } = data
  const events: any[] = visitor.events ?? []

  // Group events by date
  const grouped: Record<string, any[]> = {}
  for (const ev of events) {
    const day = new Date(ev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(ev)
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => navigate('/kangqore-view/admin/visitors')}
        className="flex items-center gap-2 text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
      >
        <ArrowLeft size={13} /> Back to visitors
      </button>

      {/* Header */}
      <div className="os-card p-5 flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-[var(--os-surface-0)] flex items-center justify-center flex-shrink-0">
          <Eye size={20} className="text-[var(--os-text-2)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="text-lg font-black text-[var(--os-text-1)] truncate">
              {user ? user.name : 'Anonymous Visitor'}
            </h2>
            {visitor.stitchedToId
              ? <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-semibold">Identified</span>
              : <span className="text-[10px] bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded-full">Anonymous</span>
            }
          </div>
          {user && (
            <p className="text-sm text-[var(--os-text-2)]">{user.email} · {user.role}</p>
          )}
          <p className="text-[10px] text-[var(--os-text-2)] mt-1 font-mono">{visitor.visitorUuid}</p>
        </div>

        {/* KPIs */}
        <div className="flex gap-6 flex-shrink-0">
          {[
            { label: 'Sessions',  value: visitor.sessionCount },
            { label: 'Events',    value: events.length        },
            { label: 'eQORE',     value: visitor.eqoreQueries?.length ?? 0 },
          ].map(k => (
            <div key={k.label} className="text-center">
              <p className="text-2xl font-black text-[var(--os-text-1)]">{k.value}</p>
              <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide">{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'First seen',  value: fmt(visitor.firstSeen),  icon: <CalendarBlank size={12} /> },
          { label: 'Last seen',   value: fmt(visitor.lastSeen),   icon: <Clock size={12} />         },
          { label: 'Location',    value: visitor.country ? `${countryFlag(visitor.country)} ${visitor.city ?? visitor.country}` : '—', icon: <MapPin size={12} /> },
          { label: 'IP address',  value: visitor.ipAddress ?? '—', icon: <WifiHigh size={12} />     },
        ].map(m => (
          <div key={m.label} className="os-card p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] flex items-center gap-1 mb-1">{m.icon}{m.label}</p>
            <p className="text-sm font-semibold text-[var(--os-text-1)] truncate">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Network + UTM row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'ISP / Org',   value: visitor.isp      ?? '—', icon: <WifiHigh size={12} />      },
          { label: 'UTM source',  value: visitor.utmSource ?? '—', icon: <Globe size={12} />         },
          { label: 'UTM medium',  value: visitor.utmMedium ?? '—', icon: <Globe size={12} />         },
          { label: 'Referrer',    value: visitor.referrer ? (() => { try { return new URL(visitor.referrer).hostname } catch { return visitor.referrer } })() : '—',
            icon: <ArrowSquareOut size={12} /> },
        ].map(m => (
          <div key={m.label} className="os-card p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] flex items-center gap-1 mb-1">{m.icon}{m.label}</p>
            <p className="text-sm font-semibold text-[var(--os-text-1)] truncate">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top pages */}
        <Section title="Top pages" icon={<Globe size={13} />}>
          {visitor.topPages?.length > 0 ? (
            <div className="space-y-2">
              {visitor.topPages.map((p: string, i: number) => (
                <div key={p} className="flex items-center gap-3">
                  <span className="text-[10px] w-4 text-[var(--os-text-2)] text-right">{i + 1}</span>
                  <span className="flex-1 text-xs text-[var(--os-text-2)] truncate">{p}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-[var(--os-text-2)]">No page data yet.</p>}
        </Section>

        {/* Intent + eQORE queries */}
        <div className="space-y-4">
          {visitor.intentTags?.length > 0 && (
            <Section title="Intent signals" icon={<Target size={13} />}>
              <div className="flex flex-wrap gap-2">
                {visitor.intentTags.map((t: string) => (
                  <span key={t} className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </Section>
          )}
          {visitor.eqoreQueries?.length > 0 && (
            <Section title="eQORE queries" icon={<ChatCircle size={13} />}>
              <div className="space-y-2">
                {visitor.eqoreQueries.slice(0, 10).map((q: string, i: number) => (
                  <p key={i} className="text-xs text-[var(--os-text-2)]">"{q}"</p>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Device signals */}
      {visitor.deviceSignals && (() => {
        const ds = visitor.deviceSignals as any
        return (
          <Section title="Device & network" icon={<Desktop size={13} />}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Browser',     value: ds.browser   ?? '—', icon: <Browser size={11} />       },
                { label: 'OS',          value: ds.os        ?? '—', icon: <Desktop size={11} />        },
                { label: 'Device type', value: ds.device    ?? '—', icon: <DeviceMobile size={11} />   },
                { label: 'Screen',      value: ds.screen    ?? '—', icon: <Eye size={11} />            },
                { label: 'Language',    value: ds.lang      ?? '—', icon: <Globe size={11} />          },
                { label: 'Timezone',    value: ds.tz        ?? '—', icon: <Clock size={11} />          },
                { label: 'Connection',  value: ds.connection ?? '—', icon: <WifiHigh size={11} />      },
                { label: 'Do Not Track', value: ds.dnt ? 'Yes' : 'No', icon: <MapPin size={11} />     },
              ].map(m => (
                <div key={m.label} className="bg-[var(--os-surface-0)] rounded-xl p-3">
                  <p className="text-[9px] uppercase tracking-widest text-[var(--os-text-2)] flex items-center gap-1 mb-1">{m.icon}{m.label}</p>
                  <p className="text-xs font-semibold text-[var(--os-text-1)] truncate">{m.value}</p>
                </div>
              ))}
            </div>
          </Section>
        )
      })()}

      {/* Stitched user */}
      {user && (
        <Section title="Identified as" icon={<User size={13} />}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--os-surface-0)] flex items-center justify-center">
              <span className="text-sm font-bold text-[var(--os-text-1)]">{user.name[0]}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--os-text-1)]">{user.name}</p>
              <p className="text-xs text-[var(--os-text-2)]">{user.email} · {user.role}</p>
              <p className="text-[10px] text-[var(--os-text-2)]">
                Stitched {visitor.stitchedAt ? fmt(visitor.stitchedAt) : '—'} ·{' '}
                Registered {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* eQORE Conversations */}
      {visitor.eqoreQueries?.length > 0 && (
        <EqoreConversationsSection visitorUuid={visitor.visitorUuid} />
      )}

      {/* Event timeline */}
      <Section title="Full event timeline" icon={<Clock size={13} />}>
        {events.length === 0 ? (
          <p className="text-xs text-[var(--os-text-2)]">No events recorded yet.</p>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([day, evs]) => (
              <div key={day}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-2">{day}</p>
                <div className="space-y-1.5 border-l-2 border-[var(--os-border)] pl-4 ml-1">
                  {evs.map((ev, i) => (
                    <div key={i} className="flex items-start gap-3 relative">
                      <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[var(--os-border)]" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold whitespace-nowrap flex-shrink-0 ${EVENT_COLORS[ev.type] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {EVENT_LABELS[ev.type] ?? ev.type}
                      </span>
                      <span className="text-[11px] text-[var(--os-text-2)] truncate flex-1">{ev.path}</span>
                      {ev.data && Object.keys(ev.data).length > 0 && (
                        <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0 max-w-[120px] truncate">
                          {ev.type === 'EQORE_QUERY' && (ev.data as any).query
                            ? `"${(ev.data as any).query}"`
                            : ev.type === 'SCROLL_DEPTH'
                              ? `${(ev.data as any).pct}%`
                              : ev.type === 'TIME_ON_PAGE'
                                ? `${(ev.data as any).seconds}s`
                                : ''}
                        </span>
                      )}
                      <span className="text-[9px] text-[var(--os-text-2)] whitespace-nowrap flex-shrink-0">
                        {new Date(ev.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
