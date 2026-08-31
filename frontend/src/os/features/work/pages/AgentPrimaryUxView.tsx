import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Sparkles, ArrowRight, ShieldAlert, Check, X, Play, Clock,
  Search, Brain, Stethoscope, FlaskConical, ListChecks, Scale, CheckCircle2,
} from 'lucide-react'
import { api } from '@lib/api'
import { errorMessage } from '../../../lib/errorMessage'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const PURP = '#7c3aed'
const BLUE = '#579bfc'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'

interface Step {
  id: string; ordinal: number; stage: string; title: string
  detail: string; data: any; durationMs: number | null
}
interface ProposedAction {
  id: string; ordinal: number; actionName: string; params: any
  targetType: string | null; targetId: string | null
  rationale: string; expectedImpact: string | null; status: string
  resultSummary: string | null; errorMessage: string | null
}
interface Mission {
  id: string; intentText: string; status: string
  policyName: string | null; failureReason: string | null
  findings: any; simulations: any; verification: any
  steps: Step[]; actions: ProposedAction[]
}

const STAGE_ICON: Record<string, React.FC<any>> = {
  INTERPRET: Brain, RESOLVE_CONTEXT: Search, ANALYZE: Brain,
  DIAGNOSE: Stethoscope, SIMULATE: FlaskConical, PROPOSE: ListChecks,
  POLICY: Scale, APPROVAL: ShieldAlert, EXECUTE: Play, VERIFY: CheckCircle2,
}

const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  PLANNING:          { color: BLUE, bg: 'rgba(87,155,252,0.1)',  label: 'Planning' },
  AWAITING_APPROVAL: { color: AMB,  bg: 'rgba(245,158,11,0.12)',  label: 'Awaiting approval' },
  APPROVED:          { color: GRN,  bg: 'rgba(16,185,129,0.1)',   label: 'Approved' },
  EXECUTING:         { color: BLUE, bg: 'rgba(87,155,252,0.1)',   label: 'Executing' },
  VERIFYING:         { color: BLUE, bg: 'rgba(87,155,252,0.1)',   label: 'Verifying' },
  COMPLETED:         { color: GRN,  bg: 'rgba(16,185,129,0.1)',   label: 'Completed' },
  REJECTED:          { color: RED,  bg: 'rgba(239,68,68,0.1)',    label: 'Rejected' },
  FAILED:            { color: RED,  bg: 'rgba(239,68,68,0.1)',    label: 'Failed' },
  NO_ACTION:         { color: T2,   bg: 'var(--os-surface-1)',    label: 'No action needed' },
}

const RISK_COLOR: Record<string, string> = {
  OVERDUE: RED, CRITICAL: RED, AT_RISK: AMB, WATCH: AMB, ON_TRACK: GRN,
}

function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap"
      style={{ color, background: bg }}>{children}</span>
  )
}

