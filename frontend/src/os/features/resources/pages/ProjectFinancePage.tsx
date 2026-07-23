import { useQuery } from '@tanstack/react-query'
import { api, isDemo } from '@lib/api'
import { DollarSign, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import { Gen3WorkspacePanel } from '../../kangqore-immp/components/Gen3WorkspacePanel'

interface FinanceRow {
  projectId:        string
  projectName:      string
  projectTitle:     string
  projectColor:     string
  projectStatus:    string | null
  memberCount:      number
  totalHoursPerWeek: number
  estimatedWeeks:   number
  estimatedCost:    number
  budget:           number | null
  spend:            number | null
}

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const SURF = 'var(--os-surface-0)'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLU  = '#3b82f6'

const fmt = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000   ? `£${(n / 1_000).toFixed(0)}k`
  : `£${n.toFixed(0)}`

function HealthBar({ pct }: { pct: number }) {
  const color = pct > 100 ? RED : pct > 80 ? AMB : GRN
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: SURF, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 3, transition: 'width .4s' }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 32, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
    </div>
  )
}

const DEMO_ROWS: FinanceRow[] = [
  { projectId: 'p1', projectName: 'Alpha Platform',   projectTitle: 'Alpha Platform',   projectColor: '#7c3aed', projectStatus: 'ACTIVE',   memberCount: 3, totalHoursPerWeek: 18, estimatedWeeks: 12, estimatedCost: 43_200, budget: 50_000, spend: 28_000 },
  { projectId: 'p2', projectName: 'Beta Launch',      projectTitle: 'Beta Launch',      projectColor: '#10b981', projectStatus: 'ACTIVE',   memberCount: 2, totalHoursPerWeek: 12, estimatedWeeks: 8,  estimatedCost: 19_200, budget: 22_000, spend: 9_800  },
  { projectId: 'p3', projectName: 'Gamma Integration',projectTitle: 'Gamma Integration',projectColor: '#f59e0b', projectStatus: 'ACTIVE',   memberCount: 4, totalHoursPerWeek: 24, estimatedWeeks: 16, estimatedCost: 76_800, budget: 70_000, spend: 41_000 },
  { projectId: 'p4', projectName: 'Delta Research',   projectTitle: 'Delta Research',   projectColor: '#3b82f6', projectStatus: 'ACTIVE',   memberCount: 1, totalHoursPerWeek: 6,  estimatedWeeks: 20, estimatedCost: 24_000, budget: null,   spend: null   },
]

