import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Plus, Check, X, RefreshCw, Zap, Users, Cpu, ChevronRight, Settings } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const TEAL = '#14b8a6'
const BLUE = '#579bfc'
const AMB  = '#f59e0b'
const GRN  = '#10b981'
const RED  = '#ef4444'
const PURP = '#7c3aed'

interface Tenant {
  id: string; name: string; subdomain: string
  isolationMode: string; planTier: string
  maxUsers: number; maxAgents: number
  enabledModules: string[]; disabledModules: string[]
  oisSnapshotsPerMonth: number; apiCallsPerDay: number
  isActive: boolean; provisionedAt: string | null
  provisionedBy: string | null; blueprintId: string | null
  createdAt: string
}

interface TenantList { tenants: Tenant[]; total: number; active: number }

const PLAN_CFG: Record<string, { color: string; bg: string }> = {
  FREE:       { color: GRN,  bg: 'rgba(16,185,129,0.1)'  },
  STARTER:    { color: BLUE, bg: 'rgba(87,155,252,0.1)'  },
  PRO:        { color: PURP, bg: 'rgba(124,58,237,0.1)'  },
  ENTERPRISE: { color: AMB,  bg: 'rgba(245,158,11,0.1)'  },
}

export function TenantAdminPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<Tenant | null>(null)

  const { data, isLoading, refetch } = useQuery<TenantList>({
    queryKey: ['tenants'],
    queryFn:  () => api.get('/admin/kangqore-immp/tenants').then(r => r.data),
    staleTime: 30_000,
  })

  const provision = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/tenants/${id}/provision`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['tenants'] }); setSelected(null) },
  })

  const tenants = data?.tenants ?? []

  if (selected) {
    return <TenantDetail tenant={selected} onBack={() => setSelected(null)} onProvision={() => provision.mutate(selected.id)} provisioning={provision.isPending} qc={qc} />
  }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(20,184,166,0.12)', border: `1px solid rgba(20,184,166,0.2)` }}>
              <Building2 className="w-6 h-6" style={{ color: TEAL }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold" style={{ color: T1 }}>Multi-Tenant Administration</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: 'rgba(20,184,166,0.1)', color: TEAL }}>S67</span>
              </div>
              <p className="text-xs" style={{ color: T2 }}>
                Provision, manage, and monitor isolated tenant organisations. Each tenant runs Blueprint-governed with row-level data isolation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => refetch()} className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border" style={{ color: T2, borderColor: BDR }}>
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: TEAL, color: '#fff' }}>
              <Plus className="w-3.5 h-3.5" /> New Tenant
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Tenants', value: data.total,  color: BLUE },
            { label: 'Active',        value: data.active, color: GRN  },
            { label: 'Pending',       value: data.total - data.active, color: AMB },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateTenantForm qc={qc} onClose={() => setShowCreate(false)} />}

      {/* Tenant list */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>
      ) : tenants.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border" style={{ borderColor: BDR }}>
          <Building2 className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
          <p className="text-sm font-medium" style={{ color: T2 }}>No tenants yet</p>
          <p className="text-xs mt-1" style={{ color: T2 }}>Create the first tenant to begin multi-tenant provisioning</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b text-[10px] font-semibold uppercase tracking-wider" style={{ borderColor: BDR, color: T2 }}>
            <span>Tenant</span><span>Plan</span><span>Users</span><span>Status</span><span />
          </div>
          {tenants.map(t => {
            const plan = PLAN_CFG[t.planTier] ?? PLAN_CFG.STARTER
            return (
              <div key={t.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b hover:bg-[var(--os-surface-0)] transition-colors cursor-pointer" style={{ borderColor: BDR }} onClick={() => setSelected(t)}>
                <div>
                  <p className="text-sm font-bold" style={{ color: T1 }}>{t.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: T2 }}>{t.subdomain}.kangqore.app · {t.isolationMode.replace('_', ' ')}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: plan.bg, color: plan.color }}>{t.planTier}</span>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: T2 }}><Users className="w-3 h-3" /> {t.maxUsers}</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={t.provisionedAt ? { background: 'rgba(16,185,129,0.1)', color: GRN } : { background: 'rgba(245,158,11,0.1)', color: AMB }}>
                  {t.provisionedAt ? 'Live' : 'Pending'}
                </span>
                <ChevronRight className="w-4 h-4" style={{ color: T2 }} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CreateTenantForm({ qc, onClose }: { qc: ReturnType<typeof useQueryClient>; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', subdomain: '', planTier: 'STARTER', maxUsers: '10', maxAgents: '20' })

  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/tenants', {
      name:      form.name.trim(),
      subdomain: form.subdomain.trim().toLowerCase(),
      planTier:  form.planTier,
      maxUsers:  parseInt(form.maxUsers) || 10,
      maxAgents: parseInt(form.maxAgents) || 20,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tenants'] }); onClose() },
  })

  const inp = (field: keyof typeof form, ph: string, label: string, type = 'text') => (
    <div>
      <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{label}</p>
      <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={ph} className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
        style={{ borderColor: BDR, background: SURF, color: T1 }} />
    </div>
  )

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>New Tenant Organisation</p>
        <button onClick={onClose} className="text-xs" style={{ color: T2 }}>Cancel</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {inp('name',      'Acme Corp',    'Organisation Name')}
        {inp('subdomain', 'acme',         'Subdomain (unique)')}
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Plan Tier</p>
          <select value={form.planTier} onChange={e => setForm(f => ({ ...f, planTier: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
            style={{ borderColor: BDR, background: SURF, color: T1 }}>
            {['FREE', 'STARTER', 'PRO', 'ENTERPRISE'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        {inp('maxUsers',  '10', 'Max Users',  'number')}
        {inp('maxAgents', '20', 'Max Agents', 'number')}
      </div>
      <button disabled={!form.name.trim() || !form.subdomain.trim() || create.isPending}
        onClick={() => create.mutate()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
        style={{ background: TEAL, color: '#fff' }}>
        <Building2 className="w-4 h-4" />
        {create.isPending ? 'Creating…' : 'Create Tenant'}
      </button>
      {create.isError && <p className="text-xs text-red-500">{(create.error as any)?.response?.data?.error ?? 'Creation failed'}</p>}
    </div>
  )
}

function TenantDetail({ tenant, onBack, onProvision, provisioning, qc }: {
  tenant: Tenant; onBack: () => void; onProvision: () => void; provisioning: boolean
  qc: ReturnType<typeof useQueryClient>
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ planTier: tenant.planTier, maxUsers: String(tenant.maxUsers), maxAgents: String(tenant.maxAgents) })

  const update = useMutation({
    mutationFn: () => api.patch(`/admin/kangqore-immp/tenants/${tenant.id}`, {
      planTier: form.planTier, maxUsers: parseInt(form.maxUsers), maxAgents: parseInt(form.maxAgents),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tenants'] }); setEditing(false); onBack() },
  })

  const plan = PLAN_CFG[tenant.planTier] ?? PLAN_CFG.STARTER

  return (
    <div className="space-y-5 max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: T2 }}>
        <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to tenants
      </button>

      <div className="rounded-2xl border p-6" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: plan.bg }}>
              <Building2 className="w-7 h-7" style={{ color: plan.color }} />
            </div>
            <div>
              <p className="text-lg font-black" style={{ color: T1 }}>{tenant.name}</p>
              <p className="text-xs mt-0.5" style={{ color: T2 }}>{tenant.subdomain}.kangqore.app</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: plan.bg, color: plan.color }}>{tenant.planTier}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={tenant.provisionedAt ? { background: 'rgba(16,185,129,0.1)', color: GRN } : { background: 'rgba(245,158,11,0.1)', color: AMB }}>
                  {tenant.provisionedAt ? `Live since ${new Date(tenant.provisionedAt).toLocaleDateString()}` : 'Not provisioned'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border" style={{ color: T2, borderColor: BDR }}>
              <Settings className="w-3.5 h-3.5" /> Edit
            </button>
            {!tenant.provisionedAt && (
              <button onClick={onProvision} disabled={provisioning}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
                style={{ background: TEAL, color: '#fff' }}>
                <Zap className="w-3.5 h-3.5" />
                {provisioning ? 'Provisioning…' : 'Provision Now'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Max Users',    value: tenant.maxUsers,               icon: Users, color: BLUE },
            { label: 'Max Agents',   value: tenant.maxAgents,              icon: Cpu,   color: PURP },
            { label: 'OIS Snapshots', value: `${tenant.oisSnapshotsPerMonth}/mo`, icon: RefreshCw, color: TEAL },
            { label: 'API Calls',    value: `${tenant.apiCallsPerDay}/day`, icon: Zap,   color: AMB  },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-3" style={{ borderColor: BDR, background: SURF }}>
              <div className="flex items-center gap-1.5 mb-1">
                <s.icon className="w-3 h-3" style={{ color: s.color }} />
                <span className="text-[10px] font-semibold" style={{ color: T2 }}>{s.label}</span>
              </div>
              <p className="text-sm font-bold" style={{ color: T1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {tenant.isolationMode && (
          <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: T2 }}>
            <span className="font-semibold">Isolation:</span> {tenant.isolationMode.replace('_', ' ')}
            {tenant.blueprintId && <><span className="ml-3 font-semibold">Blueprint:</span> {tenant.blueprintId} v{tenant.blueprintVersion}</>}
          </div>
        )}
      </div>

      {editing && (
        <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-sm font-bold" style={{ color: T1 }}>Edit Tenant</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Plan Tier</p>
              <select value={form.planTier} onChange={e => setForm(f => ({ ...f, planTier: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }}>
                {['FREE', 'STARTER', 'PRO', 'ENTERPRISE'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Max Users</p>
              <input type="number" value={form.maxUsers} onChange={e => setForm(f => ({ ...f, maxUsers: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }} />
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Max Agents</p>
              <input type="number" value={form.maxAgents} onChange={e => setForm(f => ({ ...f, maxAgents: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button disabled={update.isPending} onClick={() => update.mutate()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
              style={{ background: TEAL, color: '#fff' }}>
              <Check className="w-3.5 h-3.5" /> {update.isPending ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={() => setEditing(false)} className="text-xs px-3 py-2 rounded-lg border" style={{ color: T2, borderColor: BDR }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
