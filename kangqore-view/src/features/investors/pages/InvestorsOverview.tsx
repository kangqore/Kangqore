import { TrendingUp, Users, DollarSign, Target, CheckCircle2, Clock, UserCheck } from 'lucide-react'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Progress } from '@design-system/components/Progress'
import { useInvestorsStore } from '../store'

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  committed: 'success', engaged: 'info', prospect: 'neutral', passed: 'danger', active: 'success',
}

const TYPE_LABEL: Record<string, string> = {
  vc: 'VC', angel: 'Angel', pe: 'PE', 'family-office': 'Family Office',
  corporate: 'Corporate', accelerator: 'Accelerator',
}

export function InvestorsOverview() {
  const { investors, rounds } = useInvestorsStore()

  const committed    = investors.filter(i => i.status === 'committed')
  const engaged      = investors.filter(i => i.status === 'engaged')
  const prospects    = investors.filter(i => i.status === 'prospect')
  const totalRaised  = committed.reduce((s, i) => s + i.committed, 0)
  const activeRound  = rounds.find(r => r.status === 'open')
  const seriesAProgress = activeRound
    ? Math.round((activeRound.raisedAmount / activeRound.targetAmount) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Raised"      value={`£${(totalRaised / 1000).toFixed(1)}M`}                         icon={<DollarSign className="w-5 h-5" />} changeLabel="Seed closed" />
        <StatCard label="Committed"         value={committed.length}                                                 icon={<UserCheck  className="w-5 h-5" />} changeLabel={`${engaged.length} engaged`} />
        <StatCard label="Active Round"      value={activeRound ? `£${(activeRound.targetAmount / 1000).toFixed(1)}M` : '—'} icon={<Target className="w-5 h-5" />} changeLabel={activeRound?.name ?? 'None open'} />
        <StatCard label="Investor Pipeline" value={investors.filter(i => i.status !== 'passed').length}              icon={<Users     className="w-5 h-5" />} changeLabel={`${prospects.length} prospects`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active fundraising round */}
        {activeRound && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                {activeRound.name}
                <Badge variant="info" size="sm" dot className="ml-auto">Open</Badge>
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600">Raised</span>
                  <span className="font-semibold text-slate-900">
                    £{(activeRound.raisedAmount / 1000).toFixed(1)}M / £{(activeRound.targetAmount / 1000).toFixed(1)}M
                  </span>
                </div>
                <Progress value={seriesAProgress} color="brand" size="md" showValue />
              </div>
              <div className="text-sm text-slate-600">
                Post-money valuation: <span className="font-semibold text-slate-900">£{(activeRound.valuation / 1000).toFixed(1)}M</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Use of Funds</p>
                {activeRound.useOfFunds.map(uf => (
                  <div key={uf.category} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">{uf.category}</span>
                    <span className="text-sm font-medium text-slate-900">{uf.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Investor list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Investors & Pipeline</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {investors.map(inv => (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <Avatar name={inv.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{inv.name}</p>
                      {inv.leadInvestor && (
                        <Badge variant="brand" size="sm">Lead</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{inv.firm} · {TYPE_LABEL[inv.type]}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    {inv.committed > 0 ? (
                      <p className="text-sm font-semibold text-slate-900">£{inv.committed}k</p>
                    ) : (
                      <p className="text-sm text-slate-400">—</p>
                    )}
                    <p className="text-xs text-slate-500">
                      £{inv.checkSize.min}k–{inv.checkSize.max > 999
                        ? `${(inv.checkSize.max / 1000).toFixed(0)}M`
                        : `${inv.checkSize.max}k`} range
                    </p>
                  </div>
                  <Badge variant={STATUS_BADGE[inv.status] ?? 'neutral'} size="sm" dot>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Touchpoints</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {investors
              .filter(i => i.status !== 'passed')
              .sort((a, b) => b.lastContact.localeCompare(a.lastContact))
              .slice(0, 6)
              .map(inv => (
                <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {inv.status === 'committed'
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <Clock className="w-4 h-4 text-slate-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{inv.name} — {inv.firm}</p>
                    <p className="text-xs text-slate-500 truncate line-clamp-1">{inv.notes}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">Last: {inv.lastContact}</p>
                    {inv.nextFollowUp && (
                      <p className="text-xs text-blue-600 font-medium">Next: {inv.nextFollowUp}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
