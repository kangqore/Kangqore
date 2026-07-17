// Quotations Widget — Revenue Workspace
// Lead quote queue: prioritised leads with estimated value, scoring, and quick-action.

import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const SCORE_COLOR: Record<string, string> = {
  HIGH:   'var(--os-success)',
  MEDIUM: 'var(--os-warning)',
  LOW:    'var(--os-danger)',
}

const SOURCE_LABEL: Record<string, string> = {
  INBOUND:  'Inbound',
  OUTBOUND: 'Outbound',
  REFERRAL: 'Referral',
}

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const leads: any[] = Array.isArray(viewModel.prioritizedLeads) ? viewModel.prioritizedLeads : []
  const newCount     = viewModel.newLeadsCount        ?? 0
  const inProgress   = viewModel.inProgressLeadsCount ?? 0
  const totalLeads   = viewModel.totalLeadsCount      ?? leads.length
  const overdueInv   = viewModel.overdueInvoices      ?? 0

  const conversionPct = totalLeads > 0
    ? Math.round((inProgress / totalLeads) * 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'New',      value: newCount,    warn: false          },
          { label: 'Active',   value: inProgress,  warn: false          },
          { label: 'Overdue',  value: overdueInv,  warn: overdueInv > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Conversion rate bar */}
      {totalLeads > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
            <span>Pipeline conversion</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: conversionPct >= 30 ? 'var(--os-success)' : 'var(--os-warning)' }}>
              {conversionPct}%
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{ width: `${conversionPct}%`, height: '100%', borderRadius: 2,
              background: conversionPct >= 30 ? 'var(--os-success)' : 'var(--os-warning)', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* Quote queue */}
      {leads.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quote Queue</div>
          {leads.slice(0, 5).map((q: any) => {
            const scoreCol = SCORE_COLOR[q.scoreCategory] ?? 'var(--os-text-4)'
            return (
              <div key={q.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '6px 10px', borderRadius: 6,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.companyName ?? q.contactName ?? 'Lead'}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 1 }}>
                    <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{q.estimatedValue}</span>
                    {q.source && (
                      <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
                        · {SOURCE_LABEL[q.source] ?? q.source}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: scoreCol }}>{q.scoreCategory}</span>
                  <button onClick={() => onAction('review_quote', { id: q.id })} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                    background: 'var(--os-blue-dim)', color: 'var(--os-blue)', border: '1px solid var(--os-blue)44',
                  }}>Quote</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const QuotationsWidget = withWidgetContext(Core)
