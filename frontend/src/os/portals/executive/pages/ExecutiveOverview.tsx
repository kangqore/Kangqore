import { LayoutDashboard, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Users } from 'lucide-react'

const kpis = [
  { label: 'Revenue (MTD)',     value: '$2.4M',  delta: '+18%',  positive: true,  icon: DollarSign,    color: '#10B981' },
  { label: 'Active Clients',   value: '34',     delta: '+3',    positive: true,  icon: Users,         color: '#6366F1' },
  { label: 'Delivery Health',  value: '91%',    delta: '+4pp',  positive: true,  icon: CheckCircle,   color: '#10B981' },
  { label: 'Open Issues (P1)', value: '2',      delta: '-1',    positive: true,  icon: AlertTriangle, color: '#EF4444' },
]

const signals = [
  { severity: 'P1', title: 'Revenue concentration risk — Client A is 38% of ARR',       time: '2h ago',   color: '#EF4444' },
  { severity: 'P2', title: 'Delivery velocity down 12% vs last sprint across 3 accounts', time: '6h ago',   color: '#F59E0B' },
  { severity: 'P2', title: 'AEGIS flagged 4 uncommitted governance obligations (Q2)',     time: '1d ago',   color: '#F59E0B' },
  { severity: 'P3', title: 'SOC 2 Type I readiness at 61% — target was 70% by end-June', time: '2d ago',   color: '#6366F1' },
]

const commits = [
  { label: 'Q2 Enterprise Targets',    progress: 78, color: '#10B981' },
  { label: 'BIDS™ Product Launch',     progress: 55, color: '#F59E0B' },
  { label: 'SOC 2 Type I Readiness',   progress: 61, color: '#6366F1' },
  { label: 'Hiring Plan (6 roles)',     progress: 33, color: '#F97316' },
]

export function ExecutiveOverview() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <LayoutDashboard className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Executive Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">Company-wide signal synthesised for leadership — as of today.</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, positive, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${positive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>{delta}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* KIMMP Signals */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Active KIMMP Signals
        </h2>
        <div className="space-y-3">
          {signals.map(({ severity, title, time, color }) => (
            <div key={title} className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10">
              <span className="text-[10px] font-black px-2 py-1 rounded-md flex-shrink-0 mt-0.5" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>{severity}</span>
              <p className="text-sm text-slate-300 flex-1">{title}</p>
              <span className="text-xs text-slate-600 flex-shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment tracker */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4">Commitments vs Target</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {commits.map(({ label, progress, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white">{label}</p>
                <span className="text-xs font-bold text-slate-400">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${progress}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
