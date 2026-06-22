import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, GitBranch, Clock, Mail, Webhook } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface Workflow {
  id: string
  eventTypeName?: string
  trigger: 'ON_BOOKED' | 'BEFORE_EVENT' | 'AFTER_EVENT'
  offsetMinutes?: number | null
  action: 'SEND_EMAIL' | 'CALL_WEBHOOK'
  actionConfig: Record<string, unknown>
}

interface EventType { id: string; name: string }

const EMPTY_FORM = {
  eventTypeId: '',
  trigger: 'ON_BOOKED' as const,
  offsetValue: 24,
  offsetUnit: 'hours' as 'minutes' | 'hours' | 'days',
  action: 'SEND_EMAIL' as 'SEND_EMAIL' | 'CALL_WEBHOOK',
  emailRecipient: 'invitee',
  emailSubject: '',
  webhookUrl: '',
}

function formatTrigger(wf: Workflow) {
  if (wf.trigger === 'ON_BOOKED') return 'Immediately when booked'
  if (!wf.offsetMinutes) return wf.trigger
  const abs = Math.abs(wf.offsetMinutes)
  const str = abs % 1440 === 0 ? `${abs / 1440} days` : abs % 60 === 0 ? `${abs / 60} hours` : `${abs} min`
  return wf.trigger === 'BEFORE_EVENT' ? `${str} before event` : `${str} after event`
}

export function WorkflowsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const { data: workflows = [], isLoading: wfLoading } = useQuery<Workflow[]>({
    queryKey: ['scheduling-workflows'],
    queryFn: () => api.get('/scheduling/workflows').then(r => r.data.workflows ?? r.data ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: eventTypes = [] } = useQuery<EventType[]>({
    queryKey: ['event-types-simple'],
    queryFn: () => api.get('/scheduling/event-types').then(r => r.data.eventTypes ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 10,
  })

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () => {
      const multipliers = { minutes: 1, hours: 60, days: 1440 }
      const mins = form.trigger === 'ON_BOOKED' ? null
        : form.offsetValue * multipliers[form.offsetUnit] * (form.trigger === 'BEFORE_EVENT' ? -1 : 1)
      const actionConfig = form.action === 'SEND_EMAIL'
        ? { recipient: form.emailRecipient, subject: form.emailSubject || undefined }
        : { url: form.webhookUrl }
      return api.post('/scheduling/workflows', {
        eventTypeId: form.eventTypeId || undefined,
        trigger: form.trigger,
        offsetMinutes: mins,
        action: form.action,
        actionConfig,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduling-workflows'] })
      setShowForm(false)
      setForm(EMPTY_FORM)
    },
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/workflows/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scheduling-workflows'] }),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Workflows</h2>
          <p className="text-sm text-slate-500 mt-1">Automate emails and webhooks around booking events.</p>
        </div>
        {!showForm && (
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowForm(true)}>
            New workflow
          </Button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <CardBody className="p-6 space-y-5">
            <h3 className="font-semibold text-white">Create automation</h3>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Event type (optional)</label>
              <select value={form.eventTypeId} onChange={e => set('eventTypeId', e.target.value)}
                className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400">
                <option value="">All event types</option>
                {eventTypes.map(et => <option key={et.id} value={et.id}>{et.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Trigger</label>
                <select value={form.trigger} onChange={e => set('trigger', e.target.value)}
                  className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400">
                  <option value="ON_BOOKED">Immediately when booked</option>
                  <option value="BEFORE_EVENT">Before event starts</option>
                  <option value="AFTER_EVENT">After event ends</option>
                </select>
              </div>

              {form.trigger !== 'ON_BOOKED' && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Offset</label>
                  <div className="flex gap-2">
                    <input type="number" min={1} value={form.offsetValue} onChange={e => set('offsetValue', Number(e.target.value))}
                      className="w-20 h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400" />
                    <select value={form.offsetUnit} onChange={e => set('offsetUnit', e.target.value)}
                      className="flex-1 h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-2 focus:outline-none focus:border-blue-400">
                      <option value="minutes">minutes</option>
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Action</label>
              <select value={form.action} onChange={e => set('action', e.target.value)}
                className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400">
                <option value="SEND_EMAIL">Send Email</option>
                <option value="CALL_WEBHOOK">Trigger Webhook</option>
              </select>
            </div>

            {form.action === 'SEND_EMAIL' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Recipient</label>
                  <select value={form.emailRecipient} onChange={e => set('emailRecipient', e.target.value)}
                    className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400">
                    <option value="invitee">Invitee</option>
                    <option value="host">Host</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Subject (optional)</label>
                  <input type="text" value={form.emailSubject} onChange={e => set('emailSubject', e.target.value)}
                    placeholder="Your meeting is confirmed"
                    className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
            )}

            {form.action === 'CALL_WEBHOOK' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Webhook URL *</label>
                <input type="url" value={form.webhookUrl} onChange={e => set('webhookUrl', e.target.value)}
                  placeholder="https://your-app.com/webhook"
                  className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400" />
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-white/10 border-t-white/20">
              <Button size="sm" onClick={() => create()} loading={creating}
                disabled={creating || (form.action === 'CALL_WEBHOOK' && !form.webhookUrl)}>
                Create workflow
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}>Cancel</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {wfLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>}

      {!wfLoading && workflows.length === 0 && !showForm && (
        <Card><CardBody className="text-center py-12">
          <GitBranch className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No workflows yet</p>
        </CardBody></Card>
      )}

      <div className="space-y-2">
        {workflows.map(wf => (
          <Card key={wf.id}>
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 flex items-center justify-center flex-shrink-0">
                  {wf.action === 'SEND_EMAIL'
                    ? <Mail className="w-4 h-4 text-blue-400" />
                    : <Webhook className="w-4 h-4 text-purple-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {wf.action === 'SEND_EMAIL' ? 'Send email' : 'Call webhook'}
                    {wf.eventTypeName && <span className="text-slate-500"> · {wf.eventTypeName}</span>}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {formatTrigger(wf)}
                  </p>
                </div>
                <Badge variant="neutral" size="sm">{wf.action === 'SEND_EMAIL' ? 'Email' : 'Webhook'}</Badge>
                <button onClick={() => { if (confirm('Delete workflow?')) remove(wf.id) }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
