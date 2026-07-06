import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Plus, Trash, Lock, LockOpen, Warning } from '@phosphor-icons/react'
import { api } from '@lib/api'

const CLASSIFICATIONS = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'SECRET'] as const
const PURPOSES = ['ANALYTICS', 'AI_TRAINING', 'REPORTING', 'AUDIT'] as const

const CLASS_STYLE: Record<string, { badge: string; icon: React.ElementType; label: string }> = {
  PUBLIC:       { badge: 'bg-green-500/10 text-green-400 border-green-500/20',    icon: LockOpen,    label: 'Public' },
  INTERNAL:     { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',       icon: Lock,        label: 'Internal' },
  CONFIDENTIAL: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',    icon: Warning,     label: 'Confidential' },
  SECRET:       { badge: 'bg-red-500/10 text-red-400 border-red-500/20',          icon: ShieldCheck, label: 'Secret' },
}

function fmt(d: string) {
  return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function AddMarkingModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    table: '', rowId: '', column: '',
    classification: 'INTERNAL' as typeof CLASSIFICATIONS[number],
    purposes: [] as string[],
    reason: '',
  })

  const create = useMutation({
    mutationFn: (data: typeof form) => api.post('/admin/ontology/markings', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['data-markings'] })
      onClose()
    },
  })

  const togglePurpose = (p: string) =>
    setForm(f => ({
      ...f,
      purposes: f.purposes.includes(p) ? f.purposes.filter(x => x !== p) : [...f.purposes, p],
    }))

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
        <div>
          <p className="text-sm font-bold text-[var(--os-text-1)]">Add Data Marking</p>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">
            Attach a security classification to a row or cell. This marking travels with the data.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Table', key: 'table', placeholder: 'e.g. clients' },
            { label: 'Row ID', key: 'rowId', placeholder: 'record ID' },
            { label: 'Column (optional)', key: 'column', placeholder: 'leave blank = whole row' },
            { label: 'Reason', key: 'reason', placeholder: 'why is this marked?' },
          ].map(f => (
            <div key={f.key} className={f.key === 'reason' || f.key === 'column' ? 'col-span-2' : ''}>
              <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-1 block">
                {f.label}
              </label>
              <input
                className="w-full bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg px-3 py-2 text-xs text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] focus:outline-none focus:border-[var(--os-accent)]"
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {/* Classification */}
        <div>
          <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-2 block">
            Classification
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {CLASSIFICATIONS.map(c => {
              const s = CLASS_STYLE[c]
              const Icon = s.icon
              return (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, classification: c }))}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-[10px] font-semibold transition-all ${
                    form.classification === c ? s.badge : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:border-[var(--os-text-2)]'
                  }`}
                >
                  <Icon size={14} />
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Purposes */}
        <div>
          <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-2 block">
            Allowed Purposes (PBAC)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PURPOSES.map(p => (
              <button
                key={p}
                onClick={() => togglePurpose(p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                  form.purposes.includes(p)
                    ? 'bg-[var(--os-accent)]/20 border-[var(--os-accent)] text-[var(--os-accent)]'
                    : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-[var(--os-text-2)] mt-1">
            Empty = unrestricted. Select to limit data access by purpose.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-[var(--os-border)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => create.mutate(form)}
            disabled={!form.table || !form.rowId || create.isPending}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--os-accent)] text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {create.isPending ? 'Saving…' : 'Apply Marking'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function MarkingsManager() {
  const qc = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)
  const [filterClass, setFilterClass] = useState<string>('')

  const { data, isLoading } = useQuery({
    queryKey: ['data-markings', filterClass],
    queryFn: () => api.get(`/admin/ontology/markings${filterClass ? `?classification=${filterClass}` : ''}`).then(r => r.data),
    staleTime: 30_000,
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/ontology/markings/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['data-markings'] }),
  })

  const markings: any[] = data?.markings ?? []

  const stats = CLASSIFICATIONS.reduce((acc, c) => {
    acc[c] = markings.filter(m => m.classification === c).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-5">
      {showAdd && <AddMarkingModal onClose={() => setShowAdd(false)} />}

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/kangqore-view/admin/ontology"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
        >
          <ArrowLeft size={12} /> Ontology
        </Link>
        <span className="text-[var(--os-border)]">/</span>
        <span className="text-[11px] font-semibold text-[var(--os-text-1)]">MBAC Markings</span>
        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--os-accent)] text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={12} weight="bold" /> Add Marking
        </button>
      </div>

      <div className="os-card p-4 bg-amber-500/5 border-amber-500/20">
        <p className="text-xs text-amber-300 font-semibold mb-0.5">Marking-Based Access Control (MBAC) + Purpose-Based (PBAC)</p>
        <p className="text-[11px] text-[var(--os-text-2)] leading-relaxed">
          Security labels are attached at the row or cell level and travel with the data regardless of which
          module or AI agent accesses it. Purpose restrictions limit access by <em>reason</em> — not just role.
        </p>
      </div>

      {/* Classification breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {CLASSIFICATIONS.map(c => {
          const s = CLASS_STYLE[c]
          const Icon = s.icon
          return (
            <button
              key={c}
              onClick={() => setFilterClass(filterClass === c ? '' : c)}
              className={`os-card p-4 flex flex-col items-start gap-2 transition-all border-2 ${
                filterClass === c ? `${s.badge} border-current` : 'border-transparent'
              }`}
            >
              <div className={`flex items-center gap-1.5 ${s.badge} px-2 py-0.5 rounded-full text-[10px] font-semibold border`}>
                <Icon size={11} /> {s.label}
              </div>
              <p className="text-2xl font-black text-[var(--os-text-1)]">{stats[c] ?? 0}</p>
            </button>
          )
        })}
      </div>

      {/* Markings table */}
      <div className="os-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--os-border)]">
              {['Classification', 'Table · Row · Column', 'Purposes', 'Reason', 'Created', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--os-border)]">
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-3 rounded bg-[var(--os-surface-0)] animate-pulse w-20" />
                  </td>
                ))}
              </tr>
            ))}
            {!isLoading && markings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--os-text-2)] text-sm">
                  No markings applied yet. Click "Add Marking" to classify a record.
                </td>
              </tr>
            )}
            {!isLoading && markings.map((m: any) => {
              const s = CLASS_STYLE[m.classification] ?? CLASS_STYLE.INTERNAL
              const Icon = s.icon
              return (
                <tr key={m.id} className="border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 w-fit ${s.badge}`}>
                      <Icon size={10} /> {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[var(--os-text-2)]">
                    {m.table}
                    <span className="text-[var(--os-text-1)] font-semibold"> · {String(m.rowId).slice(0, 10)}…</span>
                    {m.column && <span className="text-purple-400"> .{m.column}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {(m.purposes ?? []).length === 0 ? (
                      <span className="text-[10px] text-[var(--os-text-2)]">Unrestricted</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {(m.purposes as string[]).map((p: string) => (
                          <span key={p} className="text-[9px] bg-[var(--os-surface-0)] border border-[var(--os-border)] px-1.5 py-0.5 rounded text-[var(--os-text-2)]">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] max-w-[180px]">
                    <p className="truncate text-[11px]">{m.reason ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap text-[10px]">{fmt(m.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove.mutate(m.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[var(--os-text-2)] transition-colors"
                    >
                      <Trash size={13} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
