import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const DNS_COLOR: Record<string, string>  = { PENDING: '#f59e0b', VERIFYING: '#4fc3f7', VERIFIED: '#10b981', FAILED: '#ff5252' }
const SSL_COLOR: Record<string, string>  = { PENDING: '#f59e0b', PROVISIONING: '#4fc3f7', ACTIVE: '#10b981', FAILED: '#ff5252' }

export function CustomDomainsPage() {
  const qc = useQueryClient()
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [customDomain, setCustomDomain]             = useState('')

  const domainsQ = useQuery({ queryKey: ['enterprise-domains'], queryFn: () => api.get('/admin/kangqore-immp/enterprise/domains').then(r => r.data), staleTime: 15_000 })
  const bpsQ     = useQuery({ queryKey: ['blueprints-domains'], queryFn: () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 30)), staleTime: 60_000 })

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/enterprise/domains', { customerId: selectedCustomerId, customDomain: customDomain || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['enterprise-domains'] }); setSelectedCustomerId(''); setCustomDomain('') },
  })
  const dnsMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/enterprise/domains/${id}/validate-dns`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-domains'] }),
  })
  const sslMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/enterprise/domains/${id}/provision-ssl`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-domains'] }),
  })

  const domains: any[]    = domainsQ.data?.domains   ?? []
  const active            = domainsQ.data?.active     ?? 0
  const customers: any[]  = bpsQ.data ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S184 · White-Label Infrastructure</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Custom Domains</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>White-label URLs per enterprise tenant · SSL automation · DNS validation</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Domains',   value: domains.length, color: '#e4e8f0' },
          { label: 'Fully Active',    value: active,         color: '#10b981' },
          { label: 'Pending',         value: domains.length - active, color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Domain list */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
            Domain Registry
          </div>
          {domains.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No domains provisioned yet. Use the form to add the first one.</div>
          ) : domains.map((d: any) => (
            <div key={d.id} style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a40' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ccdde0' }}>{d.subdomain}</div>
                  {d.customDomain && (
                    <div style={{ fontSize: 12, color: '#00ddaa', marginTop: 2 }}>→ {d.customDomain}</div>
                  )}
                  <div style={{ fontSize: 11, color: '#556', marginTop: 2 }}>{d.customerId.slice(0, 16)}…</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${DNS_COLOR[d.dnsStatus]}18`, color: DNS_COLOR[d.dnsStatus] }}>DNS: {d.dnsStatus}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${SSL_COLOR[d.sslStatus]}18`, color: SSL_COLOR[d.sslStatus] }}>SSL: {d.sslStatus}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {d.dnsStatus !== 'VERIFIED' && (
                  <button onClick={() => dnsMut.mutate(d.id)} disabled={dnsMut.isPending}
                    style={{ background: '#f59e0b22', border: '1px solid #f59e0b44', color: '#f59e0b', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    Validate DNS
                  </button>
                )}
                {d.dnsStatus === 'VERIFIED' && d.sslStatus !== 'ACTIVE' && (
                  <button onClick={() => sslMut.mutate(d.id)} disabled={sslMut.isPending}
                    style={{ background: '#00ddaa22', border: '1px solid #00ddaa44', color: '#00ddaa', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    Provision SSL
                  </button>
                )}
                {d.sslStatus === 'ACTIVE' && d.dnsStatus === 'VERIFIED' && (
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>✓ Fully Active</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Provision form */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px', alignSelf: 'start' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>Provision Domain</div>
          <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 10 }}>
            <option value="">Select customer…</option>
            {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
          </select>
          <input placeholder="Custom domain (optional, e.g. intelligence.acme.com)" value={customDomain} onChange={e => setCustomDomain(e.target.value)}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 14, boxSizing: 'border-box' }} />
          <button onClick={() => createMut.mutate()} disabled={!selectedCustomerId || createMut.isPending}
            style={{ width: '100%', background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: createMut.isPending ? 0.7 : 1 }}>
            {createMut.isPending ? 'Provisioning…' : 'Provision Domain'}
          </button>

          <div style={{ marginTop: 20, background: '#0d1824', borderRadius: 8, padding: '14px 16px', fontSize: 12, lineHeight: 1.6, color: '#8899aa' }}>
            <div style={{ fontWeight: 700, color: '#4fc3f7', marginBottom: 6 }}>Provisioning flow</div>
            <div>1. Kangqore subdomain auto-assigned (slug.kangqore.io)</div>
            <div style={{ marginTop: 4 }}>2. DNS validation — customer adds CNAME record</div>
            <div style={{ marginTop: 4 }}>3. SSL cert auto-issued via Let's Encrypt</div>
            <div style={{ marginTop: 4 }}>4. Custom domain goes live end-to-end</div>
          </div>
        </div>
      </div>
    </div>
  )
}
