import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const evidence: any[]   = Array.isArray(viewModel.evidenceLedger)     ? viewModel.evidenceLedger     : []
  const domains: any[]    = Array.isArray(viewModel.domainIntelligence) ? viewModel.domainIntelligence : []
  const preds: any[]      = Array.isArray(viewModel.predictions)        ? viewModel.predictions        : []
  const briefings: any[]  = Array.isArray(viewModel.analyticsBriefings) ? viewModel.analyticsBriefings : []
  const scenarios: any[]  = Array.isArray(viewModel.twinScenarios)      ? viewModel.twinScenarios      : []
  const memCount: number  = viewModel.kimmpMemoryCount ?? 0
  const totalIndexed      = domains.length + evidence.length + preds.length + briefings.length + memCount

  const highConf: number  = viewModel.highConfidencePredictions ?? 0
  const totalPred: number = viewModel.totalPredictions          ?? preds.length
  const drifts: number    = viewModel.activeDrifts              ?? 0
  const indexQuality      = totalPred > 0 ? Math.round((highConf / totalPred) * 100) : 100
  const qualCol           = indexQuality >= 70 ? 'var(--os-success)' : indexQuality >= 50 ? 'var(--os-warning)' : 'var(--os-danger)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Total Indexed', value: totalIndexed, col: 'var(--os-text-1)' },
          { label: 'Domains',       value: domains.length, col: 'var(--os-blue)'  },
          { label: 'Memories',      value: memCount,       col: 'var(--os-text-1)' },
          { label: 'Twin Scenarios',value: scenarios.length, col: 'var(--os-text-1)' },
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
          <span>Signal quality ({drifts > 0 ? `${drifts} drift` : 'no drifts'})</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: qualCol }}>{indexQuality}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${indexQuality}%`, height: '100%', borderRadius: 2, background: qualCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Index Coverage</div>
        {[
          { name: 'Domain Intelligence', count: domains.length,    col: 'var(--os-blue)'    },
          { name: 'Evidence Records',    count: evidence.length,   col: 'var(--os-success)' },
          { name: 'Prediction Signals',  count: preds.length,      col: 'var(--os-warning)' },
          { name: 'Intelligence Briefs', count: briefings.length,  col: 'var(--os-text-3)'  },
        ].map(({ name, count, col }) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: '4px 10px', borderRadius: 5,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: col, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{name}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: col, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
          </div>
        ))}
      </div>

      {evidence.slice(0, 2).map((e: any, i: number) => (
        <div key={e.id ?? i} style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          color: 'var(--os-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {e.snippet ?? e.source ?? e.type ?? 'Evidence record'}
        </div>
      ))}
    </div>
  )
}

export const EnterpriseSearchWidget = withWidgetContext(Core)
