import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const KPIS = [
  { label: 'ARR',              value: '$2.4M',  change: '+42%',  up: true,  sub: 'as of Jun 2026'   },
  { label: 'MRR',              value: '$200K',  change: '+38%',  up: true,  sub: 'Jun 2026'          },
  { label: 'Gross Margin',     value: '68%',    change: '+3pp',  up: true,  sub: 'Q2 2026'           },
  { label: 'NPS Score',        value: '72',     change: '+5',    up: true,  sub: 'Q2 2026 survey'    },
  { label: 'Active Clients',   value: '38',     change: '+11',   up: true,  sub: 'enterprise'        },
  { label: 'Headcount',        value: '47',     change: '+8',    up: true,  sub: 'FTEs + contractors' },
  { label: 'Avg Deal Size',    value: '$63K',   change: '+18%',  up: true,  sub: 'last 6 months'     },
  { label: 'Churn Rate',       value: '3.2%',   change: '-1.1pp',up: true,  sub: 'trailing 12m'      },
]

const TREND_BARS = [
  { month: 'Jan', arr: 1520 },
  { month: 'Feb', arr: 1680 },
  { month: 'Mar', arr: 1830 },
  { month: 'Apr', arr: 1990 },
  { month: 'May', arr: 2190 },
  { month: 'Jun', arr: 2400 },
]

const SEGMENTS = [
  { label: 'AI & Data',         pct: 34, color: 'bg-os-blue'    },
  { label: 'FinTech',           pct: 22, color: 'bg-cyan-500'   },
  { label: 'Healthcare',        pct: 18, color: 'bg-violet-500' },
  { label: 'E-commerce',        pct: 14, color: 'bg-amber-500'  },
  { label: 'Other',             pct: 12, color: 'bg-slate-500'  },
]

const GROWTH = [
  { label: 'New Business',      value: '$820K',  change: '+55%'  },
  { label: 'Expansion Revenue', value: '$610K',  change: '+32%'  },
  { label: 'Renewals',          value: '$970K',  change: '+29%'  },
]

const maxArr = Math.max(...TREND_BARS.map(b => b.arr))

export function AnalystMetrics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Key Metrics</h1>
        <p className="text-slate-500 mt-1 text-sm">Performance data as of Q2 2026. Updated quarterly.</p>
      </div>

      {/* KPI grid */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">At a Glance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {KPIS.map(({ label, value, change, up, sub }) => (
            <div key={label} className="p-4 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="text-2xl font-extrabold text-white leading-none">{value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {up
                  ? <TrendingUp className="w-3 h-3 text-os-success" />
                  : <TrendingDown className="w-3 h-3 text-os-danger" />
                }
                <span className={`text-xs font-bold ${up ? 'text-os-success' : 'text-os-danger'}`}>{change}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARR trend */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">ARR Trend (USD, 2026)</h2>
        <div className="p-5 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
          <div className="flex items-end gap-3 h-32">
            {TREND_BARS.map(({ month, arr }) => {
              const h = Math.round((arr / maxArr) * 100)
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold">${(arr/1000).toFixed(1)}M</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-os-blue to-cyan-400 transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-slate-500">{month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Revenue mix + growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Revenue by Segment</h2>
          <div className="p-5 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 space-y-3">
            {SEGMENTS.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300">{label}</span>
                  <span className="text-xs font-bold text-slate-200">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900/60 backdrop-blur-3xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Revenue Composition (H1 2026)</h2>
          <div className="p-5 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 space-y-3">
            {GROWTH.map(({ label, value, change }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/10 border-t-white/20 last:border-0">
                <span className="text-sm text-slate-300">{label}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-[10px] text-os-success">{change} YoY</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-semibold text-slate-200">Total H1 ARR</span>
              <p className="text-sm font-extrabold text-white">$2.4M</p>
            </div>
          </div>
        </section>
      </div>

      <p className="text-xs text-slate-500">
        Data based on unaudited management accounts. For verification or deeper analysis,{' '}
        <a href="mailto:analyst@kangqore.com" className="text-cyan-400 hover:underline">contact analyst relations</a>.
      </p>
    </div>
  )
}
