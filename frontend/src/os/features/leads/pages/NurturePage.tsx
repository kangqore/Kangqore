import { useEffect } from 'react'
import { Mail, Phone, Globe, Clock, CheckCircle, Circle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { api, isDemo } from '@lib/api'
import { useLeadsStore } from '../store'
import { LEADS, NURTURE_SEQUENCES } from '../data'
import type { NurtureStatus } from '../types'

const STATUS_VARIANT: Record<NurtureStatus,'success'|'neutral'|'info'|'warning'> = {
  active: 'success', paused: 'warning', completed: 'info', 'opted-out': 'neutral',
}
const STEP_ICON: Record<string, React.ElementType> = {
  email: Mail, call: Phone, linkedin: Globe, wait: Clock,
}
const STEP_COLOR: Record<string, string> = {
  email: '#579bfc', call: '#00c875',
  linkedin: '#7c3aed', wait: '#fdab3d',
  task: '#7c3aed',
}

export function NurturePage() {
  const { leads, isLoading, nurtureSequences, hydrate } = useLeadsStore()

  const { data: rawLeads } = useQuery({
    queryKey: ['leads-pipeline'],
    queryFn: () => api.get('/admin/eqore/leads').then(r => r.data.leads ?? r.data ?? []),
    staleTime: 60_000,
    enabled: !isDemo(),
  })

  useEffect(() => {
    if (isDemo()) {
      if (leads.length === 0) hydrate(LEADS)
      if (nurtureSequences.length === 0) useLeadsStore.setState({ nurtureSequences: NURTURE_SEQUENCES })
    } else if (rawLeads !== undefined && leads.length === 0) {
      hydrate(rawLeads)
    }
  }, [rawLeads, leads.length, nurtureSequences.length, hydrate])

  const active    = nurtureSequences.filter(n => n.status === 'active').length
  const paused    = nurtureSequences.filter(n => n.status === 'paused').length
  const completed = nurtureSequences.filter(n => n.status === 'completed').length

  if (isLoading && leads.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-[var(--os-surface-0)] rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-[var(--os-surface-0)] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!isLoading && nurtureSequences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--os-text-2)' }}>
        <Mail className="w-8 h-8 mb-3 opacity-40" />
        <p className="text-sm font-medium">No nurture sequences yet</p>
        <p className="text-xs mt-1">Sequences will appear here once leads are enrolled</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">Nurture Sequences</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>{nurtureSequences.length} sequences · automated lead engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: '#00c875' }}>{active} active</span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: '#fdab3d' }}>{paused} paused</span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }}>{completed} completed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {nurtureSequences.map(seq => {
          const lead       = leads.find(l => l.id === seq.leadId)
          const totalSteps = seq.steps.length
          const doneSteps  = seq.steps.filter(s => s.completed).length
          const pct        = Math.round((doneSteps / totalSteps) * 100)
          const statusColor = seq.status === 'active' ? '#00c875' : seq.status === 'paused' ? '#fdab3d' : seq.status === 'completed' ? '#579bfc' : 'var(--os-text-2)'

          return (
            <Card key={seq.id}>
              {/* Colored top strip */}
              <div className="h-1 -mx-5 -mt-5 mb-4 rounded-t-xl" style={{ background: statusColor }} />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-white">{seq.leadCompany}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white capitalize" style={{ background: statusColor }}>
                      {seq.status}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>{seq.sequenceName}</p>
                  {lead && <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>{lead.contactName} · {lead.contactRole}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>Step {doneSteps}/{totalSteps}</p>
                  <p className="text-2xl font-black text-white">{pct}%</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: 'var(--os-border)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: statusColor }} />
              </div>

              {/* Steps — Salesforce sequence cards */}
              <div className="space-y-2">
                {seq.steps.map((step, i) => {
                  const Icon = STEP_ICON[step.type] ?? Mail
                  const isNext = !step.completed && i === doneSteps
                  const stepBg = STEP_COLOR[step.type] ?? '#579bfc'
                  return (
                    <div key={step.step}
                      className="flex items-start gap-3 p-2.5 rounded-2xl transition-colors"
                      style={{ background: isNext ? `${stepBg}11` : 'transparent', border: isNext ? `1px solid ${stepBg}33` : '1px solid transparent' }}>
                      {/* Step number badge */}
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[10px] font-bold"
                        style={{ background: step.completed ? '#00c875' : isNext ? stepBg : 'var(--os-border)' }}>
                        {step.completed ? '✓' : i + 1}
                      </div>

                      {/* Step type icon */}
                      <div className="w-6 h-6 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
                        style={{ background: step.completed ? '#00c87533' : stepBg }}>
                        <Icon className="w-3 h-3" style={{ color: step.completed ? '#00c875' : 'white' }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold" style={{
                            color: step.completed ? 'var(--os-text-2)' : isNext ? 'white' : 'var(--os-text-2)',
                            textDecoration: step.completed ? 'line-through' : 'none'
                          }}>
                            {step.title}
                          </p>
                          {isNext && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: stepBg }}>NEXT</span>
                          )}
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-2)' }}>{step.description}</p>
                        {step.completedDate && (
                          <p className="text-[10px] mt-0.5 font-semibold" style={{ color: '#00c875' }}>Done {new Date(step.completedDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--os-border)] flex items-center justify-between text-xs" style={{ color: 'var(--os-text-2)' }}>
                <span>Enrolled {new Date(seq.enrolledDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                {seq.status === 'active' && (
                  <span className="font-bold" style={{ color: '#579bfc' }}>
                    Next: {new Date(seq.nextActionDate).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}
                  </span>
                )}
                {seq.status === 'paused' && <span className="font-bold" style={{ color: '#fdab3d' }}>Paused — resumes Q3 2026</span>}
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
        <div className="space-y-0">
          {leads
            .filter(l => !['won','lost'].includes(l.stage) && !nurtureSequences.some(n => n.leadId === l.id && n.status === 'active'))
            .map(lead => (
              <div key={lead.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--os-surface-0)] border-b border-[var(--os-border)] last:border-0 transition-colors">
                <div className="w-7 h-7 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
                  style={{ background: '#579bfc' }}>
                  {lead.company.slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{lead.company}</p>
                  <p className="text-xs capitalize" style={{ color: 'var(--os-text-2)' }}>{lead.contactName} · {lead.stage}</p>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: lead.score >= 80 ? '#00c87522' : lead.score >= 60 ? '#fdab3d22' : '#94a3b822', color: lead.score >= 80 ? '#00c875' : lead.score >= 60 ? '#fdab3d' : 'var(--os-text-2)' }}>
                  {lead.score}
                </span>
                <span className="text-xs font-bold text-white">₹{(lead.value/1000).toFixed(0)}k</span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
