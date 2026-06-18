import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, X, ChevronLeft, ChevronRight, Calendar, RefreshCw } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface Booking {
  id: string
  title: string
  attendeeName: string
  attendeeEmail: string
  startTime: string
  endTime: string
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  timezone: string
  joinUrl?: string
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  CONFIRMED:  'success',
  COMPLETED:  'neutral',
  CANCELLED:  'danger',
  NO_SHOW:    'warning',
}

const PAGE_SIZE = 15

export function BookingsPage() {
  const queryClient = useQueryClient()
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['scheduling-bookings', page, search, status],
    queryFn: () => api.get('/scheduling/bookings', {
      params: { page, limit: PAGE_SIZE, search: search || undefined, status: status || undefined }
    }).then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 30,
  })

  const bookings: Booking[] = data?.bookings ?? []
  const total: number = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduling-bookings'] })
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
            placeholder="Search by name or email…"
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

      {!isLoading && bookings.length === 0 && (
        <Card><CardBody className="text-center py-12">
          <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No bookings found</p>
        </CardBody></Card>
      )}

      {bookings.length > 0 && (
        <Card>
          <div className="divide-y divide-[#2E2854]">
            {bookings.map(b => (
              <div
                key={b.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-900/40 transition-colors cursor-pointer"
                onClick={() => setSelected(b)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{b.title}</p>
                  <p className="text-xs text-slate-500 truncate">{b.attendeeName} · {b.attendeeEmail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">{new Date(b.startTime).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-500">{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Badge variant={STATUS_VARIANT[b.status] ?? 'neutral'} size="sm">{b.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{total} total</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg hover:bg-os-s1 disabled:opacity-30"
            ><ChevronLeft className="w-4 h-4" /></button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg hover:bg-os-s1 disabled:opacity-30"
            ><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-os-s0 border border-os-border rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-white text-lg">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Attendee</span><span className="text-white">{selected.attendeeName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-white">{selected.attendeeEmail}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">When</span><span className="text-white">{new Date(selected.startTime).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><Badge variant={STATUS_VARIANT[selected.status] ?? 'neutral'} size="sm">{selected.status}</Badge></div>
              {selected.joinUrl && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Meeting link</span>
                  <a href={selected.joinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs underline truncate max-w-[180px]">Join</a>
                </div>
              )}
            </div>

            {selected.status === 'CONFIRMED' && (
              <div className="flex gap-2 pt-2 border-t border-os-border">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={() => window.open(`/booking/reschedule/${selected.id}`, '_blank')}
                >
                  Reschedule
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<X className="w-3.5 h-3.5" />}
                  onClick={() => cancel(selected.id)}
                  disabled={cancelling}
                  loading={cancelling}
                >
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
