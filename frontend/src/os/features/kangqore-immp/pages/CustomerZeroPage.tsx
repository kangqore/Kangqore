import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminApi } from '@lib/api'
import {
  Award, TrendingUp, Zap, Clock, FileText, Download, Layers,
  Cpu, Brain, BarChart2, Wand2, FlaskConical, Lightbulb, Timer,
  ArrowUp, ArrowDown, Minus, FileJson, RefreshCw, ShieldCheck,
  Target, CheckCircle2, AlertTriangle, Camera, ChevronRight,
  Activity, Sparkles, Play, Pause,
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
const BLUE   = '#3B82F6'   // Aurora Blue
const GREEN  = '#22C55E'   // Emerald Green
const MINT   = '#10B981'   // Evergreen Mint
const GOLD   = '#F59E08'   // Amber Gold
const PURP   = '#8B5CF6'   // Royal Purple
const RED    = '#F43F5E'   // Coral Rose
const ORANGE = '#FB923C'   // Sunset Peach
const INDIGO = '#6366F1'   // Slate Indigo
const TEAL   = '#14B8A6'   // Ocean Teal
const PINK   = '#D946EF'   // Cosmic Magenta

// light-tint backgrounds from the palette
const BLUE_BG   = '#DBEAFE'
const GREEN_BG  = '#DCFCE7'
const MINT_BG   = '#D1FAE5'
const GOLD_BG   = '#FEF3C7'
const PURP_BG   = '#EDE9FE'
const RED_BG    = '#FFE4E6'
const ORANGE_BG = '#FFEDD5'
const INDIGO_BG = '#E0E7FF'
const TEAL_BG   = '#CCFBF1'
const PINK_BG   = '#FCE7F3'

const EMI_COLOR: Record<string, string> = {
  L1: RED, L2: ORANGE, L3: BLUE, L4: PURP, L5: MINT,
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
function scoreColor(v: number) { return v >= 75 ? MINT : v >= 50 ? GOLD : RED }

// ── OIS Score Display ─────────────────────────────────────────────────────────

const OIS_ZONES = [
  { label: 'Critical', max: 20,  color: RED,    bg: RED_BG    },
  { label: 'Poor',     max: 40,  color: ORANGE, bg: ORANGE_BG },
  { label: 'Fair',     max: 60,  color: GOLD,   bg: GOLD_BG   },
  { label: 'Good',     max: 80,  color: BLUE,   bg: BLUE_BG   },
  { label: 'Excellent',max: 100, color: MINT,   bg: MINT_BG   },
]

function OISScoreDisplay({ score, before }: { score: number; before: number | null }) {
  const grade    = gradeFromScore(score)
  const gc       = grade === 'A' || grade === 'B' ? GREEN : grade === 'C' ? GOLD : RED
  const hasDelta = before !== null && before !== score
  const delta    = hasDelta ? score - before! : 0
  const deltaCol = delta >= 0 ? GREEN : RED
  const pct      = Math.min(Math.max(score, 0), 100)

  // which zone is the score in?
  const activeZone = OIS_ZONES.find(z => score <= z.max) ?? OIS_ZONES[4]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Big score ── */}
      <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
        <div style={{
          fontSize: 76, fontWeight: 900, lineHeight: 1,
          color: gc,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
          fontFamily: "-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif",
        }}>
          {score.toFixed(1)}
        </div>
        <div style={{ fontSize: 10, color: T4, marginTop: 5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          OIS™ Score
        </div>
      </div>

      {/* ── Grade + delta chips ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22 }}>
        <div style={{
          padding: '5px 18px', borderRadius: 20,
          background: gc + '12', border: `1px solid ${gc}30`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: gc }}>Grade {grade}</span>
        </div>
        {hasDelta && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 12px', borderRadius: 20,
            background: deltaCol + '0e', border: `1px solid ${deltaCol}28`,
          }}>
            {delta >= 0
              ? <ArrowUp size={10} style={{ color: deltaCol }} />
              : <ArrowDown size={10} style={{ color: deltaCol }} />}
            <span style={{ fontSize: 12, fontWeight: 800, color: deltaCol }}>
              {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pts
            </span>
          </div>
        )}
      </div>

      {/* ── Zone band ── */}
      <div style={{ padding: '0 2px' }}>

        {/* zone label row */}
        <div style={{ display: 'flex', marginBottom: 5 }}>
          {OIS_ZONES.map(z => {
            const isActive = z.label === activeZone.label
            return (
              <div key={z.label} style={{ flex: 1, textAlign: 'center' }}>
                <span style={{
                  fontSize: 8, fontWeight: isActive ? 800 : 500,
                  color: isActive ? z.color : T4,
                  letterSpacing: '0.04em',
                }}>
                  {z.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* the bar */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', gap: 1.5 }}>
            {OIS_ZONES.map((z, i) => {
              const prevMax = i === 0 ? 0 : OIS_ZONES[i - 1].max
              const segPct  = ((z.max - prevMax) / 100) * 100
              const filled  = score >= z.max         // fully lit
              const partial = !filled && score > prevMax  // currently here
              const opacity = filled ? 1 : partial ? 1 : 0.14
              return (
                <div key={z.label} style={{
                  flex: 1, background: z.color,
                  opacity,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* partial fill within the active segment */}
                  {partial && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: z.color, opacity: 0.14,
                    }} />
                  )}
                  {partial && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      width: `${((score - prevMax) / (z.max - prevMax)) * 100}%`,
                      background: z.color,
                    }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* score marker */}
          <div style={{
            position: 'absolute', top: -3, left: `${pct}%`,
            transform: 'translateX(-50%)',
            width: 3, height: 16, background: gc,
            borderRadius: 2,
            boxShadow: `0 0 0 2px white, 0 0 0 3px ${gc}`,
          }} />
        </div>

        {/* axis numbers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {[0, 20, 40, 60, 80, 100].map(v => (
            <span key={v} style={{ fontSize: 8, color: T4, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
          ))}
        </div>

        {/* current score callout */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          marginTop: 10, padding: '6px 14px', borderRadius: 8,
          background: activeZone.bg, border: `1px solid ${activeZone.color}30`,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: gc }} />
          <span style={{ fontSize: 10, color: gc, fontWeight: 700 }}>
            {score.toFixed(1)} — {activeZone.label}
          </span>
          {before !== null && (
            <span style={{ fontSize: 9, color: T4 }}>
              · was {before.toFixed(1)}
            </span>
          )}
        </div>
      </div>

    </div>
  )
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ children, color = T4, icon: Icon }: { children: React.ReactNode; color?: string; icon?: any }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Icon && <Icon size={11} style={{ color, flexShrink: 0 }} />}
      <span style={{
        fontSize: 9, fontWeight: 800, color,
        textTransform: 'uppercase', letterSpacing: '0.13em', whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: color === T4 ? BDR : color + '28' }} />
    </div>
  )
}

// ── Pillar row ─────────────────────────────────────────────────────────────────

function PillarRow({ id, label, score, index }: { id: string; label: string; score: number; index: number }) {
  const col = scoreColor(score)
  const wt  = PILLAR_WEIGHT[id] ?? ''

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 10px', borderRadius: 7,
      background: index % 2 === 0 ? 'rgba(0,0,0,0.025)' : 'transparent',
    }}>
      <span style={{ fontSize: 10, color: T3, width: 68, flexShrink: 0, textAlign: 'right', fontWeight: 600 }}>
        {label}
      </span>
      {wt && (
        <span style={{
          fontSize: 8, width: 24, flexShrink: 0, textAlign: 'center',
          background: col + '15', borderRadius: 3, padding: '1px 0',
          fontWeight: 700, color: col,
        }}>
          {wt}
        </span>
      )}
      <div style={{ flex: 1, position: 'relative', height: 7, background: 'rgba(0,0,0,0.07)', borderRadius: 4 }}>
        <div style={{
          width: `${score}%`, height: '100%', background: col,
          borderRadius: 4, transition: 'width 1s ease',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${score}%`,
          width: 11, height: 11, borderRadius: '50%',
          background: col, border: '2px solid white',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 1px 4px ${col}60`,
          transition: 'left 1s ease', zIndex: 1,
        }} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 900, color: col,
        width: 30, textAlign: 'right', flexShrink: 0,
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
      border: `1px solid ${isZero ? BDR_S : color + '30'}`,
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: isZero ? BDR : color,
        borderRadius: '10px 0 0 10px',
        opacity: isZero ? 0.2 : 1,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: isZero ? SURF3 : color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} style={{ color: isZero ? T4 : color }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {win && (
            <span style={{
              fontSize: 8, color: isZero ? T4 : color,
              background: isZero ? 'transparent' : color + '12',
              padding: '2px 6px', borderRadius: 4, fontWeight: 700,
              border: isZero ? `1px solid ${BDR_S}` : `1px solid ${color}28`,
            }}>
              {win}
            </span>
          )}
          {trend && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TI size={9} style={{ color: tc }} />
              {trend.delta !== 0 && (
                <span style={{ fontSize: 8, fontWeight: 800, color: tc }}>
                  {trend.delta > 0 ? '+' : ''}{trend.delta}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <div style={{ paddingLeft: 4 }}>
        {isZero ? (
          <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, color: T4, opacity: 0.25 }}>—</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{
              fontSize: 28, fontWeight: 900, lineHeight: 1,
              color, fontVariantNumeric: 'tabular-nums',
            }}>
              {value.toLocaleString()}
            </span>
            {unit && <span style={{ fontSize: 12, fontWeight: 600, color: color + 'aa' }}>{unit}</span>}
          </div>
        )}
        <div style={{ fontSize: 10, color: isZero ? T4 : T3, marginTop: 5, lineHeight: 1.35 }}>{label}</div>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}60` }} />
          <span style={{ fontSize: 11, color: T2, fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 9, color: T4 }}>· {note}</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>
          {isPositive ? '+' : ''}{value.toFixed(1)}
        </span>
      </div>
      <div style={{ height: 10, background: 'rgba(0,0,0,0.07)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color,
          borderRadius: 5, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 12px ${color}44`,
        }} />
      </div>
    </div>
  )
}

