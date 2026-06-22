import { useState, useRef } from 'react'
import { Brain, Sparkles, Play, CheckCircle2, AlertTriangle, Clock, Bell, GitBranch, Link, CheckSquare, Zap, ArrowRight, RotateCcw } from 'lucide-react'
import { api } from '@lib/api'

// ─── KIMMP-native triggers — the ServiceNow differentiator ────────────────────
// These triggers are impossible in standard workflow tools. KIMMP's intelligence
// layer surfaces business signals that become workflow entry points.

const KIMMP_TRIGGERS = [
  { id: 'churn.risk',    label: 'Churn Risk > 70%',     desc: 'When KIMMP detects a client pre-churn pattern',       color: '#e2445c', icon: '⚠️' },
  { id: 'sla.breach',   label: 'SLA Breach Imminent',   desc: 'When SLA window drops below 2 hours on any commitment', color: '#fdab3d', icon: '⏰' },
  { id: 'issue.p1',     label: 'P1 Issue Raised',       desc: 'When any critical business issue is opened in Ops Centre', color: '#e2445c', icon: '🚨' },
  { id: 'lead.cold',    label: 'Lead Goes Cold',         desc: 'When a lead has no activity for 14+ days',             color: '#2564ea', icon: '❄️' },
  { id: 'invoice.overdue', label: 'Invoice Overdue',    desc: 'When an invoice exceeds 30 days unpaid',               color: '#fdab3d', icon: '💰' },
  { id: 'kpi.deviation', label: 'KPI Deviation > 15%', desc: 'When a financial or delivery KPI deviates from target', color: '#7f53f9', icon: '📊' },
  { id: 'client.created', label: 'New Client Signed',   desc: 'When a new client is added to the CRM',               color: '#00c875', icon: '🤝' },
  { id: 'resource.conflict', label: 'Resource Conflict', desc: 'When a team member is allocated > 100% in any week',  color: '#fdab3d', icon: '👤' },
]

const EXAMPLES = [
  'When a new enterprise client signs, assign a CSM within 24h, schedule onboarding call within 48h, notify delivery lead, and create a project',
  'When churn risk exceeds 70% on any client, send an alert to the account manager, schedule a retention call, and prepare a value recap',
  'When an invoice is overdue by 30 days, send escalation notice to the client, notify our finance team, and if unpaid after 7 more days, flag for legal review',
  'Every Monday morning, generate a weekly performance digest and send it to all team leads',
  'When a lead has had no activity for 14 days, automatically send a re-engagement email and notify the sales lead',
]

const STEP_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  action:       { color: '#2564ea', icon: Play,        label: 'Action'      },
  condition:    { color: '#fdab3d', icon: GitBranch,   label: 'Condition'   },
  notification: { color: '#00c875', icon: Bell,        label: 'Notify'      },
  delay:        { color: '#64748b', icon: Clock,       label: 'Wait'        },
  approval:     { color: '#7f53f9', icon: CheckSquare, label: 'Approval'    },
  integration:  { color: '#e2445c', icon: Link,        label: 'Integration' },
}

interface GeneratedWorkflow {
  intent: string
  triggerType: string
  triggerEvent?: string
  triggerFilter?: string
  triggerSchedule?: string
  steps: Array<{
    id: string
    type: string
    label: string
    description: string
    sla?: string
    config?: Record<string, string>
  }>
  estimatedDuration: string
  riskScore: number
  kimmpNote: string
  category: string
}

