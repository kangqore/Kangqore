import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Plus, Edit2, Trash2, Globe2, TrendingUp, Activity, X, Check } from 'lucide-react'
import { adminApi } from '@lib/api'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CustomerDeployment {
  id:                 string
  customerName:       string
  industry:           string
  pack:               string
  goLiveAt:           string | null
  currentOis:         number
  coig:               number
  milestone:          string
  contactName:        string | null
  contactEmail:       string | null
  notes:              string | null
  createdAt:          string
}

// ─── Design tokens ─────────────────────────────────────────────────────────────

const CARD    = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const SURFACE = 'var(--os-surface-0)'

const GREEN  = '#22c55e'
const BLUE   = '#3b82f6'
const AMBER  = '#f59e0b'
const PURPLE = '#a855f7'
const TEAL   = '#14b8a6'
const RED    = '#ef4444'

const MILESTONE_COLOR: Record<string, string> = {
  ONBOARDING:  AMBER,
  LIVE:        GREEN,
  GROWING:     TEAL,
  MATURE:      BLUE,
  RENEWAL:     PURPLE,
  CHURNED:     RED,
}

const EMPTY_FORM = {
  customerName: '',
  industry:     '',
  pack:         'professional-services',
  milestone:    'ONBOARDING',
  contactName:  '',
  contactEmail: '',
  notes:        '',
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function DeploymentsPage() {
  const qc = useQueryClient()

  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [form,     setForm]     = useState({ ...EMPTY_FORM })

  const { data: deployments = [], isLoading } = useQuery<CustomerDeployment[]>({
    queryKey: ['customer-deployments'],
    queryFn:  () => adminApi('/admin/enterprise/deployments'),
    refetchInterval: 60_000,
  })

  const createMut = useMutation({
    mutationFn: (data: typeof EMPTY_FORM) => adminApi('/admin/enterprise/deployments', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customer-deployments'] }); setShowForm(false); setForm({ ...EMPTY_FORM }) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof EMPTY_FORM> }) =>
      adminApi(`/admin/enterprise/deployments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customer-deployments'] }); setEditId(null); setForm({ ...EMPTY_FORM }) },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/deployments/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customer-deployments'] }),
  })

  function startEdit(d: CustomerDeployment) {
    setEditId(d.id)
    setForm({
      customerName:  d.customerName,
      industry:      d.industry,
      pack:          d.pack,
      milestone:     d.milestone,
      contactName:   d.contactName ?? '',
      contactEmail:  d.contactEmail ?? '',
      notes:         d.notes ?? '',
    })
    setShowForm(true)
  }

  function submitForm() {
    if (!form.customerName.trim()) return
    if (editId) updateMut.mutate({ id: editId, data: form })
    else        createMut.mutate(form)
  }

  function cancelForm() {
    setShowForm(false); setEditId(null); setForm({ ...EMPTY_FORM })
  }

  // ── Summary stats ────────────────────────────────────────────────────────────
  const liveCount    = deployments.filter(d => d.milestone === 'LIVE' || d.milestone === 'GROWING' || d.milestone === 'MATURE').length
  const avgOis       = deployments.length > 0 ? deployments.reduce((s, d) => s + d.currentOis, 0) / deployments.length : 0
  const avgCoig      = deployments.length > 0 ? deployments.reduce((s, d) => s + d.coig, 0) / deployments.length : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: `${BLUE}15`, borderRadius: 10, padding: 8 }}>
          <Globe2 className="w-5 h-5" style={{ color: BLUE }} />
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT1, margin: 0 }}>Customer Deployments</h2>
          <p style={{ fontSize: 11, color: TEXT2, margin: 0 }}>
            Live enterprise deployments — OIS, COIG, and commercial milestones
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ ...EMPTY_FORM }) }}
          style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            background: BLUE, color: '#fff', border: 'none', borderRadius: 8,
            padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Add Deployment
        </button>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Total Deployments', value: deployments.length, icon: Building2, color: BLUE   },
          { label: 'Live Customers',    value: liveCount,           icon: Activity,  color: GREEN  },
          { label: 'Avg OIS Score',     value: avgOis.toFixed(1),   icon: TrendingUp,color: TEAL   },
        ].map(k => (
          <div key={k.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
              <span style={{ fontSize: 11, color: TEXT2 }}>{k.label}</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: TEXT1 }}>{k.value}</span>
          </div>
        ))}
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid ${BLUE}44`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>
              {editId ? 'Edit Deployment' : 'New Deployment'}
            </span>
            <button onClick={cancelForm} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: TEXT2 }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {([
              ['customerName', 'Customer Name', 'text'],
              ['industry',     'Industry',      'text'],
              ['pack',         'Pack',          'text'],
              ['contactName',  'Contact Name',  'text'],
              ['contactEmail', 'Contact Email', 'email'],
            ] as [string, string, string][]).map(([key, label, type]) => (
              <div key={key}>
                <label style={{ fontSize: 10, color: TEXT2, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
                  {label.toUpperCase()}
                </label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 6, padding: '7px 10px', fontSize: 12, color: TEXT1, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <div>
              <label style={{ fontSize: 10, color: TEXT2, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
                MILESTONE
              </label>
              <select
                value={form.milestone}
                onChange={e => setForm(f => ({ ...f, milestone: e.target.value }))}
                style={{
                  width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                  borderRadius: 6, padding: '7px 10px', fontSize: 12, color: TEXT1, outline: 'none',
                }}
              >
                {['ONBOARDING','LIVE','GROWING','MATURE','RENEWAL','CHURNED'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 10, color: TEXT2, fontWeight: 600, letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
              NOTES
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              style={{
                width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: 6, padding: '7px 10px', fontSize: 12, color: TEXT1, outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button
              onClick={submitForm}
              disabled={createMut.isPending || updateMut.isPending || !form.customerName.trim()}
              style={{
                background: BLUE, color: '#fff', border: 'none', borderRadius: 7,
                padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Check className="w-3.5 h-3.5" />
              {editId ? 'Save Changes' : 'Add Deployment'}
            </button>
            <button
              onClick={cancelForm}
              style={{
                background: SURFACE, color: TEXT2, border: `1px solid ${BORDER}`,
                borderRadius: 7, padding: '8px 14px', fontSize: 12, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Deployments table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        {isLoading && (
          <div style={{ padding: 24, fontSize: 12, color: TEXT2, textAlign: 'center' }}>Loading deployments…</div>
        )}
        {!isLoading && deployments.length === 0 && (
          <div style={{ padding: 32, fontSize: 13, color: TEXT2, textAlign: 'center' }}>
            No deployments yet. Add the first customer deployment above.
          </div>
        )}
        {!isLoading && deployments.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
                {['Customer', 'Industry', 'Pack', 'Milestone', 'OIS', 'COIG', 'Contact', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 600, color: TEXT2, textAlign: 'left', letterSpacing: 0.5 }}>
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deployments.map((d, i) => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: i < deployments.length - 1 ? `1px solid ${BORDER}` : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${BLUE}08`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: TEXT1 }}>{d.customerName}</div>
                    {d.goLiveAt && (
                      <div style={{ fontSize: 10, color: TEXT2, marginTop: 1 }}>
                        Live: {new Date(d.goLiveAt).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 11, color: TEXT2 }}>{d.industry || '—'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, background: `${PURPLE}15`, color: PURPLE,
                      padding: '3px 8px', borderRadius: 12,
                    }}>
                      {d.pack}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: `${MILESTONE_COLOR[d.milestone] ?? BORDER}20`,
                      color: MILESTONE_COLOR[d.milestone] ?? TEXT2,
                      padding: '3px 8px', borderRadius: 12,
                    }}>
                      {d.milestone}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: d.currentOis >= 70 ? GREEN : d.currentOis >= 50 ? AMBER : TEXT2 }}>
                    {d.currentOis.toFixed(1)}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: d.coig >= 60 ? GREEN : d.coig >= 40 ? AMBER : TEXT2 }}>
                    {d.coig.toFixed(1)}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {d.contactName
                      ? <div>
                          <div style={{ fontSize: 11, color: TEXT1 }}>{d.contactName}</div>
                          {d.contactEmail && <div style={{ fontSize: 10, color: TEXT2 }}>{d.contactEmail}</div>}
                        </div>
                      : <span style={{ fontSize: 11, color: TEXT2 }}>—</span>
                    }
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => startEdit(d)}
                        style={{
                          background: `${BLUE}15`, color: BLUE, border: 'none', borderRadius: 6,
                          padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        }}
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete deployment for ${d.customerName}?`)) deleteMut.mutate(d.id) }}
                        style={{
                          background: `${RED}15`, color: RED, border: 'none', borderRadius: 6,
                          padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Avg COIG callout */}
      {deployments.length > 0 && (
        <div style={{
          background: `${TEAL}10`, border: `1px solid ${TEAL}33`,
          borderRadius: 8, padding: '10px 16px', fontSize: 11, color: TEXT2,
        }}>
          <span style={{ color: TEAL, fontWeight: 600 }}>Fleet COIG average: {avgCoig.toFixed(1)}</span>
          {' '}— aggregate Commercial Operating Intelligence across all live deployments.
          Each deployment's COIG feeds back into the Kangqore global COIG north-star metric.
        </div>
      )}
    </div>
  )
}
