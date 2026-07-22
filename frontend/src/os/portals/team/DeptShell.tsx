import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Topbar }           from '@components/shell/Topbar'
import { NotificationPanel } from '@components/shell/NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { AmbientBackground } from '@components/shell/AmbientBackground'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from '@components/shell/CommandPalette'
import { Rail }             from '@components/shell/Rail'
import { DeptSidebar }       from './DeptSidebar'
import type { DeptConfig }   from './deptConfigs'
import RelayPage from '@features/relay/pages/RelayPage'

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

interface DeptShellProps {
  config:   DeptConfig
  children: ReactNode
}

export function DeptShell({ config, children }: DeptShellProps) {
  const { pathname } = useLocation()
  const isRelay = pathname.includes('/relay')

  const mergedStyles = {
    ...LIGHT_TOKENS,
    '--dept-accent': config.accentColor,
  } as React.CSSProperties

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative dept-shell"
      style={mergedStyles}
    >
      <AmbientBackground />

      <Topbar config={config} />

      <div className="flex flex-1 min-h-0 relative z-10 w-full overflow-hidden">
        <Rail />
        <DeptSidebar config={config} />

        <div className="os-main-content flex flex-col flex-1 min-w-0 overflow-hidden m-0 md:my-2 md:mr-2 md:rounded-2xl z-10">
        {isRelay ? (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <RelayPage />
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
            <PageTransition>
              <ModuleShell>
                {children}
              </ModuleShell>
            </PageTransition>
          </main>
        )}
      </div>
      </div>

      <NotificationPanel />
      <Toaster />
      <CommandPalette />
    </div>
  )
}
