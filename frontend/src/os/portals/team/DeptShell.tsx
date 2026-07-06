import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Topbar }           from '@components/shell/Topbar'
import { NotificationPanel } from '@components/shell/NotificationPanel'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { AmbientBackground } from '@components/shell/AmbientBackground'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from '@components/shell/CommandPalette'
import { DeptSidebar }       from './DeptSidebar'
import type { DeptConfig }   from './deptConfigs'
import RelayPage from '@features/relay/pages/RelayPage'

interface DeptShellProps {
  config:   DeptConfig
  children: ReactNode
}

export function DeptShell({ config, children }: DeptShellProps) {
  const { pathname } = useLocation()
  const isRelay = pathname.includes('/relay')

  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative dept-shell"
      style={{ '--dept-accent': config.accentColor, background: 'var(--os-bg)', color: 'var(--os-text-1)' } as any}
    >
      <AmbientBackground />

      <Topbar config={config} />

      <div className="flex flex-1 min-h-0 relative z-10 w-full overflow-hidden">
        <DeptSidebar config={config} />

        <div className="os-main-content flex flex-col flex-1 min-w-0 overflow-hidden m-0 md:mb-2 md:mr-2 md:rounded-2xl z-10">
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
