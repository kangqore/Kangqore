import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function verdictColor(v: string): string {
  if (v === 'PASS')     return 'var(--os-success)'
  if (v === 'WARN')     return 'var(--os-warning)'
  if (v === 'CRITICAL') return 'var(--os-danger)'
  return 'var(--os-text-4)'
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const exposure: any[]   = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []
  const total: number     = viewModel.totalBreachedKpis ?? 0
  const riskScore: number = viewModel.riskScore ?? 0
  const riskLevel: string = viewModel.riskLevel ?? 'LOW'
  const critical24h       = viewModel.critical24h ?? 0
  const anomalyCount      = viewModel.anomalyCount ?? 0
  const atRisk            = exposure.filter((d: any) => d.breachedKpis?.length > 0)

  const riVerdict: string = viewModel.riVerdict ?? 'NO_DATA'
  const riSummary: string | null = viewModel.riSummary ?? null
  const riLastRun: string | null = viewModel.riLastRun ?? null

  let riskCol = 'var(--os-success)'
  if (riskLevel === 'HIGH')   riskCol = 'var(--os-danger)'
  else if (riskLevel === 'MEDIUM') riskCol = 'var(--os-warning)'

  const riCol = verdictColor(riVerdict)

  let riAge = '—'
  if (riLastRun) {
    const h = Math.floor((Date.now() - new Date(riLastRun).getTime()) / 3_600_000)
    const m = Math.floor(((Date.now() - new Date(riLastRun).getTime()) % 3_600_000) / 60_000)
    riAge = h > 0 ? `${h}h ago` : `${m}m ago`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* RISK_INTELLIGENCE engine banner */}
      <div style={{
        padding: '8px 11px', borderRadius: 6,
        background: riCol + '10', border: `1px solid ${riCol}33`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: riCol, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            RISK INTELLIGENCE ENGINE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: riCol + '1a', color: riCol, border: `1px solid ${riCol}44`,
            }}>{riVerdict}</span>
            {riLastRun && (
              <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{riAge}</span>
            )}
          </div>
        </div>
        {riSummary && (
          <div style={{ fontSize: 10, color: 'var(--os-text-3)', marginTop: 4, lineHeight: 1.4 }}>
            {riSummary.slice(0, 90)}
          </div>
        )}
      </div>

      {/* Risk stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Risk Level',   value: riskLevel,    col: riskCol                                },
          { label: 'Risk Score',   value: riskScore,    col: riskCol                                },
          { label: 'KPI Breaches', value: total,        col: total > 0 ? 'var(--os-danger)' : 'var(--os-success)' },
          { label: 'Anomalies',    value: anomalyCount, col: anomalyCount > 0 ? 'var(--os-warning)' : 'var(--os-text-1)' },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>
              {value}
            </div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Domains at risk */}
      {atRisk.length === 0 ? (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          All domains within risk thresholds
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Domains at Risk
          </div>
          {atRisk.slice(0, 4).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1 }}>{d.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-danger)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {d.breachedKpis.length} KPI{d.breachedKpis.length !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const RiskDashboardWidget = withWidgetContext(Core)
