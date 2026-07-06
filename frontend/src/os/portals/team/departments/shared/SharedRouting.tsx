import { useState } from 'react'
import { Brain, CheckCircle, ChevronDown } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export interface RoutingItem {
  id:            string
  title:         string
  priority:      'P1' | 'P2' | 'P3' | 'P4'
  skillRequired: string
  kimmBestMatch: string
  kimmRationale: string
  confidence:    number
  assignedTo?:   string
}

export interface RoutingAgent {
  id:       string
  name:     string
  initials: string
  color:    string
  queue:    number
  capacity: number
  skills:   string[]
}

interface Props {
  config:  DeptConfig
  items:   RoutingItem[]
  agents:  RoutingAgent[]
}

const P_COLOR: Record<string, string> = { P1: '#EF4444', P2: '#F97316', P3: '#F59E0B', P4: '#6B7280' }
const MODES = ['Priority-First', 'Skill Match', 'Load Balanced']

export function SharedRouting({ config, items: initialItems, agents }: Props) {
  const [items,     setItems]     = useState<RoutingItem[]>(initialItems)
  const [modes,     setModes]     = useState({ 'Priority-First': true, 'Skill Match': true, 'Load Balanced': false })
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [expanded,  setExpanded]  = useState<string | null>(null)
  const accent = config.accentColor

  function assignKimmp(itemId: string) {
    const item  = items.find(i => i.id === itemId)
    if (!item) return
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, assignedTo: item.kimmBestMatch } : i))
  }

  function assignOverride(itemId: string, agentName: string) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, assignedTo: agentName } : i))
    const next = { ...overrides }; delete next[itemId]; setOverrides(next)
  }

  const unassigned = items.filter(i => !i.assignedTo)
  const assigned   = items.filter(i =>  i.assignedTo)

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Routing modes */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Routing mode:</p>
        {MODES.map(m => (
          <button
            key={m}
            onClick={() => setModes(prev => ({ ...prev, [m]: !prev[m as keyof typeof prev] }))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold"
            style={modes[m as keyof typeof modes]
              ? { background: `${accent}25`, borderColor: `${accent}60`, color: accent }
              : { borderColor: 'var(--os-border)', color: 'var(--os-text-2)' }}
          >
            <div className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: modes[m as keyof typeof modes] ? accent : 'var(--os-text-2)' }}>
              {modes[m as keyof typeof modes] && <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />}
            </div>
            {m}
          </button>
        ))}
      </div>

      {/* Agent capacity strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {agents.map(a => {
          const pct = Math.round((a.queue / a.capacity) * 100)
          const ok  = pct < 80
          return (
            <div key={a.id} className="p-3 rounded-xl border border-white/10 bg-slate-900/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center"
                  style={{ background: `${a.color}25`, color: a.color }}>{a.initials}</div>
                <div>
                  <p className="text-xs font-semibold text-white truncate">{a.name}</p>
                  <p className="text-xs text-[var(--os-text-2)]">{a.queue}/{a.capacity} items</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: ok ? '#10B981' : '#EF4444' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Unassigned queue */}
      {unassigned.length > 0 && (
        <div>
          <p className="text-sm font-bold text-white mb-3">Unassigned ({unassigned.length})</p>
          <div className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Priority', 'ID', 'Title', 'Skill Required', 'KIMMP Best Match', 'Conf.', 'Action'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unassigned.map(item => (
                  <>
                    <tr key={item.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: `${P_COLOR[item.priority]}22`, color: P_COLOR[item.priority] }}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-[var(--os-text-2)]">{item.id}</td>
                      <td className="px-4 py-3 text-sm text-[var(--os-text-1)] max-w-xs truncate">{item.title}</td>
                      <td className="px-4 py-3 text-xs text-[var(--os-text-2)]">{item.skillRequired}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Brain className="w-3 h-3 flex-shrink-0" style={{ color: accent }} />
                          <span className="text-xs font-semibold text-white">{item.kimmBestMatch}</span>
                          <button
                            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                            className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold" style={{ color: item.confidence >= 85 ? '#10B981' : '#F59E0B' }}>
                          {item.confidence}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => assignKimmp(item.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-all"
                            style={{ background: accent }}
                          >
                            Assign
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setOverrides(prev => ({ ...prev, [item.id]: item.id }))}
                              className="px-2 py-1 rounded-lg text-xs font-semibold text-[var(--os-text-2)] bg-slate-800/60 border border-white/10 hover:text-[var(--os-text-1)]"
                            >
                              Override
                            </button>
                            {overrides[item.id] && (
                              <div className="absolute right-0 top-7 z-10 w-36 rounded-xl border border-white/10 bg-slate-900 shadow-xl">
                                {agents.map(a => (
                                  <button
                                    key={a.id}
                                    onClick={() => assignOverride(item.id, a.name)}
                                    className="w-full text-left px-3 py-2 text-xs text-[var(--os-text-1)] hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl"
                                  >
                                    {a.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {expanded === item.id && (
                      <tr key={`${item.id}-exp`} className="border-b border-white/[0.05]">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="flex items-start gap-2 p-3 rounded-xl"
                            style={{ background: `${accent}08`, border: `1px solid ${accent}25` }}>
                            <Brain className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                            <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{item.kimmRationale}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assigned */}
      {assigned.length > 0 && (
        <div>
          <p className="text-sm font-bold text-white mb-3">Assigned ({assigned.length})</p>
          <div className="space-y-2">
            {assigned.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/[0.06] bg-slate-900/20">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                  style={{ background: `${P_COLOR[item.priority]}22`, color: P_COLOR[item.priority] }}>
                  {item.priority}
                </span>
                <span className="text-xs font-mono text-[var(--os-text-2)]">{item.id}</span>
                <span className="text-sm text-[var(--os-text-1)] flex-1 truncate">{item.title}</span>
                <span className="text-xs font-semibold text-emerald-400">{item.assignedTo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {unassigned.length === 0 && assigned.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--os-text-2)] text-sm">No items in routing queue</p>
        </div>
      )}
    </div>
  )
}
