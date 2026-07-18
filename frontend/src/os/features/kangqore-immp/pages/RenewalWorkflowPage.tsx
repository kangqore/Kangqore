import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, CheckSquare, Square, MessageSquare, Star, TrendingUp, RefreshCw, Send } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLUE = '#579bfc'
const TEAL = '#14b8a6'
const PURP = '#7c3aed'

interface HealthScore {
  id: string; customerId: string
  totalScore: number; tier: string; computedAt: string
  renewalProximityDays: number; oisDelta: number; npsScore: number | null
}

interface NpsResponse {
  id: string; customerId: string; score: number; category: string
  comment: string | null; surveyTrigger: string; createdAt: string
}

interface NpsData {
  responses: NpsResponse[]; total: number; nps: number | null
  promoters: number; passives: number; detractors: number
}

const TIER_CLR: Record<string, string> = { GREEN: GRN, AMBER: AMB, RED }

export function RenewalWorkflowPage() {
  const qc = useQueryClient()
  const [npsForm, setNpsForm] = useState({ customerId: '', score: '9', comment: '', trigger: 'MANUAL' })
  const [showNpsForm, setShowNpsForm] = useState(false)
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  const healthScores = useQuery<{ scores: HealthScore[] }>({
    queryKey: ['health-scores'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/health-scores').then(r => r.data),
    staleTime: 30_000,
  })

  const npsData = useQuery<NpsData>({
    queryKey: ['nps-responses'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/nps').then(r => r.data),
    staleTime: 30_000,
  })

  const submitNps = useMutation({
    mutationFn: () => api.post(`/admin/kangqore-immp/customers/${npsForm.customerId.trim()}/nps`, {
      score: parseInt(npsForm.score), comment: npsForm.comment || null, surveyTrigger: npsForm.trigger,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nps-responses'] })
      setShowNpsForm(false)
      setNpsForm({ customerId: '', score: '9', comment: '', trigger: 'MANUAL' })
    },
  })

  const scores = healthScores.data?.scores ?? []
  const nps    = npsData.data

  const RENEWAL_STEPS = [
    'Confirm renewal date in CRM',
    'Run health score recompute',
    'Review NPS trend last 90 days',
    'Prepare executive deck with OIS delta',
    'Confirm Blueprint version is current',
    'Schedule QBR call',
    'Deliver renewal proposal',
    'Log outcome in pipeline',
  ]

  const toggleStep = (step: string) => setChecklist(c => ({ ...c, [step]: !c[step] }))
  const completedCount = RENEWAL_STEPS.filter(s => checklist[s]).length

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(20,184,166,0.1)', border: `1px solid rgba(20,184,166,0.2)` }}>
            <Calendar className="w-6 h-6" style={{ color: TEAL }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-bold" style={{ color: T1 }}>Renewal Workflow</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(20,184,166,0.1)', color: TEAL }}>S69</span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              NPS tracking, renewal timeline, and pre-renewal success playbook. Coordinate QBRs and deliver evidence-based renewal proposals.
            </p>
          </div>
          <button onClick={() => { healthScores.refetch(); npsData.refetch() }}
            className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border" style={{ color: T2, borderColor: BDR }}>
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* NPS Overview */}
        <div className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
          <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: BDR }}>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: AMB }} />
              <p className="text-sm font-bold" style={{ color: T1 }}>NPS Overview</p>
            </div>
            <button onClick={() => setShowNpsForm(!showNpsForm)}
              className="text-xs px-3 py-1.5 rounded-lg font-bold"
              style={{ background: 'rgba(245,158,11,0.1)', color: AMB }}>
              + Record
            </button>
          </div>

          {showNpsForm && (
            <div className="p-4 border-b space-y-3" style={{ borderColor: BDR, background: SURF }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Customer ID</p>
                  <input value={npsForm.customerId} onChange={e => setNpsForm(f => ({ ...f, customerId: e.target.value }))}
                    placeholder="cuid…" className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                    style={{ borderColor: BDR, background: CARD, color: T1 }} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Score (0-10)</p>
                  <input type="number" min="0" max="10" value={npsForm.score}
                    onChange={e => setNpsForm(f => ({ ...f, score: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                    style={{ borderColor: BDR, background: CARD, color: T1 }} />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Comment (optional)</p>
                <textarea value={npsForm.comment} onChange={e => setNpsForm(f => ({ ...f, comment: e.target.value }))}
                  rows={2} placeholder="Customer feedback…"
                  className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none resize-none"
                  style={{ borderColor: BDR, background: CARD, color: T1 }} />
              </div>
              <button disabled={!npsForm.customerId.trim() || submitNps.isPending}
                onClick={() => submitNps.mutate()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
                style={{ background: AMB, color: '#fff' }}>
                <Send className="w-3.5 h-3.5" />
                {submitNps.isPending ? 'Saving…' : 'Record NPS'}
              </button>
            </div>
          )}

          <div className="p-5">
            {nps ? (
              <>
                <div className="flex items-end gap-2 mb-4">
                  <p className="text-4xl font-black" style={{ color: nps.nps !== null && nps.nps >= 50 ? GRN : nps.nps !== null && nps.nps >= 0 ? AMB : RED }}>
                    {nps.nps !== null ? (nps.nps >= 0 ? '+' : '') + Math.round(nps.nps) : '—'}
                  </p>
                  <p className="text-sm mb-1 font-semibold" style={{ color: T2 }}>NPS</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Promoters',  value: nps.promoters,  color: GRN  },
                    { label: 'Passives',   value: nps.passives,   color: AMB  },
                    { label: 'Detractors', value: nps.detractors, color: RED  },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: SURF }}>
                      <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px]" style={{ color: T2 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] mt-3" style={{ color: T2 }}>{nps.total} total responses</p>
              </>
            ) : (
              <div className="py-8 text-center">
                <Star className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: T2 }} />
                <p className="text-xs" style={{ color: T2 }}>No NPS data yet</p>
              </div>
            )}

            {(nps?.responses ?? []).slice(0, 3).map(r => (
              <div key={r.id} className="mt-3 rounded-xl p-3 border" style={{ borderColor: BDR, background: SURF }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black" style={{ color: parseInt(r.score as any) >= 9 ? GRN : parseInt(r.score as any) >= 7 ? AMB : RED }}>
                    {r.score}/10
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(87,155,252,0.1)', color: BLUE }}>{r.category}</span>
                  <span className="text-[10px] ml-auto" style={{ color: T2 }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-[11px] mt-1" style={{ color: T2 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Renewal Checklist */}
        <div className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
          <div className="p-5 border-b" style={{ borderColor: BDR }}>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" style={{ color: PURP }} />
              <p className="text-sm font-bold" style={{ color: T1 }}>Pre-Renewal Checklist</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: SURF }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(completedCount / RENEWAL_STEPS.length) * 100}%`, background: PURP }} />
              </div>
              <span className="text-xs font-bold" style={{ color: PURP }}>{completedCount}/{RENEWAL_STEPS.length}</span>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: BDR }}>
            {RENEWAL_STEPS.map((step, i) => {
              const done = !!checklist[step]
              return (
                <button key={step} onClick={() => toggleStep(step)}
                  className="flex items-center gap-3 px-5 py-3.5 w-full text-left hover:bg-[var(--os-surface-0)] transition-colors">
                  {done
                    ? <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: GRN }} />
                    : <Square className="w-4 h-4 flex-shrink-0" style={{ color: T2 }} />
                  }
                  <span className="text-xs" style={{ color: done ? T2 : T1, textDecoration: done ? 'line-through' : undefined }}>{step}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Health Timeline */}
      <div className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
        <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: BDR }}>
          <TrendingUp className="w-4 h-4" style={{ color: TEAL }} />
          <p className="text-sm font-bold" style={{ color: T1 }}>Customer Health Snapshot</p>
        </div>
        {scores.length === 0 ? (
          <div className="py-12 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
            <p className="text-sm" style={{ color: T2 }}>No health scores recorded</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: BDR }}>
            {scores.slice(0, 8).map(s => {
              const color = TIER_CLR[s.tier] ?? GRN
              return (
                <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold" style={{ color: T1 }}>{s.customerId.slice(0, 18)}…</p>
                    <p className="text-[11px] mt-0.5" style={{ color: T2 }}>
                      Renewal in {s.renewalProximityDays}d · OIS Δ {s.oisDelta > 0 ? '+' : ''}{s.oisDelta.toFixed(1)}
                      {s.npsScore !== null && ` · NPS ${s.npsScore}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: SURF }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, s.totalScore)}%`, background: color }} />
                    </div>
                    <span className="text-sm font-black w-8 text-right" style={{ color }}>{Math.round(s.totalScore)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{s.tier}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
