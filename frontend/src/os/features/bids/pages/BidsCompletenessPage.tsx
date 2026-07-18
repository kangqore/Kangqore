import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { RefreshCw, Activity, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLUE = '#579bfc'
const PURP = '#7c3aed'

const PACK_COLOR: Record<string, string> = {
  'PS Pack':       '#3b82f6',
  'Healthcare':    '#10b981',
  'Manufacturing': '#f59e0b',
}

interface PillarScore {
  id: string
  pillarId: number
  pillarName: string
  kpiCount: number
  workflowTemplateCount: number
  agentsCoverage: number
  ontologyTypes: number
  industryPackCoverage: string[]
  score: number
}

interface AuditRun {
  id: string
  trigger: string
  overallScore: number
  auditedAt: string
  scores: PillarScore[]
}

function scoreColor(s: number) {
  if (s >= 70) return GRN
  if (s >= 50) return AMB
  return RED
}

// ─── 16-point SVG Radar Chart ────────────────────────────────────────────────
function RadarChart({ scores }: { scores: PillarScore[] }) {
  if (!scores.length) return null
  const SIZE   = 280
  const CX     = SIZE / 2
  const CY     = SIZE / 2
  const R_MAX  = 110
  const N      = 16
  const RINGS  = [25, 50, 75, 100]

  const angleOf = (i: number) => (2 * Math.PI * i) / N - Math.PI / 2

  const polarPoint = (r: number, i: number) => {
    const a = angleOf(i)
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  }

  const ringPath = (pct: number) => {
    const r = (pct / 100) * R_MAX
    const pts = Array.from({ length: N }, (_, i) => polarPoint(r, i))
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'
  }

  const dataPath = () => {
    const sorted = [...scores].sort((a, b) => a.pillarId - b.pillarId)
    const pts = sorted.map((s, i) => polarPoint((s.score / 100) * R_MAX, i))
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'
  }

  const axisLines = Array.from({ length: N }, (_, i) => {
    const p = polarPoint(R_MAX, i)
    return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={BDR} strokeWidth="0.8" strokeOpacity="0.6" />
  })

  const labels = [...scores].sort((a, b) => a.pillarId - b.pillarId).map((s, i) => {
    const p = polarPoint(R_MAX + 18, i)
    const color = scoreColor(s.score)
    return (
      <text
        key={s.pillarId}
        x={p.x} y={p.y}
        textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="8" fontWeight="700"
      >
        P{s.pillarId}
      </text>
    )
  })

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[280px]">
      {/* Grid rings */}
      {RINGS.map(r => (
        <path key={r} d={ringPath(r)} fill="none" stroke={BDR} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray={r < 100 ? '3 3' : ''} />
      ))}
      {/* Ring labels */}
      {RINGS.map(r => (
        <text key={r} x={CX + 2} y={CY - (r / 100) * R_MAX - 2} fill={T2} fontSize="7" opacity="0.7">{r}</text>
      ))}
      {/* Axis lines */}
      {axisLines}
      {/* Data polygon */}
      <path d={dataPath()} fill={`${BLUE}22`} stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Dot per pillar */}
      {[...scores].sort((a, b) => a.pillarId - b.pillarId).map((s, i) => {
        const p = polarPoint((s.score / 100) * R_MAX, i)
        return <circle key={s.pillarId} cx={p.x} cy={p.y} r="3" fill={scoreColor(s.score)} />
      })}
      {/* Pillar labels */}
      {labels}
    </svg>
  )
}

// ─── Gap heatmap (4×4 grid of all 16 pillars) ────────────────────────────────
function GapHeatmap({ scores }: { scores: PillarScore[] }) {
  const sorted = [...scores].sort((a, b) => a.pillarId - b.pillarId)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
      {sorted.map(s => {
        const bg = s.score === 0 ? `${RED}30` : s.score < 50 ? `${RED}18` : s.score < 70 ? `${AMB}18` : `${GRN}12`
        const border = s.score === 0 ? RED : s.score < 50 ? `${RED}60` : s.score < 70 ? `${AMB}60` : `${GRN}40`
        return (
          <div
            key={s.pillarId}
            title={`P${s.pillarId} — ${s.pillarName}\nScore: ${s.score}/100`}
            style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}
          >
            <p style={{ fontSize: 9, fontWeight: 800, color: T2 }}>P{s.pillarId}</p>
            <p style={{ fontSize: 13, fontWeight: 900, color: scoreColor(s.score) }}>{Math.round(s.score)}</p>
          </div>
        )
      })}
    </div>
  )
}

