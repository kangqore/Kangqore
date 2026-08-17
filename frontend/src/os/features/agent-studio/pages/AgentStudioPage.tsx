import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Robot, Plus, X, CaretDown, CaretUp, Play, Pause, Power, Skull,
  Sliders, ArrowsClockwise, Wrench, ListChecks, Sparkle,
} from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import {
  agentStudioService, MODEL_OPTIONS, type KimmpAgent, type AgentInput, type AgentTemplate,
} from '../agentStudioService'
import { promptRegistryService } from '@features/kimmp-gateway/promptRegistryService'

// S321-S323 — Agent Studio. KimmpAgent already had the right columns and was
// populated by the pack-install flow, but nothing read a row back out at call
// time and there was no UI to create/edit one. This is that UI: a builder,
// governance controls (reusing the existing suspend/kill/activate routes),
// and a test-run panel that exercises the new S321 execution path live.

const STATUS_COLOR: Record<string, string> = { ACTIVE: '#10b981', SUSPENDED: '#f59e0b', KILLED: '#ef4444' }
const LEVEL_LABELS = ['READ ONLY', 'SUGGEST', 'DRAFT', 'REQUEST APPROVAL', 'AUTO-EXECUTE']

function LevelBadge({ level }: { level: number }) {
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">
      L{level} · {LEVEL_LABELS[level] ?? '?'}
    </span>
  )
}

