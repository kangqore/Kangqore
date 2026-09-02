import { FileText } from 'lucide-react'

const KPIS = [
  { label: 'Published', value: '24', color: '#10B981' },
  { label: 'In Review', value: '6',  color: '#6366F1' },
  { label: 'Draft',     value: '11', color: '#F59E0B' },
  { label: 'Scheduled', value: '8',  color: '#EC4899' },
]

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-emerald-500/20 text-emerald-400',
  'In Review':'bg-blue-500/20 text-blue-400',
  Draft:      'bg-amber-500/20 text-amber-400',
  Scheduled:  'bg-pink-500/20 text-pink-400',
}

const CONTENT = [
  { title: 'How BIDS™ Closes the AI Governance Gap',               type: 'Whitepaper',  status: 'Published', author: 'Priya Kapoor', date: '2026-06-10' },
  { title: 'Kangqore OS vs Monday.com: Feature Comparison',         type: 'Blog Post',   status: 'Published', author: 'Jamie Walsh',  date: '2026-06-14' },
  { title: 'Agentic AI in Enterprise: 2026 Readiness Guide',        type: 'Whitepaper',  status: 'In Review', author: 'Priya Kapoor', date: '2026-07-01' },
  { title: '5 Signs Your Ops Stack is Holding You Back',            type: 'Blog Post',   status: 'Draft',     author: 'Jamie Walsh',  date: '—' },
  { title: 'Kangqore & HANUMANAS: How We Secure Agentic Workflows',     type: 'Case Study',  status: 'Scheduled', author: 'Priya Kapoor', date: '2026-07-08' },
  { title: 'Q2 Social Campaign: LinkedIn Carousel Series',          type: 'Social Post', status: 'Published', author: 'Aisha Patel',  date: '2026-06-18' },
]

export function MarketingContent() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Content Calendar</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Blog posts, whitepapers, case studies and social content across all stages.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Content list */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Content Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--os-text-2)] uppercase tracking-wider border-b border-white/[0.05]">
                <th className="text-left pb-3 font-medium">Title</th>
                <th className="text-left pb-3 font-medium">Type</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Author</th>
                <th className="text-left pb-3 font-medium">Publish Date</th>
              </tr>
            </thead>
            <tbody>
              {CONTENT.map(c => (
                <tr key={c.title} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-3 pr-4 font-medium text-white max-w-xs">{c.title}</td>
                  <td className="py-3 pr-4 text-[var(--os-text-2)] whitespace-nowrap">{c.type}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[var(--os-text-2)] whitespace-nowrap">{c.author}</td>
                  <td className="py-3 text-[var(--os-text-2)] text-xs whitespace-nowrap">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
