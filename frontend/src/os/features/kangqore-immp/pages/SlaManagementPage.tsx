import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const P_COLOR: Record<string, string> = { P1: '#ff2255', P2: '#ff5252', P3: '#ffaa00', P4: '#f59e0b' }
const P_BREACH: Record<string, string> = { P1: '60 min', P2: '4 hr', P3: '24 hr', P4: '72 hr' }
const STATUS_COLOR: Record<string, string> = { OPEN: '#ff5252', INVESTIGATING: '#ffaa00', RESOLVED: '#10b981' }

export function SlaManagementPage() {
  const qc = useQueryClient()
  const [form, setForm]     = useState({ customerId: '', priority: 'P2', title: '', description: '' })
  const [commitForm, setCF] = useState({ customerId: '', uptimeTarget: 99.9 })

  const dashQ = useQuery({ queryKey: ['sla-dashboard'], queryFn: () => api.get('/admin/kangqore-immp/enterprise/sla/dashboard').then(r => r.data), staleTime: 15_000 })
  const bpsQ  = useQuery({ queryKey: ['blueprints-sla'], queryFn: () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 20)), staleTime: 60_000 })

  const incidentMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/enterprise/sla/incidents', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sla-dashboard'] }); setForm({ customerId: '', priority: 'P2', title: '', description: '' }) },
  })
  const resolveMut = useMutation({
    mutationFn: (id: string) => api.put(`/admin/kangqore-immp/enterprise/sla/incidents/${id}/resolve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sla-dashboard'] }),
  })
  const commitMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/enterprise/sla/commitments', commitForm),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sla-dashboard'] }); setCF({ customerId: '', uptimeTarget: 99.9 }) },
  })

  const incidents: any[]    = dashQ.data?.incidents    ?? []
  const commitments: any[]  = dashQ.data?.commitments  ?? []
  const summary             = dashQ.data?.summary      ?? { open: 0, breached: 0, p1Open: 0, totalCredits: 0, total: 0 }
  const customers: any[]    = bpsQ.data ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S186 · Enterprise Reliability</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>SLA Management</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>99.9% uptime commitment · P1–P4 incident tracking · credit automation · per-tenant SLA dashboard</p>
      </div>

      {/* SLA hero */}
      <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, padding: '20px 26px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981' }}>99.9%</div>
          <div style={{ fontSize: 10, color: '#8899aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Uptime SLA</div>
        </div>
        <div style={{ width: 1, height: 50, background: 'rgba(16,185,129,0.2)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, flex: 1 }}>
          {[
            { label: 'Active SLAs',      value: commitments.length, color: '#10b981' },
            { label: 'Open Incidents',   value: summary.open,       color: summary.open > 0 ? '#ff5252' : '#10b981' },
            { label: 'P1 Open',          value: summary.p1Open,     color: summary.p1Open > 0 ? '#ff2255' : '#10b981' },
            { label: 'Credits Issued',   value: `$${summary.totalCredits}`, color: '#f59e0b' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 10, color: '#8899aa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority SLA reference */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
        {(['P1','P2','P3','P4'] as const).map(p => (
          <div key={p} style={{ background: '#1a2235', border: `1px solid ${P_COLOR[p]}33`, borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: P_COLOR[p] }}>{p}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>Breach: {P_BREACH[p]}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Incident list */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #263250', fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase' }}>
            Incidents ({incidents.length})
          </div>
          {incidents.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#556', fontSize: 13 }}>No incidents logged. Use the form to create one.</div>
          ) : incidents.map((inc: any) => (
            <div key={inc.id} style={{ padding: '14px 20px', borderBottom: '1px solid #1e2a40' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 5, background: `${P_COLOR[inc.priority]}18`, color: P_COLOR[inc.priority] }}>{inc.priority}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ccdde0' }}>{inc.title}</div>
                  <div style={{ fontSize: 11, color: '#556', marginTop: 2 }}>{new Date(inc.startedAt).toLocaleString()}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${STATUS_COLOR[inc.status]}18`, color: STATUS_COLOR[inc.status] }}>{inc.status}</span>
              </div>
              {inc.slaBreached && (
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ff5252', marginBottom: 6 }}>
                  ⚠ SLA BREACHED{inc.creditApplied ? ` · ${inc.creditApplied}% credit applied` : ''}
                </div>
              )}
              {inc.durationMins != null && <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 6 }}>Duration: {inc.durationMins < 60 ? `${inc.durationMins}m` : `${(inc.durationMins/60).toFixed(1)}h`}</div>}
              {inc.status !== 'RESOLVED' && (
                <button onClick={() => resolveMut.mutate(inc.id)} disabled={resolveMut.isPending}
                  style={{ background: '#10b98122', border: '1px solid #10b98144', color: '#10b981', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Create incident */}
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Log Incident</div>
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8 }}>
              <option value="">Customer (optional)</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
            </select>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8 }}>
              {['P1','P2','P3','P4'].map(p => <option key={p} value={p}>{p} — {P_BREACH[p]} breach</option>)}
            </select>
            <input placeholder="Incident title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8, boxSizing: 'border-box' }} />
            <button onClick={() => incidentMut.mutate()} disabled={!form.title || incidentMut.isPending}
              style={{ width: '100%', background: '#ff525222', border: '1px solid #ff525244', color: '#ff5252', padding: '9px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: incidentMut.isPending ? 0.7 : 1 }}>
              {incidentMut.isPending ? 'Logging…' : 'Log Incident'}
            </button>
          </div>

          {/* Sign SLA */}
          <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Sign SLA Commitment</div>
            <select value={commitForm.customerId} onChange={e => setCF(f => ({ ...f, customerId: e.target.value }))}
              style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '8px 12px', borderRadius: 7, fontSize: 13, marginBottom: 8 }}>
              <option value="">Select customer…</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
            </select>
            <div style={{ fontSize: 12, color: '#8899aa', marginBottom: 14 }}>Uptime target: <strong style={{ color: '#10b981' }}>99.9%</strong> · Credits: 10%/breach</div>
            <button onClick={() => commitMut.mutate()} disabled={!commitForm.customerId || commitMut.isPending}
              style={{ width: '100%', background: '#10b98122', border: '1px solid #10b98144', color: '#10b981', padding: '9px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: commitMut.isPending ? 0.7 : 1 }}>
              {commitMut.isPending ? 'Signing…' : 'Sign SLA Commitment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
