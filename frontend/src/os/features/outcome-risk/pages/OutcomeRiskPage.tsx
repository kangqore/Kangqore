// Outcome Risk — the whole chain on one screen.
//
//   Intelligence → Decision → Governed Action → Outcome
//
// Pick an outcome, see what money is at risk and what is threatening it, then
// stage a recovery plan and approve it. The approve step is deliberately its
// own click on its own panel: everything above it is a report, and everything
// below it changes records.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle, ShieldCheck, Play, Check, X, TrendingDown,
  ChevronRight, Loader2, Info,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

interface Threat {
  objectId: string; title: string; typeName: string; path: string[]
  predictedRisk: number; exposure: number | null; rootCause: string
  nextBestAction: string; weightedExposure: number; confidence: number
}
interface Assessment {
  target: { id: string; title: string; typeName: string } | null
  scope: string
  exposure: { quantified: number; unquantifiedThreats: number }
  summary: { contributorsExamined: number; atRisk: number; blocked: number; overdue: number; noSignal: number }
  threats: Threat[]
  recommendedActions: { rank: number; action: string; rationale: string; protects: number | null; targetObjectId: string; targetTitle: string }[]
  confidence: number
  caveat: string | null
}

const money = (n: number) => '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 })
const pct = (n: number) => Math.round(n * 100) + '%'

const riskColor = (r: number) => (r >= 0.7 ? '#ef4444' : r >= 0.4 ? '#f59e0b' : '#10b981')

