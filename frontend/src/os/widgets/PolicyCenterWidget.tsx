import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const EFFECT_COL: Record<string, string> = {
  ALLOW:            'var(--os-success)',
  DENY:             'var(--os-danger)',
  REQUIRE_APPROVAL: 'var(--os-warning)',
  NOTIFY:           'var(--os-blue)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const policies: any[] = Array.isArray(viewModel.kimmpPolicies) ? viewModel.kimmpPolicies : []
  const policyCount     = viewModel.kimmpPolicyCount ?? policies.length
  const peVerdict       = viewModel.peVerdict  ?? 'NO_DATA'
  const peSummary       = viewModel.peSummary  ?? null
  const peViolations    = viewModel.peViolations ?? false
  const compScore       = viewModel.complianceScore ?? 0
  const exposure: any[] = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []

  const restricting     = policies.filter((p: any) => p.effect === 'DENY' || p.effect === 'REQUIRE_APPROVAL')
  const domainsAtRisk   = exposure.filter((d: any) => d.breachedKpis?.length > 0)

  let peCol = 'var(--os-text-4)'
  if (peVerdict === 'PASS')     peCol = 'var(--os-success)'
  else if (peVerdict === 'WARN')     peCol = 'var(--os-warning)'
  else if (peVerdict === 'CRITICAL') peCol = 'var(--os-danger)'

  let scoreCol = 'var(--os-success)'
  if (compScore < 60) scoreCol = 'var(--os-danger)'
  else if (compScore < 80) scoreCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats header */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Active Policies', value: policyCount,              col: 'var(--os-text-1)'  },
          { label: 'Restricting',     value: restricting.length,       col: restricting.length > 0 ? 'var(--os-warning)' : 'var(--os-text-1)' },
          { label: 'Policy Engine',   value: peVerdict,                col: peCol               },
          { label: 'Compliance',      value: `${Math.round(compScore)}%`, col: scoreCol         },
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

      {/* AEGIS POLICY engine status */}
      {(peVerdict === 'WARN' || peVerdict === 'CRITICAL') && (
        <div style={{
          padding: '6px 10px', borderRadius: 6, fontSize: 10,
          background: peCol + '10', border: `1px solid ${peCol}33`,
          color: 'var(--os-text-2)',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: peCol, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 2 }}>
            AEGIS Policy Engine · {peVerdict}
          </span>
          {peSummary ? peSummary.slice(0, 80) : 'Policy violations detected — review active rules.'}
        </div>
      )}

      {/* Active policy rules */}
      {policies.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Policy Rules
          </div>
          {policies.slice(0, 4).map((p: any) => {
            const effCol = EFFECT_COL[p.effect] ?? 'var(--os-text-4)'
            return (
              <div key={p.id ?? p.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name ?? 'Policy'}
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{p.trigger}</span>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, flexShrink: 0,
                  padding: '2px 5px', borderRadius: 4,
                  background: effCol + '14', color: effCol, border: `1px solid ${effCol}33`,
                }}>{p.effect}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '8px 0' }}>
          No active policies compiled
        </div>
      )}

      {/* Domain policy health */}
      {domainsAtRisk.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-danger)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Policy Coverage Gaps · {domainsAtRisk.length} domain{domainsAtRisk.length !== 1 ? 's' : ''}
          </div>
          {domainsAtRisk.slice(0, 3).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '4px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1 }}>{d.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-danger)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {d.breachedKpis.length} breach{d.breachedKpis.length !== 1 ? 'es' : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const PolicyCenterWidget = withWidgetContext(Core)
