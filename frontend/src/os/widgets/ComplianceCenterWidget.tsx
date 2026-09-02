import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const FRAMEWORKS = ['ISO 27001', 'ISO 42001', 'SOC 2', 'GDPR', 'DPDP']

function fmtAge(iso: string | null): string {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  const h  = Math.floor(ms / 3_600_000)
  const m  = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ago`
  return `${m}m ago`
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const total: number          = viewModel.totalBreachedKpis  ?? 0
  const compScore: number      = viewModel.complianceTrustScore ?? viewModel.complianceScore ?? 0
  const scorePct               = Math.round(compScore)
  const verdict                = viewModel.shieldVerdict       ?? 'UNKNOWN'
  const tcVerdict: string      = viewModel.tcVerdict           ?? 'NO_DATA'
  const tcSummary: string|null = viewModel.tcSummary           ?? null
  const tcLastRun: string|null = viewModel.tcLastRun           ?? null

  let scoreCol = 'var(--os-success)'
  if (scorePct < 60) scoreCol = 'var(--os-danger)'
  else if (scorePct < 80) scoreCol = 'var(--os-warning)'

  let tcCol = 'var(--os-text-4)'
  if (tcVerdict === 'PASS')     tcCol = 'var(--os-success)'
  else if (tcVerdict === 'WARN')     tcCol = 'var(--os-warning)'
  else if (tcVerdict === 'CRITICAL') tcCol = 'var(--os-danger)'

  let verdictCol = 'var(--os-danger)'
  if (verdict === 'PASS') verdictCol = 'var(--os-success)'
  else if (verdict === 'WARN') verdictCol = 'var(--os-warning)'

  // Framework status: derive from trust compliance posture
  let frameworkStatus = 'GOVERNED'
  let frameworkCol    = 'var(--os-success)'
  if (tcVerdict === 'CRITICAL') { frameworkStatus = 'AT RISK';  frameworkCol = 'var(--os-danger)'  }
  else if (tcVerdict === 'WARN') { frameworkStatus = 'PARTIAL'; frameworkCol = 'var(--os-warning)' }
  else if (tcVerdict === 'NO_DATA') { frameworkStatus = 'PENDING'; frameworkCol = 'var(--os-text-4)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats header */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Trust Score',  value: `${scorePct}%`, col: scoreCol  },
          { label: 'KPI Breaches', value: total,          col: total > 0 ? 'var(--os-danger)' : 'var(--os-success)' },
          { label: 'HANUMANAS',        value: verdict,        col: verdictCol },
          { label: 'TC Engine',    value: tcVerdict,      col: tcCol      },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: col }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Trust compliance score bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 4 }}>
          <span>Compliance Trust Score</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: scoreCol }}>{scorePct}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${scorePct}%`, height: '100%', borderRadius: 2, background: scoreCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* TRUST_COMPLIANCE engine banner */}
      <div style={{
        padding: '7px 10px', borderRadius: 6,
        background: tcCol + '10', border: `1px solid ${tcCol}33`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: tcSummary ? 4 : 0 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: tcCol, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            TRUST COMPLIANCE ENGINE
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
              background: tcCol + '1a', color: tcCol, border: `1px solid ${tcCol}33`,
            }}>{tcVerdict}</span>
            <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{fmtAge(tcLastRun)}</span>
          </div>
        </div>
        {tcSummary && (
          <div style={{ fontSize: 10, color: 'var(--os-text-3)', lineHeight: 1.4 }}>
            {tcSummary.slice(0, 90)}
          </div>
        )}
      </div>

      {/* Framework coverage rows */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
          Framework Coverage · HANUMANAS Monitored
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {FRAMEWORKS.map(fw => (
            <div key={fw} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '4px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{fw}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                background: frameworkCol + '14', color: frameworkCol, border: `1px solid ${frameworkCol}33`,
              }}>{frameworkStatus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const ComplianceCenterWidget = withWidgetContext(Core)
