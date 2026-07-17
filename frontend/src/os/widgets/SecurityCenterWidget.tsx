import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtAge(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 1) return `${Math.floor(diff / 60_000)}m ago`
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  } catch { return '' }
}

const VERDICT_COL: Record<string, string> = {
  PASS:    'var(--os-success)',
  WARN:    'var(--os-warning)',
  CRITICAL:'var(--os-danger)',
  NO_DATA: 'var(--os-text-4)',
  UNKNOWN: 'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const shieldVerdict: string    = viewModel.shieldVerdict ?? 'UNKNOWN'
  const shieldSummary: string | null = viewModel.shieldSummary ?? null
  const shieldLastEvent: string | null = viewModel.shieldLastEvent ?? null
  const egressVerdict: string    = viewModel.egressVerdict ?? 'NO_DATA'
  const sovereignVerdict: string = viewModel.sovereignVerdict ?? 'NO_DATA'
  const critical24h: number      = viewModel.critical24h ?? 0
  const warn24h: number          = viewModel.warn24h ?? 0
  const deniedCount: number      = viewModel.deniedEventCount ?? 0
  const aegisHealth: number | null = viewModel.aegisHealthScore ?? null
  const shieldEvents: any[]      = Array.isArray(viewModel.recentShieldEvents) ? viewModel.recentShieldEvents : []

  const shieldCol    = VERDICT_COL[shieldVerdict]    ?? 'var(--os-text-4)'
  const egressCol    = VERDICT_COL[egressVerdict]    ?? 'var(--os-text-4)'
  const sovereignCol = VERDICT_COL[sovereignVerdict] ?? 'var(--os-text-4)'
  const statusOk     = viewModel.bootStatus === 'OPERATIONAL'

  let aegisValue: string | number = statusOk ? 'OK' : 'N/A'
  if (aegisHealth !== null) aegisValue = `${aegisHealth}%`
  let aegisCol = 'var(--os-text-4)'
  if (aegisHealth !== null) {
    if (aegisHealth >= 80) aegisCol = 'var(--os-success)'
    else if (aegisHealth >= 60) aegisCol = 'var(--os-warning)'
    else aegisCol = 'var(--os-danger)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* ACCESS_SENTINEL banner */}
      <div style={{
        padding: '7px 10px', borderRadius: 6,
        background: shieldCol + '10', border: `1px solid ${shieldCol}33`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: shieldCol, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ACCESS_SENTINEL · {shieldVerdict}
          </span>
          {shieldLastEvent && (
            <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{fmtAge(shieldLastEvent)}</span>
          )}
        </div>
        {shieldSummary && (
          <div style={{ fontSize: 9, color: 'var(--os-text-3)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shieldSummary}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Critical 24h', value: critical24h, col: critical24h > 0 ? 'var(--os-danger)' : 'var(--os-text-1)' },
          { label: 'Warns 24h',   value: warn24h,     col: warn24h > 0 ? 'var(--os-warning)' : 'var(--os-text-1)'  },
          { label: 'Denied',      value: deniedCount,  col: deniedCount > 0 ? 'var(--os-danger)' : 'var(--os-text-1)' },
          { label: 'AEGIS',       value: aegisValue,  col: aegisCol },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* EGRESS + SOVEREIGNTY verdicts */}
      <div style={{ display: 'flex', gap: 5 }}>
        {[
          { label: 'EGRESS_CONTROL',  verdict: egressVerdict,    col: egressCol    },
          { label: 'SOVEREIGNTY',      verdict: sovereignVerdict, col: sovereignCol },
        ].map(({ label, verdict, col }) => (
          <div key={label} style={{
            flex: 1, padding: '5px 8px', borderRadius: 5,
            background: col + '10', border: `1px solid ${col}33`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: col, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {verdict}
            </div>
            <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{label.replace('_', ' ')}</span>
          </div>
        ))}
      </div>

      {/* Recent shield events */}
      {shieldEvents.length === 0 && critical24h === 0 ? (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          No critical shield events in 24 hours
        </div>
      ) : shieldEvents.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Shield Events
          </div>
          {shieldEvents.slice(0, 3).map((e: any) => {
            const isCtrl = e.verdict === 'CRITICAL'
            return (
              <div key={e.id} style={{
                padding: '5px 10px', borderRadius: 5,
                background: isCtrl ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: isCtrl ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.description ?? e.eventType ?? 'Shield event'}
                  </span>
                  <span style={{ fontSize: 8, color: 'var(--os-text-4)', flexShrink: 0 }}>
                    {fmtAge(e.raisedAt)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export const SecurityCenterWidget = withWidgetContext(Core)
