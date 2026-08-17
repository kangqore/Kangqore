import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useFinanceStore } from '../store'

interface FinancialKPIs {
  revenueMTD: number
  revenueLastMonth: number
  arr: number
  totalBudget: number
  totalSpend: number
  pipelineValue: number
  mrrDeltaPct: number
  activeProjects: number
  pendingInvoices: number
  overdueInvoices: number
  onTimeProjectPct: number
}

const fmt  = (n: number) => `₹${n.toLocaleString()}`
const fmtK = (n: number) => `₹${(n / 1000).toFixed(0)}k`

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[0,1,2,3].map(i => (
        <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />
      ))}
    </div>
  )
}

export function BurnRatePage() {
  const { cashFlow, projectFinancials } = useFinanceStore()

  const { data: kpis, isLoading: kpisLoading } = useQuery<FinancialKPIs>({
    queryKey: ['financial-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data),
    staleTime: 300_000,
  })

  const months = cashFlow.length

  const avgBurnFromStore = months > 0
    ? Math.round(cashFlow.reduce((s, m) => s + m.outflow, 0) / months)
    : 0

  const avgBurn = kpis
    ? (kpis.totalSpend > 0 && kpis.activeProjects > 0
        ? Math.round(kpis.totalSpend / Math.max(kpis.activeProjects, 1))
        : avgBurnFromStore)
    : avgBurnFromStore

  const latestBalance = kpis?.revenueMTD ?? (cashFlow[cashFlow.length - 1]?.runningBalance ?? 0)
  const runway        = avgBurn > 0 ? Math.round(latestBalance / avgBurn) : 0

  const runwayColor = runway >= 12 ? '#00c875' : runway >= 6 ? '#fdab3d' : '#e2445c'

  const burnData = cashFlow.map((m, i) => {
    const window  = cashFlow.slice(Math.max(0, i - 2), i + 1)
    const rolling = Math.round(window.reduce((s, w) => s + w.outflow, 0) / window.length)
    return { month: m.month, Burn: m.outflow, 'Rolling Avg': rolling, Revenue: m.inflow }
  })

  const projected = [
    ...cashFlow.map(m => ({ month: m.month, balance: m.runningBalance, projected: null as number | null })),
    ...Array.from({ length: 6 }, (_, i) => ({
      month: `+${i + 1}m`,
      balance: null as number | null,
      projected: Math.max(0, latestBalance - avgBurn * (i + 1)),
    })),
  ]

  const projectBurn = projectFinancials
    .filter(p => p.spent > 0)
    .map(p => ({ name: p.projectName.split(' ').slice(0, 2).join(' '), burn: p.spent, color: p.projectColor }))
    .sort((a, b) => b.burn - a.burn)

  const kpiCards = [
    { label: 'Avg Monthly Burn', value: fmtK(avgBurn),              accent: '#e2445c' },
    { label: 'Revenue MTD',      value: fmtK(kpis?.revenueMTD ?? 0), accent: '#00c875' },
    { label: 'Cash Runway',      value: `${runway} months`,         accent: runwayColor },
    { label: 'ARR',              value: fmtK(kpis?.arr ?? 0),       accent: '#579bfc'  },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Burn Rate &amp; Runway</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          Monthly outflow analysis and cash runway projection
        </p>
      </div>

      {/* KPI strip */}
      {kpisLoading ? <KpiSkeleton /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiCards.map(c => (
            <div key={c.label} className="os-card p-5">
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>{c.label}</p>
              <p className="text-3xl font-black tracking-tight" style={{ color: c.accent }}>{c.value}</p>
              {c.label === 'Cash Runway' && (
                <span
                  className="inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: runwayColor + '20', color: runwayColor }}
                >
                  {runway >= 12 ? 'Healthy' : runway >= 6 ? 'Watch' : 'Critical'}
                </span>
              )}
              <div className="mt-3 h-1 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
                <div className="h-1 rounded-full w-3/4" style={{ background: c.accent }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prominent burn + runway hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="os-card p-5">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>Monthly Burn Rate</p>
          <p className="text-3xl font-black tracking-tight" style={{ color: '#e2445c' }}>{fmtK(avgBurn)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--os-text-2)' }}>per month · 3-month rolling average</p>
          {/* Mini monthly bars */}
          {burnData.length > 0 && (
            <div className="mt-4 flex items-end gap-1 h-12">
              {burnData.slice(-6).map((d, i) => {
                const maxBurn = Math.max(...burnData.map(x => x.Burn))
                const h = maxBurn > 0 ? Math.round((d.Burn / maxBurn) * 48) : 4
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-t-sm"
                      style={{ height: h, background: '#e2445c', opacity: i === burnData.slice(-6).length - 1 ? 1 : 0.5 }}
                    />
                    <span className="text-[8px]" style={{ color: 'var(--os-text-2)' }}>{d.month}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="os-card p-5">
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>Cash Runway</p>
          <p className="text-3xl font-black tracking-tight" style={{ color: runwayColor }}>{runway} months</p>
          <span
            className="inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: runwayColor + '20', color: runwayColor }}
          >
            {runway >= 12 ? 'Healthy — no action needed' : runway >= 6 ? 'Watch — plan ahead' : 'Critical — raise or cut now'}
          </span>
          <div className="mt-4 h-1.5 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (runway / 18) * 100)}%`, background: runwayColor }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--os-text-2)' }}>
            At {fmtK(avgBurn)}/mo burn · Balance {fmtK(latestBalance)}
          </p>
        </div>
      </div>

      {/* Burn vs revenue chart */}
      {burnData.length > 0 ? (
        <div className="os-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Burn Rate vs Revenue</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--os-text-2)' }}>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: '#e2445c' }} />Outflow</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: '#00c875' }} />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 rounded" style={{ background: '#fdab3d' }} />3-Mo Avg</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={burnData} barGap={6} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
              <Tooltip
                formatter={(v) => [fmt(Number(v)), '']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
              />
              <Bar dataKey="Revenue" fill="#00c875" radius={[3,3,0,0]} />
              <Bar dataKey="Burn"    fill="#e2445c" radius={[3,3,0,0]} />
              <Line type="monotone" dataKey="Rolling Avg" stroke="#fdab3d" strokeWidth={1.5} dot={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="os-card p-5">
          <p className="text-sm font-bold mb-4" style={{ color: 'var(--os-text-1)' }}>Burn Rate vs Revenue</p>
          <div className="py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No cash flow data available.</div>
        </div>
      )}

      {/* Runway projection */}
      <div className="os-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Cash Runway Projection</p>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: runwayColor + '20', color: runwayColor }}
          >
            {kpisLoading ? '— months runway' : `${runway} months runway`}
          </span>
        </div>
        {projected.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={projected}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
                <ReferenceLine y={0} stroke="#e2445c" strokeDasharray="4 2" label={{ value: 'Zero cash', position: 'insideTopRight', fontSize: 10, fill: '#e2445c', fontWeight: 600 }} />
                <Tooltip
                  formatter={(v) => [fmt(Number(v)), '']}
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
                />
                <Line type="monotone" dataKey="balance"   stroke="#579bfc" strokeWidth={2}   dot={{ r: 3, fill: '#579bfc', strokeWidth: 0 }} connectNulls={false} name="Actual"    />
                <Line type="monotone" dataKey="projected" stroke="#579bfc" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="6 3"            name="Projected" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[10px] font-semibold mt-3 text-center uppercase tracking-wider" style={{ color: 'var(--os-text-2)' }}>
              Projected at avg burn of {fmtK(avgBurn)}/month — assumes no new revenue
            </p>
          </>
        ) : (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No projection data available.</div>
        )}
      </div>

      {/* Burn by project */}
      <div className="os-card p-5">
        <p className="text-sm font-bold mb-4" style={{ color: 'var(--os-text-1)' }}>Spend by Project (YTD)</p>
        {projectBurn.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={projectBurn} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--os-border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [fmt(Number(v)), 'Spent']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
              />
              <Bar dataKey="burn" radius={[0,4,4,0]}>
                {projectBurn.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No project spend data available.</div>
        )}
      </div>
    </div>
  )
}
