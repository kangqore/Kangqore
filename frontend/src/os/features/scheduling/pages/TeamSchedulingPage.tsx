import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil, X, UserPlus, Users } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface TeamEventType {
  id: string
  name: string
  duration: number
  assignmentStrategy: 'ROUND_ROBIN' | 'COLLECTIVE' | 'HOST_PICK'
  members: { userId: string; name: string; email: string }[]
}

const STRATEGY_LABELS = {
  ROUND_ROBIN: 'Round Robin',
  COLLECTIVE:  'Collective (all must be free)',
  HOST_PICK:   'Host picks',
}

const EMPTY_FORM = { name: '', duration: 30, assignmentStrategy: 'ROUND_ROBIN' as const }

export function TeamSchedulingPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState<TeamEventType | null>(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [memberEmail, setMemberEmail] = useState('')
  const [pendingMembers, setPendingMembers] = useState<string[]>([])
  const [addError, setAddError]     = useState('')

  const { data: events = [], isLoading } = useQuery<TeamEventType[]>({
    queryKey: ['team-event-types'],
    queryFn: () => api.get('/scheduling/team-event-types').then(r => r.data.eventTypes ?? r.data ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      const payload = { ...form, memberEmails: pendingMembers }
      return editing
        ? api.put(`/scheduling/team-event-types/${editing.id}`, payload)
        : api.post('/scheduling/team-event-types', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-event-types'] })
      close()
    },
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/team-event-types/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team-event-types'] }),
  })

  const open = (et?: TeamEventType) => {
    setEditing(et ?? null)
    setForm(et ? { name: et.name, duration: et.duration, assignmentStrategy: et.assignmentStrategy } : EMPTY_FORM)
    setPendingMembers(et ? et.members.map(m => m.email) : [])
    setMemberEmail('')
    setAddError('')
    setShowModal(true)
  }
  const close = () => { setShowModal(false); setEditing(null) }
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const addMember = () => {
    if (!memberEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setAddError('Enter a valid email'); return }
    if (pendingMembers.includes(memberEmail)) { setAddError('Already added'); return }
    setPendingMembers(prev => [...prev, memberEmail])
    setMemberEmail('')
    setAddError('')
  }

  if (isLoading) return <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Team Scheduling</h2>
          <p className="text-sm text-slate-500 mt-1">Round-robin and collective availability across team members.</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => open()}>
          New team event
        </Button>
      </div>

      {events.length === 0 && (
        <Card><CardBody className="text-center py-12">
          <Users className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No team events yet</p>
        </CardBody></Card>
      )}

      <div className="grid gap-3">
        {events.map(et => (
          <Card key={et.id}>
            <CardBody className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white mb-1">{et.name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{et.duration} min</span>
                    <Badge variant="neutral" size="sm">{STRATEGY_LABELS[et.assignmentStrategy]}</Badge>
                  </div>
                  {et.members.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {et.members.map(m => (
                        <span key={m.userId} className="text-xs bg-os-s1 text-slate-300 px-2 py-0.5 rounded-full">{m.name || m.email}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => open(et)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-os-s1 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm('Delete?')) remove(et.id) }} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-os-s1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={close}>
          <div className="bg-os-s0 border border-os-border rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">{editing ? 'Edit team event' : 'New team event'}</h3>
              <button onClick={close} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Team intro call"
                className="w-full h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Duration (min)</label>
                <input
                  type="number"
                  min={5}
                  value={form.duration}
                  onChange={e => set('duration', Number(e.target.value))}
                  className="w-full h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Assignment</label>
                <select
                  value={form.assignmentStrategy}
                  onChange={e => set('assignmentStrategy', e.target.value)}
                  className="w-full h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="ROUND_ROBIN">Round Robin</option>
                  <option value="COLLECTIVE">Collective</option>
                  <option value="HOST_PICK">Host Pick</option>
                </select>
              </div>
            </div>

            {/* Members */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Team Members</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                  placeholder="member@example.com"
                  className="flex-1 h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400"
                />
                <Button size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5" />} onClick={addMember}>Add</Button>
              </div>
              {addError && <p className="text-xs text-red-400 mb-2">{addError}</p>}
              <div className="flex flex-wrap gap-1.5">
                {pendingMembers.map(email => (
                  <span key={email} className="flex items-center gap-1 text-xs bg-os-s1 text-slate-300 px-2 py-1 rounded-full">
                    {email}
                    <button onClick={() => setPendingMembers(prev => prev.filter(e => e !== email))} className="text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
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
