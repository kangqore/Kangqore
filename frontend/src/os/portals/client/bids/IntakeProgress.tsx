import { motion } from 'framer-motion'
import { spring } from '@os/motion'
import { INTAKE_ENGINES } from './intakeQuestions'
import { useIntakeStore } from './useIntakeStore'

export function IntakeProgress() {
  const currentSection = useIntakeStore(s => s.currentSection)
  const sectionsDone   = useIntakeStore(s => s.intakeData.sectionsDone)
  const lastSavedAt    = useIntakeStore(s => s.lastSavedAt)
  const isDirty        = useIntakeStore(s => s.isDirty)

  const totalSections  = 7 // 0 foundation + 6 engines
  const progressPct    = Math.round((sectionsDone.length / totalSections) * 100)

  return (
    <div
      className="h-14 flex items-center px-6 gap-6 border-b border-white/6"
      style={{ background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(12px)' }}
    >
      {/* BIDS™ brand */}
      <div className="flex-shrink-0">
        <span
          className="text-os-sm font-black tracking-widest uppercase"
          style={{ background: 'linear-gradient(90deg,#2564ea,#4ab6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          BIDS™
        </span>
        <span className="text-[10px] text-[#475569] ml-1.5">Diagnostic Intake</span>
      </div>

      {/* Section dots */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Foundation */}
        <SectionDot index={0} current={currentSection} done={sectionsDone.includes(0)} label="Foundation" color="#64748b" />
        <div className="w-3 h-px bg-white/10" />
        {/* Engines */}
        {INTAKE_ENGINES.map((engine, i) => (
          <div key={engine.id} className="flex items-center gap-1.5">
            <SectionDot
              index={i + 1}
              current={currentSection}
              done={sectionsDone.includes(i + 1)}
              label={engine.name.replace(' Intelligence Engine™', '')}
              color={engine.color}
            />
            {i < INTAKE_ENGINES.length - 1 && <div className="w-3 h-px bg-white/10" />}
          </div>
        ))}
        <div className="w-3 h-px bg-white/10" />
        {/* Review */}
        <SectionDot index={7} current={currentSection} done={sectionsDone.includes(7)} label="Review" color="#00c875" />
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-1.5 rounded-full bg-white/6 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#2564ea,#4ab6d4)' }}
          animate={{ width: `${progressPct}%` }}
          transition={{ ...spring.snappy }}
        />
      </div>

      {/* Section label + save indicator */}
      <div className="flex-shrink-0 text-right">
        <p className="text-os-sm text-white font-semibold">
          {currentSection === 0 ? 'Foundation' : currentSection <= 6 ? INTAKE_ENGINES[currentSection - 1].name.split(' ')[0] : 'Review & Submit'}
        </p>
        <p className="text-[10px] text-[#475569]">
          {isDirty ? 'Unsaved changes…' : lastSavedAt ? `Saved ${lastSavedAt}` : `${progressPct}% complete`}
        </p>
      </div>
    </div>
  )
}

function SectionDot({ index, current, done, label, color }: {
  index: number; current: number; done: boolean; label: string; color: string
}) {
  const active = current === index
  return (
    <motion.div
      className="relative group cursor-default"
      animate={{ scale: active ? 1.15 : 1 }}
      transition={{ ...spring.snappy }}
    >
      <div
        className="w-3 h-3 rounded-full transition-all duration-200"
        style={{
          background:  done ? color : active ? color + '80' : 'rgba(255,255,255,0.1)',
          boxShadow:   active ? `0 0 8px ${color}60` : 'none',
          border:      active ? `1.5px solid ${color}` : '1.5px solid transparent',
        }}
      />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0d1117] border border-white/10 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {label}
      </div>
    </motion.div>
  )
}
