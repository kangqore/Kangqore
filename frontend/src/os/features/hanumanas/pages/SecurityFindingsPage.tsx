import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShieldAlert, Plus, Check, AlertTriangle, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const RED  = '#ef4444'
const AMB  = '#f59e0b'
const BLUE = '#579bfc'
const GRN  = '#10b981'
const T2C  = '#9ca3af'

interface Finding {
  id: string; title: string; severity: string; status: string
  cveRef: string | null; description: string; affectedArea: string | null
  discoveredAt: string; resolvedAt: string | null; resolvedBy: string | null
  createdBy: string | null; createdAt: string
}

interface FindingList { findings: Finding[]; total: number }

const SEV_CFG: Record<string, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: '#fff', bg: RED,   border: RED                       },
  HIGH:     { color: RED,   bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
  MEDIUM:   { color: AMB,   bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  LOW:      { color: BLUE,  bg: 'rgba(87,155,252,0.1)',  border: 'rgba(87,155,252,0.3)'  },
  INFO:     { color: T2C,   bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)' },
}

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  OPEN:        { color: RED,  bg: 'rgba(239,68,68,0.1)'  },
  IN_PROGRESS: { color: AMB,  bg: 'rgba(245,158,11,0.1)' },
  RESOLVED:    { color: GRN,  bg: 'rgba(16,185,129,0.1)' },
  WONT_FIX:    { color: T2C,  bg: 'rgba(156,163,175,0.1)'},
}

