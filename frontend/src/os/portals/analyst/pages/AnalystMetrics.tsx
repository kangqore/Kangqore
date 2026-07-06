import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

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
    <div className="space-y-10">
      <KIMMPSignalBar module="Key Metrics" />
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Key Metrics</h1>
        <p className="text-[var(--os-text-2)] mt-1 text-sm">Performance data as of Q2 2026. Updated quarterly.</p>
      </div>

      {/* Sample data disclaimer — prominent, top of page */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">SAMPLE DATA — Illustrative only.</span> All figures are placeholders for demonstration purposes and are not audited or verified. They do not represent Kangqore's actual financial results and must not be used for investment or decision-making purposes. For verified data, contact <a href="mailto:analyst@kangqore.com" className="underline">analyst@kangqore.com</a>.
        </p>
      </div>

      {/* KPI grid */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">At a Glance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {KPIS.map(({ label, value, change, up, sub }) => (
            <div key={label} className="p-4 rounded-2xl os-card">
              <p className="text-xs text-[var(--os-text-2)] mb-1">{label}</p>
              <p className="text-2xl font-extrabold leading-none" style={{ color: 'var(--os-text-1)' }}>{value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {up
                  ? <TrendingUp className="w-3 h-3 text-os-success" />
                  : <TrendingDown className="w-3 h-3 text-os-danger" />
                }
                <span className={`text-xs font-bold ${up ? 'text-os-success' : 'text-os-danger'}`}>{change}</span>
              </div>
              <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARR trend */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">ARR Trend (USD, 2026)</h2>
        <div className="p-5 rounded-2xl os-card">
          <div className="flex items-end gap-3 h-32">
            {TREND_BARS.map(({ month, arr }) => {
              const h = Math.round((arr / maxArr) * 100)
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-[var(--os-text-2)] font-semibold">${(arr/1000).toFixed(1)}M</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-os-blue to-cyan-400 transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-[var(--os-text-2)]">{month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Revenue mix + growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">Revenue by Segment</h2>
          <div className="p-5 rounded-2xl os-card space-y-3">
            {SEGMENTS.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--os-text-1)]">{label}</span>
                  <span className="text-xs font-bold text-[var(--os-text-1)]">{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--os-surface)' }}>
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">Revenue Composition (H1 2026)</h2>
          <div className="p-5 rounded-2xl os-card space-y-3">
            {GROWTH.map(({ label, value, change }) => (
              <div key={label} className="flex items-center justify-between py-2 [&:not(:last-child)]:border-b" style={{ borderColor: 'var(--os-border)' }}>
                <span className="text-sm text-[var(--os-text-1)]">{label}</span>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{value}</p>
                  <p className="text-[10px] text-os-success">{change} YoY</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-semibold text-[var(--os-text-1)]">Total H1 ARR</span>
              <p className="text-sm font-extrabold" style={{ color: 'var(--os-text-1)' }}>$2.4M</p>
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}
