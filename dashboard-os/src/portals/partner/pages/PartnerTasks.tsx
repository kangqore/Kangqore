import { useState } from 'react'
import { CheckSquare, Clock, ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { usePartnerProjects } from '../usePartnerData'

type TaskStatus = 'pending' | 'in-progress' | 'review' | 'done'

const ALL_TASKS = [
  { id: 't1',  project: 'Urban Mobility Co.',  title: 'Implement Redis caching layer',                  priority: 'high',   status: 'in-progress' as TaskStatus, due: '2026-06-05', progress: 65,  desc: 'Add Redis for session and API response caching. Target < 50ms p95 latency.'        },
  { id: 't2',  project: 'Urban Mobility Co.',  title: 'WebSocket real-time tracking module',            priority: 'high',   status: 'in-progress' as TaskStatus, due: '2026-06-12', progress: 30,  desc: 'Vehicle location streaming via WebSocket. Socket.io + Redis pub/sub architecture.'  },
  { id: 't3',  project: 'GreenSpark Energy',   title: 'API gateway load test report',                   priority: 'medium', status: 'pending'     as TaskStatus, due: '2026-06-08', progress: 0,   desc: 'Run k6 load tests against IoT data ingestion endpoints. Target: 10k req/s.'        },
  { id: 't4',  project: 'Quantum Analytics',   title: 'Code review — auth middleware PR #44',           priority: 'low',    status: 'review'      as TaskStatus, due: '2026-06-03', progress: 90,  desc: 'Review and approve JWT refresh flow refactor. Check for edge cases on expiry.'     },
  { id: 't5',  project: 'Urban Mobility Co.',  title: 'Fleet dashboard — driver mode UI',              priority: 'medium', status: 'pending'     as TaskStatus, due: '2026-06-20', progress: 0,   desc: 'Mobile-optimised view for drivers. Figma spec shared in Slack.'                   },
  { id: 't6',  project: 'GreenSpark Energy',   title: 'Sensor data normalisation pipeline',            priority: 'high',   status: 'in-progress' as TaskStatus, due: '2026-06-10', progress: 45,  desc: 'ETL pipeline to normalise multi-format IoT sensor payloads into unified schema.'   },
  { id: 't7',  project: 'Quantum Analytics',   title: 'ML model serving endpoint',                     priority: 'high',   status: 'done'        as TaskStatus, due: '2026-05-28', progress: 100, desc: 'FastAPI endpoint for ONNX model inference. Deployed and benchmarked.'             },
  { id: 't8',  project: 'Quantum Analytics',   title: 'Data pipeline monitoring dashboard',            priority: 'medium', status: 'done'        as TaskStatus, due: '2026-05-22', progress: 100, desc: 'Grafana dashboard for pipeline health. Alerts configured.'                       },
]

const STATUS_COLS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'pending',     label: 'To Do',      color: '#94a3b8' },
  { id: 'in-progress', label: 'In Progress',color: '#3b82f6' },
  { id: 'review',      label: 'In Review',  color: '#f59e0b' },
  { id: 'done',        label: 'Done',       color: '#22c55e' },
]

const PRIORITY_COLOR: Record<string, string> = {
  high: 'border-l-red-400', medium: 'border-l-orange-300', low: 'border-l-slate-200',
}

export function PartnerTasks() {
  const [openId, setOpenId] = useState<string | null>(null)
  const { data: apiProjects } = usePartnerProjects()

  // Flatten deliverables from real projects into tasks; fall back to ALL_TASKS
  const tasks = (apiProjects as Record<string, unknown>[] | undefined)?.length
    ? (apiProjects as Record<string, unknown>[]).flatMap((p, pi) =>
        ((p.deliverables as Record<string, unknown>[]) ?? []).map((d, di) => ({
          id:       String(d.id ?? `t${pi}-${di}`),
          project:  String(p.title ?? p.name ?? 'Project'),
          title:    String(d.title ?? 'Task'),
          priority: 'medium' as const,
          status:   (['pending','in-progress','review','done'].includes(
                      String(d.status ?? '').toLowerCase().replace('_','-'))
                        ? String(d.status).toLowerCase().replace('_','-')
                        : 'pending') as TaskStatus,
          due:      String(d.dueDate ?? d.deadline ?? '—').slice(0, 10),
          progress: d.status === 'COMPLETED' ? 100 : d.status === 'IN_PROGRESS' ? 50 : 0,
          desc:     String(d.description ?? ''),
        }))
      )
    : ALL_TASKS

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Tasks</h2>
        <p className="text-sm text-slate-500 mt-1">All tasks assigned to you across active projects.</p>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[800px]">
          {STATUS_COLS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id)
            return (
              <div key={col.id} className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{col.label}</span>
                  <span className="ml-auto text-xs bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">{colTasks.length}</span>
                </div>

                <div className="space-y-2">
                  {colTasks.map(t => (
                    <div
                      key={t.id}
                      className={`bg-white border border-slate-200 border-l-4 rounded-xl shadow-sm cursor-pointer hover:border-blue-200 transition-all ${PRIORITY_COLOR[t.priority]}`}
                      onClick={() => setOpenId(openId === t.id ? null : t.id)}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-sm font-medium text-slate-900 leading-snug">{t.title}</p>
                          {openId === t.id
                            ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            : <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                          }
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{t.project}</p>

                        {t.progress > 0 && t.progress < 100 && (
                          <Progress value={t.progress} color="brand" size="sm" />
                        )}
                        {t.status === 'done' && (
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <CheckSquare className="w-3 h-3" />
                            <span>Completed</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {t.due}
                          </div>
                          <Badge variant={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'neutral'} size="sm">
                            {t.priority}
                          </Badge>
                        </div>
                      </div>

                      {openId === t.id && (
                        <div className="border-t border-slate-100 px-3 py-2.5 bg-slate-50/50 rounded-b-xl">
                          <p className="text-xs text-slate-600 leading-relaxed">{t.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                      <p className="text-xs text-slate-400">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
