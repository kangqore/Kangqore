import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@lib/api'
import {
  Award, TrendingUp, Zap, Target, CheckCircle2,
  Clock, BarChart3, FileText, Download, Layers,
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
