import { useState } from 'react'
import { Zap, Plus, Trash2, ChevronRight, ToggleLeft, ToggleRight, X } from 'lucide-react'

interface AutoRule {
  id:          string
  name:        string
  trigger:     string
  condition:   string
  action:      string
  enabled:     boolean
  executions:  number
  lastRun:     string
}

const INITIAL_RULES: AutoRule[] = [
  { id: 'AR-001', name: 'P1 Incident → Escalate',       trigger: 'Incident Created',  condition: 'Priority IS P1',              action: 'Notify #it-critical + Page On-Call',   enabled: true,  executions: 12, lastRun: '2h ago' },
  { id: 'AR-002', name: 'SLA Breach → Reassign',        trigger: 'SLA Status Changes', condition: 'SLA IS Breached',             action: 'Reassign to Senior + Notify Manager',  enabled: true,  executions: 4,  lastRun: '1d ago' },
  { id: 'AR-003', name: 'Resolved → Close Ticket',      trigger: 'Status Changes',     condition: 'Status IS Resolved',          action: 'Close Ticket + Notify Requester',      enabled: true,  executions: 47, lastRun: '30m ago' },
  { id: 'AR-004', name: 'Stale P3 → Reminder',          trigger: 'Scheduled (Daily)',  condition: 'Status IS Open AND Age > 3d', action: 'Notify Assignee + Add Comment',        enabled: false, executions: 31, lastRun: '1d ago' },
  { id: 'AR-005', name: 'High-Impact Change → CAB',     trigger: 'Change Created',     condition: 'Impact IS High',              action: 'Add to CAB Queue + Notify CAB Chair',  enabled: true,  executions: 8,  lastRun: '3d ago' },
]

const TRIGGERS   = ['Incident Created', 'Status Changes', 'SLA Status Changes', 'Priority Changes', 'Assignee Changes', 'Change Created', 'Scheduled (Daily)', 'Scheduled (Weekly)', 'Comment Added']
const COND_LEFT  = ['Priority', 'Status', 'SLA', 'Assignee', 'Age', 'Impact', 'Category']
const COND_OP    = ['IS', 'IS NOT', 'GREATER THAN', 'CONTAINS']
const COND_VAL   = ['P1', 'P2', 'P3', 'P4', 'Open', 'In Progress', 'Resolved', 'Breached', 'Met', 'Unassigned', 'High', 'Medium', 'Low', '3 Days', '7 Days']
const ACTIONS    = ['Notify #it-critical', 'Notify Assignee', 'Notify Manager', 'Page On-Call', 'Reassign to Senior', 'Close Ticket', 'Add Comment', 'Create Problem Record', 'Notify Requester', 'Add to CAB Queue + Notify CAB Chair']

function nextId(rules: AutoRule[]) {
  return `AR-${String(rules.length + 1).padStart(3, '0')}`
}

