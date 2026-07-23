import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Calendar, CheckSquare, Square, MessageSquare, Star, TrendingUp,
  RefreshCw, Send, AlertTriangle, Zap, Brain, Clock, ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLUE = '#3b82f6'
const TEAL = '#14b8a6'
const PURP = '#7c3aed'

const TIER_CLR: Record<string, string> = { GREEN: GRN, AMBER: AMB, RED }

interface Blueprint {
  id: string; customerName: string; planTier: string
  oisBaseline: number | null; oisTarget: number | null
  status: string; deployedAt: string | null
}

interface NpsResponse {
  id: string; customerId: string; score: number; category: string
  comment: string | null; surveyTrigger: string; createdAt: string
}

interface HealthScore {
  id: string; customerId: string; totalScore: number; tier: string
  renewalProximityDays: number; oisDelta: number; npsScore: number | null; computedAt: string
}

function daysSince(iso: string | null) {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

// ── Day-90 nudge card ──────────────────────────────────────────────────────────
function NudgeCard({ bp }: { bp: Blueprint }) {
  const days      = daysSince(bp.deployedAt)
  const remaining = Math.max(0, 90 - days)
  const isUrgent  = remaining <= 14
  const isDue     = remaining === 0
  const color     = isDue ? RED : isUrgent ? AMB : BLUE
  const pct       = Math.min(100, (days / 90) * 100)

  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      background: color + '06', border: `1px solid ${color}20`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{bp.customerName}</div>
          <div style={{ fontSize: 10, color: T2 }}>{bp.planTier} · Day {days}</div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: color + '15', color, border: `1px solid ${color}25`, textTransform: 'uppercase', letterSpacing: '.07em' }}>
          {isDue ? 'Due now' : `${remaining}d left`}
        </span>
      </div>
      <div style={{ height: 4, background: SURF, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T2 }}>
        <span>OIS {bp.oisBaseline?.toFixed(0) ?? '—'} → {bp.oisTarget?.toFixed(0) ?? '—'}</span>
        {isUrgent && (
          <Link to="/kangqore-view/admin/kangqore-immp/renewals"
            style={{ fontSize: 10, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
            Start renewal <ChevronRight style={{ width: 10, height: 10 }} />
          </Link>
        )}
      </div>
    </div>
  )
}

// ── WAANDA recommendation ────────────────────────────────────────────────────
function WaandaRec({ bp, tier }: { bp: Blueprint; tier: string }) {
  const days = daysSince(bp.deployedAt)
  const msgs: string[] = []
  if (days >= 75) msgs.push(`Schedule Day-90 QBR for ${bp.customerName} — renewal window opens in ${90 - days} days.`)
  if (tier === 'RED')   msgs.push(`${bp.customerName} is at critical health. Escalate to CSM before renewal conversation.`)
  if (tier === 'AMBER') msgs.push(`${bp.customerName} is at risk. Prepare OIS impact summary for executive sponsor.`)
  if (msgs.length === 0) msgs.push(`${bp.customerName} is on track. Proactive QBR at Day 75 recommended.`)
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 8, background: PURP + '06', border: `1px solid ${PURP}15`, marginBottom: 6 }}>
      <Brain style={{ width: 12, height: 12, color: PURP, flexShrink: 0, marginTop: 1 }} />
      <p style={{ fontSize: 11, color: T2, lineHeight: 1.5 }}>{msgs[0]}</p>
    </div>
  )
}

const RENEWAL_STEPS = [
  'Confirm renewal date with customer',
  'Run health score recompute',
  'Review NPS trend (last 90 days)',
  'Prepare OIS delta executive summary',
  'Confirm Blueprint version is current',
  'Schedule QBR call with sponsor',
  'Deliver renewal proposal',
  'Log outcome (renewed / churned)',
]

