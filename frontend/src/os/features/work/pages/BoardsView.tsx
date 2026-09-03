// Boards — one reality, many views.
//
// Every other tab in this module is a purpose-built screen over a fixed shape:
// the Board tab renders work items in status columns, the Table tab renders
// work items in hardcoded columns. Useful, but each one is a separate
// implementation, and none of them can show you a Customer or a Contract.
//
// This screen is the other thing. It consumes BoardService, which had a
// complete backend — list, create, resolve, move, per-board ordering, a passing
// probe — and no consumer at all. A board here is a saved query plus a column
// configuration over the ontology, so:
//
//   • a board can be over ANY type; columns come from that type's own schema
//   • the same object can sit on several boards, and an edit anywhere moves the
//     one underlying object
//   • Kanban and Table below are two renderers over ONE resolved payload,
//     rather than two screens that each fetch and shape their own data
//
// The compiled query is shown deliberately. A board is a projection, not a copy,
// and the surest way to keep that true is to put the query on screen where a
// wrong one is visible.

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LayoutGrid, Table2, Plus, X, Loader2, Database, Eye, EyeOff, Code2, AlertTriangle,
} from 'lucide-react'
import { api } from '@lib/api'
import { errorMessage } from '../../../lib/errorMessage'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

/** Column classes, and what each one is for. Shown so the difference between a
 *  task list and a decision surface is legible rather than implied. */
const CLASS_COLOR: Record<string, string> = {
  CORE: '#64748b', ENTERPRISE: '#3b82f6', INTELLIGENCE: '#a855f7', GOVERNANCE: '#f97316',
}

interface ObjType {
  name: string; displayName: string; icon: string | null; color: string | null
  description: string | null; instances: number; columnCount: number
}
interface BoardSummary {
  id: string; name: string; description: string | null; icon: string | null
  rootTypeName: string; defaultView: string
  _count?: { columns: number; groups: number }
}
interface ColumnDef {
  id: string; header: string; field: string; type: string
  editable: boolean; options?: string[] | null
  colorMap?: Record<string, string> | null; width?: string; columnClass: string
}
interface Resolved {
  board: {
    id: string; name: string; description: string | null
    rootTypeName: string; defaultView: string; groupByField: string; statusField: string
  }
  columns: ColumnDef[]
  hiddenColumns: { id: string; header: string; columnClass: string }[]
  groups: { id: string; label: string; color: string; collapsed: boolean; items: any[] }[]
  ungrouped: any[]
  items: any[]
  total: number
  compiled?: any
  queryNote?: string
}

