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

const STATUS_CONFIG: Record<DStatus, { icon: typeof CheckCircle; label: string; chip: string }> = {
  COMPLETE:    { icon: CheckCircle, label: 'Complete',     chip: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
  IN_PROGRESS: { icon: Clock,       label: 'In Progress',  chip: 'bg-amber-500/10 border-amber-500/20 text-amber-300'       },
  PENDING:     { icon: Circle,      label: 'Pending',      chip: 'bg-white/5 border-white/10 text-slate-400'                },
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
      {/* Header + engagement selector */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Deliverables Tracker</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Track the 10 standard deliverables for each engagement.
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-os-blue/50 min-w-[220px]"
          >
            <option value="" className="bg-slate-900">Select engagement…</option>
            {engagements.map(e => (
              <option key={e.id} value={e.id} className="bg-slate-900">
                {e.clientName} ({e.industry})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Progress bar (when engagement selected) */}
      {selected && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium text-slate-200">{selected.clientName}</span>
              <span>{done}/10 complete</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-os-blue to-os-cyan transition-all duration-500"
                style={{ width: `${(done / 10) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-300 font-semibold">{done} Complete</span>
            <span className="text-amber-300 font-semibold">{inProg} In Progress</span>
            <span className="text-slate-400">{10 - done - inProg} Pending</span>
          </div>
        </div>
      )}

      {/* Deliverables list */}
      {!selected ? (
        <div className="space-y-2">
          {/* Static preview — no engagement selected */}
          {Object.entries(DELIVERABLE_DESC).map(([ name, desc ], i) => (
            <div key={name} className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <span className="w-7 h-7 rounded-lg bg-os-blue/10 text-os-cyan text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100">{name}</p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{desc}</p>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold bg-white/5 border-white/10 text-slate-400 flex-shrink-0">
                <Circle className="w-3 h-3" />
                Pending
              </span>
            </div>
          ))}
          <p className="text-center text-xs text-slate-500 pt-2">Select an engagement above to start tracking progress</p>
        </div>
      ) : (
        <div className="space-y-2">
          {deliverables.map((d: any) => {
            const S = STATUS_CONFIG[d.status as DStatus] ?? STATUS_CONFIG.PENDING
            const Icon = S.icon
            return (
              <div key={d.n} className={cn(
                'flex items-center gap-4 px-5 py-4 rounded-xl border transition-colors',
                d.status === 'COMPLETE' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
              )}>
                <span className="w-7 h-7 rounded-lg bg-os-blue/10 text-os-cyan text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {d.n}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold', d.status === 'COMPLETE' ? 'text-slate-400 line-through' : 'text-slate-100')}>
                    {d.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{DELIVERABLE_DESC[d.name]}</p>
                  {d.completedAt && (
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      Completed {new Date(d.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => cycleStatus(d)}
                  disabled={updateDl.isPending}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity',
                    S.chip
                  )}
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
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <FileText className="w-4 h-4 text-os-cyan mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-200">All 10 deliverables are standard for every engagement</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Click any deliverable status badge to cycle it: Pending → In Progress → Complete.
              Completions are timestamped and tracked per engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
