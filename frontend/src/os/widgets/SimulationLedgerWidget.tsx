import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const verdictCol: Record<string, string> = {
  PASS:     'var(--os-success)',
  WARN:     'var(--os-warning)',
  CRITICAL: 'var(--os-danger)',
  BLOCK:    'var(--os-danger)',
  NO_DATA:  'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const compScore: number  = viewModel.complianceScore      ?? 100
  const trustScore: number = viewModel.complianceTrustScore ?? compScore
  const tcVerdict: string  = viewModel.tcVerdict            ?? 'NO_DATA'
  const tcSummary: string  = viewModel.tcSummary            ?? ''
  const riVerdict: string  = viewModel.riVerdict            ?? 'NO_DATA'
  const riSummary: string  = viewModel.riSummary            ?? ''
  const peVerdict: string  = viewModel.peVerdict            ?? 'NO_DATA'
  const peSummary: string  = viewModel.peSummary            ?? ''
  const auditCount: number = viewModel.auditCount           ?? 0
  const auditTrail: any[]  = Array.isArray(viewModel.auditTrail) ? viewModel.auditTrail : []

  const trustCol  = trustScore >= 80 ? 'var(--os-success)' : trustScore >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'
  const scoreCol  = compScore  >= 80 ? 'var(--os-success)' : compScore  >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'

  const engines = [
    { label: 'Trust Compliance', verdict: tcVerdict, summary: tcSummary },
    { label: 'Risk Intelligence', verdict: riVerdict, summary: riSummary },
    { label: 'Policy Engine',     verdict: peVerdict, summary: peSummary },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Compliance',   value: `${compScore}%`,  col: scoreCol  },
          { label: 'Trust Score',  value: `${trustScore}%`, col: trustCol  },
          { label: 'Audit Records',value: auditCount,        col: 'var(--os-text-1)' },
          { label: 'TC Verdict',   value: tcVerdict,         col: verdictCol[tcVerdict] ?? 'var(--os-text-4)' },
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

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
          <span>Compliance trust score</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: trustCol }}>{trustScore}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${Math.min(100, trustScore)}%`, height: '100%', borderRadius: 2, background: trustCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AEGIS Engine Verdicts</div>
        {engines.map(({ label, verdict, summary }) => {
          const col = verdictCol[verdict] ?? 'var(--os-text-4)'
          return (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: verdict === 'CRITICAL' || verdict === 'BLOCK' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
              border: verdict === 'CRITICAL' || verdict === 'BLOCK' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {summary || label}
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: col, flexShrink: 0 }}>{verdict}</span>
            </div>
          )
        })}
      </div>

      {auditTrail.length > 0 && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--os-text-3)' }}>Latest audit</span>
          <span style={{ fontWeight: 600, color: 'var(--os-text-2)', maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {auditTrail[0]?.action ?? auditTrail[0]?.event ?? '—'}
          </span>
        </div>
      )}
    </div>
  )
}

export const SimulationLedgerWidget = withWidgetContext(Core)
