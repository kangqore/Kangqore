import { Sparkles } from 'lucide-react'
import { FileText } from '@phosphor-icons/react'

const ACCENT = '#B91C1C'

type PolicyStatus = 'Current' | 'Overdue' | 'Draft'

interface Policy {
  name:        string
  category:    string
  owner:       string
  lastReviewed: string
  nextReview:  string
  status:      PolicyStatus
}

const POLICIES: Policy[] = [
  { name: 'Information Security Policy',          category: 'Security',    owner: 'Maya Nair',   lastReviewed: '2026-01-15', nextReview: '2027-01-15', status: 'Current' },
  { name: 'Data Protection & Privacy Policy',     category: 'Privacy',     owner: 'Arjun Singh', lastReviewed: '2025-11-01', nextReview: '2026-05-01', status: 'Overdue' },
  { name: 'Acceptable Use Policy',                category: 'Security',    owner: 'Maya Nair',   lastReviewed: '2026-02-10', nextReview: '2027-02-10', status: 'Current' },
  { name: 'Vendor Management Policy',             category: 'Procurement', owner: 'Arjun Singh', lastReviewed: '2025-10-20', nextReview: '2026-04-20', status: 'Overdue' },
  { name: 'Business Continuity Policy',           category: 'Resilience',  owner: 'Maya Nair',   lastReviewed: '2026-03-01', nextReview: '2027-03-01', status: 'Current' },
  { name: 'Incident Response Policy',             category: 'Security',    owner: 'Maya Nair',   lastReviewed: '2026-04-14', nextReview: '2027-04-14', status: 'Current' },
  { name: 'DPDP Compliance Policy',               category: 'Privacy',     owner: 'Arjun Singh', lastReviewed: 'N/A',        nextReview: '2026-08-01', status: 'Draft' },
  { name: 'AI Governance Policy',                 category: 'AI',          owner: 'Arjun Singh', lastReviewed: 'N/A',        nextReview: '2026-07-01', status: 'Draft' },
]

const STATUS_COLOR: Record<PolicyStatus, string> = {
  Current: '#10B981',
  Overdue: '#EF4444',
  Draft:   '#F59E0B',
}

export function RCPolicies() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <FileText size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Policy Library</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Governance policy register with review cycles and ownership.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Policies', value: String(POLICIES.length),                                         color: ACCENT },
          { label: 'Current',        value: String(POLICIES.filter(p => p.status === 'Current').length),  color: '#10B981' },
          { label: 'Overdue Review', value: String(POLICIES.filter(p => p.status === 'Overdue').length),  color: '#EF4444' },
          { label: 'Draft',          value: String(POLICIES.filter(p => p.status === 'Draft').length),    color: '#F59E0B' },
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
          Data Protection Policy overdue by 54 days — this is a documented evidence gap for GDPR Article 24 accountability.
          Vendor Management Policy overdue by 65 days and blocks ISO 27001 A.15 compliance. Prioritise both for July review.
          DPDP and AI Governance drafts should be co-authored given their overlapping data handling scope.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Policy Name', 'Category', 'Owner', 'Last Reviewed', 'Next Review', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {POLICIES.map(p => {
                const sc = STATUS_COLOR[p.status]
                return (
                  <tr key={p.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.category}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.lastReviewed}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.nextReview}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{p.status}</span>
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
