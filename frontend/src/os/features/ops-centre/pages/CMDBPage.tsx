import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Cpu, Server, Network, Database, Monitor, Globe, Package, Plus, Pencil, Trash2, X, CheckCircle } from 'lucide-react'
import { api } from '@lib/api'

interface ConfigItem {
  id:            string
  name:          string
  ciType:        string
  status:        string
  environment:   string | null
  owner:         string | null
  version:       string | null
  ipAddress:     string | null
  location:      string | null
  description:   string | null
  dependencies:  string[]
  lastAuditedAt: string | null
  createdAt:     string
}

const CI_TYPE_ICON: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  SERVER:      Server,
  WORKSTATION: Monitor,
  APPLICATION: Package,
  NETWORK:     Network,
  DATABASE:    Database,
  SERVICE:     Globe,
  OTHER:       Cpu,
}

const CI_TYPE_COLOUR: Record<string, string> = {
  SERVER:      '#579bfc',
  WORKSTATION: '#fdab3d',
  APPLICATION: '#7c3aed',
  NETWORK:     '#00c875',
  DATABASE:    '#e2445c',
  SERVICE:     '#00b4d8',
  OTHER:       'var(--os-text-2)',
}

const STATUS_C = {
  OPERATIONAL:    { bg: 'rgba(0,200,117,0.08)',  text: '#00c875' },
  MAINTENANCE:    { bg: 'rgba(253,171,61,0.1)',  text: '#fdab3d' },
  DECOMMISSIONED: { bg: 'rgba(100,100,100,0.08)', text: 'var(--os-text-2)' },
} as Record<string, { bg: string; text: string }>

const ENV_C: Record<string, string> = {
  PROD:    '#e2445c',
  STAGING: '#fdab3d',
  DEV:     '#579bfc',
}

function CITypeIcon({ type, className }: { type: string; className?: string }) {
  const Icon = CI_TYPE_ICON[type] ?? Cpu
  return <Icon className={className} style={{ color: CI_TYPE_COLOUR[type] ?? 'var(--os-text-2)' }} />
}

function AddModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    name: '', ciType: 'APPLICATION', environment: 'PROD', owner: '', version: '', ipAddress: '', location: '', description: '',
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/itil/cmdb', form),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['itil-cmdb'] }); onClose() },
  })

  const field = (k: keyof typeof form, label: string, placeholder = '') => (
    <div>
      <label className="block text-[10px] font-bold text-[var(--os-text-2)] mb-1 uppercase tracking-wider">{label}</label>
      <input
        value={form[k]}
        onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[var(--os-text-1)]">Add Config Item</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {field('name', 'Name *', 'e.g. prod-api-server-01')}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--os-text-2)] mb-1 uppercase tracking-wider">CI Type *</label>
              <select
                value={form.ciType}
                onChange={e => setForm(f => ({ ...f, ciType: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
              >
                {['SERVER','WORKSTATION','APPLICATION','NETWORK','DATABASE','SERVICE','OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--os-text-2)] mb-1 uppercase tracking-wider">Environment</label>
              <select
                value={form.environment}
                onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
              >
                {['PROD','STAGING','DEV'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('owner', 'Owner', 'e.g. Platform Team')}
            {field('version', 'Version', 'e.g. v2.4.1')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field('ipAddress', 'IP / Hostname', '10.0.0.1')}
            {field('location', 'Location', 'AWS us-east-1')}
          </div>
          {field('description', 'Description')}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors">Cancel</button>
          <button
            disabled={!form.name.trim() || create.isPending}
            onClick={() => create.mutate()}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40"
            style={{ background: '#579bfc' }}
          >
            {create.isPending ? 'Adding…' : 'Add CI'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CMDBPage() {
  const qc = useQueryClient()
  const [adding, setAdding]       = useState(false)
  const [filterType, setType]     = useState('')
  const [filterEnv, setEnv]       = useState('')
  const [filterStatus, setStatus] = useState('')

  const params = new URLSearchParams()
  if (filterType)   params.set('ciType',      filterType)
  if (filterEnv)    params.set('environment', filterEnv)
  if (filterStatus) params.set('status',      filterStatus)

  const { data, isLoading } = useQuery<{ rows: ConfigItem[]; total: number }>({
    queryKey: ['itil-cmdb', filterType, filterEnv, filterStatus],
    queryFn:  () => api.get(`/admin/itil/cmdb?${params}`).then(r => r.data),
    staleTime: 60_000,
  })

  const audit = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/itil/cmdb/${id}`, { lastAuditedAt: new Date().toISOString() }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['itil-cmdb'] }),
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/itil/cmdb/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['itil-cmdb'] }),
  })

  const rows  = data?.rows  ?? []
  const total = data?.total ?? 0

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
          style={{ background: '#579bfc' }}
        >
          <Plus className="w-3.5 h-3.5" /> Add CI
        </button>
        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          <select value={filterType}   onChange={e => setType(e.target.value)}   className="px-2.5 py-1.5 text-xs rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none">
            <option value="">All types</option>
            {['SERVER','WORKSTATION','APPLICATION','NETWORK','DATABASE','SERVICE','OTHER'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterEnv}    onChange={e => setEnv(e.target.value)}    className="px-2.5 py-1.5 text-xs rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none">
            <option value="">All envs</option>
            {['PROD','STAGING','DEV'].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setStatus(e.target.value)} className="px-2.5 py-1.5 text-xs rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none">
            <option value="">All statuses</option>
            {['OPERATIONAL','MAINTENANCE','DECOMMISSIONED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <span className="text-xs text-[var(--os-text-2)]">{total} CIs</span>
      </div>

      <div className="rounded-2xl border border-[var(--os-border)] overflow-hidden" style={{ background: 'var(--os-card)' }}>
        {isLoading ? (
          <div className="p-6 space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center">
            <Cpu className="w-6 h-6 mx-auto mb-2 text-[var(--os-text-2)]" />
            <p className="text-sm font-bold text-[var(--os-text-1)]">CMDB is empty</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1">Add your infrastructure and applications.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--os-border)]">
                  {['','Name','Type','Status','Environment','Owner','Version','IP','Last Audit',''].map((h, i) => (
                    <th key={i} className="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--os-border)]">
                {rows.map(ci => {
                  const stc = STATUS_C[ci.status] ?? STATUS_C['OPERATIONAL']
                  return (
                    <tr key={ci.id} className="hover:bg-[var(--os-surface-0)] transition-colors">
                      <td className="px-3 py-3">
                        <CITypeIcon type={ci.ciType} className="w-4 h-4" />
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-bold text-[var(--os-text-1)]">{ci.name}</p>
                        {ci.description && <p className="text-[10px] text-[var(--os-text-2)] truncate max-w-[160px]">{ci.description}</p>}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-bold" style={{ color: CI_TYPE_COLOUR[ci.ciType] ?? 'var(--os-text-2)' }}>{ci.ciType}</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" style={{ background: stc.bg, color: stc.text }}>
                          {ci.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {ci.environment && (
                          <span className="text-[10px] font-bold" style={{ color: ENV_C[ci.environment] ?? 'var(--os-text-2)' }}>{ci.environment}</span>
                        )}
                      </td>
                      <td className="px-3 py-3"><span className="text-xs text-[var(--os-text-2)]">{ci.owner ?? '—'}</span></td>
                      <td className="px-3 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{ci.version ?? '—'}</span></td>
                      <td className="px-3 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{ci.ipAddress ?? '—'}</span></td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-[10px] text-[var(--os-text-2)]">
                          {ci.lastAuditedAt ? new Date(ci.lastAuditedAt).toLocaleDateString() : <span className="text-amber-500">Never</span>}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => audit.mutate(ci.id)}
                            className="w-6 h-6 rounded flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors"
                            title="Mark audited"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete ${ci.name}?`)) del.mutate(ci.id) }}
                            className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete CI"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {adding && <AddModal onClose={() => setAdding(false)} />}
    </div>
  )
}
