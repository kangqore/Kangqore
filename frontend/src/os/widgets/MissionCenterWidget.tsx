import React, { useState } from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'var(--os-danger)',
  HIGH:     'var(--os-warning)',
  NORMAL:   'var(--os-blue)',
  LOW:      'var(--os-text-4)',
}

function relativeDate(iso?: string): string {
  if (!iso) return ''
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 24) return h === 0 ? 'just now' : `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  } catch {
    return ''
  }
}

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const missions: any[] = Array.isArray(viewModel.activeMissions) ? viewModel.activeMissions : []
  const [expanded, setExpanded] = useState<number | null>(null)

  const criticalCount = missions.filter(m => m.priority === 'CRITICAL').length
  const highCount     = missions.filter(m => m.priority === 'HIGH').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Active Missions
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {criticalCount > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
              background: 'var(--os-danger)1a', color: 'var(--os-danger)', border: '1px solid var(--os-danger)44',
            }}>
              {criticalCount} CRITICAL
            </span>
          )}
          {highCount > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
              background: 'var(--os-warning)1a', color: 'var(--os-warning)', border: '1px solid var(--os-warning)44',
            }}>
              {highCount} HIGH
            </span>
          )}
          {missions.length === 0 && (
            <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1, color: 'var(--os-success)' }}>0</span>
          )}
        </div>
      </div>

      {missions.length === 0 ? (
        <div style={{
          padding: '8px 12px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          No high-priority missions active
        </div>
      ) : (
        missions.slice(0, 4).map((m: any, i: number) => {
          const col      = PRIORITY_COLOR[m.priority] ?? 'var(--os-text-4)'
          const findings = Array.isArray(m.findings) ? m.findings : []
          const isOpen   = expanded === i
          const ts       = relativeDate(m.createdAt)
          return (
            <div
              key={m.goal ?? i}
              style={{
                borderRadius: 6,
                background: 'var(--os-surface-3)',
                border: `1px solid ${col}33`,
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => findings.length > 0 && setExpanded(isOpen ? null : i)}
                style={{
                  padding: '7px 10px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 6,
                  cursor: findings.length > 0 ? 'pointer' : 'default',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: 11, color: 'var(--os-text-1)', lineHeight: 1.4,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {m.goal ?? m.title ?? 'Mission'}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>
                      Confidence: {Math.round((m.confidence ?? 0) * 100)}%
                    </span>
                    {ts && <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{ts}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                    background: col + '1a', color: col, border: `1px solid ${col}44`,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {m.priority ?? 'ACTIVE'}
                  </span>
                  {findings.length > 0 && (
                    <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{isOpen ? '▴' : '▾'}</span>
                  )}
                </div>
              </div>
              {isOpen && findings.length > 0 && (
                <div style={{ padding: '0 10px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {findings.slice(0, 3).map((f: string, fi: number) => (
                    <div key={fi} style={{
                      padding: '4px 8px', borderRadius: 4, fontSize: 10,
                      background: col + '0d', color: 'var(--os-text-3)',
                      borderLeft: `2px solid ${col}`,
                    }}>
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}

      <button
        onClick={() => onAction('launch_mission', {})}
        style={{
          marginTop: 2, fontSize: 11, fontWeight: 600, padding: '6px 0', borderRadius: 6,
          background: 'var(--os-blue-dim)', color: 'var(--os-blue)',
          border: '1px solid var(--os-blue)44', cursor: 'pointer', width: '100%',
        }}
      >
        + Launch Mission
      </button>
    </div>
  )
}

export const MissionCenterWidget = withWidgetContext(Core)
