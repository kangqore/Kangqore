import { CheckSquare, Clock, DollarSign, Star, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'

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
  const activeTasks = ASSIGNED_TASKS.filter(t => t.status !== 'done').length

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Partner Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Your active assignments, earnings, and collaboration activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Tasks',    value: activeTasks,  icon: CheckSquare, color: 'bg-blue-50 text-blue-600'   },
          { label: 'Due This Week',   value: 2,            icon: Clock,       color: 'bg-orange-50 text-orange-600'},
          { label: 'May Earnings',    value: '£8,400',     icon: DollarSign,  color: 'bg-green-50 text-green-600' },
          { label: 'Partner Score',   value: '4.8 / 5',    icon: Star,        color: 'bg-purple-50 text-purple-600'},
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Assigned Tasks</h3>
          {ASSIGNED_TASKS.map(t => (
            <Card key={t.id}>
              <CardBody className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{t.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.project}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Badge variant={PRIORITY_BADGE[t.priority]} size="sm">{t.priority}</Badge>
                    <Badge variant={STATUS_BADGE[t.status]} size="sm">{t.status}</Badge>
                  </div>
                </div>
                {t.progress > 0 && (
                  <div className="mb-2">
                    <Progress value={t.progress} color="brand" size="sm" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  Due: <span className="font-medium text-slate-600">{t.due}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Earnings preview */}
          <Card>
            <CardHeader><CardTitle>Earnings (2026)</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {[
                { month: 'March',   amount: 6200  },
                { month: 'April',   amount: 7800  },
                { month: 'May',     amount: 8400  },
              ].map(e => (
                <div key={e.month} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-12">{e.month}</span>
                  <div className="flex-1">
                    <Progress value={(e.amount / 10000) * 100} color="success" size="sm" />
                  </div>
                  <span className="text-xs font-semibold text-slate-900 w-16 text-right">£{e.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-600">YTD Total</span>
                  <span className="text-green-600">£22,400</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      a.type === 'success' ? 'bg-green-500' : a.type === 'payment' ? 'bg-blue-500' :
                      a.type === 'meeting' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-slate-800 leading-snug">{a.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.date}</p>
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
