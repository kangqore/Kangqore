import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Shield, FileText, Download, Clock, CheckCircle2, AlertCircle, Plus, Lock } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GRN  = '#10b981'
const BLUE = '#579bfc'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const PURP = '#7c3aed'

const STATUS_COLOR: Record<string, string> = { PENDING: AMB, IN_PROGRESS: BLUE, COMPLETE: GRN, REJECTED: RED }
const TYPE_COLOR:   Record<string, string> = { ACCESS: BLUE, ERASURE: RED, PORTABILITY: GRN }
const TYPE_ICON: Record<string, string>    = { ACCESS: '👁', ERASURE: '🗑', PORTABILITY: '📦' }

interface DataRequest { id: string; tenantId?: string; requestType: string; requestedBy?: string; status: string; dueDate?: string; completedAt?: string; notes?: string; createdAt: string }
interface RetentionPolicy { dataType: string; retentionDays: number; basis: string }

export function PrivacyDashboardPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm]       = useState(false)
  const [showDPA, setShowDPA]         = useState(false)
  const [form, setForm]               = useState({ requestType: 'ACCESS', requestedBy: '', tenantId: '', notes: '' })
  const [dpaForm, setDpaForm]         = useState({ controllerName: '', controllerEmail: '', processorName: 'Kangqore Ltd' })

  const { data: reqData }  = useQuery({ queryKey: ['gdpr-requests'],  queryFn: () => api.get('/admin/kangqore-immp/gdpr/requests').then(r => r.data) })
  const { data: retData }  = useQuery({ queryKey: ['gdpr-retention'], queryFn: () => api.get('/admin/kangqore-immp/gdpr/retention').then(r => r.data) })

  const createMut = useMutation({
    mutationFn: (body: any) => api.post('/admin/kangqore-immp/gdpr/requests', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gdpr-requests'] }); setShowForm(false) },
  })

  const processMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/gdpr/requests/${id}/process`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gdpr-requests'] }),
  })

  const downloadDPA = async () => {
    const res = await api.post('/admin/kangqore-immp/gdpr/dpa', dpaForm, { responseType: 'blob' })
    const url = URL.createObjectURL(res.data)
    const a   = document.createElement('a')
    a.href = url; a.download = 'kangqore-dpa.json'; a.click()
    URL.revokeObjectURL(url)
    setShowDPA(false)
  }

  const requests: DataRequest[]      = reqData?.requests ?? []
  const retPolicies: RetentionPolicy[] = retData?.policies ?? []
  const pending   = requests.filter(r => r.status === 'PENDING').length
  const overdue   = requests.filter(r => r.dueDate && new Date(r.dueDate) < new Date() && r.status !== 'COMPLETE').length

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Privacy Dashboard" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>Privacy &amp; GDPR Dashboard</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
            Data subject rights · DPA generator · Retention policy
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDPA(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg"
            style={{ background: `${PURP}18`, color: PURP, border: `1px solid ${PURP}30` }}>
            <FileText className="w-3.5 h-3.5" /> Generate DPA
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg"
            style={{ background: BLUE, color: '#fff' }}>
            <Plus className="w-3.5 h-3.5" /> New Request
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: 'Total Requests',  v: requests.length, color: T1   },
          { l: 'Pending',         v: pending,          color: AMB  },
          { l: 'Overdue',         v: overdue,          color: RED  },
          { l: 'Completed',       v: requests.filter(r => r.status === 'COMPLETE').length, color: GRN },
        ].map(s => (
          <div key={s.l} className="rounded-xl p-4 text-center" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.v}</p>
            <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: T2 }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Rights types banner */}
      <div className="grid grid-cols-3 gap-3">
        {['ACCESS','ERASURE','PORTABILITY'].map(type => (
          <div key={type} className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: `${TYPE_COLOR[type]}0c`, border: `1px solid ${TYPE_COLOR[type]}30` }}>
            <span className="text-2xl">{TYPE_ICON[type]}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: TYPE_COLOR[type] }}>Right to {type === 'ACCESS' ? 'Access' : type === 'ERASURE' ? 'Erasure' : 'Portability'}</p>
              <p className="text-[10px] mt-0.5" style={{ color: T2 }}>
                {type === 'ACCESS' ? 'Subject access request — 30 day deadline'
                 : type === 'ERASURE' ? 'Right to be forgotten — anonymise PII'
                 : 'Export all data in machine-readable format'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Requests table */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
          <Lock className="w-4 h-4" style={{ color: T2 }} />
          <p className="text-sm font-semibold" style={{ color: T1 }}>Active Data Requests</p>
        </div>
        <div style={{ background: CARD }}>
          {requests.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: T2 }}>No GDPR requests yet.</p>
          )}
          {requests.map((r, i) => {
            const color = STATUS_COLOR[r.status] ?? AMB
            const tColor = TYPE_COLOR[r.requestType] ?? BLUE
            const isOverdue = r.dueDate && new Date(r.dueDate) < new Date() && r.status !== 'COMPLETE'
            return (
              <div key={r.id} className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: i < requests.length - 1 ? `1px solid ${BDR}` : undefined }}>
                <span className="text-lg">{TYPE_ICON[r.requestType]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: tColor }}>{r.requestType}</span>
                    {isOverdue && <span className="text-[9px] font-bold px-1.5 rounded-full" style={{ background: `${RED}18`, color: RED }}>OVERDUE</span>}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: T2 }}>
                    {r.requestedBy ? `Requested by: ${r.requestedBy}` : 'Anonymous request'}
                    {r.dueDate && ` · Due: ${new Date(r.dueDate).toLocaleDateString('en-GB')}`}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}18`, color }}>
                  {r.status.replace('_', ' ')}
                </span>
                {r.status === 'PENDING' && (
                  <button onClick={() => processMut.mutate(r.id)}
                    disabled={processMut.isPending}
                    className="text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{ background: `${BLUE}18`, color: BLUE }}>
                    {processMut.isPending ? '…' : 'Process'}
                  </button>
                )}
                {r.status === 'COMPLETE' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: GRN }} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Retention policies */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
        <div className="px-5 py-3" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
          <p className="text-sm font-semibold" style={{ color: T1 }}>Data Retention Policies</p>
        </div>
        <div style={{ background: CARD }}>
          {retPolicies.map((p, i) => (
            <div key={p.dataType} className="flex items-center gap-3 px-5 py-3"
              style={{ borderBottom: i < retPolicies.length - 1 ? `1px solid ${BDR}` : undefined }}>
              <div className="flex-1">
                <p className="text-xs font-semibold" style={{ color: T1 }}>{p.dataType}</p>
                <p className="text-[10px] mt-0.5" style={{ color: T2 }}>{p.basis}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-lg font-variant-numeric"
                style={{ background: `${BLUE}12`, color: BLUE }}>
                {Math.round(p.retentionDays / 365)}yr
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Request Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md space-y-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <h3 className="font-black text-lg" style={{ color: T1 }}>New GDPR Request</h3>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Request Type</label>
              <select value={form.requestType} onChange={e => setForm(p => ({ ...p, requestType: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}>
                <option value="ACCESS">Access — Subject Access Request</option>
                <option value="ERASURE">Erasure — Right to be Forgotten</option>
                <option value="PORTABILITY">Portability — Data Export</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Requested By</label>
              <input type="text" placeholder="Name or email of data subject"
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
                value={form.requestedBy} onChange={e => setForm(p => ({ ...p, requestedBy: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Tenant ID (optional)</label>
              <input type="text" placeholder="TenantOrganisation.id"
                className="w-full text-sm px-3 py-2 rounded-lg"
                style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
                value={form.tenantId} onChange={e => setForm(p => ({ ...p, tenantId: e.target.value }))} />
            </div>
            <div className="rounded-xl p-3" style={{ background: `${AMB}12`, border: `1px solid ${AMB}30` }}>
              <p className="text-xs" style={{ color: T2 }}>
                <Clock className="w-3 h-3 inline mr-1" style={{ color: AMB }} />
                30-day statutory deadline will be automatically set. Process via the ⚡ Process button once created.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 text-sm py-2 rounded-lg" style={{ background: `${BDR}50`, color: T2 }}>Cancel</button>
              <button onClick={() => createMut.mutate({ requestType: form.requestType, requestedBy: form.requestedBy || undefined, tenantId: form.tenantId || undefined })}
                disabled={createMut.isPending}
                className="flex-1 text-sm font-semibold py-2 rounded-lg" style={{ background: BLUE, color: '#fff' }}>
                {createMut.isPending ? 'Creating…' : 'Create Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DPA Generator Modal */}
      {showDPA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md space-y-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" style={{ color: PURP }} />
              <h3 className="font-black text-lg" style={{ color: T1 }}>Generate DPA Document</h3>
            </div>
            {[
              { label: 'Controller Name', key: 'controllerName', placeholder: 'Your Organisation Ltd' },
              { label: 'Controller Email', key: 'controllerEmail', placeholder: 'dpo@yourorg.com' },
              { label: 'Processor Name', key: 'processorName', placeholder: 'Kangqore Ltd' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>{f.label}</label>
                <input type="text" placeholder={f.placeholder}
                  className="w-full text-sm px-3 py-2 rounded-lg"
                  style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
                  value={(dpaForm as any)[f.key]}
                  onChange={e => setDpaForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowDPA(false)} className="flex-1 text-sm py-2 rounded-lg" style={{ background: `${BDR}50`, color: T2 }}>Cancel</button>
              <button onClick={downloadDPA}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-lg" style={{ background: PURP, color: '#fff' }}>
                <Download className="w-3.5 h-3.5" /> Download DPA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
