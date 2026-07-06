import { CheckSquare, Clock, DollarSign, Star, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Spinner } from '@design-system/components/Spinner'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { usePartnerStats, usePartnerProjects } from '../usePartnerData'
import { isDemo } from '@lib/api'

const ASSIGNED_TASKS = [
  { id: 't1', title: 'Implement Redis caching layer',        project: 'Urban Mobility Co.',   priority: 'high',   due: '2026-06-05', status: 'in-progress', progress: 65  },
  { id: 't2', title: 'WebSocket real-time tracking module',  project: 'Urban Mobility Co.',   priority: 'high',   due: '2026-06-12', status: 'in-progress', progress: 30  },
  { id: 't3', title: 'API gateway load test report',         project: 'GreenSpark Energy',    priority: 'medium', due: '2026-06-08', status: 'pending',     progress: 0   },
  { id: 't4', title: 'Code review — auth middleware PR #44', project: 'Quantum Analytics',    priority: 'low',    due: '2026-06-03', status: 'review',      progress: 90  },
]

const RECENT_ACTIVITY = [
  { title: 'PR #43 merged — tracking dashboard',  date: '2026-05-31', type: 'success' },
  { title: 'Sprint review — Urban Mobility',      date: '2026-05-29', type: 'meeting' },
  { title: 'Payment received — May 2026',         date: '2026-05-28', type: 'payment' },
  { title: 'New task assigned: WebSocket module', date: '2026-05-26', type: 'task'    },
]

const PRIORITY_BADGE: Record<string, 'danger' | 'warning' | 'neutral'> = {
  high: 'danger', medium: 'warning', low: 'neutral',
}
const STATUS_BADGE: Record<string, 'info' | 'warning' | 'success' | 'neutral'> = {
  'in-progress': 'info', pending: 'neutral', review: 'warning', done: 'success',
}

export function PartnerDashboard() {
  const { data: statsData, isLoading: statsLoading } = usePartnerStats()
  const { data: projectsData, isLoading: projectsLoading } = usePartnerProjects()

  const apiStats = statsData?.stats || {
    active_projects: 2,
    completed_projects: 1,
    total_earnings: 22400,
    pending_earnings: 9600,
    rating: 4.8
  }

  const projectsList = (projectsData as any[]) || []

  const tasks = projectsList.length
    ? projectsList.flatMap((p, pi) =>
        ((p.deliverables as any[]) ?? []).map((d, di) => ({
          id:       String(d.id ?? `t${pi}-${di}`),
          project:  String(p.title ?? p.name ?? 'Project'),
          title:    String(d.title ?? 'Task'),
          priority: 'medium' as const,
          status:   (['pending','in-progress','review','done'].includes(
                      String(d.status ?? '').toLowerCase().replace('_','-'))
                        ? String(d.status).toLowerCase().replace('_','-')
                        : 'pending') as 'pending' | 'in-progress' | 'review' | 'done',
          due:      String(d.dueDate ?? d.deadline ?? '—').slice(0, 10),
          progress: d.status === 'COMPLETED' ? 100 : d.status === 'IN_PROGRESS' ? 50 : 0,
        }))
      ).filter(t => t.status !== 'done')
    : ASSIGNED_TASKS.filter(t => t.status !== 'done')

  const activeTasks = tasks.length
  const dueThisWeek = tasks.filter(t => {
    if (!t.due || t.due === '—') return false
    const diff = new Date(t.due).getTime() - new Date().getTime()
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
  }).length || 2

  const isLoading = (statsLoading || projectsLoading) && !isDemo()

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Partner Dashboard" />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--os-text-2)' }}>
          <Spinner size="sm" /> Loading dashboard stats…
        </div>
      )}

      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Partner Dashboard</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--os-text-2)' }}>Your active assignments, earnings, and collaboration activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Tasks',   value: activeTasks,  icon: CheckSquare, color: 'bg-blue-50 text-blue-600'    },
          { label: 'Due This Week',  value: dueThisWeek,  icon: Clock,       color: 'bg-orange-50 text-orange-600' },
          { label: 'Total Earnings', value: `£${apiStats.total_earnings?.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
          { label: 'Partner Score',  value: `${apiStats.rating} / 5`, icon: Star, color: 'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className="os-card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--os-text-1)' }}>{s.value}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-semibold" style={{ color: 'var(--os-text-1)' }}>Assigned Tasks</h3>
          {tasks.length === 0 && (
            <div className="os-card p-8 text-center text-[var(--os-text-2)] text-sm">
              No pending tasks assigned to you.
            </div>
          )}
          {tasks.map(t => (
            <Card key={t.id} padding="none">
              <CardBody className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{t.title}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-0.5">{t.project}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Badge variant={PRIORITY_BADGE[t.priority] || 'neutral'} size="sm">{t.priority}</Badge>
                    <Badge variant={STATUS_BADGE[t.status] || 'neutral'} size="sm">{t.status}</Badge>
                  </div>
                </div>
                {t.progress > 0 && (
                  <div className="mb-2">
                    <Progress value={t.progress} color="brand" size="sm" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)]">
                  <Calendar className="w-3 h-3" />
                  Due: <span className="font-medium text-[var(--os-text-2)]">{t.due}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Earnings preview */}
          <Card>
            <CardHeader><CardTitle>Earnings Breakdown</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {[
                { label: 'Cleared YTD', amount: apiStats.total_earnings },
                { label: 'Pending Clear', amount: apiStats.pending_earnings },
              ].map(e => (
                <div key={e.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--os-text-2)]">{e.label}</span>
                  <span className="font-semibold" style={{ color: 'var(--os-text-1)' }}>£{e.amount?.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2" style={{ borderTop: '1px solid var(--os-border)' }}>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-[var(--os-text-2)]">Total YTD Portfolio</span>
                  <span className="text-green-600">£{(apiStats.total_earnings + apiStats.pending_earnings)?.toLocaleString()}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-[var(--os-border)]">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      a.type === 'success' ? 'bg-green-500' : a.type === 'payment' ? 'bg-blue-500' :
                      a.type === 'meeting' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-[var(--os-text-1)] leading-snug">{a.title}</p>
                      <p className="text-xs text-[var(--os-text-2)] mt-0.5">{a.date}</p>
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
