import { BarChart3, TrendingUp, DollarSign, Target, Zap } from 'lucide-react'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'

const MONTHLY_MRR = [
  { month: 'Jan', mrr: 28000 }, { month: 'Feb', mrr: 31500 }, { month: 'Mar', mrr: 35200 },
  { month: 'Apr', mrr: 42500 }, { month: 'May', mrr: 48500 },
]

const PIPELINE_STAGES = [
  { stage: 'New',         count: 2, value: 175000  },
  { stage: 'Qualified',   count: 4, value: 458000  },
  { stage: 'Proposal',    count: 3, value: 455000  },
  { stage: 'Negotiation', count: 2, value: 515000  },
]

const MODULE_HEALTH = [
  { module: 'Strategy',    status: 'healthy',  score: 92, trend: 'up'      },
  { module: 'Projects',    status: 'healthy',  score: 88, trend: 'up'      },
  { module: 'Resources',   status: 'warning',  score: 74, trend: 'down'    },
  { module: 'Finance',     status: 'healthy',  score: 85, trend: 'neutral' },
  { module: 'Clients',     status: 'healthy',  score: 91, trend: 'up'      },
  { module: 'Partners',    status: 'healthy',  score: 83, trend: 'neutral' },
  { module: 'Leads',       status: 'healthy',  score: 87, trend: 'up'      },
  { module: 'Marketing',   status: 'warning',  score: 71, trend: 'down'    },
]

const KEY_METRICS = [
  { label: 'MRR',           value: '£48.5k',  change: '+14%',  up: true  },
  { label: 'ARR',           value: '£582k',   change: '+14%',  up: true  },
  { label: 'NRR',           value: '118%',    change: '+6pts', up: true  },
  { label: 'Customers',     value: '23',      change: '+2',    up: true  },
  { label: 'Pipeline',      value: '£1.43M',  change: '+18%',  up: true  },
  { label: 'Runway',        value: '16 mo',   change: '-2 mo', up: false },
  { label: 'Headcount',     value: '12 FTE',  change: '+1',    up: true  },
  { label: 'Open Roles',    value: '3',       change: 'active',up: true  },
]

const maxMRR = Math.max(...MONTHLY_MRR.map(m => m.mrr))

export function AnalyticsOverview() {
  return (
    <div className="space-y-8">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MRR"      value="£48.5k" icon={<DollarSign className="w-5 h-5" />} changeLabel="+14% MoM" change={14} />
        <StatCard label="NRR"      value="118%"   icon={<TrendingUp className="w-5 h-5" />} changeLabel="Net Revenue Retention" change={6} />
        <StatCard label="Pipeline" value="£1.43M" icon={<Target    className="w-5 h-5" />} changeLabel="Active opportunities" change={18} />
        <StatCard label="Runway"   value="16 mo"  icon={<Zap       className="w-5 h-5" />} changeLabel="£920k cash" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              MRR Growth
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-3 h-40">
              {MONTHLY_MRR.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-700">
                    £{(m.mrr / 1000).toFixed(0)}k
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all ${i === MONTHLY_MRR.length - 1 ? 'bg-blue-500' : 'bg-blue-200'}`}
                    style={{ height: `${(m.mrr / maxMRR) * 120}px` }}
                  />
                  <span className="text-xs text-slate-500">{m.month}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Pipeline funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {PIPELINE_STAGES.map((s, i) => {
              const pct = (s.value / 1603000) * 100
              return (
                <div key={s.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">{s.stage}</span>
                    <span className="text-slate-500">{s.count} · £{(s.value / 1000).toFixed(0)}k</span>
                  </div>
                  <Progress
                    value={pct}
                    color={i === 0 ? 'brand' : i === 1 ? 'info' : i === 2 ? 'warning' : 'success'}
                    size="sm"
                  />
                </div>
              )
            })}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-900">Total Pipeline</span>
                <span className="text-blue-600">£1.43M</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Full KPI table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {KEY_METRICS.map(m => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{m.label}</p>
            <p className="text-xl font-bold text-slate-900">{m.value}</p>
            <p className={`text-xs font-medium mt-1 ${m.up ? 'text-green-600' : 'text-red-500'}`}>
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* Module health */}
      <Card>
        <CardHeader>
          <CardTitle>Module Health Index</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {MODULE_HEALTH.map(m => (
              <div key={m.module} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-sm font-medium text-slate-900 w-28">{m.module}</span>
                <div className="flex-1">
                  <Progress
                    value={m.score}
                    color={m.score >= 85 ? 'success' : m.score >= 70 ? 'warning' : 'danger'}
                    size="sm"
                  />
                </div>
                <span className={`text-sm font-bold w-10 text-right ${
                  m.score >= 85 ? 'text-green-600' : m.score >= 70 ? 'text-orange-600' : 'text-red-600'
                }`}>{m.score}</span>
                <Badge
                  variant={m.status === 'healthy' ? 'success' : 'warning'}
                  size="sm" dot
                >
                  {m.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
