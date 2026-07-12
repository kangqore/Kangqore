import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PHASE_COLOR: Record<string, string> = {
  OBSERVE:    'var(--os-cyan)',
  UNDERSTAND: 'var(--os-blue)',
  DECIDE:     'var(--os-warning)',
  ACT:        'var(--os-success)',
  LEARN:      'var(--os-text-3)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const synthesis: string | null    = viewModel.latestSynthesis ?? viewModel.kimmSynthesis ?? null
  const phase: string               = viewModel.waandaPhase     ?? 'OBSERVE'
  const briefing: any               = viewModel.latestBriefing  ?? null
  const phaseColor                  = PHASE_COLOR[phase] ?? 'var(--os-text-4)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Cognitive phase */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px', borderRadius: 6,
        background: phaseColor + '12',
        border: `1px solid ${phaseColor}33`,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Cognitive Phase
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: phaseColor, letterSpacing: '0.04em' }}>
          {phase}
        </span>
      </div>

      {/* KIMMP synthesis */}
      {synthesis ? (
        <div style={{
          padding: '9px 11px', borderRadius: 6, fontSize: 11, lineHeight: 1.6,
          background: 'var(--os-surface-3)',
          border: '1px solid var(--os-border-subtle)',
          color: 'var(--os-text-2)',
        }}>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--os-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            KIMMP · Strategic Synthesis
          </span>
          {synthesis.length > 220 ? synthesis.slice(0, 220) + '…' : synthesis}
        </div>
      ) : (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>Awaiting WAANDA strategic synthesis</p>
      )}

      {/* Latest briefing recommendations */}
      {briefing?.recommendations?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {briefing.priority} · Recommendations
          </div>
          {briefing.recommendations.slice(0, 2).map((r: string, i: number) => (
            <div key={i} style={{
              padding: '5px 9px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-blue-dim)',
              border: '1px solid var(--os-blue)33',
              color: 'var(--os-text-2)',
            }}>
              <span style={{ color: 'var(--os-blue)', marginRight: 5 }}>↗</span>{r}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const StrategyCenterWidget = withWidgetContext(Core)
