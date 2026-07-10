import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import '../../os.css'
import { Sidebar }           from './Sidebar'
import { Topbar }            from './Topbar'
import { NotificationPanel } from './NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from './CommandPalette'
import { AmbientBackground } from './AmbientBackground'

// Only the WAANDA root (Arc HUD) is immersive — sub-routes use the normal shell
const WAANDA_ROOT = '/kangqore-view/admin/WAANDA'

// Light-mode token overrides for the admin — applied as inline style so they
// cascade to all descendants via CSS custom property inheritance, overriding
// the dark defaults declared in os.css :root.
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

const WAANDA_TOKENS: React.CSSProperties = {
  background: '#000000',
  color:      '#e2e8f0',
}

export function OSLayout() {
  const { pathname } = useLocation()
  const isWaandaGUI      = pathname === WAANDA_ROOT || pathname === `${WAANDA_ROOT}/`
  const isWaandaSubroute = !isWaandaGUI && pathname.startsWith(`${WAANDA_ROOT}/`)
  const isRelay          = pathname.includes('/relay')
  const isNeuralNetwork  = pathname.includes('/neural-network')
  const isUrgi           = pathname.includes('/kangqore-urgi')

  const rootStyle = isWaandaGUI ? WAANDA_TOKENS : LIGHT_TOKENS

  return (
    <div className="flex flex-col h-screen overflow-hidden relative" style={rootStyle}>
      {!isWaandaGUI && <AmbientBackground />}
      {!isWaandaGUI && <Topbar />}
      <div className="flex flex-1 min-h-0 relative z-10 w-full overflow-hidden">
        {!isWaandaGUI && <Sidebar />}

        <div className={`flex flex-col flex-1 min-w-0 overflow-hidden m-0 z-10 os-main-content${isWaandaGUI ? ' !bg-black' : (isNeuralNetwork ? ' !bg-black !m-0 md:!my-0 md:!mr-0 md:!rounded-none' : ' md:my-2 md:mr-2 md:rounded-2xl')}`}>
          {isWaandaGUI ? (
            <main className="flex-1 overflow-y-auto overflow-x-hidden !bg-black !m-0 !rounded-none !border-none">
              <ModuleShell>
                <Outlet />
              </ModuleShell>
            </main>
          ) : isWaandaSubroute ? (
            <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
              <ModuleShell>
                <Outlet />
              </ModuleShell>
            </main>
          ) : isUrgi ? (
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <ModuleShell>
                <Outlet />
              </ModuleShell>
            </div>
          ) : isNeuralNetwork ? (
            <main className="flex-1 overflow-hidden m-0 p-0 bg-black relative">
              <ModuleShell>
                <Outlet />
              </ModuleShell>
            </main>
          ) : isRelay ? (
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <ModuleShell>
                <Outlet />
              </ModuleShell>
            </div>
          ) : (
            <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
              <PageTransition>
                <ModuleShell>
                  <Outlet />
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