export function BoardsView() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [creating, setCreating] = useState(false)
  const [showQuery, setShowQuery] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const boardsQ = useQuery({
    queryKey: ['work', 'boards'],
    queryFn: () => api.get('/admin/work-os/boards').then(r => r.data.boards as BoardSummary[]),
  })

  const boardQ = useQuery({
    queryKey: ['work', 'boards', selected],
    queryFn: () => api.get(`/admin/work-os/boards/${selected}`).then(r => r.data as Resolved),
    enabled: !!selected,
  })

  const move = useMutation({
    mutationFn: (v: { objectId: string; toGroup: string }) =>
      api.post(`/admin/work-os/boards/${selected}/move`, v).then(r => r.data),
    onSuccess: () => {
      setError(null)
      // Invalidate every board, not just this one: the object moved in the
      // graph, so any other board showing it is now stale. That is the whole
      // point of board-as-view.
      qc.invalidateQueries({ queryKey: ['work', 'boards'] })
    },
    onError: e => setError(errorMessage(e, 'The move was refused')),
  })

  const boards = boardsQ.data ?? []
  const resolved = boardQ.data

  // Land on a board rather than a row of buttons. Also means the smoke test
  // exercises the resolve-and-render path instead of only the list — the
  // difference between a test that loads a page and one that proves it works.
  useEffect(() => {
    if (!selected && boards.length > 0) setSelected(boards[0].id)
  }, [boards, selected])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ margin: 0, fontSize: 13, color: T2, maxWidth: 720 }}>
        A board is a saved query over the object graph plus a column configuration — not a
        container that owns its rows. The same object can appear on several boards, and moving
        it on one board moves the object itself, so every other board sees the change.
      </p>

      {/* ── Board picker ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {boardsQ.isLoading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: T2 }} />}
        {boards.map(b => (
          <button
            key={b.id}
            onClick={() => { setSelected(b.id); setError(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px',
              borderRadius: 8, cursor: 'pointer', fontSize: 13,
              border: `1px solid ${selected === b.id ? '#3b82f6' : BDR}`,
              background: selected === b.id ? 'rgba(59,130,246,0.10)' : CARD,
              color: selected === b.id ? '#60a5fa' : T1,
              fontWeight: selected === b.id ? 600 : 500,
            }}
          >
            {b.name}
            <span style={{ fontSize: 11, color: T2 }}>{b.rootTypeName}</span>
          </button>
        ))}
        <button
          onClick={() => setCreating(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
            borderRadius: 8, border: `1px dashed ${BDR}`, background: 'transparent',
            color: T2, fontSize: 13, cursor: 'pointer',
          }}
        >
          <Plus className="w-3.5 h-3.5" /> New board
        </button>
      </div>

      {!boardsQ.isLoading && boards.length === 0 && (
        <Empty>
          No boards yet. Create one over any object type — its columns come from that type&apos;s
          schema, so there is nothing to configure.
        </Empty>
      )}

      {creating && (
        <CreateBoard
          onClose={() => setCreating(false)}
          onCreated={id => {
            setCreating(false); setSelected(id)
            qc.invalidateQueries({ queryKey: ['work', 'boards'] })
          }}
        />
      )}

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderRadius: 8, border: '1px solid rgba(249,115,22,0.35)',
          background: 'rgba(249,115,22,0.08)', color: '#fdba74', fontSize: 12.5,
        }}>
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── The resolved board ────────────────────────────────────────────── */}
      {selected && boardQ.isLoading && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: T2, fontSize: 13 }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Resolving the query…
        </div>
      )}

      {selected && boardQ.isError && (
        <Empty tone="error">{errorMessage(boardQ.error, 'That board could not be resolved')}</Empty>
      )}

      {resolved && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T1 }}>{resolved.board.name}</div>
            <span style={{ fontSize: 12, color: T2 }}>
              {resolved.total} {resolved.board.rootTypeName}
              {resolved.total === 1 ? '' : 's'} · grouped by {resolved.board.groupByField}
            </span>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <Toggle on={view === 'kanban'} onClick={() => setView('kanban')} icon={LayoutGrid} label="Kanban" />
              <Toggle on={view === 'table'} onClick={() => setView('table')} icon={Table2} label="Table" />
              <Toggle on={showQuery} onClick={() => setShowQuery(v => !v)} icon={Code2} label="Query" />
            </div>
          </div>

          {/* What the board is actually made of. */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {Object.entries(
              resolved.columns.reduce<Record<string, number>>((a, c) => {
                a[c.columnClass] = (a[c.columnClass] ?? 0) + 1; return a
              }, {}),
            ).map(([cls, n]) => (
              <span key={cls} style={chip(CLASS_COLOR[cls] ?? '#64748b')}>
                <Eye className="w-3 h-3" /> {n} {cls.toLowerCase()}
              </span>
            ))}
            {resolved.hiddenColumns.length > 0 && (
              <span style={chip('#64748b')}>
                <EyeOff className="w-3 h-3" /> {resolved.hiddenColumns.length} hidden
              </span>
            )}
          </div>

          {showQuery && (
            <pre style={{
              margin: 0, padding: 12, borderRadius: 8, border: `1px solid ${BDR}`,
              background: SURF, color: T2, fontSize: 11.5, overflowX: 'auto',
            }}>
              {JSON.stringify(resolved.compiled ?? { note: 'no compiled query returned' }, null, 2)}
              {resolved.queryNote ? `\n\n${resolved.queryNote}` : ''}
            </pre>
          )}

          {resolved.total === 0 ? (
            <Empty>
              The query is valid and matched nothing — there are no{' '}
              {resolved.board.rootTypeName} objects that satisfy this board&apos;s filters yet.
            </Empty>
          ) : view === 'kanban' ? (
            <Kanban
              resolved={resolved}
              dragging={dragging}
              setDragging={setDragging}
              onDrop={(objectId, toGroup) => move.mutate({ objectId, toGroup })}
              pending={move.isPending}
            />
          ) : (
            <TableRender resolved={resolved} />
          )}

          {resolved.ungrouped.length > 0 && (
            <Empty tone="warn">
              {resolved.ungrouped.length} item{resolved.ungrouped.length === 1 ? '' : 's'} hold a{' '}
              <code>{resolved.board.groupByField}</code> value with no matching group, so they
              appear in neither column. Shown here rather than dropped:{' '}
              {[...new Set(resolved.ungrouped.map(i => String(i[resolved.board.groupByField])))].join(', ')}
            </Empty>
          )}
        </>
      )}
    </div>
  )
}

