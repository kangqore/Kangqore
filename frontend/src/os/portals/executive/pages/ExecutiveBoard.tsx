import { BookMarked, FileText, Download, Lock } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const boardMaterials = [
  {
    category: 'Board Packs',
    items: [
      { title: 'Q2 2026 Board Pack',          date: 'Jun 2026', status: 'CURRENT', locked: false },
      { title: 'Q1 2026 Board Pack',          date: 'Mar 2026', status: 'ARCHIVED', locked: false },
      { title: 'FY2025 Annual Review',        date: 'Dec 2025', status: 'ARCHIVED', locked: false },
    ]
  },
  {
    category: 'Financial Reporting',
    items: [
      { title: 'June 2026 P&L (Unaudited)',   date: 'Jun 2026', status: 'DRAFT',   locked: false },
      { title: 'May 2026 Management Accounts', date: 'May 2026', status: 'FINAL',   locked: false },
      { title: 'Q2 Budget vs Actual',         date: 'Jun 2026', status: 'CURRENT', locked: false },
    ]
  },
  {
    category: 'Governance',
    items: [
      { title: 'Articles of Association',     date: 'Jan 2024', status: 'LEGAL',   locked: true  },
      { title: 'Shareholders Agreement',      date: 'Jan 2024', status: 'LEGAL',   locked: true  },
      { title: 'Board Resolution Log',        date: 'Ongoing',  status: 'LIVE',    locked: false },
    ]
  },
]

const STATUS_COLOR: Record<string, string> = {
  CURRENT:  '#10B981',
  DRAFT:    '#F59E0B',
  ARCHIVED: '#6B7280',
  FINAL:    '#6366F1',
  LIVE:     '#06B6D4',
  LEGAL:    '#EC4899',
}

export function ExecutiveBoard() {
  return (
    <div className="space-y-10">
      <KIMMPSignalBar module="Board Materials" />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <BookMarked className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Board Materials</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Board packs, financials, and governance documents — executive access only.</p>
        </div>
      </div>

      {boardMaterials.map(section => (
        <section key={section.category}>
          <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">{section.category}</h2>
          <div className="space-y-2">
            {section.items.map(({ title, date, status, locked }) => (
              <div key={title} className="os-card flex items-center gap-4 p-4 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--os-text-1)' }}>{title}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{date}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: STATUS_COLOR[status], background: `${STATUS_COLOR[status]}18`, border: `1px solid ${STATUS_COLOR[status]}30` }}>{status}</span>
                  {locked
                    ? <Lock className="w-4 h-4 text-[var(--os-text-2)]" />
                    : <Download className="w-4 h-4 text-[var(--os-text-2)] group-hover:text-[var(--os-text-1)] transition-colors cursor-pointer" />
                  }
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
