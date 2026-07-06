import { useState } from 'react'
import { BookOpen, Search, ChevronDown, ChevronUp } from 'lucide-react'

const ARTICLES = [
  { id: 'KB-0041', title: 'Zero-Trust Network Configuration Guide',     category: 'Network',    views: 142, updated: '2 days ago',  author: 'Rohan M.', body: 'Step-by-step guide for configuring zero-trust network access using FortiGate and Okta. Covers segmentation, MFA enforcement, and device posture checks.' },
  { id: 'KB-0040', title: 'PostgreSQL Performance Tuning — Production', category: 'Database',   views: 98,  updated: '1 week ago',  author: 'Priya N.', body: 'Covers connection pooling with PgBouncer, query plan analysis, and index optimisation for the Kangqore production schema. Includes benchmark results.' },
  { id: 'KB-0039', title: 'Incident Response Runbook — P1/P2',         category: 'Process',    views: 203, updated: '2 weeks ago', author: 'Arjun S.', body: 'On-call playbook for P1 and P2 incidents. Covers escalation paths, war room setup, stakeholder comms, and PIR template. Last updated after IT-0032.' },
  { id: 'KB-0038', title: 'GitHub Actions — Self-Hosted Runner Setup',  category: 'CI/CD',     views: 77,  updated: '3 weeks ago', author: 'Rohan M.', body: 'Instructions for registering, configuring, and securing self-hosted GitHub Actions runners in the Kangqore environment.' },
  { id: 'KB-0037', title: 'SOC 2 Control Evidence Collection',          category: 'Compliance', views: 56,  updated: '1 month ago', author: 'Rohan M.', body: 'Step-by-step process for collecting and uploading evidence for each SOC 2 Type II control. Includes naming conventions and Vault folder structure.' },
  { id: 'KB-0036', title: 'AWS IAM Role Hierarchy — Kangqore',          category: 'Cloud',     views: 89,  updated: '1 month ago', author: 'Priya N.', body: 'Defines the IAM role structure across Kangqore AWS accounts. Covers least-privilege principles, cross-account trust, and emergency break-glass procedure.' },
  { id: 'KB-0035', title: 'VPN Troubleshooting — Common Issues',        category: 'Network',    views: 311, updated: '6 days ago',  author: 'Rohan M.', body: 'Common VPN issues and resolution steps: latency spikes, gateway failover, DNS leak prevention, and split-tunnel configuration.' },
]

const CATS = ['All', 'Network', 'Database', 'Process', 'CI/CD', 'Compliance', 'Cloud']
const CAT_COLOR: Record<string, string> = {
  Network: '#2564ea', Database: '#8B5CF6', Process: '#F59E0B',
  'CI/CD': '#10B981', Compliance: '#EF4444', Cloud: '#06B6D4',
}

export function ITKnowledgeBase() {
  const [search,   setSearch]   = useState('')
  const [cat,      setCat]      = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const visible = ARTICLES.filter(a => {
    const s = a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase())
    const c = cat === 'All' || a.category === cat
    return s && c
  })

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Knowledge Base</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">IT runbooks, configuration guides, and incident resolution references.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Articles',     value: ARTICLES.length.toString(), color: '#2564ea' },
          { label: 'Total Views',  value: ARTICLES.reduce((s, a) => s + a.views, 0).toString(), color: '#10B981' },
          { label: 'Updated (7d)', value: '3', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + category */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--os-text-2)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] focus:outline-none focus:ring-1 focus:ring-white/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === c ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-2">
        {visible.map(a => (
          <div key={a.id} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpanded(expanded === a.id ? null : a.id)}
            >
              <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: `${CAT_COLOR[a.category] ?? 'var(--os-text-2)'}22`, color: CAT_COLOR[a.category] ?? 'var(--os-text-2)' }}>
                {a.category}
              </span>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white">{a.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{a.id} · {a.author} · {a.views} views · Updated {a.updated}</p>
              </div>
              {expanded === a.id ? <ChevronUp className="w-4 h-4 text-[var(--os-text-2)] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[var(--os-text-2)] flex-shrink-0" />}
            </button>
            {expanded === a.id && (
              <div className="px-4 pb-4 pt-0 border-t border-white/10">
                <p className="text-sm text-[var(--os-text-1)] mt-3 leading-relaxed">{a.body}</p>
              </div>
            )}
          </div>
        ))}
        {visible.length === 0 && <p className="text-center text-[var(--os-text-2)] py-10 text-sm">No articles match your search.</p>}
      </div>
    </div>
  )
}
