import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@lib/api'
import {
  X, ChevronRight, CheckCircle2, Cpu, Brain, Compass, Workflow, BarChart3
} from 'lucide-react'

// ─── Lightweight confetti (no external dep) ───────────────────────────────────

function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height * 0.5,
    r: Math.random() * 8 + 4,
    d: Math.random() * 3 + 2,
    color: ['#2564ea','#10B981','#F59E0B','#EC4899','#8B5CF6','#06B6D4'][Math.floor(Math.random()*6)],
    tilt: Math.random() * 10 - 5,
    tiltSpeed: Math.random() * 0.1 + 0.05,
    opacity: 1,
  }))
  let frame = 0
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pieces.forEach(p => {
      p.y += p.d
      p.tilt += p.tiltSpeed
      p.opacity -= 0.004
      ctx.save()
      ctx.globalAlpha = Math.max(0, p.opacity)
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.4, p.tilt, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
    frame++
    if (frame < 200) requestAnimationFrame(tick)
    else { ctx.clearRect(0, 0, canvas.width, canvas.height) }
  }
  requestAnimationFrame(tick)
}

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    icon: Cpu,
    color: '#2564ea',
    title: 'Welcome to Kangqore OS',
    subtitle: 'Enterprise Operating System — powered by WAANDA intelligence',
    body: 'Kangqore OS is your single command centre for strategy, operations, client management, and AI-driven decision-making. Everything your team needs, unified under one OS.',
    cta: 'Get started',
  },
  {
    id: 2,
    icon: Workflow,
    color: '#10B981',
    title: 'Your First Workspace',
    subtitle: 'Intelligence Canvas — where strategy comes alive',
    body: 'Workflows are how Kangqore thinks. Each workflow is a living strategic canvas where goals, decisions, and execution connect. Create your first one under KIMMP → Workflows.',
    cta: 'I understand',
  },
  {
    id: 3,
    icon: Compass,
    color: '#8B5CF6',
    title: 'Meet WAANDA',
    subtitle: 'Your AI brain — Observe · Understand · Decide · Act · Learn',
    body: 'WAANDA is not a chatbot. It is the reasoning engine that runs beneath every decision. It reads your signals, analyses your context, and tells you what to do next — and can act on it with your approval.',
    cta: 'Impressive',
  },
  {
    id: 4,
    icon: Brain,
    color: '#F59E0B',
    title: 'Activate KIMMP Intelligence',
    subtitle: 'Kangqore Integrated Mission Management Platform',
    body: 'KIMMP is the runtime that connects data, agents, decisions, and actions. Open Mission Control to see live signals. Check Signals for real-time intelligence. Use Scout to search external intelligence.',
    cta: 'Activated',
  },
  {
    id: 5,
    icon: BarChart3,
    color: '#EC4899',
    title: 'Record Your OIS Baseline',
    subtitle: 'Operational Intelligence Score — your north-star metric',
    body: 'Your OIS score measures how intelligently your organisation operates. Enter your baseline below. WAANDA will track your improvement from this point forward.',
    cta: 'Complete setup',
    hasOisInput: true,
  },
]

// ─── Main component ───────────────────────────────────────────────────────────

interface OnboardingState {
  id: string
  userId: string
  currentStep: number
  completed: boolean
  oisBaseline: number | null
}

interface Props {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: Props) {
  const [state, setState] = useState<OnboardingState | null>(null)
  const [step, setStep]   = useState(1)
  const [ois, setOis]     = useState('')
  const [saving, setSaving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    api.get('/admin/onboarding').then(r => {
      setState(r.data)
      setStep(r.data.currentStep ?? 1)
    }).catch(() => {})
  }, [])

  const saveStep = useCallback(async (nextStep: number, extraData: Record<string, unknown> = {}) => {
    setSaving(true)
    try {
      const r = await api.patch('/admin/onboarding', { currentStep: nextStep, ...extraData })
      setState(r.data)
    } catch { /* non-blocking */ }
    finally { setSaving(false) }
  }, [])

  const handleNext = async () => {
    const currentStepDef = STEPS[step - 1]
    if (step === STEPS.length) {
      // Final step — complete onboarding
      const oisVal = parseFloat(ois)
      const extra: Record<string, unknown> = { completed: true }
      if (!isNaN(oisVal) && oisVal > 0) extra.oisBaseline = oisVal
      await saveStep(step, extra)
      // Confetti!
      if (canvasRef.current) launchConfetti(canvasRef.current)
      setTimeout(onComplete, 2200)
    } else {
      await saveStep(step + 1)
      setStep(s => s + 1)
    }
  }

  const handleSkip = async () => {
    await saveStep(step, { completed: true })
    onComplete()
  }

  if (!state || state.completed) return null

  const stepDef = STEPS[step - 1]
  const Icon = stepDef.icon
  const progress = (step / STEPS.length) * 100

  return (
    <>
      {/* Confetti canvas — sits above everything */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[200]"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0f1117] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Progress bar */}
            <div className="h-1 bg-gray-100 dark:bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stepDef.color }}
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>

            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              title="Skip onboarding"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {STEPS.map(s => (
                  <div
                    key={s.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s.id < step ? 'flex-1' : s.id === step ? 'flex-[2]' : 'flex-1 opacity-30'
                    }`}
                    style={{ backgroundColor: s.id <= step ? stepDef.color : '#e5e7eb' }}
                  />
                ))}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ backgroundColor: stepDef.color + '18' }}
              >
                <Icon className="w-7 h-7" style={{ color: stepDef.color }} />
              </div>

              {/* Content */}
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: stepDef.color }}>
                Step {step} of {STEPS.length}
              </p>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1 leading-tight">
                {stepDef.title}
              </h2>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                {stepDef.subtitle}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {stepDef.body}
              </p>

              {/* OIS input (step 5 only) */}
              {stepDef.hasOisInput && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Current OIS Score (0–100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g. 72.4"
                    value={ois}
                    onChange={e => setOis(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">Leave blank to skip — you can set this later in KIMMP → Gate 8.</p>
                </div>
              )}

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {step < STEPS.length ? `${STEPS.length - step} step${STEPS.length - step !== 1 ? 's' : ''} remaining` : 'Last step'}
                </span>
                <button
                  onClick={handleNext}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                  style={{ backgroundColor: stepDef.color }}
                >
                  {step === STEPS.length ? (
                    <><CheckCircle2 className="w-4 h-4" />{saving ? 'Saving…' : stepDef.cta}</>
                  ) : (
                    <>{saving ? 'Saving…' : stepDef.cta}<ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
