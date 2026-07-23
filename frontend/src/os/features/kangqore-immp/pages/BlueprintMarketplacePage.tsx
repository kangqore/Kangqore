import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, GitFork, Download, Globe, Plus, Search, Filter, Tag } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'
const GRN  = '#10b981'
const AMB  = '#f59e0b'

const INDUSTRIES = ['All','general','fintech','healthcare','retail','logistics','saas','manufacturing','education']

interface MkBp {
  id: string; name: string; slug: string; description: string; industry: string
  planTier: string; version: string; authorName: string; installCount: number
  forkCount: number; ratingAvg: number; ratingCount: number; tags: string[]
  status: string; publishedAt: string; enabledModules: string[]
}

function Stars({ avg, count }: { avg: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className="w-3 h-3" fill={i <= Math.round(avg) ? AMB : 'none'} stroke={i <= Math.round(avg) ? AMB : T2} />
      ))}
      <span className="text-[10px]" style={{ color: T2 }}>({count})</span>
    </div>
  )
}

export function BlueprintMarketplacePage() {
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState('All')
  const [rateTarget, setRateTarget] = useState<{ id: string; name: string } | null>(null)
  const [rateVal, setRateVal]   = useState(5)
  const [rateNote, setRateNote] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['blueprint-marketplace', industry, q],
    queryFn: () => api.get('/admin/kangqore-immp/blueprint-marketplace', {
      params: { ...(industry !== 'All' && { industry }), ...(q && { q }) },
    }).then(r => r.data),
  })

  const forkMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/blueprint-marketplace/${id}/fork`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blueprint-marketplace'] }),
  })

  const rateMut = useMutation({
    mutationFn: ({ id, rating, review }: { id: string; rating: number; review: string }) =>
      api.post(`/admin/kangqore-immp/blueprint-marketplace/${id}/rate`, { rating, review }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blueprint-marketplace'] }); setRateTarget(null) },
  })

  const installMut = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/blueprint-marketplace/${id}/install`, { customerName: 'Kangqore Internal' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blueprint-marketplace'] }),
  })

  const items: MkBp[] = data?.items ?? []

  const TIER_COLOR: Record<string, string> = { STARTER: '#10b981', PRO: PURP, ENTERPRISE: AMB }

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Blueprint Marketplace" />

      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>Blueprint Marketplace</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
          {items.length} published · publish, fork, rate, and install versioned deployment blueprints
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: T2 }} />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg"
            style={{ background: CARD, border: `1px solid ${BDR}`, color: T1 }}
            placeholder="Search blueprints…"
            value={q} onChange={e => setQ(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" style={{ color: T2 }} />
          <select
            className="text-sm px-2 py-2 rounded-lg"
            style={{ background: CARD, border: `1px solid ${BDR}`, color: T1 }}
            value={industry} onChange={e => setIndustry(e.target.value)}
          >
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="text-sm" style={{ color: T2 }}>Loading marketplace…</div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(bp => (
          <div key={bp.id} className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: T1 }}>{bp.name}</p>
                <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
                  by {bp.authorName} · v{bp.version}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${TIER_COLOR[bp.planTier] ?? PURP}22`, color: TIER_COLOR[bp.planTier] ?? PURP }}>
                {bp.planTier}
              </span>
            </div>

            <p className="text-xs line-clamp-2" style={{ color: T2 }}>{bp.description}</p>

            {bp.industry && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" style={{ color: T2 }} />
                <span className="text-xs" style={{ color: T2 }}>{bp.industry}</span>
              </div>
            )}

            {bp.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {bp.tags.slice(0, 4).map(t => (
                  <span key={t} className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: `${PURP}18`, color: PURP }}>
                    <Tag className="w-2.5 h-2.5" />{t}
                  </span>
                ))}
              </div>
            )}

            <Stars avg={bp.ratingAvg} count={bp.ratingCount} />

            <div className="flex items-center gap-4 text-xs" style={{ color: T2 }}>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" />{bp.installCount} installs</span>
              <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{bp.forkCount} forks</span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => installMut.mutate(bp.id)}
                disabled={installMut.isPending}
                className="flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                style={{ background: PURP, color: '#fff' }}>
                {installMut.isPending ? 'Installing…' : 'Install'}
              </button>
              <button
                onClick={() => forkMut.mutate(bp.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: `${GRN}18`, color: GRN }}>
                Fork
              </button>
              <button
                onClick={() => { setRateTarget({ id: bp.id, name: bp.name }); setRateVal(5); setRateNote('') }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: `${AMB}18`, color: AMB }}>
                Rate
              </button>
            </div>
          </div>
        ))}

        {!isLoading && items.length === 0 && (
          <div className="col-span-full text-center py-16 text-sm" style={{ color: T2 }}>
            No blueprints found. Publish your first from the Blueprint Wizard.
          </div>
        )}
      </div>

      {/* Rate modal */}
      {rateTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-sm space-y-4"
            style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <h3 className="font-bold" style={{ color: T1 }}>Rate — {rateTarget.name}</h3>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRateVal(s)}
                  className="w-8 h-8 rounded-lg text-sm font-bold transition-colors"
                  style={{ background: s <= rateVal ? `${AMB}30` : `${BDR}30`, color: s <= rateVal ? AMB : T2 }}>
                  {s}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              className="w-full text-sm px-3 py-2 rounded-lg resize-none"
              style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
              placeholder="Optional review…"
              value={rateNote} onChange={e => setRateNote(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={() => setRateTarget(null)}
                className="flex-1 text-sm py-2 rounded-lg" style={{ background: `${BDR}50`, color: T2 }}>
                Cancel
              </button>
              <button
                onClick={() => rateMut.mutate({ id: rateTarget.id, rating: rateVal, review: rateNote })}
                disabled={rateMut.isPending}
                className="flex-1 text-sm font-semibold py-2 rounded-lg"
                style={{ background: AMB, color: '#fff' }}>
                {rateMut.isPending ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish CTA */}
      <div className="rounded-xl p-5 flex items-center gap-4"
        style={{ background: `${PURP}12`, border: `1px solid ${PURP}40` }}>
        <Plus className="w-5 h-5 flex-shrink-0" style={{ color: PURP }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: T1 }}>Publish a Blueprint</p>
          <p className="text-xs mt-0.5" style={{ color: T2 }}>
            Go to Blueprint Wizard → complete the spec → use the Publish to Marketplace action.
          </p>
        </div>
      </div>
    </div>
  )
}
