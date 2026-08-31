// Intelligence fields — AI as a computed column, with its governance visible.
//
// The screen is built around the rule the engine enforces: a field that cannot
// compute writes nothing. So running one shows computed / skipped / failed
// separately and prints the reasons, because "15 computed, 2 skipped, no
// priceable value reachable" is a useful answer and "17 done" would be a lie.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Play, Loader2, AlertTriangle, Power, ChevronRight, Sparkles, Plus } from 'lucide-react'
import { api } from '@lib/api'
import { AddFieldModal } from '../components/AddFieldModal'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const TIER_TONE = ['#64748b', '#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#ef4444']

interface RunResult {
  field: string; objects: number; computed: number; skipped: number; failed: number; reasons: string[]
}

export function FieldsView() {
  const qc = useQueryClient()
  const [result, setResult] = useState<RunResult | null>(null)
  const [openRuns, setOpenRuns] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: () => api.get('/admin/work-os/fields').then(r => r.data),
  })

  const compute = useMutation({
    mutationFn: (id: string) => api.post(`/admin/work-os/fields/${id}/compute`, {}).then(r => r.data),
    onSuccess: d => { setResult(d); qc.invalidateQueries({ queryKey: ['fields'] }) },
  })
  const toggle = useMutation({
    mutationFn: (id: string) => api.post(`/admin/work-os/fields/${id}/toggle`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fields'] }),
  })

  if (isLoading) return <Loading label="Loading fields…" />

  const fields = data?.fields ?? []
  const byType = fields.reduce((acc: Record<string, any[]>, f: any) => {
    (acc[f.typeName] ??= []).push(f); return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, justifyContent: 'space-between' }}>
      <p style={{ margin: 0, fontSize: 13, color: T2, maxWidth: 680, lineHeight: 1.6 }}>
        A field computes a value onto every object of its type, and records what it rests on.
        <strong style={{ color: T1 }}> A field that cannot compute writes nothing</strong> — the run is
        recorded as skipped with a reason, and the object keeps whatever it had.
      </p>
        <button
          onClick={() => setAdding(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2564ea', color: '#fff',
            border: 'none', borderRadius: 8, padding: '9px 14px', fontSize: 12.5, fontWeight: 550,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        ><Plus size={14} /> Add field</button>
      </div>

      {result && (
        <div style={{
          background: SURF, border: `1px solid ${BDR}`, borderRadius: 9, padding: 14,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: 13, color: T1 }}>
            <strong>{result.field}</strong> over {result.objects} object(s):{' '}
            <span style={{ color: '#10b981' }}>{result.computed} computed</span>
            {result.skipped > 0 && <>, <span style={{ color: '#f59e0b' }}>{result.skipped} skipped</span></>}
            {result.failed > 0 && <>, <span style={{ color: '#ef4444' }}>{result.failed} failed</span></>}
          </div>
          {result.reasons?.length > 0 && result.reasons.map((r, i) => (
            <div key={i} style={{ fontSize: 12, color: T2, display: 'flex', gap: 7 }}>
              <AlertTriangle size={13} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} /> {r}
            </div>
          ))}
        </div>
      )}

      {Object.entries(byType).map(([typeName, list]) => (
        <div key={typeName}>
          <div style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: T2, fontWeight: 650, marginBottom: 9,
          }}>{typeName}</div>

          <div style={{ border: `1px solid ${BDR}`, borderRadius: 10, overflow: 'hidden' }}>
            {(list as any[]).map((f, i) => (
              <div key={f.id} style={{ borderTop: i ? `1px solid ${BDR}` : 'none', background: CARD }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: TIER_TONE[f.governanceTier] ?? T2,
                    border: `1px solid ${TIER_TONE[f.governanceTier] ?? T2}55`,
                    borderRadius: 5, padding: '2px 6px', whiteSpace: 'nowrap',
                  }}>T{f.governanceTier}</span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13.5, color: T1, fontWeight: 550 }}>{f.name}</span>
                      {f.compute === 'GENERATIVE' && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10,
                          color: '#8b5cf6', background: 'rgba(139,92,246,0.1)',
                          borderRadius: 999, padding: '1px 7px',
                        }}><Sparkles size={9} /> model</span>
                      )}
                      {!f.enabled && (
                        <span style={{ fontSize: 10, color: T2, border: `1px solid ${BDR}`, borderRadius: 999, padding: '1px 7px' }}>
                          off
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>{f.description}</div>
                    <div style={{ fontSize: 11, color: T2, marginTop: 3 }}>
                      writes <code style={{ color: T1 }}>{f.outputField}</code> · {f._count?.runs ?? 0} run(s)
                    </div>
                  </div>

                  <button
                    onClick={() => toggle.mutate(f.id)}
                    title={f.enabled ? 'Disable' : 'Enable'}
                    style={{
                      background: 'none', border: `1px solid ${BDR}`, borderRadius: 7,
                      padding: '6px 8px', cursor: 'pointer', color: f.enabled ? '#10b981' : T2,
                    }}
                  ><Power size={13} /></button>

                  <button
                    onClick={() => compute.mutate(f.id)}
                    disabled={!f.enabled || compute.isPending}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: f.enabled ? '#2564ea' : 'transparent',
                      color: f.enabled ? '#fff' : T2,
                      border: f.enabled ? 'none' : `1px solid ${BDR}`,
                      borderRadius: 7, padding: '7px 12px', fontSize: 12, fontWeight: 550,
                      cursor: f.enabled ? 'pointer' : 'not-allowed', opacity: compute.isPending ? 0.6 : 1,
                    }}
                  >
                    {compute.isPending ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} Run
                  </button>

                  <button
                    onClick={() => setOpenRuns(openRuns === f.id ? null : f.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: T2 }}
                  >
                    <ChevronRight size={15} style={{
                      transform: openRuns === f.id ? 'rotate(90deg)' : 'none', transition: 'transform .15s',
                    }} />
                  </button>
                </div>

                {openRuns === f.id && <Runs fieldId={f.id} />}
              </div>
            ))}
          </div>
        </div>
      ))}

      {adding && <AddFieldModal onClose={() => setAdding(false)} />}
    </div>
  )
}

function Runs({ fieldId }: { fieldId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['field-runs', fieldId],
    queryFn: () => api.get(`/admin/work-os/fields/${fieldId}/runs`).then(r => r.data.runs),
  })
  if (isLoading) return <Loading label="Loading runs…" />
  if (!data?.length) return <div style={{ padding: '10px 14px', fontSize: 12, color: T2 }}>Never run.</div>

  const tone: Record<string, string> = { OK: '#10b981', SKIPPED: '#f59e0b', FAILED: '#ef4444' }

  return (
    <div style={{ borderTop: `1px solid ${BDR}`, background: SURF, padding: '8px 14px' }}>
      {data.slice(0, 12).map((r: any) => (
        <div key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '4px 0', fontSize: 11.5 }}>
          <span style={{ color: tone[r.status] ?? T2, fontWeight: 600, minWidth: 58 }}>{r.status}</span>
          <span style={{ color: T1, minWidth: 90, fontVariantNumeric: 'tabular-nums' }}>
            {r.value !== null && r.value !== undefined ? String(r.value).slice(0, 26) : '—'}
          </span>
          <span style={{ color: T2, flex: 1 }}>{r.error ?? (r.evidence?.[0] ?? '')}</span>
          <span style={{ color: T2 }}>{new Date(r.createdAt).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  )
}

function Loading({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center', color: T2, fontSize: 13, padding: 14 }}>
      <Loader2 size={15} className="animate-spin" /> {label}
    </div>
  )
}
