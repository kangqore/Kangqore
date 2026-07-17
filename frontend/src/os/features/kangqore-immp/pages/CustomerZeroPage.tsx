import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminApi } from '@lib/api'
import {
  Award, TrendingUp, Zap, Clock, FileText, Download, Layers,
  Cpu, Brain, BarChart2, Wand2, FlaskConical, Lightbulb, Timer,
  ArrowUp, ArrowDown, Minus, FileJson, RefreshCw, ShieldCheck,
  Target, CheckCircle2, AlertTriangle, Camera, ChevronRight,
  Activity, Sparkles,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface GoalProgress  { label: string; target: number; unit: string }
interface TopRec        { action: string; oisImpact: number }
interface CustomerZeroReport {
  organization: string; platform: string
  periodStart: string | null; periodEnd: string
  maturityBefore: string | null; maturityAfter: string
  oisBefore: number | null; oisAfter: number
  coig: number; coigExpected: number; coigPotential: number
  hoursSaved: number; automationCoverage: number
  workflowsCompleted: number; manualEliminated: number
  goalProgress: GoalProgress[]; topRecommendations: TopRec[]
  verifiedBy: string; generatedAt: string
}

interface BlueprintMeta { id: string; name: string; version: string; pack: string | null; status: string }
interface Trend         { delta: number; direction: 'up' | 'down' | 'flat' }
interface PlatformActivity {
  missionsLast24h: number;  missionsTrend: Trend
  decisionsLast7d: number;  decisionsTrend: Trend
  estimatedTimeSaved: number; evidenceCaptured: number; evidenceTrend: Trend
  simulationRuns: number; simulationsTrend: Trend; waandaSessions: number
  projectsCreated: number; tasksCompleted: number; missionsExecuted: number
  executiveDecisions: number; commandsExecuted: number
  optimizationRuns: number; automationSuccess: number
}
interface PulseDriver  { metric: string; value: string | number; signal: 'positive' | 'negative' | 'neutral' }
interface OperatingPulse {
  summary: string; health: 'healthy' | 'warning' | 'critical'
  confidence: number; generatedAt: string
  drivers: PulseDriver[]; recommendedAction: string | null
}

// ── Design tokens ──────────────────────────────────────────────────────────────

const T1    = 'var(--os-text-1)'
const T2    = 'var(--os-text-2)'
const T3    = 'var(--os-text-3)'
const T4    = 'var(--os-text-4)'
const SURF1 = 'var(--os-surface-1)'
const SURF2 = 'var(--os-surface-2)'
const SURF3 = 'var(--os-surface-3)'
const BDR   = 'var(--os-border)'
const BDR_S = 'var(--os-border-subtle)'
const BLUE  = '#2564ea'
const GREEN = '#00c875'
const GOLD  = '#eab308'
const PURP  = '#a855f7'
const RED   = '#ef4444'
const INDIGO = '#6366f1'

const EMI_COLOR: Record<string, string> = {
  L1: '#e2445c', L2: '#fdab3d', L3: '#579bfc', L4: PURP, L5: GREEN,
}

const PILLAR_WEIGHT: Record<string, string> = {
  decision: '20%', enterprise: '18%', workflow: '15%', goal: '14%',
  ai: '10%', business: '10%', trust: '8%', learning: 'LV', adoption: '5%',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function gradeFromScore(s: number) {
  if (s >= 90) return 'A'
  if (s >= 75) return 'B'
  if (s >= 60) return 'C'
  if (s >= 45) return 'D'
  return 'F'
}
function scoreColor(v: number) { return v >= 75 ? GREEN : v >= 50 ? GOLD : RED }

// ── OIS Gauge ─────────────────────────────────────────────────────────────────

function arcPt(score100: number, CX: number, CY: number, R: number) {
  const a = ((225 + score100 * 2.7) * Math.PI) / 180
  return { x: CX + R * Math.sin(a), y: CY - R * Math.cos(a) }
}

function OISGauge({ score, before, size = 'lg' }: { score: number; before: number | null; size?: 'sm' | 'lg' }) {
  const R  = size === 'lg' ? 86 : 58
  const SW = size === 'lg' ? 12 : 8
  const TW = size === 'lg' ? 14 : 9
  const W  = R * 2 + TW * 2 + 16
  const H  = Math.round(W * 0.78)
  const CX = W / 2
  const CY = H - 8

  const circ = 2 * Math.PI * R
  const ARC  = circ * 0.75
  const OFF  = -(circ * 0.125)
  const fill = (v: number) => (Math.min(v, 100) / 100) * ARC

  const grade    = gradeFromScore(score)
  const gc       = grade === 'A' || grade === 'B' ? GREEN : grade === 'C' ? GOLD : RED
  const dot      = arcPt(score, CX, CY, R)
  const hasDelta = before !== null && before !== score
  const delta    = hasDelta ? score - before! : 0
  const deltaCol = delta >= 0 ? GREEN : RED

  const tickPt = (pct: number, inner: boolean) =>
    arcPt(pct, CX, CY, inner ? R - TW / 2 + 1 : R + TW / 2 - 1)

  const fs = size === 'lg' ? 50 : 32
  const labelFs = size === 'lg' ? 8.5 : 6

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="czFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={BLUE} />
          <stop offset="100%" stopColor={PURP} />
        </linearGradient>
        <radialGradient id="czAtm" cx="50%" cy="55%" r="50%">
          <stop offset="0%"   stopColor={BLUE} stopOpacity="0.12" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
        </radialGradient>
        <filter id="czArc" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="czDot" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4"  result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="9"  result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="czTxt" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx={CX} cy={CY} r={R - SW / 2 - 1} fill="url(#czAtm)" />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#131e31" strokeWidth={TW}
        strokeDasharray={`${ARC} ${circ}`} strokeDashoffset={OFF}
        strokeLinecap="round" transform={`rotate(-90 ${CX} ${CY})`} />
      <circle cx={CX} cy={CY} r={R - TW / 2 - 2} fill="none"
        stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />

      {hasDelta && (
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={`${BLUE}20`} strokeWidth={SW - 4}
          strokeDasharray={`${fill(before!)} ${circ}`} strokeDashoffset={OFF}
          strokeLinecap="round" transform={`rotate(-90 ${CX} ${CY})`} />
      )}

      <circle cx={CX} cy={CY} r={R} fill="none" stroke="url(#czFill)" strokeWidth={SW}
        strokeDasharray={`${fill(score)} ${circ}`} strokeDashoffset={OFF}
        strokeLinecap="round" transform={`rotate(-90 ${CX} ${CY})`}
        filter="url(#czArc)"
        style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)' }} />

      {([45, 75] as const).map(pct => {
        const col = pct === 45 ? GOLD : GREEN
        const i2 = tickPt(pct, true), o = tickPt(pct, false)
        return (
          <line key={pct} x1={i2.x} y1={i2.y} x2={o.x} y2={o.y}
            stroke={col} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        )
      })}

      <circle cx={dot.x} cy={dot.y} r={SW / 2 + 2.5} fill={gc} filter="url(#czDot)" />
      <circle cx={dot.x} cy={dot.y} r={SW / 2 + 1}   fill={gc} />
      <circle cx={dot.x} cy={dot.y} r={SW / 2 - 2.5} fill="rgba(255,255,255,0.92)" />

      <text x={CX} y={CY - 22} textAnchor="middle"
        fill="white" fontSize={fs} fontWeight="800" letterSpacing="-1.5"
        fontFamily="-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif"
        filter="url(#czTxt)">
        {score.toFixed(1)}
      </text>

      <text x={CX - 5} y={CY - 6} textAnchor="end"
        fill={BLUE} fontSize={labelFs} fontWeight="700" letterSpacing="0.3"
        fontFamily="-apple-system,sans-serif" opacity="0.9">
        OIS™
      </text>
      <text x={CX - 1} y={CY - 6} textAnchor="start"
        fill="#4a5f82" fontSize={labelFs} letterSpacing="2"
        fontFamily="-apple-system,sans-serif">
        SCORE
      </text>

      <rect x={CX - 44} y={CY + 4} width={88} height={23} rx={11.5}
        fill={gc + '1c'} stroke={gc} strokeWidth="1.5" />
      <text x={CX} y={CY + 19} textAnchor="middle"
        fill={gc} fontSize="11.5" fontWeight="900" letterSpacing="1.2"
        fontFamily="-apple-system,sans-serif">
        GRADE {gradeFromScore(score)}
      </text>

      {hasDelta && (
        <>
          <rect x={CX - 54} y={CY + 34} width={108} height={20} rx={10}
            fill={deltaCol + '0d'} stroke={deltaCol + '35'} strokeWidth="1" />
          <text x={CX} y={CY + 47.5} textAnchor="middle" fontSize="10.5"
            fontFamily="-apple-system,sans-serif">
            <tspan fill="#4a5f82" fontWeight="500">{before!.toFixed(1)}</tspan>
            <tspan fill="#2e3f5c" fontWeight="400">  →  </tspan>
            <tspan fill={deltaCol} fontWeight="800">
              {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pts
            </tspan>
          </text>
        </>
      )}
    </svg>
  )
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ children, color = T4, icon: Icon }: { children: React.ReactNode; color?: string; icon?: any }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Icon && <Icon size={11} style={{ color, flexShrink: 0 }} />}
      <span style={{
        fontSize: 9, fontWeight: 700, color,
        textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: color === T4 ? BDR : color + '28' }} />
    </div>
  )
}

