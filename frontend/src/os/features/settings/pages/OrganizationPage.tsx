import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Plus, Trash2, UserMinus, Crown, Shield, User, Mail, X, Loader2, Check } from 'lucide-react'
import { api } from '@lib/api'
import { useAuthStore } from '@store/auth'

interface OrgDetail {
  id: string; name: string; slug: string; logoUrl: string | null
}
interface Member {
  id: string; name: string; email: string; avatarUrl: string | null; role: string; orgRole: string; membershipId: string
}
interface Invitation {
  id: string; email: string; role: string; status: string; createdAt: string; expiresAt: string
}

const ROLE_ICON: Record<string, React.ElementType> = {
  OWNER: Crown, ADMIN: Shield, MEMBER: User,
}
const ROLE_C: Record<string, string> = {
  OWNER: '#fdab3d', ADMIN: '#7c3aed', MEMBER: '#579bfc',
}

function Monogram({ name, size = 32 }: { name: string; size?: number }) {
  const ini = name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase()
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white select-none text-xs"
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#2564ea,#0ea5e9)' }}
    >
      {ini}
    </div>
  )
}

function CreateOrgModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const { setCurrentOrg } = useAuthStore()
  const [name, setName] = useState('')
  const create = useMutation({
    mutationFn: () => api.post('/orgs', { name }),
    onSuccess: async (res) => {
      qc.invalidateQueries({ queryKey: ['my-orgs'] })
      const org = res.data.org
      setCurrentOrg({ ...org, role: 'OWNER' })
      onClose()
    },
  })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[var(--os-text-1)]">Create Organisation</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          autoFocus
          placeholder="Organisation name *"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) create.mutate() }}
          className="w-full px-3 py-2.5 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
        />
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-2xl text-sm font-bold text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)]">Cancel</button>
          <button
            disabled={!name.trim() || create.isPending}
            onClick={() => create.mutate()}
            className="px-5 py-2 rounded-2xl text-sm font-bold text-white disabled:opacity-40"
            style={{ background: '#2564ea' }}
          >
            {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InviteModal({ orgId, onClose }: { orgId: string; onClose: () => void }) {
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('MEMBER')
  const invite = useMutation({
    mutationFn: () => api.post(`/orgs/${orgId}/invitations`, { email, role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['org-detail', orgId] }); onClose() },
  })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[var(--os-text-1)]">Invite Team Member</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <input
            autoFocus
            type="email"
            placeholder="Email address *"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-2xl text-sm font-bold text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)]">Cancel</button>
          <button
            disabled={!email.trim() || invite.isPending}
            onClick={() => invite.mutate()}
            className="px-5 py-2 rounded-2xl text-sm font-bold text-white disabled:opacity-40"
            style={{ background: '#2564ea' }}
          >
            {invite.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  )
}

