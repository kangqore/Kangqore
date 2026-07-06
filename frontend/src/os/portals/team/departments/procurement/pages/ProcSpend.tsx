import { Sparkles } from 'lucide-react'
import { ChartBar } from '@phosphor-icons/react'

const ACCENT = '#7C3AED'

const CATEGORIES = [
  { name: 'IT & Cloud',              value: 284, color: '#7C3AED' },
  { name: 'Professional Services',   value: 192, color: '#A78BFA' },
  { name: 'SaaS Licences',           value: 143, color: '#6366F1' },
  { name: 'Facilities',              value: 96,  color: '#8B5CF6' },
  { name: 'Marketing & Events',      value: 78,  color: '#C084FC' },
]

const total = CATEGORIES.reduce((acc, c) => acc + c.value, 0)

const STATS = [
  { label: 'Total YTD Spend',   value: `£${total}k`,          color: ACCENT },
  { label: 'Budget Utilised',   value: '67%',                  color: '#F59E0B' },
  { label: 'Savings Achieved',  value: '£124k',                color: '#10B981' },
  { label: 'Vendor Count',      value: '47',                   color: '#6366F1' },
]

export function ProcSpend() {
  const maxVal = Math.max(...CATEGORIES.map(c => c.value))

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ChartBar size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Spend Analysis</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">YTD procurement spend by category with savings tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          IT &amp; Cloud at £284k YTD is 36% of total spend — the AWS invoice dispute could yield a £12k saving if resolved
          in Kangqore's favour. Professional Services at £192k is growing fastest QoQ; ensure all engagements have signed
          SOWs. £124k savings achieved this year — primarily from the SaaS consolidation programme. Budget utilisation at
          67% with 6 months remaining suggests Q3 spend acceleration will be required to avoid budget reversion.
        </p>
      </div>

      {/* Spend bar chart */}
      <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-5">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Spend by Category (£k YTD)</h2>
        {CATEGORIES.map(c => (
          <div key={c.name} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--os-text-1)] font-medium">{c.name}</span>
              <span className="font-bold" style={{ color: c.color }}>£{c.value}k</span>
            </div>
            <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(c.value / maxVal) * 100}%`, backgroundColor: c.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
