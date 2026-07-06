import { Sparkles } from 'lucide-react'
import { ActivityIcon as Activity } from '@phosphor-icons/react'

const ACCENT = '#16A34A'

type SLAStatus = 'On Track' | 'At Risk' | 'Breached'

interface SLAItem {
  service:    string
  provider:   string
  target:     string
  currentMth: number
  ytd:        number
  status:     SLAStatus
}

const SLAS: SLAItem[] = [
  { service: 'Production Uptime',       provider: 'AWS',                target: '99.9%', currentMth: 99.97, ytd: 99.94, status: 'On Track' },
  { service: 'Support First Response',  provider: 'Internal',           target: '<2h',   currentMth: 94,    ytd: 96,    status: 'On Track' },
  { service: 'Incident Resolution P1',  provider: 'Internal',           target: '<4h',   currentMth: 88,    ytd: 91,    status: 'At Risk' },
  { service: 'CRM Availability',        provider: 'Salesforce',         target: '99.5%', currentMth: 98.2,  ytd: 99.1,  status: 'At Risk' },
  { service: 'Payroll Processing',      provider: 'Internal / ADP',     target: '100%',  currentMth: 100,   ytd: 100,   status: 'On Track' },
  { service: 'Print Services Delivery', provider: 'Legacy Print Co.',   target: '95%',   currentMth: 71,    ytd: 76,    status: 'Breached' },
  { service: 'IT Change Management',    provider: 'Internal',           target: '90%',   currentMth: 86,    ytd: 88,    status: 'At Risk' },
  { service: 'Finance Report Delivery', provider: 'Internal',           target: '100%',  currentMth: 100,   ytd: 97,    status: 'On Track' },
]

const STATUS_COLOR: Record<SLAStatus, string> = {
  'On Track': '#10B981',
  'At Risk':  '#F59E0B',
  'Breached': '#EF4444',
}

export function OpsSLATracker() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Activity size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SLA Tracker</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Service level agreement performance — month-to-date and YTD across all services.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Services Tracked', value: String(SLAS.length),                                           color: ACCENT },
          { label: 'On Track',         value: String(SLAS.filter(s => s.status === 'On Track').length),    color: '#10B981' },
          { label: 'At Risk',          value: String(SLAS.filter(s => s.status === 'At Risk').length),     color: '#F59E0B' },
          { label: 'Breached',         value: String(SLAS.filter(s => s.status === 'Breached').length),    color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          Print Services is in breach at 71% vs 95% SLA — issue a formal breach notice to Legacy Print Co. and initiate
          the vendor change process. P1 Incident Resolution at 88% is At Risk; the target is 90% — 2 recent incidents
          took 5+ hours to resolve. Post-incident reviews for both should identify whether the gap is tooling, process
          or capacity. Salesforce availability at 98.2% is below 99.5% SLA — raise with Salesforce account team.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Service', 'Provider', 'SLA Target', 'This Month', 'YTD', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {SLAS.map(s => {
                const sc = STATUS_COLOR[s.status]
                return (
                  <tr key={s.service} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{s.service}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.provider}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.target}</td>
                    <td className="px-4 py-3 text-white font-bold whitespace-nowrap">{s.currentMth}%</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.ytd}%</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{s.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
