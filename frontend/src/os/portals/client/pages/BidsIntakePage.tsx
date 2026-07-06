import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, FileSearch, Clock, ArrowUpRight } from 'lucide-react'
import { fadeUp } from '@os/motion'
import { useAuthStore } from '@store/auth'
import { useBidsEngagement } from '../bids/useIntakeSubmit'
import { IntakeShell } from '../bids/IntakeShell'
import { useIntakeStore } from '../bids/useIntakeStore'
import { BidsResultsView } from '../bids/BidsResultsView'

export function BidsIntakePage() {
  const user               = useAuthStore(s => s.user)
  const { data, isLoading, isError } = useBidsEngagement()
  const storedEngagementId = useIntakeStore(s => s.engagementId)

  // Gate: must be CLIENT with bidsActive
  if (!user?.bidsActive) {
    return <BidsGate reason="not_active" />
  }

  if (isLoading) {
    return <BidsLoadingScreen />
  }

  if (isError || !data) {
    return <BidsGate reason="no_engagement" />
  }

  // Published — show full diagnostic results
  if (data.status === 'ACTIVE' || data.status === 'COMPLETED') {
    return (
      <div className="h-full overflow-y-auto px-6 py-8 max-w-5xl mx-auto">
        <BidsResultsView engagement={data} />
      </div>
    )
  }

  // In-progress states — show waiting screen
  const pending = ['WAANDA_DRAFT', 'CONSULTANT_REVIEW']
  if (pending.includes(data.status)) {
    return <BidsStatusScreen status={data.status} />
  }

  const engId = data.id ?? storedEngagementId ?? ''

  return <IntakeShell engagementId={engId} />
}

// ─── Gate screens ─────────────────────────────────────────────────────────────

function BidsGate({ reason }: { reason: 'not_active' | 'no_engagement' }) {
  const isNotActive = reason === 'not_active'
  return (
    <div className="h-full flex items-center justify-center p-8 bg-[var(--os-surface-0)] overflow-y-auto">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-xl space-y-8 my-auto py-8"
      >
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24 group">
          <div
            className="relative w-full h-full rounded-[2rem] flex items-center justify-center shadow-sm backdrop-blur-md bg-white/60 dark:bg-black/40"
            style={{
              border: '1px solid rgba(37, 100, 234, 0.2)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4)'
            }}
          >
            <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3 px-4">
          <h2 className="text-3xl font-black text-[var(--os-text-1)] tracking-tight">
            Request a BIDS™ Assessment
          </h2>
          <p className="text-base leading-relaxed text-[var(--os-text-2)] max-w-lg mx-auto">
            {isNotActive
              ? 'Your BIDS™ diagnostic has not been activated yet. Request an assessment to have a Kangqore consultant configure your personalized engagement.'
              : 'No BIDS™ engagement has been configured for your account. Request an assessment to initiate the process with your consultant.'}
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #2564ea 0%, #06b6d4 100%)' }}
          >
            Request Diagnostic Assessment
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* What is BIDS™ - Premium Card */}
        <div
          className="rounded-2xl p-8 text-left mt-12 shadow-sm relative overflow-hidden transition-all duration-500 hover:shadow-xl bg-[var(--os-surface-0)] border border-[var(--os-border)] group/card"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-700 group-hover/card:bg-blue-500/10" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                What is BIDS™?
              </p>
            </div>
            
            <p className="text-sm leading-relaxed text-[var(--os-text-2)] mb-8">
              The Business Diagnostic Intelligence System™ is Kangqore's flagship enterprise assessment — 
              a powerful, WAANDA-driven diagnostic that generates actionable intelligence and a clear 
              Transformation Roadmap™. Every engagement closes with a measurable improvement baseline.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: '16', label: 'Pillars Analyzed' },
                { n: '6',  label: 'Core Engines' },
                { n: '10', label: 'Deliverables' },
              ].map((s, i) => (
                <div key={s.label} className="rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {s.n}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--os-text-2)] mt-2">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function BidsLoadingScreen() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#2564ea30] border-t-[#2564ea] rounded-full animate-spin mx-auto" />
        <p className="text-os-sm text-[#475569]">Loading your BIDS™ engagement…</p>
      </div>
    </div>
  )
}

function BidsStatusScreen({ status }: { status: string }) {
  const labels: Record<string, { icon: React.ReactNode; title: string; desc: string; color: string }> = {
    WAANDA_DRAFT: {
      icon:  <FileSearch className="w-8 h-8" />,
      title: 'WAANDA Diagnostic Complete',
      desc:  'Your preliminary diagnostic has been generated. A Kangqore consultant is now reviewing and refining your results.',
      color: '#4ab6d4',
    },
    CONSULTANT_REVIEW: {
      icon:  <FileSearch className="w-8 h-8" />,
      title: 'Under Consultant Review',
      desc:  'Your consultant is refining the WAANDA diagnostic. You\'ll be notified when your report is ready.',
      color: '#fdab3d',
    },
    ACTIVE: {
      icon:  <FileSearch className="w-8 h-8" />,
      title: 'Your Report is Ready',
      desc:  'Your BIDS™ Diagnostic Scorecard™ and deliverables are available in your portal.',
      color: '#00c875',
    },
    COMPLETED: {
      icon:  <FileSearch className="w-8 h-8" />,
      title: 'Engagement Complete',
      desc:  'Your BIDS™ engagement has been completed. All deliverables are available in your portal.',
      color: '#00c875',
    },
  }

  const info = labels[status] ?? {
    icon: <Clock className="w-8 h-8" />,
    title: 'Processing',
    desc: 'Your diagnostic is being processed.',
    color: '#64748b',
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center max-w-sm space-y-4"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: info.color + '18', border: `1px solid ${info.color}30`, color: info.color }}
        >
          {info.icon}
        </div>
        <div>
          <h2 className="text-os-lg font-black text-white">{info.title}</h2>
          <p className="text-os-sm text-[#64748b] mt-2">{info.desc}</p>
        </div>
      </motion.div>
    </div>
  )
}
