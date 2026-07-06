import { Sparkles } from 'lucide-react'
import { Buildings } from '@phosphor-icons/react'

const ACCENT = '#7C3AED'

type VendorTier = 'Preferred' | 'Approved' | 'Restricted'

interface Vendor {
  name:          string
  category:      string
  contractValue: string
  tier:          VendorTier
  lastReview:    string
}

const VENDORS: Vendor[] = [
  { name: 'AWS',                  category: 'Cloud Infrastructure', contractValue: '£148,000 pa', tier: 'Preferred',  lastReview: '2026-03-15' },
  { name: 'Salesforce',           category: 'CRM',                  contractValue: '£64,000 pa',  tier: 'Preferred',  lastReview: '2026-04-01' },
  { name: 'Slack Technologies',   category: 'Collaboration',        contractValue: '£8,200 pa',   tier: 'Preferred',  lastReview: '2026-01-10' },
  { name: 'Dell Technologies',    category: 'Hardware',             contractValue: '£24,000 pa',  tier: 'Approved',   lastReview: '2026-02-20' },
  { name: 'Datadog',              category: 'Monitoring',           contractValue: '£4,800 pa',   tier: 'Approved',   lastReview: '2026-04-05' },
  { name: 'KnowBe4',              category: 'Security Training',    contractValue: '£3,600 pa',   tier: 'Approved',   lastReview: '2026-06-01' },
  { name: 'Westlaw',              category: 'Legal Research',       contractValue: '£5,400 pa',   tier: 'Approved',   lastReview: '2025-12-10' },
  { name: 'Herman Miller',        category: 'Furniture',            contractValue: '£12,000 pa',  tier: 'Approved',   lastReview: '2025-11-05' },
  { name: 'Legacy Print Co.',     category: 'Print Services',       contractValue: '£1,800 pa',   tier: 'Restricted', lastReview: '2025-08-01' },
]

const TIER_COLOR: Record<VendorTier, string> = {
  Preferred:  '#10B981',
  Approved:   '#6366F1',
  Restricted: '#EF4444',
}

export function ProcVendors() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Buildings size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Vendor Directory</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Approved supplier register with tiers, contract values and review dates.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors',  value: String(VENDORS.length),                                              color: ACCENT },
          { label: 'Preferred',      value: String(VENDORS.filter(v => v.tier === 'Preferred').length),       color: '#10B981' },
          { label: 'Approved',       value: String(VENDORS.filter(v => v.tier === 'Approved').length),        color: '#6366F1' },
          { label: 'Restricted',     value: String(VENDORS.filter(v => v.tier === 'Restricted').length),      color: '#EF4444' },
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
          Legacy Print Co. is Restricted status — any new POs require Director approval. The contract should be put to
          competitive tender at the next renewal. Westlaw and Herman Miller reviews are overdue; schedule before end of July.
          AWS is the highest-value vendor at £148k pa — ensure the commercial review is aligned with the Risk team's annual security assessment.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Vendor', 'Category', 'Contract Value', 'Tier', 'Last Review'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {VENDORS.map(v => {
                const tc = TIER_COLOR[v.tier]
                return (
                  <tr key={v.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{v.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{v.category}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{v.contractValue}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{v.tier}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{v.lastReview}</td>
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