/* ── Renderers — both over the same resolved payload ─────────────────────── */

function Kanban({ resolved, dragging, setDragging, onDrop, pending }: {
  resolved: Resolved
  dragging: string | null
  setDragging: (v: string | null) => void
  onDrop: (objectId: string, toGroup: string) => void
  pending: boolean
}) {
  // Only groups that hold something, plus the group being dragged over — a
  // twelve-state machine renders eleven empty columns otherwise.
  const shown = resolved.groups.filter(g => g.items.length > 0 || dragging)
  const titleField = resolved.columns.find(c => c.field === 'title' || c.field === 'name')?.field ?? 'title'

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, opacity: pending ? 0.6 : 1 }}>
      {shown.map(g => (
        <div
          key={g.id}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            if (dragging) onDrop(dragging, g.id)
            setDragging(null)
          }}
          style={{
            minWidth: 250, flex: '0 0 250px', borderRadius: 10,
            border: `1px solid ${BDR}`, background: SURF, padding: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: g.color }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: T1 }}>{g.label}</span>
            <span style={{ fontSize: 11, color: T2, marginLeft: 'auto' }}>{g.items.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {g.items.map(it => (
              <div
                key={it.id}
                draggable
                onDragStart={() => setDragging(it.id)}
                onDragEnd={() => setDragging(null)}
                style={{
                  padding: 10, borderRadius: 8, background: CARD,
                  border: `1px solid ${dragging === it.id ? '#3b82f6' : BDR}`,
                  cursor: 'grab', fontSize: 12.5, color: T1,
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 6 }}>
                  {String(it[titleField] ?? it.id)}
                </div>
                <CardFacts item={it} columns={resolved.columns} groupField={resolved.board.groupByField} />
              </div>
            ))}
            {g.items.length === 0 && (
              <div style={{ fontSize: 11, color: T2, padding: '10px 4px', textAlign: 'center' }}>
                drop here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Up to three secondary facts, chosen from the board's own columns rather than
 *  from a hardcoded list — so a Customer card shows ARR and a Task card shows
 *  priority, with no code for either. */
function CardFacts({ item, columns, groupField }: {
  item: any; columns: ColumnDef[]; groupField: string
}) {
  const facts = columns
    .filter(c => c.field !== groupField && c.field !== 'title' && c.field !== 'name')
    .filter(c => item[c.field] !== undefined && item[c.field] !== null && item[c.field] !== '')
    .slice(0, 3)
  if (!facts.length) return null

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {facts.map(c => {
        const raw = item[c.field]
        const colour = c.colorMap?.[String(raw)]
        return (
          <span key={c.id} style={chip(colour ?? (CLASS_COLOR[c.columnClass] ?? '#64748b'))}>
            {format(raw)}
          </span>
        )
      })}
    </div>
  )
}

function TableRender({ resolved }: { resolved: Resolved }) {
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${BDR}`, borderRadius: 10, background: CARD }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
        <thead>
          <tr>
            {resolved.columns.map(c => (
              <th key={c.id} style={{
                textAlign: 'left', padding: '9px 12px', color: T2, fontWeight: 600,
                whiteSpace: 'nowrap', borderBottom: `1px solid ${BDR}`,
                borderTop: `2px solid ${CLASS_COLOR[c.columnClass] ?? 'transparent'}`,
              }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resolved.items.map(it => (
            <tr key={it.id}>
              {resolved.columns.map(c => {
                const raw = it[c.field]
                const colour = c.colorMap?.[String(raw)]
                return (
                  <td key={c.id} style={{
                    padding: '8px 12px', borderBottom: `1px solid ${BDR}`,
                    color: colour ?? T1, whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {format(raw)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Create ──────────────────────────────────────────────────────────────── */

function CreateBoard({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [type, setType] = useState<ObjType | null>(null)
  const [name, setName] = useState('')
  const [withIntelligence, setWithIntelligence] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const typesQ = useQuery({
    queryKey: ['work', 'types'],
    queryFn: () => api.get('/admin/work-os/types').then(r => r.data.types as ObjType[]),
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/work-os/boards', {
      name: name || `${type!.displayName} board`,
      rootTypeName: type!.name,
      showClasses: withIntelligence
        ? ['CORE', 'ENTERPRISE', 'INTELLIGENCE', 'GOVERNANCE']
        : ['CORE', 'ENTERPRISE'],
    }).then(r => r.data),
    onSuccess: d => onCreated(d.board.id),
    onError: e => setErr(errorMessage(e, 'The board could not be created')),
  })

  // A board over a type with no instances renders an empty screen and looks
  // broken, so the count is on the button rather than discovered afterwards.
  const types = (typesQ.data ?? []).filter(t => t.columnCount > 0)

  return (
    <div style={{ border: `1px solid ${BDR}`, borderRadius: 10, background: CARD, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T1 }}>New board</span>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: T2 }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {typesQ.isLoading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: T2 }} />}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {types.map(t => (
          <button
            key={t.name}
            onClick={() => { setType(t); setName(`${t.displayName} board`) }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
              padding: '8px 11px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              border: `1px solid ${type?.name === t.name ? '#3b82f6' : BDR}`,
              background: type?.name === t.name ? 'rgba(59,130,246,0.10)' : SURF,
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 600, color: T1 }}>{t.displayName}</span>
            <span style={{ fontSize: 11, color: t.instances === 0 ? '#f97316' : T2 }}>
              {t.instances} object{t.instances === 1 ? '' : 's'} · {t.columnCount} columns
            </span>
          </button>
        ))}
      </div>

      {type && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Board name"
            style={{
              padding: '7px 10px', borderRadius: 7, border: `1px solid ${BDR}`,
              background: SURF, color: T1, fontSize: 12.5, minWidth: 220,
            }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T2, cursor: 'pointer' }}>
            <input type="checkbox" checked={withIntelligence} onChange={e => setWithIntelligence(e.target.checked)} />
            Include intelligence &amp; governance columns
          </label>
          <button
            onClick={() => { setErr(null); create.mutate() }}
            disabled={create.isPending}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 7, border: 'none', background: '#2564ea', color: '#fff',
              fontSize: 12.5, fontWeight: 600, cursor: create.isPending ? 'wait' : 'pointer',
            }}
          >
            {create.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            Create
          </button>
          {type.instances === 0 && (
            <span style={{ fontSize: 11.5, color: '#f97316' }}>
              This type has no objects — the board will render empty.
            </span>
          )}
        </div>
      )}

      {err && <div style={{ marginTop: 10, fontSize: 12, color: '#f97316' }}>{err}</div>}
    </div>
  )
}

/* ── Small pieces ────────────────────────────────────────────────────────── */

const chip = (colour: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '2px 7px', borderRadius: 99, fontSize: 10.5, fontWeight: 600,
  color: colour, background: `${colour}1a`, border: `1px solid ${colour}33`,
  whiteSpace: 'nowrap',
})

function Toggle({ on, onClick, icon: Icon, label }: {
  on: boolean; onClick: () => void; icon: any; label: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
        borderRadius: 7, fontSize: 12, cursor: 'pointer',
        border: `1px solid ${on ? '#3b82f6' : BDR}`,
        background: on ? 'rgba(59,130,246,0.10)' : 'transparent',
        color: on ? '#60a5fa' : T2,
      }}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  )
}

function Empty({ children, tone = 'quiet' }: { children: React.ReactNode; tone?: 'quiet' | 'warn' | 'error' }) {
  const colour = tone === 'error' ? '#ef4444' : tone === 'warn' ? '#f97316' : undefined
  return (
    <div style={{
      padding: '14px 16px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.6,
      border: `1px solid ${colour ? `${colour}55` : BDR}`,
      background: colour ? `${colour}12` : SURF,
      color: colour ?? T2,
    }}>
      {children}
    </div>
  )
}

/** Numbers stay numbers, dates shorten, everything else is text. Rendering an
 *  object here is what crashed six screens earlier, so this can only return a
 *  string. */
function format(v: any): string {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : v.toFixed(2)
  if (typeof v === 'boolean') return v ? 'yes' : 'no'
  if (Array.isArray(v)) return v.map(format).join(', ')
  if (typeof v === 'object') { try { return JSON.stringify(v).slice(0, 60) } catch { return '—' } }
  const s = String(v)
  const asDate = /^\d{4}-\d{2}-\d{2}T/.test(s) ? new Date(s) : null
  return asDate && !isNaN(asDate.getTime()) ? asDate.toISOString().slice(0, 10) : s
}
