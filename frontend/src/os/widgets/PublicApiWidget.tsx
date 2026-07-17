import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtCurr(n: number | null): string {
  if (n === null) return '—'
  if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(0)}K`
  return `₹${n.toFixed(0)}`
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const domains: any[]        = Array.isArray(viewModel.ecosystemDomains)   ? viewModel.ecosystemDomains   : []
  const oisScore              = viewModel.oisScore        ?? null
  const arrValue              = viewModel.arrValue        ?? null
  const pipelineValue         = viewModel.pipelineValue   ?? null
  const activeContracts       = viewModel.activeContracts ?? null
  const mrrDeltaPct           = viewModel.mrrDeltaPct     ?? null
  const portalCount: number   = viewModel.clientPortalCount ?? 0
  const activeDomains         = domains.filter((d: any) => d.ready)
  const totalCaps             = domains.reduce((s: number, d: any) => s + (d.capabilities ?? 0), 0)

  const oisCol    = oisScore !== null ? (oisScore >= 70 ? 'var(--os-success)' : oisScore >= 50 ? 'var(--os-warning)' : 'var(--os-danger)') : 'var(--os-text-4)'
  const deltaCol  = mrrDeltaPct !== null ? (mrrDeltaPct >= 0 ? 'var(--os-success)' : 'var(--os-danger)') : 'var(--os-text-4)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'API Domains',  value: domains.length,      warn: false },
          { label: 'Active',       value: activeDomains.length, warn: false },
          { label: 'Endpoints',    value: totalCaps,            warn: false },
          { label: 'OIS Score',    value: oisScore !== null ? oisScore : '—', col: oisCol },
        ].map(({ label, value, warn, col }: any) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              color: col ?? (warn ? 'var(--os-warning)' : 'var(--os-text-1)') }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {(arrValue !== null || pipelineValue !== null) && (
        <div style={{ display: 'flex', gap: 6 }}>
          {arrValue !== null && (
            <div style={{
              flex: 1, padding: '6px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>ARR</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmtCurr(arrValue)}</span>
            </div>
          )}
          {pipelineValue !== null && (
            <div style={{
              flex: 1, padding: '6px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Pipeline</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmtCurr(pipelineValue)}</span>
            </div>
          )}
        </div>
      )}

      {domains.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>API Domains</div>
          {domains.slice(0, 3).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '4px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.ready ? 'var(--os-success)' : 'var(--os-text-4)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{d.name}</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {d.capabilities ?? 0} ep{(d.capabilities ?? 0) !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {(mrrDeltaPct !== null || portalCount > 0) && (
        <div style={{
          display: 'flex', gap: 6, padding: '5px 10px', borderRadius: 5,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          fontSize: 11, alignItems: 'center', justifyContent: 'space-between',
        }}>
          {portalCount > 0 && <span style={{ color: 'var(--os-text-3)' }}>{portalCount} client portals</span>}
          {mrrDeltaPct !== null && (
            <span style={{ fontWeight: 700, color: deltaCol, fontVariantNumeric: 'tabular-nums' }}>
              MRR {mrrDeltaPct >= 0 ? '+' : ''}{mrrDeltaPct.toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export const PublicApiWidget = withWidgetContext(Core)
