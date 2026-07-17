import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const verdictCol: Record<string, string> = {
  PASS:     'var(--os-success)',
  WARN:     'var(--os-warning)',
  CRITICAL: 'var(--os-danger)',
  BLOCK:    'var(--os-danger)',
  NO_DATA:  'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const shieldVerdict: string  = viewModel.shieldVerdict   ?? 'NO_DATA'
  const shieldHealth           = viewModel.shieldHealthScore ?? viewModel.aegisHealth ?? null
  const critical24h: number    = viewModel.critical24h     ?? viewModel.totalCritical ?? 0
  const warn24h: number        = viewModel.warn24h         ?? viewModel.totalWarns    ?? 0
  const autoCritical: number   = viewModel.autonomyCritical ?? 0
  const engines: any[]         = Array.isArray(viewModel.engines) ? viewModel.engines : []
  const autonomyEvents: any[]  = Array.isArray(viewModel.autonomyEvents) ? viewModel.autonomyEvents : []
  const l3Plus: any[]          = Array.isArray(viewModel.l3PlusDecisions) ? viewModel.l3PlusDecisions : []
  const tcSummary: string      = viewModel.tcSummary ?? ''

  const healthCol = (shieldHealth ?? 100) >= 80 ? 'var(--os-success)' : (shieldHealth ?? 100) >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'
  const svCol     = verdictCol[shieldVerdict] ?? 'var(--os-text-4)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Shield Health',  value: shieldHealth !== null ? `${shieldHealth}%` : '—', col: healthCol },
          { label: 'Critical 24h',   value: critical24h,  col: critical24h > 0  ? 'var(--os-danger)'  : 'var(--os-success)' },
          { label: 'Warnings 24h',   value: warn24h,      col: warn24h > 0      ? 'var(--os-warning)' : 'var(--os-text-4)'  },
          { label: 'Auto-Critical',  value: autoCritical, col: autoCritical > 0 ? 'var(--os-danger)'  : 'var(--os-text-4)'  },
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

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px', borderRadius: 6,
        background: (shieldVerdict === 'CRITICAL' || shieldVerdict === 'BLOCK') ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
        border: `1px solid ${svCol}33`,
      }}>
        <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>AEGIS Shield</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: svCol }}>{shieldVerdict}</span>
      </div>

      {engines.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Engine Verdicts</div>
          {engines.slice(0, 4).map((e: any) => {
            const col = verdictCol[e.verdict] ?? 'var(--os-text-4)'
            const isBad = e.verdict === 'CRITICAL' || e.verdict === 'BLOCK'
            return (
              <div key={e.engine} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: isBad ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: isBad ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.summary || e.engine}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: col, flexShrink: 0 }}>{e.verdict}</span>
              </div>
            )
          })}
        </div>
      )}

      {l3Plus.length > 0 && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-warning-dim, var(--os-surface-3))', border: '1px solid var(--os-warning)33',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--os-text-3)' }}>L3+ decisions pending</span>
          <span style={{ fontWeight: 700, color: 'var(--os-warning)', fontVariantNumeric: 'tabular-nums' }}>{l3Plus.length}</span>
        </div>
      )}

      {tcSummary && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          color: 'var(--os-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          TC: {tcSummary}
        </div>
      )}
    </div>
  )
}

export const AccessIdentityWidget = withWidgetContext(Core)
