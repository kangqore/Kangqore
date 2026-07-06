import { Sparkles } from 'lucide-react'
import { Buildings } from '@phosphor-icons/react'

const ACCENT = '#B91C1C'

type RiskTier = 'Critical' | 'High' | 'Med' | 'Low'
type DataAccess = 'Full PII' | 'Operational' | 'Limited' | 'None'

interface Vendor {
  name:        string
  category:    string
  tier:        RiskTier
  lastAssessed: string
  dataAccess:  DataAccess
  nextReview:  string
}

const VENDORS: Vendor[] = [
  { name: 'AWS',           category: 'Cloud Infrastructure', tier: 'Critical', lastAssessed: '2026-03-15', dataAccess: 'Full PII',    nextReview: '2026-09-15' },
  { name: 'Salesforce',    category: 'CRM',                  tier: 'High',     lastAssessed: '2026-04-01', dataAccess: 'Full PII',    nextReview: '2026-10-01' },
  { name: 'NCC Group',     category: 'Security Testing',     tier: 'High',     lastAssessed: '2026-03-20', dataAccess: 'Operational', nextReview: '2027-03-20' },
  { name: 'Slack',         category: 'Collaboration',        tier: 'Med',      lastAssessed: '2026-01-10', dataAccess: 'Operational', nextReview: '2027-01-10' },
  { name: 'HubSpot',       category: 'Marketing Automation', tier: 'Med',      lastAssessed: '2025-12-05', dataAccess: 'Limited',     nextReview: '2026-06-05' },
  { name: 'Zoom',          category: 'Video Conferencing',   tier: 'Low',      lastAssessed: '2025-11-20', dataAccess: 'None',        nextReview: '2026-11-20' },
]

const TIER_COLOR: Record<RiskTier, string> = {
  Critical: '#EF4444',
  High:     '#F97316',
  Med:      '#F59E0B',
  Low:      '#10B981',
}

const ACCESS_COLOR: Record<DataAccess, string> = {
  'Full PII':    '#EF4444',
  'Operational': '#F59E0B',
  'Limited':     '#6366F1',
  'None':        '#6B7280',
}

export function RCVendorRisk() {
  const overdue = VENDORS.filter(v => v.nextReview < '2026-06-24').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Buildings size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Vendor Risk</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Third-party vendor risk tiers, data access levels and review schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors',   value: String(VENDORS.length), color: ACCENT },
          { label: 'Critical Tier',   value: String(VENDORS.filter(v => v.tier === 'Critical').length), color: '#EF4444' },
          { label: 'Full PII Access', value: String(VENDORS.filter(v => v.dataAccess === 'Full PII').length), color: '#F97316' },
          { label: 'Review Overdue',  value: String(overdue), color: overdue > 0 ? '#EF4444' : '#10B981' },
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
          HubSpot review is overdue by 19 days — it holds Limited data access but feeds into marketing automation touching
          prospect PII. AWS and Salesforce hold Full PII — ensure DPAs are current and SCCs are executed for EU data
          transfers. ISO 27001 A.15 requires documented supplier relationship policies; this register satisfies the evidence requirement.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Vendor', 'Category', 'Risk Tier', 'Last Assessed', 'Data Access', 'Next Review'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {VENDORS.map(v => {
                const tc = TIER_COLOR[v.tier]
                const ac = ACCESS_COLOR[v.dataAccess]
                const isOverdue = v.nextReview < '2026-06-24'
                return (
                  <tr key={v.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{v.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{v.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{v.tier}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{v.lastAssessed}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${ac}22`, color: ac }}>{v.dataAccess}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={isOverdue ? 'text-red-400 font-semibold' : 'text-[var(--os-text-2)]'}>{v.nextReview}</span>
                      {isOverdue && <span className="ml-1 text-xs text-red-400">OVERDUE</span>}
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
