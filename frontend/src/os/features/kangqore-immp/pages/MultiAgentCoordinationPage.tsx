import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Brain, Play, CheckCircle2, AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

type SpecialistAgent =
  | 'SIGNAL_READ' | 'GOAL_CHECK' | 'FINANCIAL_SNAPSHOT' | 'LEAD_ANALYSIS'
  | 'RISK_ANALYSIS' | 'DECISION_ENGINE' | 'STRATEGIST' | 'ADVISOR'
  | 'COMPLIANCE' | 'OPERATIONS' | 'FORECAST'

interface AgentFinding {
  agent: string
  summary: string
  confidence: number
  flags: string[]
  durationMs: number
}

interface CoordinationResult {
  findings: AgentFinding[]
  consensus: string
  confidence: number
  conflicting: string[]
  actionRequired: boolean
  durationMs: number
  ranAt: string
}

interface HistoryRun {
  id: string
  question: string
  agentCount: number
  consensus: string
  confidence: number
  conflicting: string[]
  actionRequired: boolean
  durationMs: number
  ranAt: string
}

// ─── Agent registry ───────────────────────────────────────────────────────────

const ALL_AGENTS: { id: SpecialistAgent; label: string; color: string; desc: string }[] = [
  { id: 'SIGNAL_READ',        label: 'Signal Reader',      color: '#3b82f6', desc: 'Reads live signal ledger' },
  { id: 'GOAL_CHECK',         label: 'Goal Check',         color: '#7c3aed', desc: 'Evaluates goal progress' },
  { id: 'FINANCIAL_SNAPSHOT', label: 'Financial Snapshot', color: '#10b981', desc: 'P&L, runway, burn analysis' },
  { id: 'LEAD_ANALYSIS',      label: 'Lead Analysis',      color: '#f59e0b', desc: 'Pipeline & deal intelligence' },
  { id: 'RISK_ANALYSIS',      label: 'Risk Analysis',      color: '#ef4444', desc: 'Flags risk vectors' },
  { id: 'DECISION_ENGINE',    label: 'Decision Engine',    color: '#8b5cf6', desc: 'Runs decision simulation' },
  { id: 'STRATEGIST',         label: 'Strategist',         color: '#2564ea', desc: 'Strategic positioning' },
  { id: 'ADVISOR',            label: 'Advisor',            color: '#0d9488', desc: 'Integrated advisory view' },
  { id: 'COMPLIANCE',         label: 'Compliance',         color: '#d97706', desc: 'Policy & compliance scan' },
  { id: 'OPERATIONS',         label: 'Operations',         color: '#6366f1', desc: 'Operational health check' },
  { id: 'FORECAST',           label: 'Forecast',           color: '#14b8a6', desc: 'Forward-looking projections' },
]

// ─── Agent selector checkbox ──────────────────────────────────────────────────

