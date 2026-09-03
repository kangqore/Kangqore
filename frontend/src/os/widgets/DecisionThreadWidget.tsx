import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  // KIMMP strategic decisions needing human review (selected === null)
  const openDecisions: any[]     = Array.isArray(viewModel.openDecisions)     ? viewModel.openDecisions     : []
  const resolvedDecisions: any[] = Array.isArray(viewModel.resolvedDecisions) ? viewModel.resolvedDecisions : []
  // HANUMANAS autonomy boundary decisions (L3+)
  const l3decisions: any[]       = Array.isArray(viewModel.pendingApprovals)  ? viewModel.pendingApprovals  : []
  const synthesis: string | null = viewModel.kimmSynthesis ?? null

  const openCount     = viewModel.openDecisionCount ?? openDecisions.length
  const resolvedCount = resolvedDecisions.length
  const l3Count       = l3decisions.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* KIMMP synthesis strip */}
      {synthesis && (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11, lineHeight: 1.5,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)33',
          color: 'var(--os-text-2)', fontStyle: 'italic',
        }}>
          <span style={{ color: 'var(--os-blue)', fontWeight: 700, fontStyle: 'normal', marginRight: 5 }}>KIMMP</span>
          {synthesis}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Open Threads', value: openCount,    warn: openCount > 0 },
          { label: 'Resolved',     value: resolvedCount, warn: false        },
          { label: 'L3+ HANUMANAS',   value: l3Count,       warn: l3Count > 0  },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* No decisions empty state */}
      {openDecisions.length === 0 && l3decisions.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>
          No open decision threads
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* KIMMP strategic decisions */}
          {openDecisions.length > 0 && (
            <>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                KIMMP · Awaiting Review
              </div>
              {openDecisions.slice(0, 3).map((d: any) => {
                const confPct    = Math.round((d.confidence ?? 0) * 100)
                const agentCount = Array.isArray(d.agentsMixed) ? d.agentsMixed.length : 0
                return (
                  <div key={d.id} style={{
                    padding: '7px 10px', borderRadius: 5,
                    background: 'var(--os-warning-dim, var(--os-surface-3))',
                    border: '1px solid var(--os-warning)33',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: 'var(--os-text-1)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {d.question}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 2, alignItems: 'center' }}>
                          {d.createdAt && (
                            <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{fmtDate(d.createdAt)}</span>
                          )}
                          {agentCount > 0 && (
                            <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{agentCount} agents</span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-warning)', fontVariantNumeric: 'tabular-nums' }}>{confPct}%</div>
                        <div style={{ fontSize: 8, color: 'var(--os-text-4)' }}>conf</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* HANUMANAS L3+ autonomy boundary */}
          {l3decisions.length > 0 && (
            <>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: openDecisions.length > 0 ? 4 : 0 }}>
                HANUMANAS · L3+ Boundary
              </div>
              {l3decisions.slice(0, 2).map((d: any) => (
                <div key={d.id} style={{
                  padding: '5px 10px', borderRadius: 5,
                  background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.description ?? d.actionType ?? 'Decision required'}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-warning)', flexShrink: 0 }}>
                    L{d.level}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export const DecisionThreadWidget = withWidgetContext(Core)
