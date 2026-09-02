import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const verdictCol: Record<string, string> = {
  PASS:     'var(--os-success)',
  WARN:     'var(--os-warning)',
  CRITICAL: 'var(--os-danger)',
  BLOCK:    'var(--os-danger)',
  NO_DATA:  'var(--os-text-4)',
  UNKNOWN:  'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const shieldVerdict: string   = viewModel.shieldVerdict   ?? 'NO_DATA'
  const egressVerdict: string   = viewModel.egressVerdict   ?? 'NO_DATA'
  const sovereignVerdict: string= viewModel.sovereignVerdict ?? 'NO_DATA'
  const wirVerdict: string      = viewModel.wirVerdict       ?? 'NO_DATA'
  const wirSummary: string      = viewModel.wirSummary       ?? ''
  const hanumanasHealth             = viewModel.hanumanasHealthScore ?? null
  const critical24h: number     = viewModel.critical24h      ?? 0
  const denied: number          = viewModel.deniedEventCount ?? 0
  const subsystems              = (viewModel.subsystems as any) ?? {}
  const subEntries              = Object.entries(subsystems)
  const operational             = subEntries.filter(([, v]) => v === 'OPERATIONAL').length

  const healthCol = (hanumanasHealth ?? 100) >= 80 ? 'var(--os-success)' : (hanumanasHealth ?? 100) >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'

  const engines = [
    { label: 'ACCESS_SENTINEL', verdict: shieldVerdict  },
    { label: 'EGRESS_CONTROL',  verdict: egressVerdict  },
    { label: 'SOVEREIGNTY',     verdict: sovereignVerdict },
    { label: 'WIR',             verdict: wirVerdict, summary: wirSummary },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'HANUMANAS Health',  value: hanumanasHealth !== null ? `${hanumanasHealth}%` : '—', col: healthCol },
          { label: 'Critical 24h', value: critical24h, col: critical24h > 0 ? 'var(--os-danger)'  : 'var(--os-success)' },
          { label: 'Denied Events',value: denied,      col: denied > 0      ? 'var(--os-warning)' : 'var(--os-text-4)'  },
          { label: 'Subsystems',   value: `${operational}/${subEntries.length}`, col: operational < subEntries.length ? 'var(--os-warning)' : 'var(--os-success)' },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>HANUMANAS Security Engines</div>
        {engines.map(({ label, verdict, summary }) => {
          const col   = verdictCol[verdict] ?? 'var(--os-text-4)'
          const isBad = verdict === 'CRITICAL' || verdict === 'BLOCK'
          return (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: isBad ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
              border: isBad ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {summary || label}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: col, flexShrink: 0 }}>{verdict}</span>
            </div>
          )
        })}
      </div>

      {subEntries.length > 0 && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: operational < subEntries.length ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-success-dim, var(--os-surface-3))',
          border: `1px solid ${operational < subEntries.length ? 'var(--os-warning)33' : 'var(--os-success)33'}`,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span style={{ color: 'var(--os-text-3)' }}>Platform subsystems</span>
          <span style={{ fontWeight: 700, color: operational < subEntries.length ? 'var(--os-warning)' : 'var(--os-success)' }}>
            {operational}/{subEntries.length} OK
          </span>
        </div>
      )}
    </div>
  )
}

export const PolicyRegistryWidget = withWidgetContext(Core)
