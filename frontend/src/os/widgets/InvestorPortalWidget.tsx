import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtCurrency(n: number | null): string {
  if (n === null || n === undefined) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const oisScore: number | null     = viewModel.oisScore ?? null
  const arrValue: number | null     = viewModel.arrValue ?? null
  const revenueMTD: number | null   = viewModel.revenueMTD ?? null
  const pipelineValue: number | null = viewModel.pipelineValue ?? null
  const activeContracts: number | null = viewModel.activeContracts ?? null
  const mrrDeltaPct: number | null  = viewModel.mrrDeltaPct ?? null
  const portalHealthy: boolean      = viewModel.portalHealthy !== false
  const portalPath: string          = viewModel.investorPortalPath ?? '/kangqore-view/investor-portal'
  const confidence: number          = viewModel.confidence ?? 0
  const confPct                     = Math.round(confidence * 100)

  let oisCol = 'var(--os-warning)'
  if (oisScore !== null && oisScore >= 70) oisCol = 'var(--os-success)'
  else if (oisScore !== null && oisScore < 50) oisCol = 'var(--os-danger)'

  let confCol = 'var(--os-success)'
  if (confPct < 50) confCol = 'var(--os-danger)'
  else if (confPct < 75) confCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* OIS hero */}
      {oisScore !== null && (
        <div style={{
          padding: '10px 12px', borderRadius: 8,
          background: oisCol + '10', border: `1px solid ${oisCol}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
              Gate 8 · OIS Score
            </div>
            <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>
              Operational Intelligence Score
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: oisCol, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {oisScore.toFixed(1)}
            </div>
            <div style={{ fontSize: 8, color: 'var(--os-text-4)' }}>/ 100</div>
          </div>
        </div>
      )}

      {/* Financial stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'ARR',       value: fmtCurrency(arrValue)    },
          { label: 'MTD Rev',   value: fmtCurrency(revenueMTD)  },
          { label: 'Pipeline',  value: fmtCurrency(pipelineValue) },
          { label: 'Contracts', value: activeContracts ?? '—'   },
        ].map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* MRR delta + platform confidence */}
      <div style={{ display: 'flex', gap: 5 }}>
        {mrrDeltaPct !== null && (
          <div style={{
            flex: 1, padding: '6px 8px', borderRadius: 5,
            background: mrrDeltaPct >= 0 ? 'var(--os-success)10' : 'var(--os-danger)10',
            border: `1px solid ${mrrDeltaPct >= 0 ? 'var(--os-success)' : 'var(--os-danger)'}33`,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
              color: mrrDeltaPct >= 0 ? 'var(--os-success)' : 'var(--os-danger)',
            }}>
              {mrrDeltaPct >= 0 ? '+' : ''}{mrrDeltaPct.toFixed(1)}%
            </div>
            <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>MRR Δ</span>
          </div>
        )}
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 5,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: confCol, fontVariantNumeric: 'tabular-nums' }}>{confPct}%</div>
          <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>Platform Conf</span>
        </div>
      </div>

      {/* Platform confidence bar */}
      <div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${confPct}%`, height: '100%', borderRadius: 2, background: confCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Portal bridge */}
      <a
        href={portalPath}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', borderRadius: 5, textDecoration: 'none',
          background: portalHealthy ? 'var(--os-blue-dim)' : 'var(--os-surface-3)',
          border: portalHealthy ? '1px solid var(--os-blue)44' : '1px solid var(--os-border-subtle)',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, color: portalHealthy ? 'var(--os-blue)' : 'var(--os-text-4)' }}>
          Open Investor Portal
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: portalHealthy ? 'var(--os-success)' : 'var(--os-text-4)' }}>
          {portalHealthy ? 'LIVE →' : 'OFFLINE'}
        </span>
      </a>
    </div>
  )
}

export const InvestorPortalWidget = withWidgetContext(Core)
