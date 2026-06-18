import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { useClientsStore } from '../store'
import type { MilestoneStatus } from '../types'

const STATUS_COLOR: Record<MilestoneStatus, string> = {
  completed:   'bg-green-500',
  'in-progress':'bg-os-blue',
  upcoming:    'bg-slate-300',
  delayed:     'bg-red-500',
}
const STATUS_VARIANT: Record<MilestoneStatus, 'success'|'info'|'neutral'|'danger'> = {
  completed: 'success', 'in-progress': 'info', upcoming: 'neutral', delayed: 'danger',
}

export function DeliveryTracking() {
  const { clients, milestones } = useClientsStore()
  const activeClients = clients.filter(c => c.status !== 'churned' && c.projectIds.length > 0)

  const overallCompleted = milestones.filter(m => m.status === 'completed').length
  const overallDelayed   = milestones.filter(m => m.status === 'delayed').length
  const overallInProg    = milestones.filter(m => m.status === 'in-progress').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Delivery Tracking</h2>
        <p className="text-sm text-slate-500 mt-0.5">{milestones.length} milestones across {activeClients.length} clients</p>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { label: `${overallCompleted} completed`, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: `${overallInProg} in progress`,  color: 'bg-[#2564ea]/5 text-os-blue border-[#2564ea]/20' },
          { label: `${overallDelayed} delayed`,      color: overallDelayed > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-900 text-slate-300 border-os-border' },
          { label: `${milestones.filter(m=>m.status==='upcoming').length} upcoming`, color: 'bg-slate-900 text-slate-300 border-os-border' },
        ].map(c => (
          <span key={c.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${c.color}`}>{c.label}</span>
        ))}
      </div>

      {/* Per-client delivery cards */}
      <div className="space-y-4">
        {activeClients.map(client => {
          const cms     = milestones.filter(m => m.clientId === client.id)
          const done    = cms.filter(m => m.status === 'completed').length
          const pct     = cms.length > 0 ? Math.round((done / cms.length) * 100) : 0
          const delayed = cms.filter(m => m.status === 'delayed').length

          return (
            <Card key={client.id}>
              {/* Client header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{client.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    {delayed > 0 && <Badge variant="danger" dot size="sm">{delayed} delayed</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">{done}/{cms.length} milestones complete</p>
                </div>
                <div className="flex-shrink-0">
                  <Progress value={pct} size="sm" color={delayed > 0 ? 'danger' : pct === 100 ? 'success' : 'brand'} className="w-28" />
                  <p className="text-[10px] text-slate-500 text-right mt-1">{pct}% delivered</p>
                </div>
              </div>

              {/* Milestone timeline */}
              <div className="relative">
                {/* Connector line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-os-s1" />

                <div className="space-y-3">
                  {cms.map(ms => (
                    <div key={ms.id} className="flex items-start gap-3 relative">
                      <div className={`w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 z-10 ring-2 ring-os-s1 ${STATUS_COLOR[ms.status]}`} />
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-medium ${ms.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                            {ms.title}
                          </p>
                          <Badge variant={STATUS_VARIANT[ms.status]} size="sm">{ms.status.replace('-',' ')}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ms.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-500">
                            {ms.status === 'completed' && ms.completedDate
                              ? `Delivered ${new Date(ms.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                              : `Due ${new Date(ms.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            }
                          </span>
                          <div className="flex items-center gap-1">
                            <Avatar name={ms.owner} size="xs" />
                            <span className="text-[10px] text-slate-500">{ms.owner.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