export function OutcomeRiskPage() {
  const qc = useQueryClient()
  const [targetId, setTargetId] = useState<string>('')
  const [missionId, setMissionId] = useState<string>('')

  const targets = useQuery({
    queryKey: ['work-os', 'targets'],
    queryFn: () => api.get('/admin/work-os/assessment/targets').then(r => r.data.targets as { id: string; title: string; typeName: string }[]),
  })

  const assessment = useQuery({
    queryKey: ['work-os', 'assessment', targetId],
    enabled: !!targetId,
    queryFn: () => api.get('/admin/work-os/assessment', { params: { targetId } }).then(r => r.data as Assessment),
  })

  const mission = useQuery({
    queryKey: ['work-os', 'mission', missionId],
    enabled: !!missionId,
    queryFn: () => api.get(`/admin/work-os/recovery/${missionId}`).then(r => r.data.mission),
  })

  const propose = useMutation({
    mutationFn: () => api.post('/admin/work-os/recovery/propose', { targetId }).then(r => r.data),
    onSuccess: d => setMissionId(d.missionId),
  })
  const decide = useMutation({
    mutationFn: (approve: boolean) =>
      api.post(`/admin/work-os/recovery/${missionId}/${approve ? 'approve' : 'reject'}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-os', 'mission', missionId] }),
  })
  const execute = useMutation({
    mutationFn: () => api.post(`/admin/work-os/recovery/${missionId}/execute`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-os', 'mission', missionId] })
      qc.invalidateQueries({ queryKey: ['work-os', 'assessment', targetId] })
    },
  })
  const verify = useMutation({
    mutationFn: () => api.get(`/admin/work-os/recovery/${missionId}/verify`).then(r => r.data),
  })

  const a = assessment.data
  const m = mission.data as any

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 650, color: T1 }}>Outcome Risk</h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: T2, maxWidth: 620 }}>
            What could prevent this outcome, what it is worth, and what to do about it.
            Every figure below is derived from the graph — nothing here is entered by hand.
          </p>
        </div>
        <select
          value={targetId}
          onChange={e => { setTargetId(e.target.value); setMissionId(''); propose.reset() }}
          style={{
            background: CARD, color: T1, border: `1px solid ${BDR}`, borderRadius: 8,
            padding: '9px 12px', fontSize: 13, minWidth: 280,
          }}
        >
          <option value="">Select an outcome…</option>
          {(targets.data ?? []).map(t => (
            <option key={t.id} value={t.id}>{t.title} · {t.typeName}</option>
          ))}
        </select>
      </div>

      {!targetId && (
        <Empty
          icon={<Info size={18} />}
          title="Pick an outcome to assess"
          body={
            targets.data && targets.data.length === 0
              ? 'No goals or outcomes exist in the ontology yet. Create an EnterpriseGoal or Outcome object and it will appear here.'
              : 'The assessment walks backwards from the outcome through everything that contributes to it.'
          }
        />
      )}

      {assessment.isLoading && <Loading label="Walking the contribution graph…" />}

      {a && (
        <>
          {/* ── Exposure ──────────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <Stat
              label="Value at risk"
              value={a.exposure.quantified > 0 ? money(a.exposure.quantified) : '—'}
              tone={a.exposure.quantified > 0 ? '#ef4444' : T2}
              sub={a.exposure.unquantifiedThreats > 0
                ? `${a.exposure.unquantifiedThreats} threat(s) could not be priced`
                : 'All threats priced'}
            />
            <Stat label="Threats" value={String(a.threats.length)} tone="#f59e0b"
                  sub={`${a.summary.contributorsExamined} contributor(s) examined`} />
            <Stat label="Blocked" value={String(a.summary.blocked)} tone={a.summary.blocked ? '#ef4444' : T2}
                  sub={`${a.summary.overdue} overdue`} />
            <Stat label="Confidence" value={pct(a.confidence)} tone={T1}
                  sub={`${a.summary.noSignal} contributor(s) gave no signal`} />
          </div>

          {a.caveat && (
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px',
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8, fontSize: 12.5, color: T1,
            }}>
              <AlertTriangle size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
              <span>{a.caveat}</span>
            </div>
          )}

          {/* ── Ranked threats ────────────────────────────────────────────── */}
          <Panel title="Ranked threats" subtitle="Ordered by value at risk — exposure × likelihood, not alphabetically.">
            {a.threats.length === 0 ? (
              <p style={{ margin: 0, padding: '14px 16px', fontSize: 13, color: T2 }}>
                Nothing contributing to this outcome is currently at risk.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BDR}` }}>
                      {['Threat', 'Reaches the outcome via', 'Risk', 'Exposure', 'Weighted', 'Why'].map(h => (
                        <th key={h} style={{
                          textAlign: h === 'Risk' || h === 'Exposure' || h === 'Weighted' ? 'right' : 'left',
                          padding: '9px 12px', color: T2, fontWeight: 550, whiteSpace: 'nowrap',
                          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {a.threats.map(t => (
                      <tr key={t.objectId} style={{ borderBottom: `1px solid ${BDR}` }}>
                        <td style={{ padding: '10px 12px', color: T1, fontWeight: 550, whiteSpace: 'nowrap' }}>
                          {t.title}
                          <span style={{ color: T2, fontWeight: 400, marginLeft: 8, fontSize: 11 }}>{t.typeName}</span>
                        </td>
                        <td style={{ padding: '10px 12px', color: T2, whiteSpace: 'nowrap' }}>
                          {t.path.length ? t.path.join(' → ') : '—'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          <span style={{ color: riskColor(t.predictedRisk), fontWeight: 600 }}>{pct(t.predictedRisk)}</span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: T1, fontVariantNumeric: 'tabular-nums' }}>
                          {t.exposure === null
                            ? <span style={{ color: T2 }} title="No priceable value is reachable from this object">unpriced</span>
                            : money(t.exposure)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: T1, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                          {t.weightedExposure > 0 ? money(t.weightedExposure) : '—'}
                        </td>
                        <td style={{ padding: '10px 12px', color: T2, maxWidth: 320 }}>{t.rootCause}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          {/* ── Recovery plan ─────────────────────────────────────────────── */}
          <Panel
            title="Recovery plan"
            subtitle="Staging a plan changes nothing. Execution is refused until a human approves it."
          >
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {a.recommendedActions.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: T2 }}>
                  No recovery is needed — nothing contributing to this outcome is at risk.
                </p>
              ) : !missionId ? (
                <>
                  <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {a.recommendedActions.map(r => (
                      <li key={r.rank} style={{ fontSize: 13, color: T1 }}>
                        <strong>{r.action}</strong>
                        <span style={{ color: T2 }}> — {r.targetTitle}. {r.rationale}</span>
                        {r.protects !== null && (
                          <span style={{ color: '#10b981', marginLeft: 6, fontWeight: 550 }}>
                            protects {money(r.protects)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                  <Btn onClick={() => propose.mutate()} busy={propose.isPending} icon={<ShieldCheck size={14} />}>
                    Stage recovery plan
                  </Btn>
                  {propose.isError && <ErrorText err={propose.error} />}
                </>
              ) : (
                <MissionPanel
                  m={m}
                  onApprove={() => decide.mutate(true)}
                  onReject={() => decide.mutate(false)}
                  onExecute={() => execute.mutate()}
                  onVerify={() => verify.mutate()}
                  deciding={decide.isPending}
                  executing={execute.isPending}
                  verifying={verify.isPending}
                  verification={verify.data}
                  error={decide.error ?? execute.error ?? verify.error}
                />
              )}
            </div>
          </Panel>
        </>
      )}
    </div>
  )
}

// ─── Mission: approve → execute → verify ──────────────────────────────────────

function MissionPanel({
  m, onApprove, onReject, onExecute, onVerify,
  deciding, executing, verifying, verification, error,
}: any) {
  if (!m) return <Loading label="Loading mission…" />

  const status: string = m.status
  const actions: any[] = m.actions ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <StatusPill status={status} />
        <span style={{ fontSize: 12, color: T2 }}>
          {actions.length} change(s) staged · mission {m.id.slice(0, 8)}
        </span>
      </div>

      <div style={{ border: `1px solid ${BDR}`, borderRadius: 8, overflow: 'hidden' }}>
        {actions.map((act: any, i: number) => (
          <div key={act.id} style={{
            padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
            borderTop: i ? `1px solid ${BDR}` : 'none', background: SURF,
          }}>
            <code style={{
              fontSize: 11, background: CARD, border: `1px solid ${BDR}`, borderRadius: 4,
              padding: '2px 6px', color: T1, whiteSpace: 'nowrap',
            }}>{act.actionName}</code>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: T1 }}>{act.rationale}</div>
              {act.expectedImpact && (
                <div style={{ fontSize: 11.5, color: T2, marginTop: 2 }}>{act.expectedImpact}</div>
              )}
              {act.errorMessage && (
                <div style={{ fontSize: 11.5, color: '#ef4444', marginTop: 2 }}>{act.errorMessage}</div>
              )}
            </div>
            <ActionStatus status={act.status} />
          </div>
        ))}
      </div>

      {/* The decision itself */}
      {status === 'AWAITING_APPROVAL' && (
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center', padding: 14,
          background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.25)', borderRadius: 8,
        }}>
          <span style={{ flex: 1, fontSize: 13, color: T1 }}>
            Execute recovery plan? These changes modify committed dates and states.
          </span>
          <Btn onClick={onReject} busy={deciding} variant="ghost" icon={<X size={14} />}>Reject</Btn>
          <Btn onClick={onApprove} busy={deciding} icon={<Check size={14} />}>Approve</Btn>
        </div>
      )}

      {status === 'APPROVED' && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ flex: 1, fontSize: 13, color: T2 }}>
            Approved by {m.approvedBy}. Nothing has been changed yet.
          </span>
          <Btn onClick={onExecute} busy={executing} icon={<Play size={14} />}>Execute</Btn>
        </div>
      )}

      {(status === 'COMPLETED' || status === 'FAILED') && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ flex: 1, fontSize: 13, color: T2 }}>
            Executed. Verification re-measures risk on each object that changed.
          </span>
          <Btn onClick={onVerify} busy={verifying} variant="ghost" icon={<TrendingDown size={14} />}>
            Verify outcome
          </Btn>
        </div>
      )}

      {status === 'REJECTED' && (
        <p style={{ margin: 0, fontSize: 13, color: T2 }}>
          Rejected. Nothing was changed, and this mission cannot be executed.
        </p>
      )}

      {verification && (
        <div style={{ border: `1px solid ${BDR}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, color: T2, marginBottom: 10 }}>
            {verification.improved} of {verification.verified} object(s) improved
          </div>
          {verification.outcomes.map((o: any) => (
            <div key={o.objectId} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12.5, padding: '4px 0' }}>
              <span style={{ color: T1, minWidth: 160 }}>{o.title}</span>
              <span style={{ color: T2, fontVariantNumeric: 'tabular-nums' }}>
                {o.riskBefore === null ? '—' : pct(o.riskBefore)}
              </span>
              <ChevronRight size={13} style={{ color: T2 }} />
              <span style={{ color: riskColor(o.riskAfter), fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {pct(o.riskAfter)}
              </span>
              {o.improved === true && <span style={{ color: '#10b981', fontSize: 11 }}>improved</span>}
              {o.improved === false && <span style={{ color: '#f59e0b', fontSize: 11 }}>no improvement</span>}
              {o.improved === null && <span style={{ color: T2, fontSize: 11 }}>not measurable</span>}
            </div>
          ))}
        </div>
      )}

      {error && <ErrorText err={error} />}
    </div>
  )
}

// ─── Small pieces ─────────────────────────────────────────────────────────────

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: T2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 650, color: tone, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: T2, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '13px 16px', borderBottom: `1px solid ${BDR}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T1 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: T2, marginTop: 3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

const STATUS_TONE: Record<string, string> = {
  AWAITING_APPROVAL: '#f59e0b', APPROVED: '#2564ea', EXECUTING: '#2564ea',
  COMPLETED: '#10b981', REJECTED: '#94a3b8', FAILED: '#ef4444', NO_ACTION: '#94a3b8',
}

function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? T2
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: tone,
      border: `1px solid ${tone}55`, background: `${tone}14`,
      borderRadius: 999, padding: '3px 10px',
    }}>{status.replace(/_/g, ' ')}</span>
  )
}

