import { PieChart, Shield, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { useInvestorsStore } from '../store'

const ROUND_LABEL: Record<string, string> = {
  'pre-seed': 'Pre-Seed', seed: 'Seed', 'series-a': 'Series A',
  'series-b': 'Series B', growth: 'Growth', bridge: 'Bridge',
}

const OWNERSHIP_COLORS = [
  '#2564ea', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
]

export function CapTablePage() {
  const { capTable, investors } = useInvestorsStore()

  const totalShares = 100
  const sorted = [...capTable].sort((a, b) => b.ownership - a.ownership)
  const externalOwnership = capTable
    .filter(ct => !['founders', 'esop'].includes(ct.investorId))
    .reduce((s, ct) => s + ct.ownership, 0)

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Founder Ownership', value: `${capTable.find(c => c.investorId === 'founders')?.ownership ?? 0}%`, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'External Investors', value: `${externalOwnership.toFixed(1)}%`, icon: PieChart, color: 'text-purple-600 bg-purple-50' },
          { label: 'ESOP Pool', value: `${capTable.find(c => c.investorId === 'esop')?.ownership ?? 0}%`, icon: Shield, color: 'text-green-600 bg-green-50' },
          { label: 'Investor Count', value: investors.filter(i => i.status === 'committed').length, icon: Users, color: 'text-orange-600 bg-orange-50' },
        ].map(item => (
          <Card key={item.label} className="flex items-center gap-4 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white">{item.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ownership donut visual */}
        <Card>
          <CardHeader>
            <CardTitle>Ownership Breakdown</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {sorted.map((ct, idx) => (
              <div key={ct.id} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: OWNERSHIP_COLORS[idx % OWNERSHIP_COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{ct.investorName}</p>
                  <p className="text-xs text-slate-500">{ct.shareClass}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{ct.ownership}%</p>
                </div>
              </div>
            ))}
            {/* Visual bar */}
            <div className="mt-4 flex h-4 rounded-full overflow-hidden gap-0.5">
              {sorted.map((ct, idx) => (
                <div
                  key={ct.id}
                  className="h-full transition-all"
                  style={{
                    width: `${(ct.ownership / totalShares) * 100}%`,
                    backgroundColor: OWNERSHIP_COLORS[idx % OWNERSHIP_COLORS.length],
                  }}
                  title={`${ct.investorName}: ${ct.ownership}%`}
                />
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Full cap table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cap Table</CardTitle>
          </CardHeader>
          <CardBody className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 border-t-white/20 bg-slate-900/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Shareholder</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Round</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Invested</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ownership</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E2854]">
                {sorted.map((ct, idx) => (
                  <tr key={ct.id} className="hover:bg-slate-900 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: OWNERSHIP_COLORS[idx % OWNERSHIP_COLORS.length] }}
                        />
                        {!['founders', 'esop'].includes(ct.investorId) ? (
                          <Avatar name={ct.investorName} size="xs" />
                        ) : (
                          <div className="w-5 h-5" />
                        )}
                        <div>
                          <p className="font-medium text-white">{ct.investorName}</p>
                          <p className="text-xs text-slate-500">{ct.firm}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="neutral" size="sm">{ROUND_LABEL[ct.round] ?? ct.round}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-white">
                      {ct.amount > 0 ? `₹${ct.amount}k` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-bold text-white">{ct.ownership}%</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {ct.boardSeat && <Badge variant="info" size="sm">Board</Badge>}
                        {ct.proRataRights && <Badge variant="success" size="sm">Pro-Rata</Badge>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/10 border-t-white/20 bg-slate-900">
                  <td className="px-5 py-3 font-bold text-white" colSpan={2}>Total</td>
                  <td className="px-4 py-3 text-right font-bold text-white">
                    ₹{capTable.filter(c => c.amount > 0).reduce((s, c) => s + c.amount, 0)}k
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">100%</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
