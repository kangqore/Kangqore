import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
  } catch { return iso }
}

function confColor(c: number): string {
  if (c >= 0.8) return 'var(--os-success)'
  if (c >= 0.55) return 'var(--os-warning)'
  return 'var(--os-danger)'
}

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const kimmpDecisions: any[] = Array.isArray(viewModel.kimmpDecisions) ? viewModel.kimmpDecisions : []
  const openCount: number     = viewModel.openKimmpCount     ?? kimmpDecisions.filter(d => !d.selected && !d.outcome).length
  const resolvedCount: number = viewModel.resolvedKimmpCount ?? kimmpDecisions.filter(d =>  d.selected ||  d.outcome).length
  const auditCount: number    = viewModel.auditCount         ?? 0

  // L3+ pending actions (HANUMANAS boundary) for the ledger header
  const l3plus: any[]         = Array.isArray(viewModel.l3PlusDecisions) ? viewModel.l3PlusDecisions : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Header stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Open',       value: openCount,     warn: openCount > 0     },
          { label: 'Resolved',   value: resolvedCount, warn: false             },
          { label: 'L3+ Pending',value: l3plus.length, warn: l3plus.length > 0 },
          { label: 'Audit Chain',value: auditCount,    warn: false             },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
              color: warn ? 'var(--os-warning)' : 'var(--os-text-1)' }}>
              {value}
            </div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* KIMMP decision ledger */}
      {kimmpDecisions.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>
          No KIMMP decisions recorded yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            KIMMP Decision Ledger · Immutable
          </div>
          {kimmpDecisions.slice(0, 5).map((d: any) => {
            const conf      = d.confidence ?? 0
            const col       = confColor(conf)
            const confPct   = Math.round(conf * 100)
            const isOpen    = !d.selected && !d.outcome
            const isResolved = !!d.selected || !!d.outcome

            let statusLabel = 'OPEN'
            let statusCol   = 'var(--os-warning)'
            if (d.outcome)   { statusLabel = 'OUTCOME'; statusCol = 'var(--os-blue)'    }
            else if (d.selected) { statusLabel = 'DECIDED'; statusCol = 'var(--os-success)' }

            return (
              <div key={d.id} style={{
                padding: '7px 10px', borderRadius: 6,
                background: isOpen ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
                border: isOpen ? '1px solid var(--os-warning)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 11, color: 'var(--os-text-1)', lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {d.question}
                    </div>

                    {/* Selected option */}
                    {d.selected && (
                      <div style={{ fontSize: 9, color: 'var(--os-success)', marginTop: 2 }}>
                        ↳ {d.selected}{d.selectedBy ? ` · by ${d.selectedBy}` : ''}
                      </div>
                    )}

                    {/* Outcome */}
                    {d.outcome && (
                      <div style={{ fontSize: 9, color: 'var(--os-blue)', marginTop: 2 }}>
                        ✓ {d.outcome.slice(0, 60)}
                      </div>
                    )}

                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                      <span style={{ fontSize: 8, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtDate(d.createdAt)}
                      </span>
                      {d.agentsMixed?.length > 0 && (
                        <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>
                          {d.agentsMixed.slice(0, 2).join(' · ')}
                          {d.agentsMixed.length > 2 ? ` +${d.agentsMixed.length - 2}` : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4,
                      background: statusCol + '1a', color: statusCol, border: `1px solid ${statusCol}33`,
                    }}>{statusLabel}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums' }}>
                      {confPct}%
                    </span>
                  </div>
                </div>

                {/* Confidence bar */}
                <div style={{ height: 2, borderRadius: 1, background: 'var(--os-border)', marginTop: 5 }}>
                  <div style={{ width: `${confPct}%`, height: '100%', borderRadius: 1, background: col }} />
                </div>
              </div>
            )
          })}

          {kimmpDecisions.length > 5 && (
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', textAlign: 'center' }}>
              +{kimmpDecisions.length - 5} more in ledger
            </div>
          )}
        </div>
      )}

      {/* L3+ HANUMANAS boundary decisions */}
      {l3plus.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-warning)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            HANUMANAS Boundary · L3+ Required
          </div>
          {l3plus.slice(0, 2).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-warning-dim, var(--os-surface-3))',
              border: '1px solid var(--os-warning)33',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.description ?? d.actionType ?? 'Action required'}
                </div>
                <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>L{d.level}</span>
              </div>
              <button
                onClick={() => onAction('decide', { id: d.id })}
                style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                  background: 'var(--os-warning-dim, var(--os-surface-3))', border: '1px solid var(--os-warning)55',
                  color: 'var(--os-warning)', flexShrink: 0,
                }}
              >
                Review →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const DecisionLedgerWidget = withWidgetContext(Core)
