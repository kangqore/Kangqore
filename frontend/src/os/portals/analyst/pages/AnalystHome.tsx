import { LineChart, TrendingUp, FileBarChart, BarChart2, Mail } from 'lucide-react'

const reports = [
  { label: 'Q2 2026 Business Review',         date: 'June 2026',  status: 'Available' },
  { label: 'BIDS™ Market Intelligence Report', date: 'May 2026',   status: 'Available' },
  { label: 'AI Services Competitive Analysis', date: 'April 2026', status: 'Available' },
  { label: 'Q3 2026 Outlook Brief',            date: 'Sep 2026',   status: 'Upcoming'  },
]

const kpis = [
  { icon: TrendingUp,   label: 'Revenue Growth',    value: '+42%',  sub: 'YoY Q2 2026'     },
  { icon: BarChart2,    label: 'ARR',                value: '$2.4M', sub: 'As of Jun 2026'  },
  { icon: FileBarChart, label: 'Active Engagements', value: '38',    sub: 'Enterprise clients'},
  { icon: LineChart,    label: 'NPS Score',          value: '72',    sub: 'Q2 2026 survey'  },
]

export function AnalystHome() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <LineChart className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Analyst Intelligence Portal</h1>
          <p className="text-slate-500 mt-1 text-sm">Authorised access to Kangqore performance data, reports, and briefing materials.</p>
        </div>
      </div>

      {/* Analyst contact */}
      <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-slate-200 text-sm">Analyst Relations</p>
          <p className="text-slate-500 text-xs mt-0.5">Schedule a briefing or request additional data</p>
        </div>
        <a
          href="mailto:analyst@kangqore.com"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
        >
          <Mail className="w-4 h-4" />
          analyst@kangqore.com
        </a>
      </div>

      {/* KPIs */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-center">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="text-2xl font-extrabold text-white">{value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reports */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4">Reports &amp; Briefings</h2>
        <div className="space-y-3">
          {reports.map(({ label, date, status }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 hover:shadow-sm transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
                <FileBarChart className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-200 text-sm">{label}</p>
                <p className="text-slate-500 text-xs">{date}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                status === 'Available'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-500'
              }`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
