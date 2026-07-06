import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, ChevronLeft, Send, AlertTriangle } from 'lucide-react'
import { staggerContainer, staggerChild, spring } from '@os/motion'
import { INTAKE_ENGINES, FOUNDATION_QUESTIONS } from './intakeQuestions'
import { useIntakeStore } from './useIntakeStore'

interface Props {
  onSubmit:     () => void
  onBack:       () => void
  isSubmitting: boolean
}

export function IntakeReview({ onSubmit, onBack, isSubmitting }: Props) {
  const intakeData   = useIntakeStore(s => s.intakeData)
  const foundation   = intakeData.foundation as Record<string, any>
  const allEngines   = intakeData.engines
  const sectionsDone = intakeData.sectionsDone

  const completedEngines = INTAKE_ENGINES.filter((_, i) => sectionsDone.includes(i + 1))
  const allRequired = sectionsDone.length >= 7 // foundation + 6 engines

  // Check which engines are incomplete
  const incomplete = INTAKE_ENGINES.filter((_, i) => !sectionsDone.includes(i + 1))

  // Preliminary WAANDA observation based on answer patterns
  const observation = buildObservation(allEngines, foundation)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 border-b border-white/5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#64748b]">Section 7 of 7</p>
        <h2 className="text-os-lg font-black text-white mt-0.5">Review & Submit</h2>
        <p className="text-os-sm text-[#64748b] mt-1">Review your answers before WAANDA generates your diagnostic.</p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {/* WAANDA preliminary observation */}
        {observation && (
          <div
            className="rounded-xl p-4"
            style={{ background: '#2564ea0c', border: '1px solid #2564ea25' }}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#4ab6d4] mb-2">🧠 WAANDA Preliminary Observation</p>
            <p className="text-os-sm text-[#cbd5e1] leading-relaxed">{observation}</p>
          </div>
        )}

        {/* Incomplete warning */}
        {incomplete.length > 0 && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: '#fdab3d0c', border: '1px solid #fdab3d25' }}
          >
            <AlertTriangle className="w-4 h-4 text-[#fdab3d] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-os-sm font-semibold text-[#fdab3d]">Incomplete sections</p>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                The following engines are not fully answered. WAANDA will score these conservatively.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {incomplete.map(e => (
                  <span
                    key={e.id}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: e.color + '18', color: e.color, border: `1px solid ${e.color}30` }}
                  >
                    {e.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Answer summaries per engine */}
        <div className="space-y-3">
          <FoundationSummary answers={foundation} />
          {INTAKE_ENGINES.map((engine, i) => (
            <EngineSummary
              key={engine.id}
              engine={engine}
              answers={allEngines[engine.id] ?? {}}
              done={sectionsDone.includes(i + 1)}
            />
          ))}
        </div>

        <div className="h-4" />
      </div>

      {/* Navigation */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-8 py-4 border-t border-white/5"
        style={{ background: 'rgba(13,17,23,0.6)', backdropFilter: 'blur(8px)' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/8 text-os-sm font-medium text-[#94a3b8] hover:text-white hover:border-white/20 transition-all duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-os-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg,#2564ea,#4ab6d4)',
            boxShadow:  '0 4px 20px #2564ea50',
          }}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit for BIDS™ Diagnostic
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Foundation summary ───────────────────────────────────────────────────────

function FoundationSummary({ answers }: { answers: Record<string, any> }) {
  const [open, setOpen] = useState(true)

  return (
    <SummaryCard
      title="Foundation"
      color="#64748b"
      open={open}
      onToggle={() => setOpen(!open)}
      done={Object.keys(answers).length > 0}
    >
      <div className="space-y-2">
        {FOUNDATION_QUESTIONS.map(q => {
          const v = answers[q.id]
          if (!v) return null
          return (
            <div key={q.id}>
              <p className="text-[10px] text-[#475569]">{q.label}</p>
              <p className="text-os-sm text-[#cbd5e1]">{formatAnswer(v)}</p>
            </div>
          )
        })}
      </div>
    </SummaryCard>
  )
}

// ─── Engine summary ───────────────────────────────────────────────────────────

function EngineSummary({ engine, answers, done }: { engine: any; answers: Record<string, any>; done: boolean }) {
  const [open, setOpen] = useState(false)
  const answered = Object.keys(answers).filter(k => {
    const v = answers[k]
    if (!v) return false
    if (Array.isArray(v) && v.length === 0) return false
    if (typeof v === 'string' && v.trim() === '') return false
    return true
  }).length

  return (
    <SummaryCard
      title={engine.name}
      color={engine.color}
      open={open}
      onToggle={() => setOpen(!open)}
      done={done}
      subtitle={`${answered} / ${engine.questions.length} answered`}
    >
      <div className="space-y-2">
        {engine.questions.map((q: any) => {
          const v = answers[q.id]
          if (!v) return null
          return (
            <div key={q.id}>
              <p className="text-[10px] text-[#475569]">{q.label}</p>
              <p className="text-os-sm text-[#cbd5e1]">{formatAnswer(v)}</p>
            </div>
          )
        })}
      </div>
    </SummaryCard>
  )
}

// ─── Summary card wrapper ─────────────────────────────────────────────────────

function SummaryCard({
  title, color, open, onToggle, done, subtitle, children
}: {
  title: string; color: string; open: boolean; onToggle: () => void
  done: boolean; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl overflow-hidden border transition-all duration-200"
      style={{
        borderColor: open ? color + '30' : 'rgba(255,255,255,0.06)',
        background:  open ? color + '06' : 'rgba(255,255,255,0.02)',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: done ? color : '#334155', boxShadow: done ? `0 0 6px ${color}60` : 'none' }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-os-sm font-semibold text-white truncate">{title}</p>
          {subtitle && <p className="text-[10px] text-[#475569]">{subtitle}</p>}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#475569] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#475569] flex-shrink-0" />}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ ...spring.smooth }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4 border-t border-white/5 pt-3">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAnswer(v: any): string {
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'object' && v !== null) {
    if (v.main !== undefined) return `${formatAnswer(v.main)}${v.detail ? ` → ${formatAnswer(v.detail)}` : ''}`
    return JSON.stringify(v)
  }
  return String(v)
}

function buildObservation(engines: Record<string, Record<string, any>>, foundation: Record<string, any>): string {
  const answeredEngines = INTAKE_ENGINES.filter(e => Object.keys(engines[e.id] ?? {}).length > 0)
  if (answeredEngines.length === 0) return ''

  const challenge = foundation.biggest_challenge as string | undefined
  const industry  = foundation.industry as string | undefined

  const highScoreEngines: string[] = []
  const lowScoreEngines:  string[] = []

  answeredEngines.forEach(engine => {
    const answers = engines[engine.id] ?? {}
    let totalScore = 0
    let count = 0
    engine.questions.forEach(q => {
      const v = answers[q.id]
      if (q.type === 'maturity_slider' && v) {
        totalScore += Number(v)
        count++
      }
    })
    if (count > 0) {
      const avg = totalScore / count
      if (avg >= 3.5) highScoreEngines.push(engine.name.split(' ')[0])
      if (avg <= 2) lowScoreEngines.push(engine.name.split(' ')[0])
    }
  })

  const parts: string[] = []
  if (highScoreEngines.length > 0) parts.push(`WAANDA is detecting relative maturity in your ${highScoreEngines.join(' and ')} capabilities`)
  if (lowScoreEngines.length > 0) parts.push(`priority diagnostic areas emerging in ${lowScoreEngines.join(' and ')}`)
  if (challenge) parts.push(`with "${challenge.slice(0, 60)}${challenge.length > 60 ? '…' : ''}" framing the diagnostic lens`)

  if (parts.length === 0) return 'WAANDA has recorded your answers. The full diagnostic will be generated once you submit.'

  return parts.join(', ') + '. The full 16-pillar scoring will quantify these patterns with specific findings and recommendations.'
}
