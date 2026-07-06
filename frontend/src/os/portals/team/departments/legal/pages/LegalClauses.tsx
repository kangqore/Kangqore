import { useState } from 'react'
import { BookOpen } from 'lucide-react'

const ACCENT = '#F59E0B'

interface Clause {
  id: string
  title: string
  type: string
  approvedVersion: string
  lastUpdated: string
  usageCount: number
  pendingReview: boolean
  text: string
}

const CLAUSES: Clause[] = [
  {
    id: 'CLS-001',
    title: 'Limitation of Liability',
    type: 'Liability',
    approvedVersion: 'v3.2',
    lastUpdated: '14 Apr 2026',
    usageCount: 34,
    pendingReview: false,
    text: 'In no event shall either party be liable for indirect, incidental, special, or consequential damages arising out of or in connection with this agreement. Total liability shall not exceed the fees paid in the twelve months preceding the claim.',
  },
  {
    id: 'CLS-002',
    title: 'Intellectual Property Ownership',
    type: 'IP',
    approvedVersion: 'v2.1',
    lastUpdated: '02 Mar 2026',
    usageCount: 28,
    pendingReview: false,
    text: 'All intellectual property created by either party prior to the agreement date remains the sole property of that party. Jointly created work product shall be owned equally unless otherwise agreed in writing. Work product created solely by a contractor on behalf of Kangqore Ltd shall vest fully in Kangqore Ltd upon creation.',
  },
  {
    id: 'CLS-003',
    title: 'Mutual Confidentiality',
    type: 'Confidentiality',
    approvedVersion: 'v4.0',
    lastUpdated: '19 May 2026',
    usageCount: 47,
    pendingReview: false,
    text: 'Each party agrees to hold the other party\'s Confidential Information in strict confidence. No party shall disclose Confidential Information to third parties without prior written consent. This obligation survives termination for a period of five (5) years.',
  },
  {
    id: 'CLS-004',
    title: 'Payment Terms',
    type: 'Payment',
    approvedVersion: 'v2.4',
    lastUpdated: '11 Jun 2026',
    usageCount: 41,
    pendingReview: false,
    text: 'Invoices are payable within 30 days of receipt. Late payments shall accrue interest at 8% per annum above the Bank of England base rate pursuant to the Late Payment of Commercial Debts Act 1998. Disputed amounts must be raised in writing within 14 days of invoice date.',
  },
  {
    id: 'CLS-005',
    title: 'Termination for Convenience',
    type: 'Termination',
    approvedVersion: 'v1.8',
    lastUpdated: '08 Feb 2026',
    usageCount: 22,
    pendingReview: true,
    text: 'Either party may terminate this agreement for convenience by providing 30 days\' written notice. Upon termination, outstanding fees for work completed shall remain due. The terminating party shall have no further liability beyond such outstanding fees.',
  },
  {
    id: 'CLS-006',
    title: 'Warranties and Representations',
    type: 'Warranties',
    approvedVersion: 'v2.0',
    lastUpdated: '22 Jan 2026',
    usageCount: 29,
    pendingReview: false,
    text: 'Each party warrants that it has full authority to enter this agreement, that the services will be performed in a professional and workmanlike manner consistent with industry standards, and that the deliverables will not infringe any third-party intellectual property rights.',
  },
  {
    id: 'CLS-007',
    title: 'Governing Law — England & Wales',
    type: 'Governing Law',
    approvedVersion: 'v1.3',
    lastUpdated: '30 Sep 2025',
    usageCount: 38,
    pendingReview: false,
    text: 'This agreement shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of England and Wales, without prejudice to rights available under any applicable consumer protection legislation.',
  },
  {
    id: 'CLS-008',
    title: 'Force Majeure',
    type: 'Force Majeure',
    approvedVersion: 'v1.5',
    lastUpdated: '14 May 2026',
    usageCount: 16,
    pendingReview: false,
    text: 'Neither party shall be liable for delays or failures caused by events beyond its reasonable control including but not limited to acts of God, natural disasters, pandemic, or government action. The affected party must notify the other within 48 hours of becoming aware of such an event.',
  },
]

const TYPE_COLOR: Record<string, string> = {
  Liability:      '#EF4444',
  IP:             '#3B82F6',
  Confidentiality:'#8B5CF6',
  Payment:        '#10B981',
  Termination:    '#F97316',
  Warranties:     '#06B6D4',
  'Governing Law':'#14B8A6',
  'Force Majeure':'#F59E0B',
}

export function LegalClauses() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalClauses    = CLAUSES.length
  const recentlyUpdated = CLAUSES.filter(c => c.lastUpdated.includes('2026') && (c.lastUpdated.includes('May') || c.lastUpdated.includes('Jun') || c.lastUpdated.includes('Apr'))).length
  const mostUsed        = CLAUSES.reduce((a, c) => c.usageCount > a.usageCount ? c : a, CLAUSES[0])
  const pendingReview   = CLAUSES.filter(c => c.pendingReview).length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <BookOpen size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Clause Library</h1>
          <p className="text-sm text-[var(--os-text-2)]">Standard approved clauses for contract drafting — maintained by Legal</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Clauses',          value: String(totalClauses),        color: ACCENT    },
          { label: 'Recently Updated', value: String(recentlyUpdated),     color: '#10B981' },
          { label: 'Most Used',        value: mostUsed.type,               color: '#8B5CF6' },
          { label: 'Pending Review',   value: String(pendingReview),       color: pendingReview > 0 ? '#F59E0B' : '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2 truncate" style={{ color: k.color, fontSize: k.label === 'Most Used' ? '1rem' : undefined }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Clause Cards */}
      <div className="space-y-2">
        {CLAUSES.map(c => {
          const tc      = TYPE_COLOR[c.type] ?? '#94A3B8'
          const isOpen  = expanded === c.id
          return (
            <div key={c.id} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-900/60 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : c.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                      {c.type}
                    </span>
                    {c.pendingReview && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                        Pending Review
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white">{c.title}</p>
                </div>
                <div className="text-right w-24 shrink-0 hidden sm:block">
                  <p className="text-xs text-[var(--os-text-2)]">Version</p>
                  <p className="text-sm font-mono text-[var(--os-text-1)]">{c.approvedVersion}</p>
                </div>
                <div className="text-right w-28 shrink-0 hidden md:block">
                  <p className="text-xs text-[var(--os-text-2)]">Last Updated</p>
                  <p className="text-xs text-[var(--os-text-1)]">{c.lastUpdated}</p>
                </div>
                <div className="text-right w-20 shrink-0">
                  <p className="text-xs text-[var(--os-text-2)]">Used in</p>
                  <p className="text-sm font-semibold text-white">{c.usageCount}</p>
                </div>
                <span className="text-[var(--os-text-2)] text-lg ml-1">{isOpen ? '↑' : '↓'}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-white/5">
                  <div className="mt-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <p className="text-xs text-[var(--os-text-2)] mb-1 font-medium uppercase tracking-wider">Approved Clause Text — {c.approvedVersion}</p>
                    <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{c.text}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
