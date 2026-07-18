import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, TrendingDown, RefreshCw, Zap, Users, Activity, ShieldAlert } from 'lucide-react'
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
const PURP = '#7c3aed'

interface HealthScore {
  id: string; customerId: string
  oisDelta: number; coigVelocity: number; loginFrequency: number
  featureDepth: number; signalVolume: number; agentUsage: number
  workflowRuns: number; blueprintVersionLag: number; npsScore: number | null
  supportTickets: number; renewalProximityDays: number; daysSinceLastDecision: number
  totalScore: number; tier: string; computedAt: string
}

interface ChurnRisk {
  customerId: string; latestScore: HealthScore
  churnProbability: number; playbook: string[]
}

interface HealthScoreList {
  scores: HealthScore[]; atRisk: number; amber: number
}

const TIER_CFG: Record<string, { label: string; color: string; bg: string }> = {
  GREEN: { label: 'Green',  color: GRN, bg: 'rgba(16,185,129,0.1)'  },
  AMBER: { label: 'Amber',  color: AMB, bg: 'rgba(245,158,11,0.1)'  },
  RED:   { label: 'Red',    color: RED, bg: 'rgba(239,68,68,0.1)'   },
}

const PLAYBOOK_ICON: Record<string, React.FC<any>> = {
  EXECUTIVE_OUTREACH: Users,
  FEATURE_ACTIVATION: Zap,
  SUCCESS_REVIEW:     Activity,
  IMMEDIATE_ESCALATION: ShieldAlert,
}

export function ChurnRiskPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<ChurnRisk | null>(null)
  const [computingFor, setComputingFor] = useState<string | null>(null)

  const scores = useQuery<HealthScoreList>({
    queryKey: ['health-scores'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/health-scores').then(r => r.data),
    staleTime: 30_000,
  })

  const churnRisk = useQuery<ChurnRisk[]>({
    queryKey: ['churn-risk'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/churn-risk').then(r => r.data),
    staleTime: 30_000,
  })

  const compute = useMutation({
    mutationFn: (customerId: string) => api.post(`/admin/kangqore-immp/customers/${customerId}/health-score`, {
      oisDelta: 0, coigVelocity: 0, loginFrequency: 5,
      featureDepth: 3, signalVolume: 10, agentUsage: 60,
      workflowRuns: 5, blueprintVersionLag: 0, npsScore: null,
      supportTickets: 0, renewalProximityDays: 180, daysSinceLastDecision: 7,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['health-scores'] })
      qc.invalidateQueries({ queryKey: ['churn-risk'] })
      setComputingFor(null)
    },
  })

  const risks = churnRisk.data ?? []
  const atRisk = scores.data?.atRisk ?? 0

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)` }}>
            <TrendingDown className="w-6 h-6" style={{ color: RED }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-bold" style={{ color: T1 }}>Churn Risk</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(239,68,68,0.1)', color: RED }}>S69</span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              12-signal weighted health model. GREEN ≥70, AMBER ≥40, RED &lt;40. Auto-fires KIMMP alert when tier degrades.
            </p>
          </div>
          <button onClick={() => { scores.refetch(); churnRisk.refetch() }} className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border" style={{ color: T2, borderColor: BDR }}>
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'At Risk (RED)',  value: atRisk,                   color: RED  },
          { label: 'Watch (AMBER)', value: scores.data?.amber ?? 0,  color: AMB  },
          { label: 'Tracked',       value: scores.data?.scores.length ?? 0, color: BLUE },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
            <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Compute new score */}
      <div className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold flex-1" style={{ color: T2 }}>Compute health score for customer ID:</p>
          <input value={computingFor ?? ''} onChange={e => setComputingFor(e.target.value)}
            placeholder="customer-id or cuid…" className="px-3 py-2 text-xs rounded-lg border w-64 focus:outline-none"
            style={{ borderColor: BDR, background: SURF, color: T1 }} />
          <button disabled={!computingFor?.trim() || compute.isPending}
            onClick={() => computingFor?.trim() && compute.mutate(computingFor.trim())}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
            style={{ background: PURP, color: '#fff' }}>
            <Activity className="w-3.5 h-3.5" />
            {compute.isPending ? 'Computing…' : 'Compute'}
          </button>
        </div>
      </div>

      {/* Churn risk list */}
      {churnRisk.isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>
      ) : risks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border" style={{ borderColor: BDR }}>
          <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
          <p className="text-sm font-medium" style={{ color: T2 }}>No health scores yet</p>
          <p className="text-xs mt-1" style={{ color: T2 }}>Compute a health score for a customer to see their churn risk</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
          <div className="px-5 py-3 border-b text-[10px] font-semibold uppercase tracking-wider grid grid-cols-[1fr_auto_auto_auto_auto] gap-4" style={{ borderColor: BDR, color: T2 }}>
            <span>Customer</span><span>Health</span><span>Score</span><span>Churn Risk</span><span>Playbook</span>
          </div>
          {risks.map(risk => {
            const sc   = risk.latestScore
            const tier = TIER_CFG[sc.tier] ?? TIER_CFG.GREEN
            const pct  = Math.round(risk.churnProbability * 100)
            return (
              <div key={risk.customerId}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b hover:bg-[var(--os-surface-0)] transition-colors cursor-pointer"
                style={{ borderColor: BDR }}
                onClick={() => setSelected(selected?.customerId === risk.customerId ? null : risk)}>
                <div>
                  <p className="text-sm font-bold" style={{ color: T1 }}>{risk.customerId.slice(0, 16)}…</p>
                  <p className="text-[11px] mt-0.5" style={{ color: T2 }}>
                    Computed {new Date(sc.computedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: tier.bg, color: tier.color }}>{tier.label}</span>
                <span className="text-sm font-black" style={{ color: tier.color }}>{Math.round(sc.totalScore)}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: SURF }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 60 ? RED : pct > 30 ? AMB : GRN }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: pct > 60 ? RED : pct > 30 ? AMB : GRN }}>{pct}%</span>
                </div>
                <span className="text-[10px] font-medium" style={{ color: T2 }}>{risk.playbook[0]?.replace(/_/g, ' ')}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Expanded playbook */}
      {selected && (
        <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-sm font-bold" style={{ color: T1 }}>Recovery Playbook — {selected.customerId.slice(0, 16)}…</p>
          <div className="space-y-2">
            {selected.playbook.map((step, i) => {
              const Icon = PLAYBOOK_ICON[step] ?? Activity
              return (
                <div key={step} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: SURF }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.1)', color: RED }}>{i + 1}</div>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />
                  <span className="text-xs font-semibold" style={{ color: T1 }}>{step.replace(/_/g, ' ')}</span>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-2">
            {[
              { label: 'OIS Delta',     value: selected.latestScore.oisDelta.toFixed(1)           },
              { label: 'COIG Velocity', value: selected.latestScore.coigVelocity.toFixed(1)        },
              { label: 'Renewal (days)', value: selected.latestScore.renewalProximityDays           },
              { label: 'Last Decision', value: `${selected.latestScore.daysSinceLastDecision}d ago`},
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.05)', border: `1px solid rgba(239,68,68,0.15)` }}>
                <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{s.label}</p>
                <p className="text-sm font-bold" style={{ color: T1 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
