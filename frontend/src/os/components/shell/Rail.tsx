import { useLocation, useNavigate } from 'react-router-dom'
import {
  SidebarSimpleIcon,
  HouseIcon,
  CalendarCheckIcon,
  ChatCircleDotsIcon,
  MegaphoneIcon,
  BookOpenIcon,
  UsersIcon,
  BrainIcon,
} from '@phosphor-icons/react'
import { Briefcase, CheckSquare, Calendar, FileText, FolderOpen, Headphones } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { type RailEntry, RAIL_ITEMS, getActiveRailItem } from '@lib/nav'
import { useUIStore } from '@store/ui'

const HOME     = RAIL_ITEMS.find(i => i.id === 'home')!
const INTEL    = RAIL_ITEMS.filter(i => ['waanda','kimmp','keos','aegis','ontology','neural-network','relay','intelligence'].includes(i.id))
const BUSINESS = RAIL_ITEMS.filter(i => ['crm','core','operations'].includes(i.id))
const BOTTOM   = RAIL_ITEMS.find(i => i.id === 'settings')!

const VALID_DEPTS = [
  'it', 'hr', 'finance', 'security', 'legal', 'support', 'facilities',
  'supply-chain', 'marketing', 'sales', 'customer-success', 'product',
  'engineering', 'delivery', 'risk-compliance', 'procurement', 'data-analytics',
  'ai-automation', 'innovation-rd', 'operations'
]

function RailBtn({
  label,
  icon: Icon,
  isActive,
  onClick
}: {
  label: string
  icon: React.ComponentType<any>
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Tooltip content={label} side="right">
      <button
        onClick={onClick}
        aria-label={label}
        className={cn(
          'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 relative cursor-pointer',
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

  const isTeamPortal = pathname.startsWith('/kangqore-view/team')
  const isClientPortal = pathname.startsWith('/kangqore-view/client')

  // Parse department from URL so Rail items route contextually within the active department workspace
  const match = pathname.match(/^\/kangqore-view\/team\/([^/]+)/)
  const deptFromUrl = match ? match[1] : 'it'
  const currentDept = VALID_DEPTS.includes(deptFromUrl) ? deptFromUrl : 'it'

  const teamItems = [
    {
      id: 'team-tasks',
      label: 'My Tasks',
      icon: CalendarCheckIcon,
      path: `/kangqore-view/team/${currentDept}/my-work`,
    },
    {
      id: 'team-relay',
      label: 'RELAY Chat',
      icon: ChatCircleDotsIcon,
      path: `/kangqore-view/team/${currentDept}/relay`,
    },
    {
      id: 'team-announcements',
      label: 'Announcements',
      icon: MegaphoneIcon,
      path: `/kangqore-view/team/${currentDept}/announcements`,
    },
    {
      id: 'team-resources',
      label: 'Resources',
      icon: BookOpenIcon,
      path: `/kangqore-view/team/${currentDept}/resources`,
    },
    {
      id: 'team-members',
      label: 'Team Directory',
      icon: UsersIcon,
      path: `/kangqore-view/team/${currentDept}/members`,
    },
    {
      id: 'team-kimmp',
      label: 'KIMMP Brief',
      icon: BrainIcon,
      path: `/kangqore-view/team/${currentDept}/kimmp`,
    },
  ]

  const clientItems = [
    {
      id: 'client-projects',
      label: 'Projects',
      icon: Briefcase,
      path: `/kangqore-view/client/projects`,
    },
    {
      id: 'client-tasks',
      label: 'Tasks',
      icon: CheckSquare,
      path: `/kangqore-view/client/tasks`,
    },
    {
      id: 'client-meetings',
      label: 'Meetings',
      icon: Calendar,
      path: `/kangqore-view/client/meetings`,
    },
    {
      id: 'client-invoices',
      label: 'Invoices',
      icon: FileText,
      path: `/kangqore-view/client/invoices`,
    },
    {
      id: 'client-documents',
      label: 'Documents',
      icon: FolderOpen,
      path: `/kangqore-view/client/documents`,
    },
    {
      id: 'client-waanda',
      label: 'Ask WAANDA',
      icon: BrainIcon,
      path: `/kangqore-view/client/waanda`,
    },
    {
      id: 'client-support',
      label: 'Support Tickets',
      icon: Headphones,
      path: `/kangqore-view/client/support`,
    },
  ]

  const isPortalItemActive = (itemPath: string) => {
    if (pathname === itemPath) return true
    const suffix = itemPath.split('/').pop()
    return pathname.endsWith(`/${suffix}`)
  }

  function handleClick(item: RailEntry) {
    navigate(item.defaultPath)
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
        {isTeamPortal ? (
          <RailBtn
            label="Portal Home"
            icon={HouseIcon}
            isActive={pathname === '/kangqore-view/team' || pathname === '/kangqore-view/team/'}
            onClick={() => navigate('/kangqore-view/team')}
          />
        ) : isClientPortal ? (
          <RailBtn
            label="Client Home"
            icon={HouseIcon}
            isActive={pathname === '/kangqore-view/client' || pathname === '/kangqore-view/client/'}
            onClick={() => navigate('/kangqore-view/client')}
          />
        ) : (
          <RailBtn
            label={HOME.label}
            icon={HOME.icon}
            isActive={activeItem?.id === 'home'}
            onClick={() => handleClick(HOME)}
          />
        )}
        <Divider />
      </div>

      {/* Scrollable middle */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center py-1 gap-0.5">
        {isTeamPortal ? (
          teamItems.map(item => (
            <RailBtn
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={isPortalItemActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))
        ) : isClientPortal ? (
          clientItems.map(item => (
            <RailBtn
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={isPortalItemActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))
        ) : (
          <>
            {INTEL.map(item => (
              <RailBtn
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeItem?.id === item.id}
                onClick={() => handleClick(item)}
              />
            ))}

            <Divider />

            {BUSINESS.map(item => (
              <RailBtn
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeItem?.id === item.id}
                onClick={() => handleClick(item)}
              />
            ))}
          </>
        )}
      </nav>

      {/* Settings + Collapse */}
      <div className="flex flex-col items-center pt-2 pb-3 gap-1 border-t border-[var(--os-border)]">
        <RailBtn
          label={BOTTOM.label}
          icon={BOTTOM.icon}
          isActive={isClientPortal ? pathname.startsWith('/kangqore-view/client/settings') : activeItem?.id === 'settings'}
          onClick={() => isClientPortal ? navigate('/kangqore-view/client/settings') : handleClick(BOTTOM)}
        />

        <Tooltip content={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} side="right">
          <button
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 text-[var(--os-text-2)] hover:bg-slate-200/50 dark:hover:bg-white/[0.04] hover:text-[var(--os-text-1)] cursor-pointer"
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