// ── Pillar row ─────────────────────────────────────────────────────────────────

function PillarRow({ id, label, score, index }: { id: string; label: string; score: number; index: number }) {
  const col  = scoreColor(score)
  const wt   = PILLAR_WEIGHT[id] ?? ''

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '5px 8px', borderRadius: 6,
      background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
    }}>
      <span style={{ fontSize: 10, color: T3, width: 70, flexShrink: 0, textAlign: 'right', fontWeight: 500 }}>{label}</span>
      {wt && (
        <span style={{ fontSize: 8, color: T4, width: 22, flexShrink: 0, textAlign: 'center',
          background: col + '15', borderRadius: 3, padding: '1px 0', fontWeight: 600, color: col + 'aa',
        }}>{wt}</span>
      )}
      <div style={{ flex: 1, position: 'relative', height: 7, background: '#131e31', borderRadius: 4 }}>
        <div style={{
          width: `${score}%`, height: '100%', background: col,
          borderRadius: 4, transition: 'width 1s ease',
          boxShadow: score >= 75 ? `0 0 8px ${col}44` : 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${score}%`,
          width: 11, height: 11, borderRadius: '50%',
          background: col, border: '2px solid #0c1220',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 6px ${col}60`,
          transition: 'left 1s ease', zIndex: 1,
        }} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 800, color: col,
        width: 28, textAlign: 'right', flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {score.toFixed(0)}
      </span>
    </div>
  )
}

// ── Activity card ──────────────────────────────────────────────────────────────

