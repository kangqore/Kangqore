import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import '../../os.css'
import { Rail }              from './Rail'
import { WorkspaceSidebar } from './WorkspaceSidebar'
import { Topbar }            from './Topbar'
import { NotificationPanel } from './NotificationPanel'
import { MobileNav }         from './MobileNav'
import { ModuleShell }       from '@components/ModuleShell'
import { PageTransition }    from '@components/animations/PageTransition'
import { Toaster }           from '@design-system/components/Toast'
import { CommandPalette }    from './CommandPalette'
import { AmbientBackground } from './AmbientBackground'
import { Surface }           from '@design-system/primitives/Surface'
import { useUIStore }        from '@store/ui'

// Only the WAANDA root (Arc HUD) is immersive — sub-routes use the normal shell
const WAANDA_ROOT = '/kangqore-view/admin/WAANDA'

// Inline fallback shown inside the content area while a lazy page module loads.
// Keeps the OS shell (Rail, Topbar, Sidebar) visible — the outer Suspense only
// fires during the very first OSLayout lazy load, not on every page transition.
function ContentLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="flex items-center gap-2 text-[var(--os-text-3)]">
        <div className="w-2 h-2 rounded-full bg-[var(--os-blue)] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[var(--os-blue)] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[var(--os-blue)] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

// Removed inline tokens in favor of the global CSS variable theme engine (os.css)

export function OSLayout() {
  const { pathname } = useLocation()
  const { autoHideTopbar } = useUIStore()
  const [isTopbarVisible, setIsTopbarVisible] = React.useState(false)

  React.useEffect(() => {
    if (!autoHideTopbar) return
    const handleMouseMove = (e: MouseEvent) => {
      // Show if mouse is in top 30px, or if it's already visible and mouse is over it (top 60px)
      if (e.clientY <= 30 || (isTopbarVisible && e.clientY <= 60)) {
        setIsTopbarVisible(true)
      } else {
        setIsTopbarVisible(false)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [autoHideTopbar, isTopbarVisible])

  const isWaandaGUI      = pathname === WAANDA_ROOT || pathname === `${WAANDA_ROOT}/`
  const isWaandaSubroute = !isWaandaGUI && pathname.startsWith(`${WAANDA_ROOT}/`)
  const isRelay          = pathname.includes('/relay')
  const isUrgi           = pathname.includes('/kangqore-urgi')

  return (
    <Surface variant="canvas" className="flex flex-col h-screen overflow-hidden relative text-text-primary">
      {!isWaandaGUI && <AmbientBackground />}
      
      {/* Global Topbar - full width */}
      {!isWaandaGUI && (
        <div 
          className={`flex-shrink-0 z-[100] w-full transition-transform duration-300 ease-in-out ${
            autoHideTopbar ? 'absolute top-0 left-0' : 'relative'
          }`}
          style={{
            transform: autoHideTopbar && !isTopbarVisible ? 'translateY(-100%)' : 'translateY(0)'
          }}
        >
          <Topbar />
        </div>
      )}

      {/* Main Body Row */}
      <div className="flex flex-1 min-h-0 relative z-10 w-full overflow-hidden">
        {/* macOS Full-Height Sidebar Layer */}
        {!isWaandaGUI && (
          <div 
            className="hidden md:flex z-20 relative transition-all duration-300 ease-in-out"
            style={{ 
              marginTop: autoHideTopbar && isTopbarVisible ? '60px' : '0px',
              height: autoHideTopbar && isTopbarVisible ? 'calc(100% - 60px)' : '100%' 
            }}
          >
            <Rail />
          </div>
        )}
        {!isWaandaGUI && (
          <div 
            className="z-20 relative transition-all duration-300 ease-in-out"
            style={{ 
              marginTop: autoHideTopbar && isTopbarVisible ? '60px' : '0px',
              height: autoHideTopbar && isTopbarVisible ? 'calc(100% - 60px)' : '100%' 
            }}
          >
            <WorkspaceSidebar />
          </div>
        )}

        {/* macOS Content Column */}
        <div className="flex flex-col flex-1 min-w-0 relative z-10 h-full overflow-hidden">
          
          <div className={`flex flex-col flex-1 min-w-0 overflow-hidden m-0 z-10 os-main-content${isWaandaGUI ? ' bg-black' : ' bg-surface-primary shadow-os-sm rounded-tl-os-md md:rounded-none'}${!isWaandaGUI ? ' pb-[56px] md:pb-0' : ''}`}>
            {isWaandaGUI ? (
              <main className="flex-1 overflow-y-auto overflow-x-hidden m-0 rounded-none border-none">
                <ModuleShell>
                  <Suspense fallback={<ContentLoader />}><Outlet /></Suspense>
                </ModuleShell>
              </main>
          ) : isWaandaSubroute ? (
            <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
              <ModuleShell>
                <Suspense fallback={<ContentLoader />}><Outlet /></Suspense>
              </ModuleShell>
            </main>
          ) : isUrgi ? (
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <ModuleShell>
                <Suspense fallback={<ContentLoader />}><Outlet /></Suspense>
              </ModuleShell>
            </div>
          ) : isRelay ? (
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <ModuleShell>
                <Suspense fallback={<ContentLoader />}><Outlet /></Suspense>
              </ModuleShell>
            </div>
          ) : (
            <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 pb-16">
              <PageTransition>
                <ModuleShell>
                  <Suspense fallback={<ContentLoader />}><Outlet /></Suspense>
                </ModuleShell>
              </PageTransition>
            </main>
          )}
        </div>
      </div>
      {/* End Main Body Row */}
      </div>

      {!isWaandaGUI && <MobileNav />}
      <NotificationPanel />
      <Toaster />
      <CommandPalette />
    </Surface>
  )
}