/** Analysis evidence — the numbers the forecast actually computed. */
function RiskTable({ rows }: { rows: any[] }) {
  return (
    <div className="overflow-x-auto rounded" style={{ border: `1px solid ${BDR}` }}>
      <table className="w-full text-xs" style={{ background: SURF }}>
        <thead>
          <tr style={{ color: T2 }}>
            {['Project', 'Risk', 'Prog', 'Days left', 'Observed', 'Required', 'Slip'].map(h => (
              <th key={h} className="text-left px-2.5 py-1.5 font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.projectId} style={{ borderTop: `1px solid ${BDR}` }}>
              <td className="px-2.5 py-1.5 max-w-[200px] truncate" style={{ color: T1 }}>{r.title}</td>
              <td className="px-2.5 py-1.5">
                <Pill color={RISK_COLOR[r.riskBand] ?? T2} bg="transparent">{r.riskBand}</Pill>
              </td>
              <td className="px-2.5 py-1.5 tabular-nums" style={{ color: T2 }}>{r.progress}%</td>
              <td className="px-2.5 py-1.5 tabular-nums" style={{ color: T2 }}>{r.daysRemaining}</td>
              <td className="px-2.5 py-1.5 tabular-nums" style={{ color: T2 }}>{r.observedVelocity}%/d</td>
              <td className="px-2.5 py-1.5 tabular-nums" style={{ color: T2 }}>{r.requiredVelocity ?? '—'}</td>
              <td className="px-2.5 py-1.5 tabular-nums font-medium" style={{ color: (r.projectedSlipDays ?? 0) > 0 ? RED : GRN }}>
                {r.projectedSlipDays ?? '—'}d
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StageRow({ step }: { step: Step }) {
  const [open, setOpen] = useState(false)
  const Icon = STAGE_ICON[step.stage] ?? Sparkles
  const riskRows = step.stage === 'ANALYZE' ? step.data?.atRisk : null
  const hasDetail = !!step.data

  return (
    <div className="flex gap-3 py-2.5" style={{ borderTop: `1px solid ${BDR}` }}>
      <div className="w-6 h-6 shrink-0 rounded grid place-items-center mt-0.5"
        style={{ background: 'rgba(124,58,237,0.1)' }}>
        <Icon size={13} style={{ color: PURP }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-medium" style={{ color: T1 }}>{step.title}</span>
          <span className="text-[10px] font-mono" style={{ color: T2 }}>{step.stage}</span>
          {step.durationMs != null && (
            <span className="text-[10px] tabular-nums" style={{ color: T2 }}>{step.durationMs}ms</span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: T2 }}>{step.detail}</p>

        {riskRows?.length > 0 && <div className="mt-2"><RiskTable rows={riskRows} /></div>}

        {hasDetail && !riskRows && (
          <button onClick={() => setOpen(v => !v)}
            className="text-[10px] mt-1 underline underline-offset-2" style={{ color: T2 }}>
            {open ? 'Hide evidence' : 'Show evidence'}
          </button>
        )}
        {open && !riskRows && (
          <pre className="mt-1.5 rounded p-2 text-[10px] overflow-x-auto max-h-56"
            style={{ background: SURF, border: `1px solid ${BDR}`, color: T2 }}>
            {JSON.stringify(step.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default function AgentPrimaryUxView() {
  const qc = useQueryClient()
  const [intent, setIntent] = useState('')
  const [missionId, setMissionId] = useState<string | null>(null)

  const { data: samples } = useQuery<{ intents: string[] }>({
    queryKey: ['agent-samples'],
    queryFn: () => api.get('/agent-ux/sample-intents').then(r => r.data),
  })

  const { data: missionData } = useQuery<{ mission: Mission }>({
    queryKey: ['agent-mission', missionId],
    queryFn: () => api.get(`/agent-ux/missions/${missionId}`).then(r => r.data),
    enabled: !!missionId,
  })

  const submit = useMutation({
    mutationFn: () => api.post('/agent-ux/intent', { intentText: intent }).then(r => r.data),
    onSuccess: d => setMissionId(d.mission.id),
  })

  const refresh = () => qc.invalidateQueries({ queryKey: ['agent-mission', missionId] })

  const decide = useMutation({
    mutationFn: (approve: boolean) =>
      api.post(`/agent-ux/missions/${missionId}/${approve ? 'approve' : 'reject'}`, {}).then(r => r.data),
    onSuccess: refresh,
  })
  const execute = useMutation({
    mutationFn: () => api.post(`/agent-ux/missions/${missionId}/execute`, {}).then(r => r.data),
    onSuccess: refresh,
  })

  const m = missionData?.mission
  const cfg = m ? STATUS_CFG[m.status] ?? STATUS_CFG.PLANNING : null
  const busy = submit.isPending || decide.isPending || execute.isPending

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: T1 }}>
          <Sparkles size={18} style={{ color: PURP }} />
          Ask Kangqore
        </h1>
        <p className="text-xs mt-0.5" style={{ color: T2 }}>
          State an outcome. Kangqore reads your live projects, forecasts what will slip, proposes concrete
          changes, and waits for your approval before touching anything.
        </p>
      </div>

      {/* Intent */}
      <div className="rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        <div className="flex gap-2">
          <input
            value={intent}
            onChange={e => setIntent(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && intent.trim() && !busy) submit.mutate() }}
            placeholder="Fix the projects that are going to miss their deadlines."
            className="flex-1 rounded px-3 py-2 text-sm outline-none"
            style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}
          />
          <button
            onClick={() => submit.mutate()}
            disabled={!intent.trim() || busy}
            className="px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
            style={{ background: PURP, color: '#fff' }}
          >
            {submit.isPending ? 'Thinking…' : <>Run <ArrowRight size={13} /></>}
          </button>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {(samples?.intents ?? []).map(s => (
            <button key={s} onClick={() => setIntent(s)}
              className="text-[10px] px-2 py-1 rounded"
              style={{ background: SURF, border: `1px solid ${BDR}`, color: T2 }}>
              {s}
            </button>
          ))}
        </div>
        {submit.isError && (
          <p className="text-xs mt-2" style={{ color: RED }}>
            {errorMessage(submit.error, 'Could not run that intent')}
          </p>
        )}
      </div>

      {/* Mission */}
      {m && (
        <div className="rounded-lg" style={{ background: CARD, border: `1px solid ${BDR}` }}>
          <div className="p-3 flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-medium" style={{ color: T1 }}>{m.intentText}</p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: T2 }}>{m.id}</p>
            </div>
            {cfg && <Pill color={cfg.color} bg={cfg.bg}>{cfg.label}</Pill>}
          </div>

          {m.status === 'NO_ACTION' && (
            <div className="mx-3 mb-3 rounded px-3 py-2 text-xs"
              style={{ background: SURF, color: T2, border: `1px solid ${BDR}` }}>
              {m.failureReason ?? 'Nothing needed doing — no project is forecast to miss its date.'}
            </div>
          )}

          {/* Pipeline */}
          <div className="px-3 pb-1">
            {m.steps.map(s => <StageRow key={s.id} step={s} />)}
          </div>

          {/* Proposals + approval gate */}
          {m.actions.length > 0 && (
            <div className="p-3" style={{ borderTop: `1px solid ${BDR}` }}>
              <div className="text-xs font-semibold mb-2" style={{ color: T1 }}>
                Proposed changes ({m.actions.length})
              </div>
              <div className="space-y-1.5">
                {m.actions.map(a => (
                  <div key={a.id} className="rounded p-2.5"
                    style={{ background: SURF, border: `1px solid ${BDR}` }}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className="text-xs font-mono" style={{ color: PURP }}>{a.actionName}</span>
                      <Pill
                        color={a.status === 'EXECUTED' ? GRN : a.status === 'REJECTED' || a.status === 'FAILED' ? RED : AMB}
                        bg="transparent"
                      >{a.status}</Pill>
                    </div>
                    <p className="text-xs mt-1" style={{ color: T1 }}>{a.rationale}</p>
                    {a.expectedImpact && (
                      <p className="text-[11px] mt-0.5" style={{ color: T2 }}>{a.expectedImpact}</p>
                    )}
                    {a.resultSummary && (
                      <p className="text-[11px] mt-1" style={{ color: GRN }}>{a.resultSummary}</p>
                    )}
                    {a.errorMessage && (
                      <p className="text-[11px] mt-1" style={{ color: RED }}>{a.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>

              {m.status === 'AWAITING_APPROVAL' && (
                <div className="mt-3 rounded p-3 flex items-start gap-2.5 flex-wrap"
                  style={{ background: 'rgba(245,158,11,0.08)', border: `1px solid ${AMB}` }}>
                  <ShieldAlert size={15} style={{ color: AMB }} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold" style={{ color: T1 }}>Your approval is required</p>
                    <p className="text-[11px] mt-0.5" style={{ color: T2 }}>
                      Nothing has been changed yet.
                      {m.policyName ? ` Policy "${m.policyName}" applies.` : ' This mission would modify records.'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => decide.mutate(false)} disabled={busy}
                      className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 disabled:opacity-40"
                      style={{ border: `1px solid ${BDR}`, color: T1 }}>
                      <X size={12} /> Reject
                    </button>
                    <button onClick={() => decide.mutate(true)} disabled={busy}
                      className="px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
                      style={{ background: GRN, color: '#fff' }}>
                      <Check size={12} /> Approve
                    </button>
                  </div>
                </div>
              )}

              {m.status === 'APPROVED' && (
                <button onClick={() => execute.mutate()} disabled={busy}
                  className="mt-3 px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                  style={{ background: PURP, color: '#fff' }}>
                  <Play size={13} /> {execute.isPending ? 'Executing…' : 'Execute approved changes'}
                </button>
              )}

              {(decide.isError || execute.isError) && (
                <p className="text-xs mt-2" style={{ color: RED }}>
                  {errorMessage(decide.error ?? execute.error, 'Action failed')}
                </p>
              )}
            </div>
          )}

          {m.verification && (
            <div className="p-3 flex items-center gap-2" style={{ borderTop: `1px solid ${BDR}` }}>
              <CheckCircle2 size={14} style={{ color: GRN }} />
              <span className="text-xs" style={{ color: T1 }}>
                Verified: {m.verification.resolved} of {m.verification.projectsTouched} project(s) no longer at risk.
              </span>
            </div>
          )}
        </div>
      )}

      {!m && !submit.isPending && (
        <div className="rounded-lg p-6 text-center" style={{ background: CARD, border: `1px dashed ${BDR}` }}>
          <Clock size={20} style={{ color: T2 }} className="mx-auto mb-2" />
          <p className="text-xs" style={{ color: T2 }}>
            No mission yet. Describe an outcome above and Kangqore will plan it against your real projects.
          </p>
        </div>
      )}
    </div>
  )
}
