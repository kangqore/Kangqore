import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const total: number      = viewModel.totalBreachedKpis    ?? 0
  const riskScore: number  = viewModel.riskScore            ?? 0
  const riskLevel: string  = viewModel.riskLevel            ?? 'LOW'
  const anomalies: number  = viewModel.anomalyCount         ?? 0
  const compScore: number  = viewModel.complianceScore      ?? 100
  const trustScore: number = viewModel.complianceTrustScore ?? compScore
  const exposure: any[]    = Array.isArray(viewModel.domainRiskExposure)  ? viewModel.domainRiskExposure  : []
  const briefings: any[]   = Array.isArray(viewModel.complianceBriefings) ? viewModel.complianceBriefings : []
  const recs               = briefings.flatMap((b: any) => b.recommendations ?? []).slice(0, 3)

  const levelCol  = riskLevel === 'HIGH' ? 'var(--os-danger)' : riskLevel === 'MEDIUM' ? 'var(--os-warning)' : 'var(--os-success)'
  const trustCol  = trustScore >= 80 ? 'var(--os-success)' : trustScore >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'
  const breached  = exposure.filter((d: any) => d.breachedKpis?.length > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Breached KPIs', value: total,     col: total > 0     ? 'var(--os-danger)'  : 'var(--os-success)' },
          { label: 'Risk Level',    value: riskLevel,  col: levelCol                                                 },
          { label: 'Anomalies',     value: anomalies,  col: anomalies > 0 ? 'var(--os-warning)' : 'var(--os-text-4)' },
          { label: 'Trust Score',   value: `${trustScore}%`, col: trustCol                                           },
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

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
          <span>Compliance trust score</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: trustCol }}>{trustScore}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${Math.min(100, trustScore)}%`, height: '100%', borderRadius: 2, background: trustCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {breached.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Domain Breaches</div>
          {breached.slice(0, 3).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-danger)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {d.breachedKpis.length} KPI{d.breachedKpis.length > 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {breached.length === 0 && total === 0 && (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          All domains within KPI targets — platform healthy
        </div>
      )}

      {recs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Optimisation Queue</div>
          {recs.map((r: string) => (
            <div key={r} style={{
              padding: '5px 9px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)33',
              color: 'var(--os-text-2)',
            }}>
              <span style={{ color: 'var(--os-blue)', marginRight: 5 }}>↗</span>{r}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const OptimizationLedgerWidget = withWidgetContext(Core)
