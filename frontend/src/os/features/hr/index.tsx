import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Users, Briefcase, Star, Brain, AlertTriangle } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { HiringPipeline }     from './pages/HiringPipeline'
import { OnboardingTracker }  from './pages/OnboardingTracker'
import { PerformanceReviews } from './pages/PerformanceReviews'
import { useHRProjection }    from './useHRProjection'

const TABS = [
  { path: '',              label: 'Hiring',      icon: Briefcase },
  { path: 'onboarding',   label: 'Onboarding',  icon: Users     },
  { path: 'performance',  label: 'Performance', icon: Star      },
]

// ── Gen III: WAANDA People Intelligence banner ────────────────────────────────
function WANDAHRIntelligence() {
  const model = useHRProjection()
  if (!model || model.confidence < 0.1) return null

  const payload      = model.payload as Record<string, any>
  const phase        = model.cognitivePhase
  const hiringSignal = payload.hiringSignal as string | null
  const teamSize     = (payload.activeTeamSize ?? 0) as number
  const atRisk       = (payload.atRiskProjectCount ?? 0) as number
  const synthesis    = payload.kimmSynthesis as string | null

  const PHASE_COLOR: Record<string, string> = {
    OBSERVE: '#3b82f6', UNDERSTAND: '#7c3aed', DECIDE: '#f59e0b',
    ACT: '#10b981', LEARN: '#0d9488',
  }
  const col     = PHASE_COLOR[phase] ?? '#f59e0b'
  const insight = hiringSignal ?? synthesis?.slice(0, 120) ?? null

  if (!insight && teamSize === 0) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 14px', marginBottom: 10,
      background: col + '08', border: `1px solid ${col}20`, borderRadius: 8,
    }}>
      <Brain size={12} style={{ color: col, flexShrink: 0 }} />
      <span style={{
        fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em',
        color: col, background: col + '15', padding: '2px 7px', borderRadius: 4, flexShrink: 0,
      }}>
        WAANDA · {phase}
      </span>
      {insight && (
        <span style={{ fontSize: 11, color: 'var(--os-text-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {insight}{insight.length >= 120 ? '…' : ''}
        </span>
      )}
      {teamSize > 0 && (
        <span style={{ fontSize: 10, fontWeight: 700, color: col, background: col + '12', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
          {teamSize} active leads
        </span>
      )}
      {atRisk > 0 && (
        <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: '#f59e0b10', border: '1px solid #f59e0b25', padding: '2px 8px', borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertTriangle size={9} /> {atRisk} capacity gap
        </span>
      )}
    </div>
  )
}

export function HRModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <WANDAHRIntelligence />
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--os-border)', marginBottom: 24, marginTop: -8, overflowX: 'auto' }}>
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/hr' : `/kangqore-view/admin/hr/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
              isActive
                ? 'border-[#579bfc] text-[#579bfc]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, ease: 'easeOut' }}>
          <Routes>
            <Route index              element={<HiringPipeline />}    />
            <Route path="onboarding"  element={<OnboardingTracker />} />
            <Route path="performance" element={<PerformanceReviews />} />
            <Route path="*"           element={<Navigate to="/kangqore-view/admin/hr" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
