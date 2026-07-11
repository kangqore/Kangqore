import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@lib/api'
import {
  Award, TrendingUp, Zap, Target, CheckCircle2,
  Clock, BarChart3, FileText, Download, Layers,
  Activity, Cpu, Brain, BarChart2, Wand2, FlaskConical,
  Lightbulb, Timer, ArrowUp, ArrowDown, Minus,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface GoalProgress {
  label:  string
  target: number
  unit:   string
}

interface TopRec {
  action:    string
  oisImpact: number
}

interface CustomerZeroReport {
  organization:       string
  platform:           string
  periodStart:        string | null
  periodEnd:          string
  maturityBefore:     string | null
  maturityAfter:      string
  oisBefore:          number | null
  oisAfter:           number
  coig:               number
  coigExpected:       number
  coigPotential:      number
  hoursSaved:         number
  automationCoverage: number
  workflowsCompleted: number
  manualEliminated:   number
  goalProgress:       GoalProgress[]
  topRecommendations: TopRec[]
  verifiedBy:         string
  generatedAt:        string
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Trend { delta: number; direction: 'up' | 'down' | 'flat' }

interface PlatformActivity {
  // Adoption funnel (velocity-first)
  missionsLast24h:    number
  missionsTrend:      Trend
  decisionsLast7d:    number
  decisionsTrend:     Trend
  estimatedTimeSaved: number
  evidenceCaptured:   number
  evidenceTrend:      Trend
  simulationRuns:     number
  simulationsTrend:   Trend
  waandaSessions:     number
  // Supporting totals
  projectsCreated:    number
  tasksCompleted:     number
  missionsExecuted:   number
  executiveDecisions: number
  commandsExecuted:   number
  optimizationRuns:   number
  automationSuccess:  number
}

interface PulseDriver {
  metric:  string
  value:   string | number
  signal:  'positive' | 'negative' | 'neutral'
}

interface OperatingPulse {
  summary:           string
  health:            'healthy' | 'warning' | 'critical'
  confidence:        number
  generatedAt:       string
  drivers:           PulseDriver[]
  recommendedAction: string | null
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BG      = 'var(--os-bg)'
const SURFACE = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const BLUE    = '#2564ea'
const GREEN   = '#00c875'
const GOLD    = '#eab308'
const PURPLE  = '#a855f7'

const EMI_COLOR: Record<string, string> = {
  L1: '#e2445c', L2: '#fdab3d', L3: '#579bfc', L4: PURPLE, L5: GREEN,
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <Icon size={15} style={{ color }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
    </div>
  )
}

function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <span style={{ fontSize: 10, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
        {label}
      </span>
      <span style={{ fontSize: 24, fontWeight: 800, color: color ?? TEXT1, lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 10, color: TEXT2 }}>{sub}</span>}
    </div>
  )
}

function ActivityCard({
  icon: Icon, label, value, unit, color, window: win, rank, trend,
}: {
  icon: any; label: string; value: number; unit?: string; color: string
  window?: string; rank?: number
  trend?: { delta: number; direction: 'up' | 'down' | 'flat' }
}) {
  const dead = value === 0
  const borderColor = dead ? BORDER : `${color}44`

  const TrendIcon = trend?.direction === 'up' ? ArrowUp : trend?.direction === 'down' ? ArrowDown : Minus
  const trendColor = trend?.direction === 'up' ? GREEN : trend?.direction === 'down' ? '#ef4444' : TEXT2
  const trendLabel = trend && trend.delta !== 0
    ? `${trend.delta > 0 ? '+' : ''}${trend.delta}`
    : '—'

  return (
    <div style={{
      background: SURFACE, border: `1px solid ${borderColor}`, borderRadius: 10,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', overflow: 'hidden',
    }}>
      {rank && (
        <span style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: 9, fontWeight: 700, color: TEXT2, opacity: 0.4,
        }}>
          #{rank}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} style={{ color: dead ? TEXT2 : color }} />
        {win && (
          <span style={{
            fontSize: 9, color: TEXT2, background: dead ? BORDER : `${color}18`,
            padding: '1px 6px', borderRadius: 6, fontWeight: 600,
          }}>
            {win}
          </span>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: dead ? TEXT2 : color, lineHeight: 1, opacity: dead ? 0.4 : 1 }}>
            {value.toLocaleString()}
            {unit && <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 2 }}>{unit}</span>}
          </span>
          {trend && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendIcon size={10} style={{ color: trendColor }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: trendColor }}>{trendLabel}</span>
            </span>
          )}
        </div>
        <div style={{ fontSize: 10, color: TEXT2, marginTop: 4, fontWeight: 500, lineHeight: 1.3 }}>{label}</div>
      </div>
    </div>
  )
}

