import { LineChart, TrendingUp, FileBarChart, BarChart2, Mail, AlertTriangle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

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
    <div className="space-y-10">
      <KIMMPSignalBar module="Analyst Portal" />
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <LineChart className="w-6 h-6 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Analyst Intelligence Portal</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Authorised access to Kangqore performance data, reports, and briefing materials.</p>
        </div>
      </div>

      {/* Analyst contact */}
      <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-[var(--os-text-1)] text-sm">Analyst Relations</p>
          <p className="text-[var(--os-text-2)] text-xs mt-0.5">Schedule a briefing or request additional data</p>
        </div>
        <a
          href="mailto:analyst@kangqore.com"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
        >
          <Mail className="w-4 h-4" />
          analyst@kangqore.com
        </a>
      </div>

      {/* Sample data disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">SAMPLE DATA — Illustrative only.</span> Figures shown are placeholders for demonstration purposes and are not audited, verified, or for investment or decision-making use. Contact <a href="mailto:analyst@kangqore.com" className="underline">analyst@kangqore.com</a> for verified data.
        </p>
      </div>

      {/* KPIs */}
      <section>
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">Key Metrics <span className="text-xs font-normal text-amber-400">(illustrative)</span></h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="os-card p-5 text-center">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-[#2564ea]" />
              </div>
              <p className="text-2xl font-extrabold" style={{ color: 'var(--os-text-1)' }}>{value}</p>
              <p className="text-xs font-semibold text-[var(--os-text-2)] mt-0.5">{label}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reports */}
      <section>
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">Reports &amp; Briefings</h2>
        <div className="space-y-3">
          {reports.map(({ label, date, status }) => (
            <div key={label} className="os-card flex items-center gap-4 p-4 hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-[var(--os-surface)] flex items-center justify-center flex-shrink-0" style={{ border: '1px solid var(--os-border)' }}>
                <FileBarChart className="w-5 h-5 text-[var(--os-text-2)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--os-text-1)] text-sm">{label}</p>
                <p className="text-[var(--os-text-2)] text-xs">{date}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                status === 'Available'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-[var(--os-text-2)] bg-[var(--os-surface)]'
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
