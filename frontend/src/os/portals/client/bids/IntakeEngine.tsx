import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { slideRight, spring, staggerContainer, staggerChild } from '@os/motion'
import { IntakeEngine as Engine } from './intakeTypes'
import { FOUNDATION_QUESTIONS } from './intakeQuestions'
import { IntakeQuestion } from './IntakeQuestion'
import { useIntakeStore } from './useIntakeStore'

interface Props {
  engine?:   Engine       // undefined = foundation section (section 0)
  onNext:    () => void
  onBack:    () => void
  isFirst:   boolean
  isLast:    boolean
}

export function IntakeEngineSection({ engine, onNext, onBack, isFirst, isLast }: Props) {
  const setAnswer      = useIntakeStore(s => s.setAnswer)
  const setFoundation  = useIntakeStore(s => s.setFoundation)
  const foundation     = useIntakeStore(s => s.intakeData.foundation)
  const allEngines     = useIntakeStore(s => s.intakeData.engines)
  const markDone       = useIntakeStore(s => s.markSectionDone)
  const currentSection = useIntakeStore(s => s.currentSection)

  const [submitted, setSubmitted] = useState(false)

  const questions = engine ? engine.questions : FOUNDATION_QUESTIONS
  const answers   = engine ? (allEngines[engine.id] ?? {}) : foundation as Record<string, any>

  const requiredAnswered = questions
    .filter(q => q.required)
    .every(q => {
      const v = answers[q.id]
      if (v === undefined || v === null) return false
      if (typeof v === 'string' && v.trim() === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    })

  const handleChange = (questionId: string, value: any) => {
    if (engine) {
      setAnswer(engine.id, questionId, value)
    } else {
      setFoundation({ [questionId]: value } as any)
    }
  }

  const handleNext = () => {
    markDone(currentSection)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onNext()
    }, 600)
  }

  const color = engine?.color ?? '#2564ea'

  return (
    <div className="h-full flex flex-col">
      {/* Engine header */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          {engine && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: engine.color + '18', border: `1px solid ${engine.color}30` }}
            >
              {engine.icon}
            </div>
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
              {engine ? `Engine ${engine.id} of 6` : 'Foundation'}
            </p>
            <h2 className="text-os-lg font-black text-white">
              {engine ? engine.name : 'Foundation Information'}
            </h2>
            {engine && (
              <p className="text-os-sm text-[#64748b] mt-0.5">{engine.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ...spring.bouncy }}
              className="h-full flex flex-col items-center justify-center gap-4"
            >
              <CheckCircle2 className="w-16 h-16" style={{ color }} />
              <p className="text-os-lg font-bold text-white">Section complete</p>
              <p className="text-os-sm text-[#64748b]">Moving to the next section…</p>
            </motion.div>
          ) : (
            <motion.div
              key={engine?.id ?? 'foundation'}
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {questions.map(q => (
                <motion.div key={q.id} variants={staggerChild}>
                  <IntakeQuestion
                    question={q}
                    value={answers[q.id]}
                    onChange={v => handleChange(q.id, v)}
                  />
                </motion.div>
              ))}

              {/* Bottom padding so last question isn't hidden behind nav */}
              <div className="h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-8 py-4 border-t border-white/5"
        style={{ background: 'rgba(13,17,23,0.6)', backdropFilter: 'blur(8px)' }}
      >
        <button
          onClick={onBack}
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/8 text-os-sm font-medium text-[#94a3b8] hover:text-white hover:border-white/20 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          {!requiredAnswered && (
            <p className="text-[10px] text-[#475569]">Answer all required questions to continue</p>
          )}
          <button
            onClick={handleNext}
            disabled={!requiredAnswered}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-os-sm font-bold text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background:  requiredAnswered ? `linear-gradient(135deg,${color},${color}bb)` : 'rgba(255,255,255,0.06)',
              boxShadow:   requiredAnswered ? `0 4px 16px ${color}40` : 'none',
            }}
          >
            {isLast ? 'Review Answers' : 'Next Section'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
