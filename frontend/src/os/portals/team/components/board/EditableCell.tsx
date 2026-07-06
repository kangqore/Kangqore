import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label?: string
}

interface EditableCellProps {
  value: string
  type?: 'text' | 'select' | 'date'
  options?: Option[]
  displayColor?: string
  isBadge?: boolean
  onSave: (value: string) => void
  className?: string
  placeholder?: string
}

export function EditableCell({
  value, type = 'text', options, displayColor, isBadge, onSave, className, placeholder = '—',
}: EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)
  const ref = useRef<HTMLInputElement & HTMLSelectElement>(null)

  useEffect(() => { setDraft(value) }, [value])
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  function commit() {
    setEditing(false)
    if (draft !== value) onSave(draft)
  }

  if (editing) {
    if (type === 'select' && options) {
      return (
        <select
          ref={ref}
          value={draft}
          onChange={e => {
            setDraft(e.target.value)
            setEditing(false)
            if (e.target.value !== value) onSave(e.target.value)
          }}
          onBlur={() => setEditing(false)}
          className="bg-slate-800 border border-blue-500/50 rounded-lg px-2 py-1 text-xs text-white outline-none"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label ?? o.value}</option>
          ))}
        </select>
      )
    }
    return (
      <input
        ref={ref}
        type={type === 'date' ? 'date' : 'text'}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter')  commit()
          if (e.key === 'Escape') { setEditing(false); setDraft(value) }
        }}
        className="bg-slate-800 border border-blue-500/50 rounded-lg px-2 py-1 text-xs text-white outline-none w-full min-w-[100px]"
      />
    )
  }

  if (isBadge && displayColor) {
    return (
      <button
        onClick={() => setEditing(true)}
        title="Click to edit"
        className="text-xs font-semibold px-2 py-0.5 rounded-full transition-all hover:opacity-80 hover:ring-1 hover:ring-white/30 cursor-pointer"
        style={{ background: `${displayColor}22`, color: displayColor }}
      >
        {(value || '').replace(/_/g, ' ')}
      </button>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={`text-left text-sm hover:bg-white/5 rounded-lg px-1 py-0.5 transition-all w-full cursor-pointer ${className ?? ''}`}
    >
      {value
        ? <span className="text-[var(--os-text-1)]">{value}</span>
        : <span className="text-[var(--os-text-2)]">{placeholder}</span>
      }
    </button>
  )
}
