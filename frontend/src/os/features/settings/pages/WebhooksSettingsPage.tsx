import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link2, Trash2, Plus, CheckCircle2, XCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface Webhook {
  id: string
  url: string
  events: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'FAILING'
  createdAt: string
  lastDelivery?: { success: boolean; statusCode: number; timestamp: string }
}

const ALL_EVENTS = [
  'booking.created', 'booking.cancelled', 'booking.rescheduled',
  'lead.created', 'lead.stage_changed', 'invoice.paid', 'workflow.completed',
]

const STATUS_CONFIG = {
  ACTIVE:   { variant: 'success' as const, Icon: CheckCircle2, color: 'text-green-500' },
  INACTIVE: { variant: 'neutral' as const, Icon: Clock,         color: 'text-slate-500' },
  FAILING:  { variant: 'danger'  as const, Icon: XCircle,       color: 'text-red-500'   },
}

export function WebhooksSettingsPage() {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [newEvents, setNewEvents] = useState<string[]>(['booking.created'])
  const [adding, setAdding] = useState(false)

  const { data: webhooks = [], isLoading } = useQuery<Webhook[]>({
    queryKey: ['webhooks'],
    queryFn: () => api.get('/scheduling/webhooks').then(r => r.data.webhooks ?? r.data ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const { mutate: deleteWebhook } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/webhooks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks'] }),
  })

  const { mutate: testWebhook, isPending: testing } = useMutation({
    mutationFn: (id: string) => api.post(`/scheduling/webhooks/${id}/test`, {}),
  })

  const { mutate: createWebhook, isPending: creating } = useMutation({
    mutationFn: () => api.post('/scheduling/webhooks', { url: newUrl, events: newEvents }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
      setNewUrl('')
      setAdding(false)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Webhooks</h2>
          <p className="text-sm text-slate-500 mt-1">Send real-time event data to external URLs.</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAdding(a => !a)}>
          Add webhook
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <Card>
          <CardBody className="space-y-4 p-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Endpoint URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="https://your-app.com/webhooks/kangqore"
                className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Events</label>
              <div className="flex flex-wrap gap-2">
                {ALL_EVENTS.map(evt => (
                  <button
                    key={evt}
                    onClick={() => setNewEvents(prev =>
                      prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]
                    )}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      newEvents.includes(evt)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300 border-white/10 border-t-white/20 hover:border-blue-300'
                    }`}
                  >
                    {evt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => createWebhook()} disabled={!newUrl || creating} loading={creating}>
                Save webhook
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {isLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>}

      {!isLoading && webhooks.length === 0 && !adding && (
        <Card>
          <CardBody className="text-center py-10">
            <Link2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-300">No webhooks configured</p>
            <p className="text-xs text-slate-500 mt-1">Add one to receive real-time event notifications.</p>
          </CardBody>
        </Card>
      )}

      <div className="space-y-3">
        {webhooks.map(wh => {
          const cfg = STATUS_CONFIG[wh.status] ?? STATUS_CONFIG.INACTIVE
          const isOpen = expanded === wh.id
          return (
            <Card key={wh.id} className="overflow-hidden">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-900 transition-colors"
                onClick={() => setExpanded(isOpen ? null : wh.id)}
              >
                <cfg.Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate font-mono">{wh.url}</p>
                  <p className="text-xs text-slate-500">{wh.events.length} events · created {new Date(wh.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={cfg.variant} size="sm">{wh.status}</Badge>
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
              </div>

              {isOpen && (
                <div className="border-t border-white/10 border-t-white/20 px-5 py-4 space-y-3 bg-slate-900/50">
                  <div className="flex flex-wrap gap-1.5">
                    {wh.events.map(e => (
                      <span key={e} className="text-xs bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300 px-2 py-0.5 rounded-full">{e}</span>
                    ))}
                  </div>
                  {wh.lastDelivery && (
                    <p className="text-xs text-slate-500">
                      Last delivery: <span className={wh.lastDelivery.success ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {wh.lastDelivery.statusCode}
                      </span> · {new Date(wh.lastDelivery.timestamp).toLocaleString()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => testWebhook(wh.id)} disabled={testing}>
                      Send test
                    </Button>
                    <Button size="sm" variant="ghost" leftIcon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => deleteWebhook(wh.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
