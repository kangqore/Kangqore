import { Mail, Phone, Globe, Clock, CheckCircle, Circle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { useLeadsStore } from '../store'
import type { NurtureStatus } from '../types'

const STATUS_VARIANT: Record<NurtureStatus,'success'|'neutral'|'info'|'warning'> = {
  active: 'success', paused: 'warning', completed: 'info', 'opted-out': 'neutral',
}
const STEP_ICON: Record<string, React.ElementType> = {
  email: Mail, call: Phone, linkedin: Globe, wait: Clock,
}
const STEP_COLOR: Record<string, string> = {
  email: 'bg-blue-100 text-blue-600', call: 'bg-green-100 text-green-600',
  linkedin: 'bg-os-blue/10 text-os-blue', wait: 'bg-os-s1 text-slate-300',
}

export function NurturePage() {
  const { leads, nurtureSequences } = useLeadsStore()

  const active    = nurtureSequences.filter(n => n.status === 'active').length
  const paused    = nurtureSequences.filter(n => n.status === 'paused').length
  const completed = nurtureSequences.filter(n => n.status === 'completed').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Nurture Sequences</h2>
          <p className="text-sm text-slate-500 mt-0.5">{nurtureSequences.length} sequences · automated lead engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-200">{active} active</span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">{paused} paused</span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-os-border">{completed} completed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {nurtureSequences.map(seq => {
          const lead       = leads.find(l => l.id === seq.leadId)
          const totalSteps = seq.steps.length
          const doneSteps  = seq.steps.filter(s => s.completed).length
          const pct        = Math.round((doneSteps / totalSteps) * 100)

          return (
            <Card key={seq.id}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-white">{seq.leadCompany}</h3>
                    <Badge variant={STATUS_VARIANT[seq.status]} dot size="sm">{seq.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{seq.sequenceName}</p>
                  {lead && <p className="text-xs text-slate-500 mt-0.5">{lead.contactName} · {lead.contactRole}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500">Step {doneSteps}/{totalSteps}</p>
                  <p className="text-lg font-bold text-white">{pct}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-os-s1 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: seq.status === 'active' ? 'linear-gradient(90deg, #2564ea, #4ab6d4)' : '#94a3b8',
                  }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {seq.steps.map((step, i) => {
                  const Icon = STEP_ICON[step.type] ?? Mail
                  const isNext = !step.completed && i === doneSteps
                  return (
                    <div key={step.step} className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${isNext ? 'bg-os-blue/5 border border-os-blue/15' : ''}`}>
                      {/* Status indicator */}
                      <div className="flex-shrink-0 mt-0.5">
                        {step.completed
                          ? <CheckCircle className="w-4 h-4 text-green-500 fill-green-50" />
                          : isNext
                          ? <Circle className="w-4 h-4 text-os-blue" />
                          : <Circle className="w-4 h-4 text-slate-200" />
                        }
                      </div>

                      {/* Step icon */}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-os-s1 text-slate-300' : STEP_COLOR[step.type]}`}>
                        <Icon className="w-3 h-3" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-medium ${step.completed ? 'text-slate-500 line-through' : isNext ? 'text-white' : 'text-slate-500'}`}>
                            {step.title}
                          </p>
                          {isNext && (
                            <span className="text-[10px] font-semibold text-os-blue bg-os-blue/10 px-1.5 py-0.5 rounded flex-shrink-0">NEXT</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{step.description}</p>
                        {step.completedDate && (
                          <p className="text-[10px] text-green-500 mt-0.5">Done {new Date(step.completedDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-os-border flex items-center justify-between text-xs text-slate-500">
                <span>Enrolled {new Date(seq.enrolledDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                {seq.status === 'active' && (
                  <span className="text-os-blue font-semibold">
                    Next: {new Date(seq.nextActionDate).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}
                  </span>
                )}
                {seq.status === 'paused' && <span className="text-amber-500 font-semibold">Paused — resumes Q3 2026</span>}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Leads not in any sequence */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Without Active Nurture</CardTitle>
          <Badge variant="warning" size="sm">needs attention</Badge>
        </CardHeader>
        <div className="space-y-2">
          {leads
            .filter(l => !['won','lost'].includes(l.stage) && !nurtureSequences.some(n => n.leadId === l.id && n.status === 'active'))
            .map(lead => (
              <div key={lead.id} className="flex items-center gap-3 py-2 border-b border-os-border last:border-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">{lead.company.slice(0,2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{lead.company}</p>
                  <p className="text-xs text-slate-500">{lead.contactName} · {lead.stage}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-amber-400' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-500">{lead.score}</span>
                <span className="text-xs text-slate-500">₹{(lead.value/1000).toFixed(0)}k</span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
