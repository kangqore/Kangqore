import { Megaphone, TrendingUp, Users, DollarSign, Target, BookOpen } from 'lucide-react'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { useMarketingStore } from '../store'

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  active: 'success', scheduled: 'info', completed: 'neutral', draft: 'neutral', paused: 'warning',
}

const CHANNEL_ICON: Record<string, string> = {
  linkedin: 'in', email: '✉', 'paid-search': 'G', content: '📝', event: '🎤', partner: '🤝', outbound: '📞',
}

const CONTENT_STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  published: 'success', scheduled: 'info', review: 'warning', draft: 'neutral',
}

export function MarketingOverview() {
  const { campaigns, content, metrics, totalSpend, totalMQLs, totalRevenue, avgCPL } = useMarketingStore()
  const latestMetrics = metrics[metrics.length - 1]
  const activeCampaigns = campaigns.filter(c => c.status === 'active')

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="YTD Spend"            value={`₹${(totalSpend() / 1000).toFixed(1)}k`}      icon={<DollarSign  className="w-5 h-5" />} changeLabel={`${activeCampaigns.length} active campaigns`} />
        <StatCard label="MQLs Generated"      value={totalMQLs()}                                  icon={<Users       className="w-5 h-5" />} changeLabel={`${latestMetrics.conversionRate}% CVR`} />
        <StatCard label="Pipeline Attributed" value={`₹${(totalRevenue() / 1000).toFixed(0)}k`}    icon={<TrendingUp  className="w-5 h-5" />} changeLabel="From marketing activity" />
        <StatCard label="Avg CPL"             value={`₹${avgCPL()}`}                               icon={<Target      className="w-5 h-5" />} changeLabel="Cost per lead" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaigns */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-500" />
                Campaigns
              </CardTitle>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[#2E2854]">
              {campaigns.map(c => {
                const budgetPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0
                return (
                  <div key={c.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{CHANNEL_ICON[c.channel] ?? '📣'}</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.owner}</p>
                        </div>
                      </div>
                      <Badge variant={STATUS_BADGE[c.status]} size="sm" dot>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </Badge>
                    </div>
                    {c.status !== 'scheduled' && c.budget > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Budget: ₹{c.budget.toLocaleString()}</span>
                          <span>₹{c.spent.toLocaleString()} ({budgetPct}%)</span>
                        </div>
                        <Progress value={Math.min(budgetPct, 100)} size="sm" color={budgetPct > 90 ? 'warning' : 'brand'} />
                      </div>
                    )}
                    {c.status !== 'scheduled' && (
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span><span className="font-semibold text-slate-200">{c.leads}</span> leads</span>
                        <span><span className="font-semibold text-slate-200">{c.mqls}</span> MQLs</span>
                        <span><span className="font-semibold text-slate-200">{c.sqls}</span> SQLs</span>
                        {c.revenue > 0 && (
                          <span className="text-green-600 font-semibold">₹{(c.revenue / 1000).toFixed(0)}k pipeline</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>

        {/* Monthly performance */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {metrics.map(m => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-20 flex-shrink-0">{m.month}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-os-s1 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all"
                          style={{ width: `${Math.min((m.mqls / 25) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-300 w-16 text-right">{m.mqls} MQLs</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 w-16 text-right flex-shrink-0">₹{m.spend.toLocaleString()}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                Content
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-[#2E2854]">
                {content.slice(0, 5).map(cp => (
                  <div key={cp.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{cp.title}</p>
                      <p className="text-xs text-slate-500">{cp.author} · {cp.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge variant={CONTENT_STATUS_BADGE[cp.status]} size="sm">{cp.status}</Badge>
                      {cp.views > 0 && <p className="text-xs text-slate-500 mt-0.5">{cp.views.toLocaleString()} views</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
