import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@design-system/cn'
import { Tooltip } from '@design-system/components/Tooltip'
import { navGroups } from '@lib/nav'
import { useUIStore } from '@store/ui'

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen z-40 flex flex-col bg-[#0f1117] border-r border-[#1e2130] transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-16' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 border-b border-[#1e2130] flex-shrink-0',
        sidebarCollapsed ? 'h-16 justify-center px-0' : 'h-16 px-5'
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">K</span>
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm leading-none">Kangqore</p>
            <p className="text-slate-500 text-[11px] mt-0.5">OS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="px-5 mb-1 text-[10px] font-semibold tracking-widest text-slate-600">
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="mx-3 my-1 h-px bg-[#1e2130]" />}
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
                        ? 'bg-purple-950/60 text-white before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-0.5 before:rounded-r before:bg-purple-500'
                        : 'text-slate-400 hover:bg-[#1a1d26] hover:text-slate-200'
                    )}
                  >
                    <Icon className={cn('flex-shrink-0 transition-transform group-hover:scale-105', sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium truncate">{item.label}</span>
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
      <div className="flex-shrink-0 border-t border-[#1e2130] p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2.5 w-full rounded-xl h-9 text-slate-500 hover:text-slate-300 hover:bg-[#1a1d26] transition-all duration-150',
            sidebarCollapsed ? 'justify-center' : 'px-3'
          )}
        >
          {sidebarCollapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <><PanelLeftClose className="w-4 h-4" /><span className="text-sm">Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}
