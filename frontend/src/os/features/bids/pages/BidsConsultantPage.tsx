import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Building2, User, CheckCircle2, Clock, AlertTriangle,
  Loader2, ChevronDown, ChevronUp, Save, Send, Zap, Map, ExternalLink,
} from 'lucide-react'
import { api } from '@lib/api'

// ── Types ──────────────────────────────────────────────────────────────────────

interface PillarScore {
  pillarId: number; pillarName: string; engineId: number; engineName: string
  score: number; maturity: string; finding: string; recommendations: string[]
}
interface EngineScore {
  engineId: number; engineName: string; score: number; pillarIds: number[]; summary: string
}
interface RoadmapGoal    { title: string; pillarId: number; pillarName: string; successMetric: string; category: string }
interface RoadmapProject { title: string; description: string; linkedPillarIds: number[]; durationWeeks: number; category: string; type: string }
interface RoadmapPhase   { horizon: string; label: string; focus: string; priority: string; goals: RoadmapGoal[]; projects: RoadmapProject[] }
interface ServicePrescription { pillarId: number; pillarName: string; currentScore: number; targetScore: number; recommendedService: string; rationale: string }
interface TransformationRoadmap { phases: RoadmapPhase[]; servicePrescriptions: ServicePrescription[] }

interface DiagnosticData {
  id: string; clientName: string; industry: string; status: string
  notes: string | null; leadConsultant: string | null
  intakeData: Record<string, any>
  pillarScores: PillarScore[]; engineScores: EngineScore[]
  waandaDraftAt: string | null; consultantApprovedAt: string | null; publishedToClientAt: string | null
  deliverables: { n: number; name: string; status: string }[]
  clientUser: { id: string; email: string; name: string } | null
  roadmap: TransformationRoadmap | null
  roadmapGeneratedAt: string | null
  roadmapActivatedAt: string | null
  coigBaseline: { overallScore: number; capturedAt: string } | null
  seededProjectId: string | null
}
interface ClientUser { id: string; email: string; name: string | null; bidsActive: boolean }

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; color: string; spin?: boolean }> = {
  DRAFT:               { label: 'Draft',              color: 'var(--os-text-3)' },
  INTAKE_IN_PROGRESS:  { label: 'Intake In Progress', color: '#fdab3d' },
  WAANDA_PROCESSING:   { label: 'WAANDA Processing',  color: '#7c3aed', spin: true },
  WAANDA_DRAFT:        { label: 'Ready for Review',   color: '#579bfc' },
  CONSULTANT_REVIEW:   { label: 'In Review',          color: '#fdab3d' },
  ACTIVE:              { label: 'Published',          color: '#00c875' },
  PAUSED:              { label: 'Paused',             color: '#fdab3d' },
  COMPLETED:           { label: 'Completed',          color: '#579bfc' },
}

const MATURITY_COLOR: Record<string, string> = {
  Foundational: '#e2445c',
  Developing:   '#fdab3d',
  Capable:      '#579bfc',
  Advanced:     '#4ab6d4',
  Leading:      '#00c875',
}

const ENGINE_ACCENT = ['#7c3aed', '#579bfc', '#fdab3d', '#e2445c', '#00c875', '#fdab3d']

function scoreColor(s: number): string {
  if (s >= 80) return '#00c875'
  if (s >= 65) return '#579bfc'
  if (s >= 45) return '#fdab3d'
  return '#e2445c'
}

function maturityFromScore(score: number): string {
  if (score >= 80) return 'Leading'
  if (score >= 65) return 'Advanced'
  if (score >= 45) return 'Capable'
  if (score >= 25) return 'Developing'
  return 'Foundational'
}

// ── Pillar Card ───────────────────────────────────────────────────────────────