export function ITAutomations() {
  const [rules,       setRules]       = useState<AutoRule[]>(INITIAL_RULES)
  const [showBuilder, setShowBuilder] = useState(false)
  const [draft, setDraft] = useState({
    name: '', trigger: TRIGGERS[0], condLeft: COND_LEFT[0], condOp: COND_OP[0], condVal: COND_VAL[0], action: ACTIONS[0],
  })

  function toggle(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  function remove(id: string) {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  function createRule() {
    const r: AutoRule = {
      id:         nextId(rules),
      name:       draft.name || `${draft.trigger} → ${draft.action.split(' ')[0]}`,
      trigger:    draft.trigger,
      condition:  `${draft.condLeft} ${draft.condOp} ${draft.condVal}`,
      action:     draft.action,
      enabled:    true,
      executions: 0,
      lastRun:    'Never',
    }
    setRules(prev => [...prev, r])
    setShowBuilder(false)
    setDraft({ name: '', trigger: TRIGGERS[0], condLeft: COND_LEFT[0], condOp: COND_OP[0], condVal: COND_VAL[0], action: ACTIONS[0] })
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Automations</h1>
            <p className="text-[var(--os-text-2)] mt-1 text-sm">WHEN / IF / THEN rules — zero-code workflow automation.</p>
          </div>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Rules',    value: rules.filter(r => r.enabled).length.toString(),               color: '#2564ea' },
          { label: 'Runs (All Time)', value: rules.reduce((s, r) => s + r.executions, 0).toString(),       color: '#10B981' },
          { label: 'Disabled',        value: rules.filter(r => !r.enabled).length.toString(),              color: '#6B7280' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div className="space-y-2">
        {rules.map(r => (
          <div key={r.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  <p className="text-sm font-bold text-white">{r.name}</p>
                  <span className="text-xs text-[var(--os-text-2)] font-mono">{r.id}</span>
                  {r.enabled
                    ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Active</span>
                    : <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700/50 text-[var(--os-text-2)]">Disabled</span>
                  }
                </div>
                {/* Visual rule chain */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/20 font-medium">
                    WHEN {r.trigger}
                  </span>
                  <ChevronRight className="w-3 h-3 text-[var(--os-text-2)] flex-shrink-0" />
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/20 font-medium">
                    IF {r.condition}
                  </span>
                  <ChevronRight className="w-3 h-3 text-[var(--os-text-2)] flex-shrink-0" />
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-medium">
                    THEN {r.action}
                  </span>
                </div>
                <p className="text-xs text-[var(--os-text-2)] mt-2">{r.executions} runs · Last: {r.lastRun}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                <button onClick={() => toggle(r.id)} className="transition-colors">
                  {r.enabled
                    ? <ToggleRight className="w-6 h-6 text-blue-400" />
                    : <ToggleLeft  className="w-6 h-6 text-[var(--os-text-2)] hover:text-[var(--os-text-2)]" />
                  }
                </button>
                <button onClick={() => remove(r.id)} className="text-[var(--os-text-2)] hover:text-red-400 transition-colors p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rule builder modal */}
      {showBuilder && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowBuilder(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0D1628] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">New Automation Rule</h2>
                <button onClick={() => setShowBuilder(false)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-[var(--os-text-2)] mb-1.5 block">Rule Name <span className="text-[var(--os-text-2)]">(optional — auto-generated if blank)</span></label>
                <input
                  value={draft.name}
                  onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. P1 Incident → Immediate Escalation"
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-[var(--os-text-2)] outline-none focus:ring-1 focus:ring-blue-500/40"
                />
              </div>

              {/* WHEN */}
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-2">
                <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">WHEN — Trigger Event</p>
                <select
                  value={draft.trigger}
                  onChange={e => setDraft(p => ({ ...p, trigger: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                >
                  {TRIGGERS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* IF */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">IF — Condition</p>
                <div className="flex gap-2">
                  <select value={draft.condLeft} onChange={e => setDraft(p => ({ ...p, condLeft: e.target.value }))}
                    className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
                    {COND_LEFT.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={draft.condOp} onChange={e => setDraft(p => ({ ...p, condOp: e.target.value }))}
                    className="bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
                    {COND_OP.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <select value={draft.condVal} onChange={e => setDraft(p => ({ ...p, condVal: e.target.value }))}
                    className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
                    {COND_VAL.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              {/* THEN */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">THEN — Action</p>
                <select value={draft.action} onChange={e => setDraft(p => ({ ...p, action: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
                  {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/40 border border-white/10 flex-wrap">
                <span className="text-xs text-violet-300">WHEN {draft.trigger}</span>
                <ChevronRight className="w-3 h-3 text-[var(--os-text-2)]" />
                <span className="text-xs text-amber-300">IF {draft.condLeft} {draft.condOp} {draft.condVal}</span>
                <ChevronRight className="w-3 h-3 text-[var(--os-text-2)]" />
                <span className="text-xs text-emerald-300">THEN {draft.action}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowBuilder(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[var(--os-text-2)] bg-slate-800/60 border border-white/10 hover:text-[var(--os-text-1)] transition-colors">
                  Cancel
                </button>
                <button onClick={createRule}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors">
                  Create Rule
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
