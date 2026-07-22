import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AmbientBackground } from '@components/shell/AmbientBackground'
import { Topbar }            from '@components/shell/Topbar'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from '@components/shell/CommandPalette'
import { NotificationPanel } from '@components/shell/NotificationPanel'
import { Rail }             from '@components/shell/Rail'
import { staggerContainer, staggerChild } from '@os/motion'
import { DEPT_CONFIGS }      from './deptConfigs'
import {
  DesktopIcon, UsersThreeIcon, CoinsIcon, ShieldIcon,
  ScalesIcon, HeadsetIcon, BuildingsIcon, FactoryIcon,
  MegaphoneIcon, ChartLineUpIcon, HeartIcon, CompassIcon, CodeIcon, RocketLaunchIcon,
  GavelIcon, ShoppingBagIcon, ChartPieIcon, RobotIcon, FlaskIcon, GearSixIcon,
} from '@phosphor-icons/react'

const LIGHT_TOKENS: React.CSSProperties = {
  background:              'linear-gradient(160deg, #f0f4fc 0%, #eaeffa 50%, #f4f7fd 100%)',
  color:                   '#0f1117',
  '--os-bg'             :  '#f0f4fc',
  '--os-surface-0'      :  '#f8faff',
  '--os-surface-1'      :  '#ffffff',
  '--os-surface-2'      :  '#f0f4fd',
  '--os-surface-3'      :  '#e6ecf7',
  '--os-glass'          :  'rgba(255,255,255,0.85)',
  '--os-card'           :  '#ffffff',
  '--os-sidebar-bg'     :  '#ffffff',
  '--os-topbar-bg'      :  '#ffffff',
  '--os-topbar-border'  :  'rgba(37,100,234,0.12)',
  '--os-border'         :  'rgba(37,100,234,0.13)',
  '--os-border-subtle'  :  'rgba(37,100,234,0.07)',
  '--os-border-strong'  :  'rgba(37,100,234,0.24)',
  '--os-text-1'         :  '#0f1117',
  '--os-text-2'         :  '#3d4459',
  '--os-text-3'         :  '#7280a0',
  '--os-text-4'         :  '#a0aec0',
  '--os-shadow-sm'      :  '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(37,100,234,0.04)',
  '--os-shadow-md'      :  '0 4px 16px rgba(37,100,234,0.10), 0 1px 4px rgba(0,0,0,0.05)',
  '--os-shadow-lg'      :  '0 12px 40px rgba(37,100,234,0.14), 0 4px 8px rgba(0,0,0,0.06)',
  '--os-shadow-card'    :  '0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(37,100,234,0.09), 0 0 0 1px rgba(37,100,234,0.10)',
  '--os-shadow-glow'    :  '0 0 24px rgba(37,100,234,0.22)',
  '--os-blue-dim'       :  'rgba(37,100,234,0.09)',
  '--os-cyan-dim'       :  'rgba(74,182,212,0.09)',
} as React.CSSProperties

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
    <div className="flex flex-col h-screen overflow-hidden relative" style={LIGHT_TOKENS}>
      <AmbientBackground />
      {/* Volumetric background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden z-10">
        <Topbar />

        <div className="flex flex-1 min-h-0 relative z-10 w-full overflow-hidden">
          <Rail />

          <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-12">
            <motion.div
              variants={staggerContainer(0.07)}
              initial="hidden"
              animate="visible"
              className="w-full max-w-5xl mx-auto space-y-8"
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
                      className="os-card group relative flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl transition-all duration-200 text-center hover:-translate-y-1 cursor-pointer"
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = `${dept.accentColor}55`;
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px 0 ${dept.accentColor}18`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                        style={{ background: `${dept.accentColor}12`, border: `1px solid ${dept.accentColor}24` }}
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
      </div>

      <NotificationPanel />
      <Toaster />
      <CommandPalette />
    </div>
  )
}