function PillarCard({ p }: { p: PillarScore }) {
  const [expanded, setExpanded] = useState(false)
  const color = scoreColor(p.score)
  const mc    = MATURITY_COLOR[p.maturity] ?? '#579bfc'

  return (
    <div
      className="os-card p-4 cursor-pointer hover:shadow-md transition-shadow select-none"
      style={{ borderLeft: `3px solid ${color}` }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-text-3)' }}>
            Pillar {p.pillarId}
          </span>
          <p className="text-xs font-semibold mt-0.5 leading-tight" style={{ color: 'var(--os-text-1)' }}>
            {p.pillarName}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xl font-black tabular-nums" style={{ color }}>{p.score}</span>
          {expanded
            ? <ChevronUp className="w-3 h-3" style={{ color: 'var(--os-text-3)' }} />
            : <ChevronDown className="w-3 h-3" style={{ color: 'var(--os-text-3)' }} />
          }
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.score}%`, background: color }} />
      </div>

      {/* Maturity badge */}
      <div className="mt-2">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: mc + '22', color: mc }}>
          {p.maturity}
        </span>
      </div>

      {/* Expanded: finding + recommendations */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--os-border)] space-y-3">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{p.finding}</p>
          {p.recommendations.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--os-text-3)' }}>
                Recommendations
              </p>
              {p.recommendations.map((r, i) => (
                <div key={i} className="flex gap-2 text-xs" style={{ color: 'var(--os-text-2)' }}>
                  <span
                    className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: color + '22', color }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function BidsConsultantPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  // Data
  const { data, isLoading, refetch } = useQuery<{ engagement: DiagnosticData }>({
    queryKey: ['bids-diagnostic', id],
    queryFn:  () => api.get(`/admin/bids/engagements/${id}/diagnostic`).then(r => r.data),
    staleTime: 60_000,
  })
  const { data: clientsData } = useQuery<{ clients: ClientUser[] }>({
    queryKey: ['bids-clients'],
    queryFn:  () => api.get('/admin/bids/clients').then(r => r.data),
    staleTime: 300_000,
  })

  const e       = data?.engagement
  const clients = clientsData?.clients ?? []

  // Local state
  const [notes,            setNotes          ] = useState('')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [savedFlash,       setSavedFlash     ] = useState(false)

  // Initialise from server data (once per engagement)
  useEffect(() => {
    if (!e) return
    setNotes(e.notes ?? '')
    if (e.clientUser?.id) setSelectedClientId(e.clientUser.id)
  }, [e?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-poll while WAANDA is processing
  useEffect(() => {
    if (e?.status !== 'WAANDA_PROCESSING') return
    const t = setInterval(refetch, 5000)
    return () => clearInterval(t)
  }, [e?.status, refetch])

  // Mutations
  const saveNotes = useMutation({
    mutationFn: () =>
      api.patch(`/admin/bids/engagements/${id}/consultant-notes`, { notes }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bids-diagnostic', id] })
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
    },
  })

  const assignClient = useMutation({
    mutationFn: () =>
      api.post(`/admin/bids/engagements/${id}/assign-client`, { clientUserId: selectedClientId }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bids-diagnostic', id] }),
  })

  const approve = useMutation({
    mutationFn: () =>
      api.post(`/admin/bids/engagements/${id}/approve`, { notes }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bids-diagnostic', id] }),
  })

  const generateRoadmap = useMutation({
    mutationFn: () =>
      api.post(`/admin/bids/engagements/${id}/generate-roadmap`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bids-diagnostic', id] }),
  })

  const activateEngagement = useMutation({
    mutationFn: () =>
      api.post(`/admin/bids/engagements/${id}/activate`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bids-diagnostic', id] }),
  })

  // ── Loading / error states ──────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--os-text-3)' }} />
      </div>
    )
  }
  if (!e) {
    return (
      <div className="py-16 text-center text-sm" style={{ color: 'var(--os-text-3)' }}>
        Engagement not found.
      </div>
    )
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const pillarScores: PillarScore[] = Array.isArray(e.pillarScores) ? e.pillarScores : []
  const engineScores: EngineScore[] = Array.isArray(e.engineScores) ? e.engineScores : []
  const hasScores   = pillarScores.length === 16
  const isProcessing = e.status === 'WAANDA_PROCESSING'
  const isPublished  = e.status === 'ACTIVE' || e.status === 'COMPLETED'

  const overallScore = hasScores
    ? Math.round(pillarScores.reduce((s, p) => s + p.score, 0) / pillarScores.length)
    : null

  const sm             = STATUS_META[e.status] ?? { label: e.status, color: 'var(--os-text-2)' }
  const roadmap        = e.roadmap && (e.roadmap as any).phases ? e.roadmap as TransformationRoadmap : null
  const isActivated    = !!e.roadmapActivatedAt
  const HORIZON_COLOR: Record<string, string> = {
    '30-day': '#e2445c', '60-day': '#fdab3d', '90-day': '#579bfc', '180-day': '#00c875',
  }

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 flex-wrap">
        <button
          onClick={() => navigate('/kangqore-view/admin/bids/engagements')}
          className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 mt-1 flex-shrink-0"
          style={{ color: 'var(--os-text-2)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Engagements
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#579bfc18', border: '1px solid #579bfc30' }}>
              <Building2 className="w-4.5 h-4.5" style={{ color: '#579bfc' }} />
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>
              {e.clientName}
            </h1>
            <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: sm.color + '18', color: sm.color, border: `1px solid ${sm.color}30` }}>
              {sm.spin && <Loader2 className="w-3 h-3 animate-spin" />}
              {sm.label}
            </span>
          </div>
          <p className="text-sm mt-1.5 ml-12" style={{ color: 'var(--os-text-2)' }}>
            {e.industry} Edition
            {e.leadConsultant && <span> · {e.leadConsultant}</span>}
            {e.waandaDraftAt && (
              <span style={{ color: 'var(--os-text-3)' }}>
                {' · '}WAANDA draft {new Date(e.waandaDraftAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
            {e.clientUser && (
              <span style={{ color: '#00c875' }}>
                {' · '}Assigned → {e.clientUser.name ?? e.clientUser.email}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ── WAANDA processing state ─────────────────────────────────────────── */}
      {isProcessing && (
        <div className="os-card p-10 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: '#7c3aed18', border: '1px solid #7c3aed30' }}>
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: 'var(--os-text-1)' }}>
              WAANDA is processing this diagnostic
            </p>
            <p className="text-sm mt-1.5 max-w-sm" style={{ color: 'var(--os-text-3)' }}>
              Analysing {e.industry} intake data across all 16 pillars and 6 intelligence engines.
              This typically takes 60–90 seconds. This page auto-refreshes.
            </p>
          </div>
        </div>
      )}

      {/* ── Overall score + engine strip ───────────────────────────────────── */}
      {hasScores && overallScore !== null && (
        <>
          <div className="os-card p-5">
            <div className="flex items-center gap-6 flex-wrap">
              <div
                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${scoreColor(overallScore)}22 0%, ${scoreColor(overallScore)}08 100%)`,
                  border: `2px solid ${scoreColor(overallScore)}40`,
                }}
              >
                <span className="text-2xl font-black tabular-nums" style={{ color: scoreColor(overallScore) }}>
                  {overallScore}
                </span>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--os-text-3)' }}>/100</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--os-text-3)' }}>
                  Overall Diagnostic Score™
                </p>
                <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{e.clientName}</p>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded mt-1 inline-block"
                  style={{
                    background: (MATURITY_COLOR[maturityFromScore(overallScore)] ?? '#579bfc') + '22',
                    color: MATURITY_COLOR[maturityFromScore(overallScore)] ?? '#579bfc',
                  }}
                >
                  {maturityFromScore(overallScore)}
                </span>
                <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)', maxWidth: 400 }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${overallScore}%`, background: `linear-gradient(90deg,${scoreColor(overallScore)},${scoreColor(overallScore)}99)` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Engine scores */}
          {engineScores.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {engineScores.map((eng, i) => {
                const accent = ENGINE_ACCENT[i] ?? '#579bfc'
                const short  = eng.engineName.replace(' Intelligence Engine™', '').replace('™', '')
                return (
                  <div key={eng.engineId} className="os-card p-4" style={{ borderTop: `2px solid ${accent}` }}>
                    <p className="text-[10px] font-semibold leading-snug" style={{ color: accent }}>{short}</p>
                    <p className="text-2xl font-black mt-1.5 tabular-nums" style={{ color: scoreColor(eng.score) }}>
                      {eng.score}
                    </p>
                    <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                      <div className="h-full rounded-full" style={{ width: `${eng.score}%`, background: scoreColor(eng.score) }} />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--os-text-3)' }}>
                      {maturityFromScore(eng.score)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── 16-Pillar Scorecard ─────────────────────────────────────────────── */}
      {hasScores && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--os-text-2)' }}>
            16-Pillar Diagnostic Scorecard™ — click any pillar to expand findings &amp; recommendations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pillarScores.map(p => <PillarCard key={p.pillarId} p={p} />)}
          </div>
        </div>
      )}

      {/* No scores yet — show intake data if available */}
      {!hasScores && !isProcessing && (
        <div className="os-card p-6">
          <p className="text-sm font-semibold" style={{ color: 'var(--os-text-2)' }}>
            No WAANDA diagnostic scores yet.
          </p>
          {Object.keys(e.intakeData ?? {}).length > 0 && (
            <details className="mt-4">
              <summary className="text-xs cursor-pointer font-medium" style={{ color: 'var(--os-text-3)' }}>
                View raw intake data
              </summary>
              <pre
                className="mt-3 text-[11px] overflow-auto p-3 rounded-xl leading-relaxed"
                style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)', maxHeight: 300 }}
              >
                {JSON.stringify(e.intakeData, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* ── Executive Report + Action Rail ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Executive Intelligence Report — 3 cols */}
        <div className="lg:col-span-3">
          <div className="os-card p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>
                  Executive Intelligence Report™
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-3)' }}>
                  WAANDA-generated draft — refine before publishing to client
                </p>
              </div>
              {!isPublished && (
                <button
                  onClick={() => saveNotes.mutate()}
                  disabled={saveNotes.isPending}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50 flex-shrink-0"
                  style={{
                    background:  savedFlash ? '#00c87518' : 'var(--os-surface-0)',
                    border:      `1px solid ${savedFlash ? '#00c87540' : 'var(--os-border)'}`,
                    color:       savedFlash ? '#00c875' : 'var(--os-text-1)',
                  }}
                >
                  {saveNotes.isPending
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Save className="w-3.5 h-3.5" />
                  }
                  {savedFlash ? 'Saved' : 'Save Draft'}
                </button>
              )}
            </div>

            {isPublished ? (
              <pre
                className="whitespace-pre-wrap text-sm leading-relaxed"
                style={{ color: 'var(--os-text-1)', fontFamily: 'inherit' }}
              >
                {e.notes ?? 'No report content.'}
              </pre>
            ) : (
              <textarea
                value={notes}
                onChange={ev => setNotes(ev.target.value)}
                rows={24}
                placeholder="WAANDA Executive Intelligence Report™ will appear here after processing..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-y leading-relaxed"
                style={{
                  background:  'var(--os-surface-0)',
                  border:      '1px solid var(--os-border)',
                  color:       'var(--os-text-1)',
                  minHeight:   360,
                  fontFamily:  'inherit',
                }}
              />
            )}
          </div>
        </div>

        {/* Action rail — 2 cols */}
        <div className="lg:col-span-2 space-y-4">

          {/* Assign Client */}
          {!isPublished && (
            <div className="os-card p-5">
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--os-text-1)' }}>
                Assign Client User
              </p>
              <p className="text-xs mb-4" style={{ color: 'var(--os-text-3)' }}>
                Link this engagement to a client portal account. The client will see the published report here.
              </p>

              {e.clientUser && (
                <div
                  className="flex items-center gap-3 mb-3 p-3 rounded-xl"
                  style={{ background: '#00c87510', border: '1px solid #00c87530' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#00c87522' }}>
                    <User className="w-4 h-4" style={{ color: '#00c875' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#00c875' }}>
                      {e.clientUser.name ?? e.clientUser.email}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--os-text-3)' }}>
                      {e.clientUser.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <select
                  value={selectedClientId}
                  onChange={ev => setSelectedClientId(ev.target.value)}
                  className="flex-1 rounded-xl px-3 py-2.5 text-sm focus:outline-none min-w-0"
                  style={{
                    background: 'var(--os-surface-0)',
                    border:     '1px solid var(--os-border)',
                    color:      'var(--os-text-1)',
                  }}
                >
                  <option value="">Select client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name ?? c.email}{c.bidsActive ? ' ·BIDS™' : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => assignClient.mutate()}
                  disabled={!selectedClientId || assignClient.isPending}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0"
                  style={{ background: '#579bfc', color: '#fff' }}
                >
                  {assignClient.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Assign
                </button>
              </div>
            </div>
          )}

          {/* Approve & Publish */}
          <div
            className="os-card p-5"
            style={{ borderTop: `3px solid ${isPublished ? '#00c875' : '#579bfc'}` }}
          >
            {isPublished ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 className="w-12 h-12" style={{ color: '#00c875' }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#00c875' }}>Published to Client</p>
                  {e.publishedToClientAt && (
                    <p className="text-xs mt-1" style={{ color: 'var(--os-text-3)' }}>
                      {new Date(e.publishedToClientAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  )}
                  {e.clientUser && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-3)' }}>
                      Client portal unlocked for {e.clientUser.name ?? e.clientUser.email}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--os-text-1)' }}>
                  Approve &amp; Publish
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--os-text-3)' }}>
                  Publishing sends the finalised diagnostic report to the client portal.
                  Review all 16 pillar scores and the Executive Report before approving.
                </p>

                {!e.clientUser && (
                  <div
                    className="flex items-start gap-2 text-xs mb-4 px-3 py-2.5 rounded-xl"
                    style={{ background: '#fdab3d18', border: '1px solid #fdab3d30', color: '#fdab3d' }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    Assign a client user before publishing.
                  </div>
                )}
                {!hasScores && (
                  <div
                    className="flex items-start gap-2 text-xs mb-4 px-3 py-2.5 rounded-xl"
                    style={{ background: '#7c3aed18', border: '1px solid #7c3aed30', color: '#7c3aed' }}
                  >
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    Awaiting WAANDA diagnostic scores.
                  </div>
                )}

                <button
                  onClick={() => approve.mutate()}
                  disabled={!e.clientUser || !hasScores || approve.isPending}
                  className="w-full py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(90deg,#2564ea 0%,#4ab6d4 100%)' }}
                >
                  {approve.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  {approve.isPending ? 'Publishing...' : 'Approve & Publish to Client'}
                </button>
              </>
            )}
          </div>

          {/* Deliverable progress */}
          {e.deliverables?.length > 0 && (
            <div className="os-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--os-text-2)' }}>
                Deliverables
              </p>
              <div className="space-y-2">
                {e.deliverables.map(d => (
                  <div key={d.n} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: d.status === 'COMPLETE' ? '#00c875' : 'var(--os-border)' }}
                    />
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: d.status === 'COMPLETE' ? 'var(--os-text-1)' : 'var(--os-text-3)' }}
                    >
                      {d.name}
                    </span>
                    {d.status === 'COMPLETE' && (
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: '#00c875' }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--os-border)]">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((e.deliverables.filter(d => d.status === 'COMPLETE').length / e.deliverables.length) * 100)}%`,
                      background: '#579bfc',
                    }}
                  />
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: 'var(--os-text-3)' }}>
                  {e.deliverables.filter(d => d.status === 'COMPLETE').length} / {e.deliverables.length} complete
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Transformation Roadmap ─────────────────────────────────────────── */}
      {hasScores && (
        <div className="os-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--os-border)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#579bfc18', border: '1px solid #579bfc30' }}>
                <Map className="w-4 h-4" style={{ color: '#579bfc' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>
                  Transformation Roadmap™
                </p>
                <p className="text-xs" style={{ color: 'var(--os-text-3)' }}>
                  {roadmap
                    ? `${roadmap.phases.length} phases · ${roadmap.servicePrescriptions.length} service prescriptions`
                    : 'WAANDA-generated 30/60/90/180-day execution roadmap'}
                  {e.roadmapGeneratedAt && (
                    <span> · {new Date(e.roadmapGeneratedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isActivated ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: '#00c87518', color: '#00c875', border: '1px solid #00c87530' }}>
                    <CheckCircle2 className="w-3 h-3" />
                    Activated
                  </span>
                  {e.seededProjectId && (
                    <a
                      href={`/kangqore-view/admin/projects/${e.seededProjectId}`}
                      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                      style={{ background: '#579bfc18', color: '#579bfc', border: '1px solid #579bfc30' }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Project
                    </a>
                  )}
                </div>
              ) : !roadmap ? (
                <button
                  onClick={() => generateRoadmap.mutate()}
                  disabled={generateRoadmap.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
                  style={{ background: '#579bfc', color: '#fff' }}
                >
                  {generateRoadmap.isPending
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Zap className="w-3.5 h-3.5" />}
                  {generateRoadmap.isPending ? 'Generating…' : 'Generate Roadmap'}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => generateRoadmap.mutate()}
                    disabled={generateRoadmap.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                    style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}
                  >
                    {generateRoadmap.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                    Regenerate
                  </button>
                  <button
                    onClick={() => activateEngagement.mutate()}
                    disabled={!e.clientUser || activateEngagement.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
                    style={{ background: 'linear-gradient(90deg,#2564ea 0%,#4ab6d4 100%)', color: '#fff' }}
                  >
                    {activateEngagement.isPending
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Zap className="w-3.5 h-3.5" />}
                    {activateEngagement.isPending ? 'Activating…' : 'Activate Engagement'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Roadmap phases */}
          {roadmap && (
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {roadmap.phases.map(phase => {
                  const hc = HORIZON_COLOR[phase.horizon] ?? '#579bfc'
                  return (
                    <div key={phase.horizon} className="rounded-xl p-4"
                      style={{ background: hc + '0a', border: `1px solid ${hc}25`, borderTop: `2px solid ${hc}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: hc }}>
                          {phase.horizon}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: hc + '18', color: hc }}>
                          {phase.priority}
                        </span>
                      </div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--os-text-1)' }}>{phase.label}</p>
                      <p className="text-[11px] leading-snug mb-3" style={{ color: 'var(--os-text-3)' }}>{phase.focus}</p>
                      <div className="space-y-1.5">
                        {phase.projects.map((proj, i) => (
                          <div key={i} className="flex gap-2 text-[11px]">
                            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: hc }} />
                            <span style={{ color: 'var(--os-text-2)' }}>{proj.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Service prescriptions */}
              {roadmap.servicePrescriptions.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--os-text-2)' }}>
                    Service Prescriptions — recommended Kangqore programmes
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {roadmap.servicePrescriptions.map((sp, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl"
                        style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold" style={{ color: 'var(--os-text-1)' }}>{sp.recommendedService}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--os-text-3)' }}>
                            {sp.pillarName} · {sp.currentScore} → {sp.targetScore}/100
                          </p>
                          <p className="text-[11px] mt-1 leading-snug" style={{ color: 'var(--os-text-3)' }}>{sp.rationale}</p>
                        </div>
                        <span className="text-[11px] font-bold flex-shrink-0" style={{ color: scoreColor(sp.currentScore) }}>
                          +{sp.targetScore - sp.currentScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activation note / COIG baseline */}
              {!isActivated && !e.clientUser && (
                <p className="text-[11px]" style={{ color: 'var(--os-text-3)' }}>
                  Assign a client user to enable "Activate Engagement" — this creates a live Project in Kangqore View seeded from the roadmap.
                </p>
              )}
              {isActivated && e.coigBaseline && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: '#00c87508', border: '1px solid #00c87520' }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#00c875' }} />
                  <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>
                    COIG baseline captured — {e.coigBaseline.overallScore}/100 at{' '}
                    {new Date(e.coigBaseline.capturedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.
                    Re-run BIDS™ in 90–180 days to measure improvement delta.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty / loading state */}
          {!roadmap && (
            <div className="px-5 pb-5 pt-2">
              {generateRoadmap.isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#579bfc' }} />
                  <p className="text-xs" style={{ color: 'var(--os-text-3)' }}>
                    WAANDA is generating the Transformation Roadmap from pillar scores…
                  </p>
                </div>
              ) : (
                <p className="text-xs" style={{ color: 'var(--os-text-3)' }}>
                  Generate the roadmap after reviewing the 16-pillar scorecard. WAANDA will produce a structured
                  30/60/90/180-day Transformation Roadmap with goals, projects, and service prescriptions tailored to this client's findings.
                </p>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
