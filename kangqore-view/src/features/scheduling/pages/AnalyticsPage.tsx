import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart2 } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

// Backend accepts ?days=7|30|90
const RANGES = [
  { label: '7 days',  days: 7  },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
]

interface AnalyticsResponse {
  metrics: {
    totalBookings: number
    cancellationRate: number
    noShowRate: number
  }
  timeSeries: { date: string; bookings: number }[]
  eventTypeBreakdown: { name: string; value: number }[]
}

interface EventType { id: string; name: string }

export function AnalyticsPage() {
  const [days, setDays]             = useState(30)
  const [eventTypeId, setEventTypeId] = useState('')

  const { data: eventTypes = [] } = useQuery<EventType[]>({
    queryKey: ['event-types-simple'],
    queryFn: () => api.get('/scheduling/event-types').then(r => r.data.eventTypes ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 10,
  })

  const { data, isLoading } = useQuery<AnalyticsResponse>({
    queryKey: ['scheduling-analytics', days, eventTypeId],
    queryFn: () => api.get('/scheduling/analytics', {
      params: { days, eventTypeId: eventTypeId || undefined }
    }).then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const total     = data?.metrics.totalBookings ?? 0
  const cancelPct = data?.metrics.cancellationRate ?? 0
  const noShowPct = data?.metrics.noShowRate ?? 0
  const confirmed = total - Math.round(total * cancelPct / 100)
  const maxCount  = data?.timeSeries.length
    ? Math.max(...data.timeSeries.map(d => d.bookings), 1)
    : 1

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-os-s1 rounded-xl p-1">
          {RANGES.map(r => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${days === r.days ? 'bg-os-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <select
          value={eventTypeId}
          onChange={e => setEventTypeId(e.target.value)}
          className="h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
        >
          <option value="">All event types</option>
          {eventTypes.map(et => <option key={et.id} value={et.id}>{et.name}</option>)}
        </select>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total bookings"    value={total}                              />
            <StatCard label="Confirmed"         value={confirmed}                          />
            <StatCard label="Cancellation rate" value={`${cancelPct.toFixed(1)}%`}        />
            <StatCard label="No-show rate"      value={`${noShowPct.toFixed(1)}%`}        />
          </div>

          {data.timeSeries?.length > 0 && (
            <Card>
              <CardBody className="p-5">
                <p className="text-sm font-semibold text-white mb-4">Bookings per day</p>
                <div className="flex items-end gap-1 h-28">
                  {data.timeSeries.map(d => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full rounded-t bg-os-blue/70 group-hover:bg-os-blue transition-all"
                        style={{ height: `${Math.max(4, (d.bookings / maxCount) * 100)}%` }}
                      />
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {d.bookings}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>{data.timeSeries[0]?.date ? new Date(data.timeSeries[0].date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}</span>
                  <span>{data.timeSeries.at(-1)?.date ? new Date(data.timeSeries.at(-1)!.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}</span>
                </div>
              </CardBody>
            </Card>
          )}

          {data.eventTypeBreakdown?.length > 0 && (
            <Card>
              <CardBody className="p-5">
                <p className="text-sm font-semibold text-white mb-4">Top event types</p>
                <div className="space-y-3">
                  {data.eventTypeBreakdown.map(et => {
                    const pct = total > 0 ? Math.round((et.value / total) * 100) : 0
                    return (
                      <div key={et.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{et.name}</span>
                          <span className="text-slate-500">{et.value} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-os-s1 rounded-full overflow-hidden">
                          <div className="h-full bg-os-blue rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}

      {!isLoading && !data && (
        <Card><CardBody className="text-center py-12">
          <BarChart2 className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No data for this period</p>
        </CardBody></Card>
      )}
    </div>
  )
}
