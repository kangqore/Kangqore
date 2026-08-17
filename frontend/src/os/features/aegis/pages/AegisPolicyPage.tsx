import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Shield, AlertTriangle, XCircle, CheckCircle2, Info } from 'lucide-react'
import { api } from '@lib/api'

// ── Policy metadata (matches backend aegisPolicy.service.ts) ─────────────────

const POLICY_META: Record<string, {
  action: string; domain: string; verdict: 'DENY' | 'WARN' | 'ALLOW'
  description: string
}> = {
  ADMIN_ONLY_ACCESS: {
    action: 'ACCESS_KIMMP', domain: 'Access Sentinel', verdict: 'DENY',
    description: 'Any non-ADMIN role attempting to reach a KIMMP/WAANDA endpoint is immediately blocked. The request never proceeds.',
  },
  SCHEDULER_ONLY_AUTONOMOUS: {
    action: 'AUTONOMOUS_ACTIVATION', domain: 'Autonomy Boundary', verdict: 'WARN',
    description: 'Autonomous activations must originate from a known schedule or CRM event trigger. Anonymous callers attempting to trigger autonomous behaviour are flagged.',
  },
  CRITICAL_BRIEFING_MUST_LOG: {
    action: 'BRIEFING_PRODUCED', domain: 'Audit Ledger', verdict: 'ALLOW',
    description: 'CRITICAL-priority briefings are permitted but every one must be logged to the AEGIS audit ledger. Ensures full executive briefing traceability.',
  },
  RESTRICTED_ASSET_ADMIN_ONLY: {
    action: 'ASSET_ACCESS', domain: 'Intelligence Registry', verdict: 'DENY',
    description: 'RESTRICTED-classified intelligence assets may only be accessed by the ADMIN role. Any other role or unauthenticated access is blocked at the gate.',
  },
  EGRESS_MUST_BE_AUTHENTICATED: {
    action: 'INTELLIGENCE_EGRESS', domain: 'Egress Control', verdict: 'DENY',
    description: 'Intelligence leaving the system — briefings, signals, reports — requires a fully authenticated ADMIN session. Unauthenticated egress is hard-blocked.',
  },
  SENTINEL_AUTO_AUTHORITY: {
    action: 'AUTONOMOUS_CRITICAL', domain: 'Sovereignty', verdict: 'WARN',
    description: 'SENTINEL (the signals engine) has authority to emit CRITICAL alerts autonomously. Any other system attempting to do so is warned and logged for ADMIN review.',
  },
}

const SEV_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  CRITICAL: { color: '#ef4444', bg: '#ef44440e', icon: XCircle       },
  HIGH:     { color: '#f59e0b', bg: '#f59e0b0e', icon: AlertTriangle  },
  MODERATE: { color: '#eab308', bg: '#eab3080e', icon: AlertTriangle  },
  LOW:      { color: '#6b7280', bg: '#6b72800e', icon: Info           },
}

const VERDICT_CFG: Record<string, { label: string; color: string }> = {
  DENY:  { label: 'DENY',  color: '#ef4444' },
  WARN:  { label: 'WARN',  color: '#f59e0b' },
  ALLOW: { label: 'ALLOW', color: '#10b981' },
}

interface PolicyDef { id: string; name: string; severity: string }

