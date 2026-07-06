import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AmbientBackground } from '@components/shell/AmbientBackground'
import { Topbar }            from '@components/shell/Topbar'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from '@components/shell/CommandPalette'
import { NotificationPanel } from '@components/shell/NotificationPanel'
import { staggerContainer, staggerChild } from '@os/motion'
import { DEPT_CONFIGS }      from './deptConfigs'
import {
  DesktopIcon, UsersThreeIcon, CoinsIcon, ShieldIcon,
  ScalesIcon, HeadsetIcon, BuildingsIcon, FactoryIcon,
  MegaphoneIcon, ChartLineUpIcon, HeartIcon, CompassIcon, CodeIcon, RocketLaunchIcon,
  GavelIcon, ShoppingBagIcon, ChartPieIcon, RobotIcon, FlaskIcon, GearSixIcon,
} from '@phosphor-icons/react'

const DEPT_ICONS: Record<string, React.ComponentType<any>> = {
  it:                 DesktopIcon,
  hr:                 UsersThreeIcon,
  finance:            CoinsIcon,
  security:           ShieldIcon,
  legal:              ScalesIcon,
  support:            HeadsetIcon,
  facilities:         BuildingsIcon,
  'supply-chain':     FactoryIcon,
  marketing:          MegaphoneIcon,
  sales:              ChartLineUpIcon,
  'customer-success': HeartIcon,
  product:            CompassIcon,
  engineering:        CodeIcon,
  delivery:           RocketLaunchIcon,
  'risk-compliance':  GavelIcon,
  procurement:        ShoppingBagIcon,
  'data-analytics':   ChartPieIcon,
  'ai-automation':    RobotIcon,
  'innovation-rd':    FlaskIcon,
  operations:         GearSixIcon,
}

export function DepartmentSelector() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen bg-[#f5f6f8] relative text-[#323338] overflow-hidden vibrant-theme">
      <AmbientBackground />
      {/* Volumetric background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden z-10">
        <Topbar />

        <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            animate="visible"
            className="w-full max-w-3xl mx-auto space-y-8"
          >
            {/* Header */}
            <motion.div variants={staggerChild} className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black text-[var(--os-text-2)] uppercase tracking-[0.2em] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                Team Portal
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 drop-shadow-sm" style={{ fontFamily: 'var(--font-display)' }}>
                Select Your Department
              </h1>
            </motion.div>

            {/* Department Grid */}
            <motion.div
              variants={staggerContainer(0.04)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-4 md:grid-cols-7 gap-3"
            >
              {DEPT_CONFIGS.map(dept => {
                const Icon = DEPT_ICONS[dept.id] ?? DesktopIcon
                return (
                  <motion.button
                    key={dept.id}
                    variants={staggerChild}
                    onClick={() => navigate(dept.base)}
                    className="group relative flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border border-white/[0.06] bg-[#0d1326]/50 backdrop-blur-xl transition-all duration-200 text-center hover:-translate-y-1"
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${dept.accentColor}45`;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px 0 ${dept.accentColor}18`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `var(--os-surface-0)`;
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                      style={{ background: `${dept.accentColor}18`, border: `1px solid ${dept.accentColor}28` }}
                    >
                      <Icon weight="duotone" className="w-5 h-5" style={{ color: dept.accentColor }} />
                    </div>
                    <p className="text-[11px] font-semibold text-[var(--os-text-2)] group-hover:text-slate-900 transition-colors duration-200 leading-tight">{dept.label}</p>
                  </motion.button>
                )
              })}
            </motion.div>

            {/* Footer hint */}
            <motion.p variants={staggerChild} className="text-center text-xs text-[var(--os-text-2)]">
              Your department is determined by your profile — admins can access all workspaces.
            </motion.p>
          </motion.div>
        </main>
      </div>

      <NotificationPanel />
      <Toaster />
      <CommandPalette />
    </div>
  )
}
