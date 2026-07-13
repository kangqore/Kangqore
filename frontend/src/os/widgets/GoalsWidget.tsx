import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

function goalColor(progress: number, status: string): string {
  if (status === 'ACHIEVED') return 'var(--os-success)'
  if (progress >= 75) return 'var(--os-success)'
  if (progress >= 40) return 'var(--os-warning)'
  return 'var(--os-danger)'
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const goals: any[]   = Array.isArray(viewModel.goals) ? viewModel.goals : []
  const count: number  = viewModel.goalCount ?? goals.length

  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((s: number, g: any) => s + (g.progress ?? 0), 0) / goals.length)
    : 0

  const onTrack  = goals.filter((g: any) => (g.progress ?? 0) >= 75).length
  const atRisk   = goals.filter((g: any) => (g.progress ?? 0) < 40 && g.status !== 'ACHIEVED').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
        {[
          { label: 'Goals',    value: count,        warn: false },
          { label: 'On Track', value: onTrack,      warn: false, success: true },
          { label: 'At Risk',  value: atRisk,       warn: atRisk > 0 },
          { label: 'Avg',      value: `${avgProgress}%`, warn: false },
        ].map(({ label, value, warn, success }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : success && (value as number) > 0 ? 'var(--os-success-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : success && (value as number) > 0 ? '1px solid var(--os-success)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{
              fontSize: 16, fontWeight: 700, lineHeight: 1,
              color: warn ? 'var(--os-danger)' : success && (value as number) > 0 ? 'var(--os-success)' : 'var(--os-text-1)',
            }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {goals.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No enterprise goals defined</p>
      ) : (
        goals.slice(0, 5).map((g: any) => {
          const pct = Math.min(100, g.progress ?? 0)
          const col = goalColor(pct, g.status ?? '')
          return (
            <div key={g.goalId ?? g.domainId ?? g.kpi} style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              padding: '7px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: '1px solid var(--os-border-subtle)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g.kpi ?? g.label ?? 'Goal'}
                  </div>
                  {g.domainName && (
                    <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 1 }}>{g.domainName}</div>
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: col, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {pct}%
                </span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: 'var(--os-border)' }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: col, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export const GoalsWidget = withWidgetContext(Core)
