import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const STATUS_COLOR: Record<string, string> = { PROVISIONING: '#f59e0b', ACTIVE: '#10b981', SUSPENDED: '#ff5252' }
const REGIONS = ['US', 'UK', 'EU', 'INDIA']

export function DedicatedComputePage() {
  const qc = useQueryClient()
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [region, setRegion]                         = useState('US')
  const [sovereignty, setSovereignty]               = useState(false)

  const tenantsQ = useQuery({ queryKey: ['dedicated-tenants'], queryFn: () => api.get('/admin/kangqore-immp/enterprise/dedicated-compute').then(r => r.data), staleTime: 15_000 })
  const bpsQ     = useQuery({ queryKey: ['blueprints-compute'], queryFn: () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 30)), staleTime: 60_000 })

  const provisionMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/enterprise/dedicated-compute/provision', { customerId: selectedCustomerId, region, sovereigntyFlag: sovereignty }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dedicated-tenants'] }); setSelectedCustomerId('') },
  })
  const toggleMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/enterprise/dedicated-compute/${id}/toggle-single-tenant`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dedicated-tenants'] }),
  })

  const tenants: any[]   = tenantsQ.data?.tenants ?? []
  const active           = tenantsQ.data?.active   ?? 0
  const customers: any[] = bpsQ.data ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S185 · Enterprise Infrastructure</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Dedicated Compute</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Isolated DB per tenant · data sovereignty enforcement · single-tenant mode · dedicated WAANDA instance</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Instances', value: tenants.length,                                       color: '#e4e8f0' },
          { label: 'Active',          value: active,                                               color: '#10b981' },
          { label: 'Sovereignty ON',  value: tenants.filter((t: any) => t.sovereigntyFlag).length, color: '#4fc3f7' },
          { label: 'Single-Tenant',   value: tenants.filter((t: any) => t.singleTenantMode).length,color: '#a78bfa' },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 10, color: '#8899aa', marginTop: 4, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Tenant table */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
            Dedicated Instances
          </div>
          {tenants.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No dedicated instances provisioned yet.</div>
          ) : tenants.map((t: any) => (
            <div key={t.id} style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a40' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ccdde0' }}>{t.customerId.slice(0, 20)}…</div>
                  <div style={{ fontSize: 11, color: '#556', marginTop: 2 }}>
                    DB: {t.dbInstanceId?.slice(0, 20) ?? '—'} · WAANDA: {t.waandaInstanceId?.slice(0, 20) ?? '—'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${STATUS_COLOR[t.status]}18`, color: STATUS_COLOR[t.status] }}>{t.status}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: '#a78bfa18', color: '#a78bfa' }}>{t.region}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {t.sovereigntyFlag && <span style={{ fontSize: 10, fontWeight: 700, color: '#4fc3f7', background: '#4fc3f718', padding: '2px 7px', borderRadius: 5 }}>DATA SOVEREIGNTY</span>}
                <button onClick={() => toggleMut.mutate(t.id)} disabled={toggleMut.isPending}
                  style={{ background: t.singleTenantMode ? 'rgba(16,185,129,0.12)' : '#263250', border: `1px solid ${t.singleTenantMode ? 'rgba(16,185,129,0.3)' : '#3a4a60'}`, color: t.singleTenantMode ? '#10b981' : '#8899aa', padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                  Single-Tenant: {t.singleTenantMode ? 'ON' : 'OFF'}
                </button>
                {t.provisionedAt && <span style={{ fontSize: 11, color: '#556' }}>Provisioned {new Date(t.provisionedAt).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Provision form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Provision Instance</div>
            <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10 }}>
              <option value="">Select customer…</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
            </select>
            <select value={region} onChange={e => setRegion(e.target.value)}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10 }}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8899aa', marginBottom: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={sovereignty} onChange={e => setSovereignty(e.target.checked)} />
              Enable Data Sovereignty Flag
            </label>
            <button onClick={() => provisionMut.mutate()} disabled={!selectedCustomerId || provisionMut.isPending}
              style={{ width: '100%', background: '#4fc3f7', border: 'none', color: '#0d1824', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: provisionMut.isPending ? 0.7 : 1 }}>
              {provisionMut.isPending ? 'Provisioning…' : 'Provision Instance'}
            </button>
          </div>

          <div style={{ background: '#0d1824', border: '1px solid #263250', borderRadius: 12, padding: '18px 20px', fontSize: 12, color: '#8899aa', lineHeight: 1.7 }}>
            <div style={{ fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>What gets provisioned</div>
            {['Isolated PostgreSQL database instance', 'Dedicated WAANDA agent runtime', 'Region-locked data processing', 'Optional: GDPR DPA enforcement mode', 'KimmpSignal: ENTERPRISE_EVENT fired'].map(item => (
              <div key={item} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <span style={{ color: '#10b981' }}>→</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
