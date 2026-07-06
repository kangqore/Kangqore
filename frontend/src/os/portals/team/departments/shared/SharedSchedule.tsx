import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Brain, X } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'OFF' | 'LEAVE'

export interface Shift {
  memberId:  string
  day:       number
  shiftType: ShiftType
}

export interface ScheduleMember {
  id:       string
  name:     string
  initials: string
  color:    string
  role:     string
}

interface Props {
  config:  DeptConfig
  members: ScheduleMember[]
  shifts:  Shift[]
}

const DAYS     = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SHIFT_TYPES: ShiftType[] = ['MORNING', 'AFTERNOON', 'NIGHT', 'OFF', 'LEAVE']

const S_STYLE: Record<ShiftType, { bg: string; text: string; label: string }> = {
  MORNING:   { bg: '#6366F120', text: '#818CF8', label: 'AM' },
  AFTERNOON: { bg: '#06B6D420', text: '#22D3EE', label: 'PM' },
  NIGHT:     { bg: '#33415540', text: '#94A3B8', label: 'Night' },
  OFF:       { bg: 'transparent', text: 'var(--os-text-2)', label: 'Off' },
  LEAVE:     { bg: '#F59E0B15', text: '#F59E0B', label: 'Leave' },
}

const KIMMP_FORECAST = [
  'Monday predicted 38% higher volume — post-weekend backlog + 2 client deployments scheduled.',
  'Wednesday coverage gap: only 2 agents on Morning shift. Recommend adding 1 more to meet SLA.',
  'Friday afternoon historically lowest demand — consider shifting cover to Thursday.',
]

export function SharedSchedule({ config, members, shifts: initialShifts }: Props) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [shifts,     setShifts]     = useState<Shift[]>(initialShifts)
  const [modal,      setModal]       = useState(false)
  const [form,       setForm]        = useState({ memberId: '', day: 0, shiftType: 'MORNING' as ShiftType })
  const accent = config.accentColor

  function getShift(memberId: string, day: number): ShiftType | null {
    return shifts.find(s => s.memberId === memberId && s.day === day)?.shiftType ?? null
  }

  function coverage(day: number): number {
    return shifts.filter(s => s.day === day && s.shiftType !== 'OFF' && s.shiftType !== 'LEAVE').length
  }

  function addShift() {
    setShifts(prev => {
      const filtered = prev.filter(s => !(s.memberId === form.memberId && s.day === form.day))
      return [...filtered, { memberId: form.memberId, day: form.day, shiftType: form.shiftType }]
    })
    setModal(false)
  }

  const weekLabel = weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="w-8 h-8 rounded-lg bg-slate-800/60 border border-white/10 flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-sm font-bold text-white w-24 text-center">{weekLabel}</p>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="w-8 h-8 rounded-lg bg-slate-800/60 border border-white/10 flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: accent }}
        >
          <Plus className="w-4 h-4" /> Add Shift
        </button>
      </div>

      {/* Shift legend */}
      <div className="flex gap-3 flex-wrap">
        {SHIFT_TYPES.map(t => (
          <span key={t} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: S_STYLE[t].bg === 'transparent' ? '#1E293B' : S_STYLE[t].bg }} />
            <span className="text-[var(--os-text-2)]">{S_STYLE[t].label}</span>
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-4 py-3 w-40">Member</th>
              {DAYS.map(d => (
                <th key={d} className="text-center text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider py-3 w-16">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="border-b border-white/[0.05] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0"
                      style={{ background: `${m.color}25`, color: m.color }}>
                      {m.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{m.name}</p>
                      <p className="text-xs text-[var(--os-text-2)]">{m.role}</p>
                    </div>
                  </div>
                </td>
                {DAYS.map((_, day) => {
                  const type = getShift(m.id, day)
                  const st = type ? S_STYLE[type] : null
                  return (
                    <td key={day} className="py-2 px-1 text-center">
                      {st && type !== 'OFF' ? (
                        <span
                          className="inline-block text-xs font-semibold px-1.5 py-1 rounded-md w-full cursor-default"
                          style={{ background: st.bg, color: st.text }}
                        >
                          {st.label}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--os-text-2)]">–</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {/* Coverage row */}
            <tr className="bg-slate-900/40 border-t border-white/10">
              <td className="px-4 py-3 text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Coverage</td>
              {DAYS.map((_, day) => {
                const cnt   = coverage(day)
                const warn  = cnt < 3
                return (
                  <td key={day} className="py-3 text-center">
                    <span className="text-xs font-bold" style={{ color: warn ? '#EF4444' : '#10B981' }}>
                      {cnt}
                    </span>
                    {warn && <p className="text-xs text-red-500">Low</p>}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* KIMMP forecast strip */}
      <div className="p-4 rounded-2xl border" style={{ background: `${accent}07`, borderColor: `${accent}25` }}>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>KIMMP Schedule Intelligence</p>
        </div>
        <div className="space-y-2">
          {KIMMP_FORECAST.map((line, i) => (
            <p key={i} className="text-xs text-[var(--os-text-1)] leading-relaxed">· {line}</p>
          ))}
        </div>
      </div>

      {/* Add Shift Modal */}
      {modal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 rounded-2xl bg-[#0D1628] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-white">Add Shift</p>
              <button onClick={() => setModal(false)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--os-text-2)] mb-1.5">Member</p>
                <select
                  value={form.memberId}
                  onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="">Select member…</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs text-[var(--os-text-2)] mb-1.5">Day</p>
                <select
                  value={form.day}
                  onChange={e => setForm(f => ({ ...f, day: Number(e.target.value) }))}
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                >
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs text-[var(--os-text-2)] mb-1.5">Shift</p>
                <div className="flex gap-2 flex-wrap">
                  {SHIFT_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setForm(f => ({ ...f, shiftType: t }))}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={form.shiftType === t
                        ? { background: accent, color: '#fff' }
                        : { background: '#1E293B', color: 'var(--os-text-2)' }}
                    >
                      {S_STYLE[t].label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={addShift}
                disabled={!form.memberId}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all"
                style={{ background: accent }}
              >
                Save Shift
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
