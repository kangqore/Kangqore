import { CheckCircle2, AlertTriangle, FileText, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Spinner } from '@design-system/components/Spinner'
import { useClientProjects, useClientActions } from '../useClientData'
import { useAuthStore } from '@store/auth'

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Patient Portal v2',      phase: 'Development',  progress: 68, status: 'on-track',   nextMilestone: 'Beta release', milestoneDate: '2026-06-20', deliveryLead: 'Ravi Nair' },
  { id: 'p2', name: 'HIPAA Compliance Layer', phase: 'QA & Testing', progress: 91, status: 'on-track',   nextMilestone: 'Sign-off',     milestoneDate: '2026-06-10', deliveryLead: 'Omar Khalid' },
  { id: 'p3', name: 'Analytics Dashboard',    phase: 'Design',       progress: 32, status: 'at-risk',    nextMilestone: 'Design review',milestoneDate: '2026-06-08', deliveryLead: 'Anika Roy' },
]

const RECENT_DELIVERIES = [
  { title: 'Sprint 12 build deployed to staging', date: '2026-05-30', type: 'delivery' },
  { title: 'HIPAA audit report shared',           date: '2026-05-27', type: 'document' },
  { title: 'Design review meeting notes',         date: '2026-05-25', type: 'meeting'  },
  { title: 'Invoice INV-2026-041 issued',         date: '2026-05-20', type: 'invoice'  },
]

const SLA_ITEMS = [
  { metric: 'Response time (P1)',  target: '< 2h',  current: '1.4h', status: 'met'     },
  { metric: 'Response time (P2)',  target: '< 8h',  current: '6.2h', status: 'met'     },
  { metric: 'Uptime (staging)',    target: '99.5%', current: '99.8%',status: 'met'     },
  { metric: 'Sprint delivery',     target: '90%',   current: '87%',  status: 'at-risk' },
]

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'danger'> = {
  'on-track': 'success', 'at-risk': 'warning', 'delayed': 'danger',
}

export function ClientDashboard() {
  const { user } = useAuthStore()
  const { data: apiProjects, isLoading } = useClientProjects()
  const { data: actionsData } = useClientActions()

  // Map API projects → display shape; fall back to mock if no real data yet
  const projects = (apiProjects as Record<string, unknown>[] | undefined)?.length
    ? (apiProjects as Record<string, unknown>[]).map(p => ({
        id:            String(p.id),
        name:          String(p.title ?? p.name ?? 'Untitled'),
        phase:         String(p.status ?? 'Active'),
        progress:      Number(p.progress ?? 0),
        status:        p.status === 'ACTIVE' ? 'on-track' : ('at-risk' as const),
        nextMilestone: '—',
        milestoneDate: '—',
        deliveryLead:  'Kangqore',
      }))
    : MOCK_PROJECTS

  const pendingActions: number = actionsData
    ? (actionsData.deliverables?.length ?? 0) + (actionsData.decisions?.length ?? 0)
    : 0
  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Welcome back, {user?.name ?? 'there'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Here's the latest on your Kangqore engagement.</p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner size="sm" /> Loading live data…
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: projects.filter(p => p.status === 'on-track').length || projects.length, icon: TrendingUp,   color: 'bg-blue-50 text-blue-600'   },
          { label: 'Pending Actions', value: pendingActions || 0,                                                      icon: FileText,     color: 'bg-orange-50 text-orange-600'},
          { label: 'SLA Compliance',  value: '96%',                                                                    icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
          { label: 'Next Milestone',  value: projects[0]?.milestoneDate ?? '—',                                        icon: Calendar,     color: 'bg-purple-50 text-purple-600'},
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
        {/* Active projects */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Active Projects</h3>
          {projects.map(p => (
            <Card key={p.id}>
              <CardBody className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.phase} · Lead: {p.deliveryLead}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[p.status]} size="sm" dot>
                    {p.status === 'on-track' ? 'On Track' : 'At Risk'}
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Overall progress</span>
                    <span className="font-semibold">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} color={p.status === 'at-risk' ? 'warning' : 'success'} size="sm" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Next: <span className="font-medium text-slate-700">{p.nextMilestone}</span>
                  <span>—</span>
                  <span>{p.milestoneDate}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* SLA */}
          <Card>
            <CardHeader><CardTitle>SLA Status</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {SLA_ITEMS.map(s => (
                <div key={s.metric} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {s.status === 'met'
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    }
                    <span className="text-xs text-slate-700 truncate">{s.metric}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-semibold ${s.status === 'met' ? 'text-green-600' : 'text-orange-600'}`}>
                      {s.current}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ {s.target}</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100">
                {RECENT_DELIVERIES.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      d.type === 'delivery' ? 'bg-blue-500' : d.type === 'document' ? 'bg-purple-500' :
                      d.type === 'invoice' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 leading-snug">{d.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{d.date}</p>
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
