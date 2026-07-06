import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Clock, Video, X, Layers, CalendarCheck } from 'lucide-react'
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

const DURATION_COLOR = (d: number) =>
  d <= 15 ? '#00c875' : d <= 30 ? '#579bfc' : d <= 60 ? '#fdab3d' : '#7c3aed'

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

  if (isLoading) return <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading…</div>

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mb-1">Scheduling</p>
          <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Event Types</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">Define the types of meetings attendees can book.</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => open()}>
          New event type
        </Button>
      </div>

      {eventTypes.length === 0 && (
        <div className="os-card p-12 text-center">
          <Layers className="w-10 h-10 text-[var(--os-text-2)] mx-auto mb-3" />
          <p className="text-sm text-[var(--os-text-2)] font-medium mb-3">No event types yet</p>
          <Button size="sm" onClick={() => open()}>Create one</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventTypes.map(et => {
          const dc = DURATION_COLOR(et.duration)
          return (
            <div key={et.id} className={`os-card p-5 ${et.isActive ? '' : 'opacity-60'}`}>
              {/* Icon + name */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#579bfc18' }}>
                  <CalendarCheck className="w-5 h-5" style={{ color: '#579bfc' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[var(--os-text-1)] truncate">{et.name}</p>
                    {!et.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">Inactive</span>
                    )}
                  </div>
                  {et.description && <p className="text-xs text-[var(--os-text-2)] line-clamp-2 mt-0.5">{et.description}</p>}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-[var(--os-text-2)] mb-3">
                {/* Duration badge */}
                <span className="flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${dc}20`, color: dc }}>
                  <Clock className="w-3 h-3" />{et.duration} min
                </span>
                <span className="flex items-center gap-1"><Video className="w-3 h-3" />{VIDEO_LABELS[et.videoProvider]}</span>
                {et.bookingCount !== undefined && (
                  <span className="ml-auto font-semibold text-[var(--os-text-1)]">{et.bookingCount} bookings</span>
                )}
              </div>

              <p className="text-xs text-[var(--os-text-2)] font-mono mb-3 truncate">/schedule/{et.slug}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-[var(--os-border)]">
                <button
                  onClick={() => open(et)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => { if (confirm('Delete this event type?')) remove(et.id) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-transparent text-[var(--os-text-2)] hover:text-[#e2445c] hover:border-[#e2445c]/30 hover:bg-[#e2445c]/10 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={close}>
          <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[var(--os-text-1)]">{editing ? 'Edit event type' : 'New event type'}</h3>
              <button onClick={close} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-5 h-5" /></button>
            </div>

            {[
              { label: 'Name *', key: 'name', type: 'text', placeholder: '30-min intro call' },
              { label: 'Description', key: 'description', type: 'text', placeholder: 'Brief intro and discovery call' },
              { label: 'Location / address', key: 'location', type: 'text', placeholder: 'Online or physical address' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest block mb-1.5">{label}</label>
                <input
                  type={type}
                  value={(form as Record<string, unknown>)[key] as string}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-[#579bfc]"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest block mb-1.5">Duration (minutes)</label>
                <input
                  type="number"
                  min={5}
                  value={form.duration}
                  onChange={e => set('duration', Number(e.target.value))}
                  className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-[#579bfc]"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest block mb-1.5">Video provider</label>
                <select
                  value={form.videoProvider}
                  onChange={e => set('videoProvider', e.target.value)}
                  className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-[#579bfc]"
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
                className={`relative w-9 h-5 rounded-full transition-colors`}
                style={{ background: form.isActive ? '#579bfc' : 'var(--os-text-2)' }}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[var(--os-text-2)]">Active (accepts bookings)</span>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[var(--os-border)]">
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
