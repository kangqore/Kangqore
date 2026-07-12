import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const STATUS_COLOR: Record<string, string> = {
  'On Track': 'var(--os-success)',
  'Watch':    'var(--os-warning)',
  'At Risk':  'var(--os-danger)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const projects: any[] = Array.isArray(viewModel.projects) ? viewModel.projects : []
  const atRisk: number  = viewModel.atRiskCount  ?? 0
  const watch: number   = viewModel.watchCount   ?? 0
  const onTrack: number = viewModel.onTrackCount ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {[
          { label: 'On Track', value: onTrack, color: 'var(--os-success)' },
          { label: 'Watch',    value: watch,   color: 'var(--os-warning)' },
          { label: 'At Risk',  value: atRisk,  color: 'var(--os-danger)'  },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: color + '12',
            border: `1px solid ${color}33`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No active projects</p>
      ) : (
        projects.slice(0, 5).map((p: any) => {
          const color = STATUS_COLOR[p.status] ?? 'var(--os-text-4)'
          return (
            <div key={p.id} style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              padding: '8px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: '1px solid var(--os-border-subtle)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-text-1)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 1 }}>
                    {p.clientName} · {p.lead}
                  </div>
                </div>
                <span style={{
                  flexShrink: 0, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                  background: color + '1a',
                  color,
                  border: `1px solid ${color}44`,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {p.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: 'var(--os-border)',
                }}>
                  <div style={{
                    width: `${Math.min(100, p.progress ?? 0)}%`,
                    height: '100%', borderRadius: 2,
                    background: color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--os-text-4)', minWidth: 26, textAlign: 'right' }}>
                  {p.progress ?? 0}%
                </span>
              </div>

              <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
                Gate: <span style={{ color: 'var(--os-text-3)' }}>{p.nextGate ?? 'Planning'}</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export const ProjectBoardWidget = withWidgetContext(Core)
