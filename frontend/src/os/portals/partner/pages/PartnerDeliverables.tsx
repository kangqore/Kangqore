import { useState } from 'react'
import { Package, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { StatCard } from '@design-system/components/StatCard'
import { cn } from '@design-system/cn'
import { usePartnerDeliverables } from '../usePartnerData'

const MOCK_DELIVERABLES = [
  { id: 'd1', title: 'Redis caching layer — implementation + tests', status: 'IN_PROGRESS', qualityGateStatus: null,    project: { title: 'Urban Mobility Platform' },    createdAt: '2026-05-20T09:00:00Z', updatedAt: '2026-06-01T14:00:00Z' },
  { id: 'd2', title: 'WebSocket real-time fleet tracking module',    status: 'IN_PROGRESS', qualityGateStatus: null,    project: { title: 'Urban Mobility Platform' },    createdAt: '2026-05-25T10:00:00Z', updatedAt: '2026-06-02T09:00:00Z' },
  { id: 'd3', title: 'API gateway load test report',                 status: 'PENDING',     qualityGateStatus: null,    project: { title: 'GreenSpark Energy Dashboard' }, createdAt: '2026-05-28T10:00:00Z', updatedAt: '2026-05-28T10:00:00Z' },
  { id: 'd4', title: 'Code review — auth middleware PR #44',         status: 'REVIEW',      qualityGateStatus: null,    project: { title: 'Urban Mobility Platform' },    createdAt: '2026-05-30T08:00:00Z', updatedAt: '2026-06-01T16:00:00Z' },
  { id: 'd5', title: 'Solar data ingestion pipeline — v1',           status: 'SUBMITTED',   qualityGateStatus: 'PASSED',project: { title: 'GreenSpark Energy Dashboard' }, createdAt: '2026-05-15T10:00:00Z', updatedAt: '2026-05-25T14:00:00Z' },
  { id: 'd6', title: 'Analytics dashboard — all chart components',   status: 'ACCEPTED',    qualityGateStatus: 'PASSED',project: { title: 'Quantum Analytics Suite' },    createdAt: '2026-04-20T10:00:00Z', updatedAt: '2026-05-10T11:00:00Z' },
  { id: 'd7', title: 'Custom report builder — Phase 2',              status: 'ACCEPTED',    qualityGateStatus: 'PASSED',project: { title: 'Quantum Analytics Suite' },    createdAt: '2026-05-01T09:00:00Z', updatedAt: '2026-05-28T15:00:00Z' },
]

const STATUS_CONFIG: Record<string, { label: string; variant: 'neutral' | 'info' | 'warning' | 'success' | 'brand'; icon: React.ReactNode }> = {
  PENDING:     { label: 'Pending',     variant: 'neutral', icon: <Clock        className="w-4 h-4 text-slate-500"   /> },
  IN_PROGRESS: { label: 'In Progress', variant: 'info',    icon: <Clock        className="w-4 h-4 text-blue-500"    /> },
  REVIEW:      { label: 'In Review',   variant: 'warning', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
  SUBMITTED:   { label: 'Submitted',   variant: 'brand',   icon: <Package      className="w-4 h-4 text-blue-600"   /> },
  ACCEPTED:    { label: 'Accepted',    variant: 'success', icon: <CheckCircle2 className="w-4 h-4 text-green-500"  /> },
  REJECTED:    { label: 'Rejected',    variant: 'neutral', icon: <AlertTriangle className="w-4 h-4 text-red-500"   /> },
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

type Filter = 'ALL' | 'IN_PROGRESS' | 'REVIEW' | 'SUBMITTED' | 'ACCEPTED'

export function PartnerDeliverables() {
  const { data } = usePartnerDeliverables()
  const deliverables = (data as typeof MOCK_DELIVERABLES | undefined)?.length ? data as typeof MOCK_DELIVERABLES : MOCK_DELIVERABLES
  const [filter, setFilter] = useState<Filter>('ALL')

  const visible = filter === 'ALL' ? deliverables : deliverables.filter(d => d.status === filter)

  const inProgress = deliverables.filter(d => d.status === 'IN_PROGRESS').length
  const inReview   = deliverables.filter(d => d.status === 'REVIEW').length
  const accepted   = deliverables.filter(d => d.status === 'ACCEPTED').length

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">Deliverables</h2>
        <p className="text-sm text-slate-500 mt-0.5">{deliverables.length} total · {inProgress} in progress</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="In Progress" value={inProgress} icon={<Clock        className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="In Review"   value={inReview}   icon={<AlertTriangle className="w-5 h-5" />} iconColor={inReview > 0 ? 'bg-amber-100 text-amber-600' : 'bg-os-s1 text-slate-500'} />
        <StatCard label="Accepted"    value={accepted}   icon={<CheckCircle2  className="w-5 h-5" />} iconColor="bg-green-100 text-green-600" />
      </div>

      <div className="flex items-center gap-2">
        {(['ALL','IN_PROGRESS','REVIEW','SUBMITTED','ACCEPTED'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f ? 'bg-os-success text-white' : 'bg-os-s1 border border-os-border text-slate-500 hover:border-green-300'
            }`}>
            {f === 'ALL' ? 'All' : STATUS_CONFIG[f]?.label ?? f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map(d => {
          const cfg = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.PENDING
          return (
            <Card key={d.id} className="hover:shadow-md transition-all duration-200">
              <div className="flex items-start gap-3">
                {cfg.icon}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium text-slate-200', d.status === 'ACCEPTED' && 'text-slate-500 line-through')}>{d.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {d.qualityGateStatus === 'PASSED' && (
                        <Badge variant="success" size="sm">QA ✓</Badge>
                      )}
                      <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span>{d.project.title}</span>
                    <span>Updated {fmtDate(d.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">No deliverables match this filter.</div>
        )}
      </div>
    </div>
  )
}
