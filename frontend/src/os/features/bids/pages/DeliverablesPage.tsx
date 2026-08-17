import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Circle, Clock, FileText, ChevronDown, Loader2 } from 'lucide-react'
import { api } from '@lib/api'
import { cn } from '@design-system/cn'

const DELIVERABLE_DESC: Record<string, string> = {
  'Diagnostic Scorecard™':          'Scored output across all 16 pillars — the single-page enterprise health view.',
  'Executive Intelligence Report™': 'Narrative deep-dive: findings, root causes, and evidence for each pillar.',
  'Transformation Blueprint™':      'Prescriptive roadmap with prioritised initiatives and effort/impact ratings.',
  'Risk Register™':                 'Ranked inventory of identified risks with likelihood and impact scores.',
  'Opportunity Register™':          'Prioritised list of high-impact opportunities unlocked by the diagnostic.',
  'Service Prescription Matrix™':   'Mapping of findings to Kangqore service solutions and capability areas.',
  '30/60/90/180-Day Roadmap™':      'Time-phased action plan with milestones across the transformation horizon.',
  'Executive Board Presentation™':  'Board-ready slide deck summarising the diagnostic and strategic recommendations.',
  'Executive Workshop™':            'Facilitated leadership session to align on findings and commit to priorities.',
  'ROI Projection Report™':         'Quantified return-on-investment modelling for the top transformation initiatives.',
}

type DStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETE'

const STATUS_CONFIG: Record<DStatus, { icon: typeof CheckCircle; label: string; color: string }> = {
  COMPLETE:    { icon: CheckCircle, label: 'Complete',    color: '#00c875' },
  IN_PROGRESS: { icon: Clock,       label: 'In Progress', color: '#fdab3d' },
  PENDING:     { icon: Circle,      label: 'Pending',     color: 'var(--os-text-2)' },
}

const STATUS_CYCLE: DStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETE']

function useEngagements() {
  return useQuery({
    queryKey: ['bids-engagements'],
    queryFn:  () => api.get('/admin/bids/engagements').then(r => r.data),
    staleTime: 30_000,
  })
}

export function DeliverablesPage() {
  const { data } = useEngagements()
  const engagements: any[] = data?.engagements ?? []
  const [selectedId, setSelectedId] = useState<string>('')
  const qc = useQueryClient()

  const selected = engagements.find(e => e.id === selectedId)
  const deliverables: any[] = selected?.deliverables ?? []

  const updateDl = useMutation({
    mutationFn: ({ n, status }: { n: number; status: DStatus }) =>
      api.patch(`/admin/bids/engagements/${selectedId}/deliverables/${n}`, { status }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bids-engagements'] }),
  })

  const cycleStatus = (d: any) => {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(d.status) + 1) % STATUS_CYCLE.length]
    updateDl.mutate({ n: d.n, status: next })
  }

  const done    = deliverables.filter(d => d.status === 'COMPLETE').length
  const inProg  = deliverables.filter(d => d.status === 'IN_PROGRESS').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Deliverables Tracker</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            Track the 10 standard deliverables for each engagement.
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="appearance-none rounded-2xl pl-4 pr-9 py-2.5 text-sm focus:outline-none min-w-[220px]"
            style={{
              background: 'var(--os-card)',
              border: '1px solid var(--os-border)',
              color: 'var(--os-text-1)',
            }}
          >
            <option value="">Select engagement…</option>
            {engagements.map(e => (
              <option key={e.id} value={e.id}>{e.clientName} ({e.industry})</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--os-text-3)' }} />
        </div>
      </div>

      {/* Progress summary (when engagement selected) */}
      {selected && (
        <div className="os-card px-5 py-4 flex items-center gap-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{selected.clientName}</span>
              <span style={{ color: 'var(--os-text-3)' }}>{done}/10 complete</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(done / 10) * 100}%`, background: '#579bfc' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs flex-shrink-0">
            <span className="font-semibold" style={{ color: '#00c875' }}>{done} Complete</span>
            <span className="font-semibold" style={{ color: '#fdab3d' }}>{inProg} In Progress</span>
            <span style={{ color: 'var(--os-text-3)' }}>{10 - done - inProg} Pending</span>
          </div>
        </div>
      )}

      {/* Deliverables list */}
      {!selected ? (
        <div className="space-y-1">
          {Object.entries(DELIVERABLE_DESC).map(([name, desc], i) => (
            <div key={name} className="flex items-center gap-4 px-5 py-4 rounded-2xl border-b border-[var(--os-border)]"
              style={{ background: 'var(--os-card)' }}>
              <span className="w-7 h-7 rounded-2xl text-xs font-bold flex items-center justify-center flex-shrink-0"
                style={{ background: '#579bfc18', color: '#579bfc' }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{name}</p>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--os-text-3)' }}>{desc}</p>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0"
                style={{ background: '#64748b18', color: 'var(--os-text-2)', border: '1px solid #64748b30' }}>
                <Circle className="w-3 h-3" />
                Pending
              </span>
            </div>
          ))}
          <p className="text-center text-xs pt-4" style={{ color: 'var(--os-text-3)' }}>
            Select an engagement above to start tracking progress
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {deliverables.map((d: any) => {
            const S = STATUS_CONFIG[d.status as DStatus] ?? STATUS_CONFIG.PENDING
            const Icon = S.icon
            return (
              <div key={d.n} className={cn(
                'flex items-center gap-4 px-5 py-4 rounded-2xl border-b border-[var(--os-border)] last:border-0 transition-colors',
                d.status === 'COMPLETE'
                  ? 'opacity-75'
                  : 'hover:bg-[var(--os-surface-0)]'
              )} style={{ background: 'var(--os-card)' }}>
                <span className="w-7 h-7 rounded-2xl text-xs font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: '#579bfc18', color: '#579bfc' }}>
                  {d.n}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold', d.status === 'COMPLETE' ? 'line-through' : '')}
                    style={{ color: d.status === 'COMPLETE' ? 'var(--os-text-3)' : 'var(--os-text-1)' }}>
                    {d.name}
                  </p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--os-text-3)' }}>
                    {DELIVERABLE_DESC[d.name]}
                  </p>
                  {d.completedAt && (
                    <p className="text-[10px] mt-0.5" style={{ color: '#00c875' }}>
                      Completed {new Date(d.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => cycleStatus(d)}
                  disabled={updateDl.isPending}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: S.color + '18', color: S.color, border: `1px solid ${S.color}30` }}
                >
                  {updateDl.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Icon className="w-3 h-3" />}
                  {S.label}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Info footer */}
      <div className="os-card p-5">
        <div className="flex items-start gap-3">
          <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#579bfc' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>All 10 deliverables are standard for every engagement</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--os-text-3)' }}>
              Click any deliverable status badge to cycle it: Pending → In Progress → Complete.
              Completions are timestamped and tracked per engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
