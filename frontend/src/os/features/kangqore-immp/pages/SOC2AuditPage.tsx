import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Shield, CheckCircle2, AlertCircle, Clock, Download, Plus, Calendar, Database, Lock } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLUE = '#579bfc'

const STATUS_COLOR: Record<string, string> = {
  IN_PROGRESS: BLUE, SUBMITTED: AMB, COMPLETE: GRN, FAILED: RED,
}
const CTRL_COLOR: Record<string, string> = {
  ACCESS_CONTROL: PURP, AUDIT_LOG: BLUE, INCIDENT: RED, ENCRYPTION: GRN, POLICY: AMB,
}

interface Evidence { id: string; controlId: string; controlName: string; evidenceType: string; sourceTable: string; sourceCount: number; collectedAt: string; description: string }
interface Period { id: string; label: string; auditor?: string; periodStart: string; periodEnd: string; status: string; evidenceCount: number; controlsPassed: number; controlsFailed: number; notes?: string; createdAt: string; evidence: Evidence[] }

export function SOC2AuditPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: 'FY2026 SOC2 Type II', auditor: '', periodStart: '2026-01-01', periodEnd: '2026-12-31' })

  const { data } = useQuery({
    queryKey: ['soc2-periods'],
    queryFn: () => api.get('/admin/kangqore-immp/soc2/periods').then(r => r.data),
  })

  const createMut = useMutation({
    mutationFn: (body: any) => api.post('/admin/kangqore-immp/soc2/periods', body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['soc2-periods'] })
      setShowForm(false)
      setSelected(res.data.period.id)
    },
  })

  const collectMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/soc2/periods/${id}/collect-evidence`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['soc2-periods'] }),
  })

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/kangqore-immp/soc2/periods/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['soc2-periods'] }),
  })

  // controlsPassed/controlsFailed are the only fields on this page meant to
  // reflect a real auditor's verdict — everything else here is either raw
  // technical evidence or admin-entered metadata.
  const [editingVerdict, setEditingVerdict] = useState(false)
  const [verdictForm, setVerdictForm] = useState({ controlsPassed: 0, controlsFailed: 0 })
  const verdictMut = useMutation({
    mutationFn: ({ id, controlsPassed, controlsFailed }: { id: string; controlsPassed: number; controlsFailed: number }) =>
      api.patch(`/admin/kangqore-immp/soc2/periods/${id}`, { controlsPassed, controlsFailed }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['soc2-periods'] }); setEditingVerdict(false) },
  })

  const periods: Period[] = data?.periods ?? []
  const period = periods.find(p => p.id === selected) ?? null

  const CONTROLS_EXPECTED = 10
  const passRate = period ? Math.round((period.controlsPassed / CONTROLS_EXPECTED) * 100) : 0

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="SOC2 Audit" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>SOC2 Type II — Audit Control</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
            12-month audit periods · AEGIS auto-evidence · auditor export
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-2xl"
          style={{ background: PURP, color: '#fff' }}>
          <Plus className="w-3.5 h-3.5" /> New Audit Period
        </button>
      </div>

      {/* Trust criteria banner */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { code: 'CC', label: 'Common Criteria',     color: PURP },
          { code: 'A',  label: 'Availability',        color: BLUE },
          { code: 'C',  label: 'Confidentiality',     color: GRN  },
          { code: 'PI', label: 'Processing Integrity', color: AMB  },
          { code: 'P',  label: 'Privacy',             color: RED  },
        ].map(tc => (
          <div key={tc.code} className="rounded-2xl p-3 text-center"
            style={{ background: `${tc.color}12`, border: `1px solid ${tc.color}40` }}>
            <p className="text-lg font-black" style={{ color: tc.color }}>{tc.code}</p>
            <p className="text-[10px] mt-0.5" style={{ color: T2 }}>{tc.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Period list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T2 }}>Audit Periods</p>
          {periods.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className="w-full text-left rounded-2xl p-4 space-y-1.5 transition-colors"
              style={{ background: selected === p.id ? `${PURP}18` : CARD, border: `1px solid ${selected === p.id ? PURP : BDR}` }}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold" style={{ color: T1 }}>{p.label}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${STATUS_COLOR[p.status] ?? BLUE}20`, color: STATUS_COLOR[p.status] ?? BLUE }}>
                  {p.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs" style={{ color: T2 }}>
                {p.periodStart.slice(0, 10)} → {p.periodEnd.slice(0, 10)}
              </p>
              <p className="text-xs" style={{ color: T2 }}>{p.evidenceCount} controls evidenced</p>
            </button>
          ))}
          {periods.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: T2 }}>No audit periods. Start one above.</p>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {!period && (
            <div className="rounded-2xl p-12 flex flex-col items-center justify-center gap-3 h-full"
              style={{ background: CARD, border: `1px dashed ${BDR}` }}>
              <Shield className="w-8 h-8" style={{ color: T2 }} />
              <p className="text-sm" style={{ color: T2 }}>Select an audit period</p>
            </div>
          )}

          {period && (
            <div className="space-y-4">
              {/* Header */}
              <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BDR}` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-black text-base" style={{ color: T1 }}>{period.label}</h3>
                    {period.auditor && <p className="text-xs mt-0.5" style={{ color: T2 }}>Auditor: {period.auditor}</p>}
                    <p className="text-xs" style={{ color: T2 }}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {period.periodStart.slice(0, 10)} → {period.periodEnd.slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => collectMut.mutate(period.id)}
                      disabled={collectMut.isPending}
                      className="text-xs font-semibold px-3 py-1.5 rounded-2xl"
                      style={{ background: `${BLUE}18`, color: BLUE }}>
                      {collectMut.isPending ? 'Collecting…' : '⚡ Collect Evidence'}
                    </button>
                    <a
                      href={`/api/admin/kangqore-immp/soc2/periods/${period.id}/export`}
                      download
                      className="text-xs font-semibold px-3 py-1.5 rounded-2xl flex items-center gap-1"
                      style={{ background: `${GRN}18`, color: GRN }}>
                      <Download className="w-3 h-3" /> Export
                    </a>
                  </div>
                </div>

                {/* Progress */}
                {editingVerdict ? (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider" style={{ color: T2 }}>Controls Passed (per auditor)</label>
                      <input type="number" min={0} value={verdictForm.controlsPassed}
                        onChange={e => setVerdictForm(f => ({ ...f, controlsPassed: Number(e.target.value) }))}
                        className="w-full text-sm px-3 py-1.5 rounded-2xl mt-1"
                        style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }} />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider" style={{ color: T2 }}>Controls Failed (per auditor)</label>
                      <input type="number" min={0} value={verdictForm.controlsFailed}
                        onChange={e => setVerdictForm(f => ({ ...f, controlsFailed: Number(e.target.value) }))}
                        className="w-full text-sm px-3 py-1.5 rounded-2xl mt-1"
                        style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }} />
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <button onClick={() => setEditingVerdict(false)} className="flex-1 text-xs py-1.5 rounded-2xl" style={{ background: `${BDR}50`, color: T2 }}>Cancel</button>
                      <button onClick={() => verdictMut.mutate({ id: period.id, ...verdictForm })} disabled={verdictMut.isPending}
                        className="flex-1 text-xs font-semibold py-1.5 rounded-2xl" style={{ background: PURP, color: '#fff' }}>
                        {verdictMut.isPending ? 'Saving…' : 'Save auditor verdict'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { l: 'Controls Passed', v: period.controlsPassed, color: GRN },
                      { l: 'Controls Failed', v: period.controlsFailed, color: RED },
                      { l: 'Pass Rate', v: `${passRate}%`, color: passRate >= 80 ? GRN : passRate >= 60 ? AMB : RED },
                    ].map(x => (
                      <div key={x.l} className="rounded-2xl p-3 text-center"
                        style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}` }}>
                        <p className="text-xl font-black" style={{ color: x.color }}>{x.v}</p>
                        <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: T2 }}>{x.l}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!editingVerdict && (
                  <button
                    onClick={() => { setVerdictForm({ controlsPassed: period.controlsPassed, controlsFailed: period.controlsFailed }); setEditingVerdict(true) }}
                    className="text-[10px] font-semibold mb-2"
                    style={{ color: PURP }}>
                    Enter auditor verdict
                  </button>
                )}

                {/* Progress bar */}
                <div className="h-2 rounded-full overflow-hidden" style={{ background: `${BDR}80` }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${passRate}%`, background: passRate >= 80 ? GRN : passRate >= 60 ? AMB : RED }} />
                </div>
                <p className="text-[10px] mt-2" style={{ color: T2 }}>
                  Pass/fail counts are entered manually and should only reflect real auditor feedback —
                  Collect Evidence gathers data, it doesn't decide pass or fail.
                </p>

                {/* Status actions */}
                <div className="flex gap-2 mt-4">
                  {['IN_PROGRESS','SUBMITTED','COMPLETE'].map(s => (
                    <button key={s} onClick={() => statusMut.mutate({ id: period.id, status: s })}
                      className="text-xs font-semibold px-2 py-1 rounded-2xl transition-colors"
                      style={{
                        background: period.status === s ? `${STATUS_COLOR[s]}30` : `${BDR}30`,
                        color: period.status === s ? STATUS_COLOR[s] : T2,
                      }}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence table */}
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
                <div className="px-5 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
                  <Database className="w-4 h-4" style={{ color: T2 }} />
                  <p className="text-sm font-semibold" style={{ color: T1 }}>Evidence Log — {period.evidence?.length ?? 0} controls</p>
                </div>
                <div style={{ background: CARD }}>
                  {(!period.evidence || period.evidence.length === 0) && (
                    <p className="text-xs text-center py-8" style={{ color: T2 }}>
                      No evidence yet — click Collect Evidence to auto-pull from AEGIS.
                    </p>
                  )}
                  {period.evidence?.map((e, i) => (
                    <div key={e.id} className="flex items-center gap-3 px-5 py-3"
                      style={{ borderBottom: i < period.evidence.length - 1 ? `1px solid ${BDR}` : undefined }}>
                      <div className="w-7 h-7 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${CTRL_COLOR[e.evidenceType] ?? PURP}18` }}>
                        <Lock className="w-3.5 h-3.5" style={{ color: CTRL_COLOR[e.evidenceType] ?? PURP }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-[10px] font-mono font-bold" style={{ color: PURP }}>{e.controlId}</code>
                          <p className="text-xs font-medium truncate" style={{ color: T1 }}>{e.controlName}</p>
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: T2 }}>{e.sourceTable} · {e.sourceCount} records</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {e.sourceCount > 0
                          ? <CheckCircle2 className="w-4 h-4" style={{ color: GRN }} />
                          : <AlertCircle className="w-4 h-4" style={{ color: AMB }} />}
                        <span className="text-[10px] font-semibold"
                          style={{ color: e.sourceCount > 0 ? GRN : AMB }}>
                          {e.sourceCount > 0 ? 'DATA PRESENT' : 'NO DATA'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New period form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md space-y-4"
            style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <h3 className="font-black text-lg" style={{ color: T1 }}>Start Audit Period</h3>
            {[
              { label: 'Audit Label', key: 'label', type: 'text', placeholder: 'FY2026 SOC2 Type II' },
              { label: 'Auditor Firm', key: 'auditor', type: 'text', placeholder: 'Deloitte / Ernst & Young' },
              { label: 'Period Start', key: 'periodStart', type: 'date', placeholder: '' },
              { label: 'Period End', key: 'periodEnd', type: 'date', placeholder: '' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>{f.label}</label>
                <input
                  type={f.type}
                  className="w-full text-sm px-3 py-2 rounded-2xl"
                  style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="rounded-2xl p-3" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}30` }}>
              <p className="text-xs" style={{ color: T2 }}>
                <Clock className="w-3 h-3 inline mr-1" style={{ color: BLUE }} />
                After creation, click <strong style={{ color: T1 }}>Collect Evidence</strong> to auto-pull 10 SOC2 controls from AEGIS audit logs, security findings, and access records.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)}
                className="flex-1 text-sm py-2 rounded-2xl" style={{ background: `${BDR}50`, color: T2 }}>
                Cancel
              </button>
              <button
                onClick={() => createMut.mutate({
                  label: form.label, auditor: form.auditor || undefined,
                  periodStart: form.periodStart, periodEnd: form.periodEnd,
                })}
                disabled={createMut.isPending || !form.label || !form.periodStart || !form.periodEnd}
                className="flex-1 text-sm font-semibold py-2 rounded-2xl"
                style={{ background: PURP, color: '#fff' }}>
                {createMut.isPending ? 'Starting…' : 'Start Audit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
