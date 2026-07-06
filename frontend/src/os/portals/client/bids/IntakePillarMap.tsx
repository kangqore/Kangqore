import { motion } from 'framer-motion'
import { spring, staggerContainer, staggerChild } from '@os/motion'
import { ALL_PILLARS, INTAKE_ENGINES } from './intakeQuestions'
import { useIntakeStore } from './useIntakeStore'
import { MATURITY_COLORS } from './intakeTypes'
import { IntakeRadarChart } from './IntakeRadarChart'

export function IntakePillarMap() {
  const engines      = useIntakeStore(s => s.intakeData.engines)
  const sectionsDone = useIntakeStore(s => s.intakeData.sectionsDone)

  // Compute a rough per-pillar completion score from answered questions
  const pillarActivity = computePillarActivity(engines)

  return (
    <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
      {/* Radar chart */}
      <div className="flex-shrink-0">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-[#475569] mb-2">Preliminary Profile</p>
        <IntakeRadarChart engines={INTAKE_ENGINES} sectionsDone={sectionsDone} engines_answers={engines} />
      </div>

      {/* Pillar grid */}
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-widest text-[#475569] mb-2">16 Diagnostic Pillars™</p>
        <motion.div
          variants={staggerContainer(0.03)}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {ALL_PILLARS.map(pillar => {
            const engine    = INTAKE_ENGINES.find(e => e.id === pillar.engineId)
            const activity  = pillarActivity[pillar.id] ?? 0
            const isDone    = activity >= 0.6
            const isPartial = activity > 0 && !isDone
            const color     = engine?.color ?? '#475569'

            return (
              <motion.div
                key={pillar.id}
                variants={staggerChild}
                className="flex items-center gap-2 py-1 px-2 rounded-lg transition-all duration-200"
                style={{ background: isDone ? color + '10' : 'transparent' }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  animate={{ background: isDone ? color : isPartial ? color + '80' : 'rgba(255,255,255,0.12)' }}
                  transition={{ ...spring.bouncy }}
                  style={{ boxShadow: isDone ? `0 0 6px ${color}60` : 'none' }}
                />
                <p
                  className="text-[10px] font-medium leading-tight truncate"
                  style={{ color: isDone ? '#e2e8f0' : '#475569' }}
                >
                  {pillar.name.replace('™', '')}
                </p>
                {isDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring.bouncy }}
                    className="ml-auto text-[9px] font-bold flex-shrink-0"
                    style={{ color }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

// Compute 0–1 activity score per pillar based on answers given in engine sections
function computePillarActivity(engines: Record<string, Record<string, any>>): Record<number, number> {
  const result: Record<number, number> = {}

  INTAKE_ENGINES.forEach(engine => {
    const answers = engines[engine.id] ?? {}
    const answered = Object.keys(answers).filter(k => {
      const v = answers[k]
      if (v === null || v === undefined) return false
      if (typeof v === 'string' && v.trim() === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    }).length
    const total = engine.questions.filter(q => q.required).length || 1
    const ratio = Math.min(answered / total, 1)

    engine.pillarIds.forEach(pid => {
      result[pid] = Math.max(result[pid] ?? 0, ratio)
    })
  })

  return result
}