export function ProjectFinancePage() {
  const { data, isLoading } = useQuery<{ rows: FinanceRow[] }>({
    queryKey: ['resources-finance'],
    queryFn:  () => api.get('/resources/project-finance').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 60_000,
  })

  const rows = isDemo() ? DEMO_ROWS : (data?.rows ?? [])

  const totalBudget = rows.reduce((s, r) => s + (r.budget ?? 0), 0)
  const totalSpend  = rows.reduce((s, r) => s + (r.spend  ?? 0), 0)
  const totalHrs    = rows.reduce((s, r) => s + r.totalHoursPerWeek, 0)
  const totalCost   = rows.reduce((s, r) => s + r.estimatedCost, 0)
  const overBudget  = rows.filter(r => r.budget != null && r.estimatedCost > r.budget).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>Project Finance</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
          Allocation cost vs budget — {rows.length} projects
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget',         value: totalBudget ? fmt(totalBudget) : '—', icon: DollarSign, color: BLU   },
          { label: 'Total Spend',          value: totalSpend  ? fmt(totalSpend)  : '—', icon: TrendingUp,  color: GRN   },
          { label: 'Estimated Alloc. Cost',value: fmt(totalCost),                        icon: Clock,       color: AMB   },
          { label: 'Over-budget Projects', value: String(overBudget),                    icon: AlertTriangle, color: overBudget > 0 ? RED : GRN },
        ].map(c => (
          <div key={c.label} className="os-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="w-3.5 h-3.5" style={{ color: c.color }} />
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: T2 }}>{c.label}</p>
            </div>
            <p className="text-2xl font-black tracking-tight" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {isLoading && !isDemo() && (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: SURF }} />)}
        </div>
      )}

      {!isLoading && rows.length === 0 && (
        <div className="os-card py-16 text-center text-sm" style={{ color: T2 }}>
          No project allocations found. Assign team members to projects to see finance data here.
        </div>
      )}

      {rows.length > 0 && (
        <div className="os-card" style={{ padding: 0 }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: BDR }}>
            <p className="text-sm font-bold" style={{ color: T1 }}>Allocation × Budget</p>
            <p className="text-xs mt-0.5" style={{ color: T2 }}>Estimated cost = hours/wk × weeks × avg billable rate · Budget from Projects table where linked</p>
          </div>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BDR}`, background: SURF }}>
                  {['Project', 'Team', 'h/wk', 'Weeks', 'Est. Cost', 'Budget', 'Spend', 'Budget Health'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: T2 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const budgetPct = r.budget ? (r.estimatedCost / r.budget) * 100 : null
                  const overBdg  = budgetPct != null && budgetPct > 100
                  return (
                    <tr key={r.projectId} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${BDR}` : 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = SURF}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                      {/* Project */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.projectColor, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontWeight: 700, color: T1, marginBottom: 1 }}>{r.projectTitle}</p>
                            {r.projectStatus && (
                              <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                                background: r.projectStatus === 'ACTIVE' ? `${GRN}18` : `${T2}18`,
                                color: r.projectStatus === 'ACTIVE' ? GRN : T2 }}>
                                {r.projectStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Team */}
                      <td style={{ padding: '12px 16px', color: T2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Users style={{ width: 12, height: 12 }} />
                          <span>{r.memberCount}</span>
                        </div>
                      </td>
                      {/* h/wk */}
                      <td style={{ padding: '12px 16px', color: T1, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.totalHoursPerWeek}h</td>
                      {/* Weeks */}
                      <td style={{ padding: '12px 16px', color: T2, fontVariantNumeric: 'tabular-nums' }}>{r.estimatedWeeks}w</td>
                      {/* Est. Cost */}
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: overBdg ? RED : T1, fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(r.estimatedCost)}
                        {overBdg && <AlertTriangle style={{ width: 11, height: 11, display: 'inline', marginLeft: 4, color: RED }} />}
                      </td>
                      {/* Budget */}
                      <td style={{ padding: '12px 16px', color: T2, fontVariantNumeric: 'tabular-nums' }}>
                        {r.budget != null ? fmt(r.budget) : <span style={{ color: T2, fontSize: 10 }}>No budget</span>}
                      </td>
                      {/* Spend */}
                      <td style={{ padding: '12px 16px', color: T2, fontVariantNumeric: 'tabular-nums' }}>
                        {r.spend != null ? fmt(r.spend) : '—'}
                      </td>
                      {/* Budget Health */}
                      <td style={{ padding: '12px 24px 12px 16px', minWidth: 160 }}>
                        {budgetPct != null
                          ? <HealthBar pct={budgetPct} />
                          : <span style={{ fontSize: 10, color: T2 }}>—</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: `2px solid ${BDR}`, background: SURF }}>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: T1 }}>Totals</td>
                  <td style={{ padding: '12px 16px', color: T2 }}>{rows.reduce((s, r) => s + r.memberCount, 0)} slots</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: T1 }}>{totalHrs}h</td>
                  <td style={{ padding: '12px 16px', color: T2 }}>—</td>
                  <td style={{ padding: '12px 16px', fontWeight: 800, color: T1 }}>{fmt(totalCost)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: T2 }}>{totalBudget ? fmt(totalBudget) : '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: T2 }}>{totalSpend ? fmt(totalSpend) : '—'}</td>
                  <td style={{ padding: '12px 24px 12px 16px' }}>
                    {totalBudget > 0 && <HealthBar pct={(totalCost / totalBudget) * 100} />}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          { color: GRN, label: 'Under budget (<80%)' },
          { color: AMB, label: 'Watch zone (80–100%)' },
          { color: RED, label: 'Over budget (>100%)' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            <span style={{ fontSize: 11, color: T2 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* S119 — Gen3 Finance Intelligence (Phase 5.5) */}
      <Gen3WorkspacePanel
        dispatchEndpoint="/admin/kangqore-immp/gen3/dispatch-finance-task"
        workspaceName="Finance (Phase 5.5)"
      />
    </div>
  )
}
