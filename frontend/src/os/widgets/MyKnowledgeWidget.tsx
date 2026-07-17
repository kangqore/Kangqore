import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'var(--os-danger)',
  HIGH:     'var(--os-warning)',
  MEDIUM:   'var(--os-blue)',
  LOW:      'var(--os-text-4)',
  NORMAL:   'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const briefings: any[] = Array.isArray(viewModel.systemBriefings)
    ? viewModel.systemBriefings
    : Array.isArray(viewModel.briefings) ? viewModel.briefings : []

  const synthesis: string | null = viewModel.latestSynthesis ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {synthesis ? (
        <div style={{
          padding: '9px 11px', borderRadius: 6, fontSize: 11, lineHeight: 1.6,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          color: 'var(--os-text-2)',
        }}>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--os-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            KIMMP · Latest Synthesis
          </span>
          {synthesis.length > 200 ? synthesis.slice(0, 200) + '…' : synthesis}
        </div>
      ) : null}

      {briefings.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No briefings available yet</p>
      ) : (
        briefings.slice(0, 4).map((b: any) => {
          const col = PRIORITY_COLOR[b.priority] ?? 'var(--os-text-4)'
          const conf = Math.round((b.confidence ?? 0) * 100)
          return (
            <div key={b.id ?? b.summary} style={{
              padding: '7px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: `1px solid ${col}22`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.4,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {b.summary ?? b.title ?? 'Briefing'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                    background: col + '1a', color: col, border: `1px solid ${col}33`,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {b.priority ?? 'INFO'}
                  </span>
                  {conf > 0 && (
                    <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                      {conf}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export const MyKnowledgeWidget = withWidgetContext(Core)
