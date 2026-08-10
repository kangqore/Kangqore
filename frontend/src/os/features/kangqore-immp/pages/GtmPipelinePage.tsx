import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Target, Users, Award, Plus, AlertTriangle } from 'lucide-react'
import { api } from '@lib/api'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const PURP = '#7c3aed'
const BLUE = '#579bfc'
const GRN = '#10b981'
const AMB = '#f59e0b'

const REF_STAGES = ['IDENTIFIED', 'OUTREACH', 'PERMISSION_REQUESTED', 'PERMISSION_GRANTED', 'PUBLISHED', 'DECLINED']
const ANALYST_STATUSES = ['NOT_CONTACTED', 'OUTREACH_SENT', 'BRIEFED', 'ONGOING']
const STAGE_COLOR: Record<string, string> = { IDENTIFIED: T2 as string, OUTREACH: BLUE, PERMISSION_REQUESTED: AMB, PERMISSION_GRANTED: GRN, PUBLISHED: GRN, DECLINED: '#ef4444' }

interface RefCandidate { id: string; customerName: string; stage: string; contactName: string | null; outcomeSummary: string | null; notes: string | null }
interface Analyst { id: string; firm: string; analystName: string | null; category: string | null; status: string }
interface Engagement { id: string; customerName: string; title: string; verticalPack: string; overallScore: number; scoreGrade: string | null; completedAt: string }
interface Publication { id: string; engagementId: string; publicLabel: string; status: string; anonymized: boolean }
interface Summary {
  referenceCustomers: { candidates: RefCandidate[]; byStage: Record<string, number>; total: number }
  analystRelationships: { relationships: Analyst[]; byStatus: Record<string, number>; total: number }
  bidsProofPoints: { publications: Publication[]; eligibleEngagements: Engagement[]; publishedCount: number; draftCount: number }
  disclaimer: string
}

