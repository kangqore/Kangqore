import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const briefings: any[] = Array.isArray(viewModel.systemBriefings) ? viewModel.systemBriefings : []
  const synthesis        = typeof viewModel.kimmSynthesis === 'string' ? viewModel.kimmSynthesis : null
  const kpis: any        = viewModel.financialKpis ?? null
  const top              = briefings[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* KIMMP synthesis */}
      {synthesis && (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 11, lineHeight: 1.55,
          background: 'var(--os-blue-dim)',
          border: '1px solid var(--os-blue)33',
          color: 'var(--os-text-3)',
        }}>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: 'var(--os-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            KIMMP · Revenue Intelligence
          </span>
          {synthesis.length > 200 ? synthesis.slice(0, 200) + '…' : synthesis}
        </div>
      )}

      {/* Top briefing recommendations */}
      {top && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {top.priority && (
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {top.priority} PRIORITY · {briefings.length} briefing{briefings.length !== 1 ? 's' : ''}
            </div>
          )}
          {(top.recommendations ?? []).slice(0, 3).map((r: string) => (
            <div key={r} style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: 'var(--os-surface-3)',
              border: '1px solid var(--os-border-subtle)',
              color: 'var(--os-text-2)',
            }}>
              <span style={{ color: 'var(--os-success)', marginRight: 4 }}>↗</span>
              {r}
            </div>
          ))}
        </div>
      )}

      {/* Revenue alerts */}
      {kpis && (kpis.overdueInvoices > 0 || kpis.pendingInvoices > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
          {kpis.overdueInvoices > 0 && (
            <div style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: 'var(--os-danger-dim)',
              border: '1px solid var(--os-danger)44',
              color: 'var(--os-danger)',
            }}>
              ⚠ {kpis.overdueInvoices} overdue invoice{kpis.overdueInvoices > 1 ? 's' : ''} require attention
            </div>
          )}
          {kpis.pendingInvoices > 0 && (
            <div style={{
              padding: '6px 10px', borderRadius: 6, fontSize: 11,
              background: 'var(--os-warning-dim)',
              border: '1px solid var(--os-warning)44',
              color: 'var(--os-warning)',
            }}>
              {kpis.pendingInvoices} pending invoice{kpis.pendingInvoices > 1 ? 's' : ''} awaiting payment
            </div>
          )}
        </div>
      )}

      {!synthesis && briefings.length === 0 && (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No intelligence briefings yet</p>
      )}
    </div>
  )
}

export const RevenueIntelligenceWidget = withWidgetContext(Core)
