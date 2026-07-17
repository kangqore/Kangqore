import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const priorityCol: Record<string, string> = {
  CRITICAL: 'var(--os-danger)',
  HIGH:     'var(--os-warning)',
  MEDIUM:   'var(--os-blue)',
  LOW:      'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const briefings: any[]  = Array.isArray(viewModel.analyticsBriefings)  ? viewModel.analyticsBriefings  : []
  const critical: any[]   = Array.isArray(viewModel.criticalBriefings)   ? viewModel.criticalBriefings   : []
  const high: any[]       = Array.isArray(viewModel.highBriefings)       ? viewModel.highBriefings       : briefings.filter((b: any) => b.priority === 'HIGH')
  const medium: any[]     = Array.isArray(viewModel.mediumBriefings)     ? viewModel.mediumBriefings     : briefings.filter((b: any) => b.priority === 'MEDIUM')
  const recs              = briefings.flatMap((b: any) => b.recommendations ?? []).slice(0, 2)
  const urgentCount       = critical.length + high.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Reports',   value: briefings.length, warn: false               },
          { label: 'Critical',  value: critical.length,  warn: critical.length > 0 },
          { label: 'High',      value: high.length,      warn: high.length > 0     },
          { label: 'Medium',    value: medium.length,    warn: false               },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {urgentCount > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Urgent Briefings</div>
          {[...critical, ...high].slice(0, 3).map((b: any) => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: b.priority === 'CRITICAL' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
              border: b.priority === 'CRITICAL' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.summary?.slice(0, 52) ?? b.title ?? 'Briefing'}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: priorityCol[b.priority] ?? 'var(--os-text-4)', flexShrink: 0 }}>
                {b.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      {urgentCount === 0 && briefings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Report Queue</div>
          {briefings.slice(0, 4).map((b: any) => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.summary?.slice(0, 52) ?? b.title ?? 'Report'}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: priorityCol[b.priority] ?? 'var(--os-text-4)', flexShrink: 0 }}>{b.priority ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

      {recs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Actions</div>
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

      {briefings.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '10px 0' }}>No reports generated</div>
      )}
    </div>
  )
}

export const ReportsWidget = withWidgetContext(Core)
