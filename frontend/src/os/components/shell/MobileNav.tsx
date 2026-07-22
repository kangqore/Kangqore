import { useLocation, useNavigate } from 'react-router-dom'
import {
  HouseIcon, BrainIcon, CompassIcon, CpuIcon, GearIcon,
} from '@phosphor-icons/react'
import { cn } from '@design-system/cn'

const BASE = '/kangqore-view/admin'

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     icon: HouseIcon,   path: `${BASE.replace('/admin', '')}/home` },
  { id: 'kimmp',   label: 'KIMMP',    icon: BrainIcon,   path: `${BASE}/kangqore-immp` },
  { id: 'waanda',  label: 'WAANDA',   icon: CompassIcon, path: `${BASE}/WAANDA` },
  { id: 'keos',    label: 'KEOS',     icon: CpuIcon,     path: `${BASE.replace('/admin', '')}/keos` },
  { id: 'settings', label: 'Settings', icon: GearIcon,   path: `${BASE}/settings` },
]

export function MobileNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="md:hidden flex-shrink-0"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--os-sidebar-bg)',
        borderTop: '1px solid var(--os-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'flex',
      }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.path || pathname.startsWith(item.path + '/')
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            style={{ flex: 1, height: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, border: 'none', background: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            className={cn(
              'transition-colors duration-150',
              isActive ? 'text-[var(--os-blue)]' : 'text-[var(--os-text-3)]',
            )}
          >
            <item.icon
              weight={isActive ? 'fill' : 'regular'}
              style={{ width: 20, height: 20, flexShrink: 0 }}
            />
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, letterSpacing: '0.04em', lineHeight: 1 }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2, borderRadius: '0 0 2px 2px', background: 'var(--os-blue)' }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
