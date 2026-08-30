import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BarChart3, CheckCircle2, XCircle, Zap, Plus } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GRN  = '#10b981'
const BLUE = '#579bfc'
const PURP = '#7c3aed'
const AMB  = '#f59e0b'
const RED  = '#ef4444'

interface TenantAccuracy {
  tenantId:             string
  gen2AccuracyPct:      number | null
  gen1AccuracyPct:      number | null
  gen2SampleSize:       number
  qualifiesForLiveRouting: boolean
}

interface AccuracySummary {
  tenants:      TenantAccuracy[]
  totalRecords: number
}

function AccuracyBar({ pct, color, label }: { pct: number | null; color: string; label: string }) {
  const val = pct ?? 0
  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: 9, fontWeight: 700, color: T2, width: 36, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: SURF, overflow: 'hidden' }}>
        <div style={{ width: `${val}%`, height: '100%', background: color, borderRadius: 3, transition: 'width .5s ease' }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, color, minWidth: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {pct != null ? `${pct}%` : '—'}
      </span>
    </div>
  )
}

export function Gen2AccuracyPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ tenantId: '', provider: 'gen2', isAccurate: true, ratingComment: '' })

  const { data, isLoading } = useQuery<AccuracySummary>({
    queryKey: ['gen2-accuracy'],
    queryFn:  () => api.get('/admin/kangqore-immp/gen2/accuracy').then(r => r.data),
    staleTime: 30_000,
  })

  const submit = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen2/accuracy', {
      tenantId:      form.tenantId.trim(),
      provider:      form.provider,
      isAccurate:    form.isAccurate,
      ratingComment: form.ratingComment.trim() || undefined,
    }),
    onSuccess: () => {
      setShowForm(false)
      setForm({ tenantId: '', provider: 'gen2', isAccurate: true, ratingComment: '' })
      qc.invalidateQueries({ queryKey: ['gen2-accuracy'] })
    },
  })

  const tenants = data?.tenants ?? []
  const qualified = tenants.filter(t => t.qualifiesForLiveRouting).length

  return (
    <div className="space-y-5 max-w-4xl">

      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(87,155,252,0.1)', border: '1px solid rgba(87,155,252,0.2)' }}>
              <BarChart3 className="w-6 h-6" style={{ color: BLUE }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold" style={{ color: T1 }}>Gen2 A/B Accuracy Tracker</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: 'rgba(87,155,252,0.1)', color: BLUE }}>S117 · PER-TENANT</span>
              </div>
              <p className="text-xs" style={{ color: T2 }}>
                Track Gen1 vs Gen2 response accuracy per tenant. Tenants with Gen2 accuracy ≥ 80% (10+ samples) qualify for live routing.
              </p>
            </div>
          </div>
          <button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold flex-shrink-0"
            style={{ background: 'rgba(87,155,252,0.1)', color: BLUE, border: '1px solid rgba(87,155,252,0.2)' }}>
            <Plus className="w-3.5 h-3.5" /> Rate Response
          </button>
        </div>
      </div>

      {/* Submit form */}
      {showForm && (
        <div className="rounded-2xl border p-4 space-y-3" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-xs font-bold" style={{ color: T1 }}>Submit Accuracy Rating</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Tenant ID</p>
              <input value={form.tenantId} onChange={e => setForm(f => ({ ...f, tenantId: e.target.value }))}
                placeholder="tenant_xxx"
                className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }} />
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Provider</p>
              <select value={form.provider} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }}>
                <option value="gen1">Gen1 (Claude)</option>
                <option value="gen2">Gen2 (fine-tuned)</option>
                <option value="krisnam">Krisnam</option>
              </select>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Comment (optional)</p>
            <input value={form.ratingComment} onChange={e => setForm(f => ({ ...f, ratingComment: e.target.value }))}
              placeholder="e.g. Response was factually correct but missed tone"
              className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
              style={{ borderColor: BDR, background: SURF, color: T1 }} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isAccurate} onChange={e => setForm(f => ({ ...f, isAccurate: e.target.checked }))} />
              <span className="text-xs font-semibold" style={{ color: T1 }}>Response was accurate</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button disabled={!form.tenantId.trim() || submit.isPending}
              onClick={() => submit.mutate()}
              className="px-4 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
              style={{ background: BLUE, color: '#fff' }}>
              {submit.isPending ? 'Submitting…' : 'Submit Rating'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-2xl text-xs font-bold" style={{ color: T2 }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Records',     value: data?.totalRecords ?? 0, color: BLUE },
          { label: 'Tenants Tracked',   value: tenants.length,          color: PURP },
          { label: 'Qualify Live Routing', value: qualified,            color: GRN  },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tenant list */}
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>
      ) : tenants.length === 0 ? (
        <div className="rounded-2xl p-8 text-center border" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-xs" style={{ color: T2 }}>No accuracy records yet. Submit the first rating above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tenants.sort((a, b) => (b.gen2AccuracyPct ?? 0) - (a.gen2AccuracyPct ?? 0)).map(t => (
            <div key={t.tenantId} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold truncate" style={{ color: T1 }}>{t.tenantId}</p>
                    {t.qualifiesForLiveRouting && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: `${GRN}12`, color: GRN, border: `1px solid ${GRN}25` }}>
                        <Zap className="w-2.5 h-2.5" /> Qualifies for Live Routing
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: T2 }}>{t.gen2SampleSize} Gen2 samples</p>
                </div>
                <div className="flex items-center gap-1">
                  {t.gen2AccuracyPct != null && t.gen2AccuracyPct >= 80
                    ? <CheckCircle2 className="w-4 h-4" style={{ color: GRN }} />
                    : <XCircle className="w-4 h-4" style={{ color: t.gen2SampleSize >= 10 ? RED : AMB }} />}
                </div>
              </div>
              <div className="space-y-2">
                <AccuracyBar pct={t.gen2AccuracyPct} color={BLUE} label="Gen2" />
                <AccuracyBar pct={t.gen1AccuracyPct} color={PURP} label="Gen1" />
              </div>
              {t.gen2SampleSize < 10 && (
                <p className="text-[9px] mt-2" style={{ color: AMB }}>
                  Need {10 - t.gen2SampleSize} more Gen2 ratings to qualify for live routing
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