const ACTION_TONE: Record<string, string> = {
  EXECUTED: '#10b981', APPROVED: '#2564ea', AWAITING_APPROVAL: '#f59e0b',
  REJECTED: '#94a3b8', SKIPPED: '#94a3b8', FAILED: '#ef4444', PROPOSED: '#94a3b8',
}
function ActionStatus({ status }: { status: string }) {
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 600, color: ACTION_TONE[status] ?? T2,
      whiteSpace: 'nowrap', letterSpacing: '0.04em',
    }}>{status.replace(/_/g, ' ')}</span>
  )
}

function Btn({ children, onClick, busy, icon, variant = 'solid' }: any) {
  const solid = variant === 'solid'
  return (
    <button
      onClick={onClick}
      disabled={busy}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: solid ? '#2564ea' : 'transparent',
        color: solid ? '#fff' : T1,
        border: solid ? 'none' : `1px solid ${BDR}`,
        borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 550,
        cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
      }}
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}

function Loading({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center', color: T2, fontSize: 13, padding: 16 }}>
      <Loader2 size={15} className="animate-spin" /> {label}
    </div>
  )
}

function Empty({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={{
      background: CARD, border: `1px dashed ${BDR}`, borderRadius: 10,
      padding: '28px 20px', textAlign: 'center', color: T2,
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: T2 }}>{icon}</div>
      <div style={{ fontSize: 14, color: T1, fontWeight: 550 }}>{title}</div>
      <div style={{ fontSize: 12.5, marginTop: 4, maxWidth: 460, marginInline: 'auto' }}>{body}</div>
    </div>
  )
}

function ErrorText({ err }: { err: any }) {
  const msg = err?.response?.data?.error ?? err?.message ?? 'Something went wrong'
  return (
    <div style={{ fontSize: 12.5, color: '#ef4444', display: 'flex', gap: 7, alignItems: 'center' }}>
      <AlertTriangle size={14} /> {msg}
    </div>
  )
}