// ── Quick stat chip ────────────────────────────────────────────────────────────

const PALETTE_BG: Record<string, string> = {
  [BLUE]:   BLUE_BG,
  [MINT]:   MINT_BG,
  [GREEN]:  GREEN_BG,
  [GOLD]:   GOLD_BG,
  [PURP]:   PURP_BG,
  [RED]:    RED_BG,
  [ORANGE]: ORANGE_BG,
  [INDIGO]: INDIGO_BG,
  [TEAL]:   TEAL_BG,
  [PINK]:   PINK_BG,
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  const bg = PALETTE_BG[color] ?? color + '12'
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      padding: '8px 16px',
      background: bg,
      border: `1px solid ${color}30`,
      borderRadius: 10,
      minWidth: 80,
    }}>
      <span style={{ fontSize: 16, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: 9, fontWeight: 700, color, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  )
}

// ── Timeline sparkline ─────────────────────────────────────────────────────────

function TimelineSparkline({ snapshots, base }: { snapshots: any[]; base: number }) {
  if (snapshots.length < 2) return null
  const W = 640, H = 48, PAD = 4
  const scores = snapshots.map((s: any) => s.oisScore as number)
  const minS = Math.min(...scores, base) - 1
  const maxS = Math.max(...scores, base) + 1
  const range = maxS - minS || 1
  const pts = scores.map((s, i) => ({
    x: PAD + (i / (scores.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((s - minS) / range) * (H - PAD * 2),
  }))
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${d} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 48, overflow: 'visible', marginBottom: 8 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.18" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <path d={d} fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 2.5}
          fill={i === pts.length - 1 ? GREEN : BLUE}
          stroke={i === pts.length - 1 ? 'white' : 'none'} strokeWidth="1.5" />
      ))}
    </svg>
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
      justifyContent: 'center', gap: 20,
      background: SURF1, borderRadius: 16, border: `1px solid ${BDR}`, padding: 60,
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16,
        background: `linear-gradient(135deg, ${BLUE}18, ${PURP}10)`,
        border: `1px solid ${BLUE}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Camera size={26} style={{ color: BLUE }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: T1, marginBottom: 8 }}>No baseline snapshot yet</div>
        <div style={{ fontSize: 12, color: T3, maxWidth: 340, lineHeight: 1.7 }}>
          Set a baseline OIS snapshot to generate the Customer Zero Report™. This locks your Day 0 score and starts the COIG measurement clock.
        </div>
      </div>
      <button onClick={() => snapshotMut.mutate()} disabled={snapshotMut.isPending}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700,
          padding: '12px 28px', borderRadius: 10,
          background: BLUE, color: '#fff', border: 'none',
          cursor: 'pointer', opacity: snapshotMut.isPending ? 0.6 : 1,
          boxShadow: `0 4px 24px ${BLUE}40`,
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
  const warningCount  = pillars.filter(p => p.score >= 50 && p.score < 75).length
  const criticalCount = pillars.filter(p => p.score < 50).length
  const coigMax       = Math.max(data.coigPotential, 10)
  const grade         = gradeFromScore(data.oisAfter)
  const gradeColor    = grade === 'A' || grade === 'B' ? GREEN : grade === 'C' ? GOLD : RED

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: SURF1,
        border: `1px solid ${BDR}`,
        borderRadius: 12,
        padding: '20px 24px',
      }}>
        {/* Top row: eyebrow + export */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: BLUE + '12', border: `1px solid ${BLUE}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Award size={18} style={{ color: BLUE }} />
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 2 }}>
                Customer Zero Report™
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: T1, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {data.organization}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: T3, marginBottom: 1 }}>{data.platform}</div>
              <div style={{ fontSize: 9, color: T4 }}>{periodStr}</div>
            </div>
            <button onClick={() => window.print()} style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600,
              color: T3, background: SURF2,
              border: `1px solid ${BDR}`, borderRadius: 8,
              padding: '6px 12px', cursor: 'pointer',
            }}>
              <Download size={11} /> Export
            </button>
          </div>
        </div>

        {/* Stat chips row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <StatChip label="OIS Score" value={data.oisAfter.toFixed(1)} color={BLUE} />
          <StatChip label="Grade"     value={`Grade ${grade}`}          color={gradeColor} />
          <StatChip label="COIG Gain" value={`+${data.coig.toFixed(1)}`} color={GREEN} />
          <StatChip label="EMI Level" value={`EMI™ ${data.maturityAfter}`} color={maturityColor} />

          <div style={{ flex: 1 }} />

          {/* Production mode status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 10,
            background: modeColor + '0e', border: `1px solid ${modeColor}30`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: modeColor,
              boxShadow: isProduction ? `0 0 0 3px ${GREEN}22` : 'none',
            }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: modeColor }}>
              {isProduction ? 'PRODUCTION LIVE' : 'STAGING MODE'}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          INTELLIGENCE TRIPTYCH
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr 272px',
        gap: 12,
      }}>

        {/* OIS Score card */}
        <div style={{
          background: SURF1,
          border: `1px solid ${BDR}`,
          borderRadius: 12,
          padding: '20px 20px 18px',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {/* label */}
          <div style={{ fontSize: 9, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 2 }}>
            Operational Intelligence Score
          </div>
          <div style={{ fontSize: 11, color: T3 }}>OIS™ — 9-pillar composite</div>

          <OISScoreDisplay score={data.oisAfter} before={data.oisBefore} />

          {/* Pillar health */}
          {pillars.length > 0 && (
            <div style={{ borderTop: `1px solid ${BDR}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pillar Health
              </div>
              <div style={{ display: 'flex', height: 7, borderRadius: 4, overflow: 'hidden', gap: 1 }}>
                {healthyCount  > 0 && <div style={{ flex: healthyCount,  background: GREEN }} />}
                {warningCount  > 0 && <div style={{ flex: warningCount,  background: GOLD  }} />}
                {criticalCount > 0 && <div style={{ flex: criticalCount, background: RED   }} />}
              </div>
              <div style={{ display: 'flex' }}>
                {[
                  { label: 'Good',   count: healthyCount,  color: GREEN },
                  { label: 'Warn',   count: warningCount,  color: GOLD  },
                  { label: 'Crit',   count: criticalCount, color: RED   },
                ].map(z => (
                  <div key={z.label} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: z.count > 0 ? z.color : T4, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                      {z.count}
                    </div>
                    <div style={{ fontSize: 8, color: T4, marginTop: 2 }}>{z.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to="/kangqore-view/admin/kangqore-immp/operational-intel" style={{
            display: 'flex', alignItems: 'center', gap: 3, marginTop: 14,
            fontSize: 10, fontWeight: 600, color: BLUE, textDecoration: 'none',
          }}>
            Full OIS Breakdown <ChevronRight size={10} />
          </Link>
        </div>

        {/* COIG Intelligence Gain */}
        <div style={{
          background: SURF1, border: `1px solid ${BDR}`,
          borderRadius: 14, padding: '22px 24px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <SectionLabel color={GOLD} icon={TrendingUp}>COIG™ — Operational Intelligence Gain</SectionLabel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <CoigBar label="Measured" value={data.coig}          note="current gain"       color={BLUE}  max={coigMax} />
            <CoigBar label="Forecast" value={data.coigExpected}  note="90-day projection"  color={GOLD}  max={coigMax} />
            <CoigBar label="Potential" value={data.coigPotential} note="all recs applied"  color={PURP}  max={coigMax} />
          </div>

          <div style={{ paddingTop: 14, borderTop: `1px solid ${BDR}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                { label: 'Hours Saved',   value: data.hoursSaved > 0 ? `${data.hoursSaved}h` : '—',                     color: GREEN },
                { label: 'Workflows',     value: data.workflowsCompleted > 0 ? data.workflowsCompleted : '—',           color: BLUE  },
                { label: 'Automation',    value: data.automationCoverage > 0 ? `${data.automationCoverage}%` : '—',     color: PURP  },
                { label: 'Tasks Elim.',   value: data.manualEliminated > 0 ? data.manualEliminated : '—',               color: GOLD  },
              ].map(m => (
                <div key={m.label} style={{
                  padding: '12px 10px', background: SURF2,
                  border: `1px solid ${m.value === '—' ? BDR_S : m.color + '22'}`,
                  borderRadius: 9, textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: 20, fontWeight: 900,
                    color: m.value === '—' ? T4 : m.color,
                    fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                  }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 9, color: T4, marginTop: 5, fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Production Command */}
        <div style={{
          background: SURF1,
          border: `1px solid ${BDR}`,
          borderRadius: 12, padding: '20px 20px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionLabel color={modeColor} icon={isProduction ? CheckCircle2 : AlertTriangle}>
              {isProduction ? 'Live Production' : 'Staging Mode'}
            </SectionLabel>
          </div>

          {/* Status display */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            padding: '20px 16px',
            background: SURF2,
            border: `1px solid ${isProduction ? GREEN + '30' : BDR_S}`,
            borderRadius: 10,
          }}>
            {/* Status icon */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: isProduction ? `${GREEN}14` : `${GOLD}10`,
              border: `2px solid ${isProduction ? GREEN + '40' : GOLD + '30'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isProduction ? `0 0 20px ${GREEN}25` : 'none',
            }}>
              {isProduction
                ? <Play size={22} style={{ color: GREEN, marginLeft: 2 }} />
                : <Pause size={22} style={{ color: GOLD } } />
              }
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: modeColor, marginBottom: 4 }}>
                {togglePending ? 'Switching…'
                  : isProduction ? 'Currently LIVE'
                  : blueprintDisplay ? 'Ready to go live'
                  : 'No Blueprint yet'}
              </div>
              <div style={{ fontSize: 10, color: T4, lineHeight: 1.55, maxWidth: 200 }}>
                {isProduction
                  ? 'Real clients can connect. Click below to return to staging.'
                  : blueprintDisplay
                    ? 'Internal only. Click Go Live to open to real clients.'
                    : 'Click to generate Blueprint from live DB and go live.'}
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleProductionToggle}
              disabled={togglePending}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 9, border: 'none', cursor: togglePending ? 'not-allowed' : 'pointer',
                fontSize: 12, fontWeight: 800,
                background: isProduction ? `${RED}18` : `${GREEN}18`,
                color: isProduction ? RED : GREEN,
                border: `1px solid ${isProduction ? RED + '30' : GREEN + '35'}`,
                opacity: togglePending ? 0.55 : 1,
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {togglePending ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {togglePending ? 'Switching…' : isProduction ? 'Move to Staging' : 'Go Live →'}
            </button>

            {/* Confirm off */}
            {confirmOff && (
              <div style={{
                width: '100%', display: 'flex', gap: 6,
                padding: '8px 10px', borderRadius: 7,
                background: RED + '0e', border: `1px solid ${RED}25`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: RED, fontWeight: 700, marginBottom: 2 }}>Confirm move to staging?</div>
                  <div style={{ fontSize: 9, color: T4 }}>Real clients will lose access.</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button onClick={() => archiveMut.mutate(blueprintDisplay!.id)} style={{
                    fontSize: 9, fontWeight: 700, color: '#fff', background: RED, border: 'none',
                    borderRadius: 4, padding: '4px 9px', cursor: 'pointer',
                  }}>Yes</button>
                  <button onClick={() => setConfirmOff(false)} style={{
                    fontSize: 9, color: T4, background: 'transparent', border: `1px solid ${BDR}`,
                    borderRadius: 4, padding: '4px 9px', cursor: 'pointer',
                  }}>No</button>
                </div>
              </div>
            )}
          </div>

          {/* Blueprint */}
          {blueprintDisplay && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', background: SURF2, borderRadius: 8,
              border: `1px solid ${INDIGO}22`,
            }}>
              <FileJson size={13} style={{ color: INDIGO, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: INDIGO, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {blueprintDisplay.name}
                </div>
                <div style={{ fontSize: 9, color: T4 }}>v{blueprintDisplay.version} · {blueprintDisplay.pack ?? 'professional-services'}</div>
              </div>
              <span style={{
                fontSize: 8, fontWeight: 800, color: modeColor,
                background: modeColor + '18', border: `1px solid ${modeColor}30`,
                padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
              }}>
                {blueprintDisplay.status}
              </span>
              <Link to="/kangqore-view/admin/kangqore-immp/blueprint" style={{ fontSize: 9, color: INDIGO, textDecoration: 'none', flexShrink: 0 }}>
                View →
              </Link>
            </div>
          )}

          {/* Snapshot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={() => { setSnapMsg(null); snapshotMut.mutate() }}
              disabled={snapshotMut.isPending}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontSize: 11, fontWeight: 700, padding: '9px 14px', borderRadius: 8,
                background: `${BLUE}14`, color: BLUE, border: `1px solid ${BLUE}28`,
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
              fontSize: 10, color: GOLD, lineHeight: 1.55,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <SectionLabel color={BLUE} icon={Activity}>OIS™ — 9 Intelligence Pillars</SectionLabel>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
              padding: '4px 14px', borderRadius: 20,
              background: `${BLUE}10`, border: `1px solid ${BLUE}22`,
            }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: BLUE, fontVariantNumeric: 'tabular-nums' }}>
                {data.oisAfter.toFixed(1)}
              </span>
              <div style={{ width: 1, height: 12, background: BDR }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: gradeColor }}>Grade {grade}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px 18px' }}>
            {pillars.map((p, i) => <PillarRow key={p.id} id={p.id} label={p.label} score={p.score} index={i} />)}
          </div>

          <div style={{ display: 'flex', gap: 18, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BDR}`, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'Healthy (75–100)', color: GREEN, count: healthyCount },
              { label: 'Warning (50–74)',  color: GOLD,  count: warningCount },
              { label: 'Critical (< 50)', color: RED,   count: criticalCount },
            ].map(z => (
              <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: z.color }} />
                <span style={{ fontSize: 9, color: T4 }}>{z.label}</span>
                <span style={{ fontSize: 9, fontWeight: 800, color: z.count > 0 ? z.color : T4 }}>{z.count}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto' }}>
              <Link to="/kangqore-view/admin/kangqore-immp/operational-intel" style={{
                fontSize: 9, color: BLUE, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3,
              }}>
                Full OIS Dashboard <ChevronRight size={9} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PULSE + ACTIVITY
      ════════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* WAANDA Pulse */}
        {pulse?.summary ? (() => {
          const hc = pulse.health === 'healthy' ? GREEN : pulse.health === 'warning' ? GOLD : RED
          return (
            <div style={{
              background: SURF1, border: `1px solid ${hc}22`,
              borderRadius: 12, padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SectionLabel color={PURP} icon={Brain}>WAANDA Enterprise Pulse</SectionLabel>
                <span style={{
                  fontSize: 9, fontWeight: 800, color: hc,
                  background: hc + '18', border: `1px solid ${hc}30`,
                  padding: '3px 9px', borderRadius: 5, textTransform: 'uppercase', flexShrink: 0,
                }}>
                  {pulse.health}
                </span>
              </div>

              <p style={{ fontSize: 12, color: T2, lineHeight: 1.75, margin: 0 }}>{pulse.summary}</p>

              {pulse.drivers.length > 0 && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {pulse.drivers.map((d, i) => {
                    const dc = d.signal === 'positive' ? GREEN : d.signal === 'negative' ? RED : T3
                    return (
                      <span key={i} style={{
                        fontSize: 9, color: dc, background: dc + '10',
                        border: `1px solid ${dc}22`, borderRadius: 5,
                        padding: '3px 9px', fontWeight: 600,
                      }}>
                        {d.metric}: {d.value}
                      </span>
                    )
                  })}
                  {pulse.recommendedAction && (
                    <span style={{
                      fontSize: 9, color: GOLD, background: GOLD + '10',
                      border: `1px solid ${GOLD}22`, borderRadius: 5, padding: '3px 9px', fontWeight: 600,
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
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px 0' }}>
              <span style={{ fontSize: 11, color: T4 }}>Pulse generates after the first active session.</span>
            </div>
          </div>
        )}

        {/* Adoption Signal */}
        {activity ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionLabel color={GREEN} icon={Zap}>Adoption Signal · Live</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <ActivityCard icon={Cpu}         color={BLUE}  label="Missions (24h)"   value={activity.missionsLast24h}    window="24h" trend={activity.missionsTrend} />
              <ActivityCard icon={Brain}        color={PURP}  label="Decisions (7d)"  value={activity.decisionsLast7d}    window="7d"  trend={activity.decisionsTrend} />
              <ActivityCard icon={Timer}        color={GREEN} label="Hours Captured"  value={activity.estimatedTimeSaved} unit="h" />
              <ActivityCard icon={Lightbulb}    color={GOLD}  label="Evidence"        value={activity.evidenceCaptured}   trend={activity.evidenceTrend} />
              <ActivityCard icon={FlaskConical} color={BLUE}  label="Simulations"     value={activity.simulationRuns}     trend={activity.simulationsTrend} />
              <ActivityCard icon={Wand2}        color={PURP}  label="WAANDA Sessions" value={activity.waandaSessions} />
            </div>

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
                  padding: '10px 14px',
                  background: col + '0e', border: `1px solid ${col}22`, borderRadius: 8,
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <AlertTriangle size={11} style={{ color: col, flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 11, color: T3, lineHeight: 1.6 }}>{prompt}</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

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
                    padding: '12px 14px', background: SURF2,
                    border: `1px solid ${pct >= 75 ? GREEN + '20' : BDR_S}`, borderRadius: 9,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          background: col + '18', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 9, fontWeight: 900, color: col,
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: T2 }}>{g.label}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ height: 7, background: 'rgba(0,0,0,0.07)', borderRadius: 3.5, overflow: 'hidden', marginBottom: 6 }}>
                      <div style={{
                        width: `${pct}%`, height: '100%', background: col,
                        borderRadius: 3.5, transition: 'width 1s ease',
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
                  padding: '10px 12px', background: SURF2, border: `1px solid ${BDR_S}`, borderRadius: 8,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: PURP + '18', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 9, fontWeight: 800, color: PURP,
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
                padding: '6px 14px', borderRadius: 7, background: PURP + '12', border: `1px solid ${PURP}30`,
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
                  border: `1px solid ${i === 0 ? GREEN + '30' : BDR_S}`,
                  borderRadius: 9,
                  boxShadow: i === 0 ? `0 0 14px ${GREEN}08` : 'none',
                }}>
                  <div style={{
                    flexShrink: 0, width: 24, height: 24, borderRadius: 7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 900, color: '#fff',
                    background: i === 0 ? GREEN : i === 1 ? BLUE : T4,
                  }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: T2, lineHeight: 1.6, margin: '0 0 7px' }}>{r.action}</p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 9, color: GREEN, fontWeight: 800,
                      background: GREEN + '12', padding: '3px 8px', borderRadius: 5,
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
        <div style={{ marginBottom: 14 }}>
          <SectionLabel color={BLUE} icon={Layers}>COIG™ Milestone Timeline</SectionLabel>
        </div>

        {snapshots.length > 1 && (
          <TimelineSparkline snapshots={snapshots} base={BASE_SCORE} />
        )}

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
                      width: 20, height: 20, borderRadius: '50%', zIndex: 1, flexShrink: 0,
                      background: isLatest ? col : isBase ? BLUE + '55' : SURF3,
                      border: `2px solid ${isLatest ? col : isBase ? BLUE : BDR}`,
                      boxShadow: isLatest ? `0 0 0 5px ${col}18, 0 0 12px ${col}50` : 'none',
                    }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: isLatest ? col : isBase ? BLUE : T3, fontVariantNumeric: 'tabular-nums' }}>
                        {snap.oisScore.toFixed(1)}
                      </div>
                      {!isBase && delta !== 0 && (
                        <div style={{ fontSize: 9, fontWeight: 800, color: delta >= 0 ? GREEN : RED }}>
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
              { label: 'Day 0',  sub: 'Baseline',      score: BASE_SCORE.toFixed(1),                col: BLUE,  active: true  },
              { label: 'Week 1', sub: 'Go-live',        score: '—',                                  col: T4,    active: false },
              { label: 'Week 4', sub: '+5 target',      score: (BASE_SCORE + 5).toFixed(1) + '+',    col: GREEN, active: false },
              { label: 'Day 90', sub: '+6.1 target',    score: (BASE_SCORE + 6.1).toFixed(1) + '+',  col: GREEN, active: false },
            ].map((m, i, arr) => (
              <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{ position: 'absolute', top: 9, left: '50%', width: '100%', height: 1, background: BDR }} />
                )}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', zIndex: 1,
                  background: m.active ? BLUE : SURF3, border: `2px solid ${m.active ? BLUE : BDR}`,
                  boxShadow: m.active ? `0 0 0 5px ${BLUE}18` : 'none',
                }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.score}</div>
                  <div style={{ fontSize: 8, color: T4, marginTop: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 8, color: T4 }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, fontSize: 9, color: T4, flexWrap: 'wrap' }}>
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
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <ShieldCheck size={12} style={{ color: T4 }} />
        <span style={{ fontSize: 9, color: T4 }}>
          Verified by <strong style={{ color: T3 }}>{data.verifiedBy}</strong>
        </span>
        <div style={{ flex: 1 }} />
        <Link to="/kangqore-view/admin/kangqore-immp/customer-zero-case-study" style={{
          fontSize: 9, color: BLUE, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3,
        }}>
          View Case Study <ChevronRight size={9} />
        </Link>
        <Clock size={11} style={{ color: T4 }} />
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
