import { create } from 'zustand'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { spring } from '@os/motion'

// ── Store ─────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  message: string
  description?: string
  duration: number
}

interface ToastStore {
  toasts: ToastItem[]
  add: (t: Omit<ToastItem, 'id'>) => void
  remove: (id: string) => void
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add(t) {
    const id = Math.random().toString(36).slice(2, 9)
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter(x => x.id !== id) })), t.duration)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter(x => x.id !== id) })),
}))

// ── Imperative API ────────────────────────────────────────────────────────────

function add(type: ToastType, message: string, description?: string, duration = 4000) {
  useToastStore.getState().add({ type, message, description, duration })
}

export const toast = {
  success: (message: string, description?: string, duration?: number) => add('success', message, description, duration),
  error:   (message: string, description?: string, duration?: number) => add('error',   message, description, duration),
  warning: (message: string, description?: string, duration?: number) => add('warning', message, description, duration),
  info:    (message: string, description?: string, duration?: number) => add('info',    message, description, duration),
}

// ── Visual config ─────────────────────────────────────────────────────────────

const CONFIG = {
  success: { Icon: CheckCircle2, iconClass: 'text-[#059669]', bar: 'bg-[#059669]' },
  error:   { Icon: XCircle,      iconClass: 'text-[#ef4444]', bar: 'bg-[#ef4444]' },
  warning: { Icon: AlertTriangle,iconClass: 'text-[#d97706]', bar: 'bg-[#d97706]' },
  info:    { Icon: Info,          iconClass: 'text-[#2564ea]', bar: 'bg-[#2564ea]' },
} as const

// ── Renderer ──────────────────────────────────────────────────────────────────

export function Toaster() {
  const { toasts, remove } = useToastStore()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(t => {
          const { Icon, iconClass, bar } = CONFIG[t.type]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0,  scale: 1,    transition: spring.snappy }}
              exit={{    opacity: 0,         scale: 0.94, transition: { duration: 0.15 } }}
              className="pointer-events-auto relative flex items-start gap-3 min-w-[300px] max-w-sm px-4 py-3.5 bg-[#151C2F] border border-[#2E2854] rounded-xl overflow-hidden"
              style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}
            >
              {/* Semantic left stripe */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${bar}`} />

              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconClass}`} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug">{t.message}</p>
                {t.description && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{t.description}</p>
                )}
              </div>

              <button
                onClick={() => remove(t.id)}
                className="flex-shrink-0 text-slate-500 hover:text-white transition-colors mt-0.5"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
