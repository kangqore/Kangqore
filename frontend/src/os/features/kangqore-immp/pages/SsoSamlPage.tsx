import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const PROVIDERS = [
  { id: 'OKTA',              label: 'Okta',             icon: '🔐', color: '#00b5e2' },
  { id: 'AZURE_AD',          label: 'Azure AD',          icon: '🔷', color: '#0078d4' },
  { id: 'GOOGLE_WORKSPACE',  label: 'Google Workspace',  icon: '🔵', color: '#4285f4' },
]
const EVENT_COLOR: Record<string, string> = { LOGIN: '#10b981', LOGOUT: '#8899aa', JIT_PROVISION: '#4fc3f7', ERROR: '#ff5252' }

export function SsoSamlPage() {
  const qc = useQueryClient()
  const [tab, setTab]           = useState<'configs' | 'audit'>('configs')
  const [form, setForm]         = useState({ customerId: '', provider: 'OKTA', entityId: '', ssoUrl: '', jitEnabled: true })
  const [simEmail, setSimEmail] = useState('')
  const [simCustomerId, setSimCustomerId] = useState('')
  const [simProvider, setSimProvider]     = useState('OKTA')
  const [simResult, setSimResult]         = useState<any>(null)
  const [simulating, setSimulating]       = useState(false)

  const cq  = useQuery({ queryKey: ['sso-configs'],    queryFn: () => api.get('/admin/kangqore-immp/enterprise/sso/configurations').then(r => r.data), staleTime: 15_000 })
  const aq  = useQuery({ queryKey: ['sso-audit'],      queryFn: () => api.get('/admin/kangqore-immp/enterprise/sso/audit-log').then(r => r.data),    staleTime: 15_000, enabled: tab === 'audit' })
  const bps = useQuery({ queryKey: ['blueprints-sso'], queryFn: () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 20)), staleTime: 60_000 })

  const createMut = useMutation({
    mutationFn: (data: typeof form) => api.post('/admin/kangqore-immp/enterprise/sso/configurations', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sso-configs'] }); setForm({ customerId: '', provider: 'OKTA', entityId: '', ssoUrl: '', jitEnabled: true }) },
  })
  const testMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/enterprise/sso/configurations/${id}/test`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sso-configs'] }),
  })

  const simulate = async () => {
    setSimulating(true); setSimResult(null)
    const r = await api.post('/admin/kangqore-immp/enterprise/sso/simulate-login', { customerId: simCustomerId, provider: simProvider, userEmail: simEmail }).catch((e: any) => ({ data: { error: e?.response?.data?.error || 'Failed' } }))
    setSimResult(r.data)
    setSimulating(false)
    qc.invalidateQueries({ queryKey: ['sso-audit'] })
  }

  const configs: any[]    = cq.data?.configs ?? []
  const events: any[]     = aq.data?.events  ?? []
  const customers: any[]  = bps.data ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S183 · Enterprise Auth</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>SSO / SAML 2.0</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Okta · Azure AD · Google Workspace · JIT provisioning · session management · audit log</p>
      </div>

      {/* Provider badges */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {PROVIDERS.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a2235', border: `1px solid ${p.color}33`, borderRadius: 10, padding: '10px 18px' }}>
            <span style={{ fontSize: 18 }}>{p.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.label}</span>
            <span style={{ fontSize: 11, color: '#8899aa', marginLeft: 4 }}>
              {configs.filter(c => c.provider === p.id && c.status === 'ACTIVE').length > 0 ? '● ACTIVE' : '○ inactive'}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #263250' }}>
        {(['configs', 'audit'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: tab === t ? '#00ddaa' : '#8899aa', borderBottom: tab === t ? '2px solid #00ddaa' : '2px solid transparent', marginBottom: -1 }}>
            {t === 'configs' ? 'Configurations' : 'Audit Log'}
          </button>
        ))}
      </div>

      {tab === 'configs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Config list */}
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
              Active Configurations ({configs.length})
            </div>
            {configs.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No SSO configurations yet.</div>
            ) : configs.map((c: any) => (
              <div key={c.id} style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ccdde0' }}>{PROVIDERS.find(p => p.id === c.provider)?.label ?? c.provider}</div>
                  <div style={{ fontSize: 11, color: '#556', marginTop: 2 }}>{c.customerId.slice(0, 16)}… · JIT: {c.jitEnabled ? 'ON' : 'OFF'}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: c.status === 'ACTIVE' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: c.status === 'ACTIVE' ? '#10b981' : '#f59e0b' }}>{c.status}</span>
                {c.status !== 'ACTIVE' && (
                  <button onClick={() => testMut.mutate(c.id)}
                    style={{ background: '#4fc3f722', border: '1px solid #4fc3f744', color: '#4fc3f7', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    Test
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Create config */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>New SSO Configuration</div>
              <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10 }}>
                <option value="">Select customer…</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
              </select>
              <select value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10 }}>
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <input placeholder="Entity ID (Issuer URL)" value={form.entityId} onChange={e => setForm(f => ({ ...f, entityId: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10, boxSizing: 'border-box' }} />
              <input placeholder="SSO URL (IdP Login URL)" value={form.ssoUrl} onChange={e => setForm(f => ({ ...f, ssoUrl: e.target.value }))}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10, boxSizing: 'border-box' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8899aa', marginBottom: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.jitEnabled} onChange={e => setForm(f => ({ ...f, jitEnabled: e.target.checked }))} />
                Enable JIT Provisioning
              </label>
              <button onClick={() => createMut.mutate(form)} disabled={!form.customerId || !form.entityId || !form.ssoUrl || createMut.isPending}
                style={{ width: '100%', background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: createMut.isPending ? 0.7 : 1 }}>
                {createMut.isPending ? 'Creating…' : 'Create Configuration'}
              </button>
            </div>

            {/* Simulate login */}
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Simulate SSO Login</div>
              <select value={simCustomerId} onChange={e => setSimCustomerId(e.target.value)}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10 }}>
                <option value="">Select customer…</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
              </select>
              <select value={simProvider} onChange={e => setSimProvider(e.target.value)}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10 }}>
                {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <input placeholder="User email (e.g. admin@acme.com)" value={simEmail} onChange={e => setSimEmail(e.target.value)}
                style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10, boxSizing: 'border-box' }} />
              <button onClick={simulate} disabled={simulating || !simCustomerId || !simEmail}
                style={{ width: '100%', background: '#4fc3f722', border: '1px solid #4fc3f744', color: '#4fc3f7', padding: '9px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: simulating ? 0.7 : 1 }}>
                {simulating ? 'Simulating…' : 'Simulate Login'}
              </button>
              {simResult && (
                <div style={{ marginTop: 12, background: '#0d1824', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: simResult.error ? '#ff5252' : '#00ddaa' }}>
                  {simResult.error ? simResult.error : `✓ ${simResult.event} · JIT: ${simResult.jitProvisioned ? 'provisioned' : 'skip'} · token: ${simResult.sessionToken?.slice(0, 20)}…`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
            Auth Events ({events.length})
          </div>
          {events.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No audit events yet. Simulate a login to generate entries.</div>
          ) : events.map((ev: any) => (
            <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid #1e2a40' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: EVENT_COLOR[ev.event] ?? '#556', display: 'inline-block', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#ccdde0', fontWeight: 600 }}>{ev.event.replace('_', ' ')} · {ev.provider}</div>
                <div style={{ fontSize: 11, color: '#556', marginTop: 2 }}>{ev.userId ?? 'system'} · {ev.ipAddress}</div>
              </div>
              <div style={{ fontSize: 11, color: '#556' }}>{new Date(ev.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
