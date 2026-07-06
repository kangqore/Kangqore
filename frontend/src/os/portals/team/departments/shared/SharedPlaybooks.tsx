import { useState } from 'react'
import { CheckCircle2, Clock, Circle, ChevronRight, Brain, Plus, Play } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export interface PlaybookStep {
  id:          string
  label:       string
  instructions:string
  assignee:    string
  sla:         string
  status:      'DONE' | 'ACTIVE' | 'PENDING'
  completedAt?: string
  kimmHint?:   string
}

export interface PlaybookTemplate {
  id:       string
  name:     string
  category: string
  stepCount:number
  lastRun?: string
  steps:    PlaybookStep[]
}

interface PlaybookRun {
  id:         string
  templateId: string
  name:       string
  started:    string
  steps:      PlaybookStep[]
}

interface Props {
  config:    DeptConfig
  templates: PlaybookTemplate[]
}

function seedRun(tpl: PlaybookTemplate, index: number): PlaybookRun {
  return {
    id:         `RUN-${String(index + 1).padStart(3, '0')}`,
    templateId: tpl.id,
    name:       tpl.name,
    started:    'just now',
    steps:      tpl.steps.map((s, i) => ({
      ...s,
      status:      i === 0 ? 'ACTIVE' : 'PENDING',
      completedAt: undefined,
    })),
  }
}

const S_COLOR = { DONE: '#10B981', ACTIVE: '#2564ea', PENDING: 'var(--os-text-2)' }

