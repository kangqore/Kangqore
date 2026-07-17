import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Banknote, BarChart2, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { useFinanceStore } from '../store'

interface FinancialKPIs {
  revenueMTD: number
  revenueLastMonth: number
  arr: number
  activeContracts: number
  activeProjects: number
  totalBudget: number
  totalSpend: number
  pendingInvoices: number
  overdueInvoices: number
  draftInvoices: number
  onTimeProjectPct: number
  pipelineValue: number
  mrrDeltaPct: number
}

function fmt(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(0)}K`
  return `₹${n}`
}

function Stat({
  label, value, sub, icon: Icon, col, delta,
}: {
  label: string; value: string; sub?: string
  icon: React.ElementType; col: string; delta?: number | null
}) {
  return (
    <div style={{
      background: 'var(--os-card)',
      border: `1px solid var(--os-border)`,
      borderLeft: `3px solid ${col}`,
      borderRadius: 12,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
        <Icon style={{ width: 13, height: 13, color: col }} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        {sub && <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{sub}</span>}
        {delta != null && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 2,
            fontSize: 10, fontWeight: 700,
            color: delta >= 0 ? '#10b981' : '#ef4444',
          }}>
            {delta >= 0 ? <ArrowUpRight style={{ width: 10, height: 10 }} /> : <ArrowDownRight style={{ width: 10, height: 10 }} />}
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}

export function FinanceOverview() {
  const { cashFlow, projectFinancials } = useFinanceStore()

  const { data: kpis, isLoading } = useQuery<FinancialKPIs>({
    queryKey: ['financial-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data),
    staleTime: 120_000,
  })

  const balance     = cashFlow[cashFlow.length - 1]?.runningBalance ?? 0
  const monthlyBurn = cashFlow.length
    ? Math.round(cashFlow.slice(-3).reduce((s, m) => s + m.outflow, 0) / Math.min(3, cashFlow.length))
    : 0
  const runway = monthlyBurn > 0 ? Math.round(balance / monthlyBurn) : 0
  const budget = kpis?.totalBudget ?? 0
  const spent  = kpis?.totalSpend ?? 0
  const delta  = kpis?.mrrDeltaPct ?? 0

  const runwayColor = runway >= 12 ? '#10b981' : runway >= 6 ? '#f59e0b' : '#ef4444'
  const runwayLabel = runway >= 12 ? 'Healthy' : runway >= 6 ? 'Watch' : 'Critical'
  const budgetPct   = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const budgetColor = budgetPct > 85 ? '#ef4444' : budgetPct > 70 ? '#f59e0b' : '#10b981'

  const netFlowData = cashFlow.map(m => ({
    month: m.month,
    Inflow:  m.inflow,
    Outflow: -m.outflow,
    Net:     m.net,
  }))

  const kpiStats = [
    { label: 'MRR',          value: fmt(kpis?.revenueMTD ?? 0),     sub: 'monthly recurring',       icon: TrendingUp,    col: '#2564ea', delta },
    { label: 'ARR',          value: fmt(kpis?.arr ?? 0),             sub: 'annual run rate',         icon: BarChart2,     col: '#10b981', delta: null },
    { label: 'Pipeline',     value: fmt(kpis?.pipelineValue ?? 0),   sub: 'qualified opportunities', icon: ArrowUpRight,  col: '#f59e0b', delta: null },
    { label: 'Cash Balance', value: fmt(balance),                    sub: `${runway}mo runway`,      icon: Banknote,      col: '#7c3aed', delta: null },
    { label: 'Burn Rate',    value: fmt(monthlyBurn),                sub: '3-month avg',             icon: TrendingDown,  col: '#ef4444', delta: null },
    { label: 'Overdue Inv.', value: String(kpis?.overdueInvoices ?? 0), sub: 'needs action',         icon: AlertCircle,   col: '#ef4444', delta: null },
  ]

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-pulse">
        <div style={{ height: 28, width: 180, borderRadius: 8, background: 'var(--os-surface-0)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 90, borderRadius: 12, background: 'var(--os-surface-0)' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <KIMMPSignalBar module="Finance" />

      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.2 }}>Financial Overview</h2>
        <p style={{ fontSize: 12, color: 'var(--os-text-3)', margin: '4px 0 0' }}>
          {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} · Cash position · {kpis?.activeContracts ?? 0} active contracts
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {kpiStats.map(s => <Stat key={s.label} {...s} />)}
      </div>

      {/* Runway + Budget row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Runway */}
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cash Runway</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
              background: runwayColor + '1a', color: runwayColor,
            }}>{runwayLabel}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 40, fontWeight: 900, color: runwayColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{runway}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--os-text-3)' }}>months</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--os-surface-0)', overflow: 'hidden', marginBottom: 10 }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${Math.min(100, Math.round((runway / 24) * 100))}%`,
              background: `linear-gradient(90deg, ${runwayColor}88, ${runwayColor})`,
            }} />
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Monthly burn</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(monthlyBurn)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Cash balance</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(balance)}</div>
            </div>
          </div>
        </div>

        {/* Budget consumption */}
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Budget Consumption</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
              background: budgetColor + '1a', color: budgetColor,
            }}>{budgetPct}% used</span>
          </div>
          {budget > 0 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmt(spent)}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--os-text-4)' }}>of {fmt(budget)}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--os-surface-0)', overflow: 'hidden', marginBottom: 10 }}>
                <div style={{
                  height: '100%', borderRadius: 3, width: `${budgetPct}%`,
                  background: `linear-gradient(90deg, ${budgetColor}88, ${budgetColor})`,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { label: 'Allocated', val: fmt(budget),               col: '#2564ea' },
                  { label: 'Spent',     val: fmt(spent),                col: budgetColor },
                  { label: 'Remaining', val: fmt(Math.max(0, budget - spent)), col: '#10b981' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{s.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.col, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12, color: 'var(--os-text-4)' }}>No budget data</div>
          )}
        </div>
      </div>

      {/* Cash flow bar chart */}
      {cashFlow.length > 0 && (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>Cash Flow</span>
            <div style={{ display: 'flex', gap: 14 }}>
              {[['#10b981', 'Inflow'], ['#ef4444', 'Outflow']].map(([col, label]) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--os-text-4)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: col }} />{label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={netFlowData} barGap={4} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--os-text-4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--os-text-4)' }} axisLine={false} tickLine={false} tickFormatter={v => fmt(Math.abs(v))} />
              <ReferenceLine y={0} stroke="var(--os-border)" />
              <Tooltip
                formatter={(v) => [fmt(Math.abs(Number(v))), '']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 11, background: 'var(--os-card)' }}
              />
              <Bar dataKey="Inflow"  fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="Outflow" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Running balance */}
      {cashFlow.length > 0 && (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>Running Balance</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(balance)}</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={cashFlow}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2564ea" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2564ea" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--os-text-4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--os-text-4)' }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
              <Tooltip
                formatter={(v) => [fmt(Number(v)), 'Balance']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 11, background: 'var(--os-card)' }}
              />
              <Area type="monotone" dataKey="runningBalance" stroke="#2564ea" fill="url(#balGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Project P&L */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderBottom: '1px solid var(--os-border)',
          background: 'var(--os-surface-3)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>Project P&L</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 10,
            background: 'var(--os-surface-0)', color: 'var(--os-text-4)',
          }}>{projectFinancials.length} projects</span>
        </div>
        {projectFinancials.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', fontSize: 12, color: 'var(--os-text-4)' }}>
            No project financials available.
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '3px 1fr 90px 90px 90px 90px 80px 100px',
              padding: '8px 0',
              borderBottom: '1px solid var(--os-border-subtle)',
            }}>
              <div />
              <div style={{ padding: '0 14px', fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Project</div>
              {['Budget', 'Spent', 'Invoiced', 'Collected', 'Margin', ''].map(h => (
                <div key={h} style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right', paddingRight: 14 }}>{h}</div>
              ))}
            </div>
            {projectFinancials.map(p => {
              const collectedPct = p.budget > 0 ? Math.round((p.collected / p.budget) * 100) : 0
              const spentPct     = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0
              const marginColor  = p.margin > 20 ? '#10b981' : p.margin > 0 ? '#f59e0b' : 'var(--os-text-4)'
              return (
                <div
                  key={p.projectId}
                  style={{
                    display: 'grid', gridTemplateColumns: '3px 1fr 90px 90px 90px 90px 80px 100px',
                    borderBottom: '1px solid var(--os-border-subtle)',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--os-surface-3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{ background: p.projectColor, alignSelf: 'stretch' }} />
                  <div style={{ padding: '12px 14px', minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.projectName}
                    </div>
                    <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${collectedPct}%`, background: '#10b981', borderRadius: 2 }} />
                    </div>
                  </div>
                  {[fmt(p.budget), fmt(p.spent), fmt(p.invoiced), fmt(p.collected)].map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14, fontSize: 11, fontWeight: i === 3 ? 700 : 400, color: i === 3 ? '#10b981' : 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                      {v}
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14 }}>
                    {p.margin > 0 ? (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: marginColor + '18', color: marginColor }}>
                        {p.margin}%
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>internal</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 14 }}>
                    <div style={{ width: 64, height: 4, borderRadius: 2, background: 'var(--os-surface-0)', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${collectedPct}%`, background: '#10b981', borderRadius: 2 }} />
                      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${spentPct}%`, background: '#2564ea', borderRadius: 2, opacity: 0.4 }} />
                    </div>
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
