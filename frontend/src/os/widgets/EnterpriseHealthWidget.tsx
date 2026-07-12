import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const GRADE_COLOR: Record<string, string> = {
  A: 'var(--os-success)',
  B: 'var(--os-success)',
  C: 'var(--os-warning)',
  D: 'var(--os-danger)',
  F: 'var(--os-danger)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const health: any             = viewModel.platformHealth ?? {}
  const oisScore: number | null = viewModel.oisScore       ?? null
  const grade: string | null    = viewModel.grade          ?? null
  const pillars: any[]          = Array.isArray(viewModel.oisPillars) ? viewModel.oisPillars : []
  const domains: any[]          = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : []
  const pct: number             = health.healthPercent ?? 0
  const gradeColor              = grade ? (GRADE_COLOR[grade] ?? 'var(--os-text-4)') : 'var(--os-cyan)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* OIS / health hero */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 8,
        background: gradeColor + '12',
        border: `1px solid ${gradeColor}44`,
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: gradeColor, fontVariantNumeric: 'tabular-nums' }}>
            {oisScore != null ? oisScore.toFixed(1) : pct.toFixed(0)}
          </div>
          <div style={{ fontSize: 9, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
            {oisScore != null ? 'OIS Score' : 'Health %'}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {grade && (
            <div style={{ fontSize: 22, fontWeight: 800, color: gradeColor, lineHeight: 1 }}>
              Grade {grade}
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: grade ? 3 : 0 }}>
            {health.readyDomains ?? 0}/{health.totalDomains ?? 0} domains operational
          </div>
          {oisScore == null && (
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>Gate 8 computing…</div>
          )}
        </div>
      </div>

      {/* Pillar bars — when Gate 8 is available */}
      {pillars.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {pillars.map((p: any) => {
            const col = p.score >= 75 ? 'var(--os-success)' : p.score >= 55 ? 'var(--os-warning)' : 'var(--os-danger)'
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--os-text-4)', width: 66, flexShrink: 0 }}>{p.label}</span>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
                  <div style={{ width: `${p.score}%`, height: '100%', borderRadius: 2, background: col, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: col, width: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {p.score.toFixed(0)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Domain pills — fallback when Gate 8 not available */}
      {pillars.length === 0 && domains.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {domains.slice(0, 6).map((d: any) => (
            <span key={d.id} style={{
              fontSize: 10, padding: '3px 8px', borderRadius: 4,
              background: d.ready ? 'var(--os-success-dim)' : 'var(--os-danger-dim)',
              color: d.ready ? 'var(--os-success)' : 'var(--os-danger)',
              border: `1px solid ${d.ready ? 'var(--os-success)44' : 'var(--os-danger)44'}`,
            }}>
              {d.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export const EnterpriseHealthWidget = withWidgetContext(Core)
