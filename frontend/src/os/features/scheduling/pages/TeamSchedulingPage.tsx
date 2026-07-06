import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil, X, UserPlus, Users, Search } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface TeamMember { userId: string; name: string; email: string }
interface EventType {
  id: string
  name: string
  slug: string
  duration: number
  assignmentStrategy: 'ROUND_ROBIN' | 'COLLECTIVE' | 'HOST_PICK'
  teamMembers?: { user: TeamMember }[]
  isActive: boolean
}
interface UserResult { id: string; name: string; email: string }

const STRATEGY_LABELS = {
  ROUND_ROBIN: 'Round Robin',
  COLLECTIVE:  'Collective',
  HOST_PICK:   'Host Pick',
}

const TEAM_STRATEGIES = ['ROUND_ROBIN', 'COLLECTIVE', 'HOST_PICK'] as const

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const EMPTY_FORM = { name: '', duration: 30, assignmentStrategy: 'ROUND_ROBIN' as const }

export function TeamSchedulingPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState<EventType | null>(null)
  const [form, setForm]           = useState(EMPTY_FORM)

  // member search
  const [memberQuery, setMemberQuery] = useState('')
  const [memberResults, setMemberResults] = useState<UserResult[]>([])
  const [searching, setSearching]     = useState(false)
  const [managingId, setManagingId]   = useState<string | null>(null)

  // load all event types, filter to team ones
  const { data: allEventTypes = [], isLoading } = useQuery<EventType[]>({
    queryKey: ['event-types'],
    queryFn: () => api.get('/scheduling/event-types').then(r => r.data.eventTypes ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const teamEvents = allEventTypes.filter(et => TEAM_STRATEGIES.includes(et.assignmentStrategy as typeof TEAM_STRATEGIES[number]))

  // load members for the event type being managed
  const { data: members = [], isLoading: membersLoading } = useQuery<{ user: TeamMember }[]>({
    queryKey: ['event-type-members', managingId],
    queryFn: () => api.get(`/scheduling/event-types/${managingId}/members`).then(r => r.data.members ?? []),
    enabled: !!managingId && !isDemo(),
    staleTime: 1000 * 30,
  })

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      const slug = toSlug(form.name) + '-' + Date.now().toString(36)
      const payload = {
        name: form.name,
        slug,
        duration: form.duration,
        assignmentStrategy: form.assignmentStrategy,
        isActive: true,
        isPublic: true,
        locationType: 'VIDEO',
        videoProvider: 'JITSI',
        minNotice: 60,
        maxAdvanceDays: 30,
        bufferBefore: 0,
        bufferAfter: 0,
        color: '#2564ea',
      }
      return editing
        ? api.put(`/scheduling/event-types/${editing.id}`, { ...payload, slug: editing.slug })
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

  const { mutate: addMember } = useMutation({
    mutationFn: (userId: string) => api.post(`/scheduling/event-types/${managingId}/members`, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-type-members', managingId] })
      setMemberResults([])
      setMemberQuery('')
    },
  })

  const { mutate: removeMember } = useMutation({
    mutationFn: (userId: string) => api.delete(`/scheduling/event-types/${managingId}/members/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-type-members', managingId] }),
  })

  const searchUsers = async (q: string) => {
    if (q.length < 2) { setMemberResults([]); return }
    setSearching(true)
    try {
      const res = await api.get('/admin/users', { params: { search: q, limit: 10 } })
      setMemberResults(res.data.users ?? [])
    } catch {
      setMemberResults([])
    } finally {
      setSearching(false)
    }
  }

  const open = (et?: EventType) => {
    setEditing(et ?? null)
    setForm(et ? { name: et.name, duration: et.duration, assignmentStrategy: et.assignmentStrategy } : EMPTY_FORM)
    setShowModal(true)
  }
  const close = () => { setShowModal(false); setEditing(null) }
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const managing = managingId ? teamEvents.find(et => et.id === managingId) : null

  if (isLoading) return <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading…</div>

  // Member management panel
  if (managing) {
    return (
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setManagingId(null)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
            ← Back
          </button>
          <h2 className="text-lg font-bold text-[var(--os-text-1)]">Members · {managing.name}</h2>
        </div>

        {/* Search + add */}
        <Card>
          <CardBody className="p-5 space-y-3">
            <label className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-widest block">Add member</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--os-text-2)]" />
              <input
                type="text"
                value={memberQuery}
                onChange={e => { setMemberQuery(e.target.value); searchUsers(e.target.value) }}
                placeholder="Search by name or email…"
                className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] pl-9 pr-3 focus:outline-none focus:border-blue-400"
              />
              {searching && <Spinner size="sm" className="absolute right-3 top-1/2 -translate-y-1/2" />}
            </div>
            {memberResults.length > 0 && (
              <div className="border border-[var(--os-border)] rounded-xl overflow-hidden divide-y divide-[var(--os-border)]">
                {memberResults.map(u => {
                  const alreadyAdded = members.some(m => m.user.userId === u.id)
                  return (
                    <div key={u.id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--os-text-1)] font-medium truncate">{u.name}</p>
                        <p className="text-xs text-[var(--os-text-2)] truncate">{u.email}</p>
                      </div>
                      {alreadyAdded
                        ? <Badge variant="neutral" size="sm">Added</Badge>
                        : <Button size="sm" leftIcon={<UserPlus className="w-3 h-3" />} onClick={() => addMember(u.id)}>Add</Button>
                      }
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Current members */}
        {membersLoading && <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading members…</div>}
        {!membersLoading && members.length === 0 && (
          <p className="text-sm text-[var(--os-text-2)]">No members yet. Search above to add team members.</p>
        )}
        {members.length > 0 && (
          <Card>
            <div className="divide-y divide-[var(--os-border)]">
              {members.map(m => (
                <div key={m.user.userId} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--os-text-1)]">{m.user.name}</p>
                    <p className="text-xs text-[var(--os-text-2)]">{m.user.email}</p>
                  </div>
                  <button
                    onClick={() => removeMember(m.user.userId)}
                    className="p-1.5 rounded-lg text-[var(--os-text-2)] hover:text-red-400 hover:bg-[var(--os-surface-0)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Team Scheduling</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-1">Round-robin and collective availability across your team.</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => open()}>
          New team event
        </Button>
      </div>

      {teamEvents.length === 0 && (
        <Card><CardBody className="text-center py-12">
          <Users className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-3" />
          <p className="text-sm text-[var(--os-text-2)]">No team events yet</p>
          <Button size="sm" className="mt-4" onClick={() => open()}>Create one</Button>
        </CardBody></Card>
      )}

      <div className="grid gap-3">
        {teamEvents.map(et => (
          <Card key={et.id}>
            <CardBody className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--os-text-1)] mb-1">{et.name}</p>
                  <div className="flex items-center gap-3 text-xs text-[var(--os-text-2)]">
                    <span>{et.duration} min</span>
                    <Badge variant="neutral" size="sm">{STRATEGY_LABELS[et.assignmentStrategy]}</Badge>
                  </div>
                  {(et.teamMembers?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {et.teamMembers!.map(m => (
                        <span key={m.user.userId} className="text-xs bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-1)] px-2 py-0.5 rounded-full">
                          {m.user.name || m.user.email}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setManagingId(et.id)}
                    className="p-1.5 rounded-lg text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors"
                    title="Manage members"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button onClick={() => open(et)} className="p-1.5 rounded-lg text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)] transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this team event type?')) remove(et.id) }}
                    className="p-1.5 rounded-lg text-[var(--os-text-2)] hover:text-red-400 hover:bg-[var(--os-surface-0)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={close}>
          <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--os-text-1)]">{editing ? 'Edit team event' : 'New team event'}</h3>
              <button onClick={close} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-widest block mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Team intro call"
                className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-widest block mb-1.5">Duration (min)</label>
                <input
                  type="number"
                  min={5}
                  value={form.duration}
                  onChange={e => set('duration', Number(e.target.value))}
                  className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-widest block mb-1.5">Assignment</label>
                <select
                  value={form.assignmentStrategy}
                  onChange={e => set('assignmentStrategy', e.target.value)}
                  className="w-full h-9 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="ROUND_ROBIN">Round Robin</option>
                  <option value="COLLECTIVE">Collective</option>
                  <option value="HOST_PICK">Host Pick</option>
                </select>
              </div>
            </div>

            {!editing && (
              <p className="text-xs text-[var(--os-text-2)]">After creating, use the <Users className="w-3 h-3 inline" /> button to add team members.</p>
            )}

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
