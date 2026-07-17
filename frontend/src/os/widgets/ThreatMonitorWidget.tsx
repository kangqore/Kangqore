import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const total: number    = viewModel.totalBreachedKpis ?? 0
  const critical24h      = viewModel.critical24h ?? 0
  const warn24h          = viewModel.warn24h     ?? 0
  const exposure: any[]  = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []
  const highRisk         = exposure.filter((d: any) => d.breachedKpis?.length > 1)
  const autonomy: any[]  = Array.isArray(viewModel.autonomyEvents) ? viewModel.autonomyEvents : []
  const autoCritical     = viewModel.autonomyCritical ?? autonomy.filter((e: any) => e.verdict === 'CRITICAL').length

  const isClear = total === 0 && critical24h === 0 && autoCritical === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Status',      value: isClear ? 'CLEAR' : 'ALERTS',  warn: !isClear    },
          { label: 'Critical 24h',value: critical24h,                    warn: critical24h > 0 },
          { label: 'Warn 24h',    value: warn24h,                        warn: warn24h > 0     },
          { label: 'High Risk',   value: highRisk.length,                warn: highRisk.length > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-success)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {isClear ? (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          No active threats — all systems operating within parameters
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Threat Signals</div>
          {highRisk.slice(0, 3).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1 }}>{d.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-danger)', flexShrink: 0 }}>
                {d.breachedKpis.length} breach{d.breachedKpis.length !== 1 ? 'es' : ''}
              </span>
            </div>
          ))}
          {autoCritical > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>AEGIS Autonomy Flags</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-danger)' }}>{autoCritical} critical</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const ThreatMonitorWidget = withWidgetContext(Core)
