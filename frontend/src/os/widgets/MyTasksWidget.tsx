import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const tasks: any[] = Array.isArray(viewModel.tasks) ? viewModel.tasks : []
  const focus        = viewModel.focusItems ?? {}

  const overdue  = focus.critical  ?? tasks.filter((t: any) => t.overdue).length
  const today    = focus.scheduled ?? tasks.filter((t: any) => !t.overdue && t.dueToday).length
  const waiting  = focus.waiting   ?? tasks.filter((t: any) => t.status === 'IN_REVIEW' || t.status === 'WAITING').length
  const blocked  = focus.blocked   ?? tasks.filter((t: any) => t.status === 'BLOCKED').length

  const stats = [
    { label: 'Overdue',  value: overdue,  warn: overdue > 0,  color: overdue > 0 ? 'var(--os-danger)' : 'var(--os-text-1)' },
    { label: 'Today',    value: today,    warn: false,         color: today > 0 ? 'var(--os-warning)' : 'var(--os-text-1)' },
    { label: 'Waiting',  value: waiting,  warn: false,         color: 'var(--os-text-1)' },
    { label: 'Blocked',  value: blocked,  warn: blocked > 0,  color: blocked > 0 ? 'var(--os-danger)' : 'var(--os-text-1)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: s.warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: s.warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {tasks.length > 0 ? (
        tasks.slice(0, 4).map((t: any) => {
          const isOverdue = t.overdue
          const col = isOverdue ? 'var(--os-danger)' : t.dueToday ? 'var(--os-warning)' : 'var(--os-text-4)'
          return (
            <div key={t.id ?? t.title} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: `1px solid ${isOverdue ? 'var(--os-danger)33' : 'var(--os-border-subtle)'}`,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: col,
              }} />
              <span style={{
                fontSize: 11, color: 'var(--os-text-1)', flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {t.title ?? t.description ?? 'Task'}
              </span>
              {t.dueDate && (
                <span style={{ fontSize: 9, color: col, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {new Date(t.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          )
        })
      ) : (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          All tasks resolved — inbox zero
        </div>
      )}
    </div>
  )
}

export const MyTasksWidget = withWidgetContext(Core)
