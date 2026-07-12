import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const confidence: number   = viewModel.platformConfidence  ?? 0
  const breached: number     = viewModel.totalBreachedKpis   ?? 0
  const riskExposure: number = viewModel.domainRiskExposure  ?? 0
  const domains: any[]       = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : []

  const confPct   = Math.round(confidence * 100)
  const confColor = confPct >= 75 ? 'var(--os-success)' : confPct >= 50 ? 'var(--os-warning)' : 'var(--os-danger)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Confidence hero */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 6,
        background: confColor + '12',
        border: `1px solid ${confColor}33`,
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 52 }}>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: confColor, fontVariantNumeric: 'tabular-nums' }}>
            {confPct}%
          </div>
          <div style={{ fontSize: 9, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
            Confidence
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--os-text-4)' }}>Breached KPIs</span>
            <span style={{ fontWeight: 700, color: breached > 0 ? 'var(--os-danger)' : 'var(--os-success)', fontVariantNumeric: 'tabular-nums' }}>
              {breached}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--os-text-4)' }}>Risk Exposure</span>
            <span style={{ fontWeight: 700, color: riskExposure > 0 ? 'var(--os-warning)' : 'var(--os-success)', fontVariantNumeric: 'tabular-nums' }}>
              {riskExposure}
            </span>
          </div>
        </div>
      </div>

      {/* Confidence track */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 4 }}>
          <span>Platform Confidence</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{confPct}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--os-border)' }}>
          <div style={{ width: `${confPct}%`, height: '100%', borderRadius: 3, background: confColor, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Domain risk pills */}
      {domains.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {domains.slice(0, 8).map((d: any) => {
            const hasBreached = (d.breachedKpis ?? 0) > 0
            const col = hasBreached ? 'var(--os-danger)' : d.ready ? 'var(--os-success)' : 'var(--os-warning)'
            return (
              <div key={d.id} style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 4,
                background: col + '1a', border: `1px solid ${col}33`, color: col,
              }}>
                {d.name}
                {hasBreached && <span style={{ marginLeft: 4, fontWeight: 700 }}>{d.breachedKpis}</span>}
              </div>
            )
          })}
        </div>
      )}

      {breached === 0 && riskExposure === 0 && (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          All KPIs within target — no optimization required
        </div>
      )}
    </div>
  )
}

export const OptimizationCenterWidget = withWidgetContext(Core)