function OrgPanel({ orgId }: { orgId: string }) {
  const qc = useQueryClient()
  const { currentOrg, setCurrentOrg } = useAuthStore()
  const [inviting, setInviting] = useState(false)
  const [editName, setEditName] = useState('')
  const [editing, setEditing] = useState(false)

  const { data, isLoading } = useQuery<{ org: OrgDetail; myRole: string; members: Member[]; invitations: Invitation[] }>({
    queryKey: ['org-detail', orgId],
    queryFn:  () => api.get(`/orgs/${orgId}`).then(r => r.data),
    staleTime: 30_000,
  })

  const updateOrg = useMutation({
    mutationFn: (body: { name?: string; logoUrl?: string }) => api.patch(`/orgs/${orgId}`, body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['org-detail', orgId] })
      qc.invalidateQueries({ queryKey: ['my-orgs'] })
      if (currentOrg?.id === orgId) setCurrentOrg({ ...currentOrg, ...res.data.org })
      setEditing(false)
    },
  })

  const removeMember = useMutation({
    mutationFn: (membershipId: string) => api.delete(`/orgs/${orgId}/members/${membershipId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org-detail', orgId] }),
  })

  const cancelInvite = useMutation({
    mutationFn: (invId: string) => api.delete(`/orgs/${orgId}/invitations/${invId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org-detail', orgId] }),
  })

  const deleteOrg = useMutation({
    mutationFn: () => api.delete(`/orgs/${orgId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-orgs'] })
      if (currentOrg?.id === orgId) setCurrentOrg(null as any)
    },
  })

  if (isLoading) return (
    <div className="space-y-2 mt-4">
      {[1,2,3].map(i => <div key={i} className="h-12 rounded-2xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}
    </div>
  )

  if (!data) return null

  const { org, myRole, members, invitations } = data
  const isAdmin = myRole === 'OWNER' || myRole === 'ADMIN'

  return (
    <div className="space-y-6 mt-4">
      {/* Org name */}
      <div className="p-5 rounded-2xl border border-[var(--os-border)]" style={{ background: 'var(--os-card)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Organisation Name</p>
          {isAdmin && !editing && (
            <button onClick={() => { setEditName(org.name); setEditing(true) }} className="text-[10px] font-bold text-[#2564ea]">Edit</button>
          )}
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
            />
            <button
              onClick={() => updateOrg.mutate({ name: editName })}
              disabled={!editName.trim() || updateOrg.isPending}
              className="p-2 rounded-2xl text-white disabled:opacity-40"
              style={{ background: '#2564ea' }}
            >
              {updateOrg.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button onClick={() => setEditing(false)} className="p-2 rounded-2xl text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)]">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,100,234,0.08)', border: '1px solid rgba(37,100,234,0.15)' }}>
              <Building2 className="w-4 h-4 text-[#2564ea]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--os-text-1)]">{org.name}</p>
              <p className="text-[10px] text-[var(--os-text-2)]">kangqore.com/org/{org.slug}</p>
            </div>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="rounded-2xl border border-[var(--os-border)] overflow-hidden" style={{ background: 'var(--os-card)' }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--os-border)]">
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Members ({members.length})</p>
          {isAdmin && (
            <button
              onClick={() => setInviting(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-bold text-white"
              style={{ background: '#2564ea' }}
            >
              <Plus className="w-3 h-3" /> Invite
            </button>
          )}
        </div>
        <div className="divide-y divide-[var(--os-border)]">
          {members.map(m => {
            const RoleIcon = ROLE_ICON[m.orgRole] ?? User
            return (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                {m.avatarUrl
                  ? <img src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  : <Monogram name={m.name} />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--os-text-1)] truncate">{m.name}</p>
                  <p className="text-[10px] text-[var(--os-text-2)] truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-2xl text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: `${ROLE_C[m.orgRole] ?? '#579bfc'}15`, color: ROLE_C[m.orgRole] ?? '#579bfc' }}>
                    <RoleIcon className="w-2.5 h-2.5" /> {m.orgRole}
                  </span>
                  {isAdmin && m.orgRole !== 'OWNER' && (
                    <button
                      onClick={() => { if (confirm(`Remove ${m.name}?`)) removeMember.mutate(m.membershipId) }}
                      className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="rounded-2xl border border-[var(--os-border)] overflow-hidden" style={{ background: 'var(--os-card)' }}>
          <p className="px-5 py-3.5 border-b border-[var(--os-border)] text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">
            Pending Invitations ({invitations.length})
          </p>
          <div className="divide-y divide-[var(--os-border)]">
            {invitations.map(inv => (
              <div key={inv.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--os-surface-0)' }}>
                  <Mail className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--os-text-1)] truncate">{inv.email}</p>
                  <p className="text-[10px] text-[var(--os-text-2)]">
                    Expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider flex-shrink-0">Pending</span>
                {isAdmin && (
                  <button
                    onClick={() => cancelInvite.mutate(inv.id)}
                    className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      {myRole === 'OWNER' && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/40 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-red-200 dark:border-red-900/40" style={{ background: 'rgba(239,68,68,0.04)' }}>
            <p className="text-[10px] font-black uppercase tracking-wider text-red-500">Danger Zone</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'var(--os-card)' }}>
            <div>
              <p className="text-xs font-bold text-[var(--os-text-1)]">Delete this organisation</p>
              <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">Permanently removes the org and all memberships.</p>
            </div>
            <button
              onClick={() => { if (confirm(`Delete "${org.name}"? This cannot be undone.`)) deleteOrg.mutate() }}
              disabled={deleteOrg.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white disabled:opacity-40"
              style={{ background: '#e2445c' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteOrg.isPending ? 'Deleting…' : 'Delete Org'}
            </button>
          </div>
        </div>
      )}

      {inviting && <InviteModal orgId={orgId} onClose={() => setInviting(false)} />}
    </div>
  )
}

export function OrganizationPage() {
  const { currentOrg, setCurrentOrg, switchOrg } = useAuthStore()
  const [creating, setCreating] = useState(false)
  const [switchingId, setSwitchingId] = useState<string | null>(null)

  const { data: orgsData, isLoading } = useQuery<Array<{ id: string; name: string; slug: string; logoUrl: string | null; role: string }>>({
    queryKey: ['my-orgs'],
    queryFn:  () => api.get('/orgs').then(r => r.data.orgs ?? []),
    staleTime: 30_000,
  })
  const orgs = orgsData ?? []

  const activeOrgId = currentOrg?.id ?? orgs[0]?.id

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Organisations</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Create and manage the organisations you belong to.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white"
          style={{ background: '#2564ea' }}
        >
          <Plus className="w-3.5 h-3.5" /> New Org
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2].map(i => <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}
        </div>
      ) : orgs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--os-border)] py-12 text-center">
          <Building2 className="w-6 h-6 mx-auto mb-2 text-[var(--os-text-2)]" />
          <p className="text-sm font-bold text-[var(--os-text-1)]">No organisations yet</p>
          <p className="text-xs text-[var(--os-text-2)] mt-1">Create one to collaborate with your team.</p>
        </div>
      ) : (
        <>
          {/* Org selector tabs */}
          {orgs.length > 1 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {orgs.map(org => (
                <button
                  key={org.id}
                  disabled={switchingId !== null}
                  onClick={async () => {
                    if (org.id === activeOrgId) return
                    setSwitchingId(org.id)
                    try { await switchOrg(org.id) } finally { setSwitchingId(null) }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all"
                  style={activeOrgId === org.id
                    ? { background: '#2564ea', color: '#fff' }
                    : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }}
                >
                  <Building2 className="w-3 h-3" />
                  {org.name}
                  {switchingId === org.id && <Loader2 className="w-3 h-3 animate-spin" />}
                </button>
              ))}
            </div>
          )}

          {activeOrgId && <OrgPanel orgId={activeOrgId} />}
        </>
      )}

      {creating && <CreateOrgModal onClose={() => setCreating(false)} />}
    </div>
  )
}
