// Everything known about one object, in one place.
//
// This is the answer to context fragmentation: the record, the conversation
// about it, what has happened to it, and what the intelligence layer computed —
// side by side rather than in four systems. The tabs are deliberately in that
// order, because that is the order someone asks the questions in.

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  X, Send, MessageSquare, History, Sparkles, FileText, Loader2,
  AlertTriangle, Bot, CornerDownRight,
} from 'lucide-react'
import { api } from '@lib/api'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

type Tab = 'details' | 'thread' | 'ledger' | 'intelligence'

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'details',      label: 'Details',      icon: FileText },
  { id: 'thread',       label: 'Thread',       icon: MessageSquare },
  { id: 'ledger',       label: 'Activity',     icon: History },
  { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
]

/** Author styling: an agent post must be visibly not a person's. */
const AUTHOR_TONE: Record<string, { color: string; label: string }> = {
  HUMAN:      { color: T1,        label: '' },
  KIMMP:      { color: '#8b5cf6', label: 'KIMMP' },
  AEGIS:      { color: '#0ea5e9', label: 'AEGIS' },
  AUTOMATION: { color: '#14b8a6', label: 'Automation' },
}

const SOURCE_TONE: Record<string, string> = {
  EVENT: '#f59e0b', ACTION: '#10b981', MISSION: '#8b5cf6', COMMENT: '#64748b',
}

export function ObjectDetailPanel({ objectId, title, onClose }: {
  objectId: string; title?: string; onClose: () => void
}) {
  const [tab, setTab] = useState<Tab>('details')

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'flex-end', zIndex: 70,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: CARD, borderLeft: `1px solid ${BDR}`,
          width: 'min(620px, 100%)', height: '100%',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BDR}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16.5, fontWeight: 620, color: T1, lineHeight: 1.35 }}>
              {title ?? 'Object'}
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T2 }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 2, marginTop: 12 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '7px 11px', fontSize: 12.5, borderRadius: 7,
                  color: tab === t.id ? '#2564ea' : T2,
                  fontWeight: tab === t.id ? 600 : 500,
                  borderBottom: tab === t.id ? '2px solid #2564ea' : '2px solid transparent',
                }}
              >
                <t.icon size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {tab === 'details' && <DetailsTab objectId={objectId} />}
          {tab === 'thread' && <ThreadTab objectId={objectId} />}
          {tab === 'ledger' && <LedgerTab objectId={objectId} />}
          {tab === 'intelligence' && <IntelligenceTab objectId={objectId} />}
        </div>
      </div>
    </div>
  )
}

// ─── Details ──────────────────────────────────────────────────────────────────

function DetailsTab({ objectId }: { objectId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['work', 'item', objectId],
    queryFn: () => api.get('/admin/work-os/work/items', { params: { limit: 500 } })
      .then(r => (r.data as any[]).find(i => i.id === objectId)),
  })
  if (isLoading) return <Loading label="Loading…" />
  if (!data) return <Empty text="This object is not a work item, so it has no flattened view." />

  const rows: [string, any][] = Object.entries(data).filter(
    ([k, v]) => !['id', 'objectId'].includes(k) && v !== null && v !== '' &&
      !(Array.isArray(v) && v.length === 0),
  )

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} style={{ borderBottom: `1px solid ${BDR}` }}>
            <td style={{ padding: '9px 0', color: T2, width: 170, verticalAlign: 'top' }}>
              {k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}
            </td>
            <td style={{ padding: '9px 0', color: T1, wordBreak: 'break-word' }}>
              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Thread ───────────────────────────────────────────────────────────────────

