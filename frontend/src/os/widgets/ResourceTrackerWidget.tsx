import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const leads: any[]    = Array.isArray(viewModel.leads)    ? viewModel.leads    : []
  const projects: any[] = Array.isArray(viewModel.projects) ? viewModel.projects : []
  const atRisk: number  = viewModel.atRiskCount ?? 0

  const maxLoad = leads.reduce((m: number, l: any) => Math.max(m, l.count), 1)
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((s: number, p: any) => s + (p.progress ?? 0), 0) / projects.length)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {[
          { label: 'Projects',  value: projects.length,  warn: false },
          { label: 'Leads',     value: leads.length,     warn: false },
          { label: 'Avg',       value: `${avgProgress}%`, warn: false },
          { label: 'At Risk',   value: atRisk,           warn: atRisk > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{
              fontSize: 17, fontWeight: 700, lineHeight: 1,
              color: warn ? 'var(--os-danger)' : 'var(--os-text-1)',
            }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {leads.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No leads assigned</p>
      ) : (
        leads.slice(0, 6).map((l: any) => (
          <div key={l.lead} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: '6px 10px', borderRadius: 6,
            background: 'var(--os-surface-3)',
            border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: 12, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {l.lead}
              </span>
              {l.atRisk > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 700, color: 'var(--os-danger)',
                  padding: '1px 4px', borderRadius: 3, display: 'inline-block',
                  background: 'var(--os-danger-dim)', marginTop: 2,
                }}>
                  {l.atRisk} at risk
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{
                width: 56, height: 4, borderRadius: 2,
                background: 'var(--os-border)',
              }}>
                <div style={{
                  width: `${Math.min(100, (l.count / maxLoad) * 100)}%`,
                  height: '100%', borderRadius: 2,
                  background: l.atRisk > 0 ? 'var(--os-warning)' : 'var(--os-blue)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--os-text-3)', minWidth: 18, textAlign: 'right' }}>
                {l.count}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export const ResourceTrackerWidget = withWidgetContext(Core)
