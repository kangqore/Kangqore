import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Handshake, Plus, AlertTriangle } from 'lucide-react'
import { api } from '@lib/api'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const PURP = '#7c3aed'
const AMB = '#f59e0b'
const GRN = '#10b981'

const REL_STAGES = ['IDENTIFIED', 'OUTREACH', 'NDA_SENT', 'TERMS_AGREED', 'CERTIFIED', 'ACTIVE', 'DECLINED']
const STAGE_COLOR: Record<string, string> = { IDENTIFIED: T2 as string, OUTREACH: '#579bfc', NDA_SENT: AMB, TERMS_AGREED: AMB, CERTIFIED: GRN, ACTIVE: GRN, DECLINED: '#ef4444' }

interface Tier { id: string; name: string; description: string | null; certificationRequirements: string | null; revenueSharePct: number | null; status: string; _count?: { relationships: number } }
interface Relationship { id: string; firmName: string; practiceArea: string | null; stage: string; tier?: { name: string } | null; notes: string | null }
interface Summary { tiers: Tier[]; relationships: Relationship[]; byStage: Record<string, number>; activeRelationships: number; disclaimer: string }

function StageBadge({ value }: { value: string }) {
  const c = STAGE_COLOR[value] ?? T2
  return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${c}20`, color: c }}>{value.replace('_', ' ')}</span>
}

function TiersPanel({ tiers }: { tiers: Tier[] }) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/partner-ecosystem/tiers', { name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partner-ecosystem'] }); setShowForm(false); setName('') },
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T2 }}>Partner Tiers — the structural prerequisite (P6.1)</p>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: `${PURP}18`, color: PURP }}>
          <Plus className="w-3.5 h-3.5" /> Define tier
        </button>
      </div>
      {showForm && (
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Tier name (e.g. Certified Implementation Partner)" className="flex-1 text-sm px-3 py-2 rounded-lg" style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }} />
          <button onClick={() => create.mutate()} disabled={!name.trim() || create.isPending} className="text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: PURP, color: '#fff' }}>Add</button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tiers.length === 0 && <p className="text-xs text-center py-8 col-span-2" style={{ color: T2 }}>No tiers defined yet — this is the real prerequisite before any SI conversation can close.</p>}
        {tiers.map(t => (
          <div key={t.id} className="rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold" style={{ color: T1 }}>{t.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${SURF}`, color: T2 }}>{t.status}</span>
            </div>
            <p className="text-[11px] mt-1" style={{ color: T2 }}>
              {t.revenueSharePct != null ? `${t.revenueSharePct}% revenue share` : 'Revenue share not set'} · {t._count?.relationships ?? 0} partner{(t._count?.relationships ?? 0) === 1 ? '' : 's'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelationshipsPanel({ data }: { data: Summary }) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [firmName, setFirmName] = useState('')
  const [practiceArea, setPracticeArea] = useState('')
  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/partner-ecosystem/relationships', { firmName, practiceArea }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partner-ecosystem'] }); setShowForm(false); setFirmName(''); setPracticeArea('') },
  })
  const advance = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => api.patch(`/admin/kangqore-immp/partner-ecosystem/relationships/${id}`, { stage }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partner-ecosystem'] }),
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {REL_STAGES.map(s => (
          <div key={s} className="rounded-lg p-2 text-center" style={{ background: SURF, border: `1px solid ${BDR}` }}>
            <p className="text-base font-black" style={{ color: STAGE_COLOR[s] }}>{data.byStage[s] ?? 0}</p>
            <p className="text-[7.5px] uppercase tracking-wide mt-0.5" style={{ color: T2 }}>{s.replace('_', ' ')}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: T2 }}>Anchor SI Relationships (P6.2)</p>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: `${PURP}18`, color: PURP }}>
          <Plus className="w-3.5 h-3.5" /> Add firm
        </button>
      </div>
      {showForm && (
        <div className="flex gap-2">
          <input value={firmName} onChange={e => setFirmName(e.target.value)} placeholder="Real SI firm name" className="flex-1 text-sm px-3 py-2 rounded-lg" style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }} />
          <input value={practiceArea} onChange={e => setPracticeArea(e.target.value)} placeholder="Practice area (optional)" className="flex-1 text-sm px-3 py-2 rounded-lg" style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }} />
          <button onClick={() => create.mutate()} disabled={!firmName.trim() || create.isPending} className="text-xs font-semibold px-3 py-2 rounded-lg" style={{ background: PURP, color: '#fff' }}>Add</button>
        </div>
      )}
      <div className="space-y-2">
        {data.relationships.length === 0 && <p className="text-xs text-center py-8" style={{ color: T2 }}>No SI relationships logged yet.</p>}
        {data.relationships.map(r => (
          <div key={r.id} className="rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-semibold" style={{ color: T1 }}>{r.firmName}{r.practiceArea ? ` · ${r.practiceArea}` : ''}{r.tier ? ` · ${r.tier.name}` : ''}</span>
              <StageBadge value={r.stage} />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {REL_STAGES.map(s => (
                <button key={s} disabled={s === r.stage || advance.isPending} onClick={() => advance.mutate({ id: r.id, stage: s })}
                  className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: s === r.stage ? `${STAGE_COLOR[s]}30` : `${BDR}30`, color: s === r.stage ? STAGE_COLOR[s] : T2 }}>
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

export function PartnerEcosystemPage() {
  const { data } = useQuery<Summary>({ queryKey: ['partner-ecosystem'], queryFn: () => api.get('/admin/kangqore-immp/partner-ecosystem').then(r => r.data), staleTime: 15_000 })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2" style={{ color: T1 }}>
          <Handshake className="w-5 h-5" style={{ color: PURP }} /> Partner Ecosystem
        </h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
          Overshadow Roadmap P6 — real tier structure + real SI tracking, no invented partners
        </p>
      </div>

      <div className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: `${AMB}12`, border: `1px solid ${AMB}30` }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: AMB }} />
        <p className="text-xs leading-relaxed" style={{ color: T2 }}>{data?.disclaimer}</p>
      </div>

      {data && <TiersPanel tiers={data.tiers} />}
      {data && <RelationshipsPanel data={data} />}
    </div>
  )
}
