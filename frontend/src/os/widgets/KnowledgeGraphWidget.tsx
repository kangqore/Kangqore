import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const domains: any[]  = Array.isArray(viewModel.domainOntology ?? viewModel.domainIntelligence)
    ? (viewModel.domainOntology ?? viewModel.domainIntelligence)
    : []
  const preds: any[]    = Array.isArray(viewModel.predictions) ? viewModel.predictions : []
  const briefings: any[]= Array.isArray(viewModel.analyticsBriefings) ? viewModel.analyticsBriefings : []
  const memCount        = viewModel.kimmpMemoryCount ?? 0

  const totalKpis        = domains.reduce((s: number, d: any) => s + (d.kpiCount ?? d.kpis?.length ?? 0), 0)
  const totalCapabilities = domains.reduce((s: number, d: any) => s + (d.capabilities ?? 0), 0)
  const totalGoals        = domains.reduce((s: number, d: any) => s + (d.goals ?? 0), 0)
  const totalObjects      = domains.reduce((s: number, d: any) => s + (d.objects ?? 0), 0)
  const totalRelationships = totalKpis + totalCapabilities + totalGoals

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Graph node type header */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Domain Nodes',   value: domains.length,        warn: false },
          { label: 'KPI Links',      value: totalKpis,             warn: false },
          { label: 'Signal Nodes',   value: preds.length,          warn: false },
          { label: 'Memory Nodes',   value: memCount,              warn: false },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Ontology relationship summary */}
      {(totalCapabilities > 0 || totalGoals > 0 || totalObjects > 0) && (
        <div style={{ display: 'flex', gap: 5 }}>
          {[
            { label: 'Capabilities', value: totalCapabilities, col: 'var(--os-blue)'    },
            { label: 'Goals',        value: totalGoals,        col: 'var(--os-success)' },
            { label: 'Objects',      value: totalObjects,      col: 'var(--os-cyan, var(--os-text-3))'     },
          ].filter(r => r.value > 0).map(({ label, value, col }) => (
            <div key={label} style={{
              flex: 1, padding: '5px 4px', borderRadius: 5, textAlign: 'center',
              background: col + '12', border: `1px solid ${col}33`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
              <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{label}</span>
            </div>
          ))}
          <div style={{
            flex: 1, padding: '5px 4px', borderRadius: 5, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>{briefings.length}</div>
            <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>Insights</span>
          </div>
        </div>
      )}

      {/* Domain nodes with ontology detail */}
      {domains.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Graph Nodes · {domains.length} domains
          </div>
          {domains.slice(0, 4).map((d: any) => {
            const breached = d.breachedKpis?.length ?? d.breachedKpis ?? 0
            const kpiCount = d.kpiCount ?? d.kpis?.length ?? 0
            return (
              <div key={d.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: breached > 0 ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: breached > 0 ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.name}
                    </div>
                    {d.version && (
                      <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>v{d.version}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
                    {d.capabilities > 0 && (
                      <span style={{ fontSize: 9, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>
                        {d.capabilities} cap
                      </span>
                    )}
                    <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                      {kpiCount} KPI{kpiCount !== 1 ? 's' : ''}
                    </span>
                    {breached > 0 && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-danger)' }}>
                        {breached}⚠
                      </span>
                    )}
                  </div>
                </div>
                {d.purpose && (
                  <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.purpose.slice(0, 60)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const KnowledgeGraphWidget = withWidgetContext(Core)
