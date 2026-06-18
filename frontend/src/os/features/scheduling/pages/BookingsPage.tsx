import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, X, ChevronLeft, ChevronRight, Calendar, RefreshCw } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
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

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  CONFIRMED: 'success',
  COMPLETED: 'neutral',
  CANCELLED: 'danger',
  NO_SHOW:   'warning',
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

  // client-side filter + paginate (backend returns all for host)
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, email or event type…"
            className="w-full h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white pl-9 pr-3 focus:outline-none focus:border-blue-400"
          />
        </div>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
        >
          <option value="">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>}

      {!isLoading && paged.length === 0 && (
        <Card><CardBody className="text-center py-12">
          <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No bookings found</p>
        </CardBody></Card>
      )}

      {paged.length > 0 && (
        <Card>
          <div className="divide-y divide-[#2E2854]">
            {paged.map(e => {
              const invitee = e.invitees[0]
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-900/40 transition-colors cursor-pointer"
                  onClick={() => setSelected(e)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{e.eventType?.name ?? 'Meeting'}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {invitee?.name ?? '—'}{invitee?.email ? ` · ${invitee.email}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">{new Date(e.startTime).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[e.status] ?? 'neutral'} size="sm">{e.status}</Badge>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{filtered.length} total</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg hover:bg-os-s1 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg hover:bg-os-s1 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-os-s0 border border-os-border rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-white text-lg">{selected.eventType?.name ?? 'Meeting'}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              {selected.invitees[0] && <>
                <div className="flex justify-between"><span className="text-slate-500">Attendee</span><span className="text-white">{selected.invitees[0].name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-white">{selected.invitees[0].email}</span></div>
              </>}
              <div className="flex justify-between"><span className="text-slate-500">When</span><span className="text-white">{new Date(selected.startTime).toLocaleString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Status</span><Badge variant={STATUS_VARIANT[selected.status] ?? 'neutral'} size="sm">{selected.status}</Badge></div>
              {selected.joinUrl && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Meeting link</span>
                  <a href={selected.joinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs underline">Join</a>
                </div>
              )}
            </div>

            {selected.status === 'CONFIRMED' && (
              <div className="flex gap-2 pt-2 border-t border-os-border">
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