function AgentToggle({ agent, selected, onToggle }: {
  agent: typeof ALL_AGENTS[number]
  selected: boolean
  onToggle: (id: SpecialistAgent) => void
}) {
  return (
    <button
      onClick={() => onToggle(agent.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%',
        background: selected ? agent.color + '18' : 'var(--os-card)',
        border: `1.5px solid ${selected ? agent.color + '50' : 'var(--os-border)'}`,
        transition: 'all .15s',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        background: selected ? agent.color : 'transparent',
        border: `2px solid ${selected ? agent.color : 'var(--os-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <CheckCircle2 size={10} style={{ color: '#fff' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: selected ? agent.color : 'var(--os-text-1)' }}>
          {agent.label}
        </div>
        <div style={{ fontSize: 10, color: 'var(--os-text-2)' }}>{agent.desc}</div>
      </div>
    </button>
  )
}

// ─── Finding card ─────────────────────────────────────────────────────────────

function FindingCard({ finding }: { finding: AgentFinding }) {
  const [open, setOpen] = useState(false)
  const agentMeta = ALL_AGENTS.find(a => a.id === finding.agent)
  const color = agentMeta?.color ?? '#888'
  const conf = Math.round(finding.confidence * 100)

  return (
    <div style={{ background: color + '0d', border: `1px solid ${color}25`, borderRadius: 12, padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 10, fontWeight: 800, color, background: color + '20', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
          {agentMeta?.label ?? finding.agent}
        </span>
        <span style={{ fontSize: 12, color: 'var(--os-text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: open ? 'normal' : 'nowrap' }}>
          {finding.summary}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: conf >= 70 ? '#10b981' : conf >= 40 ? '#f59e0b' : '#ef4444', flexShrink: 0 }}>
          {conf}%
        </span>
        {open ? <ChevronUp size={14} style={{ color: 'var(--os-text-2)', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: 'var(--os-text-2)', flexShrink: 0 }} />}
      </div>
      {open && finding.flags.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {finding.flags.map((f, i) => (
            <span key={i} style={{ fontSize: 10, color: '#f59e0b', background: '#f59e0b15', padding: '2px 8px', borderRadius: 8 }}>{f}</span>
          ))}
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: 10, color: 'var(--os-text-2)' }}>{finding.durationMs}ms</div>
    </div>
  )
}

// ─── History row ──────────────────────────────────────────────────────────────

function HistoryRow({ run }: { run: HistoryRun }) {
  const conf = Math.round(run.confidence * 100)
  const ago = (() => {
    const diff = Date.now() - new Date(run.ranAt).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)  return 'just now'
    if (m < 60) return `${m}m ago`
    return `${Math.floor(m / 60)}h ago`
  })()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--os-border)' }}>
      {run.actionRequired
        ? <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
        : <CheckCircle2  size={14} style={{ color: '#10b981', flexShrink: 0 }} />
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {run.question}
        </div>
        <div style={{ fontSize: 10, color: 'var(--os-text-2)', marginTop: 2 }}>
          {run.agentCount} agents · {run.durationMs}ms
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: conf >= 70 ? '#10b981' : '#f59e0b', flexShrink: 0 }}>{conf}%</span>
      <span style={{ fontSize: 10, color: 'var(--os-text-2)', flexShrink: 0 }}>{ago}</span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function MultiAgentCoordinationPage() {
  const [selected, setSelected] = useState<Set<SpecialistAgent>>(new Set(ALL_AGENTS.map(a => a.id)))
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<CoordinationResult | null>(null)
  const qc = useQueryClient()

  const { data: historyData, isLoading: loadingHistory } = useQuery({
    queryKey: ['coord-history'],
    queryFn: () => api.get('/admin/kangqore-immp/agent-coordination/history').then(r => r.data),
    staleTime: 10_000,
  })
  const history: HistoryRun[] = historyData?.runs ?? []

  const { mutate: run, isPending } = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/agent-coordination/run', {
      question,
      agents: Array.from(selected),
    }).then(r => r.data),
    onSuccess: (data: CoordinationResult) => {
      setResult(data)
      qc.invalidateQueries({ queryKey: ['coord-history'] })
    },
  })

  function toggleAgent(id: SpecialistAgent) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll()  { setSelected(new Set(ALL_AGENTS.map(a => a.id))) }
  function clearAll()   { setSelected(new Set()) }

  const conf = result ? Math.round(result.confidence * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 20, marginBottom: 4, borderBottom: '1px solid var(--os-border)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #2564ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}>
          <Brain size={16} style={{ color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)' }}>Multi-Agent Coordination</div>
          <div style={{ fontSize: 12, color: 'var(--os-text-2)', marginTop: 2 }}>
            Run 11 specialist KIMMP agents in parallel — structured consensus, conflict detection, action flags.
          </div>
        </div>
      </div>

      {/* Two-column: selector + input */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Agent selector */}
        <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: 20, boxShadow: '0 16px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)' }}>
              Agents ({selected.size}/{ALL_AGENTS.length})
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={selectAll} style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', cursor: 'pointer', background: 'none', border: 'none' }}>All</button>
              <button onClick={clearAll}  style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)', cursor: 'pointer', background: 'none', border: 'none' }}>None</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ALL_AGENTS.map(a => (
              <AgentToggle key={a.id} agent={a} selected={selected.has(a.id)} onToggle={toggleAgent} />
            ))}
          </div>
        </div>

        {/* Question + output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Question input */}
          <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: 20, boxShadow: '0 16px 40px rgba(0,0,0,0.05)' }}>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', display: 'block', marginBottom: 10 }}>
              Strategic Question
            </label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. Should we prioritise Piramal or Cipla for Q3 delivery?"
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', fontSize: 13, fontFamily: 'inherit',
                background: 'var(--os-surface-0)', border: '1.5px solid var(--os-border)',
                borderRadius: 10, color: 'var(--os-text-1)', resize: 'vertical', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => run()}
              disabled={isPending || !question.trim() || selected.size === 0}
              style={{
                marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                color: '#fff', cursor: 'pointer', border: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)',
                boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
                opacity: (isPending || !question.trim() || selected.size === 0) ? 0.5 : 1,
              }}
            >
              {isPending ? <Spinner size="sm" /> : <Play size={14} style={{ fill: '#fff' }} />}
              {isPending ? `Running ${selected.size} agents…` : `Run ${selected.size} Agents`}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Consensus */}
              <div style={{ background: 'var(--os-card)', borderRadius: 14, padding: 20, boxShadow: '0 16px 40px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)' }}>WAANDA Consensus</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: conf >= 70 ? '#10b981' : '#f59e0b', background: (conf >= 70 ? '#10b981' : '#f59e0b') + '15', padding: '2px 10px', borderRadius: 20 }}>
                    {conf}% confidence
                  </span>
                  {result.actionRequired && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', background: '#ef444415', padding: '2px 10px', borderRadius: 20, marginLeft: 'auto' }}>
                      ⚡ Action Required
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'var(--os-text-1)', lineHeight: 1.7 }}>{result.consensus}</p>
                {result.conflicting.length > 0 && (
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>Conflicting:</span>
                    {result.conflicting.map((c, i) => (
                      <span key={i} style={{ fontSize: 10, color: '#f59e0b', background: '#f59e0b15', padding: '2px 8px', borderRadius: 8 }}>{c}</span>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 10, fontSize: 10, color: 'var(--os-text-2)' }}>
                  {result.findings.length} agents · {result.durationMs}ms · {new Date(result.ranAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Agent findings grid */}
              <div>
                <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 10 }}>
                  Agent Findings ({result.findings.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {result.findings.map(f => <FindingCard key={f.agent} finding={f} />)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Clock size={14} style={{ color: 'var(--os-text-2)' }} />
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-2)' }}>
            Recent Runs
          </span>
          {loadingHistory && <Spinner size="sm" />}
        </div>
        <div style={{ background: 'var(--os-card)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.04)' }}>
          {history.length === 0
            ? <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--os-text-2)', fontSize: 13 }}>No runs yet — ask your first question above.</div>
            : history.map(run => <HistoryRow key={run.id} run={run} />)
          }
        </div>
      </div>
    </div>
  )
}