// ─── Industry pack overlay ────────────────────────────────────────────────────
function PackCoverage({ scores }: { scores: PillarScore[] }) {
  const packs = ['PS Pack', 'Healthcare', 'Manufacturing']
  return (
    <div className="space-y-3">
      {packs.map(pack => {
        const covered = scores.filter(s => (s.industryPackCoverage as string[]).includes(pack))
        const avgScore = covered.length
          ? Math.round(covered.reduce((s, p) => s + p.score, 0) / covered.length)
          : 0
        const color = PACK_COLOR[pack]
        return (
          <div key={pack} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{pack}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: T2 }}>{covered.length} pillars · avg</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: scoreColor(avgScore) }}>{avgScore}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {covered.map(s => (
                <span
                  key={s.pillarId}
                  style={{ fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 99,
                    background: `${scoreColor(s.score)}15`, color: scoreColor(s.score),
                    border: `1px solid ${scoreColor(s.score)}30` }}
                >
                  P{s.pillarId} · {Math.round(s.score)}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function BidsCompletenessPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<'radar' | 'heatmap' | 'bars' | 'matrix'>('radar')

  const { data: audit, isLoading, refetch } = useQuery<AuditRun | null>({
    queryKey: ['bids-audit-latest'],
    queryFn: () => api.get('/admin/bids/audit/latest').then(r => r.data),
    staleTime: 5 * 60_000,
  })

  const { data: historyData } = useQuery<{ runs: Array<{ id: string; trigger: string; overallScore: number; auditedAt: string }> }>({
    queryKey: ['bids-audit-history'],
    queryFn: () => api.get('/admin/bids/audit/history').then(r => r.data),
    staleTime: 5 * 60_000,
  })

  const runAudit = useMutation({
    mutationFn: () => api.post('/admin/bids/audit/run').then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bids-audit-latest'] }); qc.invalidateQueries({ queryKey: ['bids-audit-history'] }) },
  })

  const scores = audit?.scores ?? []
  const gapCount = scores.filter(s => s.score < 50).length
  const criticalCount = scores.filter(s => s.score === 0).length

  return (
    <div className="space-y-5 max-w-6xl">

      {/* Header */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 20, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${PURP}12`, border: `1px solid ${PURP}25` }}>
              <Activity className="w-6 h-6" style={{ color: PURP }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: T1 }}>BIDS™ Pillar Completeness</p>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: `${PURP}12`, color: PURP }}>S77</span>
              </div>
              <p style={{ fontSize: 12, color: T2 }}>16-pillar platform coverage audit. Auto-runs nightly at 02:00. Pillars below 50 trigger KIMMP signals.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1px solid ${BDR}`, background: SURF, fontSize: 12, color: T2, cursor: 'pointer' }}>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => runAudit.mutate()}
              disabled={runAudit.isPending}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: PURP, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: runAudit.isPending ? 0.6 : 1 }}
            >
              <Zap className="w-3.5 h-3.5" />
              {runAudit.isPending ? 'Auditing…' : 'Run Audit Now'}
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 80, borderRadius: 14, background: SURF, animation: 'pulse 2s infinite' }} />)}
        </div>
      ) : audit ? (
        <>
          {/* KPI bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { label: 'Overall Score', value: `${audit.overallScore}/100`, color: scoreColor(audit.overallScore), icon: <Activity className="w-4 h-4" /> },
              { label: 'Pillars Green', value: scores.filter(s => s.score >= 70).length, color: GRN, icon: <CheckCircle2 className="w-4 h-4" /> },
              { label: 'Below 50 (KIMMP Alert)', value: gapCount, color: gapCount > 0 ? RED : GRN, icon: <AlertTriangle className="w-4 h-4" /> },
              { label: 'Zero Coverage', value: criticalCount, color: criticalCount > 0 ? RED : GRN, icon: <AlertTriangle className="w-4 h-4" /> },
            ].map(k => (
              <div key={k.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ color: k.color }}>{k.icon}</span>
                  <p style={{ fontSize: 10, fontWeight: 600, color: T2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</p>
                </div>
                <p style={{ fontSize: 24, fontWeight: 900, color: k.color }}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Last audit meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: SURF, border: `1px solid ${BDR}` }}>
            <Clock className="w-3.5 h-3.5" style={{ color: T2 }} />
            <span style={{ fontSize: 11, color: T2 }}>Last audit: {new Date(audit.auditedAt).toLocaleString()} · Trigger: {audit.trigger}</span>
          </div>

          {/* View tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BDR}`, paddingBottom: 0 }}>
            {(['radar', 'heatmap', 'bars', 'matrix'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer',
                  borderBottom: activeTab === t ? `2px solid ${BLUE}` : '2px solid transparent',
                  color: activeTab === t ? BLUE : T2, background: 'transparent', textTransform: 'capitalize' }}
              >
                {t === 'bars' ? 'Score Bars' : t === 'matrix' ? 'KPI Matrix' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Radar view */}
          {activeTab === 'radar' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 16 }}>16-Pillar Radar</p>
                <RadarChart scores={scores} />
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  {[{ c: GRN, l: '≥70' }, { c: AMB, l: '50–69' }, { c: RED, l: '<50' }].map(k => (
                    <div key={k.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: k.c }} />
                      <span style={{ fontSize: 10, color: T2 }}>{k.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 14 }}>Industry Pack Coverage</p>
                <PackCoverage scores={scores} />
              </div>
            </div>
          )}

          {/* Heatmap view */}
          {activeTab === 'heatmap' && (
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 16 }}>Gap Heatmap — red = zero coverage</p>
              <GapHeatmap scores={scores} />
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                {[{ bg: `${RED}30`, border: RED, l: 'Score = 0' }, { bg: `${RED}18`, border: `${RED}60`, l: 'Score < 50' }, { bg: `${AMB}18`, border: `${AMB}60`, l: 'Score 50–69' }, { bg: `${GRN}12`, border: `${GRN}40`, l: 'Score ≥ 70' }].map(k => (
                  <div key={k.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: k.bg, border: `1px solid ${k.border}` }} />
                    <span style={{ fontSize: 10, color: T2 }}>{k.l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score bars view */}
          {activeTab === 'bars' && (
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: 20 }}>
              <div className="space-y-3">
                {[...scores].sort((a, b) => a.pillarId - b.pillarId).map(s => {
                  const color = scoreColor(s.score)
                  return (
                    <div key={s.pillarId}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 4, background: `${color}15`, color }}>{s.pillarId.toString().padStart(2, '0')}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: T1 }}>{s.pillarName}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 9, color: T2 }}>KPI: {s.kpiCount} · WF: {s.workflowTemplateCount} · Agents: {s.agentsCoverage}%</span>
                          <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 32, textAlign: 'right' }}>{Math.round(s.score)}</span>
                        </div>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: SURF, overflow: 'hidden' }}>
                        <div style={{ width: `${s.score}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* KPI × Workflow matrix view */}
          {activeTab === 'matrix' && (
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: 20, overflowX: 'auto' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 16 }}>KPI × Workflow Template Matrix</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '6px 10px', color: T2, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${BDR}` }}>Pillar</th>
                    <th style={{ textAlign: 'center', padding: '6px 10px', color: T2, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${BDR}` }}>KPI Signals</th>
                    <th style={{ textAlign: 'center', padding: '6px 10px', color: T2, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${BDR}` }}>WF Templates</th>
                    <th style={{ textAlign: 'center', padding: '6px 10px', color: T2, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${BDR}` }}>Agent %</th>
                    <th style={{ textAlign: 'center', padding: '6px 10px', color: T2, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${BDR}` }}>Ontology</th>
                    <th style={{ textAlign: 'left', padding: '6px 10px', color: T2, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${BDR}` }}>Industry Packs</th>
                    <th style={{ textAlign: 'center', padding: '6px 10px', color: T2, fontSize: 10, fontWeight: 700, borderBottom: `1px solid ${BDR}` }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...scores].sort((a, b) => a.pillarId - b.pillarId).map((s, idx) => {
                    const color = scoreColor(s.score)
                    const isOdd = idx % 2 === 0
                    return (
                      <tr key={s.pillarId} style={{ background: isOdd ? 'transparent' : `${SURF}60` }}>
                        <td style={{ padding: '8px 10px', color: T1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: `${color}15`, color }}>P{s.pillarId}</span>
                          <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.pillarName.replace('™', '')}</span>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: s.kpiCount > 0 ? GRN : RED, fontWeight: 700 }}>{s.kpiCount}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: s.workflowTemplateCount > 0 ? GRN : RED, fontWeight: 700 }}>{s.workflowTemplateCount}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: s.agentsCoverage > 0 ? AMB : RED, fontWeight: 700 }}>{s.agentsCoverage}%</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', color: T2, fontWeight: 600 }}>{s.ontologyTypes}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {(s.industryPackCoverage as string[]).map(pk => (
                              <span key={pk} style={{ fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 99, background: `${PACK_COLOR[pk] ?? BLUE}15`, color: PACK_COLOR[pk] ?? BLUE }}>{pk}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 900, color }}>{Math.round(s.score)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* History */}
          {historyData?.runs && historyData.runs.length > 1 && (
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 12 }}>Audit History</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {historyData.runs.slice(0, 20).map(r => (
                  <div key={r.id} style={{ padding: '6px 12px', borderRadius: 8, background: SURF, border: `1px solid ${BDR}` }}>
                    <p style={{ fontSize: 9, color: T2 }}>{new Date(r.auditedAt).toLocaleDateString()} · {r.trigger}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: scoreColor(r.overallScore) }}>{r.overallScore}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <Activity className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: T2 }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: T2, marginBottom: 12 }}>No audit data yet</p>
          <p style={{ fontSize: 12, color: T2, marginBottom: 20 }}>Run the first audit to see pillar scores and coverage gaps.</p>
          <button
            onClick={() => runAudit.mutate()}
            disabled={runAudit.isPending}
            style={{ padding: '10px 24px', borderRadius: 12, background: PURP, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            {runAudit.isPending ? 'Running…' : 'Run First Audit'}
          </button>
        </div>
      )}
    </div>
  )
}