// Overshadow Roadmap P3.1 — closing the "time-to-first-agent" gap for
// non-technical builders: pick a real starter template instead of a blank
// form. Only shown for new agents, not edits.
function TemplatePicker({ onPick }: { onPick: (t: AgentTemplate) => void }) {
  const { data: templates } = useQuery({ queryKey: ['agent-studio-templates'], queryFn: () => agentStudioService.templates() })
  if (!templates || templates.length === 0) return null
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)] mb-1.5">Start from a template</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {templates.map(t => (
          <button key={t.id} onClick={() => onPick(t)} title={t.description}
            className="flex-shrink-0 w-40 text-left p-2.5 rounded-2xl border border-[var(--os-border)] hover:border-[#579bfc]/50 bg-[var(--os-surface-0)] transition-colors">
            <span className="text-base">{t.iconEmoji ?? '🤖'}</span>
            <p className="text-[10.5px] font-semibold text-[var(--os-text-1)] mt-1 leading-tight">{t.name}</p>
            <p className="text-[9px] text-[var(--os-text-2)] mt-0.5 line-clamp-2 leading-snug">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function AgentBuilderForm({ agent, onClose }: { agent?: KimmpAgent; onClose: () => void }) {
  const qc = useQueryClient()
  const isEdit = !!agent

  const [name, setName] = useState(agent?.name ?? '')
  const [role, setRole] = useState(agent?.role ?? '')
  const [description, setDescription] = useState(agent?.description ?? '')
  const [model, setModel] = useState(agent?.model ?? 'claude-sonnet-4-6')
  const [systemPrompt, setSystemPrompt] = useState(agent?.systemPrompt ?? '')
  const [promptName, setPromptName] = useState(agent?.promptName ?? '')
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set(agent?.tools ?? []))
  const [fromTemplate, setFromTemplate] = useState<string | null>(null)

  const { data: tools } = useQuery({ queryKey: ['agent-studio-tools'], queryFn: () => agentStudioService.tools() })

  const applyTemplate = (t: AgentTemplate) => {
    setName(t.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_').slice(0, 40))
    setRole(t.manifest.role)
    setDescription(t.description)
    setSystemPrompt(t.manifest.systemPrompt)
    setSelectedTools(new Set(t.manifest.suggestedTools))
    setFromTemplate(t.id)
    agentStudioService.markTemplateUsed(t.id)
  }
  const { data: registry } = useQuery({ queryKey: ['prompt-registry'], queryFn: () => promptRegistryService.list() })
  const syncTools = useMutation({
    mutationFn: () => agentStudioService.syncTools(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agent-studio-tools'] }),
  })

  const save = useMutation({
    mutationFn: () => {
      const input: AgentInput = {
        name: name.trim(), role: role.trim(), description: description.trim() || undefined,
        model, systemPrompt: systemPrompt.trim() || undefined,
        promptName: promptName.trim() || null,
        tools: Array.from(selectedTools),
      }
      return isEdit ? agentStudioService.update(agent!.id, input) : agentStudioService.create(input)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agent-studio-agents'] }); onClose() },
  })

  const toggleTool = (n: string) => setSelectedTools(s => { const next = new Set(s); next.has(n) ? next.delete(n) : next.add(n); return next })

  const grouped = (tools ?? []).reduce<Record<string, typeof tools>>((acc, t) => {
    (acc[t.category] ??= []).push(t)
    return acc
  }, {})

  return (
    <div className="os-card p-4 space-y-3 border-[#579bfc]/30">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-[var(--os-text-1)]">{isEdit ? `Edit ${agent!.name}` : 'New agent'}</p>
        <button onClick={onClose}><X size={13} className="text-[var(--os-text-2)]" /></button>
      </div>

      {!isEdit && !fromTemplate && <TemplatePicker onPick={applyTemplate} />}
      {fromTemplate && (
        <p className="text-[9.5px] text-emerald-400 flex items-center gap-1">
          <Sparkle size={11} weight="fill" /> Pre-filled from a template — edit anything below before creating.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Agent name (e.g. RENEWAL_COACH)"
          className="px-2.5 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
        <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role — what this agent does"
          className="px-2.5 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
      </div>
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)"
        className="w-full px-2.5 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />

      <div>
        <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Model</p>
        <div className="flex items-center gap-1.5">
          {MODEL_OPTIONS.map(m => (
            <button key={m.id} onClick={() => setModel(m.id)}
              className={`px-2 py-1 rounded-2xl text-[10px] font-semibold border ${model === m.id ? 'bg-[var(--os-accent)] text-white border-transparent' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)]">System prompt</p>
          {registry && registry.names.length > 0 && (
            <select value={promptName} onChange={e => setPromptName(e.target.value)}
              className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)] outline-none">
              <option value="">— write inline below —</option>
              {registry.names.map(n => <option key={n.name} value={n.name}>Prompt Registry: {n.name} (v{n.activeVersion})</option>)}
            </select>
          )}
        </div>
        <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={4}
          placeholder={promptName ? `Fallback text if "${promptName}" isn't found — optional` : 'System prompt content'}
          className="w-full px-2.5 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none font-mono" />
        {promptName && <p className="text-[9px] text-[var(--os-text-2)] mt-1">Resolved from Prompt Registry at run time; the text above is only used if that lookup misses.</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)]">Tools this agent can call</p>
          <button onClick={() => syncTools.mutate()} disabled={syncTools.isPending} className="flex items-center gap-1 text-[9px] font-semibold text-[#579bfc]">
            {syncTools.isPending ? <Loader2 size={10} className="animate-spin" /> : <ArrowsClockwise size={10} />} Sync catalog
          </button>
        </div>
        {Object.keys(grouped).length === 0 ? (
          <p className="text-[10px] text-[var(--os-text-2)]">No tools in the catalog yet — click "Sync catalog" to populate it from the real calculator + ontology-action registries.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(grouped).map(([category, catTools]) => (
              <div key={category}>
                <p className="text-[8px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {catTools!.map(t => (
                    <button key={t.id} onClick={() => toggleTool(t.name)} title={t.description}
                      className={`px-2 py-1 rounded-2xl text-[9.5px] font-mono border ${selectedTools.has(t.name) ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button onClick={() => save.mutate()} disabled={save.isPending || !name.trim() || !role.trim()}
          className="px-3 py-1.5 rounded-2xl bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
          {save.isPending ? <Loader2 size={12} className="animate-spin" /> : isEdit ? 'Save changes' : 'Create agent'}
        </button>
        <button onClick={onClose} className="px-3 py-1.5 rounded-2xl text-[11px] font-semibold text-[var(--os-text-2)]">Cancel</button>
      </div>
    </div>
  )
}

function TestRunPanel({ agentId }: { agentId: string }) {
  const [input, setInput] = useState('')
  const run = useMutation({ mutationFn: () => agentStudioService.run(agentId, input) })

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && input.trim() && run.mutate()}
          placeholder="Give this agent something to do…" className="flex-1 px-2.5 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
        <button onClick={() => run.mutate()} disabled={run.isPending || !input.trim()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
          {run.isPending ? <Loader2 size={12} className="animate-spin" /> : <Play size={11} weight="fill" />} Run
        </button>
      </div>
      {run.data && (
        <div className={`p-3 rounded-2xl border text-[11px] space-y-2 ${run.data.success ? 'border-[var(--os-border)] bg-[var(--os-surface-0)]' : 'border-red-500/30 bg-red-500/5'}`}>
          <pre className="whitespace-pre-wrap font-mono text-[var(--os-text-1)]">{run.data.output}</pre>
          <div className="flex items-center gap-2 flex-wrap text-[9px] text-[var(--os-text-2)]">
            <span>{run.data.durationMs}ms</span>
            {run.data.toolCalls.length > 0 && (
              <span className="flex items-center gap-1"><Wrench size={9} /> {run.data.toolCalls.map(t => t.name).join(', ')}</span>
            )}
          </div>
        </div>
      )}
      {run.isError && <p className="text-[10px] text-red-400">{(run.error as any)?.response?.data?.error ?? 'Run failed'}</p>}
    </div>
  )
}

function AgentCard({ agent }: { agent: KimmpAgent }) {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState<'run' | 'logs'>('run')

  const { data: logs } = useQuery({ queryKey: ['agent-logs', agent.id], queryFn: () => agentStudioService.logs(agent.id), enabled: expanded && tab === 'logs' })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['agent-studio-agents'] })
  const setLevel   = useMutation({ mutationFn: (level: number) => agentStudioService.setLevel(agent.id, level), onSuccess: invalidate })
  const suspend    = useMutation({ mutationFn: () => agentStudioService.suspend(agent.id), onSuccess: invalidate })
  const activate   = useMutation({ mutationFn: () => agentStudioService.activate(agent.id), onSuccess: invalidate })
  const kill       = useMutation({
    mutationFn: () => agentStudioService.kill(agent.id),
    onSuccess: invalidate,
  })

  const sc = STATUS_COLOR[agent.status] ?? '#8a94a6'

  return (
    <div className="os-card p-4 space-y-3">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc }} />
          <Robot size={14} className="text-[var(--os-text-2)] flex-shrink-0" />
          <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{agent.name}</p>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)] flex-shrink-0">{agent.model}</span>
          {agent.tools.length > 0 && <span className="text-[9px] text-[var(--os-text-2)] flex items-center gap-1 flex-shrink-0"><Wrench size={9} /> {agent.tools.length}</span>}
        </div>
        {expanded ? <CaretUp size={14} className="text-[var(--os-text-2)]" /> : <CaretDown size={14} className="text-[var(--os-text-2)]" />}
      </div>
      <p className="text-[11px] text-[var(--os-text-2)]">{agent.role}</p>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-[var(--os-border)]">
          {editing ? (
            <AgentBuilderForm agent={agent} onClose={() => setEditing(false)} />
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <LevelBadge level={agent.maxLevel} />
                {[0, 1, 2, 3, 4].map(l => (
                  <button key={l} onClick={() => setLevel.mutate(l)} disabled={setLevel.isPending}
                    className={`w-5 h-5 rounded text-[9px] font-bold border ${agent.maxLevel === l ? 'bg-[var(--os-accent)] text-white border-transparent' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
                    {l}
                  </button>
                ))}
                <div className="flex-1" />
                <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-2 py-1 rounded-2xl text-[10px] font-semibold text-[var(--os-text-2)] border border-[var(--os-border)]">
                  <Sliders size={10} /> Edit
                </button>
                {agent.status === 'ACTIVE' ? (
                  <button onClick={() => suspend.mutate()} className="flex items-center gap-1 px-2 py-1 rounded-2xl text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                    <Pause size={10} weight="fill" /> Suspend
                  </button>
                ) : agent.status === 'SUSPENDED' ? (
                  <button onClick={() => activate.mutate()} className="flex items-center gap-1 px-2 py-1 rounded-2xl text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    <Power size={10} /> Activate
                  </button>
                ) : null}
                {agent.status !== 'KILLED' && (
                  <button onClick={() => { if (confirm(`Kill ${agent.name}? This is logged.`)) kill.mutate() }} className="flex items-center gap-1 px-2 py-1 rounded-2xl text-[10px] font-semibold text-red-400 border border-red-500/30">
                    <Skull size={10} /> Kill
                  </button>
                )}
              </div>

              {agent.tools.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map(t => <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">{t}</span>)}
                </div>
              )}

              <div className="flex items-center gap-1 border-b border-[var(--os-border)]">
                {(['run', 'logs'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`px-2.5 py-1.5 text-[10px] font-semibold border-b-2 -mb-px ${tab === t ? 'border-[#579bfc] text-[#579bfc]' : 'border-transparent text-[var(--os-text-2)]'}`}>
                    {t === 'run' ? 'Test run' : 'Recent runs'}
                  </button>
                ))}
              </div>

              {tab === 'run' && (agent.status === 'ACTIVE' ? <TestRunPanel agentId={agent.id} /> : <p className="text-[10px] text-[var(--os-text-2)]">Activate this agent to test-run it.</p>)}
              {tab === 'logs' && (
                <div className="space-y-1.5">
                  {(logs ?? []).length === 0 ? <p className="text-[10px] text-[var(--os-text-2)]">No runs logged yet</p> : logs!.map(l => (
                    <div key={l.id} className="flex items-center justify-between text-[10px] px-2 py-1.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                      <span className="text-[var(--os-text-2)] truncate flex-1">{l.input?.query ?? l.action}</span>
                      <span style={{ color: l.status === 'COMPLETED' ? '#10b981' : '#ef4444' }} className="font-bold flex-shrink-0 ml-2">{l.status}</span>
                      <span className="text-[var(--os-text-2)] flex-shrink-0 ml-2">{new Date(l.createdAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function AgentStudioPage() {
  const { data, isLoading } = useQuery({ queryKey: ['agent-studio-agents'], queryFn: () => agentStudioService.list() })
  const [showBuilder, setShowBuilder] = useState(false)
  const agents = data ?? []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight mb-1 flex items-center gap-2" style={{ color: 'var(--os-text-1)' }}>
            <Robot size={20} weight="fill" /> Agent Studio
          </h1>
          <p className="text-xs text-[var(--os-text-2)]">A new KIMMP agent — real prompt, real tools, real ontology actions — is a form submission, not a pull request.</p>
        </div>
        <button onClick={() => setShowBuilder(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[var(--os-accent)] text-white text-xs font-semibold">
          <Plus size={13} /> New agent
        </button>
      </div>

      {showBuilder && <AgentBuilderForm onClose={() => setShowBuilder(false)} />}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="os-card h-20 animate-pulse bg-[var(--os-surface-0)]" />)}</div>
      ) : agents.length === 0 ? (
        <div className="os-card p-12 flex flex-col items-center gap-3 text-center">
          <ListChecks size={28} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No DB-defined agents yet</p>
          <p className="text-xs text-[var(--os-text-2)] max-w-sm">The 38 KIMMP + 80 AEGIS agents run their existing hardcoded path unaffected. Create a new agent here to try the data-driven path.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {agents.map(a => <AgentCard key={a.id} agent={a} />)}
        </div>
      )}
    </div>
  )
}
