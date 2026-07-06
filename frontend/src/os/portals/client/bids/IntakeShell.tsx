import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardCheck, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { slideRight, spring, fadeUp } from '@os/motion'
import { IntakeProgress } from './IntakeProgress'
import { IntakePillarMap } from './IntakePillarMap'
import { IntakeWaandaPanel } from './IntakeWaandaPanel'
import { IntakeEngineSection } from './IntakeEngine'
import { IntakeReview } from './IntakeReview'
import { useIntakeStore } from './useIntakeStore'
import { useIntakeSave, useIntakeSubmit, useBidsStatus } from './useIntakeSubmit'
import { INTAKE_ENGINES } from './intakeQuestions'

interface Props {
  engagementId: string
}

export function IntakeShell({ engagementId }: Props) {
  const currentSection = useIntakeStore(s => s.currentSection)
  const intakeData     = useIntakeStore(s => s.intakeData)
  const isDirty        = useIntakeStore(s => s.isDirty)
  const nextSection    = useIntakeStore(s => s.nextSection)
  const prevSection    = useIntakeStore(s => s.prevSection)
  const setEngId       = useIntakeStore(s => s.setEngagementId)

  const saveMutation   = useIntakeSave()
  const submitMutation = useIntakeSubmit()

  const isProcessing = submitMutation.isPending ||
    submitMutation.isSuccess && (currentSection === 8)

  // Poll status after submit
  const { data: statusData } = useBidsStatus(submitMutation.isSuccess)
  const waandaDone = statusData?.status === 'WAANDA_DRAFT' || statusData?.status === 'CONSULTANT_REVIEW' || statusData?.status === 'ACTIVE'

  // Sync engagementId into store
  useEffect(() => { setEngId(engagementId) }, [engagementId])

  // Auto-save every 60 seconds when dirty
  const saveTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (saveTimer.current) clearInterval(saveTimer.current)
    saveTimer.current = setInterval(() => {
      if (isDirty) saveMutation.mutate(intakeData)
    }, 60_000)
    return () => { if (saveTimer.current) clearInterval(saveTimer.current) }
  }, [isDirty, intakeData])

  const handleSubmit = () => {
    submitMutation.mutate(intakeData)
  }

  // Show processing / done screen after submit
  if (submitMutation.isSuccess) {
    return <WaandaProcessingScreen done={waandaDone} />
  }

  const currentEngine = currentSection >= 1 && currentSection <= 6
    ? INTAKE_ENGINES[currentSection - 1]
    : undefined

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#060b18', zIndex: 50 }}>
      {/* Top progress bar */}
      <IntakeProgress />

      {/* 3-panel body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — Pillar map */}
        <div
          className="w-[200px] flex-shrink-0 border-r border-white/5 overflow-hidden"
          style={{ background: 'rgba(13,17,23,0.7)' }}
        >
          <IntakePillarMap />
        </div>

        {/* Center — current section */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ ...spring.smooth }}
              className="absolute inset-0"
            >
              {currentSection === 7 ? (
                <IntakeReview onSubmit={handleSubmit} onBack={prevSection} isSubmitting={submitMutation.isPending} />
              ) : (
                <IntakeEngineSection
                  engine={currentEngine}
                  onNext={nextSection}
                  onBack={prevSection}
                  isFirst={currentSection === 0}
                  isLast={currentSection === 6}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right panel — WAANDA hints */}
        <div
          className="w-[240px] flex-shrink-0 border-l border-white/5 overflow-hidden"
          style={{ background: 'rgba(13,17,23,0.7)' }}
        >
          <IntakeWaandaPanel />
        </div>
      </div>
    </div>
  )
}

// ─── WAANDA Processing Screen ─────────────────────────────────────────────────

function WaandaProcessingScreen({ done }: { done: boolean }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#060b18', zIndex: 50 }}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-md px-8"
      >
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring.bouncy }}
              className="space-y-5"
            >
              <CheckCircle2 className="w-16 h-16 text-[#00c875] mx-auto" />
              <div>
                <h2 className="text-os-xl font-black text-white mb-2">Diagnostic Complete</h2>
                <p className="text-os-sm text-[#64748b]">
                  WAANDA has generated your preliminary 16-pillar diagnostic. A Kangqore consultant is now reviewing and refining your results. You'll be notified when your report is ready.
                </p>
              </div>
              <div
                className="rounded-xl p-4 text-left"
                style={{ background: '#00c87510', border: '1px solid #00c87530' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#00c875] mb-1">What happens next</p>
                <ul className="space-y-1">
                  {['Consultant reviews WAANDA\'s findings', 'Report refined and validated', '10 deliverables prepared', 'You receive your Diagnostic Scorecard™'].map((step, i) => (
                    <li key={i} className="text-os-sm text-[#94a3b8] flex items-center gap-2">
                      <span className="text-[#00c875] font-bold">{i + 1}.</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div key="processing" className="space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid #2564ea30' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{ border: '2px solid #4ab6d440', borderTopColor: '#4ab6d4' }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
              </div>
              <div>
                <h2 className="text-os-xl font-black text-white mb-2">WAANDA is diagnosing</h2>
                <p className="text-os-sm text-[#64748b]">
                  Analysing your answers across all 16 diagnostic pillars. This takes 30–60 seconds.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#4ab6d4]">
                <Clock className="w-4 h-4" />
                <p className="text-os-sm font-medium">Estimating 30–60 seconds…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
