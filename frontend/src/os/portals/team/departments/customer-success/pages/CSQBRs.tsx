import { TrendingUp } from 'lucide-react'

const ACCENT = '#14B8A6'

type QBRStatus = 'Prep in progress' | 'Confirmed' | 'Scheduled' | 'Scheduling' | 'OVERDUE'

interface QBR {
  account:  string
  date:     string
  csm:      string
  status:   QBRStatus
  overdue?: boolean
}

const QBRS: QBR[] = [
  { account: 'Acme Corp',    date: '2026-07-08', csm: 'Lena Park',  status: 'Prep in progress' },
  { account: 'GlobalMed',   date: '2026-07-15', csm: 'Raj Mehta',  status: 'Confirmed'         },
  { account: 'DataCo',      date: '2026-07-22', csm: 'Lena Park',  status: 'Scheduled'         },
  { account: 'RetailGiant', date: '2026-08-05', csm: 'Raj Mehta',  status: 'Scheduling'        },
  { account: 'FinServ Ltd', date: '2026-05-30', csm: 'Lena Park',  status: 'OVERDUE', overdue: true },
  { account: 'ManuFlex',    date: '2026-06-10', csm: 'Raj Mehta',  status: 'OVERDUE', overdue: true },
]

const STATUS_STYLE: Record<QBRStatus, { bg: string; text: string }> = {
  'Prep in progress': { bg: '#6366F122', text: '#818CF8' },
  'Confirmed':        { bg: '#10B98122', text: '#10B981' },
  'Scheduled':        { bg: '#14B8A622', text: '#14B8A6' },
  'Scheduling':       { bg: '#F59E0B22', text: '#F59E0B' },
  'OVERDUE':          { bg: '#EF444422', text: '#EF4444' },
}

export function CSQBRs() {
  const completed = 28
  const scheduled = 6
  const overdue   = QBRS.filter(q => q.overdue).length
  const nps       = '+48'

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <TrendingUp size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">QBR Tracker</h1>
          <p className="text-sm text-[var(--os-text-2)]">Quarterly Business Reviews — scheduling, status and NPS tracking</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completed YTD',   value: String(completed), color: '#10B981' },
          { label: 'Scheduled',       value: String(scheduled), color: ACCENT    },
          { label: 'Overdue',         value: String(overdue),   color: '#EF4444' },
          { label: 'NPS Post-QBR',    value: nps,               color: '#A78BFA' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP */}
      <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">KIMMP Intelligence</p>
        <p className="text-sm text-[var(--os-text-1)]">
          GlobalMed QBR is 3 days away. Last QBR NPS was +62. Recommend leading with BIDS&#8482; ROI data —
          they expanded 2x after last year&apos;s QBR.
        </p>
      </div>

      {/* QBR Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-5 py-3 border-b border-white/10">
          <span>Account</span>
          <span>Date</span>
          <span>CSM</span>
          <span>Status</span>
        </div>
        {QBRS.map(q => {
          const ss = STATUS_STYLE[q.status]
          return (
            <div
              key={`${q.account}-${q.date}`}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-5 py-4 border-b border-white/5 hover:bg-slate-800/40 transition-colors ${q.overdue ? 'bg-red-500/5' : ''}`}
            >
              <span className="text-sm font-semibold text-white">{q.account}</span>
              <span className={`text-sm ${q.overdue ? 'text-red-400 font-semibold' : 'text-[var(--os-text-1)]'}`}>{q.date}</span>
              <span className="text-sm text-[var(--os-text-1)]">{q.csm}</span>
              <span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ss.bg, color: ss.text }}>
                  {q.status}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
