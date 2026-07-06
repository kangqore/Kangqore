import { useState } from 'react'
import { UserPlus } from 'lucide-react'

const ACCENT = '#0EA5E9'

type LeadStatus = 'MQL' | 'SQL' | 'Nurture' | 'New'
type LeadScore  = 'Hot' | 'Warm' | 'Cold'

interface Lead {
  id:      string
  name:    string
  company: string
  source:  string
  score:   LeadScore
  status:  LeadStatus
  owner:   string
  created: string
}

const LEADS: Lead[] = [
  { id: 'LD-041', name: 'James Whitfield',  company: 'NovaBio Ltd',      source: 'LinkedIn',  score: 'Hot',  status: 'SQL',     owner: 'Arjun Shah',  created: '1d ago'  },
  { id: 'LD-042', name: 'Sandra Okafor',    company: 'TechScale Inc',    source: 'Website',   score: 'Hot',  status: 'SQL',     owner: 'Unassigned',  created: '2d ago'  },
  { id: 'LD-043', name: 'Ravi Krishnan',    company: 'HealthCo',         source: 'Referral',  score: 'Warm', status: 'MQL',     owner: 'Meera Nair',  created: '3d ago'  },
  { id: 'LD-044', name: 'Chloe Dupont',     company: 'EduTech Group',    source: 'Event',     score: 'Warm', status: 'MQL',     owner: 'Dev Patel',   created: '4d ago'  },
  { id: 'LD-045', name: 'Tom Hargreaves',   company: 'BlueArch Capital', source: 'LinkedIn',  score: 'Hot',  status: 'SQL',     owner: 'Arjun Shah',  created: '5d ago'  },
  { id: 'LD-046', name: 'Priya Subramaniam',company: 'LogiCore Systems', source: 'Website',   score: 'Cold', status: 'Nurture', owner: 'Dev Patel',   created: '6d ago'  },
  { id: 'LD-047', name: 'Marcus Bauer',     company: 'Finbridge GmbH',   source: 'Referral',  score: 'Warm', status: 'MQL',     owner: 'Meera Nair',  created: '7d ago'  },
  { id: 'LD-048', name: 'Aisha Osei',       company: 'RetailPulse Ltd',  source: 'Event',     score: 'Cold', status: 'New',     owner: 'Unassigned',  created: '1h ago'  },
]

const SCORE_COLOR: Record<LeadScore, string> = {
  Hot:  '#EF4444',
  Warm: '#F59E0B',
  Cold: '#6B7280',
}

const STATUS_COLOR: Record<LeadStatus, string> = {
  SQL:     '#0EA5E9',
  MQL:     '#8B5CF6',
  Nurture: '#F97316',
  New:     '#10B981',
}

export function SalesLeads() {
  const [filter, setFilter] = useState<'ALL' | LeadStatus>('ALL')

  const newThisWeek = 18
  const mqls        = LEADS.filter(l => l.status === 'MQL').length
  const sqls        = LEADS.filter(l => l.status === 'SQL').length

  const visible = filter === 'ALL' ? LEADS : LEADS.filter(l => l.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <UserPlus size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-[var(--os-text-2)]">Lead tracker — MQLs, SQLs and nurture pipeline</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New This Week', value: String(newThisWeek), color: ACCENT    },
          { label: 'MQLs',         value: String(mqls),         color: '#8B5CF6' },
          { label: 'SQLs',         value: String(sqls),         color: '#10B981' },
          { label: 'Conversion',   value: '33.8%',              color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'SQL', 'MQL', 'Nurture', 'New'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? 'text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: ACCENT } : undefined}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden md:table-cell">Company</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden lg:table-cell">Source</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Score</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden lg:table-cell">Owner</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden sm:table-cell">Created</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((l, i) => {
              const sc = SCORE_COLOR[l.score]
              const stc = STATUS_COLOR[l.status]
              return (
                <tr key={l.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  <td className="px-5 py-3">
                    <p className="text-white font-semibold">{l.name}</p>
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{l.id}</p>
                  </td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden md:table-cell">{l.company}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className="text-xs text-[var(--os-text-2)] bg-slate-800/60 px-2 py-0.5 rounded-full">{l.source}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                      {l.score}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${stc}22`, color: stc }}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden lg:table-cell">{l.owner}</td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] text-xs hidden sm:table-cell">{l.created}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
