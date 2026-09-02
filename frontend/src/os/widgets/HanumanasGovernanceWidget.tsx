import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const ENGINE_LABELS: Record<string, string> = {
  GOVERNANCE_OPS:       'Gov Ops',
  SOVEREIGNTY:          'Sovrnty',
  AUDIT_LEDGER:         'Audit',
  AUTONOMY_BOUNDARY:    'Autonomy',
  ACCESS_SENTINEL:      'Access',
  INTELLIGENCE_REGISTRY:'Intel',
  EGRESS_CONTROL:       'Egress',
  POLICY:               'Policy',
  TRUST_COMPLIANCE:     'Trust',
  RISK_INTELLIGENCE:    'Risk',
}

function verdictColor(v: string): string {
  if (v === 'PASS')     return 'var(--os-success)'
  if (v === 'WARN')     return 'var(--os-warning)'
  if (v === 'CRITICAL') return 'var(--os-danger)'
  return 'var(--os-text-4)'
}

function fmtAge(iso: string | null): string {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  const h  = Math.floor(ms / 3_600_000)
  const m  = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ago`
  return `${m}m ago`
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const rawEngines      = viewModel.engineSummaries ?? viewModel.engines
  const engines: any[]  = Array.isArray(rawEngines) ? rawEngines : []
  const healthScore     = viewModel.hanumanasHealth ?? viewModel.shieldHealthScore ?? null
  const shieldVerdict   = viewModel.shieldVerdict ?? 'UNKNOWN'
  const critical24h     = viewModel.totalCritical ?? viewModel.critical24h ?? 0
  const warn24h         = viewModel.totalWarns   ?? viewModel.warn24h ?? 0
  const autonomy: any[] = Array.isArray(viewModel.autonomyEvents) ? viewModel.autonomyEvents : []

  const verdictCol = verdictColor(shieldVerdict)
  const hs = healthScore ?? 100
  let healthCol = 'var(--os-danger)'
  if (hs >= 80) healthCol = 'var(--os-success)'
  else if (hs >= 60) healthCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Hero row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'HANUMANAS Shield',  value: shieldVerdict, col: verdictCol },
          { label: 'Health Score',  value: healthScore !== null ? `${healthScore}%` : '—', col: healthCol },
          { label: 'Critical 24h',  value: critical24h, col: critical24h > 0 ? 'var(--os-danger)' : 'var(--os-text-1)' },
          { label: 'Warns 24h',     value: warn24h,     col: warn24h > 0 ? 'var(--os-warning)' : 'var(--os-text-1)' },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* 10-engine health grid */}
      {engines.length > 0 && (
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
            Engine Corps · {engines.length} engines
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
            {engines.map((e: any) => {
              const v   = e.verdict ?? 'NO_DATA'
              const col = verdictColor(v)
              const lbl = ENGINE_LABELS[e.engine] ?? e.engine.slice(0, 8)
              const age = fmtAge(e.raisedAt ?? null)
              return (
                <div
                  key={e.engine}
                  title={`${e.engine} · ${v} · ${age}${e.summary ? '\n' + e.summary : ''}`}
                  style={{
                    padding: '5px 4px', borderRadius: 5, textAlign: 'center',
                    background: col + '12',
                    border: `1px solid ${col}44`,
                  }}
                >
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: col, margin: '0 auto 3px',
                  }} />
                  <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--os-text-2)', lineHeight: 1.2 }}>
                    {lbl}
                  </div>
                  <div style={{ fontSize: 7, color: 'var(--os-text-4)', marginTop: 1 }}>{age}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CRITICAL engine alerts */}
      {engines.filter((e: any) => e.verdict === 'CRITICAL' || e.verdict === 'WARN').length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Active Alerts
          </div>
          {engines
            .filter((e: any) => e.verdict === 'CRITICAL' || e.verdict === 'WARN')
            .slice(0, 3)
            .map((e: any) => {
              const col = verdictColor(e.verdict)
              return (
                <div key={e.engine} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
                  padding: '5px 10px', borderRadius: 5,
                  background: col + '10', border: `1px solid ${col}33`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)' }}>
                      {ENGINE_LABELS[e.engine] ?? e.engine}
                    </span>
                    {e.summary && (
                      <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginLeft: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.summary.slice(0, 40)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: col, flexShrink: 0 }}>{e.verdict}</span>
                </div>
              )
            })}
        </div>
      )}

      {/* Autonomy log */}
      {autonomy.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Autonomy Boundary Log
          </div>
          {autonomy.slice(0, 2).map((e: any) => (
            <div key={e.id} style={{
              padding: '5px 10px', borderRadius: 5, fontSize: 10, color: 'var(--os-text-3)',
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {e.description ?? e.eventType ?? 'Autonomy event'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const HanumanasGovernanceWidget = withWidgetContext(Core)
