import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
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

const fmt = (n: number) =>
  n >= 1000000 ? `₹${(n / 1000000).toFixed(2)}M` : `₹${(n / 1000).toFixed(0)}k`

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {[0,1,2,3,4,5].map(i => (
        <div key={i} className="h-24 rounded-xl bg-[var(--os-surface-0)] animate-pulse" />
      ))}
    </div>
  )
}

export function FinanceOverview() {
  const { cashFlow, projectFinancials } = useFinanceStore()

  const { data: kpis, isLoading: kpisLoading } = useQuery<FinancialKPIs>({
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

  const netFlowData = cashFlow.map(m => ({
    month: m.month,
    Inflow:  m.inflow,
    Outflow: -m.outflow,
    Net:     m.net,
  }))

  // 6-stat KPI strip
  const kpiStrip = [
    { label: 'MRR',        value: fmt(kpis?.revenueMTD ?? 0),    delta: delta,    accent: '#579bfc' },
    { label: 'ARR',        value: fmt(kpis?.arr ?? 0),            delta: null,     accent: '#00c875' },
    { label: 'Revenue MTD',value: fmt(kpis?.revenueMTD ?? 0),     delta: null,     accent: '#00c875' },
    { label: 'Pipeline',   value: fmt(kpis?.pipelineValue ?? 0),  delta: null,     accent: '#fdab3d' },
    { label: 'Cash Balance',value: fmt(balance),                  delta: null,     accent: '#579bfc' },
    { label: 'Burn Rate',  value: fmt(monthlyBurn),               delta: null,     accent: '#e2445c' },
  ]

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Finance" />

      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>
          Financial Overview
        </h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          Cash position · {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* 6-stat KPI strip */}
      {kpisLoading ? <KpiSkeleton /> : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpiStrip.map(k => (
            <div key={k.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: k.label === 'Burn Rate' ? 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)' : k.label === 'Pipeline' ? 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)' : k.label === 'ARR' || k.label === 'Revenue MTD' ? 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)' : 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', boxShadow: `0 4px 20px ${k.label === 'Burn Rate' ? '#e2445c' : k.label === 'Pipeline' ? '#fdab3d' : k.label === 'ARR' || k.label === 'Revenue MTD' ? '#00c875' : '#2564ea'}40` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
              <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {k.label}
              </p>
              <p className="relative text-2xl font-black tracking-tight" style={{ color: '#ffffff' }}>
                {k.value}
              </p>
              {k.delta !== null && (
                <span
                  className="relative inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                >
                  {k.delta >= 0 ? '+' : ''}{k.delta.toFixed(1)}% vs last mo
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Runway + Budget row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Runway */}
        <div className="os-card p-5">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--os-text-2)' }}>
            Cash Runway
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span
              className="text-3xl font-black tracking-tight"
              style={{ color: runway >= 12 ? '#00c875' : runway >= 6 ? '#fdab3d' : '#e2445c' }}
            >
              {runway}
            </span>
            <span className="text-sm font-semibold mb-1" style={{ color: 'var(--os-text-2)' }}>months</span>
            <span
              className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{
                background: runway >= 12 ? '#00c87520' : runway >= 6 ? '#fdab3d20' : '#e2445c20',
                color: runway >= 12 ? '#00c875' : runway >= 6 ? '#fdab3d' : '#e2445c',
              }}
            >
              {runway >= 12 ? 'Healthy' : runway >= 6 ? 'Watch' : 'Critical'}
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--os-text-2)' }}>
            <span>Monthly burn <strong style={{ color: 'var(--os-text-1)' }}>{fmt(monthlyBurn)}</strong></span>
            <span>Balance <strong style={{ color: 'var(--os-text-1)' }}>{fmt(balance)}</strong></span>
          </div>
        </div>

        {/* Budget consumed */}
        <div className="os-card p-5">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--os-text-2)' }}>
            Budget Consumption
          </p>
          {kpisLoading ? (
            <div className="h-6 rounded-full bg-[var(--os-surface-0)] animate-pulse" />
          ) : budget > 0 ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>
                  {Math.round((spent / budget) * 100)}%
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: spent / budget > 0.85 ? '#e2445c20' : '#00c87520',
                    color: spent / budget > 0.85 ? '#e2445c' : '#00c875',
                  }}
                >
                  {fmt(spent)} / {fmt(budget)}
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((spent / budget) * 100))}%`,
                    background: spent / budget > 0.85 ? '#e2445c' : spent / budget > 0.7 ? '#fdab3d' : '#00c875',
                  }}
                />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--os-text-2)' }}>
                <span>Allocated <strong style={{ color: 'var(--os-text-1)' }}>{fmt(budget)}</strong></span>
                <span>Spent <strong style={{ color: 'var(--os-text-1)' }}>{fmt(spent)}</strong></span>
                <span>Remaining <strong style={{ color: '#00c875' }}>{fmt(Math.max(0, budget - spent))}</strong></span>
              </div>
            </>
          ) : (
            <div className="py-6 text-sm text-center" style={{ color: 'var(--os-text-2)' }}>No budget data available.</div>
          )}
        </div>
      </div>

      {/* Cash flow chart */}
      {cashFlow.length > 0 ? (
        <div className="os-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Cash Flow — Jan to Aug 2026</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--os-text-2)' }}>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: '#00c875' }} />Inflow</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: '#e2445c' }} />Outflow</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={netFlowData} barGap={4} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${Math.abs(v) / 1000}k`} />
              <ReferenceLine y={0} stroke="var(--os-border)" />
              <Tooltip
                formatter={(v) => [`₹${Math.abs(Number(v)).toLocaleString()}`, '']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
              />
              <Bar dataKey="Inflow"  fill="#00c875" radius={[4,4,0,0]} />
              <Bar dataKey="Outflow" fill="#e2445c" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="os-card p-5">
          <p className="text-sm font-bold mb-4" style={{ color: 'var(--os-text-1)' }}>Cash Flow</p>
          <div className="py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No cash flow data available.</div>
        </div>
      )}

      {/* Running balance area */}
      {cashFlow.length > 0 && (
        <div className="os-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Running Balance</p>
            <span className="text-3xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>{fmt(balance)}</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={cashFlow}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#579bfc" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#579bfc" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Balance']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
              />
              <Area type="monotone" dataKey="runningBalance" stroke="#579bfc" fill="url(#balGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Project P&L */}
      <div className="os-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Project P&L</p>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}>
            {projectFinancials.length} projects
          </span>
        </div>
        {projectFinancials.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No project financials available.</div>
        ) : (
          <div className="space-y-0">
            {projectFinancials.map(p => {
              const spentPct     = Math.round((p.spent / p.budget) * 100)
              const collectedPct = Math.round((p.collected / p.budget) * 100)
              return (
                <div
                  key={p.projectId}
                  className="flex items-center gap-4 px-4 py-3 border-b border-[var(--os-border)] last:border-0 hover:bg-[var(--os-surface-0)] transition-colors"
                >
                  <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: p.projectColor }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{p.projectName}</p>
                      {p.margin > 0 && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full ml-2 flex-shrink-0" style={{ background: '#00c87520', color: '#00c875' }}>
                          {p.margin}% margin
                        </span>
                      )}
                      {p.margin === 0 && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full ml-2 flex-shrink-0" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}>
                          internal
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--os-text-2)' }}>
                      <span>Budget <strong style={{ color: 'var(--os-text-1)' }}>{fmt(p.budget)}</strong></span>
                      <span>Spent <strong style={{ color: 'var(--os-text-1)' }}>{fmt(p.spent)}</strong></span>
                      <span>Invoiced <strong style={{ color: 'var(--os-text-1)' }}>{fmt(p.invoiced)}</strong></span>
                      <span>Collected <strong style={{ color: '#00c875' }}>{fmt(p.collected)}</strong></span>
                    </div>
                  </div>
                  <div className="w-32 flex-shrink-0">
                    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                      <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${collectedPct}%`, background: '#00c875' }} />
                      <div className="absolute left-0 top-0 h-full rounded-full opacity-40" style={{ width: `${spentPct}%`, background: '#579bfc' }} />
                    </div>
                    <p className="text-[10px] mt-1 text-right" style={{ color: 'var(--os-text-2)' }}>{spentPct}% spent</p>
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