function ActivityCard({
  icon: Icon, label, value, unit, color, window: win, trend,
}: {
  icon: any; label: string; value: number; unit?: string; color: string
  window?: string; trend?: Trend
}) {
  const isZero = value === 0
  const TI = trend?.direction === 'up' ? ArrowUp : trend?.direction === 'down' ? ArrowDown : Minus
  const tc  = trend?.direction === 'up' ? GREEN : trend?.direction === 'down' ? RED : T4

  return (
    <div style={{
      background: SURF2,
      border: `1px solid ${isZero ? BDR_S : color + '28'}`,
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* left accent stripe */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: isZero ? BDR : color,
        borderRadius: '10px 0 0 10px',
        opacity: isZero ? 0.3 : 1,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: isZero ? SURF3 : color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={13} style={{ color: isZero ? T4 : color }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {win && (
            <span style={{
              fontSize: 8, color: isZero ? T4 : color,
              background: isZero ? 'transparent' : color + '12',
              padding: '2px 6px', borderRadius: 4, fontWeight: 600,
              border: isZero ? `1px solid ${BDR_S}` : `1px solid ${color}28`,
            }}>
              {win}
            </span>
          )}
          {trend && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TI size={9} style={{ color: tc }} />
              {trend.delta !== 0 && (
                <span style={{ fontSize: 8, fontWeight: 700, color: tc }}>
                  {trend.delta > 0 ? '+' : ''}{trend.delta}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <div style={{ paddingLeft: 4 }}>
        {isZero ? (
          <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, color: T4, opacity: 0.3 }}>—</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{
              fontSize: 26, fontWeight: 900, lineHeight: 1,
              color, fontVariantNumeric: 'tabular-nums',
            }}>
              {value.toLocaleString()}
            </span>
            {unit && <span style={{ fontSize: 12, fontWeight: 600, color: color + 'aa' }}>{unit}</span>}
          </div>
        )}
        <div style={{ fontSize: 10, color: isZero ? T4 : T3, marginTop: 4, lineHeight: 1.35 }}>{label}</div>
      </div>
    </div>
  )
}

// ── COIG Bar ───────────────────────────────────────────────────────────────────

function CoigBar({ label, value, note, color, max }: { label: string; value: number; note: string; color: string; max: number }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  const isPositive = value >= 0
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: T3, fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 9, color: T4 }}>· {note}</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
          {isPositive ? '+' : ''}{value.toFixed(1)}
        </span>
      </div>
      <div style={{ height: 8, background: '#131e31', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color,
          borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 10px ${color}44`,
        }} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function CustomerZeroPage() {
  const { data, isLoading, error } = useQuery<CustomerZeroReport>({
    queryKey: ['customer-zero-report'],
    queryFn:  () => adminApi('/admin/enterprise/customer-zero'),
    staleTime: 60_000,
  })

  const { data: activity } = useQuery<PlatformActivity>({
    queryKey: ['customer-zero-activity'],
    queryFn:  () => adminApi('/admin/enterprise/customer-zero/activity'),
    staleTime: 30_000, refetchInterval: 60_000,
  })

  const { data: pulse } = useQuery<OperatingPulse>({
    queryKey: ['customer-zero-pulse'],
    queryFn:  () => adminApi('/admin/enterprise/customer-zero/pulse'),
    staleTime: 55 * 60_000, refetchInterval: 60 * 60_000,
  })

  const { data: blueprints = [] } = useQuery<BlueprintMeta[]>({
    queryKey: ['enterprise-blueprints'],
    queryFn:  () => adminApi('/admin/enterprise/blueprints'),
    staleTime: 60_000,
  })

  const { data: g8History = [] } = useQuery<any[]>({
    queryKey: ['gate8-history'],
    queryFn:  () => adminApi('/admin/gate8/history?limit=12'),
    staleTime: 60_000,
  })

  const { data: g8Score } = useQuery<any>({
    queryKey: ['gate8-score'],
    queryFn:  () => adminApi('/admin/gate8/score'),
    staleTime: 60_000,
  })

  const qc = useQueryClient()
  const [snapMsg, setSnapMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [confirmOff, setConfirmOff] = useState(false)

  const snapshotMut = useMutation({
    mutationFn: () => adminApi('/admin/gate8/snapshot', { method: 'POST', body: JSON.stringify({ triggeredBy: 'MANUAL' }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gate8-history'] })
      qc.invalidateQueries({ queryKey: ['customer-zero-report'] })
      qc.invalidateQueries({ queryKey: ['gate8-score'] })
      setSnapMsg({ ok: true, text: 'Snapshot saved' })
      setTimeout(() => setSnapMsg(null), 4000)
    },
    onError: (e: any) => setSnapMsg({ ok: false, text: e?.message ?? 'Snapshot failed' }),
  })

  const activateMut = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/blueprints/${id}/activate`, { method: 'PATCH' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enterprise-blueprints'] })
      adminApi('/admin/gate8/snapshot', { method: 'POST' }).catch(() => {})
      setConfirmOff(false)
    },
  })

  const archiveMut = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/blueprints/${id}/archive`, { method: 'PATCH' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enterprise-blueprints'] }); setConfirmOff(false) },
  })

  const generateMut = useMutation({
    mutationFn: () => adminApi('/admin/enterprise/blueprints/generate', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Kangqore OS v1.0', orgName: 'Kangqore Global',
        pack: 'professional-services', industry: 'Professional Services', orgSize: 'SME',
      }),
    }),
    onSuccess: (bp: any) => {
      qc.invalidateQueries({ queryKey: ['enterprise-blueprints'] })
      activateMut.mutate(bp.id)
    },
  })

  const activeBlueprint  = blueprints.find(b => b.status === 'ACTIVE')
  const draftBlueprint   = !activeBlueprint ? blueprints.find(b => b.status === 'DRAFT') : undefined
  const blueprintDisplay = activeBlueprint ?? draftBlueprint ?? null
  const isProduction     = activeBlueprint != null
  const togglePending    = activateMut.isPending || archiveMut.isPending || generateMut.isPending

  function handleProductionToggle() {
    if (isProduction) {
      if (!confirmOff) { setConfirmOff(true); return }
      archiveMut.mutate(blueprintDisplay!.id)
    } else if (blueprintDisplay) {
      activateMut.mutate(blueprintDisplay.id)
    } else {
      generateMut.mutate()
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: `3px solid ${BDR}`, borderTopColor: BLUE,
        animation: 'spin 0.9s linear infinite',
      }} />
      <span style={{ fontSize: 13, color: T3 }}>Generating Customer Zero Report™…</span>
    </div>
  )

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !data) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 20, background: SURF1,
      borderRadius: 14, border: `1px solid ${BDR}`, padding: 56,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: SURF2, border: `1px solid ${BDR}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FileText size={24} style={{ color: T4 }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T2, marginBottom: 8 }}>No baseline snapshot</div>
        <div style={{ fontSize: 12, color: T3, maxWidth: 320, lineHeight: 1.6 }}>
          Set a baseline OIS snapshot to generate the Customer Zero Report™. This locks your Day 0 score.
        </div>
      </div>
      <button onClick={() => snapshotMut.mutate()} disabled={snapshotMut.isPending}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700,
          padding: '10px 24px', borderRadius: 9,
          background: BLUE, color: '#fff', border: 'none',
          cursor: 'pointer', opacity: snapshotMut.isPending ? 0.6 : 1,
          boxShadow: `0 0 20px ${BLUE}30`,
        }}>
        <Camera size={14} /> {snapshotMut.isPending ? 'Computing…' : 'Set Baseline Now'}
      </button>
    </div>
  )

  // ── Derived ────────────────────────────────────────────────────────────────
  const periodStr = data.periodStart
    ? `${new Date(data.periodStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — ${new Date(data.periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : `As of ${new Date(data.periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`

  const maturityColor = EMI_COLOR[data.maturityAfter] ?? BLUE
  const modeColor     = isProduction ? GREEN : GOLD

  const pillars = g8Score ? [
    { id: 'decision',   label: 'Decision',   score: g8Score.decisionScore   ?? 0 },
    { id: 'enterprise', label: 'Enterprise', score: g8Score.enterpriseScore ?? 0 },
    { id: 'workflow',   label: 'Workflow',   score: g8Score.workflowScore   ?? 0 },
    { id: 'goal',       label: 'Goals',      score: g8Score.goalScore       ?? 0 },
    { id: 'ai',         label: 'AI',         score: g8Score.aiScore         ?? 0 },
    { id: 'business',   label: 'Business',   score: g8Score.businessScore   ?? 0 },
    { id: 'trust',      label: 'Trust',      score: g8Score.trustScore      ?? 0 },
    { id: 'learning',   label: 'Learning',   score: g8Score.learningScore   ?? 0 },
    { id: 'adoption',   label: 'Adoption',   score: g8Score.adoptionScore   ?? 0 },
  ] : []

  const snapshots  = [...g8History].reverse()
  const BASE_SCORE = data.oisBefore ?? snapshots[0]?.oisScore ?? data.oisAfter
  const BASE_DATE  = new Date(snapshots[0]?.createdAt ?? data.periodStart ?? Date.now())

  const enterpriseGoals: any[] = g8Score?.pillars?.goal?.metrics?.enterpriseGoals ?? []
  const healthyCount  = pillars.filter(p => p.score >= 75).length
  const criticalCount = pillars.filter(p => p.score < 50).length
  const coigMax       = Math.max(data.coigPotential, 10)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          COMMAND HEADER
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 20px',
        background: SURF1, border: `1px solid ${BDR}`, borderRadius: 12,
        flexWrap: 'wrap',
      }}>
        {/* Badge + org */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${BLUE}30, ${PURP}20)`,
            border: `1px solid ${BLUE}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Award size={16} style={{ color: GOLD }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Customer Zero Report™
              </span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T1, letterSpacing: '-0.01em' }}>
              {data.organization}
            </div>
          </div>
        </div>

        {/* Period + platform */}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 1, minWidth: 160 }}>
          <span style={{ fontSize: 10, color: T3 }}>{data.platform}</span>
          <span style={{ fontSize: 10, color: T4 }}>{periodStr}</span>
        </div>

        {/* EMI badge */}
        <span style={{
          fontSize: 10, fontWeight: 700, color: maturityColor,
          background: maturityColor + '18', border: `1px solid ${maturityColor}33`,
          padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', flexShrink: 0,
        }}>
          EMI™ {data.maturityAfter}
        </span>

        {/* Mode badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
          padding: '5px 12px', borderRadius: 20,
          background: modeColor + '10', border: `1px solid ${modeColor}28`,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%', background: modeColor,
            boxShadow: isProduction ? `0 0 0 3px ${GREEN}25, 0 0 8px ${GREEN}40` : 'none',
            animation: isProduction ? 'pulse-ring 2s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: modeColor }}>
            {isProduction ? 'PRODUCTION' : 'STAGING'}
          </span>
        </div>

        {/* Export */}
        <button
          onClick={() => window.print()}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600,
            color: T3, background: SURF2, border: `1px solid ${BDR}`,
            borderRadius: 7, padding: '5px 12px', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Download size={11} /> Export
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          INTELLIGENCE TRIPTYCH
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 300px',
        gap: 14,
      }}>

        {/* OIS Gauge panel */}
        <div style={{
          background: `linear-gradient(160deg, #0c1320 0%, #111829 60%, #16102a 100%)`,
          border: `1px solid ${BLUE}20`,
          borderRadius: 14, padding: '24px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
            width: 200, height: 200, borderRadius: '50%',
            background: `${BLUE}0a`, filter: 'blur(50px)', pointerEvents: 'none',
          }} />

          <div style={{ fontSize: 9, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.12em', alignSelf: 'flex-start' }}>
            Operational Intelligence Score
          </div>

          <OISGauge score={data.oisAfter} before={data.oisBefore} size="lg" />

          {/* Pillar health summary */}
          {pillars.length > 0 && (
            <div style={{
              display: 'flex', gap: 8, width: '100%',
              padding: '10px 14px', background: 'rgba(255,255,255,0.025)',
              borderRadius: 8, border: `1px solid rgba(255,255,255,0.05)`,
            }}>
              {[
                { label: 'Healthy', count: healthyCount, color: GREEN },
                { label: 'Warning', count: pillars.filter(p => p.score >= 50 && p.score < 75).length, color: GOLD },
                { label: 'Critical', count: criticalCount, color: RED },
              ].map(z => (
                <div key={z.label} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: z.count > 0 ? z.color : T4, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {z.count}
                  </div>
                  <div style={{ fontSize: 8, color: T4, marginTop: 2 }}>{z.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COIG Intelligence Gain */}
        <div style={{
          background: SURF1, border: `1px solid ${BDR}`,
          borderRadius: 14, padding: '24px 24px',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <SectionLabel color={GOLD} icon={TrendingUp}>COIG™ — Operational Intelligence Gain</SectionLabel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CoigBar label="Current"   value={data.coig}          note="measured"   color={BLUE}  max={coigMax} />
            <CoigBar label="Expected"  value={data.coigExpected}  note="90-day forecast" color={GOLD}  max={coigMax} />
            <CoigBar label="Potential" value={data.coigPotential} note="all recs applied" color={PURP}  max={coigMax} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, paddingTop: 4, borderTop: `1px solid ${BDR}` }}>
            {[
              { label: 'Hours Saved',    value: data.hoursSaved > 0 ? `${data.hoursSaved}h` : '—',                      color: GREEN },
              { label: 'Workflows',      value: data.workflowsCompleted > 0 ? data.workflowsCompleted : '—',            color: BLUE  },
              { label: 'Automation',     value: data.automationCoverage > 0 ? `${data.automationCoverage}%` : '—',      color: PURP  },
              { label: 'Tasks Elim.',    value: data.manualEliminated > 0 ? data.manualEliminated : '—',                color: GOLD  },
            ].map(m => (
              <div key={m.label} style={{
                padding: '10px 12px', background: SURF2,
                border: `1px solid ${BDR_S}`, borderRadius: 8, textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.value === '—' ? T4 : m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 9, color: T4, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Production Control */}
        <div style={{
          background: SURF1, border: `1px solid ${isProduction ? GREEN + '30' : BDR}`,
          borderRadius: 14, padding: '24px 20px',
          display: 'flex', flexDirection: 'column', gap: 18,
          boxShadow: isProduction ? `0 0 20px ${GREEN}10` : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionLabel color={modeColor} icon={isProduction ? CheckCircle2 : AlertTriangle}>
              {isProduction ? 'Live Production' : 'Staging Mode'}
            </SectionLabel>
          </div>

          {/* Big toggle */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            padding: '20px 16px',
            background: isProduction ? GREEN + '08' : SURF2,
            border: `1px solid ${isProduction ? GREEN + '25' : BDR_S}`,
            borderRadius: 10,
          }}>
            <button
              onClick={handleProductionToggle}
              disabled={togglePending}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center',
                width: 60, height: 32, borderRadius: 20, padding: 4,
                background: isProduction ? GREEN : '#1e2a3e',
                border: `2px solid ${isProduction ? GREEN + '60' : BDR}`,
                cursor: togglePending ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: togglePending ? 0.65 : 1,
                justifyContent: isProduction ? 'flex-end' : 'flex-start',
                boxShadow: isProduction ? `0 0 16px ${GREEN}30` : 'none',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.35)', transition: 'all 0.3s ease',
              }} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: modeColor, marginBottom: 4 }}>
                {togglePending ? 'Switching…'
                  : isProduction ? 'Currently LIVE'
                  : blueprintDisplay ? 'Ready to go live'
                  : 'No Blueprint yet'}
              </div>
              <div style={{ fontSize: 10, color: T4, lineHeight: 1.5 }}>
                {isProduction
                  ? 'Real clients can connect. Toggle off to go back to staging.'
                  : blueprintDisplay
                    ? 'Internal only. Flip to go live with real clients.'
                    : 'Flip to generate Blueprint from live DB and go live.'}
              </div>
            </div>

            {/* Confirm off */}
            {confirmOff && (
              <div style={{
                display: 'flex', gap: 6, width: '100%',
                padding: '8px 10px', borderRadius: 7,
                background: RED + '0e', border: `1px solid ${RED}25`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: RED, fontWeight: 600, marginBottom: 2 }}>Are you sure?</div>
                  <div style={{ fontSize: 9, color: T4 }}>This will move to staging mode.</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button onClick={() => archiveMut.mutate(blueprintDisplay!.id)} style={{
                    fontSize: 9, fontWeight: 700, color: '#fff', background: RED, border: 'none',
                    borderRadius: 4, padding: '3px 8px', cursor: 'pointer',
                  }}>Confirm</button>
                  <button onClick={() => setConfirmOff(false)} style={{
                    fontSize: 9, color: T4, background: 'transparent', border: `1px solid ${BDR}`,
                    borderRadius: 4, padding: '3px 8px', cursor: 'pointer',
                  }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Blueprint */}
          {blueprintDisplay && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', background: SURF2, borderRadius: 8,
              border: `1px solid ${BDR_S}`,
            }}>
              <FileJson size={13} style={{ color: INDIGO, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: INDIGO, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {blueprintDisplay.name}
                </div>
                <div style={{ fontSize: 9, color: T4 }}>v{blueprintDisplay.version} · {blueprintDisplay.pack ?? 'professional-services'}</div>
              </div>
              <span style={{
                fontSize: 8, fontWeight: 700, color: modeColor,
                background: modeColor + '18', border: `1px solid ${modeColor}30`,
                padding: '2px 7px', borderRadius: 4,
              }}>
                {blueprintDisplay.status}
              </span>
              <Link to="/kangqore-view/admin/kangqore-immp/blueprint" style={{ fontSize: 9, color: INDIGO, textDecoration: 'none', flexShrink: 0 }}>
                View →
              </Link>
            </div>
          )}

          {/* Snapshot button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={() => { setSnapMsg(null); snapshotMut.mutate() }}
              disabled={snapshotMut.isPending}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontSize: 11, fontWeight: 700, padding: '9px 14px', borderRadius: 8,
                background: `${BLUE}18`, color: BLUE, border: `1px solid ${BLUE}30`,
                cursor: snapshotMut.isPending ? 'not-allowed' : 'pointer',
                opacity: snapshotMut.isPending ? 0.6 : 1, width: '100%',
              }}
            >
              <Camera size={12} style={{ animation: snapshotMut.isPending ? 'spin 1s linear infinite' : 'none' }} />
              {snapshotMut.isPending ? 'Computing…' : 'Snapshot OIS Now'}
            </button>
            {snapMsg && (
              <div style={{
                fontSize: 10, padding: '5px 10px', borderRadius: 6, fontWeight: 600, textAlign: 'center',
                background: snapMsg.ok ? GREEN + '15' : RED + '15',
                color: snapMsg.ok ? GREEN : RED,
                border: `1px solid ${snapMsg.ok ? GREEN : RED}33`,
              }}>
                {snapMsg.ok ? '✓ ' : '✕ '}{snapMsg.text}
              </div>
            )}
          </div>

          {/* Seed data warning */}
          {!isProduction && blueprintDisplay && (
            <div style={{
              fontSize: 10, color: GOLD, lineHeight: 1.5,
              background: GOLD + '08', border: `1px dashed ${GOLD}30`,
              borderRadius: 7, padding: '8px 10px',
              display: 'flex', alignItems: 'flex-start', gap: 6,
            }}>
              <AlertTriangle size={11} style={{ color: GOLD, flexShrink: 0, marginTop: 1 }} />
              <span>
                PMO contains seed data. Replace before going live.{' '}
                <Link to="/kangqore-view/admin/projects" style={{ color: GOLD, fontWeight: 700 }}>Replace →</Link>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          9 PILLAR INTELLIGENCE
      ════════════════════════════════════════════════════════════════════════ */}
      {pillars.length > 0 && (
        <div style={{
          background: SURF1, border: `1px solid ${BDR}`, borderRadius: 12, padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <SectionLabel color={BLUE} icon={Activity}>OIS™ — 9 Intelligence Pillars</SectionLabel>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              padding: '4px 14px', borderRadius: 20,
              background: `${BLUE}10`, border: `1px solid ${BLUE}22`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: BLUE, fontVariantNumeric: 'tabular-nums' }}>
                {data.oisAfter.toFixed(1)}
              </span>
              <div style={{ width: 1, height: 12, background: BDR }} />
              {(() => {
                const g = gradeFromScore(data.oisAfter)
                const gc = g === 'A' || g === 'B' ? GREEN : g === 'C' ? GOLD : RED
                return <span style={{ fontSize: 10, fontWeight: 800, color: gc }}>Grade {g}</span>
              })()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px 20px' }}>
            {pillars.map((p, i) => <PillarRow key={p.id} id={p.id} label={p.label} score={p.score} index={i} />)}
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BDR}`, flexWrap: 'wrap' }}>
            {[
              { label: 'Healthy (75–100)', color: GREEN },
              { label: 'Warning (50–74)',  color: GOLD  },
              { label: 'Critical (< 50)', color: RED   },
            ].map(z => (
              <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: z.color }} />
                <span style={{ fontSize: 9, color: T4 }}>{z.label}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 9, color: T4, fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ color: GREEN }}>{healthyCount}</span> healthy ·{' '}
              <span style={{ color: GOLD }}>{pillars.filter(p => p.score >= 50 && p.score < 75).length}</span> warning ·{' '}
              <span style={{ color: RED }}>{criticalCount}</span> critical
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PULSE + ACTIVITY — 2 column
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* WAANDA Pulse */}
        {pulse?.summary ? (() => {
          const hc = pulse.health === 'healthy' ? GREEN : pulse.health === 'warning' ? GOLD : RED
          return (
            <div style={{
              background: SURF1, border: `1px solid ${hc}20`,
              borderRadius: 12, padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SectionLabel color={PURP} icon={Brain}>WAANDA Enterprise Pulse</SectionLabel>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: hc,
                  background: hc + '18', border: `1px solid ${hc}30`,
                  padding: '2px 8px', borderRadius: 5, textTransform: 'uppercase', flexShrink: 0,
                }}>
                  {pulse.health}
                </span>
              </div>

              <p style={{ fontSize: 12, color: T2, lineHeight: 1.7, margin: 0 }}>{pulse.summary}</p>

              {pulse.drivers.length > 0 && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {pulse.drivers.map((d, i) => {
                    const dc = d.signal === 'positive' ? GREEN : d.signal === 'negative' ? RED : T3
                    return (
                      <span key={i} style={{
                        fontSize: 9, color: dc, background: dc + '10',
                        border: `1px solid ${dc}22`, borderRadius: 5,
                        padding: '2px 8px', fontWeight: 600,
                      }}>
                        {d.metric}: {d.value}
                      </span>
                    )
                  })}
                  {pulse.recommendedAction && (
                    <span style={{
                      fontSize: 9, color: GOLD, background: GOLD + '10',
                      border: `1px solid ${GOLD}22`, borderRadius: 5, padding: '2px 8px',
                    }}>
                      ⚡ {pulse.recommendedAction}
                    </span>
                  )}
                </div>
              )}

              <div style={{ fontSize: 9, color: T4, marginTop: 'auto' }}>
                {Math.round(pulse.confidence * 100)}% confidence ·{' '}
                {new Date(pulse.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )
        })() : (
          <div style={{
            background: SURF1, border: `1px solid ${BDR}`,
            borderRadius: 12, padding: '20px 22px',
            display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start',
          }}>
            <SectionLabel color={PURP} icon={Brain}>WAANDA Enterprise Pulse</SectionLabel>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px 0' }}>
              <span style={{ fontSize: 11, color: T4 }}>Pulse will generate after first active session.</span>
            </div>
          </div>
        )}

        {/* Adoption Signal */}
        {activity ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionLabel color={GREEN} icon={Zap}>Adoption Signal · Live</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <ActivityCard icon={Cpu}         color={BLUE}  label="Missions (24h)"    value={activity.missionsLast24h}    window="24h"  trend={activity.missionsTrend} />
              <ActivityCard icon={Brain}        color={PURP}  label="Decisions (7d)"   value={activity.decisionsLast7d}    window="7d"   trend={activity.decisionsTrend} />
              <ActivityCard icon={Timer}        color={GREEN} label="Hours Captured"   value={activity.estimatedTimeSaved} unit="h" />
              <ActivityCard icon={Lightbulb}    color={GOLD}  label="Evidence"         value={activity.evidenceCaptured}   trend={activity.evidenceTrend} />
              <ActivityCard icon={FlaskConical} color={BLUE}  label="Simulations"      value={activity.simulationRuns}     trend={activity.simulationsTrend} />
              <ActivityCard icon={Wand2}        color={PURP}  label="WAANDA Sessions"  value={activity.waandaSessions} />
            </div>

            {/* Context prompt */}
            {(() => {
              const { missionsLast24h: m, decisionsLast7d: d, evidenceCaptured: e, simulationRuns: s, waandaSessions: w } = activity
              let prompt: string | null = null, col = GOLD

              if (m === 0 && d === 0 && e === 0 && s === 0 && w === 0) {
                prompt = 'Platform not yet operationally active. Run a KIMMP briefing to start the adoption clock.'
                col = GOLD
              } else if (m === 0 && d > 0) {
                prompt = 'Decisions exist but no missions in 24h. Return to Mission Control and trigger a briefing.'
                col = GOLD
              } else if (m > 0 && d === 0) {
                prompt = `${m} mission${m > 1 ? 's' : ''} active but no decisions this week. Log a decision in KIMMP.`
                col = '#f97316'
              }

              if (!prompt) return null
              return (
                <div style={{
                  padding: '9px 14px',
                  background: col + '0e', border: `1px solid ${col}22`, borderRadius: 8,
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <AlertTriangle size={11} style={{ color: col, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 11, color: T3, lineHeight: 1.55 }}>{prompt}</span>
                </div>
              )
            })()}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
            <span style={{ fontSize: 11, color: T4 }}>Activity loading…</span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          GOALS + RECOMMENDATIONS
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Enterprise Goals */}
        <div style={{ background: SURF1, border: `1px solid ${BDR}`, borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ marginBottom: 16 }}>
            <SectionLabel color={PURP} icon={Target}>Enterprise Goals</SectionLabel>
          </div>

          {enterpriseGoals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {enterpriseGoals.map((g: any, i: number) => {
                const pct = Math.min(g.attainmentPct ?? 0, 100)
                const col = pct >= 75 ? GREEN : pct >= 50 ? GOLD : RED
                const currentVal = g.current != null ? g.current : null
                return (
                  <div key={i} style={{
                    padding: '11px 14px', background: SURF2,
                    border: `1px solid ${BDR_S}`, borderRadius: 9,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                          background: col + '18', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 8, fontWeight: 800, color: col,
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: T2 }}>{g.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ height: 6, background: '#131e31', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
                      <div style={{
                        width: `${pct}%`, height: '100%', background: col,
                        borderRadius: 3, transition: 'width 1s ease',
                        boxShadow: pct >= 75 ? `0 0 6px ${col}40` : 'none',
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: T4 }}>
                      <span>
                        Current: <strong style={{ color: T3 }}>{currentVal != null ? `${currentVal} ${g.unit}` : '—'}</strong>
                      </span>
                      <span>
                        Target: <strong style={{ color: T3 }}>{g.target} {g.unit}</strong>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : data.goalProgress.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.goalProgress.map((g, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', background: SURF2, border: `1px solid ${BDR_S}`, borderRadius: 8,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    background: PURP + '18', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 8, fontWeight: 800, color: PURP,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T2 }}>{g.label}</div>
                    <div style={{ fontSize: 9, color: T4, marginTop: 1 }}>Target: {g.target}{g.unit && ` ${g.unit}`}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
              <p style={{ fontSize: 12, color: T3, margin: 0 }}>No enterprise goals defined yet.</p>
              <Link to="/kangqore-view/admin/kangqore-immp/enterprise" style={{
                fontSize: 11, fontWeight: 600, color: PURP, textDecoration: 'none',
                padding: '5px 12px', borderRadius: 6, background: PURP + '12', border: `1px solid ${PURP}30`,
              }}>
                Set Goals →
              </Link>
            </div>
          )}
        </div>

        {/* Top Recommendations */}
        <div style={{ background: SURF1, border: `1px solid ${BDR}`, borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ marginBottom: 16 }}>
            <SectionLabel color={GREEN} icon={Sparkles}>Top Recommendations</SectionLabel>
          </div>

          {data.topRecommendations.length === 0 ? (
            <p style={{ fontSize: 12, color: T3, margin: 0 }}>No recommendations generated yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.topRecommendations.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '12px 14px', background: SURF2,
                  border: `1px solid ${i === 0 ? GREEN + '28' : BDR_S}`,
                  borderRadius: 9,
                  boxShadow: i === 0 ? `0 0 12px ${GREEN}08` : 'none',
                }}>
                  <div style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 800, color: '#fff',
                    background: i === 0 ? GREEN : i === 1 ? BLUE : T4,
                  }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: T2, lineHeight: 1.55, margin: '0 0 6px' }}>{r.action}</p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 9, color: GREEN, fontWeight: 700,
                      background: GREEN + '12', padding: '2px 8px', borderRadius: 5,
                      border: `1px solid ${GREEN}25`,
                    }}>
                      <TrendingUp size={8} /> +{r.oisImpact.toFixed(1)} OIS
                    </span>
                  </div>
                  {i === 0 && (
                    <ChevronRight size={14} style={{ color: GREEN, flexShrink: 0, marginTop: 2 }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          COIG TIMELINE
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: SURF1, border: `1px solid ${BDR}`, borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <SectionLabel color={BLUE} icon={Layers}>COIG™ Milestone Timeline</SectionLabel>
        </div>

        {snapshots.length > 0 ? (
          <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              minWidth: Math.max(snapshots.length * 90, 500),
            }}>
              {snapshots.map((snap: any, i: number) => {
                const delta    = +(snap.oisScore - BASE_SCORE).toFixed(1)
                const isBase   = i === 0
                const isLatest = i === snapshots.length - 1
                const col      = isBase ? BLUE : delta > 3 ? GREEN : delta > 0 ? BLUE : delta === 0 ? T4 : RED
                const snapDate = new Date(snap.createdAt)
                const daysDiff = Math.round((snapDate.getTime() - BASE_DATE.getTime()) / 86400000)
                return (
                  <div key={snap.id ?? i} style={{
                    flex: '1 0 90px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 6, position: 'relative',
                  }}>
                    {i < snapshots.length - 1 && (
                      <div style={{
                        position: 'absolute', top: 9, left: '50%', width: '100%',
                        height: 1, background: BDR, zIndex: 0,
                      }} />
                    )}
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', zIndex: 1, flexShrink: 0,
                      background: isLatest ? col : isBase ? BLUE + '55' : SURF3,
                      border: `2px solid ${isLatest ? col : isBase ? BLUE : BDR}`,
                      boxShadow: isLatest ? `0 0 0 4px ${col}18, 0 0 10px ${col}40` : 'none',
                    }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: isLatest ? col : isBase ? BLUE : T3, fontVariantNumeric: 'tabular-nums' }}>
                        {snap.oisScore.toFixed(1)}
                      </div>
                      {!isBase && delta !== 0 && (
                        <div style={{ fontSize: 9, fontWeight: 700, color: delta >= 0 ? GREEN : RED }}>
                          {delta >= 0 ? '+' : ''}{delta}
                        </div>
                      )}
                      <div style={{ fontSize: 8, color: T4, marginTop: 3 }}>
                        {isBase ? 'Day 0' : `Day ${daysDiff}`}
                      </div>
                      <div style={{ fontSize: 8, color: T4 }}>
                        {snapDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {[
              { label: 'Day 0',  sub: 'Baseline',   score: BASE_SCORE.toFixed(1),           col: BLUE,  active: true  },
              { label: 'Week 1', sub: 'Go-live',     score: '—',                             col: T4,    active: false },
              { label: 'Week 4', sub: '+5 target',   score: (BASE_SCORE + 5).toFixed(1)+'+', col: GREEN, active: false },
              { label: 'Day 90', sub: '+6.1 target', score: (BASE_SCORE + 6.1).toFixed(1)+'+', col: GREEN, active: false },
            ].map((m, i, arr) => (
              <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{ position: 'absolute', top: 9, left: '50%', width: '100%', height: 1, background: BDR }} />
                )}
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', zIndex: 1,
                  background: m.active ? BLUE : SURF3, border: `2px solid ${m.active ? BLUE : BDR}`,
                  boxShadow: m.active ? `0 0 0 4px ${BLUE}18` : 'none',
                }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.score}</div>
                  <div style={{ fontSize: 8, color: T4, marginTop: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 8, color: T4 }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14, fontSize: 9, color: T4, flexWrap: 'wrap' }}>
          <span>Baseline: <strong style={{ color: BLUE, fontVariantNumeric: 'tabular-nums' }}>{BASE_SCORE.toFixed(1)}</strong></span>
          {snapshots.length > 0 && <span>{snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''}</span>}
          <span>90-day target: <strong style={{ color: GREEN, fontVariantNumeric: 'tabular-nums' }}>{(BASE_SCORE + 6.1).toFixed(1)}+</strong></span>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/kangqore-view/admin/kangqore-immp/operational-intel" style={{ fontSize: 9, color: BLUE, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
              Full OIS Dashboard <ChevronRight size={9} />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: SURF1, border: `1px solid ${BDR}`, borderRadius: 10,
        padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <ShieldCheck size={11} style={{ color: T4 }} />
        <span style={{ fontSize: 9, color: T4 }}>
          Verified by <strong style={{ color: T3 }}>{data.verifiedBy}</strong>
        </span>
        <div style={{ flex: 1 }} />
        <Clock size={10} style={{ color: T4 }} />
        <span style={{ fontSize: 9, color: T4 }}>
          Generated {new Date(data.generatedAt).toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </div>

    </div>
  )
}
