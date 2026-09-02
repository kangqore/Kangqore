import { Network, CheckCircle, Clock, Brain } from 'lucide-react'

const ACCENT = '#84CC16'

type ADRStatus = 'Accepted' | 'Proposed' | 'Superseded'

interface ADR {
  id:      string
  title:   string
  status:  ADRStatus
  date:    string
  author?: string
  note?:   string
}

interface SystemComponent {
  name:  string
  stack: string[]
}

const ADRS: ADR[] = [
  { id: 'ADR-035', title: 'WebSockets for Live Boards',     status: 'Proposed',  date: '2026-06-18', author: 'Siddharth R', note: 'Open for review' },
  { id: 'ADR-034', title: 'Adopt Vite 8 as build tool',     status: 'Accepted',  date: '2026-06-10', author: 'Aryan M' },
  { id: 'ADR-033', title: 'KIMMP streaming via SSE',        status: 'Accepted',  date: '2026-05-28', author: 'Siddharth R' },
  { id: 'ADR-032', title: 'Phosphor Icons as icon library', status: 'Accepted',  date: '2026-05-15', author: 'Kavya N' },
  { id: 'ADR-031', title: 'Prisma as ORM',                  status: 'Accepted',  date: '2026-04-20' },
]

const COMPONENTS: SystemComponent[] = [
  { name: 'Kangqore OS Frontend', stack: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind CSS'] },
  { name: 'KIMMP Core',           stack: ['Node.js', 'SSE', 'Claude API', 'Redis'] },
  { name: 'HANUMANAS Service',        stack: ['Node.js', 'Prisma', 'PostgreSQL'] },
  { name: 'API Gateway',          stack: ['Express', 'JWT', 'Rate Limiting', 'CORS'] },
  { name: 'Auth Service',         stack: ['OAuth2', 'Okta', 'Session Tokens'] },
  { name: 'Notification Service', stack: ['WebSockets', 'Push API', 'Email'] },
]

const STATUS_COLOR: Record<ADRStatus, string> = {
  Accepted:   '#10B981',
  Proposed:   '#F59E0B',
  Superseded: '#6B7280',
}

export function EngineeringArchitecture() {
  const totals = { total: 34, proposed: 3, accepted: 28, superseded: 3 }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Network className="w-6 h-6" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Architecture</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Architecture Decision Records (ADRs) and system component registry.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total ADRs',   value: totals.total,      color: ACCENT },
          { label: 'Proposed',     value: totals.proposed,   color: '#F59E0B' },
          { label: 'Accepted',     value: totals.accepted,   color: '#10B981' },
          { label: 'Superseded',   value: totals.superseded, color: '#6B7280' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ADR table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent ADRs</h2>
          <span className="text-xs text-[var(--os-text-2)]">{ADRS.length} shown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-28">ADR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-28">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-32">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-32">Author</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {ADRS.map(adr => (
                <tr
                  key={adr.id}
                  className={`transition-colors ${adr.status === 'Proposed' ? 'bg-yellow-500/5' : 'hover:bg-white/[0.02]'}`}
                >
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-[var(--os-text-2)]">{adr.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{adr.title}</span>
                    {adr.note && (
                      <span className="ml-2 text-xs text-yellow-400">— {adr.note}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: `${STATUS_COLOR[adr.status]}18`, color: STATUS_COLOR[adr.status] }}
                    >
                      {adr.status === 'Accepted' && <CheckCircle className="w-3 h-3" />}
                      {adr.status === 'Proposed' && <Clock className="w-3 h-3" />}
                      {adr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--os-text-2)] text-xs">{adr.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--os-text-2)] text-sm">{adr.author ?? '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System components */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">System Components</h2>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {COMPONENTS.map(comp => (
            <div
              key={comp.name}
              className="p-4 rounded-xl border border-white/10 bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
            >
              <p className="text-sm font-semibold text-white mb-3">{comp.name}</p>
              <div className="flex flex-wrap gap-2">
                {comp.stack.map(tech => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${ACCENT}18`, color: ACCENT }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KIMMP insight */}
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex gap-4">
        <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-yellow-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-yellow-400 mb-1">KIMMP · Architecture Intelligence</p>
          <p className="text-sm text-[var(--os-text-1)] leading-relaxed">
            ADR-035 (WebSockets for Live Boards) is open for team review. Current SSE approach (ADR-033) works for KIMMP streaming but cannot support bi-directional collaboration features planned for Q3. Recommend scheduling a 1-hour design review before next sprint.
          </p>
        </div>
      </div>
    </div>
  )
}