function OISArc({ before, after }: { before: number | null; after: number }) {
  const r    = 52
  const circ = 2 * Math.PI * r
  const pct  = (v: number) => (v / 100) * circ * 0.75
  const off  = circ * 0.125

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width="136" height="106" viewBox="0 0 136 106">
        {/* track */}
        <circle cx="68" cy="78" r={r} fill="none" stroke={BORDER} strokeWidth="9"
          strokeDasharray={`${circ * 0.75} ${circ}`} strokeDashoffset={-off}
          strokeLinecap="round" transform="rotate(-90 68 78)" />
        {/* before (faded) */}
        {before !== null && (
          <circle cx="68" cy="78" r={r} fill="none" stroke={`${BLUE}44`} strokeWidth="9"
            strokeDasharray={`${pct(before)} ${circ}`} strokeDashoffset={-off}
            strokeLinecap="round" transform="rotate(-90 68 78)" />
        )}
        {/* after */}
        <circle cx="68" cy="78" r={r} fill="none" stroke={BLUE} strokeWidth="9"
          strokeDasharray={`${pct(after)} ${circ}`} strokeDashoffset={-off}
          strokeLinecap="round" transform="rotate(-90 68 78)"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x="68" y="74" textAnchor="middle" fill={TEXT1} fontSize="24" fontWeight="800">{after}</text>
        <text x="68" y="90" textAnchor="middle" fill={TEXT2} fontSize="9">OIS™ Score</text>
      </svg>
      {before !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: TEXT2 }}>
            Before <span style={{ color: `${BLUE}88`, fontWeight: 700 }}>{before}</span>
          </span>
          <span style={{ fontSize: 10, color: TEXT2 }}>→</span>
          <span style={{ fontSize: 10, color: BLUE, fontWeight: 700 }}>After {after}</span>
          {after > before && (
            <span style={{
              fontSize: 9, background: `${GREEN}22`, color: GREEN,
              padding: '1px 6px', borderRadius: 8, fontWeight: 700,
            }}>
              +{(after - before).toFixed(1)} pts
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function COIGBar({ current, expected, potential }: { current: number; expected: number; potential: number }) {
  const max = Math.max(potential, 20)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[
        { label: 'Current COIG',   value: current,  color: BLUE,   note: 'Measured gain' },
        { label: 'Expected COIG',  value: expected,  color: GOLD,   note: 'Gate 8.1 forecast' },
        { label: 'Potential COIG', value: potential, color: PURPLE, note: 'If all recs executed' },
      ].map(row => (
        <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: TEXT2 }}>{row.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: row.color }}>+{row.value.toFixed(1)}</span>
              <span style={{ fontSize: 9, color: TEXT2 }}>{row.note}</span>
            </div>
          </div>
          <div style={{ height: 6, background: BORDER, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min((row.value / max) * 100, 100)}%`,
              height: '100%', background: row.color, borderRadius: 4,
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
      ))}
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
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const { data: pulse } = useQuery<OperatingPulse>({
    queryKey: ['customer-zero-pulse'],
    queryFn:  () => adminApi('/admin/enterprise/customer-zero/pulse'),
    staleTime: 55 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 10, color: TEXT2 }}>
        <BarChart3 size={16} style={{ animation: 'spin 1s linear infinite' }} />
        Generating Customer Zero Report™…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: TEXT2 }}>
        <FileText size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
        <p style={{ fontSize: 13 }}>Report unavailable — set a BASELINE snapshot first.</p>
        <p style={{ fontSize: 11, marginTop: 6 }}>
          Go to Gate 8 → OIS and click "Set Baseline Now".
        </p>
      </div>
    )
  }

  const period = data.periodStart
    ? `${new Date(data.periodStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — ${new Date(data.periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : `As of ${new Date(data.periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`

  const maturityColor = EMI_COLOR[data.maturityAfter] ?? BLUE
  const coigGain      = data.coig

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>

      {/* ── Header ── */}
      <div style={{
        background: `linear-gradient(135deg, ${BLUE}18, ${PURPLE}10)`,
        border: `1px solid ${BLUE}33`, borderRadius: 14, padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Award size={18} style={{ color: GOLD }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Customer Zero Report™
              </span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT1, margin: 0, lineHeight: 1.2 }}>
              {data.organization}
            </h1>
            <p style={{ fontSize: 12, color: TEXT2, marginTop: 4 }}>{data.platform}</p>
            <p style={{ fontSize: 11, color: TEXT2, marginTop: 8 }}>{period}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{
              background: `${maturityColor}22`, border: `1px solid ${maturityColor}44`,
              borderRadius: 8, padding: '6px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: maturityColor }}>{data.maturityAfter}</div>
              <div style={{ fontSize: 9, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>EMI™ Level</div>
            </div>
            {data.maturityBefore && data.maturityBefore !== data.maturityAfter && (
              <span style={{ fontSize: 10, color: TEXT2 }}>
                From {data.maturityBefore} → <span style={{ color: maturityColor, fontWeight: 700 }}>{data.maturityAfter}</span>
              </span>
            )}
          </div>
        </div>

        {/* COIG highlight */}
        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <TrendingUp size={14} style={{ color: GREEN }} />
          <span style={{ fontSize: 13, color: TEXT1 }}>
            <span style={{ fontWeight: 800, color: GREEN, fontSize: 18 }}>+{coigGain.toFixed(1)}</span>
            {' '}OIS points gained since baseline
          </span>
          <span style={{
            marginLeft: 'auto', fontSize: 10, background: `${GREEN}18`,
            color: GREEN, padding: '3px 10px', borderRadius: 10, fontWeight: 700,
            border: `1px solid ${GREEN}44`,
          }}>
            COIG™ Verified
          </span>
        </div>
      </div>

      {/* ── Enterprise Operating Pulse ── */}
      {pulse?.summary && (() => {
        const HEALTH_COLOR = pulse.health === 'healthy' ? GREEN : pulse.health === 'warning' ? GOLD : '#ef4444'
        const HEALTH_BG    = pulse.health === 'healthy' ? `${GREEN}10` : pulse.health === 'warning' ? `${GOLD}10` : '#ef444410'
        return (
          <div style={{
            background: HEALTH_BG, border: `1px solid ${HEALTH_COLOR}2a`, borderRadius: 10,
            padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Brain size={14} style={{ color: PURPLE, flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    WAANDA Enterprise Pulse
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: HEALTH_COLOR,
                    background: `${HEALTH_COLOR}18`, border: `1px solid ${HEALTH_COLOR}44`,
                    padding: '1px 7px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {pulse.health}
                  </span>
                  <span style={{ fontSize: 9, color: TEXT2 }}>
                    {Math.round(pulse.confidence * 100)}% confidence
                  </span>
                </div>
                <p style={{ fontSize: 12, color: TEXT1, lineHeight: 1.6, margin: 0 }}>{pulse.summary}</p>
              </div>
              <span style={{ fontSize: 9, color: TEXT2, flexShrink: 0, whiteSpace: 'nowrap' }}>
                {new Date(pulse.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Evidence drivers */}
            {pulse.drivers.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingLeft: 26 }}>
                {pulse.drivers.map((d, i) => {
                  const dc = d.signal === 'positive' ? GREEN : d.signal === 'negative' ? '#ef4444' : TEXT2
                  return (
                    <span key={i} style={{
                      fontSize: 9, color: dc, background: `${dc}12`,
                      border: `1px solid ${dc}33`, borderRadius: 5,
                      padding: '1px 7px', fontWeight: 600,
                    }}>
                      {d.metric}: {d.value}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Recommended action */}
            {pulse.recommendedAction && (
              <div style={{
                paddingLeft: 26, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Zap size={10} style={{ color: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: TEXT2 }}>{pulse.recommendedAction}</span>
              </div>
            )}
          </div>
        )
      })()}

      {/* ── OIS Arc + COIG Triple ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* OIS before/after arc */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px' }}>
          <SectionTitle icon={BarChart3} label="Operational Intelligence Score" color={BLUE} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <OISArc before={data.oisBefore} after={data.oisAfter} />
          </div>
        </div>

        {/* COIG triple */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px' }}>
          <SectionTitle icon={TrendingUp} label="COIG™ — Customer Operational Intelligence Gain" color={GOLD} />
          <COIGBar current={data.coig} expected={data.coigExpected} potential={data.coigPotential} />
          <p style={{ fontSize: 10, color: TEXT2, marginTop: 16, lineHeight: 1.6 }}>
            Potential COIG of <strong style={{ color: PURPLE }}>+{data.coigPotential.toFixed(1)}</strong> is achievable
            if all active recommendations are executed.
          </p>
        </div>
      </div>

      {/* ── Operational metrics ── */}
      <div>
        <SectionTitle icon={Zap} label="Operational Outcomes" color={BLUE} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <MetricCard
            label="Hours Saved"
            value={data.hoursSaved > 0 ? `${data.hoursSaved}h` : '—'}
            sub="Automation + workflow elimination"
            color={GREEN}
          />
          <MetricCard
            label="Automation Coverage"
            value={data.automationCoverage > 0 ? `${data.automationCoverage}%` : '—'}
            sub="Of eligible workflows"
            color={BLUE}
          />
          <MetricCard
            label="Workflows Completed"
            value={data.workflowsCompleted}
            sub="WAOE-executed since go-live"
            color={PURPLE}
          />
          <MetricCard
            label="Manual Tasks Eliminated"
            value={data.manualEliminated > 0 ? data.manualEliminated : '—'}
            sub="Replaced by autonomous agents"
            color={GOLD}
          />
        </div>
      </div>

      {/* ── Adoption Funnel ── */}
      {activity && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Activity size={15} style={{ color: GREEN }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Adoption Signal
            </span>
            <span style={{
              fontSize: 9, background: `${GREEN}18`, color: GREEN, padding: '2px 8px',
              borderRadius: 10, fontWeight: 700, border: `1px solid ${GREEN}33`,
            }}>
              LIVE
            </span>
          </div>
          <p style={{ fontSize: 11, color: TEXT2, marginBottom: 16, marginTop: 2 }}>
            These six numbers tell you whether the OS is alive. COIG follows when they are consistently non-zero.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            <ActivityCard
              rank={1} icon={Cpu}          color={BLUE}
              label="Daily Active Missions"      value={activity.missionsLast24h}    window="last 24h"
              trend={activity.missionsTrend}
            />
            <ActivityCard
              rank={2} icon={Brain}        color={PURPLE}
              label="Weekly Executive Decisions" value={activity.decisionsLast7d}    window="last 7d"
              trend={activity.decisionsTrend}
            />
            <ActivityCard
              rank={3} icon={Timer}        color={GREEN}
              label="Hours Captured"             value={activity.estimatedTimeSaved}  unit="h"
            />
            <ActivityCard
              rank={4} icon={Lightbulb}    color={GOLD}
              label="Evidence Generated"         value={activity.evidenceCaptured}
              trend={activity.evidenceTrend}
            />
            <ActivityCard
              rank={5} icon={FlaskConical}  color={BLUE}
              label="Simulation Runs"            value={activity.simulationRuns}
              trend={activity.simulationsTrend}
            />
            <ActivityCard
              rank={6} icon={Wand2}        color={PURPLE}
              label="WAANDA Usage"               value={activity.waandaSessions}
            />
          </div>

          {/* Context-sensitive zero-state prompt */}
          {(() => {
            const m  = activity.missionsLast24h
            const d  = activity.decisionsLast7d
            const e  = activity.evidenceCaptured
            const s  = activity.simulationRuns
            const w  = activity.waandaSessions
            const mDown = activity.missionsTrend?.direction === 'down'
            const dDown = activity.decisionsTrend?.direction === 'down'

            let prompt: string | null = null
            let color = GOLD

            if (m === 0 && d === 0 && e === 0 && s === 0 && w === 0) {
              prompt = 'Platform not yet operationally active. Create a project, then open Mission Control and run a KIMMP briefing to start the adoption clock.'
              color  = GOLD
            } else if (m === 0 && d > 0) {
              prompt = 'Decisions exist but no missions in the last 24 hours. Return to Mission Control and trigger a fresh KIMMP briefing to keep the signal alive.'
              color  = GOLD
            } else if (m > 0 && d === 0) {
              prompt = `${m} mission${m > 1 ? 's' : ''} running, but no executive decisions made this week. Open a KIMMP briefing, review the recommendations, and log a decision to close the loop.`
              color  = '#f97316'
            } else if (m > 0 && d > 0 && e === 0) {
              prompt = 'Missions and decisions are active, but no evidence has been captured. Ask KIMMP to document its reasoning — every captured datapoint strengthens the training corpus.'
              color  = BLUE
            } else if (mDown && dDown) {
              prompt = 'Both mission frequency and executive decisions are declining. Schedule a daily KIMMP briefing to prevent adoption stall before COIG momentum is lost.'
              color  = '#ef4444'
            } else if (mDown && !dDown) {
              prompt = 'Mission frequency is declining. Run a KIMMP briefing today to keep the 24-hour activity window non-zero.'
              color  = GOLD
            }

            if (!prompt) return null
            return (
              <div style={{
                marginTop: 12, padding: '10px 14px',
                background: `${color}0F`, border: `1px solid ${color}33`, borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <BarChart2 size={13} style={{ color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: TEXT2 }}>{prompt}</span>
              </div>
            )
          })()}
        </div>
      )}

      {/* ── Goal progress + Top recs side by side ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Enterprise Goals */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px' }}>
          <SectionTitle icon={Target} label="Enterprise Goals" color={PURPLE} />
          {data.goalProgress.length === 0 ? (
            <p style={{ fontSize: 12, color: TEXT2 }}>No goals defined — visit Enterprise tab to set them.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.goalProgress.map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    background: `${PURPLE}20`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 10, fontWeight: 700, color: PURPLE,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: TEXT1 }}>{g.label}</div>
                    <div style={{ fontSize: 10, color: TEXT2 }}>
                      Target: {g.target}{g.unit && ` ${g.unit}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Recommendations */}
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px' }}>
          <SectionTitle icon={CheckCircle2} label="Top Recommendations" color={GREEN} />
          {data.topRecommendations.length === 0 ? (
            <p style={{ fontSize: 12, color: TEXT2 }}>No recommendations generated yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data.topRecommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{
                    flexShrink: 0, fontSize: 10, fontWeight: 700, color: '#fff',
                    background: GREEN, borderRadius: 4, padding: '2px 6px', lineHeight: 1.4,
                  }}>
                    #{i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: TEXT1, lineHeight: 1.5, margin: 0 }}>{r.action}</p>
                    <span style={{
                      fontSize: 9, background: `${GREEN}18`, color: GREEN,
                      padding: '1px 6px', borderRadius: 8, fontWeight: 700,
                      display: 'inline-block', marginTop: 4,
                    }}>
                      +{r.oisImpact.toFixed(1)} OIS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer / verification ── */}
      <div style={{
        background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Layers size={14} style={{ color: TEXT2, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, color: TEXT2 }}>Verified by: </span>
          <span style={{ fontSize: 10, color: TEXT1, fontWeight: 600 }}>{data.verifiedBy}</span>
        </div>
        <div style={{ display: 'flex', align: 'center', gap: 8 }}>
          <Clock size={12} style={{ color: TEXT2 }} />
          <span style={{ fontSize: 10, color: TEXT2 }}>
            Generated {new Date(data.generatedAt).toLocaleString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 10, background: `${BLUE}18`, color: BLUE,
            border: `1px solid ${BLUE}44`, borderRadius: 6,
            padding: '5px 10px', cursor: 'pointer', fontWeight: 600,
          }}
        >
          <Download size={11} /> Export
        </button>
      </div>

    </div>
  )
}
