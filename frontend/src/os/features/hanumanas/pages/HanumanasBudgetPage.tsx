import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Plus, RefreshCw, AlertTriangle, CheckCircle, Wallet, Lock } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const RED   = '#ef4444'
const GRN   = '#10b981'
const AMB   = '#f59e0b'
const BLUE  = '#579bfc'
const PURP  = '#7c3aed'
const CRIMSON = '#e2445c'

interface BudgetConfig {
  global: { egressSizeLimitKb: number; hardDeny: boolean }
  tenants: Array<{ tenantId: string; callLimit: number; windowHours: number; hardDeny: boolean }>
  totalTenants: number
}

interface TenantUsage {
  tenantId: string; callCount: number; budget: number | null
  windowHours: number; overBudget: boolean; hardDeny: boolean; since: string
}

export function HanumanasBudgetPage() {
  const qc = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [form, setForm] = useState({ tenantId: '', callLimit: '500', windowHours: '24', hardDeny: true })

  const { data: budget, isLoading, refetch } = useQuery<BudgetConfig>({
    queryKey: ['hanumanas-budget'],
    queryFn: () => api.get('/api/admin/hanumanas/budget').then(r => r.data),
    staleTime: 30_000,
  })

  const { data: usage } = useQuery<TenantUsage>({
    queryKey: ['hanumanas-budget-usage', selectedTenant],
    queryFn:  () => api.get(`/api/admin/hanumanas/budget/${selectedTenant}/usage`).then(r => r.data),
    enabled:  !!selectedTenant,
    staleTime: 10_000,
  })

  const addMut = useMutation({
    mutationFn: () => api.post('/api/admin/hanumanas/budget', {
      tenantId:    form.tenantId.trim(),
      callLimit:   parseInt(form.callLimit),
      windowHours: parseInt(form.windowHours),
      hardDeny:    form.hardDeny,
    }),
    onSuccess: () => {
      setShowAdd(false)
      setForm({ tenantId: '', callLimit: '500', windowHours: '24', hardDeny: true })
      qc.invalidateQueries({ queryKey: ['hanumanas-budget'] })
    },
  })

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(226,68,92,0.1)', border: '1px solid rgba(226,68,92,0.2)' }}>
            <ShieldCheck className="w-6 h-6" style={{ color: CRIMSON }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-bold" style={{ color: T1 }}>HANUMANAS Phase 3 — Budget Enforcement</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(226,68,92,0.1)', color: CRIMSON }}>S112</span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>
              Per-tenant AI call budgets with hard-deny enforcement. Egress size limits block oversized intelligence exports. Rollback checkpoints are created automatically before any L3 governance action.
            </p>
          </div>
        </div>
      </div>

      {/* Global enforcement status */}
      {budget?.global && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Egress Size Limit</p>
            <p className="text-2xl font-black" style={{ color: BLUE }}>{budget.global.egressSizeLimitKb} KB</p>
            <p className="text-[11px] mt-1" style={{ color: T2 }}>Responses exceeding this are hard-denied at the HANUMANAS egress layer</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Lock className="w-3 h-3" style={{ color: CRIMSON }} />
              <span className="text-[10px] font-bold" style={{ color: CRIMSON }}>Hard Deny Active</span>
            </div>
          </div>
          <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>L3 Rollback</p>
            <p className="text-2xl font-black" style={{ color: GRN }}>AUTO</p>
            <p className="text-[11px] mt-1" style={{ color: T2 }}>KIMMP signal snapshot created before every L3 governance action (PAUSE, BLOCK, QUARANTINE)</p>
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle className="w-3 h-3" style={{ color: GRN }} />
              <span className="text-[10px] font-bold" style={{ color: GRN }}>Phase 3 Live</span>
            </div>
          </div>
          <div className="rounded-2xl p-4 border" style={{ background: CARD, borderColor: BDR }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Tenant Budgets</p>
            <p className="text-2xl font-black" style={{ color: PURP }}>{budget.totalTenants}</p>
            <p className="text-[11px] mt-1" style={{ color: T2 }}>Tenants with configured call budgets</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Wallet className="w-3 h-3" style={{ color: PURP }} />
              <span className="text-[10px] font-bold" style={{ color: PURP }}>Budget Enforcement</span>
            </div>
          </div>
        </div>
      )}

      {/* Add budget */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Tenant Budgets</p>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="p-1.5 rounded-2xl" style={{ color: T2 }}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setShowAdd(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold"
            style={{ background: 'rgba(226,68,92,0.1)', color: CRIMSON, border: '1px solid rgba(226,68,92,0.2)' }}>
            <Plus className="w-3.5 h-3.5" /> Add Budget
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="rounded-2xl border p-4 space-y-3" style={{ background: CARD, borderColor: BDR }}>
          <p className="text-xs font-bold" style={{ color: T1 }}>New Tenant Budget</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { field: 'tenantId',    label: 'Tenant ID (blueprint customer ID)', ph: 'e.g. cust-six' },
              { field: 'callLimit',   label: 'Call limit per window', ph: '500' },
              { field: 'windowHours', label: 'Window (hours)', ph: '24' },
            ].map(({ field, label, ph }) => (
              <div key={field}>
                <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{label}</p>
                <input value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={ph}
                  className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none"
                  style={{ borderColor: BDR, background: SURF, color: T1 }} />
              </div>
            ))}
            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="hardDeny" checked={form.hardDeny}
                onChange={e => setForm(f => ({ ...f, hardDeny: e.target.checked }))} />
              <label htmlFor="hardDeny" className="text-xs font-semibold" style={{ color: T1 }}>Hard deny when over budget</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button disabled={!form.tenantId.trim() || addMut.isPending} onClick={() => addMut.mutate()}
              className="px-4 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
              style={{ background: CRIMSON, color: '#fff' }}>
              {addMut.isPending ? 'Saving…' : 'Save Budget'}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-2xl text-xs font-bold" style={{ color: T2 }}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading && <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>}

      {(budget?.tenants?.length ?? 0) === 0 && !showAdd && (
        <div className="py-12 text-center rounded-2xl border" style={{ borderColor: BDR }}>
          <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-20" style={{ color: T2 }} />
          <p className="text-sm font-medium" style={{ color: T2 }}>No tenant budgets configured</p>
          <p className="text-xs mt-1" style={{ color: T2 }}>Egress enforcement and L3 rollback are active globally.</p>
        </div>
      )}

      {(budget?.tenants ?? []).map(t => (
        <div key={t.tenantId} className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${PURP}15` }}>
              <Wallet className="w-4 h-4" style={{ color: PURP }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: T1 }}>{t.tenantId}</p>
              <p className="text-[10px]" style={{ color: T2 }}>
                {t.callLimit} calls / {t.windowHours}h · {t.hardDeny ? 'Hard deny' : 'Warn only'}
              </p>
            </div>
            <button
              onClick={() => setSelectedTenant(selectedTenant === t.tenantId ? null : t.tenantId)}
              className="px-3 py-1.5 rounded-2xl text-[10px] font-bold"
              style={{ background: `${BLUE}15`, color: BLUE }}>
              {selectedTenant === t.tenantId ? 'Hide' : 'Check Usage'}
            </button>
          </div>

          {selectedTenant === t.tenantId && usage && (
            <div className="px-4 pb-4 border-t" style={{ borderColor: BDR }}>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-2xl p-3 border text-center" style={{ background: SURF, borderColor: BDR }}>
                  <p className="text-[9px] font-bold uppercase mb-1" style={{ color: T2 }}>Calls Used</p>
                  <p className="text-xl font-black" style={{ color: usage.overBudget ? RED : GRN }}>{usage.callCount}</p>
                </div>
                <div className="rounded-2xl p-3 border text-center" style={{ background: SURF, borderColor: BDR }}>
                  <p className="text-[9px] font-bold uppercase mb-1" style={{ color: T2 }}>Budget</p>
                  <p className="text-xl font-black" style={{ color: PURP }}>{usage.budget ?? '∞'}</p>
                </div>
                <div className="rounded-2xl p-3 border text-center" style={{ background: SURF, borderColor: BDR }}>
                  <p className="text-[9px] font-bold uppercase mb-1" style={{ color: T2 }}>Status</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {usage.overBudget
                      ? <AlertTriangle className="w-4 h-4" style={{ color: RED }} />
                      : <CheckCircle className="w-4 h-4" style={{ color: GRN }} />}
                    <span className="text-xs font-black" style={{ color: usage.overBudget ? RED : GRN }}>
                      {usage.overBudget ? 'OVER' : 'OK'}
                    </span>
                  </div>
                </div>
              </div>
              {usage.budget && (
                <div className="mt-3">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: SURF }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (usage.callCount / usage.budget) * 100)}%`,
                        background: usage.overBudget ? RED : usage.callCount / usage.budget > 0.8 ? AMB : GRN,
                      }} />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: T2 }}>
                    {Math.min(100, Math.round((usage.callCount / usage.budget) * 100))}% of budget · window since {new Date(usage.since).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
