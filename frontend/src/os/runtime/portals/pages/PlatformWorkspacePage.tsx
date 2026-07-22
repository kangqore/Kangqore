import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  Server, Activity, GitBranch, CheckCircle2, XCircle, AlertCircle,
  Terminal, Package, Clock, ShieldCheck, TrendingUp, Cpu, Layers,
} from 'lucide-react'

const S: Record<string, React.CSSProperties> = {
  page:    { display: 'flex', flexDirection: 'column', gap: 24, padding: '4px 0' },
  grid3:   { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:    { background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 },
  cardH:   { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: 'var(--os-text-3)', textTransform: 'uppercase' as const },
  row:     { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 },
}

function statusDot(s: string | undefined) {
  const upper = (s ?? '').toUpperCase()
  if (['UP', 'OK', 'HEALTHY', 'PASS', 'ACTIVE', 'SUCCESS'].some(k => upper.includes(k)))
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--os-success)', flexShrink: 0 }} />
  if (['DEGRADED', 'WARN', 'PARTIAL'].some(k => upper.includes(k)))
    return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--os-warning)', flexShrink: 0 }} />
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--os-danger)', flexShrink: 0 }} />
}

function relDate(d: string): string {
  if (!d) return '—'
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  if (diff < 7) return `${diff}d ago`
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const PlatformWorkspacePage: React.FC = () => {
  const { data: sysHealth } = useQuery({
    queryKey: ['ws-plat-health'],
    queryFn: () => api.get('/admin/kangqore-immp/system-health').then(r => r.data).catch(() => null),
  })
  const { data: deployments } = useQuery({
    queryKey: ['ws-deployments'],
    queryFn: () => api.get('/admin/release/deployments?limit=10').then(r => r.data).catch(() => []),
  })
  const { data: gate5 } = useQuery({
    queryKey: ['ws-gate5'],
    queryFn: () => api.get('/admin/kangqore-immp/gate5').then(r => r.data).catch(() => null),
  })
  const { data: gate6 } = useQuery({
    queryKey: ['ws-gate6'],
    queryFn: () => api.get('/admin/kangqore-immp/gate6').then(r => r.data).catch(() => null),
  })
  const { data: readiness } = useQuery({
    queryKey: ['ws-plat-readiness'],
    queryFn: () => api.get('/admin/kangqore-immp/readiness').then(r => r.data).catch(() => null),
  })

  const deployList = Array.isArray(deployments) ? deployments : (deployments?.deployments ?? deployments?.data ?? [])
  const engines    = sysHealth?.engines ?? sysHealth?.services ?? {}
  const engineEntries = Object.entries(engines)

  const healthOk   = engineEntries.filter(([, v]: [string, any]) => ['UP','OK','HEALTHY','ACTIVE'].some(k => (v?.status ?? v ?? '').toString().toUpperCase().includes(k))).length
  const healthDown = engineEntries.filter(([, v]: [string, any]) => ['DOWN','ERROR','FAIL'].some(k => (v?.status ?? v ?? '').toString().toUpperCase().includes(k))).length

  return (
    <div style={S.page}>

      {/* ── System Health ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Server size={13} color="#579bfc" />
            <span style={S.cardH}>System Health</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ ...S.badge, background: 'var(--os-success)18', color: 'var(--os-success)' }}>{healthOk} UP</span>
            {healthDown > 0 && <span style={{ ...S.badge, background: 'var(--os-danger)18', color: 'var(--os-danger)' }}>{healthDown} DOWN</span>}
          </div>
        </div>

        {/* Overall metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { icon: Activity, label: 'OIS Score', val: sysHealth?.oisScore != null ? `${sysHealth.oisScore.toFixed(1)}` : '—', col: '#579bfc' },
            { icon: Cpu,      label: 'Active Agents', val: sysHealth?.activeAgents ?? sysHealth?.agentCount ?? '—', col: '#a78bfa' },
            { icon: TrendingUp, label: 'Agent Uptime', val: sysHealth?.agentHealth != null ? `${sysHealth.agentHealth}%` : '—', col: 'var(--os-success)' },
            { icon: Terminal, label: 'Active Missions', val: sysHealth?.activeMissions ?? '—', col: '#f59e0b' },
          ].map(m => (
            <div key={m.label} style={{ padding: '12px 10px', borderRadius: 8, background: m.col + '10', border: `1px solid ${m.col}22`, textAlign: 'center' }}>
              <m.icon size={14} color={m.col} style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 18, fontWeight: 800, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{String(m.val)}</div>
              <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Engine status grid */}
        {engineEntries.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {engineEntries.slice(0, 8).map(([name, val]: [string, any]) => {
              const st = val?.status ?? String(val ?? '')
              return (
                <div key={name} style={S.row}>
                  {statusDot(st)}
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>
                    {name.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--os-text-3)' }}>{st || '—'}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={S.grid2}>
        {/* ── Deploy Log ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GitBranch size={13} color="#10b981" />
            <span style={S.cardH}>Deploy Log</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {deployList.slice(0, 8).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No deployments</div>
            ) : deployList.slice(0, 8).map((d: any, i: number) => (
              <div key={d.id ?? i} style={S.row}>
                {statusDot(d.status)}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.version ?? d.tag ?? d.name ?? `Deploy #${i + 1}`}
                  </div>
                  {d.environment && (
                    <div style={{ fontSize: 9.5, color: 'var(--os-text-4)' }}>{d.environment}</div>
                  )}
                </div>
                <span style={{ ...S.badge, background: d.status === 'SUCCESS' ? 'var(--os-success)18' : d.status === 'FAILED' ? 'var(--os-danger)18' : 'var(--os-surface-3)', color: d.status === 'SUCCESS' ? 'var(--os-success)' : d.status === 'FAILED' ? 'var(--os-danger)' : 'var(--os-text-3)', flexShrink: 0 }}>
                  {d.status ?? '—'}
                </span>
                <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>
                  {relDate(d.deployedAt ?? d.createdAt ?? '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Version Registry (Gate 5 & 6) ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={13} color="#f59e0b" />
            <span style={S.cardH}>Version Registry</span>
          </div>

          {/* Gate 5 */}
          {gate5 && (
            <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)' }}>Gate 5 — Canvas Intelligence</span>
                <span style={{ ...S.badge, background: gate5.passed ? 'var(--os-success)18' : 'var(--os-warning)18', color: gate5.passed ? 'var(--os-success)' : 'var(--os-warning)' }}>
                  {gate5.passed ? 'PASSED' : 'PENDING'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {gate5.checks && Object.entries(gate5.checks).slice(0, 4).map(([k, v]: [string, any]) => (
                  <span key={k} style={{ fontSize: 10, color: v ? 'var(--os-success)' : 'var(--os-text-4)' }}>
                    {v ? '✓' : '○'} {k}
                  </span>
                ))}
              </div>
              {gate5.score != null && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, borderRadius: 4, background: 'var(--os-surface-3)' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${gate5.score}%`, background: '#579bfc' }} />
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 3 }}>Score: {gate5.score}%</div>
                </div>
              )}
            </div>
          )}

          {/* Gate 6 */}
          {gate6 && (
            <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)' }}>Gate 6 — RGS Framework</span>
                <span style={{ ...S.badge, background: gate6.passed ? 'var(--os-success)18' : 'var(--os-warning)18', color: gate6.passed ? 'var(--os-success)' : 'var(--os-warning)' }}>
                  {gate6.passed ? 'PASSED' : 'PENDING'}
                </span>
              </div>
              {gate6.score != null && (
                <div>
                  <div style={{ height: 4, borderRadius: 4, background: 'var(--os-surface-3)' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${gate6.score}%`, background: '#a78bfa' }} />
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 3 }}>Score: {gate6.score}%</div>
                </div>
              )}
            </div>
          )}

          {/* Readiness */}
          {readiness && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600 }}>PLATFORM READINESS</span>
              {Object.entries(readiness).filter(([, v]) => typeof v !== 'object').slice(0, 6).map(([k, v]: [string, any]) => (
                <div key={k} style={S.row}>
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: typeof v === 'boolean' ? (v ? 'var(--os-success)' : 'var(--os-danger)') : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>
                    {typeof v === 'boolean' ? (v ? '✓ Yes' : '✗ No') : String(v ?? '—')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
