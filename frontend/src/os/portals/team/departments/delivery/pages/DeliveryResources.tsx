import { Users, Sparkles } from 'lucide-react'

const ACCENT = '#F43F5E'

interface Consultant {
  id:           string
  name:         string
  initials:     string
  color:        string
  role:         string
  skills:       string
  projects:     string
  utilisation:  number
  nextAvail:    string
}

const CONSULTANTS: Consultant[] = [
  { id: 'c1', name: 'Riya Desai',     initials: 'RD', color: '#F43F5E', role: 'Senior PM',          skills: 'Project Mgmt, Client Mgmt, Risk',       projects: 'Acme OS, DataCo AI, RetailCo',   utilisation: 88, nextAvail: 'Aug 15'   },
  { id: 'c2', name: 'Sanjay Verma',   initials: 'SV', color: '#F97316', role: 'Delivery Manager',    skills: 'Programme Mgmt, Governance, Change',    projects: 'GlobalMed, FinServ, ManufactureCo',utilisation: 95, nextAvail: 'Sep 30'   },
  { id: 'c3', name: 'Siddharth R.',   initials: 'SR', color: '#EF4444', role: 'Lead Engineer',       skills: 'Cloud, Architecture, DevOps',           projects: 'FinServ, ManufactureCo, ENG-204',utilisation: 112,nextAvail: 'Oct 1'    },
  { id: 'c4', name: 'Aryan M.',       initials: 'AM', color: '#10B981', role: 'Engineer',            skills: 'Python, Cloud, APIs',                   projects: 'DataCo AI',                      utilisation: 65, nextAvail: 'Available' },
  { id: 'c5', name: 'Priya Nair',     initials: 'PN', color: '#8B5CF6', role: 'Business Analyst',   skills: 'Requirements, Process, Docs',           projects: 'GlobalMed, LegalFirst',          utilisation: 80, nextAvail: 'Nov 1'    },
  { id: 'c6', name: 'Vikram S.',      initials: 'VS', color: '#6366F1', role: 'QA Lead',             skills: 'Test Automation, UAT, QA',              projects: 'Acme OS, RetailCo',              utilisation: 75, nextAvail: 'Aug 20'   },
  { id: 'c7', name: 'Kavya Reddy',    initials: 'KR', color: '#F59E0B', role: 'Change Manager',     skills: 'Change Mgmt, Training, Comms',          projects: 'HealthGroup, LegalFirst',        utilisation: 70, nextAvail: 'Dec 1'    },
  { id: 'c8', name: 'Rahul M.',       initials: 'RM', color: '#06B6D4', role: 'Data Engineer',       skills: 'SQL, ETL, Data Pipelines',              projects: 'HealthGroup',                    utilisation: 60, nextAvail: 'Available' },
]

const BENCH: Consultant[] = [
  { id: 'b1', name: 'Aryan M.',    initials: 'AM', color: '#10B981', role: 'Engineer',        skills: 'Python, Cloud, APIs',   projects: 'DataCo AI (65%)',  utilisation: 65, nextAvail: 'Available' },
  { id: 'b2', name: 'Rahul M.',    initials: 'RM', color: '#06B6D4', role: 'Data Engineer',   skills: 'SQL, ETL, Pipelines',   projects: 'HealthGroup (60%)',utilisation: 60, nextAvail: 'Available' },
  { id: 'b3', name: 'Meena S.',    initials: 'MS', color: '#A78BFA', role: 'PM Associate',    skills: 'Coordination, PMO',     projects: 'None',             utilisation: 0,  nextAvail: 'Available' },
]

const CAPACITY_FORECAST = [
  { week: 'Jun 23–29', available: 4.2, committed: 13.8 },
  { week: 'Jun 30–Jul 6', available: 3.8, committed: 14.2 },
  { week: 'Jul 7–13',  available: 5.0, committed: 13.0 },
  { week: 'Jul 14–20', available: 6.5, committed: 11.5 },
]

function utilisationColor(pct: number): string {
  if (pct > 100) return '#EF4444'
  if (pct >= 70)  return '#10B981'
  return '#F59E0B'
}

function utilisationLabel(pct: number): string {
  if (pct > 100) return 'Over-allocated'
  if (pct >= 70)  return 'Healthy'
  return 'Under-utilised'
}

export function DeliveryResources() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Users size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Resource Allocation</h1>
          <p className="text-sm text-[var(--os-text-2)]">Consultant utilisation, capacity planning & bench management</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Consultants',  value: '18',   color: ACCENT    },
          { label: 'Billable Utilisation',value: '78%',  color: '#10B981' },
          { label: 'Bench',              value: '3',    color: '#F59E0B' },
          { label: 'Over-allocated',     value: '2',    color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP Insight */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 flex gap-4">
        <Sparkles size={18} className="text-rose-400 mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold text-rose-400">KIMMP: </span>
          Siddharth R. (Lead Engineer) is at 112% allocation. Recommend redistributing ENG-204 to Aryan M.
          who is at 65% utilisation — skills match confirmed. This will bring Siddharth to 85% and improve
          ENG-204 delivery velocity.
        </p>
      </div>

      {/* Consultant Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Consultant Utilisation</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Consultant', 'Role', 'Skills', 'Current Projects', 'Utilisation', 'Next Available'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {CONSULTANTS.map(c => {
                const uc = utilisationColor(c.utilisation)
                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: c.color }}>
                          {c.initials}
                        </div>
                        <span className="text-sm font-semibold text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{c.role}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs max-w-[180px]">{c.skills}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs max-w-[200px]">{c.projects}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(c.utilisation, 100)}%`, background: uc }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: uc }}>{c.utilisation}%</span>
                        {c.utilisation > 100 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold">!</span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: uc }}>{utilisationLabel(c.utilisation)}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">
                      <span className={c.nextAvail === 'Available' ? 'text-green-400 font-semibold' : ''}>{c.nextAvail}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4-Week Capacity Forecast */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">4-Week Capacity Forecast</p>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Total team-days available vs committed (18 consultants)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Week', 'Available Days', 'Committed Days', 'Headroom'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {CAPACITY_FORECAST.map(row => {
                const headroom = (18 * 5 - row.committed).toFixed(1)
                return (
                  <tr key={row.week} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{row.week}</td>
                    <td className="px-4 py-3 text-green-400 font-semibold whitespace-nowrap">{row.available} days</td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap">{row.committed} days</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`font-semibold ${parseFloat(headroom) < 5 ? 'text-amber-400' : 'text-green-400'}`}>
                        {headroom} days
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bench Section */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <p className="text-sm font-semibold text-white">Bench — Available Consultants</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">{BENCH.length} available</span>
        </div>
        <div className="divide-y divide-[var(--os-border)]">
          {BENCH.map(b => (
            <div key={b.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-800/30 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: b.color }}>
                {b.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{b.name}</p>
                <p className="text-xs text-[var(--os-text-2)]">{b.role} · {b.skills}</p>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold">Available</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
