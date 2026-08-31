// "+ Add field" — describe it, check the reading, see it run, then create it.
//
// The preview step is the point. A field writes onto every object of its type,
// so the question that matters is not whether the definition reads well but
// what it actually produces on a real record. Create is deliberately gated
// behind having seen that.

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  X, Sparkles, Loader2, AlertTriangle, Check, Play, ArrowRight, Info,
} from 'lucide-react'
import { api } from '@lib/api'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const TIER_TONE = ['#64748b', '#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#ef4444']

const EXAMPLES = [
  'How risky is this?',
  'Summarise this and what is outstanding',
  'What is the sentiment here?',
  'Classify the request type',
  'What is the business impact?',
]

export function AddFieldModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [typeName, setTypeName] = useState('Project')
  const [text, setText] = useState('')
  const [draft, setDraft] = useState<any>(null)
  const [composeNote, setComposeNote] = useState<{ matched: string[]; ignored: string[]; note?: string } | null>(null)
  const [preview, setPreview] = useState<any>(null)

  const { data: cat } = useQuery({
    queryKey: ['fields', 'catalogue', typeName],
    queryFn: () => api.get('/admin/work-os/fields/catalogue', { params: { typeName } }).then(r => r.data),
  })

  const compose = useMutation({
    mutationFn: () => api.post('/admin/work-os/fields/compose', { text, typeName }).then(r => r.data),
    onSuccess: d => { setDraft(d.draft); setComposeNote({ matched: d.matched, ignored: d.ignored, note: d.note }); setPreview(null) },
    onError: () => { setDraft(null); setPreview(null) },
  })

  const runPreview = useMutation({
    mutationFn: () => api.post('/admin/work-os/fields/preview', { draft }).then(r => r.data),
    onSuccess: setPreview,
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/work-os/fields', draft).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['fields'] }); onClose() },
  })

  const composeError = (compose.error as any)?.response?.data

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: CARD, border: `1px solid ${BDR}`, borderRadius: 12,
          width: 'min(600px, 100%)', maxHeight: '92vh', overflowY: 'auto', padding: 22,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 620, color: T1, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Sparkles size={16} style={{ color: '#8b5cf6' }} /> Add an intelligence field
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T2 }}>
            <X size={18} />
          </button>
        </div>

        {/* ── 1. Describe ────────────────────────────────────────────────── */}
        <Step n={1} label="What should it work out?" />

        <div style={{ display: 'flex', gap: 9, marginBottom: 10 }}>
          <select
            value={typeName}
            onChange={e => { setTypeName(e.target.value); setDraft(null); setPreview(null) }}
            style={{ ...input, width: 165 }}
          >
            {(cat?.types ?? ['Project']).map((t: string) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && text.trim()) compose.mutate() }}
            placeholder="e.g. how risky is this?"
            style={{ ...input, flex: 1 }}
          />
          <button
            onClick={() => compose.mutate()}
            disabled={!text.trim() || compose.isPending}
            style={{ ...solid, opacity: text.trim() ? 1 : 0.5 }}
          >
            {compose.isPending ? <Loader2 size={13} className="animate-spin" /> : <ArrowRight size={13} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {EXAMPLES.map(e => (
            <button
              key={e}
              onClick={() => { setText(e); setDraft(null); setPreview(null) }}
              style={{
                background: 'transparent', border: `1px solid ${BDR}`, borderRadius: 999,
                padding: '3px 10px', fontSize: 11, color: T2, cursor: 'pointer',
              }}
            >{e}</button>
          ))}
        </div>

        {composeError && (
          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 8, padding: 12, marginBottom: 16,
          }}>
            <div style={{ fontSize: 12.5, color: T1, display: 'flex', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
              <span>{composeError.reason}</span>
            </div>
            {composeError.hint && (
              <div style={{ fontSize: 11.5, color: T2, marginTop: 6, paddingLeft: 22 }}>{composeError.hint}</div>
            )}
          </div>
        )}

        {/* ── 2. Check the reading ───────────────────────────────────────── */}
        {draft && (
          <>
            <Step n={2} label="Check what it understood" />
            <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 9, padding: 13, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T1 }}>{draft.name}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: TIER_TONE[draft.governanceTier],
                  border: `1px solid ${TIER_TONE[draft.governanceTier]}55`, borderRadius: 5, padding: '1px 6px',
                }}>T{draft.governanceTier}</span>
                <span style={{
                  fontSize: 10.5, color: draft.compute === 'DERIVED' ? '#10b981' : '#8b5cf6',
                  background: draft.compute === 'DERIVED' ? 'rgba(16,185,129,0.1)' : 'rgba(139,92,246,0.1)',
                  borderRadius: 999, padding: '2px 8px',
                }}>{draft.compute === 'DERIVED' ? 'no model needed' : 'uses a model'}</span>
              </div>

              <Row k="writes" v={draft.outputField} />
              <Row k="reads" v={draft.inputs.join(', ') || '(the whole record)'} />
              {draft.relatedTypes?.length > 0 && <Row k="also sees" v={draft.relatedTypes.join(', ')} />}
              {draft.options?.length > 0 && <Row k="answers with" v={draft.options.join(' · ')} />}
              <Row k="refresh" v={draft.refresh.toLowerCase().replace('_', ' ')} />
              <Row k="tier" v={cat?.tiers?.[draft.governanceTier] ?? ''} />

              {composeNote?.note && (
                <div style={{ fontSize: 11.5, color: '#10b981', marginTop: 9, display: 'flex', gap: 7 }}>
                  <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} /> {composeNote.note}
                </div>
              )}
              {composeNote?.ignored?.length > 0 && (
                <div style={{ fontSize: 11, color: T2, marginTop: 8 }}>
                  Ignored: {composeNote.ignored.join(', ')}
                </div>
              )}
            </div>

            {/* ── 3. Preview ──────────────────────────────────────────────── */}
            <Step n={3} label="See it run on a real record" />
            {!preview && (
              <button
                onClick={() => runPreview.mutate()}
                disabled={runPreview.isPending}
                style={{ ...ghost, marginBottom: 16 }}
              >
                {runPreview.isPending ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                Preview — writes nothing
              </button>
            )}

            {preview && (
              <div style={{
                background: SURF, border: `1px solid ${preview.willBeBlank ? 'rgba(245,158,11,0.35)' : BDR}`,
                borderRadius: 9, padding: 13, marginBottom: 16,
              }}>
                {!preview.previewed ? (
                  <div style={{ fontSize: 12.5, color: T2 }}>{preview.reason}</div>
                ) : preview.willBeBlank ? (
                  <>
                    <div style={{ fontSize: 12.5, color: T1, display: 'flex', gap: 8 }}>
                      <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                      <span>This would be blank on <strong>{preview.object?.title}</strong>.</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: T2, marginTop: 6, paddingLeft: 22 }}>{preview.error}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 11.5, color: T2, marginBottom: 7 }}>
                      On <strong style={{ color: T1 }}>{preview.object?.title}</strong>:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 9 }}>
                      <span style={{ fontSize: 20, fontWeight: 650, color: T1 }}>
                        {typeof preview.value === 'number' ? preview.value : String(preview.value).slice(0, 110)}
                      </span>
                      {preview.confidence != null && (
                        <span style={{ fontSize: 11.5, color: T2 }}>{Math.round(preview.confidence * 100)}% confidence</span>
                      )}
                    </div>
                    {preview.evidence?.map((e: string, i: number) => (
                      <div key={i} style={{ fontSize: 11.5, color: T2, padding: '1px 0' }}>• {e}</div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {create.isError && <ErrorText err={create.error} />}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={onClose} style={ghost}>Cancel</button>
          <button
            onClick={() => create.mutate()}
            disabled={!draft || !preview || create.isPending}
            title={!preview ? 'Preview it first' : undefined}
            style={{ ...solid, padding: '9px 16px', opacity: draft && preview ? 1 : 0.45 }}
          >
            {create.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Create field
          </button>
        </div>
      </div>
    </div>
  )
}

function Step({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
      <span style={{
        width: 17, height: 17, borderRadius: 999, background: SURF, border: `1px solid ${BDR}`,
        fontSize: 10, fontWeight: 700, color: T2,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{n}</span>
      <span style={{ fontSize: 12, color: T2, fontWeight: 550 }}>{label}</span>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 12, padding: '2px 0' }}>
      <span style={{ color: T2, minWidth: 82 }}>{k}</span>
      <span style={{ color: T1, wordBreak: 'break-word' }}>{v}</span>
    </div>
  )
}

const input: React.CSSProperties = {
  background: SURF, color: T1, border: `1px solid ${BDR}`,
  borderRadius: 8, padding: '9px 11px', fontSize: 13,
}
const solid: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2564ea', color: '#fff',
  border: 'none', borderRadius: 8, padding: '9px 13px', fontSize: 12.5, fontWeight: 550, cursor: 'pointer',
}
const ghost: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: T1,
  border: `1px solid ${BDR}`, borderRadius: 8, padding: '9px 14px', fontSize: 12.5, fontWeight: 550, cursor: 'pointer',
}

function ErrorText({ err }: { err: any }) {
  const msg = err?.response?.data?.error ?? err?.message ?? 'Something went wrong'
  return (
    <div style={{ fontSize: 12.5, color: '#ef4444', display: 'flex', gap: 7, alignItems: 'center', margin: '10px 0' }}>
      <AlertTriangle size={14} /> {msg}
    </div>
  )
}
