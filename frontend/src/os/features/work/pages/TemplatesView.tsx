// Templates — the path from an empty graph to real work.
//
// Applying one creates actual objects and relationships, not a board full of
// placeholders. So the screen is built to be honest about that: it says what
// will be created before you commit, reports exactly what happened after, and
// keeps every run undoable.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Play, X, Check, AlertTriangle, Loader2, Undo2, ArrowRight, Layers, Link2,
} from 'lucide-react'
import { api } from '@lib/api'
import { errorMessage } from '../../../lib/errorMessage'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

interface Template {
  id: string; key: string; name: string; description: string
  category: string; icon: string | null; color: string | null
  rootTypeName: string
  creates: number; links: number; timesApplied: number
}
interface ApplyResult {
  runId: string
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED'
  rootObjectId: string | null
  objectsCreated: number
  edgesCreated: number
  boardId: string | null
  notes: string[]
}

const CATEGORY_COLOR: Record<string, string> = {
  Commercial: '#0ea5e9', Delivery: '#3b82f6', People: '#14b8a6', Risk: '#f97316',
}

export function TemplatesView() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [chosen, setChosen] = useState<Template | null>(null)
  const [result, setResult] = useState<(ApplyResult & { name: string }) | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['work', 'templates'],
    queryFn: () => api.get('/admin/work-os/templates').then(r => r.data.templates as Template[]),
  })

  const undo = useMutation({
    mutationFn: (runId: string) => api.post(`/admin/work-os/templates/runs/${runId}/undo`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work'] })
      setResult(null)
    },
  })

  const templates = data ?? []
  const categories = [...new Set(templates.map(t => t.category))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: T2, maxWidth: 640 }}>
          A template creates real objects and the relationships between them — not a board of
          placeholders. Everything it makes is scoreable by the intelligence layer and
          walkable by the decision layer the moment it exists.
        </p>
      </div>

      {isLoading && <Loading label="Loading templates…" />}

      {categories.map(cat => (
        <div key={cat}>
          <div style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: CATEGORY_COLOR[cat] ?? T2, fontWeight: 650, marginBottom: 10,
          }}>{cat}</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {templates.filter(t => t.category === cat).map(t => (
              <div key={t.key} style={{
                background: CARD, border: `1px solid ${BDR}`, borderRadius: 10,
                padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: T1 }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: T2, whiteSpace: 'nowrap' }}>
                    {t.timesApplied > 0 ? `used ${t.timesApplied}×` : 'never used'}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 12.5, color: T2, lineHeight: 1.5, flex: 1 }}>
                  {t.description}
                </p>

                <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: T2 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Layers size={12} /> {t.creates} objects
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Link2 size={12} /> {t.links} links
                  </span>
                </div>

                <button
                  onClick={() => { setChosen(t); setResult(null) }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    background: '#2564ea', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '8px 14px', fontSize: 12.5, fontWeight: 550, cursor: 'pointer',
                  }}
                >
                  <Play size={13} /> Use template
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {chosen && !result && (
        <ApplyModal
          template={chosen}
          onClose={() => setChosen(null)}
          onDone={r => { setResult({ ...r, name: chosen.name }); setChosen(null); qc.invalidateQueries({ queryKey: ['work'] }) }}
        />
      )}

      {result && (
        <ResultModal
          result={result}
          onClose={() => setResult(null)}
          onUndo={() => undo.mutate(result.runId)}
          undoing={undo.isPending}
          onOpenBoard={() => { setResult(null); navigate('../board') }}
        />
      )}
    </div>
  )
}

// ─── Apply ────────────────────────────────────────────────────────────────────