function ThreadTab({ objectId }: { objectId: string }) {
  const qc = useQueryClient()
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: string; body: string } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['thread', objectId],
    queryFn: () => api.get(`/admin/work-os/objects/${objectId}/thread`).then(r => r.data),
  })
  const { data: vocab } = useQuery({
    queryKey: ['thread', 'reactions'],
    queryFn: () => api.get('/admin/work-os/thread/reactions').then(r => r.data.reactions),
    staleTime: Infinity,
  })

  const post = useMutation({
    mutationFn: () => api.post(`/admin/work-os/objects/${objectId}/thread`, {
      body, parentId: replyTo?.id,
    }),
    onSuccess: () => {
      setBody(''); setReplyTo(null)
      qc.invalidateQueries({ queryKey: ['thread', objectId] })
      qc.invalidateQueries({ queryKey: ['ledger', objectId] })
    },
  })
  const react = useMutation({
    mutationFn: ({ id, reaction }: { id: string; reaction: string }) =>
      api.post(`/admin/work-os/comments/${id}/react`, { reaction }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['thread', objectId] }),
  })

  if (isLoading) return <Loading label="Loading thread…" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 9, padding: 12 }}>
        {replyTo && (
          <div style={{
            display: 'flex', gap: 7, alignItems: 'center', fontSize: 11.5, color: T2,
            marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${BDR}`,
          }}>
            <CornerDownRight size={12} /> Replying to “{replyTo.body.slice(0, 46)}…”
            <button onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T2, marginLeft: 'auto' }}>
              <X size={12} />
            </button>
          </div>
        )}
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write an update. Mention a role with @approver, @owner, @reviewer…"
          rows={3}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: T1, fontSize: 13, resize: 'vertical', fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: T2 }}>
            A role mention routes to whoever holds that role on this object.
          </span>
          <button
            onClick={() => post.mutate()}
            disabled={!body.trim() || post.isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, background: '#2564ea',
              color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px',
              fontSize: 12, fontWeight: 550, cursor: body.trim() ? 'pointer' : 'not-allowed',
              opacity: body.trim() && !post.isPending ? 1 : 0.5,
            }}
          >
            {post.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Post
          </button>
        </div>
      </div>

      {data?.comments?.length === 0 && <Empty text="Nothing has been said about this yet." />}

      {data?.comments?.map((c: any) => (
        <CommentBlock key={c.id} c={c} vocab={vocab} onReply={setReplyTo}
          onReact={(id, reaction) => react.mutate({ id, reaction })} />
      ))}
    </div>
  )
}

function CommentBlock({ c, vocab, onReply, onReact, depth = 0 }: any) {
  const tone = AUTHOR_TONE[c.authorType] ?? AUTHOR_TONE.HUMAN
  return (
    <div style={{ marginLeft: depth * 22 }}>
      <div style={{
        background: c.authorType === 'HUMAN' ? 'transparent' : `${tone.color}0d`,
        border: `1px solid ${c.authorType === 'HUMAN' ? BDR : tone.color + '33'}`,
        borderRadius: 9, padding: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          {c.authorType !== 'HUMAN' && <Bot size={13} style={{ color: tone.color }} />}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: tone.color }}>
            {tone.label || c.authorId || 'Someone'}
          </span>
          <span style={{ fontSize: 11, color: T2 }}>
            {new Date(c.createdAt).toLocaleString()}
          </span>
        </div>

        <div style={{ fontSize: 13, color: T1, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{c.body}</div>

        {c.mentions?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {c.mentions.map((m: any) => (
              <span key={m.id} style={{
                fontSize: 10.5, padding: '2px 7px', borderRadius: 999,
                background: 'rgba(37,100,234,0.1)', color: '#2564ea',
              }}>
                @{m.role ?? m.userId}{m.kind === 'ROLE' && m.userId ? ` → ${m.userId}` : ''}
              </span>
            ))}
          </div>
        )}

        {/* Evidence an agent attached — the reason its post is checkable. */}
        {Array.isArray(c.evidence) && c.evidence.length > 0 && (
          <div style={{ fontSize: 11, color: T2, marginTop: 8 }}>
            {c.evidence.length} piece(s) of evidence attached
          </div>
        )}

        <div style={{ display: 'flex', gap: 5, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {(vocab ?? []).map((r: any) => {
            const n = c.reactionCounts?.[r.key] ?? 0
            return (
              <button
                key={r.key}
                title={r.label}
                onClick={() => onReact(c.id, r.key)}
                style={{
                  background: n > 0 ? 'rgba(37,100,234,0.1)' : 'transparent',
                  border: `1px solid ${n > 0 ? 'rgba(37,100,234,0.3)' : BDR}`,
                  borderRadius: 999, padding: '2px 7px', fontSize: 11, cursor: 'pointer',
                  color: T1, display: 'inline-flex', gap: 3, alignItems: 'center',
                }}
              >
                {r.emoji}{n > 0 && <span>{n}</span>}
              </button>
            )
          })}
          <button
            onClick={() => onReply({ id: c.id, body: c.body })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: T2, fontSize: 11.5, marginLeft: 4 }}
          >
            Reply
          </button>
        </div>
      </div>

      {c.replies?.map((r: any) => (
        <div key={r.id} style={{ marginTop: 8 }}>
          <CommentBlock c={r} vocab={vocab} onReply={onReply} onReact={onReact} depth={depth + 1} />
        </div>
      ))}
    </div>
  )
}

// ─── Ledger ───────────────────────────────────────────────────────────────────

function LedgerTab({ objectId }: { objectId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ledger', objectId],
    queryFn: () => api.get(`/admin/work-os/objects/${objectId}/ledger`).then(r => r.data),
  })
  if (isLoading) return <Loading label="Assembling the ledger…" />
  if (!data?.entries?.length) return <Empty text="Nothing has happened to this object yet." />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 11.5, color: T2 }}>
        {Object.entries(data.counts).map(([k, v]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: SOURCE_TONE[k] ?? T2 }} />
            {String(v)} {k.toLowerCase()}
          </span>
        ))}
      </div>

      {data.entries.map((e: any, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
            <span style={{
              width: 9, height: 9, borderRadius: 999,
              background: SOURCE_TONE[e.source] ?? T2,
              // A hollow dot means it observed rather than changed anything.
              boxShadow: e.mutating ? 'none' : `inset 0 0 0 2px ${CARD}`,
            }} />
            {i < data.entries.length - 1 && <span style={{ flex: 1, width: 1, background: BDR, marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: T1, fontWeight: 550 }}>{e.title}</span>
              <span style={{ fontSize: 11, color: T2 }}>
                {new Date(e.at).toLocaleString()}{e.actor ? ` · ${e.actor}` : ''}
              </span>
              {!e.mutating && (
                <span style={{ fontSize: 10, color: T2, border: `1px solid ${BDR}`, borderRadius: 999, padding: '1px 6px' }}>
                  no change
                </span>
              )}
            </div>
            {e.detail && (
              <div style={{ fontSize: 12.5, color: T2, marginTop: 3, lineHeight: 1.5 }}>{e.detail}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Intelligence ─────────────────────────────────────────────────────────────

function IntelligenceTab({ objectId }: { objectId: string }) {
  const { data: item } = useQuery({
    queryKey: ['work', 'item', objectId],
    queryFn: () => api.get('/admin/work-os/work/items', { params: { limit: 500 } })
      .then(r => (r.data as any[]).find(i => i.id === objectId)),
  })
  const { data: fields } = useQuery({
    queryKey: ['fields', item?.type],
    enabled: !!item?.type,
    queryFn: () => api.get('/admin/work-os/fields', { params: { typeName: item.type } })
      .then(r => r.data.fields),
  })

  if (!fields) return <Loading label="Loading fields…" />
  if (!fields.length) return <Empty text={`No intelligence fields are defined for ${item?.type}.`} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {fields.map((f: any) => (
        <FieldRow key={f.id} field={f} objectId={objectId} />
      ))}
    </div>
  )
}

function FieldRow({ field, objectId }: { field: any; objectId: string }) {
  const [open, setOpen] = useState(false)
  const { data: why, isLoading } = useQuery({
    queryKey: ['explain', objectId, field.outputField],
    enabled: open,
    queryFn: () => api.get(`/admin/work-os/objects/${objectId}/explain/${field.outputField}`).then(r => r.data),
  })

  return (
    <div style={{ border: `1px solid ${BDR}`, borderRadius: 9, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: SURF, border: 'none', cursor: 'pointer',
          padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 13, color: T1, fontWeight: 550, flex: 1 }}>{field.name}</span>
        {!field.enabled && (
          <span style={{ fontSize: 10, color: T2, border: `1px solid ${BDR}`, borderRadius: 999, padding: '1px 7px' }}>
            off
          </span>
        )}
        <span style={{ fontSize: 10.5, color: T2 }}>T{field.governanceTier} · {field.compute.toLowerCase()}</span>
      </button>

      {open && (
        <div style={{ padding: 13, borderTop: `1px solid ${BDR}` }}>
          {isLoading && <Loading label="Loading…" />}
          {why && !why.computed && (
            <div style={{ fontSize: 12.5, color: T2, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
              <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
              {/* The honest state: not computed, and why. */}
              <span>{why.reason ?? why.error ?? 'This field has not produced a value for this object.'}</span>
            </div>
          )}
          {why?.computed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 19, fontWeight: 650, color: T1 }}>
                  {typeof why.value === 'number' ? why.value : String(why.value).slice(0, 90)}
                </span>
                {why.confidence != null && (
                  <span style={{ fontSize: 11.5, color: T2 }}>{Math.round(why.confidence * 100)}% confidence</span>
                )}
                {why.changedFrom != null && (
                  <span style={{ fontSize: 11.5, color: T2 }}>was {String(why.changedFrom)}</span>
                )}
              </div>
              {Array.isArray(why.evidence) && why.evidence.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: T2, marginBottom: 4 }}>Why:</div>
                  {why.evidence.map((e: string, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: T1, padding: '1px 0' }}>• {e}</div>
                  ))}
                </div>
              )}
              <div style={{ fontSize: 11, color: T2 }}>
                Tier {why.tier} — {why.tierMeaning}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function Loading({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center', color: T2, fontSize: 13, padding: 12 }}>
      <Loader2 size={15} className="animate-spin" /> {label}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div style={{
      border: `1px dashed ${BDR}`, borderRadius: 9, padding: '22px 16px',
      textAlign: 'center', color: T2, fontSize: 12.5,
    }}>
      {text}
    </div>
  )
}