export function SharedPlaybooks({ config, templates }: Props) {
  const [cat,      setCat]      = useState('All')
  const [activeRun,setActiveRun]= useState<PlaybookRun | null>(null)
  const [runs,     setRuns]     = useState<PlaybookRun[]>([])
  const accent = config.accentColor

  const cats    = ['All', ...Array.from(new Set(templates.map(t => t.category)))]
  const visible = templates.filter(t => cat === 'All' || t.category === cat)

  function startRun(tpl: PlaybookTemplate) {
    const run = seedRun(tpl, runs.length)
    setRuns(prev => [...prev, run])
    setActiveRun(run)
  }

  function markStepComplete(stepId: string) {
    if (!activeRun) return
    const steps = activeRun.steps.map((s, i) => {
      if (s.id !== stepId) return s
      const updated = { ...s, status: 'DONE' as const, completedAt: 'just now' }
      return updated
    })
    const doneIdx = steps.findLastIndex(s => s.status === 'DONE')
    const withNext = steps.map((s, i) => {
      if (s.status === 'PENDING' && i === doneIdx + 1) return { ...s, status: 'ACTIVE' as const }
      return s
    })
    const updated = { ...activeRun, steps: withNext }
    setActiveRun(updated)
    setRuns(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  function priorStepsDone(run: PlaybookRun, stepId: string): boolean {
    const idx = run.steps.findIndex(s => s.id === stepId)
    return run.steps.slice(0, idx).every(s => s.status === 'DONE')
  }

  const done   = activeRun ? activeRun.steps.filter(s => s.status === 'DONE').length : 0
  const total  = activeRun ? activeRun.steps.length : 0

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[500px] gap-4">

      {/* Left — Library */}
      <div className="w-72 flex-shrink-0 flex flex-col">
        <div className="flex flex-col gap-3 h-full">
          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                style={cat === c ? { background: `${accent}30`, color: accent } : { color: 'var(--os-text-2)' }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Template cards */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {visible.map(tpl => (
              <div
                key={tpl.id}
                className="p-4 rounded-2xl border transition-all cursor-default"
                style={activeRun?.templateId === tpl.id
                  ? { borderColor: `${accent}60`, background: `${accent}08` }
                  : { borderColor: 'var(--os-border)', background: 'rgba(15,23,42,0.4)' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs font-bold text-white leading-snug">{tpl.name}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-0.5">{tpl.category} · {tpl.stepCount} steps</p>
                  </div>
                </div>
                {tpl.lastRun && (
                  <p className="text-xs text-[var(--os-text-2)] mb-2">Last run: {tpl.lastRun}</p>
                )}
                <button
                  onClick={() => startRun(tpl)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                  style={{ background: accent }}
                >
                  <Play className="w-3 h-3" /> New Run
                </button>
              </div>
            ))}
          </div>

          {/* Active runs */}
          {runs.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-1">Active Runs</p>
              {runs.map(r => {
                const d = r.steps.filter(s => s.status === 'DONE').length
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveRun(r)}
                    className="w-full text-left px-3 py-2.5 rounded-xl border transition-all"
                    style={activeRun?.id === r.id
                      ? { borderColor: `${accent}60`, background: `${accent}08` }
                      : { borderColor: 'var(--os-surface-0)', background: 'transparent' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white truncate">{r.name}</p>
                      <span className="text-xs text-[var(--os-text-2)] flex-shrink-0">{d}/{r.steps.length}</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-slate-700/60 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(d / r.steps.length) * 100}%`, background: accent }} />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right — Active run */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-xl">
        {activeRun ? (
          <div className="h-full flex flex-col">
            {/* Run header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{activeRun.name}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{activeRun.id} · Started {activeRun.started}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">{done}/{total} complete</p>
                <div className="w-24 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(done / total) * 100}%`, background: accent }} />
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {activeRun.steps.map((step, i) => {
                const canComplete = step.status === 'ACTIVE' && priorStepsDone(activeRun, step.id)
                return (
                  <div
                    key={step.id}
                    className="rounded-2xl border p-4 transition-all"
                    style={step.status === 'ACTIVE'
                      ? { borderColor: `${accent}50`, background: `${accent}06` }
                      : step.status === 'DONE'
                        ? { borderColor: '#10B98130', background: '#10B98106' }
                        : { borderColor: 'var(--os-border)', background: 'transparent' }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status icon */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 mt-0.5"
                        style={{ borderColor: S_COLOR[step.status], background: `${S_COLOR[step.status]}18` }}
                      >
                        {step.status === 'DONE'   && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {step.status === 'ACTIVE'  && <Clock         className="w-4 h-4" style={{ color: accent }} />}
                        {step.status === 'PENDING' && <Circle        className="w-4 h-4 text-[var(--os-text-2)]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-white">{i + 1}. {step.label}</p>
                          <span className="text-xs text-[var(--os-text-2)] ml-auto flex-shrink-0">SLA: {step.sla}</span>
                        </div>
                        <p className="text-xs text-[var(--os-text-2)] mb-2">{step.assignee}</p>
                        <p className="text-xs text-[var(--os-text-1)] leading-relaxed mb-3">{step.instructions}</p>

                        {/* KIMMP hint */}
                        {step.kimmHint && step.status === 'ACTIVE' && (
                          <div className="flex items-start gap-2 p-2.5 rounded-xl mb-3"
                            style={{ background: '#F59E0B0D', border: '1px solid #F59E0B30' }}>
                            <Brain className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-300 leading-relaxed">{step.kimmHint}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {step.completedAt ? (
                            <p className="text-xs text-emerald-500">✓ Completed {step.completedAt}</p>
                          ) : (
                            <span />
                          )}
                          {step.status === 'ACTIVE' && (
                            <button
                              onClick={() => markStepComplete(step.id)}
                              disabled={!canComplete}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              style={{ background: canComplete ? '#10B981' : 'var(--os-text-2)' }}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {i < activeRun.steps.length - 1 && (
                      <div className="flex items-center mt-3 pl-11">
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/40 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-7 h-7 text-[var(--os-text-2)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--os-text-2)]">Select a playbook to run</p>
              <p className="text-xs text-[var(--os-text-2)] mt-1">Enforced step-sequence with SLA tracking</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
