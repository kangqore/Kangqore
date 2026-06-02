import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { navGroups } from '@lib/nav'
import { useUIStore } from '@store/ui'
import { useKIMMPStore } from '@store/kimmp'

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const criticalCount = useKIMMPStore(s => s.criticalCount())

  return (
    <aside
      className={cn(
        'flex-shrink-0 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out h-full',
        sidebarCollapsed ? 'w-16' : 'w-[210px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 border-b border-slate-200 flex-shrink-0',
        sidebarCollapsed ? 'h-16 justify-center px-0' : 'h-16 px-5'
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>K</span>
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-slate-900 font-semibold text-sm leading-none" style={{ fontFamily: 'var(--font-display)' }}>Kangqore</p>
            <p className="text-slate-400 text-[11px] mt-0.5 font-medium">Operating System</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="px-4 mb-1.5 text-[9px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="mx-3 my-2 h-px bg-slate-100" />}
            <ul className="space-y-0.5 px-2">
              {group.items.map(item => {
                const Icon = item.icon
                const link = (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-xl transition-all duration-150 group relative',
                      sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'h-9 px-3',
                      isActive
                        ? 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="text-[13px] font-medium truncate flex-1">{item.label}</span>
                        {item.id === 'kimmp' && criticalCount > 0 && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                            {criticalCount}
                          </span>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && item.id === 'kimmp' && criticalCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {criticalCount}
                      </span>
                    )}
                  </NavLink>
                )

                return (
                  <li key={item.id}>
                    {sidebarCollapsed ? (
                      <Tooltip content={item.label} side="right">{link}</Tooltip>
                    ) : link}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 border-t border-slate-200 p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-xl h-9 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150',
            sidebarCollapsed ? 'justify-center' : 'px-3'
          )}
        >
          {sidebarCollapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <><PanelLeftClose className="w-4 h-4" /><span className="text-[13px] font-medium">Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}
