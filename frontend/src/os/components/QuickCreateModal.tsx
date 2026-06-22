import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { LightningIcon, SquaresFourIcon, TargetIcon } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

export type CreateMode = 'lead' | 'project' | 'goal' | null

interface Props {
  mode: CreateMode
  onClose: () => void
}

const OVERLAY = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.18 },
}

const PANEL = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { opacity: 1, scale: 1,    y: 0 },
  exit:    { opacity: 0, scale: 0.97, y: 8 },
  transition: { type: 'spring', damping: 28, stiffness: 380 },
}

const MODE_META = {
  lead:    { label: 'New Lead',    icon: LightningIcon,   color: '#f59e0b' },
  project: { label: 'New Project', icon: SquaresFourIcon, color: '#2564ea' },
  goal:    { label: 'New Goal',    icon: TargetIcon,      color: '#10b981' },
}

// ─── Input styles ─────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-lg px-3 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-all duration-150 focus:ring-1'

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
}

const inputFocusRing = 'focus:ring-blue-500/40'

// ─── Subforms ─────────────────────────────────────────────────────────────────

function LeadForm({ onSuccess }: { onSuccess: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', subject: '', message: '' })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => api.post('/admin/contacts', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['contacts'] })
      onSuccess()
    },
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <form
      onSubmit={e => { e.preventDefault(); mutate() }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Name *</label>
          <input
            required
            autoFocus
            value={form.name}
            onChange={set('name')}
            placeholder="Jane Doe"
            className={`${inputClass} ${inputFocusRing}`}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="jane@company.com"
            className={`${inputClass} ${inputFocusRing}`}
            style={inputStyle}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Organization</label>
          <input
            value={form.organization}
            onChange={set('organization')}
            placeholder="Acme Corp"
            className={`${inputClass} ${inputFocusRing}`}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Phone</label>
          <input
            value={form.phone}
            onChange={set('phone')}
            placeholder="+1 555 0100"
            className={`${inputClass} ${inputFocusRing}`}
            style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Subject</label>
        <input
          value={form.subject}
          onChange={set('subject')}
          placeholder="Interested in BIDS™ engagement"
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Notes</label>
        <textarea
          value={form.message}
          onChange={set('message')}
          placeholder="Context, source, or next steps…"
          rows={3}
          className={`${inputClass} ${inputFocusRing} resize-none`}
          style={inputStyle}
        />
      </div>
      {isError && (
        <p className="text-[11px] text-red-400">
          {(error as any)?.response?.data?.error ?? 'Creation failed. Please try again.'}
        </p>
      )}
      <SubmitRow isPending={isPending} label="Create Lead" color="#f59e0b" />
    </form>
  )
}

