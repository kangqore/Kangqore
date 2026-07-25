import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const TYPE_COLOR: Record<string, string> = { MSA: '#00ddaa', ORDER_FORM: '#4fc3f7', DPA: '#a78bfa', NDA: '#f59e0b', SOW: '#ff9800' }
const STATUS_COLOR: Record<string, string> = { DRAFT: '#8899aa', PENDING_SIGN: '#f59e0b', SIGNED: '#10b981', EXPIRED: '#ff5252', RENEWED: '#4fc3f7' }
const CONTRACT_TYPES = ['MSA', 'ORDER_FORM', 'DPA', 'NDA', 'SOW']

export function DigitalContractSuitePage() {
  const qc = useQueryClient()
  const [form, setForm]   = useState({ customerId: '', type: 'MSA', signatoryName: '', signatoryEmail: '' })
  const [selected, setSel] = useState<string | null>(null)

  const contractsQ = useQuery({ queryKey: ['contracts'], queryFn: () => api.get('/admin/kangqore-immp/enterprise/contracts').then(r => r.data), staleTime: 15_000 })
  const bpsQ       = useQuery({ queryKey: ['blueprints-contracts'], queryFn: () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 30)), staleTime: 60_000 })

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/enterprise/contracts', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contracts'] }); setForm({ customerId: '', type: 'MSA', signatoryName: '', signatoryEmail: '' }) },
  })
  const sendMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/enterprise/contracts/${id}/send-for-signing`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  })
  const signMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/enterprise/contracts/${id}/sign`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  })
  const renewMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/enterprise/contracts/${id}/renew`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contracts'] }),
  })

  const contracts: any[] = contractsQ.data?.contracts ?? []
  const signed           = contractsQ.data?.signed    ?? 0
  const byType           = contractsQ.data?.byType    ?? {}
  const customers        = bpsQ.data ?? []
  const selContract      = contracts.find((c: any) => c.id === selected)
  const clauses: any[]   = selContract?.clauses ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S189 · Digital Contract Suite</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Contract Management</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>MSA version control · e-sign integration · order form builder · renewal automation · GDPR/SOC2/DPA clause library</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 28 }}>
        {CONTRACT_TYPES.map(t => (
          <div key={t} style={{ background: '#1a2235', border: `1px solid ${TYPE_COLOR[t]}33`, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: TYPE_COLOR[t] }}>{byType[t] ?? 0}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8899aa', marginTop: 4, textTransform: 'uppercase', letterSpacing: .5 }}>{t.replace('_', ' ')}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Contract list */}
        <div>
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>Contracts ({contracts.length})</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{signed} Signed</span>
            </div>
            {contracts.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No contracts yet. Use the form to create one.</div>
            ) : contracts.map((c: any) => (
              <div key={c.id} onClick={() => setSel(c.id === selected ? null : c.id)}
                style={{ padding: '12px 20px', borderBottom: '1px solid #1e2a40', cursor: 'pointer', background: c.id === selected ? '#1e2d42' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 5, background: `${TYPE_COLOR[c.type]}18`, color: TYPE_COLOR[c.type] }}>{c.type.replace('_', ' ')}</span>
                  <span style={{ fontSize: 12, color: '#ccdde0', fontWeight: 600, flex: 1 }}>v{c.version} · {c.customerId.slice(0, 12)}…</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${STATUS_COLOR[c.status]}18`, color: STATUS_COLOR[c.status] }}>{c.status.replace('_', ' ')}</span>
                </div>
                {c.signatoryName && <div style={{ fontSize: 11, color: '#8899aa' }}>Signatory: {c.signatoryName}</div>}
                {c.signedAt && <div style={{ fontSize: 11, color: '#10b981' }}>Signed {new Date(c.signedAt).toLocaleDateString()}</div>}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {c.status === 'DRAFT' && (
                    <button onClick={e => { e.stopPropagation(); sendMut.mutate(c.id) }}
                      style={{ background: '#f59e0b22', border: '1px solid #f59e0b44', color: '#f59e0b', padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                      Send for Signing
                    </button>
                  )}
                  {c.status === 'PENDING_SIGN' && (
                    <button onClick={e => { e.stopPropagation(); signMut.mutate(c.id) }}
                      style={{ background: '#10b98122', border: '1px solid #10b98144', color: '#10b981', padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                      Sign
                    </button>
                  )}
                  {c.status === 'SIGNED' && (
                    <button onClick={e => { e.stopPropagation(); renewMut.mutate(c.id) }}
                      style={{ background: '#4fc3f722', border: '1px solid #4fc3f744', color: '#4fc3f7', padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
                      Renew
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Clause viewer */}
          {selContract && clauses.length > 0 && (
            <div style={{ marginTop: 16, background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
                {selContract.type} Clause Library
              </div>
              {clauses.map((cl: any) => (
                <div key={cl.id} style={{ padding: '12px 20px', borderBottom: '1px solid #1e2a40' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#a78bfa18', color: '#a78bfa' }}>{cl.category}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{cl.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.6 }}>{cl.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create form */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px', alignSelf: 'start' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>New Contract</div>
          <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8 }}>
            <option value="">Select customer…</option>
            {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
          </select>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8 }}>
            {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          <input placeholder="Signatory name" value={form.signatoryName} onChange={e => setForm(f => ({ ...f, signatoryName: e.target.value }))}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }} />
          <input placeholder="Signatory email" value={form.signatoryEmail} onChange={e => setForm(f => ({ ...f, signatoryEmail: e.target.value }))}
            style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 14, boxSizing: 'border-box' }} />
          <button onClick={() => createMut.mutate()} disabled={!form.customerId || createMut.isPending}
            style={{ width: '100%', background: '#00ddaa', border: 'none', color: '#0d1824', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: createMut.isPending ? 0.7 : 1 }}>
            {createMut.isPending ? 'Creating…' : 'Create Contract'}
          </button>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['MSA — Master Service Agreement (5 clauses: scope, GDPR, confidentiality, liability, SLA)', 'DPA — Data Processing Agreement (4 clauses: GDPR, sub-processors, deletion, SOC2)', 'ORDER_FORM — Subscription terms (3 clauses: tier, payment, auto-renewal)', 'NDA — Non-Disclosure Agreement (2 clauses)', 'SOW — Statement of Work (2 clauses: deliverables, timeline)'].map(line => (
              <div key={line} style={{ fontSize: 10, color: '#556', lineHeight: 1.5 }}>
                <span style={{ color: TYPE_COLOR[line.split(' — ')[0]] ?? '#8899aa', fontWeight: 700 }}>{line.split(' — ')[0]}</span>
                {' — ' + line.split(' — ')[1]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