function StepCard({ step, index }: { step: GeneratedWorkflow['steps'][0]; index: number }) {
  const cfg = STEP_CONFIG[step.type] ?? STEP_CONFIG.action
  const Icon = cfg.icon

  return (
    <div className="flex gap-3 items-start">
      {/* connector */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${cfg.color}14`, border: `1px solid ${cfg.color}30` }}>
          <Icon style={{ width: 14, height: 14, color: cfg.color }} />
        </div>
        {index < 99 && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.04)', minHeight: 16 }} />}
      </div>

      <div className="flex-1 pb-3">
        <div className="flex items-start gap-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ color: cfg.color, background: `${cfg.color}12`, border: `1px solid ${cfg.color}22` }}>
            {cfg.label}
          </span>
          {step.sla && (
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock style={{ width: 10, height: 10 }} />{step.sla}
            </span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-white leading-tight">{step.label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
      </div>
    </div>
  )
}

function RiskMeter({ score }: { score: number }) {
  const color = score >= 70 ? '#e2445c' : score >= 40 ? '#fdab3d' : '#00c875'
  const label = score >= 70 ? 'High Risk' : score >= 40 ? 'Medium Risk' : 'Low Risk'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">KIMMP Risk Score</span>
        <span className="text-[11px] font-bold" style={{ color }}>{score} — {label}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export function KIMMLWorkflowGenerator() {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeneratedWorkflow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const generate = async () => {
    if (!description.trim() || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const { data } = await api.post('/admin/kangqore-immp/workflows/generate', { description })
      setResult(data.workflow)
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const triggerColor = (type: string) => {
    const map: Record<string, string> = { event: '#2564ea', schedule: '#7f53f9', kimmp: '#e2445c', manual: '#64748b' }
    return map[type] ?? '#64748b'
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
          <Brain style={{ width: 18, height: 18, color: '#a78bfa' }} />
        </div>
        <div>
          <h2 className="text-base font-bold text-white leading-none mb-0.5">KIMMP Workflow Generator</h2>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            Describe any workflow in plain English. KIMMP parses your intent, selects the right trigger, builds the step sequence, scores the risk, and proposes the final automation — ready to activate.
          </p>
        </div>
      </div>

      {/* KIMMP-native triggers */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(226,68,92,0.04)', border: '1px solid rgba(226,68,92,0.1)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Zap style={{ width: 14, height: 14, color: '#e2445c' }} />
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">KIMMP-Native Triggers — not available in any other workflow tool</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {KIMMP_TRIGGERS.map(t => (
            <button key={t.id} onClick={() => {
              setDescription(prev => prev ? prev : `When ${t.label.toLowerCase()}, `)
              textRef.current?.focus()
            }}
              className="text-left p-2.5 rounded-lg transition-all hover:opacity-90"
              style={{ background: `${t.color}08`, border: `1px solid ${t.color}18` }}>
              <div className="text-sm mb-1">{t.icon}</div>
              <p className="text-[11px] font-bold leading-tight" style={{ color: t.color }}>{t.label}</p>
              <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Description input */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
        <div className="px-4 py-3 border-b border-[#1f2a4a] flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Describe your workflow in plain English</p>
          <p className="text-[10px] text-slate-700">{description.length} chars</p>
        </div>
        <div className="p-4">
          <textarea
            ref={textRef}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. When a new enterprise client signs, assign a CSM within 24h, schedule an onboarding call within 48h, notify the delivery lead, and create a project in Projects..."
            rows={4}
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-700 resize-none focus:outline-none leading-relaxed"
          />
        </div>

        {/* Examples */}
        <div className="px-4 pb-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700 mb-2">Examples — click to use</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setDescription(ex); textRef.current?.focus() }}
                className="text-[10px] px-2.5 py-1.5 rounded-lg text-left transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                {ex.slice(0, 60)}…
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4 flex items-center gap-3">
          <button onClick={generate} disabled={!description.trim() || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#a78bfa' }}>
            {loading
              ? <><span className="animate-spin">⟳</span> KIMMP is designing…</>
              : <><Sparkles style={{ width: 14, height: 14 }} /> Build this workflow</>
            }
          </button>
          {result && (
            <button onClick={() => { setResult(null); setDescription('') }}
              className="flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-slate-400 transition-colors">
              <RotateCcw style={{ width: 12, height: 12 }} /> Start over
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(226,68,92,0.08)', border: '1px solid rgba(226,68,92,0.2)' }}>
          <AlertTriangle style={{ width: 14, height: 14, color: '#e2445c' }} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-red-400 mb-0.5">KIMMP could not generate workflow</p>
            <p className="text-[11px] text-slate-500">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Intent header */}
          <div className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <CheckCircle2 style={{ width: 16, height: 16, color: '#a78bfa' }} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-bold text-white">{result.intent}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded capitalize"
                  style={{ color: triggerColor(result.triggerType), background: `${triggerColor(result.triggerType)}12`, border: `1px solid ${triggerColor(result.triggerType)}25` }}>
                  {result.triggerType} trigger
                </span>
                <span className="text-[10px] text-slate-500 capitalize">{result.category}</span>
              </div>
              {result.triggerEvent && (
                <p className="text-[11px] text-slate-400">
                  Trigger: <span className="font-mono text-purple-300">{result.triggerEvent}</span>
                  {result.triggerFilter && <> · Filter: <span className="font-mono text-purple-300">{result.triggerFilter}</span></>}
                  {result.triggerSchedule && <> · Schedule: <span className="font-mono text-purple-300">{result.triggerSchedule}</span></>}
                </p>
              )}
              <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
                <Clock style={{ width: 10, height: 10 }} /> Estimated duration: {result.estimatedDuration}
              </p>
            </div>
          </div>

          {/* Two-col: steps + risk */}
          <div className="grid grid-cols-3 gap-4">

            {/* Steps */}
            <div className="col-span-2 rounded-xl p-5" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-4">
                Workflow Steps — {result.steps.length} step{result.steps.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-0">
                {result.steps.map((step, i) => (
                  <StepCard key={step.id} step={step} index={i} />
                ))}
              </div>
            </div>

            {/* Risk + KIMMP note */}
            <div className="space-y-3">
              <div className="rounded-xl p-4" style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
                <RiskMeter score={result.riskScore} />
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Brain style={{ width: 12, height: 12, color: '#a78bfa' }} />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-purple-400">KIMMP Recommendation</p>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{result.kimmpNote}</p>
              </div>

              {/* Activate button */}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: 'rgba(0,200,117,0.1)', border: '1px solid rgba(0,200,117,0.25)', color: '#00c875' }}>
                <ArrowRight style={{ width: 14, height: 14 }} />
                Save & Activate
              </button>
              <p className="text-[10px] text-slate-700 text-center -mt-1">Opens in Workflow Builder for review</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
