import { useLocation, useNavigate } from 'react-router-dom'
import { SidebarSimpleIcon } from '@phosphor-icons/react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { type RailEntry, RAIL_ITEMS, getActiveRailItem } from '@lib/nav'
import { useUIStore } from '@store/ui'

const HOME     = RAIL_ITEMS.find(i => i.id === 'home')!
const INTEL    = RAIL_ITEMS.filter(i => ['waanda','kimmp','keos','aegis','ontology','intelligence'].includes(i.id))
const BUSINESS = RAIL_ITEMS.filter(i => ['crm','core','operations'].includes(i.id))
const BOTTOM   = RAIL_ITEMS.find(i => i.id === 'settings')!

function RailBtn({ item, isActive, onClick }: { item: RailEntry; isActive: boolean; onClick: () => void }) {
  const Icon = item.icon
  return (
    <Tooltip content={item.label} side="right">
      <button
        onClick={onClick}
        aria-label={item.label}
        className={cn(
          'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 relative',
          isActive
            ? 'bg-gradient-to-r from-os-blue to-os-cyan text-white shadow-sm'
            : 'text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]'
        )}
      >
        <Icon weight={isActive ? 'fill' : 'regular'} className="w-[18px] h-[18px] flex-shrink-0" />
      </button>
    </Tooltip>
  )
}

function Divider() {
  return <div className="w-7 h-px bg-[var(--os-border)] my-1 mx-auto" />
}

export function Rail() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { sidebarCollapsed, setSidebarCollapsed, toggleSidebar } = useUIStore()
  const activeItem = getActiveRailItem(pathname)

  function handleClick(item: RailEntry) {
    navigate(item.defaultPath)
    // Expand the WorkspaceSidebar if it has content and is currently collapsed
    if (item.sidebarItems.length > 0 && sidebarCollapsed) {
      setSidebarCollapsed(false)
    }
  }

  return (
    <aside
      className="flex-shrink-0 flex flex-col w-14 h-full bg-[var(--os-sidebar-bg)] border-r border-[var(--os-border)]"
      style={{ zIndex: 40 }}
    >
      {/* Home */}
      <div className="flex flex-col items-center pt-3 pb-2 gap-1">
        <RailBtn item={HOME} isActive={activeItem?.id === 'home'} onClick={() => handleClick(HOME)} />
        <Divider />
      </div>

      {/* Scrollable middle */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center py-1 gap-0.5">
        {INTEL.map(item => (
          <RailBtn
            key={item.id}
            item={item}
            isActive={activeItem?.id === item.id}
            onClick={() => handleClick(item)}
          />
        ))}

        <Divider />

        {BUSINESS.map(item => (
          <RailBtn
            key={item.id}
            item={item}
            isActive={activeItem?.id === item.id}
            onClick={() => handleClick(item)}
          />
        ))}
      </nav>

      {/* Settings + Collapse */}
      <div className="flex flex-col items-center pt-2 pb-3 gap-1 border-t border-[var(--os-border)]">
        <RailBtn item={BOTTOM} isActive={activeItem?.id === 'settings'} onClick={() => handleClick(BOTTOM)} />

        <Tooltip content={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} side="right">
          <button
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)]"
          >
            <SidebarSimpleIcon
              weight="fill"
              className={cn(
                'w-[18px] h-[18px] transition-transform duration-300',
                sidebarCollapsed ? 'rotate-180' : ''
              )}
            />
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}
