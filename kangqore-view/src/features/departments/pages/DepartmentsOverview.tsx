import { Building2, Users, DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { StaggerList, StaggerItem } from '@components/animations/Stagger'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { useDepartmentsStore } from '../store'

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  active: 'success', scaling: 'info', restructuring: 'warning', new: 'neutral',
}

const BUDGET_COLOR: Record<string, string> = {
  'on-track': 'text-green-600', 'over': 'text-red-600', 'under': 'text-blue-600', 'at-risk': 'text-orange-600',
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up')      return <TrendingUp   className="w-3.5 h-3.5 text-green-500" />
  if (trend === 'down')    return <TrendingDown className="w-3.5 h-3.5 text-red-500"   />
  return                          <Minus        className="w-3.5 h-3.5 text-slate-400" />
}

export function DepartmentsOverview() {
  const { departments, totalHeadcount, totalBudget, totalSpent } = useDepartmentsStore()
  const openRoles = departments.reduce((s, d) => s + d.openRoles, 0)
  const spentPct  = Math.round((totalSpent() / (totalBudget() / 2)) * 100) // H1 spend vs H1 budget

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Headcount" value={totalHeadcount()}                              icon={<Users      className="w-5 h-5" />} changeLabel={`${openRoles} open roles`} />
        <StatCard label="Total Budget"    value={`£${(totalBudget() / 1000).toFixed(1)}M`}      icon={<DollarSign className="w-5 h-5" />} changeLabel="Annual allocation" />
        <StatCard label="YTD Spend"       value={`£${totalSpent()}k`}                           icon={<TrendingUp className="w-5 h-5" />} changeLabel={`${spentPct}% of H1 budget`} />
        <StatCard label="Departments"     value={departments.length}                             icon={<Building2  className="w-5 h-5" />} changeLabel={`${departments.filter(d => d.status === 'scaling').length} scaling`} />
      </div>

      <StaggerList className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map(dept => {
          const budgetPct = Math.round((dept.spent / (dept.budget * 0.5)) * 100)
          return (
            <StaggerItem key={dept.id}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle>{dept.name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-0.5">{dept.costCenter}</p>
                    </div>
                  </div>
                  <Badge variant={STATUS_BADGE[dept.status]} size="sm" dot>
                    {dept.status.charAt(0).toUpperCase() + dept.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Head */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Avatar name={dept.head} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{dept.head}</p>
                    <p className="text-xs text-slate-500">{dept.headTitle}</p>
                  </div>
                  <div className="ml-auto flex gap-3 text-center">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{dept.headcount}</p>
                      <p className="text-xs text-slate-500">FTE</p>
                    </div>
                    {dept.openRoles > 0 && (
                      <div>
                        <p className="text-sm font-bold text-orange-600">{dept.openRoles}</p>
                        <p className="text-xs text-slate-500">Open</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">H1 Budget Utilisation</span>
                    <span className={`font-semibold ${BUDGET_COLOR[dept.budgetStatus]}`}>
                      £{dept.spent}k / £{Math.round(dept.budget * 0.5)}k
                    </span>
                  </div>
                  <Progress
                    value={Math.min(budgetPct, 100)}
                    color={dept.budgetStatus === 'over' || dept.budgetStatus === 'at-risk' ? 'danger' : 'brand'}
                    size="sm"
                  />
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-2">
                  {dept.kpis.map(kpi => (
                    <div key={kpi.metric} className="bg-slate-50 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-0.5">
                        <TrendIcon trend={kpi.trend} />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{kpi.value}</p>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{kpi.metric}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
            </StaggerItem>
          )
        })}
      </StaggerList>
    </div>
  )
}
