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
  TextOutdentIcon,
  TextIndentIcon,
} from '@phosphor-icons/react'
import { Briefcase, CheckSquare, Calendar, FileText, FolderOpen, Headphones } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { type RailEntry, RAIL_ITEMS, getActiveRailItem } from '@lib/nav'
import { useUIStore } from '@store/ui'

const HOME     = RAIL_ITEMS.find(i => i.id === 'home')!
const RECENT   = RAIL_ITEMS.find(i => i.id === 'recent')!
const INTEL    = RAIL_ITEMS.filter(i => ['waanda','kimmp','keos','aegis','ontology','relay','intelligence'].includes(i.id))
const BUSINESS = RAIL_ITEMS.filter(i => ['crm','core','operations'].includes(i.id))
const TOOLS    = RAIL_ITEMS.filter(i => ['files','applications'].includes(i.id))
const SUPPORT  = RAIL_ITEMS.find(i => i.id === 'support')!
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
  const { railExpanded } = useUIStore()

  const content = (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'h-10 flex items-center rounded-lg transition-all duration-150 relative cursor-pointer',
        railExpanded ? 'w-[calc(100%-16px)] mx-2 px-3 justify-start gap-3' : 'w-10 mx-auto justify-center',
        isActive
          ? 'bg-gradient-to-r from-os-blue to-os-cyan text-white shadow-sm'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      )}
    >
      <Icon weight={isActive ? 'fill' : 'regular'} className="w-[18px] h-[18px] flex-shrink-0" />
      {railExpanded && <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>}
    </button>
  )

  if (railExpanded) return content

  return (
    <Tooltip content={label} side="right">
      {content}
    </Tooltip>
  )
}

function Divider() {
  const { railExpanded } = useUIStore()
  return <div className={cn("h-px bg-white/10 my-1 mx-auto transition-all duration-300", railExpanded ? "w-[calc(100%-32px)]" : "w-7")} />
}

export function Rail() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { sidebarCollapsed, setSidebarCollapsed, toggleSidebar, pinnedRailId, setPinnedRailId, railExpanded, toggleRail } = useUIStore()
  const urlActiveItem = getActiveRailItem(pathname)
  const activeItem = pinnedRailId
    ? (RAIL_ITEMS.find(i => i.id === pinnedRailId) ?? urlActiveItem)
    : urlActiveItem

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
    setPinnedRailId(item.id)
    navigate(item.defaultPath)
    if (item.sidebarItems.length > 0 && sidebarCollapsed) {
      setSidebarCollapsed(false)
    }
  }

  return (
    <aside
      className={cn(
        "flex-shrink-0 flex flex-col h-full bg-[#323949] border-r border-[#323949] transition-all duration-300",
        railExpanded ? "w-64" : "w-14"
      )}
      style={{ zIndex: 40 }}
    >
      <div className="flex items-center justify-end px-2 pt-3 pb-1 h-[44px]">
        <button
          onClick={toggleRail}
          aria-label={railExpanded ? 'Collapse rail' : 'Expand rail'}
          className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
        >
          {railExpanded ? (
            <TextOutdentIcon weight="regular" className="w-[18px] h-[18px]" />
          ) : (
            <TextIndentIcon weight="regular" className="w-[18px] h-[18px]" />
          )}
        </button>
      </div>

      {/* Home */}
      <div className="flex flex-col items-center pb-2 gap-1">
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
          <>
            <RailBtn
              label={HOME.label}
              icon={HOME.icon}
              isActive={activeItem?.id === 'home'}
              onClick={() => handleClick(HOME)}
            />
            {RECENT && (
              <RailBtn
                label={RECENT.label}
                icon={RECENT.icon}
                isActive={activeItem?.id === 'recent'}
                onClick={() => handleClick(RECENT)}
              />
            )}
          </>
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
            {TOOLS.map(item => (
              <RailBtn
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeItem?.id === item.id}
                onClick={() => handleClick(item)}
              />
            ))}
            
            <Divider />

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
        {SUPPORT && (
          <RailBtn
            label={SUPPORT.label}
            icon={SUPPORT.icon}
            isActive={activeItem?.id === 'support'}
            onClick={() => handleClick(SUPPORT)}
          />
        )}
        <RailBtn
          label={BOTTOM.label}
          icon={BOTTOM.icon}
          isActive={isClientPortal ? pathname.startsWith('/kangqore-view/client/settings') : activeItem?.id === 'settings'}
          onClick={() => isClientPortal ? navigate('/kangqore-view/client/settings') : handleClick(BOTTOM)}
        />
      </div>
    </aside>
  )
}

