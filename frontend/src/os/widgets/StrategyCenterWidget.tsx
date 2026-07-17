import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const PHASE_COLOR: Record<string, string> = {
  OBSERVE:    'var(--os-cyan)',
  UNDERSTAND: 'var(--os-blue)',
  DECIDE:     'var(--os-warning)',
  ACT:        'var(--os-success)',
  LEARN:      'var(--os-text-3)',
}

function OisTrend({ history, current, grade }: { history: any[]; current: number | null; grade: string | null }) {
  if (current == null) return null

  // history is newest-first; reverse for left-to-right display
  const points = [...history].reverse().slice(-6)
  const gradeColor = grade === 'A' || grade === 'B' ? 'var(--os-success)'
    : grade === 'C' ? 'var(--os-warning)' : 'var(--os-danger)'

  // Trend direction: compare current to oldest point in window
  const oldest = points[0]?.oisScore
  const delta = oldest != null ? Math.round((current - oldest) * 10) / 10 : null

  return (
    <div style={{
      padding: '9px 12px', borderRadius: 6,
      background: gradeColor + '10', border: `1px solid ${gradeColor}33`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: gradeColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {current.toFixed(1)}
            </span>
            {grade && (
              <span style={{ fontSize: 13, fontWeight: 700, color: gradeColor }}>Grade {grade}</span>
            )}
          </div>
          <div style={{ fontSize: 9, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
            OIS · Operational Intelligence Score
          </div>
        </div>
        {delta != null && (
          <div style={{
            fontSize: 11, fontWeight: 700, flexShrink: 0,
            color: delta >= 0 ? 'var(--os-success)' : 'var(--os-danger)',
          }}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} {points.length > 1 ? `(${points.length} snaps)` : ''}
          </div>
        )}
      </div>

      {/* Sparkline bars */}
      {points.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginTop: 8, height: 20 }}>
          {points.map((p: any, i: number) => {
            const pct = Math.min(100, p.oisScore ?? 0)
            const isLast = i === points.length - 1
            const col = isLast ? gradeColor : 'var(--os-border)'
            return (
              <div key={p.id ?? i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  height: `${Math.round((pct / 100) * 20)}px`,
                  borderRadius: 2,
                  background: col,
                  transition: 'height 0.3s ease',
                }} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TopPredictions({ predictions }: { predictions: any[] }) {
  const top3 = [...predictions].sort((a, b) => b.confidence - a.confidence).slice(0, 3)
  if (top3.length === 0) return null

  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
        WAANDA · Top Predictions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {top3.map((p: any) => {
          const pct = Math.round((p.confidence ?? 0) * 100)
          const col = pct >= 80 ? 'var(--os-success)' : pct >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'
          const drifting = p.driftDetected
          return (
            <div key={p.id} style={{
              padding: '6px 9px', borderRadius: 5,
              background: drifting ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
              border: drifting ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                }}>
                  {drifting && <span style={{ color: 'var(--os-danger)', marginRight: 4 }}>⚠</span>}
                  {p.target ?? 'Prediction'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: col, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {pct}%
                </span>
              </div>
              <div style={{ height: 2, borderRadius: 1, background: 'var(--os-border)', marginTop: 4 }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: 1, background: col }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const synthesis: string | null     = viewModel.latestSynthesis ?? viewModel.kimmSynthesis ?? null
  const phase: string                = viewModel.waandaPhase     ?? 'OBSERVE'
  const briefing: any                = viewModel.latestBriefing  ?? null
  const predictions: any[]           = Array.isArray(viewModel.enterprisePredictions) ? viewModel.enterprisePredictions : []
  const oisHistory: any[]            = Array.isArray(viewModel.oisHistory) ? viewModel.oisHistory : []
  const oisScore: number | null      = viewModel.oisScore ?? null
  const grade: string | null         = viewModel.grade ?? null
  const phaseColor                   = PHASE_COLOR[phase] ?? 'var(--os-text-4)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* OIS trend hero */}
      <OisTrend history={oisHistory} current={oisScore} grade={grade} />

      {/* Cognitive phase */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5px 9px', borderRadius: 6,
        background: phaseColor + '10', border: `1px solid ${phaseColor}22`,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Cognitive Phase
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: phaseColor, letterSpacing: '0.04em' }}>{phase}</span>
      </div>

      {/* KIMMP synthesis */}
      {synthesis ? (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 11, lineHeight: 1.55,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          color: 'var(--os-text-2)',
        }}>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--os-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
            KIMMP · Strategic Synthesis
          </span>
          {synthesis.length > 200 ? synthesis.slice(0, 200) + '…' : synthesis}
        </div>
      ) : (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>Awaiting WAANDA strategic synthesis</p>
      )}

      {/* Top predictions */}
      <TopPredictions predictions={predictions} />

      {/* Briefing recommendations fallback when no predictions */}
      {predictions.length === 0 && briefing?.recommendations?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {briefing.priority} · Recommendations
          </div>
          {briefing.recommendations.slice(0, 2).map((r: string) => (
            <div key={r} style={{
              padding: '5px 9px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)33',
              color: 'var(--os-text-2)',
            }}>
              <span style={{ color: 'var(--os-blue)', marginRight: 5 }}>↗</span>{r}
            </div>
          ))}
        </div>
      )}

      {/* Latest briefing summary */}
      {briefing?.summary && (
        <div style={{
          padding: '6px 9px', borderRadius: 5, fontSize: 10, lineHeight: 1.5,
          background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)',
          color: 'var(--os-text-3)',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 2 }}>
            Latest Briefing
          </span>
          {briefing.summary.length > 160 ? briefing.summary.slice(0, 160) + '…' : briefing.summary}
        </div>
      )}
    </div>
  )
}

export const StrategyCenterWidget = withWidgetContext(Core)
