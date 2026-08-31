// Ingestion — unstructured input becomes a candidate someone promotes.
//
// The screen exists to make the boundary obvious: extraction produces a
// PROPOSAL, and a proposal is not a record. Every candidate shows what was
// found, how confident the extraction was, and the text it came from, because
// promoting something you have not checked is how a graph fills with fiction.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Upload, Check, X, Loader2, FileText, AlertTriangle, ArrowRight, Inbox,
} from 'lucide-react'
import { api } from '@lib/api'
import { errorMessage } from '../../../lib/errorMessage'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const TYPES = ['Customer', 'Contract', 'Project', 'Employee', 'Vendor', 'Case', 'Risk']

export function IngestionView() {
  const qc = useQueryClient()
  const [text, setText] = useState('')
  const [filename, setFilename] = useState('')
  const [typeName, setTypeName] = useState('Customer')
  const [useModel, setUseModel] = useState(false)
  const [lastExtract, setLastExtract] = useState<any>(null)

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['ingest', 'candidates'],
    queryFn: () => api.get('/admin/work-os/ingest/candidates').then(r => r.data.candidates),
  })

  const run = useMutation({
    mutationFn: async () => {
      const doc = await api.post('/admin/work-os/ingest', {
        filename: filename || 'pasted.txt', mimeType: 'text/plain', content: text,
      }).then(r => r.data)
      return api.post(`/admin/work-os/ingest/${doc.id}/extract`, { typeName, useModel })
        .then(r => r.data)
    },
    onSuccess: d => {
      setLastExtract(d); setText(''); setFilename('')
      qc.invalidateQueries({ queryKey: ['ingest', 'candidates'] })
    },
  })

  const decide = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'promote' | 'reject' }) =>
      api.post(`/admin/work-os/ingest/candidates/${id}/${action}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ingest', 'candidates'] })
      qc.invalidateQueries({ queryKey: ['work'] })
    },
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ margin: 0, fontSize: 13, color: T2, maxWidth: 700, lineHeight: 1.6 }}>
        Paste text from a contract, email or brief. Extraction finds what it can and produces a{' '}
        <strong style={{ color: T1 }}>candidate</strong> — it never writes to the graph. Promoting a
        candidate is a separate, deliberate act, and it lands as a draft.
      </p>

      {/* ── Input ────────────────────────────────────────────────────────── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: 16 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <input
            value={filename}
            onChange={e => setFilename(e.target.value)}
            placeholder="Source name (optional)"
            style={{ ...input, flex: 1, minWidth: 180 }}
          />
          <select value={typeName} onChange={e => setTypeName(e.target.value)} style={{ ...input, width: 160 }}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Paste the text here. Company names, amounts, dates and emails are found without a model."
          style={{ ...input, width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: T1, cursor: 'pointer' }}>
            <input type="checkbox" checked={useModel} onChange={e => setUseModel(e.target.checked)} />
            Also use a model
          </label>
          <span style={{ fontSize: 11.5, color: T2, flex: 1 }}>
            Patterns are exact; the model pass is additive and held to a lower confidence.
          </span>
          <button
            onClick={() => run.mutate()}
            disabled={!text.trim() || run.isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2564ea', color: '#fff',
              border: 'none', borderRadius: 8, padding: '9px 15px', fontSize: 12.5, fontWeight: 550,
              cursor: text.trim() ? 'pointer' : 'not-allowed', opacity: text.trim() && !run.isPending ? 1 : 0.5,
            }}
          >
            {run.isPending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Extract
          </button>
        </div>

        {run.isError && <ErrorText err={run.error} />}

        {lastExtract && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BDR}` }}>
            {lastExtract.candidates === 0 ? (
              <div style={{ display: 'flex', gap: 8, fontSize: 12.5, color: T2, alignItems: 'flex-start' }}>
                <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
                <span>{lastExtract.reason ?? lastExtract.notes?.join(' · ') ?? 'Nothing recognisable was found.'}</span>
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: T1 }}>
                Found {lastExtract.fields} field(s) at {Math.round((lastExtract.confidence ?? 0) * 100)}% confidence —
                waiting below for review.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Candidates ───────────────────────────────────────────────────── */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: T2, fontWeight: 650,
        }}>
          <Inbox size={13} /> Awaiting review
        </div>

        {isLoading && <Loading label="Loading candidates…" />}
        {!isLoading && !candidates?.length && (
          <div style={{
            border: `1px dashed ${BDR}`, borderRadius: 10, padding: '26px 18px',
            textAlign: 'center', color: T2, fontSize: 12.5,
          }}>
            Nothing waiting. Extracted candidates appear here before they enter the graph.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {candidates?.map((c: any) => (
            <div key={c.id} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <FileText size={14} style={{ color: T2 }} />
                <span style={{ fontSize: 13, color: T1, fontWeight: 550 }}>{c.document?.filename}</span>
                <span style={{ fontSize: 11, color: T2 }}>→ {c.typeName}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                  color: c.confidence >= 0.8 ? '#10b981' : c.confidence >= 0.6 ? '#f59e0b' : '#ef4444',
                }}>
                  {Math.round(c.confidence * 100)}% confidence
                </span>
              </div>

              <div style={{ background: SURF, borderRadius: 8, padding: 11, marginBottom: 11 }}>
                {Object.entries(c.properties ?? {}).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, fontSize: 12.5, padding: '2px 0' }}>
                    <span style={{ color: T2, minWidth: 110 }}>{k}</span>
                    <span style={{ color: T1 }}>{String(v)}</span>
                  </div>
                ))}
              </div>

              {c.sourceText && (
                <details style={{ marginBottom: 11 }}>
                  <summary style={{ fontSize: 11.5, color: T2, cursor: 'pointer' }}>
                    Where this came from
                  </summary>
                  <div style={{
                    fontSize: 11.5, color: T2, marginTop: 6, whiteSpace: 'pre-wrap',
                    maxHeight: 110, overflowY: 'auto', lineHeight: 1.5,
                  }}>{c.sourceText}</div>
                </details>
              )}

              <div style={{ display: 'flex', gap: 9, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => decide.mutate({ id: c.id, action: 'reject' })}
                  disabled={decide.isPending}
                  style={{ ...ghost }}
                ><X size={13} /> Reject</button>
                <button
                  onClick={() => decide.mutate({ id: c.id, action: 'promote' })}
                  disabled={decide.isPending}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2564ea', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12.5, fontWeight: 550, cursor: 'pointer',
                  }}
                ><Check size={13} /> Promote to draft <ArrowRight size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const input: React.CSSProperties = {
  background: SURF, color: T1, border: `1px solid ${BDR}`,
  borderRadius: 8, padding: '9px 11px', fontSize: 13,
}
const ghost: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent',
  color: T1, border: `1px solid ${BDR}`, borderRadius: 8, padding: '8px 14px',
  fontSize: 12.5, fontWeight: 550, cursor: 'pointer',
}

function Loading({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center', color: T2, fontSize: 13, padding: 14 }}>
      <Loader2 size={15} className="animate-spin" /> {label}
    </div>
  )
}

function ErrorText({ err }: { err: any }) {
  const msg = errorMessage(err)
  return (
    <div style={{ fontSize: 12.5, color: '#ef4444', display: 'flex', gap: 7, alignItems: 'center', marginTop: 10 }}>
      <AlertTriangle size={14} /> {msg}
    </div>
  )
}
