import { LayoutDashboard, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Users, Info } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const kpis = [
  { label: 'Revenue (MTD)',     value: '$2.4M', delta: '+18%', positive: true,  icon: DollarSign,    bg: '#00c875' },
  { label: 'Active Clients',   value: '34',    delta: '+3',   positive: true,  icon: Users,         bg: '#579bfc' },
  { label: 'Delivery Health',  value: '91%',   delta: '+4pp', positive: true,  icon: CheckCircle,   bg: '#00c875' },
  { label: 'Open Issues (P1)', value: '2',     delta: '-1',   positive: true,  icon: AlertTriangle, bg: '#e2445c' },
]

const signals = [
  { severity: 'P1', title: 'Revenue concentration risk — Client A is 38% of ARR',        time: '2h ago', color: '#e2445c' },
  { severity: 'P2', title: 'Delivery velocity down 12% vs last sprint across 3 accounts', time: '6h ago', color: '#fdab3d' },
  { severity: 'P2', title: 'AEGIS flagged 4 uncommitted governance obligations (Q2)',      time: '1d ago', color: '#fdab3d' },
  { severity: 'P3', title: 'SOC 2 Type I readiness at 61% — target was 70% by end-June', time: '2d ago', color: '#579bfc' },
]

const commits = [
  { label: 'Q2 Enterprise Targets',  progress: 78, color: '#00c875' },
  { label: 'BIDS™ Product Launch',   progress: 55, color: '#fdab3d' },
  { label: 'SOC 2 Type I Readiness', progress: 61, color: '#579bfc' },
  { label: 'Hiring Plan (6 roles)',  progress: 33, color: '#e2445c' },
]

export function ExecutiveOverview() {
  return (
    <div className="space-y-10">
      <KIMMPSignalBar module="Executive Overview" />
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <LayoutDashboard className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Executive Overview</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Company-wide signal synthesised for leadership — as of today.</p>
        </div>
      </div>

      {/* Indicative data notice */}
      <div className="os-card flex items-center gap-2.5 px-4 py-3 text-xs text-[var(--os-text-2)]">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
        Figures shown are indicative placeholders. Live data will populate once operational metrics are connected.
      </div>

      {/* Vibrant full-color KPI blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, positive, icon: Icon, bg }) => (
          <div
            key={label}
            className="group relative p-8 rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
            style={{ backgroundColor: bg }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-black pointer-events-none" />
            <p className="text-[48px] font-black leading-none text-white tracking-tighter mb-4 drop-shadow-sm">{value}</p>
            <div className="flex items-center justify-between border-t border-white/20 pt-4">
              <p className="text-white font-bold text-sm">{label}</p>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full bg-black/15 text-white`}>{delta}</span>
            </div>
            <Icon className="absolute top-4 right-4 w-5 h-5 text-white/25" />
          </div>
        ))}
      </div>

      {/* KIMMP Signals */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Active KIMMP Signals</h2>
        </div>
        <div className="space-y-3">
          {signals.map(({ severity, title, time, color }) => (
            <div key={title} className="os-card flex items-start gap-4 p-4">
              <span className="text-[10px] font-black px-2 py-1 rounded-md flex-shrink-0 mt-0.5 border" style={{ color, background: `${color}18`, borderColor: `${color}30` }}>{severity}</span>
              <p className="text-sm text-[var(--os-text-1)] flex-1">{title}</p>
              <span className="text-xs text-[var(--os-text-2)] flex-shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment tracker */}
      <section>
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">Commitments vs Target</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {commits.map(({ label, progress, color }) => (
            <div key={label} className="os-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{label}</p>
                <span className="text-xs font-bold" style={{ color }}>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface)' }}>
                <div className="h-full rounded-full" style={{ width: `${progress}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
