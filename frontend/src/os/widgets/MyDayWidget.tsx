import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PHASE_COLOR: Record<string, string> = {
  OBSERVE:    'var(--os-cyan)',
  UNDERSTAND: 'var(--os-blue)',
  DECIDE:     'var(--os-warning)',
  ACT:        'var(--os-success)',
  LEARN:      'var(--os-text-3)',
}

const BOOT_COLOR: Record<string, string> = {
  OPERATIONAL: 'var(--os-success)',
  DEGRADED:    'var(--os-warning)',
  OFFLINE:     'var(--os-danger)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const focusItems     = viewModel.focusItems    ?? { critical: 0, scheduled: 0, waiting: 0, blocked: 0 }
  const phase: string  = viewModel.waandaPhase   ?? 'OBSERVE'
  const boot: string   = viewModel.bootStatus    ?? 'OFFLINE'
  const confidence     = Math.round((viewModel.confidence ?? 0) * 100)
  const health         = viewModel.subsystemHealth ?? {}
  const healthPct      = health.healthPercent ?? 0

  const phaseColor = PHASE_COLOR[phase] ?? 'var(--os-text-4)'
  const bootColor  = BOOT_COLOR[boot]   ?? 'var(--os-text-4)'

  const focus = [
    { label: 'Critical',   value: focusItems.critical  ?? 0, color: 'var(--os-danger)',  warn: (focusItems.critical ?? 0) > 0 },
    { label: 'Scheduled',  value: focusItems.scheduled ?? 0, color: 'var(--os-warning)', warn: false },
    { label: 'Waiting',    value: focusItems.waiting   ?? 0, color: 'var(--os-blue)',    warn: false },
    { label: 'Blocked',    value: focusItems.blocked   ?? 0, color: 'var(--os-danger)',  warn: (focusItems.blocked ?? 0) > 0 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* System status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', borderRadius: 8,
        background: bootColor + '12', border: `1px solid ${bootColor}33`,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: bootColor,
          boxShadow: boot === 'OPERATIONAL' ? `0 0 6px ${bootColor}` : 'none',
        }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: bootColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {boot}
        </span>
        <span style={{ fontSize: 9, color: 'var(--os-text-4)', flex: 1 }}>
          {health.operational ?? 0}/{health.total ?? 0} subsystems
        </span>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
          background: phaseColor + '1a', color: phaseColor, border: `1px solid ${phaseColor}44`,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {phase}
        </span>
      </div>

      {/* Confidence track */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
          <span>WAANDA confidence</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{confidence}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{
            width: `${confidence}%`, height: '100%', borderRadius: 2,
            background: confidence >= 75 ? 'var(--os-success)' : confidence >= 50 ? 'var(--os-warning)' : 'var(--os-danger)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Focus grid */}
      <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
        {focus.map(f => (
          <div key={f.label} style={{
            flex: 1, padding: '7px 4px', borderRadius: 6, textAlign: 'center',
            background: f.warn ? f.color + '1a' : 'var(--os-surface-3)',
            border: f.warn ? `1px solid ${f.color}44` : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, color: f.warn ? f.color : 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>
              {f.value}
            </div>
            <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, lineHeight: 1.2 }}>{f.label}</div>
          </div>
        ))}
      </div>

      {/* Platform health bar */}
      {healthPct > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--os-text-4)', marginBottom: 2 }}>
            <span>Platform health</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{healthPct}%</span>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{
              width: `${healthPct}%`, height: '100%', borderRadius: 2,
              background: healthPct >= 80 ? 'var(--os-success)' : healthPct >= 60 ? 'var(--os-warning)' : 'var(--os-danger)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

export const MyDayWidget = withWidgetContext(Core)
