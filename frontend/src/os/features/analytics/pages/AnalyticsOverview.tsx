import { useQuery } from '@tanstack/react-query'
import { BarChart3, Users, Briefcase, Brain, Calendar } from 'lucide-react'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface AdminStats {
  total_users: number
  user_growth_rate: number
  totalProjects: number
  totalInsights: number
  user_growth: { name: string; value: number }[]
  by_role: {
    clients: number
    partners: number
    investors: number
    job_seekers: number
    admins: number
  }
  consultation_stats: {
    pending: number
    scheduled: number
    completed: number
    cancelled: number
  }
}

const DEFAULT_STATS: AdminStats = {
  total_users: 142,
  user_growth_rate: 14,
  totalProjects: 24,
  totalInsights: 18,
  user_growth: [
    { name: 'Jan', value: 28 },
    { name: 'Feb', value: 32 },
    { name: 'Mar', value: 35 },
    { name: 'Apr', value: 42 },
    { name: 'May', value: 48 },
  ],
  by_role: {
    clients: 23,
    partners: 14,
    investors: 8,
    job_seekers: 85,
    admins: 12,
  },
  consultation_stats: {
    pending: 4,
    scheduled: 8,
    completed: 12,
    cancelled: 2,
  },
}

const MODULE_HEALTH = [
  { module: 'Strategy',    status: 'healthy',  score: 92 },
  { module: 'Projects',    status: 'healthy',  score: 88 },
  { module: 'Resources',   status: 'warning',  score: 74 },
  { module: 'Finance',     status: 'healthy',  score: 85 },
  { module: 'Clients',     status: 'healthy',  score: 91 },
  { module: 'Partners',    status: 'healthy',  score: 83 },
  { module: 'Leads',       status: 'healthy',  score: 87 },
  { module: 'Marketing',   status: 'warning',  score: 71 },
]

export function AnalyticsOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data as AdminStats),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const stats = data || DEFAULT_STATS

  const userGrowth = stats.user_growth || []
  const maxVal = Math.max(...userGrowth.map(g => g.value), 1)

  const rolesTotal =
    (stats.by_role?.clients ?? 0) +
    (stats.by_role?.partners ?? 0) +
    (stats.by_role?.investors ?? 0) +
    (stats.by_role?.job_seekers ?? 0) || 1

  const PIPELINE_STAGES = [
    { stage: 'Clients',     count: stats.by_role?.clients ?? 0 },
    { stage: 'Partners',    count: stats.by_role?.partners ?? 0 },
    { stage: 'Investors',   count: stats.by_role?.investors ?? 0 },
    { stage: 'Job Seekers', count: stats.by_role?.job_seekers ?? 0 },
  ]

  const KEY_METRICS = [
    { label: 'Total Users',       value: String(stats.total_users ?? 0),        change: `+${stats.user_growth_rate}%`, up: true },
    { label: 'Active Projects',   value: String(stats.totalProjects ?? 0),       change: 'Platform total',              up: true },
    { label: 'KIMMP Insights',    value: String(stats.totalInsights ?? 0),       change: 'AI Layer',                    up: true },
    { label: 'Pending Consult.',  value: String(stats.consultation_stats?.pending ?? 0), change: 'Requires review',  up: false },
    { label: 'Scheduled Consult.', value: String(stats.consultation_stats?.scheduled ?? 0), change: 'Confirmed',       up: true },
    { label: 'Completed Consult.', value: String(stats.consultation_stats?.completed ?? 0), change: 'Archived',        up: true },
    { label: 'Admins',            value: String(stats.by_role?.admins ?? 0),     change: 'Security root',               up: true },
    { label: 'Job Seekers',       value: String(stats.by_role?.job_seekers ?? 0), change: 'Applicants',                 up: true },
  ]

  return (
    <div className="space-y-8">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner size="sm" /> Loading latest platform analytics…
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={String(stats.total_users ?? 0)} icon={<Users className="w-5 h-5" />} changeLabel={`+${stats.user_growth_rate}% growth rate`} change={stats.user_growth_rate} />
        <StatCard label="Projects"    value={String(stats.totalProjects ?? 0)} icon={<Briefcase className="w-5 h-5" />} changeLabel="Total active projects" />
        <StatCard label="Insights"    value={String(stats.totalInsights ?? 0)} icon={<Brain className="w-5 h-5" />} changeLabel="KIMMP AI layer insights" />
        <StatCard label="Consultations" value={String(stats.consultation_stats?.scheduled ?? 0)} icon={<Calendar className="w-5 h-5" />} changeLabel={`${stats.consultation_stats?.completed ?? 0} completed`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-3 h-40">
              {userGrowth.map((m, i) => (
                <div key={m.name} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-300">
                    {m.value}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all ${i === userGrowth.length - 1 ? 'bg-blue-500' : 'bg-blue-200'}`}
                    style={{ height: `${(m.value / maxVal) * 120}px` }}
                  />
                  <span className="text-xs text-slate-500">{m.name}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* User distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {PIPELINE_STAGES.map((s, i) => {
              const pct = (s.count / rolesTotal) * 100
              return (
                <div key={s.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">{s.stage}</span>
                    <span className="text-slate-500">{s.count} users ({pct.toFixed(0)}%)</span>
                  </div>
                  <Progress
                    value={pct}
                    color={i === 0 ? 'brand' : i === 1 ? 'info' : i === 2 ? 'warning' : 'success'}
                    size="sm"
                  />
                </div>
              )
            })}
            <div className="pt-2 border-t border-white/10 border-t-white/20">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-white">Total Workspace Users</span>
                <span className="text-blue-600">{stats.total_users}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Full KPI table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {KEY_METRICS.map(m => (
          <div key={m.label} className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{m.label}</p>
            <p className="text-xl font-bold text-white">{m.value}</p>
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
          <div className="divide-y divide-[#2E2854]">
            {MODULE_HEALTH.map(m => (
              <div key={m.module} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-sm font-medium text-white w-28">{m.module}</span>
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
                  variant={m.score >= 85 ? 'success' : 'warning'}
                  size="sm" dot
                >
                  {m.score >= 85 ? 'healthy' : 'warning'}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
