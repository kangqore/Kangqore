// Lead Queue Widget — Revenue Workspace

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const SCORE_COLOR: Record<string, string> = {
  HIGH:   'var(--os-success)',
  MEDIUM: 'var(--os-warning)',
  LOW:    'var(--os-text-4)',
}

function relativeTime(iso: string): string {
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
  const leads: any[]    = Array.isArray(viewModel.prioritizedLeads) ? viewModel.prioritizedLeads : []
  const total: number   = viewModel.totalLeadsCount   ?? leads.length
  const newCnt: number  = viewModel.newLeadsCount     ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {total} lead{total !== 1 ? 's' : ''}
        </span>
        {newCnt > 0 && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
            background: 'var(--os-success-dim)', color: 'var(--os-success)',
            border: '1px solid var(--os-success)44',
          }}>
            {newCnt} NEW
          </span>
        )}
      </div>

      {leads.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No leads yet</p>
      ) : (
        leads.slice(0, 6).map((lead: any) => {
          const col = SCORE_COLOR[lead.scoreCategory] ?? 'var(--os-text-4)'
          return (
            <div
              key={lead.id}
              onClick={() => onAction('SELECT_LEAD', { leadId: lead.id })}
              style={{
                padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                background: 'var(--os-surface-3)',
                border: `1px solid ${lead.scoreCategory === 'HIGH' ? 'var(--os-success)33' : 'var(--os-border-subtle)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.companyName}
                  </div>
                  {lead.contactName && lead.contactName !== lead.companyName && (
                    <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 1 }}>{lead.contactName}</div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{lead.score}</span>
                  <span style={{ fontSize: 9, color: col, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lead.scoreCategory}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
                  {lead.source?.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
                  {lead.createdAt ? relativeTime(lead.createdAt) : ''}
                </span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export const LeadQueueWidget = withWidgetContext(Core)
