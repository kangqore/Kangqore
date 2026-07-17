import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const verdictCol: Record<string, string> = {
  PASS:     'var(--os-success)',
  WARN:     'var(--os-warning)',
  FAIL:     'var(--os-danger)',
  CRITICAL: 'var(--os-danger)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const trail: any[]      = Array.isArray(viewModel.auditTrail) ? viewModel.auditTrail : []
  const critical24h       = viewModel.critical24h ?? 0
  const warn24h           = viewModel.warn24h     ?? 0
  const healthScore       = viewModel.shieldHealthScore ?? null
  const failEntries       = trail.filter((e: any) => e.verdict === 'FAIL' || e.verdict === 'CRITICAL')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Total Events',  value: trail.length,  warn: false          },
          { label: 'Critical 24h',  value: critical24h,   warn: critical24h > 0 },
          { label: 'Warn 24h',      value: warn24h,       warn: warn24h > 0    },
          { label: 'Health',        value: healthScore !== null ? `${healthScore}%` : '—', warn: (healthScore ?? 100) < 80 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {trail.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>No audit events in window</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {failEntries.length > 0 ? 'Failed Events' : 'Recent Events'}
          </div>
          {(failEntries.length > 0 ? failEntries : trail).slice(0, 4).map((e: any) => (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: (e.verdict === 'FAIL' || e.verdict === 'CRITICAL') ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
              border: (e.verdict === 'FAIL' || e.verdict === 'CRITICAL') ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.description ?? e.eventType ?? 'Audit Event'}
                </div>
                <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{e.system}</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: verdictCol[e.verdict] ?? 'var(--os-text-4)', flexShrink: 0 }}>{e.verdict}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const AuditExplorerWidget = withWidgetContext(Core)
