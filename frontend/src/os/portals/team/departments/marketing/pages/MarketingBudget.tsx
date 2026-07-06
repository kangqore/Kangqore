import { BarChart2, Sparkles } from 'lucide-react'

const TOTAL    = 480000
const SPENT    = 198400
const PCT      = ((SPENT / TOTAL) * 100).toFixed(1)

const LINES = [
  { category: 'Digital Ads',              budget: 120000, spent: 52000 },
  { category: 'Events & Sponsorships',    budget: 80000,  spent: 34000 },
  { category: 'Content Production',       budget: 60000,  spent: 28000 },
  { category: 'SEO & Tools',              budget: 40000,  spent: 18000 },
  { category: 'PR & Comms',              budget: 50000,  spent: 22000 },
  { category: 'Design & Creative',        budget: 70000,  spent: 32000 },
  { category: 'Headcount (contractors)',  budget: 60000,  spent: 12400 },
]

function fmt(n: number) {
  return `£${(n / 1000).toFixed(0)}k`
}

export function MarketingBudget() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart2 className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Budget</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Marketing budget tracker with YTD spend by category.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
          <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">Total Budget</p>
          <p className="text-2xl font-bold mt-2" style={{ color: '#EC4899' }}>£480k</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
          <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">Spent YTD</p>
          <p className="text-2xl font-bold mt-2" style={{ color: '#F59E0B' }}>£198.4k</p>
        </div>
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
          <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">% Utilised</p>
          <p className="text-2xl font-bold mt-2" style={{ color: '#10B981' }}>{PCT}%</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <div className="flex justify-between text-xs text-[var(--os-text-2)]">
          <span>YTD Spend</span>
          <span>£{(SPENT / 1000).toFixed(1)}k of £{(TOTAL / 1000).toFixed(0)}k</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${PCT}%`, backgroundColor: '#EC4899' }} />
        </div>
      </div>

      {/* Budget breakdown table */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Budget Breakdown</h2>
        <div className="space-y-3">
          {LINES.map(l => {
            const linePct = (l.spent / l.budget) * 100
            const remaining = l.budget - l.spent
            return (
              <div key={l.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--os-text-1)]">{l.category}</span>
                  <div className="flex items-center gap-3 text-xs text-[var(--os-text-2)]">
                    <span className="font-medium text-white">{fmt(l.spent)}</span>
                    <span>/ {fmt(l.budget)}</span>
                    <span className="text-[var(--os-text-2)]">({fmt(remaining)} left)</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${linePct}%`,
                      backgroundColor: linePct > 80 ? '#EF4444' : linePct > 60 ? '#F59E0B' : '#EC4899',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* KIMMP insight */}
      <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">KIMMP Insight</span>
        </div>
        <p className="text-sm text-[var(--os-text-1)] leading-relaxed">
          Digital Ads ROI is 4.2x — budget reallocation from Events (+£20k) to Digital would yield an estimated +31 MQLs based on current cost-per-lead of £645.
        </p>
      </div>
    </div>
  )
}
