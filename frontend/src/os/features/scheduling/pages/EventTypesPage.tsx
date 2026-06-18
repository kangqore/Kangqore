import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Clock, Video, X, Layers } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface EventType {
  id: string
  name: string
  slug: string
  duration: number
  description?: string
  location?: string
  videoProvider: 'JITSI' | 'ZOOM' | 'GOOGLE_MEET'
  isActive: boolean
  bookingCount?: number
}

const VIDEO_LABELS = { JITSI: 'Jitsi (built-in)', ZOOM: 'Zoom', GOOGLE_MEET: 'Google Meet' }

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
}

const EMPTY: Omit<EventType, 'id' | 'slug' | 'bookingCount'> = {
  name: '', duration: 30, description: '', location: '',
  videoProvider: 'JITSI', isActive: true,
}

export function EventTypesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState<EventType | null>(null)
  const [form, setForm]           = useState({ ...EMPTY })

  const { data: eventTypes = [], isLoading } = useQuery<EventType[]>({
    queryKey: ['event-types'],
    queryFn: () => api.get('/scheduling/event-types').then(r => r.data.eventTypes ?? r.data ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      const payload = editing
        ? { ...form, slug: editing.slug }
        : { ...form, slug: toSlug(form.name) }
      return editing
        ? api.put(`/scheduling/event-types/${editing.id}`, payload)
        : api.post('/scheduling/event-types', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-types'] })
      close()
    },
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/event-types/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-types'] }),
  })

  const open = (et?: EventType) => {
    setEditing(et ?? null)
    setForm(et ? { name: et.name, duration: et.duration, description: et.description ?? '', location: et.location ?? '', videoProvider: et.videoProvider, isActive: et.isActive } : { ...EMPTY })
    setShowModal(true)
  }
  const close = () => { setShowModal(false); setEditing(null) }
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  if (isLoading) return <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Event Types</h2>
          <p className="text-sm text-slate-500 mt-1">Define the types of meetings attendees can book.</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => open()}>
          New event type
        </Button>
      </div>

      {eventTypes.length === 0 && (
        <Card><CardBody className="text-center py-12">
          <Layers className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No event types yet</p>
          <Button size="sm" className="mt-4" onClick={() => open()}>Create one</Button>
        </CardBody></Card>
      )}

      <div className="grid gap-3">
        {eventTypes.map(et => (
          <Card key={et.id} className={et.isActive ? '' : 'opacity-60'}>
            <CardBody className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white">{et.name}</p>
                    {!et.isActive && <Badge variant="neutral" size="sm">Inactive</Badge>}
                  </div>
                  {et.description && <p className="text-xs text-slate-500 line-clamp-2">{et.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{et.duration} min</span>
                    <span className="flex items-center gap-1"><Video className="w-3 h-3" />{VIDEO_LABELS[et.videoProvider]}</span>
                    {et.bookingCount !== undefined && <span>{et.bookingCount} bookings</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => open(et)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-os-s1 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete this event type?')) remove(et.id) }} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-os-s1 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-mono">/schedule/{et.slug}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={close}>
          <div className="bg-os-s0 border border-os-border rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">{editing ? 'Edit event type' : 'New event type'}</h3>
              <button onClick={close} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {[
              { label: 'Name *', key: 'name', type: 'text', placeholder: '30-min intro call' },
              { label: 'Description', key: 'description', type: 'text', placeholder: 'Brief intro and discovery call' },
              { label: 'Location / address', key: 'location', type: 'text', placeholder: 'Online or physical address' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">{label}</label>
                <input
                  type={type}
                  value={(form as Record<string, unknown>)[key] as string}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Duration (minutes)</label>
                <input
                  type="number"
                  min={5}
                  value={form.duration}
                  onChange={e => set('duration', Number(e.target.value))}
                  className="w-full h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Video provider</label>
                <select
                  value={form.videoProvider}
                  onChange={e => set('videoProvider', e.target.value)}
                  className="w-full h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="JITSI">Jitsi (built-in)</option>
                  <option value="ZOOM">Zoom</option>
                  <option value="GOOGLE_MEET">Google Meet</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => set('isActive', !form.isActive)}
                className={`relative w-9 h-5 rounded-full transition-colors ${form.isActive ? 'bg-os-blue' : 'bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-slate-400">Active (accepts bookings)</span>
            </div>

            <div className="flex gap-2 pt-2 border-t border-os-border">
              <Button size="sm" onClick={() => save()} disabled={!form.name || saving} loading={saving}>
                {editing ? 'Save changes' : 'Create'}
              </Button>
              <Button size="sm" variant="ghost" onClick={close}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
