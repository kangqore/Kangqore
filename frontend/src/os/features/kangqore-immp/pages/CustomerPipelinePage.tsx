import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Building2, Target, TrendingUp, Package, Copy, ChevronRight, Zap, Users } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const TEAL = '#10b981'
const PURP = '#7c3aed'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'
const RED  = '#f43f5e'

interface PipelineCustomer {
  id: string
  label: string
  name: string
  industry: string
  pack: string
  status: 'active' | 'pre-deployment' | 'prospect' | 'locked'
  oisBaseline: number | null
  oisCurrent: number | null
  oisTarget: number
  coigTarget: number
  coigActual: number | null
  blueprintVersion: string | null
  readinessScore: number
  departmentsActive: number
  departmentsTotal: number
  activationDate: string | null
  navLink: string
}

const PIPELINE: PipelineCustomer[] = [
  {
    id: 'c0', label: 'C0', name: 'Customer Zero', industry: 'Professional Services',
    pack: 'PS Pack v1.0', status: 'active', oisBaseline: 78.9, oisCurrent: 88.6, oisTarget: 90.0,
    coigTarget: 13.0, coigActual: 9.7, blueprintVersion: '1.0', readinessScore: 100,
    departmentsActive: 6, departmentsTotal: 6, activationDate: '2026-07-17',
    navLink: '/kangqore-view/admin/kangqore-immp/customers/zero',
  },
  {
    id: 'c1', label: 'C1', name: 'Customer One', industry: 'Enterprise · Technology',
    pack: 'PS Pack v1.0', status: 'active', oisBaseline: 75.0, oisCurrent: 82.4, oisTarget: 88.0,
    coigTarget: 13.0, coigActual: 7.4, blueprintVersion: '1.0', readinessScore: 95,
    departmentsActive: 5, departmentsTotal: 6, activationDate: '2026-07-01',
    navLink: '/kangqore-view/admin/kangqore-immp/customers/one',
  },
  {
    id: 'c2', label: 'C2', name: 'Customer Two', industry: 'Enterprise · Professional Services',
    pack: 'PS Pack v1.1', status: 'active', oisBaseline: 58.4, oisCurrent: 58.4, oisTarget: 72.0,
    coigTarget: 13.0, coigActual: 0, blueprintVersion: '1.1', readinessScore: 100,
    departmentsActive: 1, departmentsTotal: 6, activationDate: '2026-07-23',
    navLink: '/kangqore-view/admin/kangqore-immp/customers/two',
  },
  {
    id: 'c3', label: 'C3', name: 'Customer Three', industry: 'Enterprise · Technology',
    pack: 'PS Pack v1.2', status: 'pre-deployment', oisBaseline: null, oisCurrent: null, oisTarget: 78.0,
    coigTarget: 15.0, coigActual: null, blueprintVersion: '1.2', readinessScore: 30,
    departmentsActive: 0, departmentsTotal: 6, activationDate: null,
    navLink: '/kangqore-view/admin/kangqore-immp/customers/three',
  },
  {
    id: 'c4', label: 'C4', name: 'Customer Four', industry: 'TBD',
    pack: 'TBD', status: 'prospect', oisBaseline: null, oisCurrent: null, oisTarget: 82.0,
    coigTarget: 16.0, coigActual: null, blueprintVersion: null, readinessScore: 10,
    departmentsActive: 0, departmentsTotal: 6, activationDate: null,
    navLink: '#',
  },
  {
    id: 'c5', label: 'C5', name: 'Customer Five', industry: 'TBD',
    pack: 'TBD', status: 'locked', oisBaseline: null, oisCurrent: null, oisTarget: 85.0,
    coigTarget: 18.0, coigActual: null, blueprintVersion: null, readinessScore: 0,
    departmentsActive: 0, departmentsTotal: 6, activationDate: null,
    navLink: '#',
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:          { label: 'Live',           color: TEAL,  bg: 'rgba(16,185,129,0.1)'  },
  'pre-deployment': { label: 'Pre-deploy',     color: AMB,   bg: 'rgba(245,158,11,0.1)'  },
  prospect:        { label: 'Prospect',        color: BLUE,  bg: 'rgba(59,130,246,0.1)'  },
  locked:          { label: 'Future',          color: T2,    bg: 'rgba(100,116,139,0.1)' },
}

export function CustomerPipelinePage() {
  const cloneMut = useMutation({
    mutationFn: (c: PipelineCustomer) => api.post('/admin/kangqore-immp/customers/blueprint-clone', {
      sourceBlueprintVersion: c.blueprintVersion ?? '1.0',
      targetCustomerName:     c.name,
      packId:                 'ps-pack-v1',
    }),
  })

  const activeCustomers  = PIPELINE.filter(c => c.status === 'active')
  const totalCoigDelta   = activeCustomers.reduce((sum, c) => sum + (c.coigActual ?? 0), 0)
  const avgOisCurrent    = activeCustomers.length
    ? activeCustomers.reduce((sum, c) => sum + (c.oisCurrent ?? c.oisBaseline ?? 0), 0) / activeCustomers.length
    : 0

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Users className="w-6 h-6" style={{ color: PURP }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-black" style={{ color: T1 }}>Customer Pipeline — C0 → C5</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(124,58,237,0.1)', color: PURP }}>COMMERCIAL</span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              Enterprise deployment tracker. {activeCustomers.length} live · Total COIG delta +{totalCoigDelta.toFixed(1)} · Avg OIS {avgOisCurrent.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Aggregate stats */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { label: 'Live customers',   value: `${activeCustomers.length}`,           color: TEAL },
            { label: 'Total COIG delta', value: `+${totalCoigDelta.toFixed(1)}`,        color: PURP },
            { label: 'Avg OIS (active)', value: avgOisCurrent.toFixed(1),               color: BLUE },
            { label: 'Pipeline target',  value: `C${PIPELINE.filter(c => c.status !== 'locked').length}`, color: AMB },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 border text-center" style={{ borderColor: BDR, background: 'var(--os-surface-0)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline grid */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: T2 }}>Customer Status Grid</p>
        {PIPELINE.map(c => {
          const cfg = STATUS_CONFIG[c.status]
          const isLocked = c.status === 'locked'

          return (
            <div
              key={c.id}
              className="rounded-xl border p-5"
              style={{
                background: CARD,
                borderColor: BDR,
                opacity: isLocked ? 0.5 : 1,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Label badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  {c.label}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-bold" style={{ color: T1 }}>{c.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    {c.pack !== 'TBD' && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ background: 'var(--os-surface-0)', color: T2 }}>{c.pack}</span>
                    )}
                  </div>
                  <p className="text-[11px] mb-3" style={{ color: T2 }}>{c.industry}{c.activationDate ? ` · Activated ${c.activationDate}` : ''}</p>

                  {/* Metrics row */}
                  <div className="flex items-center gap-5 flex-wrap text-xs">
                    {/* OIS progress */}
                    {c.oisBaseline !== null && (
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" style={{ color: TEAL }} />
                        <span style={{ color: T2 }}>OIS</span>
                        <span className="font-bold" style={{ color: T1 }}>{c.oisCurrent ?? c.oisBaseline}</span>
                        {c.oisCurrent !== null && c.oisCurrent !== c.oisBaseline && (
                          <span style={{ color: TEAL }}>+{(c.oisCurrent - c.oisBaseline).toFixed(1)}</span>
                        )}
                        <span style={{ color: T2 }}>/ {c.oisTarget} target</span>
                      </div>
                    )}
                    {/* COIG */}
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3" style={{ color: PURP }} />
                      <span style={{ color: T2 }}>COIG</span>
                      {c.coigActual !== null
                        ? <span className="font-bold" style={{ color: PURP }}>+{c.coigActual}</span>
                        : <span style={{ color: T2 }}>—</span>}
                      <span style={{ color: T2 }}>/ +{c.coigTarget} target</span>
                    </div>
                    {/* Depts */}
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" style={{ color: BLUE }} />
                      <span style={{ color: T2 }}>{c.departmentsActive}/{c.departmentsTotal} depts</span>
                    </div>
                    {/* Readiness */}
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3 h-3" style={{ color: AMB }} />
                      <span style={{ color: T2 }}>Readiness</span>
                      <span className="font-bold" style={{ color: c.readinessScore >= 80 ? TEAL : c.readinessScore >= 40 ? AMB : RED }}>
                        {c.readinessScore}%
                      </span>
                    </div>
                  </div>

                  {/* Readiness bar */}
                  <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${c.readinessScore}%`,
                        background: c.readinessScore >= 80 ? TEAL : c.readinessScore >= 40 ? AMB : RED,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                {!isLocked && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {c.navLink !== '#' ? (
                      <Link to={c.navLink}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => cloneMut.mutate(c)}
                        disabled={cloneMut.isPending || c.status === 'locked'}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                        style={{ background: 'rgba(59,130,246,0.1)', color: BLUE }}
                      >
                        <Copy className="w-3 h-3" /> Clone Blueprint
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* COIG trajectory */}
      <div className="rounded-xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: T2 }}>COIG Trajectory — Active Customers</p>
        <div className="space-y-3">
          {PIPELINE.filter(c => c.coigActual !== null || c.coigTarget).slice(0, 4).map(c => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-[11px] font-bold w-6" style={{ color: T2 }}>{c.label}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: c.coigActual !== null
                      ? `${Math.min(100, (c.coigActual / c.coigTarget) * 100)}%`
                      : `${c.readinessScore}%`,
                    background: c.coigActual !== null ? TEAL : PURP,
                  }}
                />
              </div>
              <span className="text-[11px] font-bold w-16 text-right" style={{ color: T2 }}>
                {c.coigActual !== null ? `+${c.coigActual}` : `—`} / +{c.coigTarget}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        <Link to="/kangqore-view/admin/kangqore-immp/customers/three"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--os-surface-0)', color: T2 }}>
          ← Customer Three
        </Link>
      </div>
    </div>
  )
}