export function SecurityFindingsPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { data, isLoading, refetch } = useQuery<FindingList>({
    queryKey: ['security-findings', severityFilter, statusFilter],
    queryFn:  () => {
      const params: Record<string, string> = {}
      if (severityFilter !== 'ALL') params.severity = severityFilter
      if (statusFilter   !== 'ALL') params.status   = statusFilter
      return api.get('/admin/kangqore-immp/hanumanas/security-findings', { params }).then(r => r.data)
    },
    staleTime: 30_000,
  })

  const resolve = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/kangqore-immp/hanumanas/security-findings/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['security-findings'] }),
  })

  const findings = data?.findings ?? []
  const open     = findings.filter(f => f.status === 'OPEN').length
  const critical = findings.filter(f => f.severity === 'CRITICAL').length

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)` }}>
              <ShieldAlert className="w-6 h-6" style={{ color: RED }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold" style={{ color: T1 }}>Security Findings</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: 'rgba(239,68,68,0.1)', color: RED }}>S70</span>
              </div>
              <p className="text-xs" style={{ color: T2 }}>
                Pen-test findings, CVE tracking, and remediation workflow. CRITICAL/HIGH findings auto-alert KIMMP.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => refetch()} className="flex items-center gap-1 text-xs px-3 py-2 rounded-2xl border" style={{ color: T2, borderColor: BDR }}>
              <RefreshCw className="w-3 h-3" />
            </button>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold"
              style={{ background: RED, color: '#fff' }}>
              <Plus className="w-3.5 h-3.5" /> Log Finding
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Findings', value: data?.total ?? 0,   color: BLUE },
          { label: 'Open',           value: open,               color: RED  },
          { label: 'Critical',       value: critical,           color: '#dc2626' },
          { label: 'Resolved',       value: findings.filter(f => f.status === 'RESOLVED').length, color: GRN },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {showCreate && <CreateFindingForm qc={qc} onClose={() => setShowCreate(false)} />}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => {
            const cfg = SEV_CFG[sev]
            return (
              <button key={sev} onClick={() => setSeverityFilter(sev)}
                className="px-2.5 py-1 rounded-2xl text-[10px] font-bold transition-colors"
                style={severityFilter === sev
                  ? (cfg ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` } : { background: SURF, color: T1, border: `1px solid ${BDR}` })
                  : { background: SURF, color: T2, border: `1px solid ${BDR}` }}>
                {sev}
              </button>
            )
          })}
        </div>
        <div className="flex gap-1 ml-3">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(st => {
            const cfg = STATUS_CFG[st]
            return (
              <button key={st} onClick={() => setStatusFilter(st)}
                className="px-2.5 py-1 rounded-2xl text-[10px] font-bold transition-colors"
                style={statusFilter === st
                  ? (cfg ? { background: cfg.bg, color: cfg.color } : { background: SURF, color: T1 })
                  : { background: SURF, color: T2, border: `1px solid ${BDR}` }}>
                {st.replace('_', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Findings */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>
      ) : findings.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border" style={{ borderColor: BDR }}>
          <ShieldAlert className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
          <p className="text-sm font-medium" style={{ color: T2 }}>No findings match this filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {findings.map(f => {
            const sev  = SEV_CFG[f.severity] ?? SEV_CFG.INFO
            const stat = STATUS_CFG[f.status] ?? STATUS_CFG.OPEN
            const open = expanded === f.id
            return (
              <div key={f.id} className="rounded-2xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[var(--os-surface-0)] transition-colors"
                  onClick={() => setExpanded(open ? null : f.id)}>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-black px-2 py-1 rounded-2xl" style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                      {f.severity}
                    </span>
                    <AlertTriangle className="w-4 h-4" style={{ color: sev.color === '#fff' ? RED : sev.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: T1 }}>{f.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: T2 }}>
                      {f.affectedArea && `${f.affectedArea} · `}
                      {f.cveRef && <span className="font-mono">{f.cveRef} · </span>}
                      {new Date(f.discoveredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: stat.bg, color: stat.color }}>{f.status.replace('_', ' ')}</span>
                  {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: T2 }} /> : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: T2 }} />}
                </div>

                {open && (
                  <div className="px-5 pb-5 pt-0 border-t space-y-4" style={{ borderColor: BDR }}>
                    <p className="text-xs mt-4" style={{ color: T2 }}>{f.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {f.status !== 'RESOLVED' && (
                        <button onClick={() => resolve.mutate({ id: f.id, status: 'RESOLVED' })}
                          disabled={resolve.isPending}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
                          style={{ background: 'rgba(16,185,129,0.1)', color: GRN }}>
                          <Check className="w-3.5 h-3.5" /> Mark Resolved
                        </button>
                      )}
                      {f.status === 'OPEN' && (
                        <button onClick={() => resolve.mutate({ id: f.id, status: 'IN_PROGRESS' })}
                          disabled={resolve.isPending}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
                          style={{ background: 'rgba(245,158,11,0.1)', color: AMB }}>
                          In Progress
                        </button>
                      )}
                      {f.status !== 'WONT_FIX' && (
                        <button onClick={() => resolve.mutate({ id: f.id, status: 'WONT_FIX' })}
                          disabled={resolve.isPending}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
                          style={{ background: SURF, color: T2 }}>
                          <X className="w-3.5 h-3.5" /> Won't Fix
                        </button>
                      )}
                      {f.resolvedAt && <span className="text-[10px]" style={{ color: T2 }}>Resolved {new Date(f.resolvedAt).toLocaleDateString()}{f.resolvedBy ? ` by ${f.resolvedBy}` : ''}</span>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CreateFindingForm({ qc, onClose }: { qc: ReturnType<typeof useQueryClient>; onClose: () => void }) {
  const [form, setForm] = useState({
    title: '', severity: 'HIGH', description: '', affectedArea: '', cveRef: '',
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/hanumanas/security-findings', {
      title: form.title.trim(), severity: form.severity,
      description: form.description.trim(),
      affectedArea: form.affectedArea || null, cveRef: form.cveRef || null,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['security-findings'] }); onClose() },
  })

  const inp = (field: keyof typeof form, ph: string, label: string) => (
    <div>
      <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{label}</p>
      <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={ph} className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
        style={{ borderColor: BDR, background: SURF, color: T1 }} />
    </div>
  )

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Log Security Finding</p>
        <button onClick={onClose} className="text-xs" style={{ color: T2 }}>Cancel</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {inp('title',        'SQL Injection in /api/users endpoint',   'Title')}
        {inp('affectedArea', 'backend/auth',                           'Affected Area')}
        {inp('cveRef',       'CVE-2024-XXXXX (optional)',              'CVE Reference')}
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Severity</p>
          <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
            style={{ borderColor: BDR, background: SURF, color: T1 }}>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Description</p>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3} placeholder="Describe the finding, impact, and reproduction steps…"
          className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none resize-none"
          style={{ borderColor: BDR, background: SURF, color: T1 }} />
      </div>
      <button disabled={!form.title.trim() || !form.description.trim() || create.isPending}
        onClick={() => create.mutate()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-40"
        style={{ background: RED, color: '#fff' }}>
        <ShieldAlert className="w-4 h-4" />
        {create.isPending ? 'Logging…' : 'Log Finding'}
      </button>
    </div>
  )
}
