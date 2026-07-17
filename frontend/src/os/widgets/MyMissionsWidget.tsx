import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'var(--os-danger)',
  HIGH:     'var(--os-warning)',
  NORMAL:   'var(--os-blue)',
  LOW:      'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const missions: any[] = Array.isArray(viewModel.activeMissions) ? viewModel.activeMissions : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Active Missions
        </span>
        <span style={{
          fontSize: 18, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          color: missions.length > 0 ? 'var(--os-warning)' : 'var(--os-text-4)',
        }}>
          {missions.length}
        </span>
      </div>

      {missions.length === 0 ? (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          No active missions — system is stable
        </div>
      ) : (
        missions.slice(0, 4).map((m: any) => {
          const col = PRIORITY_COLOR[m.priority] ?? 'var(--os-text-4)'
          return (
            <div key={m.goal ?? m.title} style={{
              padding: '7px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)', border: `1px solid ${col}33`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: 11, color: 'var(--os-text-1)', lineHeight: 1.4,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {m.goal ?? m.title ?? 'Mission'}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2 }}>
                    {Math.round((m.confidence ?? 0) * 100)}% confidence
                  </div>
                </div>
                <span style={{
                  flexShrink: 0, fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4,
                  background: col + '1a', color: col, border: `1px solid ${col}44`,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {m.priority ?? 'ACTIVE'}
                </span>
              </div>
            </div>
          )
        })
      )}

      <button
        onClick={() => onAction('open_mission_control', {})}
        style={{
          marginTop: 2, fontSize: 11, fontWeight: 600, padding: '5px 0', borderRadius: 6,
          background: 'var(--os-blue-dim)', color: 'var(--os-blue)',
          border: '1px solid var(--os-blue)44', cursor: 'pointer', width: '100%',
        }}
      >
        Mission Control →
      </button>
    </div>
  )
}

export const MyMissionsWidget = withWidgetContext(Core)
