import { useState } from 'react'
import { CalendarCheck, Send, Circle } from 'lucide-react'

const PAST_STANDUPS = [
  {
    date: 'Today, 9:00 AM', author: 'Arjun Sharma',
    did: 'Completed entity graph schema design. Reviewed PR #218.',
    doing: 'Wiring entity graph into Ops Centre — Entity Graph page.',
    blocked: 'None.',
  },
  {
    date: 'Today, 9:05 AM', author: 'Priya Nair',
    did: 'Finished AEGIS Phase 2 stub agents (7/10 complete).',
    doing: 'Completing remaining 3 AEGIS agent stubs. Writing unit tests.',
    blocked: 'Need backend schema for AuditLog to be finalised.',
  },
  {
    date: 'Yesterday, 9:02 AM', author: 'Rohan Mehta',
    did: 'Mapped 42 SOC 2 controls to current system state.',
    doing: 'Completing remaining SOC 2 control mappings. Uploading evidence.',
    blocked: 'Waiting on legal sign-off for data processing record.',
  },
  {
    date: 'Yesterday, 9:10 AM', author: 'Sneha Gupta',
    did: 'Built Client Portal — Executive Report redesign.',
    doing: 'Finalising responsive layout for Executive Report page.',
    blocked: 'Design freeze on header typography — awaiting Kavya feedback.',
  },
  {
    date: '21 Jun, 9:00 AM', author: 'Kavya Reddy',
    did: 'Completed BIDS™ Rail edition wireframes (v1).',
    doing: 'Iterating on wireframes based on C.O.D.E. feedback.',
    blocked: 'None.',
  },
]

export function SharedStandups() {
  const [form, setForm] = useState({ did: '', doing: '', blocked: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!form.did.trim() || !form.doing.trim()) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ did: '', doing: '', blocked: '' })
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <CalendarCheck className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Async Standups</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Post your daily update. KIMMP reads these to track blockers and delivery signals.</p>
        </div>
      </div>

      {/* Post standup form */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)]">Post Today's Standup</h2>
        {[
          { key: 'did',     label: '✅ What did you do yesterday?', placeholder: 'Completed the entity graph schema design…' },
          { key: 'doing',   label: '🔄 What are you doing today?',  placeholder: 'Wiring entity graph into Ops Centre…' },
          { key: 'blocked', label: '🚫 Any blockers?',              placeholder: 'None. / Waiting on design freeze…' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1.5">{f.label}</label>
            <textarea
              value={(form as any)[f.key]}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              rows={2}
              className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
            />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }}
          >
            <Send className="w-3.5 h-3.5" />
            Post Standup
          </button>
          {submitted && <p className="text-xs text-emerald-400 font-medium">✓ Standup posted — KIMMP will read this.</p>}
        </div>
      </div>

      {/* Past standups */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Recent Standups</h2>
        {PAST_STANDUPS.map((s, i) => (
          <div key={i} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{s.author}</p>
              <p className="text-xs text-[var(--os-text-2)]">{s.date}</p>
            </div>
            {[
              { label: 'Did',     value: s.did,     color: '#10B981' },
              { label: 'Doing',   value: s.doing,   color: '#2564ea' },
              { label: 'Blocked', value: s.blocked, color: s.blocked === 'None.' ? 'var(--os-text-2)' : '#EF4444' },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-2">
                <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" style={{ color: row.color }} />
                <div>
                  <span className="text-xs font-semibold text-[var(--os-text-2)] uppercase">{row.label}: </span>
                  <span className="text-sm text-[var(--os-text-1)]">{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
