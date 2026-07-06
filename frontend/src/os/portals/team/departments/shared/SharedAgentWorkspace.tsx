import { useState } from 'react'
import { Clock, MessageSquare, Send, Paperclip, AtSign, Brain, X } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export interface WorkspaceItem {
  id:       string
  title:    string
  priority: 'P1' | 'P2' | 'P3' | 'P4'
  status:   string
  assignee: string
  sla:      string
  slaOk:    boolean
  opened:   string
  category?: string
}

export interface WorkspaceAgent {
  id:            string
  name:          string
  initials:      string
  status:        'ONLINE' | 'ON_ITEM' | 'IDLE' | 'OFFLINE'
  currentItemId: string | null
  color:         string
}

interface Props {
  config:          DeptConfig
  items:           WorkspaceItem[]
  agents:          WorkspaceAgent[]
  kimmContextFn?:  (item: WorkspaceItem) => string[]
}

type QFilter = 'mine' | 'all' | 'at_risk' | 'unassigned'

const P_COLOR: Record<string, string> = { P1: '#EF4444', P2: '#F97316', P3: '#F59E0B', P4: '#6B7280' }
const A_DOT:   Record<string, string> = { ONLINE: '#10B981', ON_ITEM: '#2564ea', IDLE: '#F59E0B', OFFLINE: 'var(--os-text-2)' }

const SEED_THREAD = [
  { author: 'Arjun S.', text: 'Investigating — VPN certificate renewal job failed silently. Escalating to Rohan.', time: '2h ago' },
  { author: 'Rohan M.', text: '@Arjun S. Confirmed. Renewing manually now. ETA 30 min.', time: '1h ago' },
]

