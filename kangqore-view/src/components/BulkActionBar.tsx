import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface BulkAction {
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'danger'
  onClick: () => void
}

interface BulkActionGroup {
  label: string
  options: { value: string; label: string }[]
  onSelect: (value: string) => void
}

interface BulkActionBarProps {
  count: number
  onClear: () => void
  actions?: BulkAction[]
  groups?: BulkActionGroup[]
}

function DropdownGroup({ group }: { group: BulkActionGroup }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2D4A] text-slate-200 text-xs font-semibold hover:bg-[#2E3D5A] transition-colors border border-os-border"
      >
        {group.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute bottom-full mb-2 left-0 min-w-[140px] bg-os-s1 border border-os-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {group.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { group.onSelect(opt.value); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#1E2D4A] transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function BulkActionBar({ count, onClear, actions = [], groups = [] }: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-os-border shadow-2xl shadow-black/60"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <span className="text-white text-sm font-bold min-w-[80px]">
            {count} selected
          </span>
          <div className="w-px h-5 bg-[#2E2854]" />

          <div className="flex items-center gap-2">
            {groups.map(g => <DropdownGroup key={g.label} group={g} />)}

            {actions.map(action => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  action.variant === 'danger'
                    ? 'bg-red-900/30 text-red-400 border-red-700/40 hover:bg-red-900/50'
                    : 'bg-[#1E2D4A] text-slate-200 border-os-border hover:bg-[#2E3D5A]'
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-[#2E2854]" />
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-[#1E2D4A] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
