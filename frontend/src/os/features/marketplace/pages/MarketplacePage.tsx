import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Store, Bot, Link2, Package, Workflow, Search, Download, ChevronRight, Star, Plus, ArrowRight, Zap, BarChart3, DollarSign, RefreshCw, TrendingUp } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const PURP = '#7c3aed'
const BLUE = '#579bfc'
const TEAL = '#14b8a6'
const AMB  = '#f59e0b'
const GRN  = '#10b981'

interface Listing {
  id:           string
  type:         string
  name:         string
  slug:         string
  author:       string
  category:     string
  description:  string
  oisImpact:    string | null
  installCount: number
  price:        number
  platformFee:  number
  iconEmoji:    string
  tags:         string[]
  status:       string
  publishedAt:  string | null
}

const TIER_CFG: Record<string, { label: string; color: string; bg: string }> = {
  FREE:       { label: 'Free',       color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  STARTER:    { label: 'Starter',    color: '#579bfc', bg: 'rgba(87,155,252,0.1)'  },
  PRO:        { label: 'Pro',        color: '#7c3aed', bg: 'rgba(124,58,237,0.1)'  },
  ENTERPRISE: { label: 'Enterprise', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
}

function priceTier(price: number): string {
  if (price === 0) return 'FREE'
  if (price < 50)  return 'STARTER'
  if (price < 200) return 'PRO'
  return 'ENTERPRISE'
}

const TYPE_CFG: Record<string, { icon: React.FC<any>; color: string; bg: string }> = {
  AGENT:       { icon: Bot,      color: PURP, bg: 'rgba(124,58,237,0.1)' },
  INTEGRATION: { icon: Link2,    color: BLUE, bg: 'rgba(87,155,252,0.1)'  },
  PACK:        { icon: Package,  color: TEAL, bg: 'rgba(20,184,166,0.1)'  },
  WORKFLOW:    { icon: Workflow,  color: AMB,  bg: 'rgba(245,158,11,0.1)'  },
}

const CATEGORIES = ['All', 'intelligence', 'productivity', 'crm', 'finance', 'hr', 'ops']
const TYPES      = ['All', 'AGENT', 'INTEGRATION', 'PACK', 'WORKFLOW']

type View = 'browse' | 'submit' | 'revenue'

export function MarketplacePage() {
  const qc = useQueryClient()
  const [view,     setView]     = useState<View>('browse')
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [type,     setType]     = useState('All')
  const [selected, setSelected] = useState<Listing | null>(null)

  const { data, isLoading } = useQuery<{ listings: Listing[] }>({
    queryKey: ['marketplace', category, type],
    queryFn:  () => {
      const params: Record<string, string> = {}
      if (category !== 'All') params.category = category
      if (type     !== 'All') params.type     = type
      return api.get('/admin/kangqore-immp/marketplace', { params }).then(r => r.data)
    },
    staleTime: 60_000,
  })

  const install = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/marketplace/${id}/install`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['marketplace'] }),
  })

  const listings = (data?.listings ?? []).filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase())
  )

  if (selected) {
    return <ListingDetail listing={selected} onBack={() => setSelected(null)} onInstall={() => { install.mutate(selected.id); setSelected(null) }} installing={install.isPending} />
  }

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div className="rounded-2xl p-6 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(20,184,166,0.1)', border: `1px solid rgba(20,184,166,0.2)` }}>
              <Store className="w-6 h-6" style={{ color: TEAL }} />
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: T1 }}>Kangqore Marketplace</p>
              <p className="text-xs mt-0.5" style={{ color: T2 }}>Agents, integrations, workflow templates, and industry packs — one-click deploy to your Kangqore OS instance.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView('revenue')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
              style={view === 'revenue' ? { background: AMB, color: '#fff' } : { background: 'rgba(245,158,11,0.1)', color: AMB, border: `1px solid rgba(245,158,11,0.2)` }}>
              <BarChart3 className="w-3.5 h-3.5" /> Revenue
            </button>
            <button onClick={() => setView('submit')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: 'rgba(20,184,166,0.1)', color: TEAL, border: `1px solid rgba(20,184,166,0.2)` }}>
              <Plus className="w-3.5 h-3.5" /> Submit Listing
            </button>
          </div>
        </div>
      </div>

      {view === 'submit'  && <SubmitView qc={qc} onBack={() => setView('browse')} />}
      {view === 'revenue' && <RevenueView onBack={() => setView('browse')} />}

      {view === 'browse' && (
        <>
          {/* Search + filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ background: SURF, borderColor: BDR }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: T2 }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search agents, integrations, packs…"
                className="flex-1 text-sm bg-transparent focus:outline-none" style={{ color: T1 }} />
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={category === c ? { background: TEAL, color: '#fff' } : { background: SURF, color: T2, border: `1px solid ${BDR}` }}>
                {c === 'All' ? 'All categories' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex gap-2">
            {TYPES.map(t => {
              const cfg = TYPE_CFG[t]
              return (
                <button key={t} onClick={() => setType(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  style={type === t ? { background: cfg?.bg ?? SURF, color: cfg?.color ?? T1, border: `1px solid ${cfg?.color ?? BDR}30` }
                                    : { background: SURF, color: T2, border: `1px solid ${BDR}` }}>
                  {cfg && <cfg.icon className="w-3 h-3" />}
                  {t === 'All' ? 'All types' : t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              )
            })}
          </div>

          {/* Stats row */}
          {!isLoading && (
            <div className="flex items-center gap-2 text-xs" style={{ color: T2 }}>
              <span className="font-bold" style={{ color: T1 }}>{listings.length}</span> listings
              {search && <span>matching "{search}"</span>}
            </div>
          )}

          {/* Listing grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: SURF }} />)}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-16 text-center" style={{ color: T2 }}>
              <Store className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No listings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {listings.map(l => (
                <ListingCard key={l.id} listing={l}
                  onInstall={() => install.mutate(l.id)}
                  onView={() => setSelected(l)}
                  installing={install.isPending}
                />
              ))}
            </div>
          )}

          {/* Empty state seed */}
          {listings.length === 0 && !isLoading && !search && (
            <SeedListingsHint />
          )}
        </>
      )}
    </div>
  )
}

// ── Listing Card ─────────────────────────────────────────────────────────────

function ListingCard({ listing, onInstall, onView, installing }: {
  listing: Listing
  onInstall: () => void
  onView: () => void
  installing: boolean
}) {
  const cfg = TYPE_CFG[listing.type] ?? TYPE_CFG.AGENT
  const Icon = cfg.icon
  return (
    <div className="rounded-2xl border flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      style={{ background: CARD, borderColor: BDR }}
      onClick={onView}>
      <div className="p-4 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: cfg.bg }}>
            {listing.iconEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-tight" style={{ color: T1 }}>{listing.name}</p>
            <p className="text-[10px] mt-0.5" style={{ color: T2 }}>by {listing.author}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Icon className="w-3 h-3" style={{ color: cfg.color }} />
          </div>
        </div>

        <p className="text-[11px] line-clamp-2 mb-3" style={{ color: T2 }}>{listing.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {listing.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ background: SURF, color: T2 }}>{t}</span>
          ))}
          {(() => { const tc = TIER_CFG[priceTier(listing.price)]; return (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: tc.bg, color: tc.color }}>{tc.label}</span>
          ) })()}
        </div>

        {listing.oisImpact && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: `1px solid rgba(16,185,129,0.15)` }}>
            <Zap className="w-3 h-3" style={{ color: GRN }} />
            <span className="text-[10px] font-bold" style={{ color: GRN }}>{listing.oisImpact}</span>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: BDR, background: SURF }}>
        <div className="flex items-center gap-1 text-[10px]" style={{ color: T2 }}>
          <Download className="w-3 h-3" /> {listing.installCount}
        </div>
        <span className="text-[10px] font-bold ml-auto" style={{ color: listing.price === 0 ? GRN : T1 }}>
          {listing.price === 0 ? 'Free' : `$${listing.price}/mo`}
        </span>
        <button onClick={e => { e.stopPropagation(); onInstall() }} disabled={installing}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold disabled:opacity-40"
          style={{ background: cfg.bg, color: cfg.color }}>
          Install
        </button>
      </div>
    </div>
  )
}

// ── Listing Detail ────────────────────────────────────────────────────────────

function ListingDetail({ listing, onBack, onInstall, installing }: {
  listing: Listing
  onBack: () => void
  onInstall: () => void
  installing: boolean
}) {
  const cfg = TYPE_CFG[listing.type] ?? TYPE_CFG.AGENT
  const Icon = cfg.icon
  return (
    <div className="space-y-4 max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: T2 }}>
        <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to marketplace
      </button>

      <div className="rounded-2xl border p-6" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: cfg.bg }}>
            {listing.iconEmoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-lg font-black" style={{ color: T1 }}>{listing.name}</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.color }}>
                {listing.type}
              </span>
            </div>
            <p className="text-xs" style={{ color: T2 }}>by {listing.author} · {listing.category} · {listing.installCount} installs</p>
            {listing.oisImpact && (
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg w-fit" style={{ background: 'rgba(16,185,129,0.08)', border: `1px solid rgba(16,185,129,0.15)` }}>
                <Zap className="w-3.5 h-3.5" style={{ color: GRN }} />
                <span className="text-xs font-bold" style={{ color: GRN }}>OIS impact: {listing.oisImpact}</span>
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-black mb-2" style={{ color: listing.price === 0 ? GRN : T1 }}>
              {listing.price === 0 ? 'Free' : `$${listing.price}/mo`}
            </p>
            <button onClick={onInstall} disabled={installing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
              style={{ background: cfg.color, color: '#fff' }}>
              <Download className="w-4 h-4" />
              {installing ? 'Installing…' : 'Install Now'}
            </button>
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: T2 }}>{listing.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {listing.tags.map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-lg" style={{ background: SURF, color: T2 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Submit Listing View ───────────────────────────────────────────────────────

function SubmitView({ qc, onBack }: { qc: ReturnType<typeof useQueryClient>; onBack: () => void }) {
  const [form, setForm] = useState({
    type: 'AGENT', name: '', author: '', category: 'intelligence',
    description: '', oisImpact: '', price: '0', iconEmoji: '🔌', tags: '',
    webhookUrl: '', role: '', capabilities: '',
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/marketplace', {
      type: form.type, name: form.name.trim(), author: form.author.trim(),
      category: form.category, description: form.description.trim(),
      oisImpact: form.oisImpact || null, price: parseFloat(form.price) || 0,
      iconEmoji: form.iconEmoji || '🔌',
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      manifest: form.type === 'AGENT' ? {
        role: form.role, capabilities: form.capabilities.split(',').map(s => s.trim()).filter(Boolean),
        webhookUrl: form.webhookUrl,
      } : {},
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace'] })
      onBack()
    },
  })

  const f = (field: string, ph: string, label?: string) => (
    <div>
      <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{label ?? field.replace(/([A-Z])/g, ' $1').trim()}</p>
      <input value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={ph} className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
        style={{ borderColor: BDR, background: SURF, color: T1 }} />
    </div>
  )

  return (
    <div className="rounded-2xl border p-6 space-y-4 max-w-2xl" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Submit a listing</p>
        <button onClick={onBack} className="text-xs" style={{ color: T2 }}>Cancel</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Type</p>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
            style={{ borderColor: BDR, background: SURF, color: T1 }}>
            {['AGENT', 'INTEGRATION', 'PACK', 'WORKFLOW'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Category</p>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
            style={{ borderColor: BDR, background: SURF, color: T1 }}>
            {['intelligence', 'productivity', 'crm', 'finance', 'hr', 'ops'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {f('name',        'Revenue Intelligence Bot',        'Name')}
        {f('author',      'Acme Corp',                       'Author')}
        {f('description', 'Analyses CRM signals and…',       'Description')}
        {f('oisImpact',   '+3–5 OIS points',                 'OIS Impact (optional)')}
        {f('price',       '0',                               'Price (USD/mo, 0 = free)')}
        {f('iconEmoji',   '🔌',                               'Icon emoji')}
        {f('tags',        'crm, signals, automation',         'Tags (comma-separated)')}
      </div>

      {form.type === 'AGENT' && (
        <div className="space-y-3 pt-3 border-t" style={{ borderColor: BDR }}>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: T2 }}>Agent manifest</p>
          <div className="grid grid-cols-1 gap-3">
            {f('role',         'SIGNAL_ANALYST',                    'Role')}
            {f('capabilities', 'SWARM_LOG, SIGNAL_ANALYSIS',        'Capabilities (comma-separated)')}
            {f('webhookUrl',   'https://my-agent.example.com/kimmp', 'Webhook URL')}
          </div>
        </div>
      )}

      <button disabled={!form.name.trim() || !form.description.trim() || create.isPending}
        onClick={() => create.mutate()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
        style={{ background: TEAL, color: '#fff' }}>
        <ArrowRight className="w-4 h-4" />
        {create.isPending ? 'Publishing…' : 'Publish Listing'}
      </button>
    </div>
  )
}

// ── Partner Revenue Dashboard ─────────────────────────────────────────────────

interface PartnerDashboard {
  totalRevenue: number; totalPlatformFee: number; netRevenue: number
  totalInstalls: number; totalRefunds: number; refundRate: number
  byListing: Array<{ listingId: string; name: string; installs: number; revenue: number; fee: number }>
}

function RevenueView({ onBack }: { onBack: () => void }) {
  const { data, isLoading, refetch } = useQuery<PartnerDashboard>({
    queryKey: ['marketplace-revenue'],
    queryFn:  () => api.get('/admin/kangqore-immp/marketplace/partner/dashboard').then(r => r.data),
    staleTime: 60_000,
  })

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: T2 }}>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back
        </button>
        <button onClick={() => refetch()} className="ml-auto flex items-center gap-1 text-xs" style={{ color: T2 }}>
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Gross Revenue',   value: `$${data.totalRevenue.toFixed(2)}`,    icon: DollarSign, color: GRN  },
              { label: 'Platform Fee',    value: `$${data.totalPlatformFee.toFixed(2)}`, icon: TrendingUp, color: AMB  },
              { label: 'Net to Partners', value: `$${data.netRevenue.toFixed(2)}`,       icon: BarChart3,  color: TEAL },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T2 }}>{s.label}</span>
                </div>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Installs', value: data.totalInstalls,                      color: BLUE },
              { label: 'Refunds',        value: data.totalRefunds,                        color: RED  },
              { label: 'Refund Rate',    value: `${(data.refundRate * 100).toFixed(1)}%`, color: T1   },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: T2 }}>{s.label}</p>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {data.byListing.length > 0 && (
            <div className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
              <div className="p-4 border-b" style={{ borderColor: BDR }}>
                <p className="text-xs font-bold" style={{ color: T1 }}>Revenue by Listing</p>
              </div>
              <div className="divide-y" style={{ borderColor: BDR }}>
                {data.byListing.map(row => (
                  <div key={row.listingId} className="flex items-center gap-4 px-4 py-3">
                    <p className="text-xs font-medium flex-1" style={{ color: T1 }}>{row.name || row.listingId.slice(0, 8)}</p>
                    <span className="text-[10px]" style={{ color: T2 }}>{row.installs} installs</span>
                    <span className="text-xs font-bold" style={{ color: GRN }}>${row.revenue.toFixed(2)}</span>
                    <span className="text-[10px]" style={{ color: T2 }}>fee: ${row.fee.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center" style={{ color: T2 }}>
          <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No revenue data yet</p>
          <p className="text-xs mt-1">Install listings to generate charges</p>
        </div>
      )}
    </div>
  )
}

// ── Seed hint when marketplace is empty ──────────────────────────────────────

function SeedListingsHint() {
  const SEED = [
    { emoji: '🤖', name: 'KIMMP Signal Relay', type: 'AGENT',       color: PURP, impact: '+2 OIS' },
    { emoji: '📊', name: 'CRM Intelligence Pack', type: 'PACK',      color: TEAL, impact: '+5 OIS' },
    { emoji: '⚙️', name: 'Slack Integration',   type: 'INTEGRATION', color: BLUE, impact: null     },
    { emoji: '🔄', name: 'SOW Workflow',         type: 'WORKFLOW',    color: AMB,  impact: '+1 OIS' },
  ]
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold" style={{ color: T2 }}>Coming to the marketplace:</p>
      <div className="grid grid-cols-4 gap-3">
        {SEED.map(s => (
          <div key={s.name} className="rounded-xl p-4 border opacity-50" style={{ background: CARD, borderColor: BDR }}>
            <div className="text-2xl mb-2">{s.emoji}</div>
            <p className="text-xs font-bold mb-1" style={{ color: T1 }}>{s.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: s.color }}>{s.type}</span>
              {s.impact && <span className="text-[10px] font-bold" style={{ color: GRN }}>{s.impact}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