export function SharedAgentWorkspace({ config, items, agents, kimmContextFn }: Props) {
  const [filter,   setFilter]   = useState<QFilter>('mine')
  const [openTabs, setOpenTabs] = useState<WorkspaceItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft,    setDraft]    = useState('')
  const [threads,  setThreads]  = useState<Record<string, typeof SEED_THREAD>>({})

  const accent = config.accentColor

  const filtered = items.filter(i => {
    if (filter === 'mine')       return i.assignee !== 'Unassigned'
    if (filter === 'at_risk')    return !i.slaOk
    if (filter === 'unassigned') return i.assignee === 'Unassigned'
    return true
  })

  function openItem(item: WorkspaceItem) {
    setOpenTabs(prev => {
      if (prev.find(t => t.id === item.id)) return prev
      const next = [...prev, item]
      return next.length > 8 ? next.slice(1) : next
    })
    setActiveId(item.id)
  }

  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setOpenTabs(prev => prev.filter(t => t.id !== id))
    setActiveId(prev => {
      if (prev !== id) return prev
      const remaining = openTabs.filter(t => t.id !== id)
      return remaining.length ? remaining[remaining.length - 1].id : null
    })
  }

  function postComment() {
    if (!draft.trim() || !activeId) return
    setThreads(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? SEED_THREAD), { author: 'You', text: draft.trim(), time: 'just now' }],
    }))
    setDraft('')
  }

  const activeItem    = openTabs.find(t => t.id === activeId)
  const kimmLines     = activeItem ? (kimmContextFn?.(activeItem) ?? []) : []
  const activeThread  = activeId ? (threads[activeId] ?? SEED_THREAD) : []

  return (
    <div
      className="flex flex-col overflow-hidden -mx-6 lg:-mx-10 -mt-6 lg:-mt-8"
      style={{ height: 'calc(100vh - 120px)' }}
    >
      {/* Supervisor strip */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/10 bg-slate-900/50 flex-shrink-0 overflow-x-auto">
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider flex-shrink-0">Team</p>
        {agents.map(a => (
          <button
            key={a.id}
            onClick={() => { if (a.currentItemId) { const it = items.find(i => i.id === a.currentItemId); if (it) openItem(it) } }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-800/60 border border-white/10 hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: `${a.color}25`, color: a.color }}>
              {a.initials}
            </div>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: A_DOT[a.status] }} />
            <span className="text-xs text-[var(--os-text-2)]">{a.currentItemId ?? 'idle'}</span>
          </button>
        ))}
      </div>

      {/* Body: queue pane + detail pane */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — queue */}
        <div className="w-72 flex-shrink-0 border-r border-white/10 flex flex-col bg-slate-900/20">
          {/* Filter bar */}
          <div className="flex p-2 gap-0.5 flex-shrink-0 border-b border-white/10">
            {([
              { id: 'mine',       label: 'Mine' },
              { id: 'all',        label: 'All' },
              { id: 'at_risk',    label: 'SLA Risk' },
              { id: 'unassigned', label: 'Unassigned' },
            ] as const).map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={filter === f.id ? { background: `${accent}30`, color: accent } : { color: 'var(--os-text-2)' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto py-1.5 px-1.5 space-y-0.5">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => openItem(item)}
                className="w-full text-left p-3 rounded-xl transition-all border-l-[3px]"
                style={{
                  borderLeftColor: activeId === item.id ? accent : 'transparent',
                  background:      activeId === item.id ? 'var(--os-surface-0)' : undefined,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: `${P_COLOR[item.priority]}22`, color: P_COLOR[item.priority] }}>
                    {item.priority}
                  </span>
                  <span className="text-xs font-mono text-[var(--os-text-2)]">{item.id}</span>
                  {!item.slaOk && (
                    <span className="ml-auto text-xs text-red-400 font-semibold">BREACH</span>
                  )}
                </div>
                <p className="text-xs font-medium text-[var(--os-text-1)] leading-snug line-clamp-2 mb-1.5">{item.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--os-text-2)]">{item.assignee}</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: item.slaOk ? 'var(--os-text-2)' : '#EF4444' }}>
                    <Clock className="w-2.5 h-2.5" />{item.sla}
                  </span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-[var(--os-text-2)] text-xs py-12">Queue empty</p>
            )}
          </div>
        </div>

        {/* Right — detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          {openTabs.length > 0 && (
            <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-slate-900/20 flex-shrink-0 overflow-x-auto">
              {openTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveId(tab.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs flex-shrink-0 transition-all border"
                  style={activeId === tab.id
                    ? { background: 'var(--os-border)', borderColor: `${accent}60`, color: '#fff' }
                    : { borderColor: 'transparent', color: 'var(--os-text-2)' }}
                >
                  <span className="font-mono">{tab.id}</span>
                  <span className="max-w-[90px] truncate hidden sm:block">{tab.title}</span>
                  <X className="w-3 h-3 flex-shrink-0 hover:text-[var(--os-text-1)]" onClick={e => closeTab(tab.id, e)} />
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {activeItem ? (
            <div className="flex-1 overflow-y-auto">
              {/* Item header */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{ background: `${P_COLOR[activeItem.priority]}22`, color: P_COLOR[activeItem.priority] }}>
                    {activeItem.priority}
                  </span>
                  <span className="text-xs font-mono text-[var(--os-text-2)]">{activeItem.id}</span>
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${accent}22`, color: accent }}>
                    {activeItem.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-base font-bold text-white leading-snug">{activeItem.title}</p>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {/* Details */}
                <div className="px-6 py-4">
                  <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">Details</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Assignee', value: activeItem.assignee },
                      { label: 'Opened',   value: activeItem.opened },
                      { label: 'SLA',      value: activeItem.sla },
                      ...(activeItem.category ? [{ label: 'Category', value: activeItem.category }] : []),
                    ].map(f => (
                      <div key={f.label} className="flex gap-4">
                        <p className="text-xs text-[var(--os-text-2)] w-20 flex-shrink-0">{f.label}</p>
                        <p className="text-xs text-[var(--os-text-1)]">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KIMMP Context */}
                {kimmLines.length > 0 && (
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>KIMMP Context</p>
                    </div>
                    <div className="space-y-2.5 p-3 rounded-xl border"
                      style={{ background: `${accent}08`, borderColor: `${accent}25` }}>
                      {kimmLines.map((line, i) => (
                        <p key={i} className="text-xs text-[var(--os-text-1)] leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thread */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                    <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Thread</p>
                    <span className="ml-auto text-xs text-[var(--os-text-2)]">{activeThread.length}</span>
                  </div>
                  <div className="space-y-4 mb-4">
                    {activeThread.map((c, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-700/80 flex items-center justify-center text-xs font-bold text-[var(--os-text-1)] flex-shrink-0 mt-0.5">
                          {c.author[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-xs font-semibold text-white">{c.author}</p>
                            <p className="text-xs text-[var(--os-text-2)]">{c.time}</p>
                          </div>
                          <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Input */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1 bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2 focus-within:border-white/20 transition-colors">
                      <textarea
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment() } }}
                        placeholder="Comment… (Enter to post)"
                        rows={2}
                        className="w-full bg-transparent text-xs text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none resize-none"
                      />
                      <div className="flex gap-2 mt-1 pt-1 border-t border-white/10">
                        <button className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"><Paperclip className="w-3 h-3" /></button>
                        <button className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"><AtSign className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <button onClick={postComment} disabled={!draft.trim()}
                      className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all flex-shrink-0"
                      style={{ background: accent }}>
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/40 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-[var(--os-text-2)]" />
                </div>
                <p className="text-sm font-semibold text-[var(--os-text-2)]">Select an item from the queue</p>
                <p className="text-xs text-[var(--os-text-2)] mt-1">Items open in tabs — up to 8 at once</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
