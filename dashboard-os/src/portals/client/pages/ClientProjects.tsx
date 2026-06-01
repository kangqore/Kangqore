import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckSquare, Clock } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'

const PROJECTS = [
  {
    id: 'p1', name: 'Patient Portal v2', status: 'in-progress', progress: 68,
    startDate: '2026-03-01', targetDate: '2026-07-15',
    deliveryLead: 'Ravi Nair', techLead: 'Dev Patel',
    description: 'Full rebuild of patient-facing portal with HIPAA compliance, telemedicine, and appointment scheduling.',
    milestones: [
      { name: 'Discovery & Architecture',  date: '2026-03-20', done: true  },
      { name: 'Design system & wireframes', date: '2026-04-10', done: true  },
      { name: 'Core auth & patient flows',  date: '2026-05-01', done: true  },
      { name: 'Telemedicine integration',   date: '2026-06-05', done: false },
      { name: 'Beta release to UAT',        date: '2026-06-20', done: false },
      { name: 'Go-live',                    date: '2026-07-15', done: false },
    ],
  },
  {
    id: 'p2', name: 'HIPAA Compliance Layer', status: 'in-progress', progress: 91,
    startDate: '2026-04-01', targetDate: '2026-06-15',
    deliveryLead: 'Omar Khalid', techLead: 'Jake Morton',
    description: 'Audit logging, data encryption at rest, and compliance reporting module for regulatory sign-off.',
    milestones: [
      { name: 'Threat model & scope',    date: '2026-04-10', done: true  },
      { name: 'Encryption implementation', date: '2026-05-01', done: true  },
      { name: 'Audit log module',        date: '2026-05-20', done: true  },
      { name: 'Compliance report builder', date: '2026-06-01', done: true  },
      { name: 'Final audit & sign-off',  date: '2026-06-15', done: false },
    ],
  },
  {
    id: 'p3', name: 'Analytics Dashboard', status: 'at-risk', progress: 32,
    startDate: '2026-05-01', targetDate: '2026-07-30',
    deliveryLead: 'Anika Roy', techLead: 'Priya Chen',
    description: 'Executive analytics dashboard for patient outcomes, staff efficiency, and operational KPIs.',
    milestones: [
      { name: 'Requirements workshop',  date: '2026-05-10', done: true  },
      { name: 'Data model design',      date: '2026-05-28', done: false },
      { name: 'UI prototypes',          date: '2026-06-08', done: false },
      { name: 'Backend integration',    date: '2026-07-01', done: false },
      { name: 'UAT & launch',           date: '2026-07-30', done: false },
    ],
  },
]

const STATUS_CONFIG = {
  'in-progress': { label: 'In Progress', variant: 'info' as const },
  'at-risk':     { label: 'At Risk',     variant: 'warning' as const },
  'completed':   { label: 'Completed',   variant: 'success' as const },
  'on-hold':     { label: 'On Hold',     variant: 'neutral' as const },
}

export function ClientProjects() {
  const [openId, setOpenId] = useState<string>('p1')

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Your Projects</h2>
        <p className="text-sm text-slate-500 mt-1">Live status of all active and completed engagements.</p>
      </div>

      {PROJECTS.map(p => {
        const isOpen    = openId === p.id
        const cfg       = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG]
        const doneMiles = p.milestones.filter(m => m.done).length

        return (
          <Card key={p.id} className="overflow-hidden">
            <button
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
              onClick={() => setOpenId(isOpen ? '' : p.id)}
            >
              {isOpen
                ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900">{p.name}</p>
                  <Badge variant={cfg.variant} size="sm" dot>{cfg.label}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {p.startDate} → {p.targetDate} · Lead: {p.deliveryLead}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{p.progress}%</p>
                  <p className="text-xs text-slate-400">{doneMiles}/{p.milestones.length} milestones</p>
                </div>
                <div className="w-24">
                  <Progress value={p.progress} color={p.status === 'at-risk' ? 'warning' : 'brand'} size="sm" />
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-5">
                <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Delivery Lead', value: p.deliveryLead },
                    { label: 'Tech Lead',     value: p.techLead     },
                    { label: 'Start Date',    value: p.startDate    },
                    { label: 'Target Date',   value: p.targetDate   },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Milestone timeline */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Milestones</p>
                  <div className="space-y-2">
                    {p.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          m.done ? 'bg-green-100' : 'bg-slate-100'
                        }`}>
                          {m.done
                            ? <CheckSquare className="w-3.5 h-3.5 text-green-600" />
                            : <Clock       className="w-3.5 h-3.5 text-slate-400" />
                          }
                        </div>
                        <span className={`text-sm flex-1 ${m.done ? 'text-slate-500 line-through' : 'text-slate-900 font-medium'}`}>
                          {m.name}
                        </span>
                        <span className="text-xs text-slate-400 flex-shrink-0">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
