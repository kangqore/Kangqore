import React, { useState } from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

type PriorityFilter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'var(--os-danger)',
  HIGH:     'var(--os-warning)',
  MEDIUM:   'var(--os-blue)',
  LOW:      'var(--os-text-4)',
  NORMAL:   'var(--os-text-4)',
}

const FILTERS: PriorityFilter[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM']

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const [activeFilter, setActiveFilter] = useState<PriorityFilter>('ALL')

  const allBriefings: any[]     = Array.isArray(viewModel.analyticsBriefings) ? viewModel.analyticsBriefings : []
  const criticalBriefs: any[]   = Array.isArray(viewModel.criticalBriefings)  ? viewModel.criticalBriefings  : []
  const highBriefs: any[]       = Array.isArray(viewModel.highBriefings)      ? viewModel.highBriefings      : []
  const mediumBriefs: any[]     = Array.isArray(viewModel.mediumBriefings)    ? viewModel.mediumBriefings    : []
  const exposure: any[]         = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []
  const preds: any[]            = Array.isArray(viewModel.predictions)        ? viewModel.predictions        : []

  const highConf    = preds.filter((p: any) => (p.confidence ?? 0) >= 0.8).length
  const healthyDoms = exposure.filter((d: any) => !d.breachedKpis?.length).length

  let filtered: any[]
  if (activeFilter === 'CRITICAL') filtered = criticalBriefs.length > 0 ? criticalBriefs : allBriefings.filter(b => b.priority === 'CRITICAL')
  else if (activeFilter === 'HIGH') filtered = highBriefs.length > 0 ? highBriefs : allBriefings.filter(b => b.priority === 'HIGH')
  else if (activeFilter === 'MEDIUM') filtered = mediumBriefs.length > 0 ? mediumBriefs : allBriefings.filter(b => b.priority === 'MEDIUM')
  else filtered = allBriefings

  const criticalCount = criticalBriefs.length > 0 ? criticalBriefs.length : allBriefings.filter(b => b.priority === 'CRITICAL').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats header */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Briefings',       value: allBriefings.length,                      warn: false                   },
          { label: 'High Conf Preds', value: `${highConf}/${preds.length}`,             warn: highConf < preds.length && preds.length > 0 },
          { label: 'Healthy Domains', value: `${healthyDoms}/${exposure.length}`,        warn: healthyDoms < exposure.length               },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Priority filter tabs */}
      <div style={{ display: 'flex', gap: 4 }}>
        {FILTERS.map(f => {
          const isActive = f === activeFilter
          let chipCol = 'var(--os-text-4)'
          if (f === 'CRITICAL') chipCol = 'var(--os-danger)'
          else if (f === 'HIGH') chipCol = 'var(--os-warning)'
          else if (f === 'MEDIUM') chipCol = 'var(--os-blue)'

          const badge = f === 'CRITICAL' ? criticalCount : 0

          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                background:   isActive ? (chipCol + '18') : 'var(--os-surface-3)',
                border:       isActive ? `1px solid ${chipCol}44` : '1px solid var(--os-border-subtle)',
                color:        isActive ? chipCol : 'var(--os-text-4)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}
            >
              {f}{badge > 0 && f === 'CRITICAL' ? ` (${badge})` : ''}
            </button>
          )
        })}
      </div>

      {/* Briefing feed */}
      {filtered.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>
          No {activeFilter === 'ALL' ? '' : activeFilter.toLowerCase() + ' '}briefings
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {filtered.slice(0, 4).map((b: any) => {
            const pCol = PRIORITY_COLOR[b.priority] ?? 'var(--os-text-4)'
            const confPct = Math.round((b.confidence ?? 0) * 100)
            return (
              <div key={b.id} style={{
                padding: '7px 10px', borderRadius: 6,
                background: 'var(--os-surface-3)', border: `1px solid ${pCol}22`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--os-text-1)', lineHeight: 1.4 }}>
                      {b.summary ?? b.title ?? 'Briefing'}
                    </div>

                    {/* Key findings */}
                    {Array.isArray(b.keyFindings) && b.keyFindings.length > 0 && (
                      <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {b.keyFindings.slice(0, 2).map((f: string) => (
                          <div key={f} style={{ fontSize: 9, color: 'var(--os-text-3)', lineHeight: 1.4 }}>
                            <span style={{ color: pCol, marginRight: 4 }}>·</span>{f.slice(0, 70)}
                          </div>
                        ))}
                        {b.keyFindings.length > 2 && (
                          <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>
                            +{b.keyFindings.length - 2} more findings
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4,
                      background: pCol + '1a', color: pCol, border: `1px solid ${pCol}33`,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>{b.priority ?? 'INFO'}</span>
                    {confPct > 0 && (
                      <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                        {confPct}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Recommendations count */}
                {b.recommendations?.length > 0 && (
                  <div style={{ marginTop: 3, fontSize: 9, color: 'var(--os-text-4)' }}>
                    {b.recommendations.length} recommendation{b.recommendations.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length > 4 && (
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', textAlign: 'center' }}>
              +{filtered.length - 4} more briefings
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const InsightsExplorerWidget = withWidgetContext(Core)
