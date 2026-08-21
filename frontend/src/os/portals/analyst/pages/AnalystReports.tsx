import { useState } from 'react'
import { FileBarChart, Download, Clock, Filter } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

type ReportType = 'All' | 'Financial' | 'Market Intelligence' | 'Competitive' | 'Operational'

const REPORTS = [
  { id: 'r1', title: 'Q2 2026 Business Review',          date: 'June 2026',      type: 'Financial',          pages: 24, status: 'Available', desc: 'Full-year revenue trajectory, ARR growth, cohort retention, and margin analysis.' },
  { id: 'r2', title: 'BIDS™ Market Intelligence Report',  date: 'May 2026',       type: 'Market Intelligence', pages: 38, status: 'Available', desc: 'Addressable market sizing, competitive landscape, and differentiation analysis for the BIDS™ suite.' },
  { id: 'r3', title: 'AI Services Competitive Analysis',  date: 'April 2026',     type: 'Competitive',         pages: 19, status: 'Available', desc: 'Positioning vs. top-10 AI-native consulting firms across capability, pricing, and delivery model.' },
  { id: 'r4', title: 'Q1 2026 Operating Review',          date: 'March 2026',     type: 'Operational',         pages: 16, status: 'Available', desc: 'Headcount, delivery metrics, utilisation rates, and capacity planning for Q1.' },
  { id: 'r5', title: 'Enterprise AI Adoption Survey 2026',date: 'February 2026',  type: 'Market Intelligence', pages: 42, status: 'Available', desc: 'Survey of 420 enterprise buyers on AI adoption timelines, budget allocation, and vendor selection criteria.' },
  { id: 'r6', title: 'Q1 2026 Financial Results',         date: 'January 2026',   type: 'Financial',           pages: 12, status: 'Available', desc: 'Revenue, gross margin, operating expenses, and cash position as of 31 March 2026.' },
  { id: 'r7', title: 'Q3 2026 Outlook Brief',             date: 'September 2026', type: 'Financial',           pages: 10, status: 'Upcoming',  desc: 'Forward guidance, pipeline composition, and strategic priorities for Q3.' },
  { id: 'r8', title: 'WAANDA Platform Technology Deep Dive', date: 'August 2026', type: 'Competitive',         pages: 28, status: 'Upcoming',  desc: 'Architecture, differentiation, and moat analysis for the WAANDA/KIMMP AI operating system.' },
]

const TYPE_COLOR: Record<string, string> = {
  'Financial':          'bg-os-blue/10 text-os-blue',
  'Market Intelligence':'bg-violet-500/10 text-violet-300',
  'Competitive':        'bg-amber-500/10 text-amber-300',
  'Operational':        'bg-os-success/10 text-os-success',
}

const FILTERS: ReportType[] = ['All', 'Financial', 'Market Intelligence', 'Competitive', 'Operational']

export function AnalystReports() {
  const [filter, setFilter] = useState<ReportType>('All')

  const visible = filter === 'All' ? REPORTS : REPORTS.filter(r => r.type === filter)
  const available = visible.filter(r => r.status === 'Available')
  const upcoming  = visible.filter(r => r.status === 'Upcoming')

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Reports" />
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Reports &amp; Briefings</h1>
        <p className="text-[var(--os-text-2)] mt-1 text-sm">Authorised analyst briefing materials and downloadable reports.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-cyan-600 text-white'
                : 'os-card text-[var(--os-text-2)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Available */}
      {available.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">Available Now</h2>
          <div className="space-y-3">
            {available.map(r => (
              <div key={r.id} className="os-card flex items-start gap-4 p-4 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileBarChart className="w-5 h-5 text-[#2564ea]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--os-text-1)' }}>{r.title}</p>
                      <p className="text-[var(--os-text-2)] text-xs mt-0.5">{r.desc}</p>
                    </div>
                    <a
                      href="#"
                      onClick={e => e.preventDefault()}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </a>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[r.type]}`}>{r.type}</span>
                    <span className="text-xs text-[var(--os-text-2)]">{r.date}</span>
                    <span className="text-xs text-[var(--os-text-2)]">{r.pages} pages</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map(r => (
              <div key={r.id} className="os-card flex items-start gap-4 p-4 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-[var(--os-surface)] flex items-center justify-center flex-shrink-0 mt-0.5" style={{ border: '1px solid var(--os-border)' }}>
                  <Clock className="w-5 h-5 text-[var(--os-text-2)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--os-text-1)] text-sm">{r.title}</p>
                  <p className="text-[var(--os-text-2)] text-xs mt-0.5">{r.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[r.type]}`}>{r.type}</span>
                    <span className="text-xs text-[var(--os-text-2)]">Expected {r.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-[var(--os-text-2)]">
        Need a report not listed here?{' '}
        <a href="mailto:analyst@kangqore.com" className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:underline">Contact analyst relations</a>
      </p>
    </div>
  )
}
