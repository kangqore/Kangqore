import { TrendingUp } from 'lucide-react'

const ACCENT = '#10B981'

const QUARTERS = [
  { label: 'Q1 2026', revenue: 1080000, cost: 720000,  ebitda: 360000, actual: true  },
  { label: 'Q2 2026', revenue: 1200000, cost: 780000,  ebitda: 420000, actual: true  },
  { label: 'Q3 2026', revenue: 1350000, cost: 830000,  ebitda: 520000, actual: false },
  { label: 'Q4 2026', revenue: 1480000, cost: 880000,  ebitda: 600000, actual: false },
]

function fmt(n: number) {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `£${(n / 1_000).toFixed(0)}K`
  return `£${n}`
}

export function FinanceForecasting() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <TrendingUp size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Forecasting</h1>
          <p className="text-sm text-[var(--os-text-2)]">FY 2026 quarterly projections — actuals vs plan</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Q2 Revenue',    value: '£1.2M',     sub: '+8% vs plan'         },
          { label: 'Q3 Forecast',   value: '£1.35M',    sub: 'projected revenue'    },
          { label: 'Cash Runway',   value: '14 months', sub: 'at current burn rate' },
          { label: 'Burn Rate',     value: '£380K/mo',  sub: 'rolling 3-month avg'  },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Quarterly Cards */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] mb-3">Quarterly Breakdown</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUARTERS.map(q => (
            <div
              key={q.label}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">{q.label}</p>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={
                    q.actual
                      ? { background: '#10B98122', color: '#10B981' }
                      : { background: '#60A5FA22', color: '#60A5FA' }
                  }
                >
                  {q.actual ? 'Actual' : 'Forecast'}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--os-text-2)]">Revenue</span>
                  <span className="text-white font-semibold">{fmt(q.revenue)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--os-text-2)]">Cost</span>
                  <span className="text-[var(--os-text-1)]">{fmt(q.cost)}</span>
                </div>
                <div className="h-px bg-white/10 my-1" />
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--os-text-2)]">EBITDA</span>
                  <span className="font-bold" style={{ color: ACCENT }}>{fmt(q.ebitda)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--os-text-2)]">Margin</span>
                  <span className="font-semibold text-white">
                    {Math.round((q.ebitda / q.revenue) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annual Summary */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] mb-4">FY 2026 Annual Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Total Revenue',  value: fmt(QUARTERS.reduce((a, q) => a + q.revenue, 0)) },
            { label: 'Total Cost',     value: fmt(QUARTERS.reduce((a, q) => a + q.cost,    0)) },
            { label: 'Total EBITDA',   value: fmt(QUARTERS.reduce((a, q) => a + q.ebitda,  0)) },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs text-[var(--os-text-2)] mb-1">{item.label}</p>
              <p className="text-xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KIMMP Signal */}
      <div
        className="p-5 rounded-2xl border"
        style={{ borderColor: `${ACCENT}44`, background: `${ACCENT}0A` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: ACCENT, color: '#000' }}
          >
            K
          </div>
          <p className="text-xs font-semibold" style={{ color: ACCENT }}>KIMMP Intelligence</p>
        </div>
        <p className="text-sm text-[var(--os-text-1)] leading-relaxed">
          Q3 forecast assumes 3 new enterprise deals closing. Pipeline confidence is{' '}
          <span className="font-semibold text-white">72%</span>. If deals slip to Q4, Q3 revenue
          drops by <span className="font-semibold" style={{ color: '#EF4444' }}>£180K</span>, reducing
          Q3 EBITDA margin from 38% to 25%. Recommend accelerating deal review cadence with Sales
          by end of June to shore up Q3 numbers before the mid-quarter lock.
        </p>
      </div>
    </div>
  )
}