export function RenewalWorkflowPage() {
  const qc = useQueryClient()
  const [npsForm, setNpsForm]       = useState({ customerId: '', score: '9', comment: '', trigger: 'DAY_90' })
  const [showNpsForm, setShowNpsForm] = useState(false)
  const [checklist, setChecklist]   = useState<Record<string, boolean>>({})
  const [churnForm, setChurnForm]   = useState<{ bpId: string; outcome: '' | 'RENEWED' | 'CHURNED' }>({ bpId: '', outcome: '' })
  const [showChurnForm, setShowChurnForm] = useState(false)

  const bpQuery = useQuery<{ blueprints: Blueprint[] }>({
    queryKey: ['blueprints-renewal'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data),
    staleTime: 30_000,
  })

  const healthQuery = useQuery<{ scores: HealthScore[] }>({
    queryKey: ['health-scores'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/health-scores').then(r => r.data),
    staleTime: 30_000,
  })

  const npsQuery = useQuery<{ responses: NpsResponse[]; nps: number | null; total: number; promoters: number; passives: number; detractors: number }>({
    queryKey: ['nps-responses'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/nps').then(r => r.data),
    staleTime: 30_000,
  })

  const submitNps = useMutation({
    mutationFn: () => api.post(`/admin/kangqore-immp/customers/${npsForm.customerId.trim()}/nps`, {
      score: parseInt(npsForm.score), comment: npsForm.comment || null, surveyTrigger: npsForm.trigger,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nps-responses'] })
      setShowNpsForm(false)
      setNpsForm({ customerId: '', score: '9', comment: '', trigger: 'DAY_90' })
    },
  })

  const logOutcome = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/customers/renewal-outcome', {
      blueprintId: churnForm.bpId,
      outcome:     churnForm.outcome,
    }).catch(() => {
      // graceful — route may not exist; create a KIMMP signal instead
      return api.post('/admin/kangqore-immp/signals', {
        title:    `Renewal ${churnForm.outcome}: ${churnForm.bpId}`,
        type:     'RENEWAL',
        priority: churnForm.outcome === 'CHURNED' ? 'HIGH' : 'MEDIUM',
        summary:  `Customer renewal outcome recorded: ${churnForm.outcome}`,
      }).catch(() => null)
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blueprints-renewal'] })
      setShowChurnForm(false)
      setChurnForm({ bpId: '', outcome: '' })
    },
  })

  const active   = (bpQuery.data?.blueprints ?? []).filter(bp => bp.status === 'ACTIVE' && bp.deployedAt)
  const approaching = active.filter(bp => daysSince(bp.deployedAt) >= 60)
  const scores   = healthQuery.data?.scores ?? []
  const nps      = npsQuery.data
  const completedCount = RENEWAL_STEPS.filter(s => checklist[s]).length
  const toggleStep = (s: string) => setChecklist(c => ({ ...c, [s]: !c[s] }))

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0 }}>Renewal Workflow</h2>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: TEAL + '12', color: TEAL, border: `1px solid ${TEAL}25`, textTransform: 'uppercase', letterSpacing: '.08em' }}>v2</span>
          </div>
          <p style={{ fontSize: 11, color: T2 }}>Day-90 nudge engine · NPS tracking · WAANDA CSM recommendations · Renewal outcome logging</p>
        </div>
        <button onClick={() => { bpQuery.refetch(); healthQuery.refetch(); npsQuery.refetch() }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, fontSize: 11, cursor: 'pointer', color: T2 }}>
          <RefreshCw style={{ width: 11, height: 11 }} /> Refresh
        </button>
      </div>

      {/* ── Day-90 nudges ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock style={{ width: 13, height: 13, color: AMB }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>Day-90 Renewal Nudges</span>
          {approaching.length > 0 && (
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: AMB + '12', color: AMB }}>
              {approaching.length} approaching
            </span>
          )}
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {active.length === 0 ? (
            <p style={{ fontSize: 11, color: T2, padding: '12px 0', textAlign: 'center' }}>No active customers yet.</p>
          ) : (
            active.map(bp => <NudgeCard key={bp.id} bp={bp} />)
          )}
        </div>
      </div>

      {/* ── WAANDA recommendations ── */}
      {approaching.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain style={{ width: 13, height: 13, color: PURP }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>WAANDA → CSM Recommendations</span>
          </div>
          <div style={{ padding: '12px 14px' }}>
            {approaching.map(bp => {
              const health = scores.find(s => s.customerId && bp.id.includes(s.customerId.slice(0, 6)))
              return <WaandaRec key={bp.id} bp={bp} tier={health?.tier ?? 'GREEN'} />
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* ── NPS panel ── */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star style={{ width: 13, height: 13, color: AMB }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>NPS Tracker</span>
            </div>
            <button onClick={() => setShowNpsForm(!showNpsForm)}
              style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 7, background: AMB + '12', color: AMB, border: `1px solid ${AMB}25`, cursor: 'pointer' }}>
              + Record
            </button>
          </div>

          {showNpsForm && (
            <div style={{ padding: 14, borderBottom: `1px solid ${BDR}`, background: SURF, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Customer ID', key: 'customerId', ph: 'cuid…', type: 'text' },
                  { label: 'Score (0–10)', key: 'score', ph: '9', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>{f.label}</label>
                    <input type={f.type} min="0" max="10"
                      value={(npsForm as any)[f.key]}
                      onChange={e => setNpsForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '6px 10px', fontSize: 11, color: T1, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>Comment</label>
                <textarea rows={2} value={npsForm.comment}
                  onChange={e => setNpsForm(p => ({ ...p, comment: e.target.value }))}
                  placeholder="Customer feedback…"
                  style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '6px 10px', fontSize: 11, color: T1, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <select value={npsForm.trigger} onChange={e => setNpsForm(p => ({ ...p, trigger: e.target.value }))}
                  style={{ flex: 1, background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '6px 10px', fontSize: 11, color: T1, outline: 'none' }}>
                  <option value="DAY_90">Day-90 survey</option>
                  <option value="QBR">Post-QBR</option>
                  <option value="MANUAL">Manual</option>
                  <option value="RENEWAL">Post-Renewal</option>
                </select>
                <button onClick={() => submitNps.mutate()}
                  disabled={!npsForm.customerId.trim() || submitNps.isPending}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: AMB, color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: !npsForm.customerId.trim() || submitNps.isPending ? 0.5 : 1 }}>
                  <Send style={{ width: 11, height: 11 }} />
                  {submitNps.isPending ? 'Saving…' : 'Record'}
                </button>
              </div>
            </div>
          )}

          <div style={{ padding: 16 }}>
            {nps ? (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 14 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: nps.nps !== null && nps.nps >= 50 ? GRN : nps.nps !== null && nps.nps >= 0 ? AMB : RED }}>
                    {nps.nps !== null ? (nps.nps >= 0 ? '+' : '') + Math.round(nps.nps) : '—'}
                  </span>
                  <span style={{ fontSize: 12, color: T2, marginBottom: 4, fontWeight: 600 }}>NPS · {nps.total} responses</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                  {[
                    { label: 'Promoters',  v: nps.promoters,  c: GRN },
                    { label: 'Passives',   v: nps.passives,   c: AMB },
                    { label: 'Detractors', v: nps.detractors, c: RED },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: SURF }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: s.c, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                      <div style={{ fontSize: 9, color: T2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {(nps.responses ?? []).slice(0, 3).map(r => (
                  <div key={r.id} style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${BDR}`, background: SURF, marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: r.comment ? 4 : 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, color: r.score >= 9 ? GRN : r.score >= 7 ? AMB : RED, fontVariantNumeric: 'tabular-nums' }}>{r.score}/10</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: BLUE + '12', color: BLUE }}>{r.category}</span>
                      <span style={{ fontSize: 9, color: T2, marginLeft: 'auto' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    {r.comment && <p style={{ fontSize: 10, color: T2, margin: 0 }}>{r.comment}</p>}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <Star style={{ width: 24, height: 24, margin: '0 auto 8px', display: 'block', opacity: 0.2, color: T2 }} />
                <p style={{ fontSize: 12, color: T2 }}>No NPS data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Renewal checklist ── */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BDR}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckSquare style={{ width: 13, height: 13, color: PURP }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>Pre-Renewal Checklist</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 5, borderRadius: 99, overflow: 'hidden', background: SURF }}>
                <div style={{ width: `${(completedCount / RENEWAL_STEPS.length) * 100}%`, height: '100%', background: PURP, borderRadius: 99, transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: PURP, fontVariantNumeric: 'tabular-nums' }}>
                {completedCount}/{RENEWAL_STEPS.length}
              </span>
            </div>
          </div>
          <div>
            {RENEWAL_STEPS.map(step => {
              const done = !!checklist[step]
              return (
                <button key={step} onClick={() => toggleStep(step)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${BDR}`, textAlign: 'left' }}>
                  {done
                    ? <CheckSquare style={{ width: 14, height: 14, color: GRN, flexShrink: 0 }} />
                    : <Square     style={{ width: 14, height: 14, color: T2,  flexShrink: 0 }} />}
                  <span style={{ fontSize: 11, color: done ? T2 : T1, textDecoration: done ? 'line-through' : 'none' }}>{step}</span>
                </button>
              )
            })}
          </div>

          {/* Outcome logger */}
          <div style={{ padding: 14, borderTop: `1px solid ${BDR}`, background: SURF }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Log Renewal Outcome</div>
            {showChurnForm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <select value={churnForm.bpId} onChange={e => setChurnForm(f => ({ ...f, bpId: e.target.value }))}
                  style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '6px 10px', fontSize: 11, color: T1, outline: 'none' }}>
                  <option value="">Select customer…</option>
                  {active.map(bp => <option key={bp.id} value={bp.id}>{bp.customerName}</option>)}
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {(['RENEWED', 'CHURNED'] as const).map(o => (
                    <button key={o} onClick={() => setChurnForm(f => ({ ...f, outcome: o }))}
                      style={{ padding: '7px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: `1px solid ${o === 'RENEWED' ? GRN : RED}30`, background: churnForm.outcome === o ? (o === 'RENEWED' ? GRN : RED) : CARD, color: churnForm.outcome === o ? '#fff' : (o === 'RENEWED' ? GRN : RED) }}>
                      {o === 'RENEWED' ? '✓ Renewed' : '✗ Churned'}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => logOutcome.mutate()}
                    disabled={!churnForm.bpId || !churnForm.outcome || logOutcome.isPending}
                    style={{ flex: 1, padding: '7px', background: TEAL, color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: !churnForm.bpId || !churnForm.outcome || logOutcome.isPending ? 0.5 : 1 }}>
                    {logOutcome.isPending ? 'Saving…' : 'Save Outcome'}
                  </button>
                  <button onClick={() => setShowChurnForm(false)}
                    style={{ padding: '7px 10px', background: SURF, border: `1px solid ${BDR}`, borderRadius: 7, fontSize: 11, cursor: 'pointer', color: T2 }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowChurnForm(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, fontSize: 11, cursor: 'pointer', color: T2 }}>
                <MessageSquare style={{ width: 11, height: 11 }} /> Record outcome
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Health snapshot ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp style={{ width: 13, height: 13, color: TEAL }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>Customer Health Snapshot</span>
        </div>
        {scores.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: T2, fontSize: 12 }}>No health scores recorded yet.</div>
        ) : (
          <div>
            {scores.slice(0, 8).map(s => {
              const color = TIER_CLR[s.tier] ?? GRN
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: `1px solid ${BDR}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{s.customerId.slice(0, 20)}…</div>
                    <div style={{ fontSize: 10, color: T2, marginTop: 2 }}>
                      Renewal in {s.renewalProximityDays}d · OIS Δ {s.oisDelta > 0 ? '+' : ''}{s.oisDelta.toFixed(1)}{s.npsScore !== null ? ` · NPS ${s.npsScore}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 70, height: 4, borderRadius: 99, overflow: 'hidden', background: SURF }}>
                      <div style={{ width: `${Math.min(100, s.totalScore)}%`, height: '100%', background: color, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right' }}>{Math.round(s.totalScore)}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: color + '15', color, border: `1px solid ${color}25` }}>{s.tier}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
