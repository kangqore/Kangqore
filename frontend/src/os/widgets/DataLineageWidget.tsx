import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const domains: any[]   = Array.isArray(viewModel.domainIntelligence) ? viewModel.domainIntelligence : []
  const evidence: any[]  = Array.isArray(viewModel.evidenceLedger)     ? viewModel.evidenceLedger     : []
  const auditTrail: any[]= Array.isArray(viewModel.auditTrail)         ? viewModel.auditTrail         : []
  const auditCount       = viewModel.auditCount ?? auditTrail.length
  const live             = domains.filter((d: any) => d.ready)
  const idle             = domains.filter((d: any) => !d.ready)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Data Sources', value: domains.length, warn: false             },
          { label: 'Live',         value: live.length,    warn: false             },
          { label: 'Idle',         value: idle.length,    warn: idle.length > 0   },
          { label: 'Audit Events', value: auditCount,     warn: false             },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Data Sources</div>
        {domains.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '6px 0' }}>No sources configured</div>
        ) : domains.slice(0, 3).map((d: any) => (
          <div key={d.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: '5px 10px', borderRadius: 5,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: d.ready ? 'var(--os-success)' : 'var(--os-text-4)' }} />
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              {d.kpis?.length > 0 && (
                <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>{d.kpis.length} KPI</span>
              )}
              <span style={{ fontSize: 9, fontWeight: 700, color: d.ready ? 'var(--os-success)' : 'var(--os-text-4)' }}>
                {d.ready ? 'LIVE' : 'IDLE'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {auditTrail.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Audit Events</div>
          {auditTrail.slice(0, 2).map((a: any, i: number) => (
            <div key={a.id ?? i} style={{
              padding: '5px 10px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
            }}>
              <span style={{ color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.action ?? a.event ?? 'Audit event'}
              </span>
              {a.actor && <span style={{ fontSize: 10, color: 'var(--os-text-4)', flexShrink: 0 }}>{a.actor}</span>}
            </div>
          ))}
        </div>
      )}

      {evidence.length > 0 && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--os-text-3)' }}>Evidence records</span>
          <span style={{ fontWeight: 700, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>{evidence.length}</span>
        </div>
      )}
    </div>
  )
}

export const DataLineageWidget = withWidgetContext(Core)