export function AegisPolicyPage() {
  const [filter, setFilter] = useState<'all' | 'DENY' | 'WARN' | 'CRITICAL' | 'HIGH'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-policy'],
    queryFn:  () => api.get('/admin/aegis/policy/rules').then(r => r.data),
    staleTime: 300_000,
  })

  const policies: PolicyDef[] = data?.policies ?? []

  const filtered = policies.filter(p => {
    if (filter === 'DENY')     return POLICY_META[p.id]?.verdict === 'DENY'
    if (filter === 'WARN')     return POLICY_META[p.id]?.verdict === 'WARN'
    if (filter === 'CRITICAL') return p.severity === 'CRITICAL'
    if (filter === 'HIGH')     return p.severity === 'HIGH'
    return true
  })

  const denyCount     = policies.filter(p => POLICY_META[p.id]?.verdict === 'DENY').length
  const warnCount     = policies.filter(p => POLICY_META[p.id]?.verdict === 'WARN').length
  const criticalCount = policies.filter(p => p.severity === 'CRITICAL').length
  const highCount     = policies.filter(p => p.severity === 'HIGH').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Description banner */}
      <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Shield className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-cyan-300 mb-0.5">Policy Engine</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Governance rules evaluated <strong className="text-[var(--os-text-1)]">at runtime</strong> before any sensitive action proceeds.
            DENY policies block immediately and log a violation. WARN policies pass but raise a flag to the AEGIS audit ledger.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Policies',   value: policies.length, color: '#2564ea', bg: '#2564ea0e' },
          { label: 'DENY Policies',    value: denyCount,       color: '#ef4444', bg: '#ef44440e' },
          { label: 'WARN Policies',    value: warnCount,       color: '#f59e0b', bg: '#f59e0b0e' },
          { label: 'CRITICAL Severity',value: criticalCount,   color: '#ef4444', bg: '#ef44440e' },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.color}22`, borderLeft: `3px solid ${k.color}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.color, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {([
          { key: 'all',      label: `All (${policies.length})`,     color: '#2564ea' },
          { key: 'DENY',     label: `DENY (${denyCount})`,         color: '#ef4444' },
          { key: 'WARN',     label: `WARN (${warnCount})`,         color: '#f59e0b' },
          { key: 'CRITICAL', label: `CRITICAL (${criticalCount})`, color: '#ef4444' },
          { key: 'HIGH',     label: `HIGH (${highCount})`,         color: '#f59e0b' },
        ] as const).map(f => {
          const active = filter === f.key
          return (
            <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} style={{
              fontSize: 10, fontWeight: 700, padding: '4px 11px', borderRadius: 20,
              background: active ? f.color + '18' : 'var(--os-surface-3)',
              color: active ? f.color : '#6b7280',
              border: `1px solid ${active ? f.color + '40' : 'var(--os-border)'}`,
              cursor: 'pointer',
            }}>
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Policy cards */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ height: 100, background: 'var(--os-surface-0)', borderRadius: 12 }} className="animate-pulse" />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => {
            const sev     = SEV_CFG[p.severity] ?? SEV_CFG.LOW
            const meta    = POLICY_META[p.id]
            const verdict = meta ? VERDICT_CFG[meta.verdict] : VERDICT_CFG.ALLOW
            const SevIcon = sev.icon
            return (
              <div key={p.id} style={{
                background: 'var(--os-card)',
                border: `1px solid var(--os-border)`,
                borderLeft: `4px solid ${sev.color}`,
                borderRadius: 12,
                padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {/* Severity icon */}
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: sev.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <SevIcon style={{ width: 16, height: 16, color: sev.color }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>{p.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: verdict.color + '14', color: verdict.color, border: `1px solid ${verdict.color}28` }}>
                        {verdict.label}
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: sev.bg, color: sev.color, border: `1px solid ${sev.color}28` }}>
                        {p.severity}
                      </span>
                    </div>

                    {/* Description */}
                    {meta && (
                      <p style={{ fontSize: 11, color: 'var(--os-text-3)', lineHeight: 1.65, marginBottom: 10 }}>{meta.description}</p>
                    )}

                    {/* Meta row */}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280' }}>Policy ID</span>
                        <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--os-text-2)', marginTop: 2 }}>{p.id}</div>
                      </div>
                      {meta && (
                        <>
                          <div>
                            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280' }}>Action Guarded</span>
                            <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--os-text-2)', marginTop: 2 }}>{meta.action}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280' }}>Domain</span>
                            <div style={{ fontSize: 10, color: 'var(--os-text-2)', marginTop: 2 }}>{meta.domain}</div>
                          </div>
                        </>
                      )}
                      <div style={{ marginLeft: 'auto' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: '#10b98114', color: '#10b981', border: '1px solid #10b98128' }}>
                          <CheckCircle2 style={{ width: 9, height: 9, display: 'inline', marginRight: 3 }} />
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 10, color: '#6b7280', padding: '4px 0' }}>
        {policies.length} policies enforced · Runtime evaluation · All active
      </div>
    </div>
  )
}