function ApplyModal({ template, onClose, onDone }: {
  template: Template
  onClose: () => void
  onDone: (r: ApplyResult) => void
}) {
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [createBoard, setCreateBoard] = useState(true)

  const apply = useMutation({
    mutationFn: () => api.post(`/admin/work-os/templates/${template.key}/apply`, {
      values: title.trim() ? { title: title.trim() } : undefined,
      startDate,
      createBoard,
    }).then(r => r.data as ApplyResult),
    onSuccess: onDone,
  })

  return (
    <Modal onClose={onClose} title={template.name}>
      <p style={{ margin: '0 0 16px', fontSize: 12.5, color: T2, lineHeight: 1.5 }}>
        This will create <strong style={{ color: T1 }}>{template.creates} objects</strong> and{' '}
        <strong style={{ color: T1 }}>{template.links} relationships</strong>, rooted at a{' '}
        {template.rootTypeName}. Due dates are calculated from the start date.
      </p>

      <Field label="Name">
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={`e.g. Acme Ltd — ${template.name.toLowerCase()}`}
          style={inputStyle}
        />
      </Field>

      <Field label="Start date" hint="Every task's deadline is offset from this.">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
      </Field>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: T1, cursor: 'pointer' }}>
        <input type="checkbox" checked={createBoard} onChange={e => setCreateBoard(e.target.checked)} />
        Create a board over the result
      </label>

      {apply.isError && <ErrorText err={apply.error} />}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={onClose} style={ghostBtn}>Cancel</button>
        <button onClick={() => apply.mutate()} disabled={apply.isPending} style={{ ...solidBtn, opacity: apply.isPending ? 0.6 : 1 }}>
          {apply.isPending ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          Create the work
        </button>
      </div>
    </Modal>
  )
}

// ─── Result ───────────────────────────────────────────────────────────────────

function ResultModal({ result, onClose, onUndo, undoing, onOpenBoard }: {
  result: ApplyResult & { name: string }
  onClose: () => void
  onUndo: () => void
  undoing: boolean
  onOpenBoard: () => void
}) {
  const ok = result.status === 'COMPLETED'
  return (
    <Modal onClose={onClose} title={ok ? 'Work created' : `Finished with issues — ${result.status}`}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        {ok
          ? <Check size={18} style={{ color: '#10b981' }} />
          : <AlertTriangle size={18} style={{ color: '#f59e0b' }} />}
        <span style={{ fontSize: 13.5, color: T1 }}>
          <strong>{result.objectsCreated}</strong> objects and{' '}
          <strong>{result.edgesCreated}</strong> relationships from {result.name}.
        </span>
      </div>

      {result.notes.length > 0 && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 8, padding: '10px 12px', marginBottom: 14,
        }}>
          <div style={{ fontSize: 11.5, color: T2, marginBottom: 6 }}>
            What did not happen, and why:
          </div>
          {result.notes.map((n, i) => (
            <div key={i} style={{ fontSize: 12, color: T1, padding: '2px 0' }}>• {n}</div>
          ))}
        </div>
      )}

      <p style={{ margin: '0 0 18px', fontSize: 12, color: T2, lineHeight: 1.5 }}>
        These are real ontology objects. Undo removes what was created, but keeps
        anything already edited.
      </p>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onUndo} disabled={undoing} style={{ ...ghostBtn, opacity: undoing ? 0.6 : 1 }}>
          {undoing ? <Loader2 size={13} className="animate-spin" /> : <Undo2 size={13} />} Undo
        </button>
        <button onClick={onOpenBoard} style={solidBtn}>
          Open the board <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  )
}

// ─── Shared pieces ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', background: SURF, color: T1, border: `1px solid ${BDR}`,
  borderRadius: 8, padding: '9px 11px', fontSize: 13,
}
const solidBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2564ea',
  color: '#fff', border: 'none', borderRadius: 8, padding: '9px 15px',
  fontSize: 12.5, fontWeight: 550, cursor: 'pointer',
}
const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent',
  color: T1, border: `1px solid ${BDR}`, borderRadius: 8, padding: '9px 15px',
  fontSize: 12.5, fontWeight: 550, cursor: 'pointer',
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: CARD, border: `1px solid ${BDR}`, borderRadius: 12,
          width: 'min(460px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 620, color: T1 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T2 }}>
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11.5, color: T2, marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: T2, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Loading({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center', color: T2, fontSize: 13, padding: 16 }}>
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
