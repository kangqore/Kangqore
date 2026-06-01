import { TrendingUp, DollarSign, PieChart, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { useInvestorsStore } from '@features/investors/store'
import { useAuthStore } from '@store/auth'

const MONTHLY_MRR = [
  { month: 'Jan', mrr: 28000 }, { month: 'Feb', mrr: 31500 },
  { month: 'Mar', mrr: 35200 }, { month: 'Apr', mrr: 42500 },
  { month: 'May', mrr: 48500 },
]
const maxMRR = Math.max(...MONTHLY_MRR.map(m => m.mrr))

export function InvestorHome() {
  const { user } = useAuthStore()
  const { investors, rounds, updates } = useInvestorsStore()

  const myInvestor  = investors.find(i => i.status === 'committed') ?? investors[0]
  const activeRound = rounds.find(r => r.status === 'open')
  const latestUpdate = updates[0]
  const m = latestUpdate.metrics

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Welcome back, {user?.name ?? myInvestor.name}</h2>
        <p className="text-sm text-slate-500 mt-1">Kangqore company overview — as of {latestUpdate.period}.</p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'MRR',          value: `£${(m.mrr / 1000).toFixed(1)}k`,     sub: `+${m.mrrGrowth}% MoM`,       color: 'bg-blue-50 text-blue-600'   },
          { label: 'ARR',          value: `£${(m.arr / 1000).toFixed(0)}k`,     sub: 'Annualised',                  color: 'bg-green-50 text-green-600' },
          { label: 'NRR',          value: `${m.nrr}%`,                           sub: 'Net Revenue Retention',       color: 'bg-purple-50 text-purple-600'},
          { label: 'Runway',       value: `${m.runway} mo`,                      sub: `£${m.cashOnHand}k cash`,      color: 'bg-orange-50 text-orange-600'},
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color.split(' ')[1]}`}>
            <p className="text-xs font-medium text-slate-600 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              MRR Growth
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-3 h-36">
              {MONTHLY_MRR.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-700">£{(m.mrr / 1000).toFixed(0)}k</span>
                  <div
                    className={`w-full rounded-t-lg ${i === MONTHLY_MRR.length - 1 ? 'bg-blue-500' : 'bg-blue-200'}`}
                    style={{ height: `${(m.mrr / maxMRR) * 110}px` }}
                  />
                  <span className="text-xs text-slate-500">{m.month}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* My position */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              Your Position
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Committed',  value: `£${myInvestor.committed}k` },
                { label: 'Ownership', value: `${myInvestor.ownership ?? '—'}%` },
                { label: 'Round',     value: 'Seed' },
                { label: 'Share class', value: 'Series A Preferred' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              Pro-rata rights on next round ✓
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Highlights from latest update */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Latest Update Highlights</CardTitle>
              <Badge variant="info" size="sm">{latestUpdate.period}</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {latestUpdate.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{h}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Active fundraise */}
        {activeRound && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                {activeRound.name}
                <Badge variant="success" size="sm" dot className="ml-auto">Open</Badge>
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600">Target</span>
                  <span className="font-semibold">£{(activeRound.targetAmount / 1000).toFixed(1)}M</span>
                </div>
                <Progress value={Math.round((activeRound.raisedAmount / activeRound.targetAmount) * 100)} color="brand" size="md" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Post-Money Val.</p>
                  <p className="font-bold text-slate-900">£{(activeRound.valuation / 1000).toFixed(1)}M</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Lead Investor</p>
                  <p className="font-bold text-slate-900">TechForward</p>
                </div>
              </div>
              <a href="#" className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800">
                <ArrowUpRight className="w-3.5 h-3.5" />
                View Series A deck
              </a>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