function StageBadge({ value }: { value: string }) {
  const c = STAGE_COLOR[value] ?? T2
  return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${c}20`, color: c }}>{value.replace('_', ' ')}</span>
}

function ReferenceCustomersTab({ data }: { data: Summary['referenceCustomers'] }) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gtm-pipeline/reference-customers', { customerName: name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gtm-pipeline'] }); setShowForm(false); setName('') },
  })
  const advance = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => api.patch(`/admin/kangqore-immp/gtm-pipeline/reference-customers/${id}`, { stage }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gtm-pipeline'] }),
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {REF_STAGES.map(s => (
          <div key={s} className="rounded-lg p-2.5 text-center" style={{ background: SURF, border: `1px solid ${BDR}` }}>
            <p className="text-lg font-black" style={{ color: STAGE_COLOR[s] }}>{data.byStage[s] ?? 0}</p>
            <p className="text-[8px] uppercase tracking-wide mt-0.5" style={{ color: T2 }}>{s.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: `${PURP}18`, color: PURP }}>
        <Plus className="w-3.5 h-3.5" /> Add candidate
      </button>
      {showForm && (
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Real customer name" className="flex-1 text-sm px-3 py-2 rounded-lg" style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }} />
          <button onClick={() => create.mutate()} disabled={!name.trim() || create.isPending} className="text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: PURP, color: '#fff' }}>Add</button>
        </div>
      )}
      <div className="space-y-2">
        {data.candidates.length === 0 && <p className="text-xs text-center py-8" style={{ color: T2 }}>No candidates logged yet — add the first real one above.</p>}
        {data.candidates.map(c => (
          <div key={c.id} className="rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-semibold" style={{ color: T1 }}>{c.customerName}</span>
              <StageBadge value={c.stage} />
            </div>
            {c.outcomeSummary && <p className="text-xs mt-1" style={{ color: T2 }}>{c.outcomeSummary}</p>}
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {REF_STAGES.map(s => (
                <button key={s} disabled={s === c.stage || advance.isPending} onClick={() => advance.mutate({ id: c.id, stage: s })}
                  className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: s === c.stage ? `${STAGE_COLOR[s]}30` : `${BDR}30`, color: s === c.stage ? STAGE_COLOR[s] : T2 }}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalystsTab({ data }: { data: Summary['analystRelationships'] }) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [firm, setFirm] = useState('')
  const [category, setCategory] = useState('')
  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gtm-pipeline/analyst-relationships', { firm, category }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gtm-pipeline'] }); setShowForm(false); setFirm(''); setCategory('') },
  })
  const advance = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/admin/kangqore-immp/gtm-pipeline/analyst-relationships/${id}`, { status, ...(status === 'BRIEFED' ? { lastBriefingAt: new Date().toISOString() } : {}) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gtm-pipeline'] }),
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {ANALYST_STATUSES.map(s => (
          <div key={s} className="rounded-lg p-2.5 text-center" style={{ background: SURF, border: `1px solid ${BDR}` }}>
            <p className="text-lg font-black" style={{ color: T1 }}>{data.byStatus[s] ?? 0}</p>
            <p className="text-[8px] uppercase tracking-wide mt-0.5" style={{ color: T2 }}>{s.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: `${PURP}18`, color: PURP }}>
        <Plus className="w-3.5 h-3.5" /> Add relationship
      </button>
      {showForm && (
        <div className="flex gap-2">
          <input value={firm} onChange={e => setFirm(e.target.value)} placeholder="Firm (e.g. Gartner)" className="flex-1 text-sm px-3 py-2 rounded-lg" style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }} />
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (optional)" className="flex-1 text-sm px-3 py-2 rounded-lg" style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }} />
          <button onClick={() => create.mutate()} disabled={!firm.trim() || create.isPending} className="text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: PURP, color: '#fff' }}>Add</button>
        </div>
      )}
      <div className="space-y-2">
        {data.relationships.length === 0 && <p className="text-xs text-center py-8" style={{ color: T2 }}>No analyst relationships logged yet.</p>}
        {data.relationships.map(r => (
          <div key={r.id} className="rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-semibold" style={{ color: T1 }}>{r.firm}{r.category ? ` · ${r.category}` : ''}</span>
              <StageBadge value={r.status} />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {ANALYST_STATUSES.map(s => (
                <button key={s} disabled={s === r.status || advance.isPending} onClick={() => advance.mutate({ id: r.id, status: s })}
                  className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: s === r.status ? `${BLUE}30` : `${BDR}30`, color: s === r.status ? BLUE : T2 }}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BidsProofPointsTab({ data }: { data: Summary['bidsProofPoints'] }) {
  const qc = useQueryClient()
  const draft = useMutation({
    mutationFn: (engagementId: string) => api.post('/admin/kangqore-immp/gtm-pipeline/bids-proof-points', { engagementId, publicLabel: 'Anonymized client', anonymized: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gtm-pipeline'] }),
  })
  const publish = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/kangqore-immp/gtm-pipeline/bids-proof-points/${id}`, { status: 'PUBLISHED' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gtm-pipeline'] }),
  })

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T2 }}>Eligible real completed engagements</p>
        {data.eligibleEngagements.length === 0 && <p className="text-xs text-center py-8" style={{ color: T2 }}>No completed BIDS engagements with a score yet — this fills in as real engagements finish.</p>}
        <div className="space-y-2">
          {data.eligibleEngagements.map(e => (
            <div key={e.id} className="flex items-center gap-3 rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold" style={{ color: T1 }}>{e.title}</span>
                <span className="text-xs ml-2" style={{ color: T2 }}>{e.verticalPack} · score {e.overallScore.toFixed(0)}{e.scoreGrade ? ` (${e.scoreGrade})` : ''}</span>
              </div>
              <button onClick={() => draft.mutate(e.id)} disabled={draft.isPending} className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ background: `${GRN}18`, color: GRN }}>Draft proof point</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T2 }}>Publications — {data.draftCount} draft · {data.publishedCount} published</p>
        {data.publications.length === 0 && <p className="text-xs text-center py-8" style={{ color: T2 }}>No proof points drafted yet.</p>}
        <div className="space-y-2">
          {data.publications.map(p => (
            <div key={p.id} className="flex items-center gap-3 rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
              <span className="flex-1 text-sm font-semibold" style={{ color: T1 }}>{p.publicLabel}</span>
              <StageBadge value={p.status} />
              {p.status === 'DRAFT' && <button onClick={() => publish.mutate(p.id)} disabled={publish.isPending} className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ background: `${GRN}18`, color: GRN }}>Publish</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GtmPipelinePage() {
  const [tab, setTab] = useState<'references' | 'bids' | 'analysts'>('references')
  const { data } = useQuery<Summary>({ queryKey: ['gtm-pipeline'], queryFn: () => api.get('/admin/kangqore-immp/gtm-pipeline').then(r => r.data), staleTime: 15_000 })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2" style={{ color: T1 }}>
          <Target className="w-5 h-5" style={{ color: PURP }} /> Proof Points &amp; Analyst Pipeline
        </h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
          Overshadow Roadmap P5 — real-process tracking, not a substitute for the process
        </p>
      </div>

      <div className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: `${AMB}12`, border: `1px solid ${AMB}30` }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: AMB }} />
        <p className="text-xs leading-relaxed" style={{ color: T2 }}>{data?.disclaimer}</p>
      </div>

      <div className="flex items-center gap-1 border-b" style={{ borderColor: BDR }}>
        {([
          { id: 'references' as const, label: 'Reference Customers', icon: Users },
          { id: 'bids' as const, label: 'BIDS™ Proof Points', icon: Award },
          { id: 'analysts' as const, label: 'Analyst Relationships', icon: Target },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px"
            style={{ borderColor: tab === t.id ? PURP : 'transparent', color: tab === t.id ? PURP : T2 }}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {data && tab === 'references' && <ReferenceCustomersTab data={data.referenceCustomers} />}
      {data && tab === 'analysts' && <AnalystsTab data={data.analystRelationships} />}
      {data && tab === 'bids' && <BidsProofPointsTab data={data.bidsProofPoints} />}
    </div>
  )
}
