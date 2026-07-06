import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, X, ChevronLeft, ChevronRight, Calendar, RefreshCw, Clock } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface Invitee { name: string; email: string }
interface Event {
  id: string
  eventType: { name: string }
  invitees: Invitee[]
  startTime: string
  endTime: string
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  joinUrl?: string | null
}

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: '#00c875',
  COMPLETED: '#9aa0b0',
  CANCELLED: '#e2445c',
  NO_SHOW:   '#fdab3d',
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  CONFIRMED: 'success', COMPLETED: 'neutral', CANCELLED: 'danger', NO_SHOW: 'warning',
}

const PAGE_SIZE = 15

export function BookingsPage() {
  const queryClient = useQueryClient()
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [selected, setSelected] = useState<Event | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['scheduling-events'],
    queryFn: () => api.get('/scheduling/events').then(r => r.data.events ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 30,
  })

  const allEvents: Event[] = data ?? []

  const filtered = useMemo(() => {
    return allEvents.filter(e => {
      const invitee = e.invitees[0]
      const matchSearch = !search ||
        invitee?.name?.toLowerCase().includes(search.toLowerCase()) ||
        invitee?.email?.toLowerCase().includes(search.toLowerCase()) ||
        e.eventType?.name?.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !status || e.status === status
      return matchSearch && matchStatus
    })
  }, [allEvents, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: (id: string) => api.post(`/scheduling/events/${id}/cancel`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduling-events'] })
      setSelected(null)
    },
  })

  // Stats strip
  const confirmed  = allEvents.filter(e => e.status === 'CONFIRMED').length
  const completed  = allEvents.filter(e => e.status === 'COMPLETED').length
  const cancelled  = allEvents.filter(e => e.status === 'CANCELLED').length

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--os-text-2)' }}>Scheduling</p>
        <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Bookings</h2>
      </div>

      {/* Quick stats */}
      {allEvents.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Confirmed', value: confirmed, bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
            { label: 'Completed', value: completed, bg: 'linear-gradient(135deg,#2564ea 0%,#579bfc 100%)', glow: '#2564ea' },
            { label: 'Cancelled', value: cancelled, bg: 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)', glow: '#e2445c' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}40` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
              <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
              <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--os-text-2)]" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, email or event type…"
            className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] text-sm text-[var(--os-text-1)] pl-9 pr-3 focus:outline-none focus:border-[#579bfc]"
          />
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-[#579bfc]"
        >
          <option value="">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading…</div>}

      {!isLoading && paged.length === 0 && (
        <div className="os-card p-12 text-center">
          <Calendar className="w-10 h-10 text-[var(--os-text-2)] mx-auto mb-3" />
          <p className="text-sm text-[var(--os-text-2)] font-medium">No bookings found</p>
        </div>
      )}

      {paged.length > 0 && (
        <div className="os-card overflow-hidden">
          <div className="divide-y divide-[var(--os-border)]">
            {paged.map(e => {
              const invitee = e.invitees[0]
              const sc = STATUS_COLOR[e.status] ?? '#9aa0b0'
              const initials = (invitee?.name ?? '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--os-surface-0)] transition-colors cursor-pointer"
                  onClick={() => setSelected(e)}
                >
                  {/* Avatar initials */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: sc }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--os-text-1)] truncate">{e.eventType?.name ?? 'Meeting'}</p>
                    <p className="text-xs text-[var(--os-text-2)] truncate">
                      {invitee?.name ?? '—'}{invitee?.email ? ` · ${invitee.email}` : ''}
                    </p>
                  </div>
                  {/* Time block */}
                  <div className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)] flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(e.startTime).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                    <span>{new Date(e.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${sc}20`, color: sc }}>
                    {e.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[var(--os-text-2)]">
          <span>{filtered.length} total</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-[var(--os-border)] hover:bg-[var(--os-surface-0)] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-[var(--os-border)] hover:bg-[var(--os-surface-0)] disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-[var(--os-text-1)] text-lg">{selected.eventType?.name ?? 'Meeting'}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1 inline-flex" style={{ background: `${STATUS_COLOR[selected.status] ?? '#9aa0b0'}20`, color: STATUS_COLOR[selected.status] ?? '#9aa0b0' }}>
                  {selected.status}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              {selected.invitees[0] && <>
                <div className="flex justify-between"><span className="text-[var(--os-text-2)]">Attendee</span><span className="text-[var(--os-text-1)] font-medium">{selected.invitees[0].name}</span></div>
                <div className="flex justify-between"><span className="text-[var(--os-text-2)]">Email</span><span className="text-[var(--os-text-1)]">{selected.invitees[0].email}</span></div>
              </>}
              <div className="flex justify-between"><span className="text-[var(--os-text-2)]">When</span><span className="text-[var(--os-text-1)] font-medium">{new Date(selected.startTime).toLocaleString()}</span></div>
              {selected.joinUrl && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--os-text-2)]">Meeting link</span>
                  <a href={selected.joinUrl} target="_blank" rel="noopener noreferrer" className="text-[#579bfc] text-xs underline">Join</a>
                </div>
              )}
            </div>

            {selected.status === 'CONFIRMED' && (
              <div className="flex gap-2 pt-2 border-t border-[var(--os-border)]">
                <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={() => window.open(`/booking/reschedule/${selected.id}`, '_blank')}>
                  Reschedule
                </Button>
                <Button size="sm" variant="ghost" leftIcon={<X className="w-3.5 h-3.5" />}
                  onClick={() => cancel(selected.id)} disabled={cancelling} loading={cancelling}>
                  Cancel booking
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
