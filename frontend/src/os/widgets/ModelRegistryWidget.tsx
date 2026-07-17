import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const VERDICT_COL: Record<string, string> = {
  PASS:    'var(--os-success)',
  WARN:    'var(--os-warning)',
  CRITICAL:'var(--os-danger)',
  NO_DATA: 'var(--os-text-4)',
  UNKNOWN: 'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const wirVerdict: string     = viewModel.wirVerdict ?? 'NO_DATA'
  const wirSummary: string | null = viewModel.wirSummary ?? null
  const models: any[]          = Array.isArray(viewModel.registeredModels)  ? viewModel.registeredModels  : []
  const subsystems: any[]      = Array.isArray(viewModel.subsystemEntries)  ? viewModel.subsystemEntries  : []
  const caps: string[]         = Array.isArray(viewModel.activeCapabilities) ? viewModel.activeCapabilities : []

  const totalCaps  = viewModel.domainCapabilities ?? caps.length
  const subsysCount = viewModel.subsystemCount ?? subsystems.length
  const wirCol     = VERDICT_COL[wirVerdict] ?? 'var(--os-text-4)'

  const displayModels = models.length > 0 ? models : caps.slice(0, 6).map((c: string) => ({
    id: `cap-${c}`, name: c, provider: 'KEOS', status: 'LIVE',
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* WIR engine banner */}
      <div style={{
        padding: '6px 10px', borderRadius: 6,
        background: wirCol + '10', border: `1px solid ${wirCol}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}>
        <div>
          <span style={{ fontSize: 9, fontWeight: 700, color: wirCol, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            WIR · Intelligence Registry · {wirVerdict}
          </span>
          {wirSummary && (
            <div style={{ fontSize: 9, color: 'var(--os-text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
              {wirSummary}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Models',    value: displayModels.length, warn: false },
          { label: 'Active',    value: caps.length,          warn: false },
          { label: 'Providers', value: subsysCount,          warn: false },
          { label: 'Total Cap', value: totalCaps,            warn: false },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Subsystem providers */}
      {subsystems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Providers · {subsystems.length} systems
          </div>
          {subsystems.slice(0, 4).map((s: any) => {
            let statusCol = 'var(--os-success)'
            if ((s.status ?? '').toLowerCase().includes('error') || (s.status ?? '').toLowerCase().includes('fail')) {
              statusCol = 'var(--os-danger)'
            } else if ((s.status ?? '').toLowerCase().includes('warn') || (s.status ?? '').toLowerCase().includes('degraded')) {
              statusCol = 'var(--os-warning)'
            }
            return (
              <div key={s.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.name}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: statusCol, flexShrink: 0, textTransform: 'uppercase' }}>
                  {s.status ?? 'OK'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Registered models (capabilities) */}
      {displayModels.length > 0 && subsystems.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Registered Capabilities
          </div>
          {displayModels.slice(0, 5).map((m: any) => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '4px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.name}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-success)', flexShrink: 0 }}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const ModelRegistryWidget = withWidgetContext(Core)
