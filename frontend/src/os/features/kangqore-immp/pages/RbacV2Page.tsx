import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const DEPTS = ['Projects', 'Finance', 'CRM', 'WAANDA', 'AEGIS', 'Analytics', 'Workflows', 'Signals']
const ALL_PERMS = [
  'projects:read', 'projects:write', 'finance:read', 'finance:write',
  'crm:read', 'crm:write', 'waanda:use', 'waanda:admin',
  'aegis:view', 'aegis:admin', 'reports:read', 'analytics:read',
  'analytics:export', 'admin:none', 'admin:full',
]

export function RbacV2Page() {
  const qc = useQueryClient()
  const [name, setName]           = useState('')
  const [description, setDesc]    = useState('')
  const [permissions, setPerms]   = useState<string[]>([])
  const [deptScope, setDeptScope] = useState<string[]>([])
  const [editing, setEditing]     = useState<any>(null)

  const rolesQ = useQuery({ queryKey: ['rbac-roles'], queryFn: () => api.get('/admin/kangqore-immp/enterprise/rbac/roles').then(r => r.data), staleTime: 15_000 })

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/enterprise/rbac/roles', { name, description, permissions, deptScope }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rbac-roles'] }); setName(''); setDesc(''); setPerms([]); setDeptScope([]) },
  })
  const updateMut = useMutation({
    mutationFn: () => api.put(`/admin/kangqore-immp/enterprise/rbac/roles/${editing.id}`, { name, description, permissions, deptScope }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rbac-roles'] }); setEditing(null); setName(''); setDesc(''); setPerms([]); setDeptScope([]) },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/kangqore-immp/enterprise/rbac/roles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rbac-roles'] }),
  })

  const startEdit = (r: any) => {
    setEditing(r); setName(r.name); setDesc(r.description ?? ''); setPerms(r.permissions ?? []); setDeptScope(r.deptScope ?? [])
  }
  const cancelEdit = () => { setEditing(null); setName(''); setDesc(''); setPerms([]); setDeptScope([]) }
  const togglePerm = (p: string) => setPerms(ps => ps.includes(p) ? ps.filter(x => x !== p) : [...ps, p])
  const toggleDept = (d: string) => setDeptScope(ds => ds.includes(d) ? ds.filter(x => x !== d) : [...ds, d])

  const roles: any[]       = rolesQ.data?.roles       ?? []
  const defaultPerms: any[] = rolesQ.data?.defaultPermissions ?? ALL_PERMS

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S187 · Access Control</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Advanced RBAC v2</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Custom role builder · permission groups · field-level access · department-scoped views · AEGIS-enforced policy mapping</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Role list */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
            Custom Roles ({roles.length})
          </div>
          {roles.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No custom roles yet. Build one with the role editor.</div>
          ) : roles.map((r: any) => (
            <div key={r.id} style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a40' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ccdde0' }}>{r.name}</div>
                  {r.description && <div style={{ fontSize: 11, color: '#8899aa', marginTop: 2 }}>{r.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(r)} style={{ background: '#4fc3f722', border: '1px solid #4fc3f744', color: '#4fc3f7', padding: '3px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>Edit</button>
                  <button onClick={() => deleteMut.mutate(r.id)} style={{ background: '#ff525222', border: '1px solid #ff525244', color: '#ff5252', padding: '3px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>Delete</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(r.permissions ?? []).slice(0, 6).map((p: string) => (
                  <span key={p} style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#00ddaa18', color: '#00ddaa' }}>{p}</span>
                ))}
                {(r.permissions ?? []).length > 6 && <span style={{ fontSize: 9, color: '#556' }}>+{r.permissions.length - 6} more</span>}
              </div>
              {(r.deptScope ?? []).length > 0 && (
                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {r.deptScope.map((d: string) => <span key={d} style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#a78bfa18', color: '#a78bfa' }}>{d}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Role builder */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            {editing ? `Edit Role: ${editing.name}` : 'New Role'}
          </div>
          <input placeholder="Role name" value={name} onChange={e => setName(e.target.value)}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }} />
          <input placeholder="Description (optional)" value={description} onChange={e => setDesc(e.target.value)}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 14, boxSizing: 'border-box' }} />

          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Permissions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 16 }}>
            {defaultPerms.map((p: string) => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: permissions.includes(p) ? '#00ddaa' : '#8899aa', cursor: 'pointer' }}>
                <input type="checkbox" checked={permissions.includes(p)} onChange={() => togglePerm(p)} style={{ accentColor: '#00ddaa' }} />
                {p}
              </label>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Department Scope</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {DEPTS.map(d => (
              <button key={d} onClick={() => toggleDept(d)}
                style={{ background: deptScope.includes(d) ? '#a78bfa22' : '#263250', border: `1px solid ${deptScope.includes(d) ? '#a78bfa55' : '#3a4a60'}`, color: deptScope.includes(d) ? '#a78bfa' : '#8899aa', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                {d}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => editing ? updateMut.mutate() : createMut.mutate()} disabled={!name || (editing ? updateMut.isPending : createMut.isPending)}
              style={{ flex: 1, background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: (createMut.isPending || updateMut.isPending) ? 0.7 : 1 }}>
              {editing ? (updateMut.isPending ? 'Saving…' : 'Save Changes') : (createMut.isPending ? 'Creating…' : 'Create Role')}
            </button>
            {editing && (
              <button onClick={cancelEdit} style={{ background: '#263250', border: '1px solid #3a4a60', color: '#8899aa', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