function ProjectForm({ onSuccess }: { onSuccess: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ title: '', clientId: '', description: '', dueDate: '', category: 'Transformation' })

  const { data: clientsData } = useQuery({
    queryKey: ['crm-clients-slim'],
    queryFn: () => api.get('/admin/crm/clients?limit=100').then(r => r.data.clients ?? []),
    staleTime: 60_000,
  })
  const clients: { id: string; name: string }[] = clientsData ?? []

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => api.post('/admin/projects', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
      qc.invalidateQueries({ queryKey: ['pmo'] })
      onSuccess()
    },
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const selectStyle = {
    ...inputStyle,
    colorScheme: 'dark' as const,
  }

  return (
    <form onSubmit={e => { e.preventDefault(); mutate() }} className="flex flex-col gap-3">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Project Title *</label>
        <input
          required
          autoFocus
          value={form.title}
          onChange={set('title')}
          placeholder="e.g. Digital Transformation Phase 2"
          className={`${inputClass} ${inputFocusRing}`}
          style={inputStyle}
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Client *</label>
        <select
          required
          value={form.clientId}
          onChange={set('clientId')}
          className={`${inputClass} ${inputFocusRing}`}
          style={selectStyle}
        >
          <option value="">Select a client…</option>
          {clients.map((c: { id: string; name: string }) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={set('category')}
            className={`${inputClass} ${inputFocusRing}`}
            style={selectStyle}
          >
            <option>Transformation</option>
            <option>Run &amp; Maintain</option>
            <option>Innovation / R&amp;D</option>
            <option>Compliance</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={set('dueDate')}
            className={`${inputClass} ${inputFocusRing}`}
            style={{ ...inputStyle, colorScheme: 'dark' }}
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          placeholder="Scope, objectives, or context…"
          rows={3}
          className={`${inputClass} ${inputFocusRing} resize-none`}
          style={inputStyle}
        />
      </div>
      {isError && (
        <p className="text-[11px] text-red-400">
          {(error as any)?.response?.data?.error ?? 'Creation failed. Please try again.'}
        </p>
      )}
      <SubmitRow isPending={isPending} label="Create Project" color="#2564ea" />
    </form>
  )
}

function GoalForm({ onSuccess }: { onSuccess: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ objective: '', deadline: '', owner: '' })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/goals', {
      objective: form.objective,
      deadline: form.deadline || undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kimmp-goals'] })
      qc.invalidateQueries({ queryKey: ['goals'] })
      onSuccess()
    },
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); mutate() }} className="flex flex-col gap-3">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Objective *</label>
        <textarea
          required
          autoFocus
          value={form.objective}
          onChange={set('objective')}
          placeholder="What do you want KIMMP to achieve? Be specific and measurable."
          rows={4}
          className={`${inputClass} ${inputFocusRing} resize-none`}
          style={inputStyle}
        />
        <p className="mt-1 text-[10px] text-slate-700">KIMMP will decompose this into a strategy and task plan automatically.</p>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Deadline</label>
        <input
          type="date"
          value={form.deadline}
          onChange={set('deadline')}
          className={`${inputClass} ${inputFocusRing}`}
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
      </div>
      {isError && (
        <p className="text-[11px] text-red-400">
          {(error as any)?.response?.data?.error ?? (error as any)?.response?.data?.message ?? 'Goal creation failed. Please try again.'}
        </p>
      )}
      <SubmitRow isPending={isPending} label="Submit to KIMMP" color="#10b981" />
    </form>
  )
}

function SubmitRow({ isPending, label, color }: { isPending: boolean; label: string; color: string }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 h-8 px-4 rounded-lg text-white text-[13px] font-semibold transition-opacity disabled:opacity-60"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
        {isPending ? 'Creating…' : label}
      </button>
    </div>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function QuickCreateModal({ mode, onClose }: Props) {
  const [success, setSuccess] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSuccess(false)
  }, [mode])

  useEffect(() => {
    if (!mode) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mode, onClose])

  if (!mode) return null

  const meta = MODE_META[mode]
  const Icon = meta.icon

  const handleSuccess = () => {
    setSuccess(true)
    setTimeout(onClose, 1200)
  }

  return (
    <AnimatePresence>
      {mode && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
            {...OVERLAY}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            className="fixed z-[61] left-1/2 top-1/2 w-full max-w-[480px]"
            style={{ transform: 'translate(-50%, -50%)' }}
            {...PANEL}
          >
            <div
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: 'rgba(10,13,24,0.98)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.7)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
                  >
                    <Icon weight="fill" className="w-3.5 h-3.5" style={{ color: meta.color }} />
                  </div>
                  <h2 className="text-[14px] font-bold text-slate-100">{meta.label}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                {success ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
                    >
                      <Icon weight="fill" className="w-6 h-6" style={{ color: meta.color }} />
                    </div>
                    <p className="text-sm font-semibold text-slate-200">Created successfully</p>
                    <p className="text-[11px] text-slate-600">Closing…</p>
                  </div>
                ) : mode === 'lead' ? (
                  <LeadForm onSuccess={handleSuccess} />
                ) : mode === 'project' ? (
                  <ProjectForm onSuccess={handleSuccess} />
                ) : (
                  <GoalForm onSuccess={handleSuccess} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
