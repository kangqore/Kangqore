import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'
import { fadeUp, tween } from '@os/motion'
import { IntakeEngine } from './intakeTypes'
import { useIntakeStore, selectEngineAnswers } from './useIntakeStore'
import { INTAKE_ENGINES, FOUNDATION_QUESTIONS } from './intakeQuestions'

interface ActiveHint {
  text:  string
  color: string
  key:   string
}

export function IntakeWaandaPanel() {
  const currentSection = useIntakeStore(s => s.currentSection)
  const foundation     = useIntakeStore(s => s.intakeData.foundation)
  const allEngines     = useIntakeStore(s => s.intakeData.engines)

  const [activeHints, setActiveHints] = useState<ActiveHint[]>([])
  const [isThinking, setIsThinking]   = useState(false)

  const currentEngine = currentSection >= 1 && currentSection <= 6
    ? INTAKE_ENGINES[currentSection - 1]
    : null

  const engineAnswers = currentEngine ? (allEngines[currentEngine.id] ?? {}) : {}

  // Collect hints from current section's questions
  useEffect(() => {
    if (!currentEngine) return

    const hints: ActiveHint[] = []

    currentEngine.questions.forEach(q => {
      const answer = engineAnswers[q.id]
      if (answer === undefined || answer === null) return

      q.waandaHints?.forEach(hint => {
        if (hint.condition(answer)) {
          hints.push({
            text:  hint.text,
            color: currentEngine.color,
            key:   `${q.id}-${JSON.stringify(answer).slice(0, 20)}`,
          })
        }
      })
    })

    // Foundation hints
    if (currentSection === 0) {
      FOUNDATION_QUESTIONS.forEach(q => {
        const answer = (foundation as any)[q.id]
        if (answer === undefined || answer === null) return
        q.waandaHints?.forEach(hint => {
          if (hint.condition(answer)) {
            hints.push({ text: hint.text, color: '#2564ea', key: `found-${q.id}` })
          }
        })
      })
    }

    if (hints.length > 0) {
      setIsThinking(true)
      const t = setTimeout(() => {
        setIsThinking(false)
        setActiveHints(hints.slice(0, 3))
      }, 800)
      return () => clearTimeout(t)
    } else {
      setActiveHints([])
    }
  }, [engineAnswers, currentSection, foundation])

  const engine = currentEngine

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto gap-4">
      {/* WAANDA header */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#2564ea20,#4ab6d420)', border: '1px solid #2564ea30' }}
        >
          <Brain className="w-3.5 h-3.5 text-[#4ab6d4]" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#4ab6d4' }}>WAANDA™</p>
          <p className="text-[9px] text-[#475569]">Live diagnostic insights</p>
        </div>
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-auto"
            >
              <ThinkingDots />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current engine context */}
      {engine && (
        <div
          className="rounded-xl p-3 flex-shrink-0"
          style={{ background: engine.color + '0c', border: `1px solid ${engine.color}20` }}
        >
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: engine.color }}>
            Now assessing
          </p>
          <p className="text-os-sm font-semibold text-white">{engine.name}</p>
          <p className="text-[10px] text-[#64748b] mt-0.5">{engine.tagline}</p>
        </div>
      )}

      {/* Hints */}
      <div className="flex-1 space-y-3">
        <AnimatePresence mode="popLayout">
          {activeHints.length > 0 ? (
            activeHints.map((hint, i) => (
              <motion.div
                key={hint.key}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: i * 0.08, ...tween.slow }}
                className="rounded-xl p-3"
                style={{
                  background: hint.color + '0c',
                  border:     `1px solid ${hint.color}20`,
                }}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: hint.color }} />
                  <p className="text-[11px] text-[#cbd5e1] leading-relaxed">{hint.text}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <Brain className="w-8 h-8 text-[#1e293b] mx-auto mb-2" />
              <p className="text-[10px] text-[#334155]">WAANDA observes your answers and surfaces insights as you go.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer note */}
      <div className="flex-shrink-0 pt-3 border-t border-white/5">
        <p className="text-[9px] text-[#334155] leading-relaxed">
          These are preliminary observations from WAANDA. The full 16-pillar diagnostic is generated after you submit — reviewed and refined by a Kangqore consultant before you receive your results.
        </p>
      </div>
    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-[#4ab6d4]"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
