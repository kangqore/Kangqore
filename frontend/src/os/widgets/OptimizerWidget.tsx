import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const preds: any[]     = Array.isArray(viewModel.predictions) ? viewModel.predictions : []
  const highConf: number = viewModel.highConfidencePredictions ?? 0
  const total: number    = viewModel.totalPredictions ?? preds.length
  const drifts: number   = viewModel.activeDrifts     ?? 0
  const signalQuality    = total > 0 ? Math.round((highConf / total) * 100) : 0
  const exposure: any[]  = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []
  const breached: number = viewModel.totalBreachedKpis ?? 0
  const gate8: any[]     = Array.isArray(viewModel.gate8Pillars) ? viewModel.gate8Pillars : []
  const oisScore         = viewModel.oisScore ?? null
  const briefings: any[] = Array.isArray(viewModel.analyticsBriefings) ? viewModel.analyticsBriefings : []
  const recs             = briefings.flatMap((b: any) => b.recommendations ?? []).slice(0, 2)

  let qualCol = 'var(--os-success)'
  if (signalQuality < 50) qualCol = 'var(--os-danger)'
  else if (signalQuality < 70) qualCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Signal Quality', value: `${signalQuality}%`, warn: signalQuality < 50 },
          { label: 'Actionable',     value: highConf,             warn: false              },
          { label: 'Breached KPIs',  value: breached,             warn: breached > 0       },
          { label: 'Drifts',         value: drifts,               warn: drifts > 0         },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : qualCol }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
            <span>Signal quality</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: qualCol }}>{signalQuality}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{ width: `${signalQuality}%`, height: '100%', borderRadius: 2, background: qualCol, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {gate8.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gate 8 Pillars</div>
            {oisScore !== null && (
              <span style={{ fontSize: 11, fontWeight: 700, color: oisScore >= 70 ? 'var(--os-success)' : 'var(--os-warning)', fontVariantNumeric: 'tabular-nums' }}>
                OIS {oisScore}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {gate8.slice(0, 5).map((p: any) => {
              const pct = Math.round((p.score ?? 0))
              const col = pct >= 80 ? 'var(--os-success)' : pct >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'
              return (
                <div key={p.id ?? p.name} style={{
                  fontSize: 10, padding: '3px 7px', borderRadius: 4,
                  background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
                  color: col, fontVariantNumeric: 'tabular-nums',
                }}>
                  {p.name?.slice(0, 8) ?? 'Pillar'} {pct}%
                </div>
              )
            })}
          </div>
        </div>
      )}

      {recs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Optimisation Actions</div>
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

      {exposure.filter((d: any) => d.breachedKpis?.length > 0).slice(0, 1).map((d: any) => (
        <div key={d.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
        }}>
          <span style={{ color: 'var(--os-text-2)' }}>{d.name}</span>
          <span style={{ color: 'var(--os-danger)', fontWeight: 700 }}>{d.breachedKpis.length} KPIs breached</span>
        </div>
      ))}
    </div>
  )
}

export const OptimizerWidget = withWidgetContext(Core)
