import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const exposure: any[]   = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []
  const signals           = exposure.flatMap((d: any) =>
    (d.breachedKpis ?? []).map((k: any) => ({ domain: d.name, domainId: d.id, ...k }))
  )
  const riskScore: number = viewModel.riskScore  ?? 0
  const riskLevel: string = viewModel.riskLevel  ?? 'LOW'
  const anomalies: number = viewModel.anomalyCount ?? 0
  const drifts: number    = viewModel.activeDrifts  ?? 0
  const critical: any[]   = Array.isArray(viewModel.criticalBriefings) ? viewModel.criticalBriefings : []

  const levelCol = riskLevel === 'HIGH' ? 'var(--os-danger)' : riskLevel === 'MEDIUM' ? 'var(--os-warning)' : 'var(--os-success)'
  const riskPct  = Math.min(100, riskScore)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Risk Level',  value: riskLevel,      col: levelCol                                                      },
          { label: 'Risk Score',  value: riskScore,      col: levelCol                                                      },
          { label: 'KPI Signals', value: signals.length, col: signals.length > 0  ? 'var(--os-danger)'  : 'var(--os-success)' },
          { label: 'Anomalies',   value: anomalies,      col: anomalies > 0       ? 'var(--os-warning)' : 'var(--os-text-4)'  },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {riskScore > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
            <span>Risk exposure</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: levelCol }}>{riskPct}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{ width: `${riskPct}%`, height: '100%', borderRadius: 2, background: levelCol, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {signals.length === 0 && anomalies === 0 && drifts === 0 ? (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          No active risk signals detected
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Risk Signals</div>
          {signals.slice(0, 3).map((s: any) => (
            <div key={`${s.domainId}-${s.id ?? s.name}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.domain} · {s.name ?? s.id}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-danger)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {s.current !== undefined ? `${s.current} → ${s.target}` : 'BREACH'}
              </span>
            </div>
          ))}
          {critical.slice(0, 1).map((b: any) => (
            <div key={b.id} style={{
              padding: '5px 10px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
              color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              <span style={{ color: 'var(--os-danger)', marginRight: 5, fontWeight: 700 }}>CRITICAL</span>
              {b.summary ?? b.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const RiskSignalWidget = withWidgetContext(Core)
