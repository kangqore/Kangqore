import { PieChart, Shield, Users } from 'lucide-react'
import { Avatar } from '@design-system/components/Avatar'
import { useInvestorsStore } from '../store'

function SkeletonTableRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-slate-700"/><div className="h-3 w-24 rounded bg-slate-700"/></div></td>
      <td className="px-4 py-3.5"><div className="h-5 w-16 rounded-full bg-slate-700"/></td>
      <td className="px-4 py-3.5 text-right"><div className="h-3 w-12 rounded bg-slate-700 ml-auto"/></td>
      <td className="px-4 py-3.5 text-right"><div className="h-3 w-10 rounded bg-slate-700 ml-auto"/></td>
      <td className="px-4 py-3.5"><div className="h-5 w-12 rounded-full bg-slate-700"/></td>
    </tr>
  )
}

const ROUND_LABEL: Record<string, string> = {
  'pre-seed': 'Pre-Seed', seed: 'Seed', 'series-a': 'Series A',
  'series-b': 'Series B', growth: 'Growth', bridge: 'Bridge',
}

// Monday.com accent palette for ownership donut
const OWNERSHIP_COLORS = [
  '#579bfc', '#00c875', '#fdab3d', '#7c3aed', '#e2445c', '#14b8a6', '#f97316',
]

const ROUND_COLOR: Record<string, string> = {
  'pre-seed': '#7c3aed', seed: '#579bfc', 'series-a': '#00c875',
  'series-b': '#fdab3d', growth: '#e2445c', bridge: '#9aa0b0',
}

export function CapTablePage() {
  const { capTable, investors, isLoading } = useInvestorsStore()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="os-card p-5 h-20 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="os-card p-5 h-64 animate-pulse" />
          <div className="os-card lg:col-span-2 overflow-hidden animate-pulse">
            <table className="w-full">
              <tbody className="divide-y divide-[var(--os-border)]">
                {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  if (capTable.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <PieChart className="w-12 h-12 text-[var(--os-text-2)]" />
        <p className="text-[var(--os-text-2)] font-medium">No cap table entries</p>
        <p className="text-[var(--os-text-2)] text-sm">Cap table data will appear here once populated.</p>
      </div>
    )
  }

  const totalShares        = 100
  const sorted             = [...capTable].sort((a, b) => b.ownership - a.ownership)
  const externalOwnership  = capTable
    .filter(ct => !['founders', 'esop'].includes(ct.investorId))
    .reduce((s, ct) => s + ct.ownership, 0)
  const founderOwnership   = capTable.find(c => c.investorId === 'founders')?.ownership ?? 0
  const esopOwnership      = capTable.find(c => c.investorId === 'esop')?.ownership ?? 0
  const committedInvestors = investors.filter(i => i.status === 'committed').length

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Founder Ownership', value: `${founderOwnership}%`,            icon: Users,    accent: '#579bfc' },
          { label: 'External Investors', value: `${externalOwnership.toFixed(1)}%`, icon: PieChart, accent: '#7c3aed' },
          { label: 'ESOP Pool',          value: `${esopOwnership}%`,               icon: Shield,   accent: '#00c875' },
          { label: 'Investor Count',     value: committedInvestors,                 icon: Users,    accent: '#fdab3d' },
        ].map(item => (
          <div key={item.label} className="os-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.accent}18` }}>
              <item.icon className="w-5 h-5" style={{ color: item.accent }} />
            </div>
            <div>
              <p className="text-3xl font-black text-[var(--os-text-1)]">{item.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ownership breakdown visual */}
        <div className="os-card p-5">
          <h3 className="font-semibold text-[var(--os-text-1)] mb-4">Ownership Breakdown</h3>
          <div className="space-y-3">
            {sorted.map((ct, idx) => (
              <div key={ct.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: OWNERSHIP_COLORS[idx % OWNERSHIP_COLORS.length] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--os-text-1)] truncate">{ct.investorName}</p>
                  <p className="text-xs text-[var(--os-text-2)]">{ct.shareClass}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[var(--os-text-1)]">{ct.ownership}%</p>
                </div>
              </div>
            ))}
          </div>
          {/* Stacked bar */}
          <div className="mt-4 flex h-4 rounded-full overflow-hidden gap-0.5">
            {sorted.map((ct, idx) => (
              <div
                key={ct.id}
                className="h-full transition-all"
                style={{ width: `${(ct.ownership / totalShares) * 100}%`, backgroundColor: OWNERSHIP_COLORS[idx % OWNERSHIP_COLORS.length] }}
                title={`${ct.investorName}: ${ct.ownership}%`}
              />
            ))}
          </div>
        </div>

        {/* Full cap table */}
        <div className="os-card lg:col-span-2 overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-[var(--os-border)]">
            <h3 className="font-semibold text-[var(--os-text-1)]">Cap Table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--os-border)] bg-[var(--os-surface-0)]">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Shareholder</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Round</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Invested</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Ownership</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Rights</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((ct, idx) => {
                  const isFounder = ct.investorId === 'founders'
                  const rc = ROUND_COLOR[ct.round] ?? '#9aa0b0'
                  return (
                    <tr
                      key={ct.id}
                      className="border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] transition-colors"
                      style={isFounder ? { background: '#579bfc08' } : {}}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: OWNERSHIP_COLORS[idx % OWNERSHIP_COLORS.length] }} />
                          {!['founders', 'esop'].includes(ct.investorId) ? (
                            <Avatar name={ct.investorName} size="xs" />
                          ) : (
                            <div className="w-5 h-5" />
                          )}
                          <div>
                            <p className="font-semibold text-[var(--os-text-1)]">{ct.investorName}</p>
                            <p className="text-xs text-[var(--os-text-2)]">{ct.firm}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${rc}20`, color: rc }}>
                          {ROUND_LABEL[ct.round] ?? ct.round}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium text-[var(--os-text-1)]">
                        {ct.amount > 0 ? `₹${ct.amount}k` : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-black text-[var(--os-text-1)]">{ct.ownership}%</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5 flex-wrap">
                          {ct.boardSeat && <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#579bfc20', color: '#579bfc' }}>Board</span>}
                          {ct.proRataRights && <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#00c87520', color: '#00c875' }}>Pro-Rata</span>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--os-border)] bg-[var(--os-surface-0)]">
                  <td className="px-5 py-3 font-black text-[var(--os-text-1)]" colSpan={2}>Total</td>
                  <td className="px-4 py-3 text-right font-black text-[var(--os-text-1)]">
                    ₹{capTable.filter(c => c.amount > 0).reduce((s, c) => s + c.amount, 0)}k
                  </td>
                  <td className="px-4 py-3 text-right font-black text-[var(--os-text-1)]">100%</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
